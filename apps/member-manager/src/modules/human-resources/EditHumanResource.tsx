import React, { JSX, useEffect } from "react";
import {
  SimpleForm,
  Edit,
  Create,
  Identifier,
  useDataProvider,
} from "react-admin";
import { Tab } from "@mui/material";
import ContactValidate from "./contacts/components/ContactValidate";
import ContactFormFields from "./contacts/fields/ContactEditFormFields";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import InstructorFormFields from "./instructors/components/InstructorFormFields";
import StaffFormFields from "./staff/_components/StaffFormFields";
import InstructorCertficationFormFields from "./certification/components/InstructorCertficationFormFields";
import IInstructor from "../training/_types/ITrainingInstructor";
import IStaff from "./staff/StaffInterface";
import { IContact } from "../training/_types";
import CustomAvatarHeader from "../_components/CustomAvatarHeader";
import UserContextProvider from "../../context/UserContextProvider";
import RolesContextProvider from "../../context/RolesContextProvider";
import CustomToolBar from "../_components/CustomToolbar";
import { getRelationFilterId } from "../../helpers/strapiIds";

/** Strapi 5 returns `avatar: []` when empty; `[]` is truthy so `[0].url` throws. */
function contactAvatarSrc(avatar: IContact["avatar"] | undefined) {
  const path = avatar?.[0]?.url;
  return path ? `${import.meta.env.VITE_API_ENDPOINT}${path}` : undefined;
}

interface EditHumanResourceProps {
  resource: string;
  id: Identifier;
}

type TabValue =
  | "staff"
  | "training-instructors"
  | "contacts"
  | "training-instructor-certifications";

const EditHumanResource = ({ id, resource }: EditHumanResourceProps) => {
  const dataProvider = useDataProvider();
  const [instructor, setInstructor] = React.useState<IInstructor>();
  const [staff, setStaff] = React.useState<IStaff>();
  const [contact, setContact] = React.useState<IContact>();

  const fetchContextData = async (filter: unknown, source: string) => {
    const instructorData = await dataProvider.getList(source, {
      pagination: { page: 1, perPage: 100 },
      sort: { field: "id", order: "ASC" },
      filter,
      meta: {
        raw: true,
        populate: true,
      },
    });
    return instructorData.data[0];
  };

  const tabPanels = [
    {
      source: "contacts",
      label: "Contact Information",
      id: contact?.id,
      panel: <ContactFormFields />,
      validate: ContactValidate,
    },
    {
      source: "staff",
      label: "Staff Details",
      id: staff?.id,
      panel: <StaffFormFields />,
    },
    {
      source: "training-instructors",
      label: "Instructor Details",
      id: instructor?.id,
      panel: <InstructorFormFields />,
    },
    {
      source: "training-instructor-certifications",
      label: "Certifications",
      id:
        typeof instructor?.training_instructor_certification === "object"
          ? instructor?.training_instructor_certification.id
          : instructor?.training_instructor_certification,
      panel: <InstructorCertficationFormFields />,
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      if (resource === "contacts") {
        try {
          const contactData = await dataProvider.getOne("contacts", {
            id: id,
            meta: {
              raw: true,
              populate: true,
            },
          });
          setContact(contactData.data as IContact);
          if (contactData.data) {
            setInstructor(
              (await fetchContextData(
                { instructor: contactData.data.id },
                "training-instructors"
              )) as IInstructor
            );
            setStaff(
              (await fetchContextData(
                { contact: contactData.data.id },
                "staff"
              )) as IStaff
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      if (resource === "training-instructors") {
        try {
          const instructorData = await dataProvider.getOne(
            "training-instructors",
            { id: id }
          );
          setInstructor(instructorData.data as IInstructor);
          if (instructorData.data) {
            setContact(
              (await fetchContextData(
                { id: instructorData.data.instructor },
                "contacts"
              )) as IContact
            );
            setStaff(
              (await fetchContextData(
                { contact: instructorData.data.instructor },
                "staff"
              )) as IStaff
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      if (resource === "staff") {
        try {
          const staffData = await dataProvider.getOne("staff", { id: id });

          if (staffData.data) {
            const contactData = (await fetchContextData(
              { id: staffData.data.contact },
              "contacts"
            )) as IContact;
            setContact(contactData);
            const instructorData = (await fetchContextData(
              { instructor: contactData?.id },
              "training-instructors"
            )) as IInstructor;
            setInstructor(instructorData);
          }
          setStaff(staffData.data as IStaff);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [id, resource]);

  const [selectedTab, setSelectedTab] = React.useState<TabValue>(
    resource as TabValue
  );
  // split into a tab panel array and tab list array
  if (!contact) return null;

  return (
    <>
      <TabContext value={selectedTab}>
        {tabPanels.map((tab, index) => {
          return (
            <TabPanel
              sx={{ p: 0, width: "100%" }}
              value={tab.source}
              key={index}
            >
              {(index === 3 && tab.id) ||
              index === 1 ||
              index === 2 ||
              index === 0 ? (
                <UserContextProvider
                  id={getRelationFilterId(contact.user) ?? undefined}
                >
                  <RolesContextProvider>
                    <Edit
                      title={"Contacts"}
                      redirect={false}
                      id={tab.id}
                      resource={tab.source}
                      actions={false}
                    >
                      <CustomAvatarHeader
                        url={contactAvatarSrc(contact.avatar)}
                        title={
                          contact?.first
                            ? `${contact.first + " " + contact.last}`
                            : "Contact Form"
                        }
                      />
                      <TabList
                        sx={{ width: "100%" }}
                        onChange={(e: React.SyntheticEvent, v: string) =>
                          setSelectedTab(v as TabValue)
                        }
                        scrollButtons="auto"
                        variant="scrollable"
                      >
                        {tabPanels.map((tab, index) => {
                          if (
                            tab.source === "training-instructors" &&
                            !instructor
                          )
                            return;
                          if (tab.source === "staff" && !staff) return;
                          if (tab.source === "contacts" && !contact) return;
                          if (
                            tab.source ===
                              "training-instructor-certifications" &&
                            !instructor
                          )
                            return;
                          return (
                            <Tab
                              label={tab.label}
                              value={tab.source}
                              key={index}
                            />
                          );
                        })}
                      </TabList>
                      <SimpleForm
                        toolbar={<CustomToolBar redirect="/human-resources/dashboard"/>}
                        validate={tab.validate ? tab.validate : undefined}
                      >
                        {tab.panel as JSX.Element}
                      </SimpleForm>
                    </Edit>
                  </RolesContextProvider>
                </UserContextProvider>
              ) : (
                <Create
                  title={" "}
                  redirect={false}
                  sx={{ mt: 6 }}
                  resource="training-instructor-certifications"
                >
                  <CustomAvatarHeader
                    url={contactAvatarSrc(contact.avatar)}
                    title={
                      contact?.first
                        ? `${
                            contact.first + " " + contact.last
                          } - New Certification`
                        : "Contact Form"
                    }
                  />
                  <TabList
                    sx={{ width: "100%" }}
                    onChange={(e: React.SyntheticEvent, v: string) =>
                      setSelectedTab(v as TabValue)
                    }
                    scrollButtons="auto"
                    variant="scrollable"
                  >
                    {tabPanels.map((tab, index) => {
                      if (tab.source === "training-instructors" && !instructor)
                        return;
                      if (tab.source === "staff" && !staff) return;
                      if (tab.source === "contacts" && !contact) return;
                      return (
                        <Tab label={tab.label} value={tab.source} key={index} />
                      );
                    })}
                  </TabList>
                  <SimpleForm
                    validate={tab.validate ? tab.validate : undefined}
                  >
                    <InstructorCertficationFormFields
                      id={instructor?.id}
                      title="New Certification"
                    />
                  </SimpleForm>
                </Create>
              )}
            </TabPanel>
          );
        })}
      </TabContext>
    </>
  );
};

export default EditHumanResource;
