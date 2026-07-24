import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useGetGrants } from "../helpers/APIService";
import {
  fetchAllGrantApplications,
  filterApplications,
  subscribeLoadProgress,
} from "../helpers/gappDataService";
import { Filter } from "../types/Filter";
import IGrant from "../types/IGrant";
import IGrantApplication from "../types/IGrantApplication";
import updateSpatialData from "../helpers/updateSpatialData";
import { MapLayer } from "../types/MapLayer";
import { fiscalYearOfApplication } from "../helpers/fiscalYear";

interface UIState {
  drawerOpen?: boolean;
}

interface MapState {
  latitude: number;
  longitude: number;
  zoom: number;
}

interface AppContext {
  uiState: UIState;
  setUiState: Dispatch<SetStateAction<UIState>>;
  mapState: MapState;
  setMapState: Dispatch<SetStateAction<MapState>>;
  layers: MapLayer[];
  dimensions: any[];
  summary: Record<string, any>;
  /** Applications on the map: filters + fiscal-year scope (derived in memory). */
  applications: IGrantApplication[];
  /** Every application the account can see, unfiltered — feeds the metrics. */
  allApplications: IGrantApplication[];
  /** allApplications scoped by fiscal year + geography/type filters (not status). */
  reportApplications: IGrantApplication[];
  grant: IGrant | null;
  fiscalYear: number | null;
  setFiscalYear: Dispatch<SetStateAction<number | null>>;
  fyOptions: number[];
  selectedApplicationIndex: number;
  setSelectedApplicationIndex: Dispatch<SetStateAction<number>>;
  filters: Filter[];
  setFilters: Dispatch<SetStateAction<Filter[]>>;
  insightsOpen: boolean;
  setInsightsOpen: Dispatch<SetStateAction<boolean>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeLayer: MapLayer | null;
  setActiveLayer: React.Dispatch<React.SetStateAction<MapLayer | null>>;
  selectedRegions: string[];
  setSelectedRegions: React.Dispatch<React.SetStateAction<string[]>>;
  /** Initial bulk-download progress, 0-100. */
  loadProgress: number;
  /** True once the session dataset (applications + grant) has settled. */
  dataLoaded: boolean;
}

const initialUiState: UIState = {
  drawerOpen: false,
};

const initialMapState =
  localStorage.getItem("mapState") ??
  `{
    "longitude": ${parseFloat(import.meta.env.VITE_CENTER_LNG)},
    "latitude": ${parseFloat(import.meta.env.VITE_CENTER_LAT)},
    "zoom": 6
}`;

const initialFilter: Filter[] = [
  {
    key: "status",
    value: [3, 6, 8, 12, 13, 14],
  },
];

const initialContext: AppContext = {
  uiState: initialUiState,
  setUiState: () => {},
  mapState: JSON.parse(initialMapState),
  setMapState: () => {},
  applications: [],
  allApplications: [],
  reportApplications: [],
  grant: null,
  fiscalYear: null,
  setFiscalYear: () => {},
  fyOptions: [],
  selectedApplicationIndex: -1,
  setSelectedApplicationIndex: () => {},
  filters: [],
  setFilters: () => {},
  layers: [],
  dimensions: [],
  summary: {},
  insightsOpen: false,
  setInsightsOpen: () => {},
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
  activeLayer: null,
  setActiveLayer: () => {},
  selectedRegions: [],
  setSelectedRegions: () => {},
  loadProgress: 0,
  dataLoaded: false,
};

const AppContext = createContext(initialContext);

export const useAppContext = () => useContext(AppContext);

/** Geography/type filters the reporting panel honors (status is a lifecycle
 * dimension the report enumerates itself, so it is deliberately excluded). */
const matchesScopeFilters = (
  app: IGrantApplication,
  filters: Filter[]
): boolean => {
  for (const filter of filters) {
    const values = Array.isArray(filter.value)
      ? filter.value.map(String)
      : [String(filter.value)];
    if (!values.length) continue;

    if (filter.key === "county") {
      if (!values.includes(app.county?.trim() ?? "")) return false;
    } else if (filter.key === "drinking_or_wastewater") {
      if (!values.includes(app.drinking_or_wastewater)) return false;
    } else if (filter.key === "approved_projects") {
      const ids = (app.approved_projects ?? []).map((p) => String(p.id));
      if (!values.some((v) => ids.includes(v))) return false;
    }
  }
  return true;
};

const AppContextProvider = ({ children }: PropsWithChildren) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [uiState, setUiState] = useState<UIState>(initialUiState);
  const [mapState, setMapState] = useState<MapState>(
    JSON.parse(initialMapState)
  );
  const [selectedApplicationIndex, setSelectedApplicationIndex] =
    useState<number>(-1);
  const [allApplications, setAllApplications] = useState<IGrantApplication[]>(
    []
  );
  const [grant, setGrant] = useState<IGrant | null>(null);
  const [fiscalYear, setFiscalYear] = useState<number | null>(null);
  const [filters, setFilters] = useState<Filter[]>(initialFilter);
  const [insightsOpen, setInsightsOpen] = useState<boolean>(
    window.innerWidth >= 1280
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [activeLayer, setActiveLayer] = useState<MapLayer | null>(null);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);

  const getGrants = useGetGrants();

  // ONE bulk fetch per session feeds everything: the map (filtered in memory
  // below), the financial reporting (lifecycle stages need every status, and
  // the FY rollover chain needs every fiscal year), and the toolbar counts
  // (via gappDataService). Filter changes no longer refetch from Strapi.
  useEffect(() => {
    if (!localStorage.getItem("jwt")) {
      // Not authenticated: nothing to download, the login modal owns the screen.
      setLoadProgress(100);
      setDataLoaded(true);
      return;
    }
    // Download progress drives the loading overlay (capped below 100 until
    // the payload has also been parsed and applied).
    const unsubscribe = subscribeLoadProgress((fraction) =>
      setLoadProgress((prev) => Math.max(prev, Math.round(fraction * 95)))
    );
    Promise.all([
      fetchAllGrantApplications().then(setAllApplications),
      getGrants().then(setGrant),
    ])
      .catch((error) => console.error("Initial data load failed:", error))
      .finally(() => {
        setLoadProgress(100);
        setDataLoaded(true);
      });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // In-memory equivalent of the server-side filter query the map used to
  // re-issue on every filter change.
  const serverApplications = useMemo(() => {
    const statusFilter = filters.find((filter) => filter.key === "status");
    const isStatusFilterEmpty =
      statusFilter &&
      Array.isArray(statusFilter.value) &&
      statusFilter.value.length === 0;

    const effectiveFilters =
      (filters.length === 0 || isStatusFilterEmpty) &&
      user.email === "rig@orwa.org"
        ? [{ key: "status", value: [3, 6, 8, 12, 13, 14] }]
        : filters;

    let result = filterApplications(allApplications, effectiveFilters);

    if (selectedRegions.length > 0 && activeLayer) {
      result = result.filter(
        (application) =>
          application.regions != null &&
          selectedRegions.includes(application.regions[activeLayer.title])
      );
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allApplications, filters, selectedRegions, activeLayer]);

  useEffect(() => {
    if (serverApplications.length > 0) {
      updateSpatialData(serverApplications);
    }
  }, [serverApplications]);

  const fyOptions = useMemo(() => {
    const years = new Set<number>();
    for (const app of allApplications) {
      const fy = fiscalYearOfApplication(app);
      if (fy != null) years.add(fy);
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [allApplications]);

  // The map shows the server-filtered set, additionally scoped to the
  // selected fiscal year so the map and the report always agree.
  const applications = useMemo(
    () =>
      fiscalYear == null
        ? serverApplications
        : serverApplications.filter(
            (app) => fiscalYearOfApplication(app) === fiscalYear
          ),
    [serverApplications, fiscalYear]
  );

  const reportApplications = useMemo(() => {
    let scoped = allApplications.filter((app) =>
      matchesScopeFilters(app, filters)
    );
    if (fiscalYear != null) {
      scoped = scoped.filter(
        (app) => fiscalYearOfApplication(app) === fiscalYear
      );
    }
    if (selectedRegions.length > 0 && activeLayer) {
      scoped = scoped.filter(
        (app) =>
          app.regions != null &&
          selectedRegions.includes(app.regions[activeLayer.title])
      );
    }
    return scoped;
  }, [allApplications, filters, fiscalYear, selectedRegions, activeLayer]);

  return (
    <AppContext.Provider
      value={{
        applications,
        allApplications,
        reportApplications,
        grant,
        fiscalYear,
        setFiscalYear,
        fyOptions,
        uiState,
        mapState,
        setUiState,
        setMapState,
        selectedApplicationIndex,
        setSelectedApplicationIndex,
        filters,
        setFilters,
        insightsOpen,
        setInsightsOpen,
        layers: [],
        dimensions: [],
        summary: {},
        isSidebarOpen,
        setIsSidebarOpen,
        activeLayer,
        setActiveLayer,
        selectedRegions,
        setSelectedRegions,
        loadProgress,
        dataLoaded,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
