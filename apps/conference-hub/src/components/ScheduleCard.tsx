import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
} from "@mui/material";

interface ConferenceScheduleCardProps {
  record: any;
}

const ConferenceScheduleCard: React.FC<ConferenceScheduleCardProps> = ({
  record,
}) => {
  const startTime = isNaN(new Date(`${record.date}T${record.start}`).getTime())
    ? "N/A"
    : new Date(`${record.date}T${record.start}`).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });

  const endTime = isNaN(new Date(`${record.date}T${record.end}`).getTime())
    ? "N/A"
    : new Date(`${record.date}T${record.end}`).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });

  const splitContent = (content: string) =>
    content ? content.split("\n") : [];

  const locations = splitContent(record.location);
  const events = splitContent(record.event);
  const descriptions = splitContent(record.description);
  const speakers = splitContent(record.speaker);
  const companies = splitContent(record.company);

  const maxRows = Math.max(
    locations.length,
    events.length,
    descriptions.length,
    speakers.length,
    companies.length
  );

  const headerCell = {
    color: "#f8fafc",
    fontWeight: 600,
    borderRight: "1px solid rgba(148,163,184,0.35)",
    fontSize: "0.8rem",
  };

  const bodyCell = {
    borderRight: "1px solid #e2e8f0",
    color: "#334155",
    fontSize: "0.875rem",
  };

  return (
    <Box
      sx={{
        mb: 3,
        overflow: "hidden",
        borderRadius: "0.75rem",
        border: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          backgroundColor: "#0f172a",
          px: 1.5,
          py: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "white", fontSize: "0.95rem" }}
        >
          {startTime} – {endTime}
        </Typography>
        {record.training_hours && (
          <Chip
            label={`${record.training_hours} hr training`}
            size="small"
            sx={{
              backgroundColor: "#2563eb",
              color: "white",
              fontWeight: 600,
              height: 24,
            }}
          />
        )}
      </Box>

      <div className="block sm:hidden">
        {locations.map((location, index) => (
          <div
            key={index}
            className={`border-b border-slate-100 px-4 py-3 last:border-b-0 ${
              index % 2 === 0 ? "bg-white" : "bg-slate-50"
            }`}
          >
            <div className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Location
            </div>
            <div className="text-left text-sm text-slate-700">{location}</div>

            {events[index] && (
              <>
                <div className="mt-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Event
                </div>
                <div className="text-left text-sm text-slate-700">
                  {events[index]}
                </div>
              </>
            )}

            {descriptions[index] && (
              <>
                <div className="mt-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Description
                </div>
                <div className="text-left text-sm text-slate-700">
                  {descriptions[index]}
                </div>
              </>
            )}

            {speakers[index] && (
              <>
                <div className="mt-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Speaker
                </div>
                <div className="text-left text-sm text-slate-700">
                  {speakers[index]}
                </div>
              </>
            )}

            {companies[index] && (
              <>
                <div className="mt-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Company
                </div>
                <div className="text-left text-sm text-slate-700">
                  {companies[index]}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="hidden sm:block">
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1e293b" }}>
              {locations.length > 0 && (
                <TableCell sx={headerCell}>Location</TableCell>
              )}
              {events.length > 0 && (
                <TableCell sx={headerCell}>Event</TableCell>
              )}
              {descriptions.length > 0 && (
                <TableCell sx={headerCell}>Description</TableCell>
              )}
              {speakers.length > 0 && (
                <TableCell sx={headerCell}>Speaker</TableCell>
              )}
              {companies.length > 0 && (
                <TableCell sx={headerCell}>Company</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: maxRows }).map((_, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{ backgroundColor: rowIndex % 2 ? "#f8fafc" : "#ffffff" }}
              >
                {locations.length > 0 && (
                  <TableCell sx={bodyCell}>
                    <Typography variant="body2">
                      {locations[rowIndex] || ""}
                    </Typography>
                  </TableCell>
                )}
                {events.length > 0 && (
                  <TableCell sx={bodyCell}>
                    <Typography variant="body2">
                      {events[rowIndex] || ""}
                    </Typography>
                  </TableCell>
                )}
                {descriptions.length > 0 && (
                  <TableCell sx={bodyCell}>
                    <Typography variant="body2">
                      {descriptions[rowIndex] || ""}
                    </Typography>
                  </TableCell>
                )}
                {speakers.length > 0 && (
                  <TableCell sx={bodyCell}>
                    <Typography variant="body2">
                      {speakers[rowIndex] || ""}
                    </Typography>
                  </TableCell>
                )}
                {companies.length > 0 && (
                  <TableCell sx={bodyCell}>
                    <Typography variant="body2">
                      {companies[rowIndex] || ""}
                    </Typography>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Box>
  );
};

export default ConferenceScheduleCard;
