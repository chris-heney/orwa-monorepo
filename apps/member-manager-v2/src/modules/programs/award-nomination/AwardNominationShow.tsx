import React, { useState } from "react";
import { ShowBase, Title, useRecordContext } from "react-admin";
import { Box, Card, Grid, IconButton, Tooltip } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import CustomShowHeader from "../../memberships_v2/componenets/CustomShowHeader";
import AwardNominationDetails from "./components/AwardNominationDetails";
import ActivityFeed from "../../activity/ActivityFeed";
import EmailSidebar from "../../emails-magement/EmailSidebar";

const AwardNominationShow = () => {
  const [viewMode, setViewMode] = useState<"email" | "activity" | "">("");

  return (
    <Box sx={{ py: 2 }}>
      <ShowBase
        queryOptions={{ 
          meta: { 
            raw: true, 
            populate: [
              'contact', 'watersystem', 'supporting_documents', 'nomination_pdf'
            ]
          } 
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={viewMode === "" ? 12 : 9}>
            <Card sx={{ borderRadius: 0 }}>
              <Title title="Award Nomination Details" />
              <CustomShowHeader
                displayField={(record: any) => 
                  `${record?.nominee_name} - ${record?.award_type}`
                }
                redirectTo="/award-nominations"
                customActions={
                  <>
                    <Tooltip title="Open Notifications" placement="top">
                      <IconButton
                        onClick={() =>
                          viewMode === "email"
                            ? setViewMode("")
                            : setViewMode("email")
                        }
                        sx={{
                          color: viewMode === "email" ? "white" : "primary.main",
                          mr: 1,
                        }}
                      >
                        <EmailIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Open Activity Feed" placement="top">
                      <IconButton
                        onClick={() =>
                          viewMode === "activity"
                            ? setViewMode("")
                            : setViewMode("activity")
                        }
                        sx={{
                          color: viewMode === "activity" ? "white" : "primary.main",
                        }}
                      >
                        <MarkunreadMailboxIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                }
              />
              <AwardNominationDetails />
            </Card>
          </Grid>
          {viewMode !== "" && (
            <Grid item xs={12} md={3}>
              {viewMode === "email" && <EmailSidebar module="Award Management" />}
              {viewMode === "activity" && (
                <ActivityFeed
                  entity="award-nomination"
                  title=" "
                  entity_id={5846}
                />
              )}
            </Grid>
          )}
        </Grid>
      </ShowBase>
    </Box>
  );
};

export default AwardNominationShow;
