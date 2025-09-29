import React, {
  createContext,
  useContext,
  useState,
  useEffect,
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
import { formatDate } from "./utils";

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
  const [printView, setPrintView] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [targetConference, setTargetConference] = useState<number | null>(
    filterValues?.conference as number
  );
  const [targetYear, setTargetYear] = useState<number>(
    filterValues?.year as number
  );
  const [saving, setSaving] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { toPDF, targetRef } = usePDF({
    filename: `${
      filterValues?.conference
        ? conferences.find(
            (conference) => conference.id === filterValues?.conference
          )?.name
        : "All Conference"
    }-schedule-${filterValues?.year}`,
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
