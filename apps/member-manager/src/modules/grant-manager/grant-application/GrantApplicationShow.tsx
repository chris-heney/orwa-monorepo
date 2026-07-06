import React, { useState } from "react";
import { ShowBase, Title } from "react-admin";
import GrantApplicationDetails from "./components/GrantApplicationDetails";
import CustomShowHeader from "../../memberships_v2/componenets/CustomShowHeader";
import { Box, Card, Grid, IconButton, Tooltip } from "@mui/material";
import ActivityFeed from "../../activity/ActivityFeed";
import EmailIcon from "@mui/icons-material/Email";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import EmailSidebar from "../../emails-magement/EmailSideBar";

const GrantApplicationShow = () => {
  const [viewMode, setViewMode] = useState<"email" | "activity" | "">("");

  return (
    <Box
      sx={{
        py: 2,
      }}
    >
      <ShowBase
        queryOptions={{ meta: { raw: true, populate: true } }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={viewMode === "" ? 12 : 9}>
            <Card
              sx={{
                borderRadius: 0,
              }}
            >
              <Title title="Grant Application Details" />
              <CustomShowHeader
                displayField="legal_entity_name"
                
                redirectTo="/grant/dashboard"
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
                          color:
                            viewMode === "email" ? "white" : "primary.main",
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
                          color:
                            viewMode === "activity" ? "white" : "primary.main",
                        }}
                      >
                        <MarkunreadMailboxIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                }
              />
              <GrantApplicationDetails />
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            {viewMode === "email" && <EmailSidebar module="Grant Management" />}
            {viewMode === "activity" && (
              <ActivityFeed
                entity="grant-application"
                title=" "
                entity_id={5846}
              />
            )}
          </Grid>
        </Grid>
      </ShowBase>
    </Box>
  );
};

export default GrantApplicationShow;
