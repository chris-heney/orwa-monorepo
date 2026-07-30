import { DataProvider, RaRecord } from "react-admin";
import { IProject } from "../grant-manager/types";
import { formatNumber } from "../../helpers/Formators";

export const createPayloadVariables = (
  selectedApplication: RaRecord,
  fields: string[]
) => {
  const payloadVariables: Record<string, unknown> = {};
  const addedFields: Set<string> = new Set();

  fields.forEach((field) => {
    if (!addedFields.has(field)) {
      if (selectedApplication[field] !== undefined) {
        payloadVariables[field] = selectedApplication[field];
      }
      if (
        field === "point_of_contact_first" &&
        selectedApplication.point_of_contact !== undefined
      ) {
        payloadVariables[field] = selectedApplication.point_of_contact.first;
      }
      if (
        field === "point_of_contact_last" &&
        selectedApplication.point_of_contact !== undefined
      ) {
        payloadVariables[field] = selectedApplication.point_of_contact.last;
      }
      if (field === "award_amount") {
        payloadVariables[field] = formatNumber(
          selectedApplication["award_amount"]
        );
      }
      if (field === "expected_utility_match") {
        payloadVariables[field] = selectedApplication["expected_utility_match"]
          ? formatNumber(selectedApplication["expected_utility_match"])
          : formatNumber(selectedApplication["portion_matched_by_recipient"]);
      }
      if (
        field === "approved_project_cost" &&
        selectedApplication["approved_project_cost"]
      ) {
        payloadVariables[field] = formatNumber(
          selectedApplication["approved_project_cost"]
        );
      }
      if (field === "all_fields") {
        // Create HTML table of all fields and their values
        let htmlTable = "<table>";
        for (const key in selectedApplication) {
          htmlTable += `<tr><td>${key}</td><td>${selectedApplication[key]}</td></tr>`;
        }
        htmlTable += "</table>";
        payloadVariables[field] = htmlTable;
      }
      if (
        field === "approved_projects" &&
        selectedApplication[field]?.length > 0
      ) {
        // Create comma-separated list of project names
        const projectNames = selectedApplication[field]
          .filter((project: IProject) => {
            return project.classification !== "Both";
          })
          .map((project: any) => project.name)
          .join(", ");
        payloadVariables[field] = projectNames;
      }

      addedFields.add(field);
    }
  });

  return payloadVariables;
};

export const extractFieldsFromHTML = (template: RaRecord) => {
  const body = template?.body + template?.subject;
  const regex = /{([^{}]+)}/g;
  const addedFields = new Set<string>();

  let fields;
  if (body) {
    fields = [...body.matchAll(regex)].map((match) => match[1]);
  } else {
    fields = [];
  }

  fields.forEach((field) => {
    if (!addedFields.has(field)) {
      addedFields.add(field);
    }
  });

  return Array.from(addedFields);
};

export const getGrantStatus = async (
  dataProvider: DataProvider,
  status: string
) => {
  try {
    const { data: fetchedStatus } = await dataProvider.getList(
      "grant-statuses",
      {
        pagination: { page: 1, perPage: 100 },
        sort: { field: "id", order: "ASC" },
        filter: { name: status },
        meta: {
          raw: true,
          populate: true,
        },
      }
    );

    return fetchedStatus[0]?.id as number | undefined;
  } catch (error) {
    console.error("Error:", error);
    return undefined;
  }
};



export const getRecipientDisplayInfo = (recipient: any, entityType: string) => {
  // Different display logic based on entity type and their actual schema
  switch (entityType) {
    case "watersystems":
    case "watersystem":
      return {
        id: recipient.id,
        primary: recipient.name || `Water System #${recipient.id}`,
        secondary: `${recipient.region || "No region"} | ${recipient.meters || 0} meters`,
        email: null, // watersystems don't have direct email, need to populate contacts
      };

    case "associates":
    case "associate":
      return {
        id: recipient.id,
        primary: recipient.name || `Associate #${recipient.id}`,
        secondary: `${recipient.category || "No category"} | ${recipient.member_level || "No level"}`,
        email: recipient.email || null,
      };

    case "contacts":
    case "contact":
      return {
        id: recipient.id,
        primary: `${recipient.first || ""} ${recipient.last || ""}`.trim() + (recipient.email ? ` (${recipient.email})` : "") || `Contact #${recipient.id}`,
        secondary: `${recipient.title || "No title"} | ${recipient.contact_type || "No type"}`,
        email: recipient.email || null,
      };

    case "staff":
    case "staff-member":
      // Staff members have a relation to contact, so we need to check for populated contact data
      const staffContact = recipient.contact;
      if (staffContact) {
        return {
          id: recipient.id,
          primary: `${staffContact.first || ""} ${staffContact.last || ""}`.trim() || `Staff #${recipient.id}`,
          secondary: `${staffContact.title || "Staff Member"} | ${staffContact.email || "No email"}`,
          email: staffContact.email || null,
        };
      }
      return {
        id: recipient.id,
        primary: `Staff #${recipient.id}`,
        secondary: "Staff Member",
        email: null,
      };

    case "users":
    case "user":
      return {
        id: recipient.id,
        primary: recipient.username || `User #${recipient.id}`,
        secondary: `${recipient.confirmed ? "Confirmed" : "Unconfirmed"} | ${recipient.blocked ? "Blocked" : "Active"}`,
        email: recipient.email || null,
      };

    case "training-events":
    case "training-event":
      return {
        id: recipient.id,
        primary: `${recipient.training_type} Training`,
        secondary: `${recipient.location || "No location"} | ${recipient.status || "No status"}`,
        email: null, // Training events don't have direct emails
      };

    case "training-event-registrations":
    case "training-event-registration":
      return {
        id: recipient.id,
        primary: `${recipient.first || ""} ${recipient.last || ""}`.trim() || `Registration #${recipient.id}`,
        secondary: `Class #${recipient.class_number || "N/A"} | ${recipient.phone || "No phone"}`,
        email: recipient.email || null,
      };

    case "training-instructors":
    case "training-instructor":
      // Training instructors have relations to staff and instructor (contact)
      const instructor = recipient.instructor;
      if (instructor) {
        return {
          id: recipient.id,
          primary: `${instructor.first || ""} ${instructor.last || ""}`.trim() || `Instructor #${recipient.id}`,
          secondary: `License: ${recipient.operator_license || "N/A"} | ${instructor.title || "Instructor"}`,
          email: instructor.email || null,
        };
      }
      return {
        id: recipient.id,
        primary: `Instructor #${recipient.id}`,
        secondary: `License: ${recipient.operator_license || "N/A"}`,
        email: null,
      };

    case "conference-attendees":
    case "conference-attendee":
      return {
        id: recipient.id,
        primary: `${recipient.first || ""} ${recipient.last || ""}`.trim() || `Attendee #${recipient.id}`,
        secondary: `${recipient.organization || "No organization"} | ${recipient.training_type || "No training"}`,
        email: recipient.email || null,
      };

    case "conference-sponsors":
    case "conference-sponsor":
      return {
        primary: recipient.organization || `Sponsor #${recipient.id}`,
        secondary: `Amount: $${recipient.amount || 0} | ${recipient.phone || "No phone"}`,
        email: recipient.email || null,
      };

    case "conference-booths":
    case "conference-booth":
      return {
        primary: recipient.organization || `Booth #${recipient.id}`,
        secondary: `Booth #${recipient.booth_number || "N/A"} | $${recipient.subtotal || 0}`,
        // Booth secondary_email was removed — prefer populated registrant email.
        email:
          recipient.registration?.registrant?.email ||
          recipient.registration?.email ||
          null,
      };

    case "conference-contestants":
    case "conference-contestant":
      return {
        primary: `${recipient.first || ""} ${recipient.last || ""}`.trim() || `Contestant #${recipient.id}`,
        secondary: `${recipient.organization || "No organization"} | ${recipient.type || "No type"}`,
        email: recipient.email || null,
      };

    case "conference-registrations":
    case "conference-registration":
      // Conference registrations have a relation to registrant (contact)
      const registrant = recipient.registrant;
      if (registrant) {
        return {
          primary: `${registrant.first || ""} ${registrant.last || ""}`.trim() || recipient.organization || `Registration #${recipient.id}`,
          secondary: `${recipient.type || "No type"} | $${recipient.total || 0}`,
          email: registrant.email || null,
        };
      }
      return {
        primary: recipient.organization || `Registration #${recipient.id}`,
        secondary: `${recipient.type || "No type"} | $${recipient.total || 0}`,
        email: null,
      };

    case "grant-application-finals":
    case "grant-application-final":
      // Grant applications have relations to point_of_contact, chairman, engineer (all contacts)
      const pointOfContact = recipient.point_of_contact;
      if (pointOfContact) {
        return {
          primary: recipient.legal_entity_name || `Grant Application #${recipient.id}`,
          secondary: `${pointOfContact.first || ""} ${pointOfContact.last || ""}`.trim() || "No contact",
          email: pointOfContact.email || null,
        };
      }
      return {
        primary: recipient.legal_entity_name || `Grant Application #${recipient.id}`,
        secondary: `${recipient.county || "No county"} | ${recipient.drinking_or_wastewater || "No type"}`,
        email: null,
      };

    // Event roster entities
    case "events-annual-conference-attendee-rosters":
    case "events-annual-conference-attendee-roster":
      return {
        primary: `${recipient.first_name || ""} ${recipient.last_name || ""}`.trim() || `Attendee #${recipient.id}`,
        secondary: `${recipient.organization || "No organization"} | ${recipient.type || "No type"}`,
        email: recipient.email || null,
      };

    case "events-expo-attendee-rosters":
    case "events-expo-attendee-roster":
      return {
        primary: `${recipient.first_name || ""} ${recipient.last_name || ""}`.trim() || `Attendee #${recipient.id}`,
        secondary: `${recipient.organization || "No organization"} | ${recipient.type || "No type"}`,
        email: recipient.email || null,
      };

    case "events-fall-conference-attendee-rosters":
    case "events-fall-conference-attendee-roster":
      return {
        primary: `${recipient.first_name || ""} ${recipient.last_name || ""}`.trim() || `Attendee #${recipient.id}`,
        secondary: `${recipient.organization || "No organization"} | ${recipient.type || "No type"}`,
        email: recipient.email || null,
      };

    case "events-annual-conference-booth-rosters":
    case "events-annual-conference-booth-roster":
      return {
        primary: recipient.organization || `Booth #${recipient.id}`,
        secondary: `${recipient.member_level || "No level"} | $${recipient.fee_total || 0}`,
        email: null,
      };

    case "events-expo-booth-rosters":
    case "events-expo-booth-roster":
      return {
        primary: recipient.organization || `Booth #${recipient.id}`,
        secondary: `${recipient.member_level || "No level"} | $${recipient.fee_total || 0}`,
        email: null,
      };

    case "events-fall-conference-booth-rosters":
    case "events-fall-conference-booth-roster":
      return {
        primary: recipient.organization || `Booth #${recipient.id}`,
        secondary: `${recipient.member_level || "No level"} | $${recipient.fee_total || 0}`,
        email: null,
      };

    case "events-contestant-rosters":
    case "events-contestant-roster":
      return {
        primary: `${recipient.first_name || ""} ${recipient.last_name || ""}`.trim() || `Contestant #${recipient.id}`,
        secondary: `${recipient.organization || "No organization"} | ${recipient.event || "No event"}`,
        email: recipient.email || null,
      };

    // Additional entities
    case "taste-test-contestants":
    case "taste-test-contestant":
      return {
        primary: `${recipient.first || ""} ${recipient.last || ""}`.trim() || `Contestant #${recipient.id}`,
        secondary: `${recipient.organization || "No organization"} | Taste Test`,
        email: recipient.email || null,
      };

    case "training-topics":
    case "training-topic":
      return {
        primary: recipient.name || `Topic #${recipient.id}`,
        secondary: `${recipient.category || "No category"} | ${recipient.hours || 0} hours`,
        email: null,
      };

    case "training-settings":
    case "training-setting":
      return {
        primary: `${recipient.street || ""}, ${recipient.city || ""}`.trim() || `Setting #${recipient.id}`,
        secondary: `${recipient.phone || "No phone"} | ${recipient.hours || "No hours"}`,
        email: null,
      };

    case "conferences":
    case "conference":
      return {
        primary: recipient.name || `Conference #${recipient.id}`,
        secondary: `${recipient.status || "No status"} | ${recipient.start_date || "No date"}`,
        email: recipient.recipient_email || null,
      };

    case "venues":
    case "venue":
      return {
        primary: recipient.venue_name || `Venue #${recipient.id}`,
        secondary: `${recipient.city || "No city"} | ${recipient.phone || "No phone"}`,
        email: null,
      };

    case "assets":
    case "asset":
      return {
        primary: recipient.name || `Asset #${recipient.id}`,
        secondary: `${recipient.category || "No category"} | ${recipient.location || "No location"}`,
        email: null,
      };

    case "grants":
    case "grant":
      return {
        primary: recipient.name || `Grant #${recipient.id}`,
        secondary: `${recipient.status || "No status"} | $${recipient.grant_amount || 0}`,
        email: null,
      };

    case "invoices":
    case "invoice":
      return {
        primary: recipient.company || `Invoice #${recipient.id}`,
        secondary: `$${recipient.amount || 0} | ${recipient.payment_method || "No method"}`,
        email: recipient.email || null,
      };

    case "saved-queries":
    case "saved-query":
      return {
        primary: recipient.name || `Query #${recipient.id}`,
        secondary: `${recipient.resource || "No resource"} | ${recipient.is_public ? "Public" : "Private"}`,
        email: null,
      };

    default:
      return {
        primary: recipient.name || recipient.title || recipient.organization || `${entityType} #${recipient.id}`,
        secondary: recipient.description || recipient.email || recipient.phone || "No additional info",
        email: recipient.email || null,
      };
  }
};