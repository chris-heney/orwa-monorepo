import React from "react";
import {
  RaRecord,
  ReferenceArrayField,
  ReferenceField,
  ShowBase,
  SimpleShowLayout,
  SingleFieldList,
  TextField,
  Title,
  useShowController,
} from "react-admin";
import {
  Box,
  Divider,
  Stack,
  Tabs,
  Tab,
  ToggleButton,
  Card,
  useMediaQuery,
  Theme,
} from "@mui/material";
import MapPinIcon from "@mui/icons-material/FmdGood";
import MembershipExpiration from "../../_components/MembershipExpiration";
import CustomShowHeader from "../../memberships_v2/componenets/CustomShowHeader";
import SimpleInvoicesList from "../../invoices/SimpleInvoiceList";
import CustomSecondaryHeader from "../../_components/CustomSecondaryHeader";
import { oneYearAgoFormatted } from "../../memberships_v2/helpers/activeOrInactiveMembership";

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const WatersystemShow = () => {
  const [accentWindow, setAccentWindow] = React.useState<
    "map" | "transactions" | ""
  >("transactions");
  const [addresstype, setAddressType] = React.useState("physical");
  const [addressTab, setAddressTab] = React.useState(0);

  const handleAddressTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setAddressTab(newValue);
  };

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  const { record } = useShowController();

  if (!record) return null;

  const boxStyle = {
    padding: "1em",
  };

  const addressUri = [
    record.address_physical_line1,
    record.address_physical_line2,
    record.address_physical_city,
    record.address_physical_state,
    record.address_physical_zip,
  ]
    .join("+")
    .replace(/ /g, "+")
    .replace(/,,/g, ",")
    .replace(/\+\+/g, "+");

  // const addressUri = 'Space+Needle,Seattle+WA'

  const mapSrc = record.address_physical_line1
    ? `https://www.google.com/maps/embed/v1/search?key=${
        import.meta.env.VITE_API_GOOGLE_MAPS_KEY
      }&q=${addressUri}`
    : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d42819.626854720234!2d-97.54286653829665!3d35.46806278534941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87b217360dc53dbb%3A0xba6a9b0f8ca9a1c9!2sOmni%20Oklahoma%20City%20Hotel!5e0!3m2!1sen!2sus!4v1697750571992!5m2!1sen!2sus";

  return (
    <ShowBase resource="watersystems">
      <SimpleShowLayout sx={{ p: 0 }}>
        <Title title="Memberships" />
        <CustomShowHeader />
        <Stack
          direction={isSmall ? "column" : "row"}
          columnGap={2}
          rowGap={isSmall ? 2 : 0}
        >
          <Card>
            <Stack divider={<Divider />}>
              {record.legal_entity_namex && (
                <Box sx={boxStyle}>
                  <label>Entity Name:</label> {record.legal_entity_name}
                </Box>
              )}
              {record.total_years > 0 && (
                <Box sx={boxStyle}>
                  <label>Total Years:</label> {record.total_years.toString()}
                </Box>
              )}
              <Box sx={boxStyle}>
                <label>Active Status:</label>{" "}
                {record.payment_last_date > oneYearAgoFormatted
                  ? "Active"
                  : "Inactive"}
              </Box>
              <Box>
                <MembershipExpiration
                  fontSize="12px"
                  lastPayment={record.payment_last_date}
                  previousPayment={record.payment_previous_date}
                  format="MMMM D, YYYY"
                />
              </Box>
              <Box sx={boxStyle}>
                <label>Funding Status:</label>{" "}
                {record.funding_status ? "Funded" : "Not Funded"}
              </Box>
              <Box>
                <Stack direction="column">
                  <Tabs
                    value={addressTab}
                    onChange={handleAddressTabChange}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                  >
                    <Tab
                      label="Physical"
                      {...a11yProps(0)}
                      onClick={() => {
                        setAddressType("physical");
                      }}
                    />
                    <Tab
                      label="Mailing"
                      {...a11yProps(1)}
                      onClick={() => {
                        setAddressType("mailing");
                      }}
                    />
                  </Tabs>
                  {"physical" === addresstype && (
                    <Box sx={{ px: 2 }}>
                      <Box>
                        <TextField source="address_physical_line1" />
                      </Box>
                      <Box>
                        <TextField source="address_physical_line2" />
                      </Box>
                      <Box>
                        <TextField source="address_physical_city" />,{" "}
                        <TextField source="address_physical_state" />
                      </Box>
                      <Box>
                        <TextField source="address_physical_zip" />
                      </Box>
                    </Box>
                  )}
                  {"mailing" === addresstype && (
                    <Box sx={{ px: 2 }}>
                      <Box>
                        <TextField source="address_mailing_line1" />
                      </Box>
                      <Box>
                        <TextField source="address_mailing_line2" />
                      </Box>
                      <Box>
                        <TextField source="address_mailing_city" />,{" "}
                        <TextField source="address_mailing_state" />
                      </Box>
                      <Box>
                        <TextField source="address_mailing_zip" />
                      </Box>
                    </Box>
                  )}
                  <ToggleButton
                    value="map"
                    selected={accentWindow === "map" ? true : false}
                    sx={{
                      borderRadius: 0,
                      borderLeft: 0,
                      borderRight: 0,
                      borderBottom: 0,
                    }}
                    onChange={() => {
                      if (accentWindow === "map") {
                        setAccentWindow("");
                        return;
                      }

                      setAccentWindow("map");
                    }}
                  >
                    <MapPinIcon /> Show Map
                  </ToggleButton>
                  <ToggleButton
                    value="map"
                    selected={accentWindow === "transactions" ? true : false}
                    sx={{
                      borderRadius: 0,
                      borderLeft: 0,
                      borderRight: 0,
                      borderBottom: 0,
                    }}
                    onChange={() => {
                      if (accentWindow === "transactions") {
                        setAccentWindow("");
                        return;
                      }

                      setAccentWindow("transactions");
                    }}
                  >
                    <MapPinIcon /> View Transactions
                  </ToggleButton>
                </Stack>
              </Box>
              <Box sx={boxStyle}>
                <label>Workmans Comp: </label>
                {record.workmans_comp ? "Yes" : "No"}
              </Box>
              <Box sx={boxStyle}>
                <label>Soonerwarn: </label>
                {record.soonerwarn ? "Active" : "Not Active"}
              </Box>
              <Box sx={boxStyle}>
                <label>Mailed: </label>
                {record.directory_mailed ? "Yes" : "No"}
              </Box>
              <Box sx={boxStyle}>
                <label>ORWAAG: </label>
                {record.orwaag ? "Yes" : "No"}
              </Box>
              {record.region && <Box sx={boxStyle}>{record.region}</Box>}
              {record.system_type_dirty && (
                <Box sx={boxStyle}>
                  <label>System Type: </label>
                  {record.system_type_dirty}
                </Box>
              )}
              {record.office_hours && (
                <Box sx={boxStyle}>
                  <label>Office Hours: </label>
                  {record.office_hours}
                </Box>
              )}
              {record.meters > 0 && (
                <Box sx={boxStyle}>
                  <label>Meters: </label>
                  {record.meters.toString()}
                </Box>
              )}
              {record.contacts > 0 && (
                <Box sx={boxStyle}>
                  <label>Contacts: </label>
                  <ReferenceArrayField
                    source="contacts"
                    label="Contacts"
                    reference="Contacts"
                  >
                    <SingleFieldList>
                      <ReferenceField
                        source="id"
                        link={(record: RaRecord) =>
                          `/contacts/${record.id}/show`
                        }
                        reference="contacts"
                      >
                        <TextField source="email" />
                        <> </>
                      </ReferenceField>
                    </SingleFieldList>
                  </ReferenceArrayField>
                </Box>
              )}
            </Stack>
          </Card>
          {accentWindow === "map" && (
            <Card
              sx={{
                height: ["80vh", "auto"],
                width: "100%",
              }}
            >
              {accentWindow === "map" && (
                <Box
                  component="iframe"
                  sx={{
                    height: "100%",
                    border: "0 none",
                  }}
                  src={mapSrc}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              )}
            </Card>
          )}
          {accentWindow === "transactions" && (
            <Box
              sx={{
                width: "100%",
              }}
            >
              <CustomSecondaryHeader title="Transactions" />
              <SimpleInvoicesList filters={{ entity_id: record.id }} />
            </Box>
          )}
        </Stack>
      </SimpleShowLayout>
    </ShowBase>
  );
};

export default WatersystemShow;
