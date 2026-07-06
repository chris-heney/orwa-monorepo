import React from "react";
import { DataProvider, RaRecord } from "react-admin";
import { UseNotifyFunction } from "../conference/types/helpers";
import { ScheduleItem } from "./types";
import { createDateMapping } from "./utils";

export const handleSaveScheduleItem = (
  formData: any,
  setSaving: any,
  setRecords: any,
  setIsCreating: any,
  setEditingRecord: any,
  notify: any,
  dataProvider: DataProvider,
  records: RaRecord[],
  conference: any,
  year: number
) => {
  setSaving(true);
  const { id, ...restFormData } = formData;

  const dataToSave = {
    ...restFormData,
    conference,
    year,
  };

  const saveAction = id
    ? dataProvider.update("conference-schedules", {
        id,
        data: dataToSave,
        previousData: records.find((item) => item.id === id),
      })
    : dataProvider.create("conference-schedules", { data: dataToSave });

  saveAction
    .then(() => {
      notify(`Schedule ${id ? "updated" : "created"} successfully`, {
        type: "success",
      });
      return dataProvider.getList("conference-schedules", {
        filter: { conference, year },
        pagination: { page: 1, perPage: 100 },
        sort: { field: "date", order: "ASC" },
      });
    })
    .then(({ data }: { data: ScheduleItem[] }) => {
      const sortedData = data.sort((a: any, b: any) => {
        const dateA = new Date(`${a.date}T${a.start}`);
        const dateB = new Date(`${b.date}T${b.start}`);
        return dateA.getTime() - dateB.getTime();
      });
      setRecords(sortedData);
      setSaving(false);
      setIsCreating(false);
      setEditingRecord(null);
    })
    .catch((error: any) => {
      notify(`Error: ${error.message}`, { type: "error" });
      setSaving(false);
    });
};
export const handleDeleteScheduleItem = (
  editingRecord: RaRecord,
  setSaving: React.Dispatch<React.SetStateAction<boolean>>,
  dataProvider: DataProvider,
  notify: UseNotifyFunction,
  setRecords: React.Dispatch<React.SetStateAction<RaRecord[]>>,
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>,
  setEditingRecord: React.Dispatch<React.SetStateAction<RaRecord | null>>
) => {
  if (editingRecord && editingRecord.id) {
    setSaving(true);
    dataProvider
      .delete("conference-schedules", { id: editingRecord.id })
      .then(() => {
        notify("Schedule deleted successfully", { type: "success" });
        setRecords((prev) =>
          prev.filter((record) => record.id !== editingRecord.id)
        );
        setIsCreating(false);
        setEditingRecord(null);
        setSaving(false);
      })
      .catch((error: any) => {
        notify(`Error: ${error.message}`, { type: "error" });
        setSaving(false);
      });
  }
};

export const duplicateSchedule = (
  dataProvider: DataProvider,
  sourceConference: any,
  sourceYear: number,
  targetConference: any,
  targetYear: number,
  notify: UseNotifyFunction,
  startDate: string,
  endDate: string
) => {
  return dataProvider
    .getList("conference-schedules", {
      filter: { conference: sourceConference, year: sourceYear },
      pagination: { page: 1, perPage: 10000 },
      sort: { field: "id", order: "ASC" },
    })
    .then(async ({ data }: { data: ScheduleItem[] }) => {
      // If dates are not provided, only update the year
      let dateAdjustmentFunction = (date: string) =>
        `${targetYear}-${date.split("-")[1]}-${date.split("-")[2]}`;

      if (startDate && endDate) {
        // Create a mapping of source dates to target dates
        const dateMap = createDateMapping(data, startDate);

        if (dateMap.size > 0) {
          // Use the date map for adjustment
          dateAdjustmentFunction = (date: string) => dateMap.get(date) || date;
        }
      }

      const duplicatedData = data.map((record: ScheduleItem) => ({
        year: targetYear,
        date: dateAdjustmentFunction(record.date),
        conference: targetConference,
        start: record.start,
        end: record.end,
        location: record.location,
        event: record.event,
        description: null,
        speaker: null,
        company: null,
        id: undefined, // Ensure new records are created
      }));

      for (const item of duplicatedData) {  
         await dataProvider.create("conference-schedules", {
          data: item,
        });
      }
    })
    .then(() => {
      notify("Schedule successfully duplicated", { type: "success" });
    })
    .catch((error: any) => {
      notify(`Error duplicating schedule: ${error.message}`, { type: "error" });
    });
};

export const clearSchedule = (
  dataProvider: DataProvider,
  conference: any,
  year: number,
  notify: UseNotifyFunction
) => {
  return dataProvider
    .getList("conference-schedules", {
      filter: { conference, year },
      pagination: { page: 1, perPage: 100 },
      sort: { field: "id", order: "ASC" },
    })
    .then(({ data }: { data: ScheduleItem[] }) => {
      const deletePromises = data.map((record) =>
        dataProvider.delete("conference-schedules", { id: record.id })
      );

      return Promise.all(deletePromises);
    })
    .then(() => {
      notify("All schedules for the current year cleared successfully", {
        type: "success",
      });
    })
    .catch((error: any) => {
      notify(`Error clearing schedule: ${error.message}`, { type: "error" });
    });
};
