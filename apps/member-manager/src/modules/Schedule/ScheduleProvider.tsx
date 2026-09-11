import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
  PropsWithChildren,
} from "react";
import {
  useNotify,
  useDataProvider,
  RaRecord,
  useListContext,
} from "react-admin";
import { useConferenceContext } from "../conference/ConferenceContext";
import { Margin, Resolution, usePDF } from "react-to-pdf";
import {
  clearSchedule,
  duplicateSchedule,
  handleDeleteScheduleItem,
  handleSaveScheduleItem,
} from "./scheduleService";
import { formatDate, scheduleConferenceName } from "./utils";
import { ScheduleDialog, useScheduleBar } from "./ScheduleBarContext";
import { downloadScheduleCsv } from "./scheduleCsv";
import type { ScheduleItem } from "./types";

interface ScheduleContextProps {
  records: RaRecord[];
  setRecords: (records: RaRecord[]) => void;
  loading: boolean;
  editingRecord: RaRecord | null;
  setEditingRecord: React.Dispatch<React.SetStateAction<RaRecord | null>>;
  isCreating: boolean;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  printView: boolean;
  setPrintView: React.Dispatch<React.SetStateAction<boolean>>;
  toPDF: () => void;
  targetRef: React.RefObject<HTMLDivElement | null>;
  handleEdit: (record: RaRecord) => void;
  handleClose: () => void;
  isDuplicateModalOpen: boolean;
  setIsDuplicateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isClearModalOpen: boolean;
  setIsClearModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  targetConference: number | null;
  setTargetConference: React.Dispatch<React.SetStateAction<number | null>>;
  targetYear: number;
  setTargetYear: React.Dispatch<React.SetStateAction<number>>;
  handleDelete: () => void;
  handleSave: (formData: any) => void;
  handleClearSchedule: () => void;
  handleDuplicateSchedule: () => void;
  saving: boolean;
  setSaving: React.Dispatch<React.SetStateAction<boolean>>;
  startDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  endDate: string;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
}

const ScheduleContext = createContext<ScheduleContextProps>({
  records: [],
  setRecords: () => {},
  loading: true,
  editingRecord: null,
  setEditingRecord: () => {},
  isCreating: false,
  setIsCreating: () => {},
  printView: false,
  setPrintView: () => {},
  toPDF: () => {},
  targetRef: React.createRef<HTMLDivElement>(),
  handleEdit: () => {},
  handleClose: () => {},
  isDuplicateModalOpen: false,
  setIsDuplicateModalOpen: () => {},
  isClearModalOpen: false,
  setIsClearModalOpen: () => {},
  targetConference: null,
  setTargetConference: () => {},
  targetYear: new Date().getFullYear(),
  setTargetYear: () => {},
  handleDelete: () => {},
  handleSave: () => {},
  handleClearSchedule: () => {},
  handleDuplicateSchedule: () => {},
  saving: false,
  setSaving: () => {},
  startDate: "",
  setStartDate: () => {},
  endDate: "",
  setEndDate: () => {},
});

export const useScheduleContext = () => useContext(ScheduleContext);

const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const { filterValues } = useListContext();
  const { conferences, isCreating, setIsCreating } = useConferenceContext();
  const notify = useNotify();
  const dataProvider = useDataProvider();

  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<any | null>(null);

  // Print view and the Duplicate / Clear dialogs are driven by the Schedule
  // tab's title-bar actions, which render outside this panel — so when a
  // page-level ScheduleBarProvider is mounted the state lives there.
  const bar = useScheduleBar();
  const [localPrintView, setLocalPrintView] = useState(false);
  const [localDialog, setLocalDialog] = useState<ScheduleDialog>(null);
  const printView = bar ? bar.printView : localPrintView;
  const setPrintView = bar ? bar.setPrintView : setLocalPrintView;
  const dialog = bar ? bar.dialog : localDialog;
  const setDialog = bar ? bar.setDialog : setLocalDialog;

  /** Boolean `setIsXModalOpen` over the single `dialog` value. */
  const dialogSetter = useCallback(
    (
      which: Exclude<ScheduleDialog, null>
    ): React.Dispatch<React.SetStateAction<boolean>> =>
      (value) =>
        setDialog((prev) => {
          const open = prev === which;
          const next = typeof value === "function" ? value(open) : value;
          return next ? which : open ? null : prev;
        }),
    [setDialog]
  );
  const isDuplicateModalOpen = dialog === "duplicate";
  const setIsDuplicateModalOpen = useMemo(
    () => dialogSetter("duplicate"),
    [dialogSetter]
  );
  const isClearModalOpen = dialog === "clear";
  const setIsClearModalOpen = useMemo(
    () => dialogSetter("clear"),
    [dialogSetter]
  );

  const [targetConference, setTargetConference] = useState<number | null>(
    filterValues?.conference as number
  );
  const [targetYear, setTargetYear] = useState<number>(
    filterValues?.year as number
  );
  const [saving, setSaving] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const conferenceName = scheduleConferenceName(
    conferences,
    filterValues?.conference
  );

  const { toPDF, targetRef } = usePDF({
    filename: `${conferenceName || "All Conference"}-schedule-${filterValues?.year}`,
    resolution: Resolution.HIGH,
    page: { margin: Margin.SMALL },
  });

  useEffect(() => {
    // if (!filterValues?.conference || !filterValues?.year) {
    //   notify("Please select a conference and year", { type: "error" });
    //   return;
    // }

    setLoading(true);
    dataProvider
      .getList("conference-schedules", {
        filter:
          filterValues?.conference && filterValues?.year
            ? { conference: filterValues?.conference, year: filterValues?.year }
            : filterValues?.conference
            ? { conference: filterValues?.conference }
            : filterValues?.year
            ? { year: filterValues?.year }
            : {},
        pagination: { page: 1, perPage: 100 },
        sort: { field: "id", order: "ASC" },
      })
      .then(({ data }) => {
        setRecords(data);
        setLoading(false);
      })
      .catch((error) => {
        notify(`Error: ${error.message}`, { type: "error" });
        setLoading(false);
      });
  }, [filterValues?.conference, filterValues?.year]);

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setIsCreating(true);
  };

  const handleClose = () => {
    setEditingRecord(null);
    setIsCreating(false);
  };

  const handleSave = (formData: any) => {
    handleSaveScheduleItem(
      formData,
      setSaving,
      setRecords,
      setIsCreating,
      setEditingRecord,
      notify,
      dataProvider,
      records,
      filterValues?.conference,
      filterValues?.year
    );
  };

  const handleDelete = () => {
    handleDeleteScheduleItem(
      editingRecord,
      setSaving,
      dataProvider,
      notify,
      setRecords,
      setIsCreating,
      setEditingRecord
    );
  };

  useEffect(() => {
    if (isDuplicateModalOpen && records.length > 0) {
      const dates = records.map((record) => record.date).sort();
      if (dates.length > 0) {
        const startDateObj = new Date(dates[0]);
        const endDateObj = new Date(dates[dates.length - 1]);

        startDateObj.setFullYear(startDateObj.getFullYear() + 1);
        endDateObj.setFullYear(endDateObj.getFullYear() + 1);

        setStartDate(formatDate(startDateObj));
        setEndDate(formatDate(endDateObj));
      }
    }
  }, [isDuplicateModalOpen, records]);

  const handleDuplicateSchedule = () => {
    duplicateSchedule(
      dataProvider,
      filterValues?.conference,
      filterValues?.year,
      targetConference,
      targetYear,
      notify,
      startDate,
      endDate
    ).then(() => {
      setIsDuplicateModalOpen(false);
    });
  };

  const handleClearSchedule = () => {
    clearSchedule(
      dataProvider,
      filterValues?.conference,
      filterValues?.year,
      notify
    ).then(() => {
      setRecords([]);
      setIsClearModalOpen(false);
    });
  };

  // Publish the panel's commands to the title bar. The registered callbacks
  // are created once and read the latest toPDF / records through a ref, so
  // re-renders never re-register (which would re-render the bar provider,
  // then this panel, in a loop).
  const latest = useRef({ toPDF, records, conferenceName });
  latest.current = { toPDF, records, conferenceName };
  const registerCommands = bar?.registerCommands;
  const setRecordCount = bar?.setRecordCount;
  const setBarPrintView = bar?.setPrintView;
  const setBarDialog = bar?.setDialog;

  useEffect(() => {
    if (!registerCommands) return undefined;
    registerCommands({
      downloadPdf: () => latest.current.toPDF(),
      exportCsv: () =>
        downloadScheduleCsv(
          latest.current.records as ScheduleItem[],
          latest.current.conferenceName
        ),
    });
    return () => {
      // Leaving the tab: no stale commands, and it reopens in the edit view.
      registerCommands(null);
      setBarPrintView?.(false);
      setBarDialog?.(null);
    };
  }, [registerCommands, setBarPrintView, setBarDialog]);

  useEffect(() => {
    setRecordCount?.(records.length);
  }, [setRecordCount, records.length]);

  return (
    <ScheduleContext.Provider
      value={{
        records,
        setRecords,
        loading,
        editingRecord,
        setEditingRecord,
        isCreating,
        setIsCreating,
        printView,
        setPrintView,
        toPDF,
        targetRef,
        handleEdit,
        handleClose,
        isDuplicateModalOpen,
        setIsDuplicateModalOpen,
        isClearModalOpen,
        setIsClearModalOpen,
        targetConference,
        setTargetConference,
        targetYear,
        setTargetYear,
        handleDelete,
        handleSave,
        handleClearSchedule,
        handleDuplicateSchedule,
        saving,
        setSaving,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export default ScheduleProvider;
