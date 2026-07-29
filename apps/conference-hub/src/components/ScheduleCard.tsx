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
  const splitContent = (content: string) => {
    return content ? content.split("\n") : [];
  };

  const locations = splitContent(record.location);
  const events = splitContent(record.event);
  const descriptions = splitContent(record.description);
  const speakers = splitContent(record.speaker);
  const companies = splitContent(record.company);

  // Determine the maximum number of rows required
  const maxRows = Math.max(
    locations.length,
    events.length,
    descriptions.length,
    speakers.length,
    companies.length
  );

  // Render a section for each time block
  const tableCellStyle = {
    color: "white",
    fontWeight: 700,
    borderRight: "1px solid white",
    borderTop: "1px solid white",
  };

  const tableCellInfoStyle = {
    // 1px solid rgba(224, 224, 224, 1)
    borderRight: "1px solid rgba(224, 224, 224, 1)",
  };

  return (
    <Box
      sx={{
        mb: 4,
        backgroundColor: "#F3F2F2",
        borderRadius: 2,
      }}
    >
      {/* Time Block Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#000",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "white",
            p: 1,
            borderTopRightRadius: 4,
            borderTopLeftRadius: 4,
          }}
        >
          {startTime} - {endTime}
        </Typography>
        {record.training_hours && (
          <Chip
            label={`Training hours: ${record.training_hours}`}
            sx={{
              backgroundColor: "#3c87d6",
              color: "white",
              fontWeight: 700,
              minWidth: "50px",
              minHeight: "10px",
              mt: 1,
              mr: 1,
            }}
          />
        )}
      </Box>

      {/* Mobile View */}
      <div className="block sm:hidden">
        {locations.map((location, index) => (
          <div
            key={index}
            className={`p-3 mb-3 ${index % 2 === 0 ?"bg-gray-100" : "bg-gray-300"}`}
          >
            <div className="text-left font-bold text-gray-700">Location</div>
            <div className="text-left text-gray-600">{location}</div>
            <hr className={`my-2  ${index % 2 === 0 ?"bg-gray-100" : "bg-gray-300"} `} />
        
            {events[index] && (
              <>
              <div className="text-left font-bold text-gray-700">Event</div>
              <div className="text-left text-gray-600">{events[index]}</div>
              <hr className={`my-2  ${index % 2 === 0 ?"bg-gray-100" : "bg-gray-300"} `} />
              </>
            )}

            {descriptions[index] && (
              <>
                <div className="text-left font-bold text-gray-700">Description</div>
                <div className="text-left text-gray-600">
                  {descriptions[index]}
                </div>
                <hr className={`my-2  ${index % 2 === 0 ?"bg-gray-100" : "bg-gray-300"} `} />
              </>
            )}
         
            {speakers[index] && (
              <>
               <div className="text-left font-bold text-gray-700">Speaker</div>
                <div className="text-left text-gray-600">{speakers[index]}</div>
                <hr className={`my-2  ${index % 2 === 0 ?"bg-gray-100" : "bg-gray-300"} `} />
              </>
            )}
            {companies[index] && (
              <>
                <div className="text-left font-bold text-gray-700">Company</div>
                <div className="text-left text-gray-600">
                  {companies[index]}
                </div>
              </>
            )}
          </div>              
        ))}
      </div>

      {/* Deskton Schedule */}

      {/* Only add columns if the info is present */}
      <div className="hidden sm:block">
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#363636",
                color: "white",
              }}
            >
              {locations.length > 0 && (
                <TableCell sx={tableCellStyle}>Location</TableCell>
              )}
              {events.length > 0 && (
                <TableCell sx={tableCellStyle}>Event</TableCell>
              )}
              {descriptions.length > 0 && (
                <TableCell sx={tableCellStyle}>Description</TableCell>
              )}
              {speakers.length > 0 && (
                <TableCell sx={tableCellStyle}>Speaker</TableCell>
              )}
              {companies.length > 0 && (
                <TableCell sx={tableCellStyle}>Company</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: maxRows }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {locations.length > 0 && (
                  <TableCell sx={tableCellInfoStyle}>
                    <Typography variant="body1">
                      {locations[rowIndex] || ""}
                    </Typography>
                  </TableCell>
                )}
                {events.length > 0 && (
                  <TableCell sx={tableCellInfoStyle}>
                    <Typography variant="body1">
                      {events[rowIndex] || ""}
                    </Typography>
                  </TableCell>
                )}
                {descriptions.length > 0 && (
                  <TableCell sx={tableCellInfoStyle}>
                    <Typography variant="body1">
                      {descriptions[rowIndex] || ""}
                    </Typography>
                  </TableCell>
                )}
                {speakers.length > 0 && (
                  <TableCell sx={tableCellInfoStyle}>
                    <Typography variant="body1">
                      {speakers[rowIndex] || ""}
                    </Typography>
                  </TableCell>
                )}
                {companies.length > 0 && (
                  <TableCell sx={tableCellInfoStyle}>
                    <Typography variant="body1">
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
