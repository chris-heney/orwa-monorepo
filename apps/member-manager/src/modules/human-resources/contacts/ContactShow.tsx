import React from "react";
import { Show, SimpleShowLayout, useShowController } from "react-admin";
import {
  Box,
  Card,
  Divider,
  Grid,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  ContactAvatar,
  ContactFullName,
  ContactTitle,
  ContactEmail,
  ContactPhone,
} from "./fields";
import ContactVcard from "./fields/ContactVcard";
import ActivityFeed from "../../activity/ActivityFeed";
import CustomSecondaryHeader from "../../_components/CustomSecondaryHeader";
import ShowHeader from "../_components/ShowHeader";

const ContactShow = () => {
  const { record } = useShowController();
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  if (typeof record === "undefined" || !record) return null;
  return (
    <Show title={"Contact"} component={"div"} actions={false}>
      <ShowHeader first={record.first} last={record.last} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 2,
            }}
          >
            <SimpleShowLayout
              sx={{
                p: 0,
              }}
            >
              <CustomSecondaryHeader title={"Contact"} />
              <Box
                sx={{
                  textAlign: "center",
                  flex: {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                }}
              >
                <ContactAvatar />
                <Divider sx={{ my: "1rem", width: "100%" }} />
                <ContactFullName />
                <ContactTitle />
                {isSmall ? (
                  <Box
                    sx={{
                      display: "flex",
                      textAlign: "center",
                      borderTop: "1px solid",
                      borderColor: "divider",
                      pt: "0.5rem",
                      width: "100%",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    }}
                  >
                    <ContactVcard />
                    <ContactEmail link icon />
                    <ContactPhone link icon />
                  </Box>
                ) : (
                  <>
                    <ContactEmail link />
                    <ContactPhone link />
                  </>
                )}
                {(record.address_mailing_line1 ||
                  record.address_mailing_city ||
                  record.address_mailing_zip) && (
                  <Box
                    sx={{
                      mt: 2,
                      pt: 2,
                      borderTop: "1px solid",
                      borderColor: "divider",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      Mailing (directory)
                    </Typography>
                    <Typography variant="body2">
                      {[record.address_mailing_line1, record.address_mailing_line2]
                        .filter(Boolean)
                        .join(", ")}
                    </Typography>
                    <Typography variant="body2">
                      {[
                        record.address_mailing_city,
                        record.address_mailing_state,
                        record.address_mailing_zip,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </Typography>
                  </Box>
                )}
              </Box>
            </SimpleShowLayout>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <ActivityFeed
            sx={{ width: "100%", height: 465, mt: 0.3 }}
            title={" "}
            entity="contacts"
            entity_id={record.id}
          />
        </Grid>
      </Grid>
    </Show>
  );
};

export default ContactShow;
