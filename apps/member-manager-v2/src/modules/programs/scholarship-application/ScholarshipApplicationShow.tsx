import React, { useState } from "react";
import { ShowBase, Title } from "react-admin";
import { Box, Card, Grid, IconButton, Tooltip } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import CustomShowHeader from "../../memberships_v2/componenets/CustomShowHeader";
import ScholarshipApplicationDetails from "./components/ScholarshipApplicationDetails";
import ActivityFeed from "../../activity/ActivityFeed";
import EmailSidebar from "../../emails-magement/EmailSidebar";

const ScholarshipApplicationShow = () => {
  const [viewMode, setViewMode] = useState<"email" | "activity" | "">("");

  return (
    <Box sx={{ py: 2 }}>
      <ShowBase
        queryOptions={{ 
          meta: { 
            raw: true, 
            populate: [
              'contact', 'watersystem', 'transcript', 'test_scores',
              'recommendation_letter_1', 'recommendation_letter_2',
              'essay', 'biography', 'photograph', 'applicant_pdf',
              'eligible_participant_name', 'eligible_participant_address',
              'school_address', 'recommender1_name', 'recommender2_name',
              'guardian_name'
            ]
          } 
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={viewMode === "" ? 12 : 9}>
            <Card sx={{ borderRadius: 0 }}>
              <Title title="Scholarship Application Details" />
              <CustomShowHeader
                display={(record) => `${record.applicant_first_name || ''} ${record.applicant_last_name || ''}`.trim() + " Scholarship Application"}
                redirectTo="/scholarship/dashboard"
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
              <ScholarshipApplicationDetails />
            </Card>
          </Grid>
          {viewMode !== "" && (
            <Grid item xs={12} md={3}>
              {viewMode === "email" && <EmailSidebar module="Scholarship Management" />}
              {viewMode === "activity" && (
                <ActivityFeed
                  entity="scholarship-application"
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

export default ScholarshipApplicationShow;
