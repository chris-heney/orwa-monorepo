import React, { useState } from "react";
import { EditBase, SimpleForm, Title } from "react-admin";
import MembershipsContextProvider from "../../memberships_v2/MembershipsContextProvider";
import {Card, Grid, Button, Tooltip} from "@mui/material";
import WaterSystemFields from "./components/WaterSystemFields";
import CustomFormHeader from "../../_components/CustomFormHeader";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import EmailSidebar from "../../emails-magement/EmailSidebar";

const WaterSystemEdit = () => {
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  return (
    <MembershipsContextProvider>
      <EditBase hasShow={false} redirect={false} component="div">
        <Title title="Memberships" />
        <Grid container spacing={2} py={2}>
          <Grid xs={12} md={showSidebar ? 9 : 12}>
            <SimpleForm
              sx={{
                p: 0,
              }}
            >
              <CustomFormHeader
                customActions={
                  <Tooltip title="Open Notifications" placement="top">
                    <Button
                      onClick={toggleSidebar}
                      sx={{ color: "white", mr: 2 }}
                      startIcon={<MarkunreadMailboxIcon />}
                    ></Button>
                  </Tooltip>
                }
              />
              <Card
                sx={{
                  borderRadius: 0,
                }}
              >
                <WaterSystemFields />
              </Card>
            </SimpleForm>
          </Grid>

          {/* Sidebar toggle logic */}
          {showSidebar && (
            <Grid xs={12} md={3}>
              <EmailSidebar module="Memberships" />
            </Grid>
          )}
        </Grid>
      </EditBase>
    </MembershipsContextProvider>
  );
};

export default WaterSystemEdit;
