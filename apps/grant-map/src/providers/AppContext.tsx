import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useGetGrantApplications } from "../helpers/APIService";
import { Filter } from "../types/Filter";
import IGrantApplication from "../types/IGrantApplication";
import updateSpatialData from "../helpers/updateSpatialData";
import { MapLayer } from "../types/MapLayer";

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
  applications: IGrantApplication[];
  setApplications: Dispatch<SetStateAction<IGrantApplication[]>>;
  selectedApplicationIndex: number;
  setSelectedApplicationIndex: Dispatch<SetStateAction<number>>;
  filters: Filter[];
  setFilters: Dispatch<SetStateAction<Filter[]>>;
  openStatistics: boolean;
  setOpenStatistics: Dispatch<SetStateAction<boolean>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeLayer: MapLayer | null;
  setActiveLayer: React.Dispatch<React.SetStateAction<MapLayer | null>>;
  selectedRegions: string[];
  setSelectedRegions: React.Dispatch<React.SetStateAction<string[]>>;
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
  setApplications: () => {},
  selectedApplicationIndex: -1,
  setSelectedApplicationIndex: () => {},
  filters: [],
  setFilters: () => {},
  layers: [],
  dimensions: [],
  summary: {},
  openStatistics: false,
  setOpenStatistics: () => {},
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
  activeLayer: null,
  setActiveLayer: () => {},
  selectedRegions: [],
  setSelectedRegions: () => {},
};

const AppContext = createContext(initialContext);

export const useAppContext = () => useContext(AppContext);

const AppContextProvider = ({ children }: PropsWithChildren) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [uiState, setUiState] = useState<UIState>(initialUiState);
  const [mapState, setMapState] = useState<MapState>(
    JSON.parse(initialMapState)
  );
  const [selectedApplicationIndex, setSelectedApplicationIndex] =
    useState<number>(-1);
  const [applications, setApplications] = useState<IGrantApplication[]>([]);
  const [filters, setFilters] = useState<Filter[]>(initialFilter);
  const [openStatistics, setOpenStatistics] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [activeLayer, setActiveLayer] = useState<MapLayer | null>(null); // Initialize with a default layer
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const getGrantApplications = useGetGrantApplications();

  useEffect(() => {
    // Fetch grant applications every xtime the filters change
    // Find the status filter
    const statusFilter = filters.find((filter) => filter.key === "status");

    // Check if the status filter exists and if its value array is empty
    const isStatusFilterEmpty =
      statusFilter &&
      Array.isArray(statusFilter.value) &&
      statusFilter.value.length === 0;

    if (selectedRegions.length === 0) {
      getGrantApplications(
        (filters.length === 0 || isStatusFilterEmpty) &&
          user.email === "rig@orwa.org"
          ? [
              {
                key: "status",
                value: [3, 6, 8, 12, 13, 14],
              },
            ]
          : filters
      ).then((data) => {
        setApplications(data);
      });
    } else {
      getGrantApplications(filters).then((data) => {
        setApplications(
          data.filter((application) => {
            if (!activeLayer) return true;
            if (!application.regions) return false;
            return selectedRegions.includes(
              application.regions[activeLayer?.title]
            );
          })
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, selectedRegions]);

  useEffect(() => {
    if (applications.length > 0) {
      updateSpatialData(applications, 0);
    }
  }, [applications]);

  return (
    <AppContext.Provider
      value={{
        applications,
        setApplications,
        uiState,
        mapState,
        setUiState,
        setMapState,
        selectedApplicationIndex,
        setSelectedApplicationIndex,
        filters,
        setFilters,
        openStatistics,
        setOpenStatistics,
        layers: [],
        dimensions: [],
        summary: {},
        isSidebarOpen,
        setIsSidebarOpen,
        activeLayer,
        setActiveLayer,
        selectedRegions,
        setSelectedRegions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
