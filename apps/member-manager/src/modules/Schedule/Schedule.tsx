import React from "react";
import { Box } from "@mui/material";
import ScheduleProvider from "../Schedule/ScheduleProvider";
import ScheduleControls from "../Schedule/components/ScheduleControls";
import ScheduleList from "../Schedule/ScheduleList";
import ScheduleModals from "../Schedule/ScheduleModals";


const Schedule = () => {
  return (
    <ScheduleProvider>
      <Box sx={{ p: 2, backgroundColor: "background.paper", color: "text.primary" }}>
        <ScheduleControls />
        <ScheduleList />
        <ScheduleModals />
      </Box>
    </ScheduleProvider>
  );
};

export default Schedule;
