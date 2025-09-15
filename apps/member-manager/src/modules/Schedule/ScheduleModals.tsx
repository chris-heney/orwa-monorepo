import React from "react";
import DuplicateScheduleModal from "./components/DuplicateScheduleModal";
import ClearScheduleModal from "./components/ClearScheduleModal";
import EditScheduleModal from "./components/ScheduleFormModal";

const ScheduleModals = () => {
  return (
    <>
      <ClearScheduleModal />
      <DuplicateScheduleModal />
      <EditScheduleModal />
    </>
  );
};

export default ScheduleModals;
