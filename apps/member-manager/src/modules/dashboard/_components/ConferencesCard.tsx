import React from "react";
import { Box, Typography } from "@mui/material";
import EventsIcon from "@mui/icons-material/CalendarMonth";
import { useGetList } from "react-admin";
import dayjs from "dayjs";
import "react-calendar/dist/Calendar.css";
import { YearMonthDay } from "../../../helpers/Data";
import NextConference from "./MuiCalender";
import DashboardCard from "./DashboardCard";
import {
  display,
  useSummaryTokens,
} from "../../memberships_v2/summary/tokens";

const NextConferencsCard = () => {
  const T = useSummaryTokens();
  const { data: conferences, isLoading } = useGetList("conferences", {
    pagination: { page: 1, perPage: 1000 },
  });

  const upComingConference = conferences?.filter((event) => {
    const eventDate = new Date(event.start_date);
    return eventDate > new Date();
  });

  const mostRecentEvent = upComingConference?.length
    ? upComingConference.reduce((prev, current) => {
        const prevDate = new Date(prev.start_date);
        const currentDate = new Date(current.start_date);
        return currentDate < prevDate ? current : prev;
      })
    : null;

  const daysLeft = mostRecentEvent
    ? dayjs(mostRecentEvent?.start_date).diff(dayjs(new Date()), "days")
    : null;

  const start = mostRecentEvent?.start_date;
  const formattedStartDate = start
    ? new Date(start).toLocaleDateString("en-US", YearMonthDay)
    : null;

  const title = mostRecentEvent
    ? `${mostRecentEvent.name}`
    : "Conferences";

  return (
    <DashboardCard
      icon={<EventsIcon />}
      title={title}
      loading={isLoading}
      disableBodyScroll
      bodySx={{
        px: 1,
        py: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 0.5,
      }}
    >
      {mostRecentEvent ? (
        <Typography
          sx={{
            fontSize: 11.5,
            color: T.textLo,
            textAlign: "center",
            px: 1,
          }}
        >
          {formattedStartDate}
        </Typography>
      ) : (
        <Typography sx={{ fontSize: 13, color: T.textFaint, py: 2 }}>
          No upcoming conferences
        </Typography>
      )}

      {mostRecentEvent ? (
        <>
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "& .react-calendar": { width: "100%", maxWidth: 260 },
            }}
          >
            <NextConference selectedDate={dayjs(mostRecentEvent?.start_date)} />
          </Box>
          <Typography
            sx={{
              ...display,
              fontSize: 16,
              fontWeight: 700,
              color: T.textHi,
              textAlign: "center",
              pb: 0.5,
            }}
          >
            Days Left: {daysLeft}
          </Typography>
        </>
      ) : null}
    </DashboardCard>
  );
};

export default NextConferencsCard;
