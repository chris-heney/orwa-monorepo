import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Link,
  SimpleShowLayout,
  TextField,
  Title,
  useShowController,
} from "react-admin";
import { ShowContextProvider } from "ra-core";
import {
  Box,
  Divider,
  Stack,
  Tabs,
  Tab,
  ToggleButton,
  Card,
  Typography,
  useMediaQuery,
  Theme,
  Button as MUIButton,
  IconButton,
} from "@mui/material";
import MapPinIcon from "@mui/icons-material/FmdGood";
import ContactsIcon from "@mui/icons-material/Contacts";
import AddIcon from "@mui/icons-material/Add";
import MembershipExpiration from "../../_components/MembershipExpiration";
import CustomShowHeader from "../../memberships_v2/componenets/CustomShowHeader";
import SimpleInvoicesList from "../../invoices/SimpleInvoiceList";
import CustomSecondaryHeader from "../../_components/CustomSecondaryHeader";
import { isMembershipActiveByExpiration } from "../../_helpers/getExpirationDate";
import { getDirectoryContactsFromRecord } from "./directoryContacts";
import useCurrentUser from "../../_helpers/useCurrentUser";
import { useMembershipContext } from "../MembershipsContextProvider";

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

type AccentPanel = "map" | "transactions" | "directory" | "";

const WATERSYSTEM_SHOW_ACCENT_KEY_PREFIX = "watersystem-show-accent:";

function accentStorageKey(systemId: string | number): string {
  return `${WATERSYSTEM_SHOW_ACCENT_KEY_PREFIX}${systemId}`;
}

function readAccentFromStorage(systemId: string | number): AccentPanel {
  if (typeof sessionStorage === "undefined") {
    return "transactions";
  }
  try {
    const raw = sessionStorage.getItem(accentStorageKey(systemId));
    if (
      raw === "map" ||
      raw === "transactions" ||
      raw === "directory" ||
      raw === ""
    ) {
      return raw as AccentPanel;
    }
  } catch {
    /* ignore */
  }
  return "transactions";
}

function writeAccentToStorage(
  systemId: string | number,
  value: AccentPanel
): void {
  if (typeof sessionStorage === "undefined") {
    return;
  }
  try {
    sessionStorage.setItem(accentStorageKey(systemId), value);
  } catch {
    /* ignore */
  }
}

const WatersystemShow = () => {
  const [accentWindow, setAccentWindow] = useState<AccentPanel>("transactions");
  const [addresstype, setAddressType] = useState("physical");
  const [addressTab, setAddressTab] = useState(0);
  /** Avoid re-reading storage while on the same system (keeps RA refresh from fighting local state). */
  const hydratedRecordIdRef = useRef<string | number | undefined>(undefined);

  const handleAddressTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setAddressTab(newValue);
  };

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  const { role } = useCurrentUser();
  const {
    setIsContactModalOpen,
    setContactCreateDefaultValues,
    setLinkNewContactToWatersystemId,
    setContactEditId,
  } = useMembershipContext();

  const controllerProps = useShowController({
    queryOptions: {
      meta: { raw: true, populate: ["contacts"] },
    },
  });
  const { record } = controllerProps;

  const setAccentAndPersist = useCallback((next: AccentPanel) => {
    setAccentWindow(next);
    if (record?.id != null) {
      writeAccentToStorage(record.id, next);
    }
  }, [record?.id]);

  useEffect(() => {
    if (role === "Staff" && accentWindow === "transactions") {
      setAccentAndPersist("");
    }
  }, [accentWindow, role, setAccentAndPersist]);

  /** When switching systems or first landing on show, restore map / transactions / contacts choice. */
  useLayoutEffect(() => {
    const id = record?.id;
    if (id == null) {
      return;
    }
    if (hydratedRecordIdRef.current === id) {
      return;
    }
    hydratedRecordIdRef.current = id;
    setAccentWindow(readAccentFromStorage(id));
  }, [record?.id]);

  if (!record) return null;

  const directoryContacts = getDirectoryContactsFromRecord(record);

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
    <ShowContextProvider value={controllerProps}>
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
              {record.legal_entity_name && (
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
                {isMembershipActiveByExpiration(
                  record.payment_previous_date,
                  record.payment_last_date
                )
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
                    selected={accentWindow === "map"}
                    sx={{
                      borderRadius: 0,
                      borderLeft: 0,
                      borderRight: 0,
                      borderBottom: 0,
                    }}
                    onChange={() => {
                      if (accentWindow === "map") {
                        setAccentAndPersist("");
                        return;
                      }

                      setAccentAndPersist("map");
                    }}
                  >
                    <MapPinIcon /> Show Map
                  </ToggleButton>
                  {role !== "Staff" && (
                    <ToggleButton
                      value="transactions"
                      selected={accentWindow === "transactions"}
                      sx={{
                        borderRadius: 0,
                        borderLeft: 0,
                        borderRight: 0,
                        borderBottom: 0,
                      }}
                      onChange={() => {
                        if (accentWindow === "transactions") {
                          setAccentAndPersist("");
                          return;
                        }

                        setAccentAndPersist("transactions");
                      }}
                    >
                      <MapPinIcon /> View Transactions
                    </ToggleButton>
                  )}
                  <ToggleButton
                    value="directory"
                    selected={accentWindow === "directory"}
                    sx={{
                      borderRadius: 0,
                      borderLeft: 0,
                      borderRight: 0,
                      borderBottom: 0,
                    }}
                    onChange={() => {
                      if (accentWindow === "directory") {
                        setAccentAndPersist("");
                        return;
                      }
                      setAccentAndPersist("directory");
                    }}
                  >
                    <ContactsIcon sx={{ mr: 0.5 }} /> View Contacts
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
          {role !== "Staff" && accentWindow === "transactions" && (
            <Box
              sx={{
                width: "100%",
              }}
            >
              <CustomSecondaryHeader title="Transactions" />
              <SimpleInvoicesList filters={{ entity_id: record.id }} />
            </Box>
          )}
          {accentWindow === "directory" && (
            <Box
              sx={{
                width: "100%",
                minWidth: 0,
                alignSelf: "stretch",
              }}
            >
              <CustomSecondaryHeader
                title="Contacts"
                Component={
                  role === "Admin"
                    ? () => (
                        <IconButton
                          aria-label="Add contact"
                          onClick={() => {
                            setContactCreateDefaultValues({
                              contact_type: "watersystem",
                            });
                            setLinkNewContactToWatersystemId(record.id);
                            setIsContactModalOpen(true);
                          }}
                          sx={{ color: "white", mr: 0.5 }}
                          size="small"
                        >
                          <AddIcon />
                        </IconButton>
                      )
                    : undefined
                }
              />
              <Card sx={{ p: 2, mt: 1 }}>
                {directoryContacts.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No contacts linked to this system.
                    {role === "Admin"
                      ? " Use the + button in the header to add a directory contact, or open Edit to link existing contacts."
                      : " Contacts can be added or linked on the edit screen."}
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {directoryContacts.map((c) => (
                      <Box
                        key={c.id}
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 1,
                          p: 1.5,
                          textAlign: "left",
                        }}
                      >
                        <Box sx={{ fontWeight: 600 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: 1,
                            }}
                          >
                            <Link to={`/contacts/${c.id}/show`}>
                              {[c.first, c.last].filter(Boolean).join(" ") ||
                                "Contact"}{" "}
                              {c.title ? `— ${c.title}` : ""}
                            </Link>
                            {role === "Admin" && (
                              <MUIButton
                                type="button"
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  if (c.id != null) {
                                    setContactEditId(c.id);
                                  }
                                }}
                              >
                                Edit
                              </MUIButton>
                            )}
                          </Box>
                        </Box>
                        {c.email && (
                          <Box sx={{ fontSize: 14 }}>
                            <label>Email: </label> {c.email}
                          </Box>
                        )}
                        {c.phone && (
                          <Box sx={{ fontSize: 14 }}>
                            <label>Phone: </label> {c.phone}
                          </Box>
                        )}
                        {(c.address_mailing_line1 ||
                          c.address_mailing_city ||
                          c.address_mailing_zip) && (
                          <Box sx={{ fontSize: 14, mt: 0.5 }}>
                            <label>Mailing: </label>
                            {[c.address_mailing_line1, c.address_mailing_line2]
                              .filter(Boolean)
                              .join(", ")}
                            {c.address_mailing_city ||
                            c.address_mailing_state ||
                            c.address_mailing_zip
                              ? `, ${c.address_mailing_city ?? ""}${
                                  c.address_mailing_state
                                    ? `, ${c.address_mailing_state}`
                                    : ""
                                } ${c.address_mailing_zip ?? ""}`.trim()
                              : ""}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Stack>
                )}
              </Card>
            </Box>
          )}
        </Stack>
      </SimpleShowLayout>
    </ShowContextProvider>
  );
};

export default WatersystemShow;
