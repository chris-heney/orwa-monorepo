"use strict";

import {
  AdminOptions,
  AssociateMembershipPayload,
  IAuthNetResponse,
  IContact,
  WatersystemMembershipPayload,
  waterSystemRenewalPayload,
} from "../types";

import { findOneById, updateById } from "../../../utils/document-compat";
import { coerceToSchema } from "../../../utils/coerce-to-schema";

/**
 * membership-forms service
 */

export default ({ strapi }) => {
  // Utility function to get user by email
  const getUserIdByEmail = async (email: string) => {
    const users =
      (await strapi.plugins["users-permissions"].services.user.fetchAll({
        fields: ["id", "wp_uid"],
        filters: { email },
        limit: 1,
      })) || [];

    return users.length > 0
      ? {
          userId: users[0].id,
          wp_uid: users[0].wp_uid,
        }
      : { userId: null, wp_uid: null };
  };

  // Utility function to get or create contact
  const getContact = async (email: string, contactData: any, userData: any) => {
    const contactList =
      (await strapi.documents("api::contact.contact").findMany({
        fields: ["id", "first", "last", "phone", "contact_type"],
        filters: { email },
        limit: 1,
        populate: { user: true },
      })) || [];

    if (contactList.length === 0) {
      contactList.push(
        await strapi.documents("api::contact.contact").create({
          data: contactData,
        })
      );
    }

    if (contactList[0].user) {
      await updateContact(contactList[0].id, {
        first: contactList[0].first ? contactList[0].first : contactData.first,
        last: contactList[0].last ? contactList[0].last : contactData.last,
        phone: contactList[0].phone ? contactList[0].phone : contactData.phone,
      });

      return {
        ...contactList[0],
        user: contactList[0].user?.id,
        passport: contactList[0].user?.wp_uid,
      };
    }

    if (contactList[0].first || contactList[0].last || contactList[0].phone) {
      await updateContact(contactList[0].id, {
        first: contactList[0].first ? contactList[0].first : contactData.first,
        last: contactList[0].last ? contactList[0].last : contactData.last,
        phone: contactList[0].phone ? contactList[0].phone : contactData.phone,
      });
    }

    const { userId, wp_uid } = await getUserIdByEmail(email);

    if (userId) {
      await updateContact(contactList[0].id, { user: userId });
      return {
        ...contactList[0],
        user: userId,
        passport: wp_uid,
      };
    }

    const user = await strapi.plugins["users-permissions"].services.user.add(
      userData
    );

    return {
      ...contactList[0],
      user: user.id,
      passport: null,
    };
  };

  // Utility function to update contact
  const updateContact = async (contactId: number, contact: Partial<any>) => {
    const response = await updateById("api::contact.contact", contactId, {
      data: contact,
    });
    return response.data;
  };

  /** Only attributes that exist on `api::watersystem.watersystem` (excludes form-only / nested keys). */
  const WATERSYSTEM_ENTITY_KEYS = [
    "name",
    "region",
    "office_hours",
    "meters",
    "url",
    "board_meeting",
    "funding",
    "orwaag",
    "workmans_comp",
    "county",
    "total_years",
    "member_type",
    "email",
    "phone",
    "fax",
    "latitude",
    "longitude",
    "address_mailing_pobox",
    "address_mailing_city",
    "address_mailing_state",
    "address_mailing_zip",
    "address_physical_line1",
    "address_physical_line2",
    "address_physical_city",
    "address_physical_state",
    "address_physical_zip",
    "membership_directory_type",
    "payment_last_date",
    "payment_method",
    "payment_amount",
    "fee_connections",
    "fee_membership",
    "fee_scholarship",
    "fee_apprenticeship",
    "application_date",
    "wp_uid",
    "wp_eid",
    "payment_details",
    "legal_entity_name",
    "directory_sent_date",
    "soonerwarn",
    "directory_mailed",
    "payment_previous_date",
    "expiration_notification_sent",
  ] as const;

  const pickWatersystemEntityData = (data: Record<string, any>) => {
    const out: Record<string, any> = {};
    for (const key of WATERSYSTEM_ENTITY_KEYS) {
      if (data[key] !== undefined) {
        out[key] = data[key];
      }
    }
    return out;
  };

  /** A directory row is included when a title is provided (form validates the rest). */
  const isWatersystemDirectoryContactRow = (row: IContact | Record<string, any>) =>
    !!(row && String(row.title ?? "").trim());

  const buildWatersystemDirectoryContactData = (row: IContact | Record<string, any>) => {
    const trim = (v: unknown) => (typeof v === "string" ? v.trim() : "");
    const l1 = trim(row.address_mailing_line1);
    const l2 = trim(row.address_mailing_line2);
    const city = trim(row.address_mailing_city);
    const st = row.address_mailing_state
      ? String(row.address_mailing_state).trim()
      : "";
    const zip = trim(row.address_mailing_zip);
    const hasAddress = !!(l1 || l2 || city || st || zip);

    const base: Record<string, any> = {
      first: trim(row.first) || null,
      last: trim(row.last) || null,
      phone: trim(row.phone) || null,
      title: trim(row.title) || null,
      contact_type: "watersystem",
      directory_opt_out: !!row.directory_opt_out,
    };

    if (hasAddress) {
      base.address_mailing_line1 = l1 || null;
      base.address_mailing_line2 = l2 || null;
      base.address_mailing_city = city || null;
      base.address_mailing_state = st || null;
      base.address_mailing_zip = zip || null;
    } else {
      base.address_mailing_line1 = null;
      base.address_mailing_line2 = null;
      base.address_mailing_city = null;
      base.address_mailing_state = null;
      base.address_mailing_zip = null;
    }
    return base;
  };

  /**
   * Creates/updates directory contacts and returns their ids for the watersystem relation.
   * Rows with email reuse `getContact` (user linking). Rows without email create standalone contacts.
   */
  const syncWatersystemDirectoryContacts = async (data: {
    contacts?: IContact[];
  }) => {
    const rows = Array.isArray(data.contacts) ? data.contacts : [];
    const ids: number[] = [];

    for (const row of rows) {
      if (!isWatersystemDirectoryContactRow(row)) continue;
      const payload = buildWatersystemDirectoryContactData(row);
      const emailRaw =
        typeof row.email === "string" ? row.email.trim() : "";

      if (emailRaw) {
        const userData = {
          ...user_base,
          username: emailRaw,
          email: emailRaw,
        };
        const contactData = { ...payload, email: emailRaw };
        const fetched = await getContact(emailRaw, contactData, userData);
        const contactId = fetched.id as number;
        await updateContact(contactId, { ...payload, email: emailRaw });
        ids.push(contactId);
      } else {
        const created = await strapi.documents("api::contact.contact").create({
          data: payload,
        });
        ids.push(created.id);
      }
    }

    return ids;
  };

  // Base user data object
  const user_base = {
    provider: "local",
    confirmed: true,
    blocked: false,
    role: 9,
    username: "",
    email: "",
    password: "password",
  };

  const PAYMENT_GATEWAY_API = "https://api.authorize.net/xml/v1/request.api";
  const PAYMENT_GATEWAY_LOGIN = "7u228GQk2DK";
  const PAYMENT_GATEWAY_KEY = "56nen4B5v4P35H3A";
  // const PAYMENT_GATEWAY_API_SANDBOX =
  // "https://apitest.authorize.net/xml/v1/request.api";
  // const PAYMENT_GATEWAY_LOGIN_SANDBOX = "3946T8QkQw2";
  // const PAYMENT_GATEWAY_KEY_SANDBOX = "67wC6W9s3b3yj9Cj";

  interface paymentData {
    address_billing_line1: string;
    address_billing_city: string;
    address_billing_state: string;
    address_billing_zip: string;
    billing_first_name: string;
    billing_last_name: string;
    company: string;
    billing_email: string;
    billing_phone: string;
    payment_information: {
      card: string;
      exp: string;
      cvv: string;
    };
    amount: number;
  }

  const submitPayment = async (data: paymentData) => {
    // const state =
    //   state_map.find((state) => state[data.address_billing_state])?.[
    //     data.address_billing_state
    //   ] ?? data.address_billing_state;

    const createTransactionRequest = {
      createTransactionRequest: {
        merchantAuthentication: {
          name: PAYMENT_GATEWAY_LOGIN,
          transactionKey: PAYMENT_GATEWAY_KEY,
        },
        transactionRequest: {
          transactionType: "authCaptureTransaction",
          amount: data.amount,
          payment: {
            creditCard: {
              cardNumber: data.payment_information.card.replace(/\s/g, ""),
              expirationDate: data.payment_information.exp,
              cardCode: data.payment_information.cvv,
            },
          },
          billTo: {
            firstName: data.billing_first_name,
            lastName: data.billing_last_name,
            company: data.company,
            address:
              data.address_billing_line1 +
              " " +
              data.address_billing_city +
              " " +
              data.address_billing_state +
              " " +
              data.address_billing_zip,
            // city: data.address_billing_city,
            // zip: data.address_billing_zip,
            faxNumber: data.billing_phone,
            email: data.billing_email,
            // state: state,
            // country: "US",
          },
          // customerIP: '192.168.1.1',
        },
      },
    };

    // @TODO: _FUTURE_ Extract Authorize.Net API Call to a shared strapi service!
    // const authorizeNetResponse = await strapi.services.authorizeNet.createTransaction(payload);

    const authorizeNetResponse: IAuthNetResponse = (await (
      await fetch(PAYMENT_GATEWAY_API, {
        method: "POST",
        body: JSON.stringify(createTransactionRequest),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json()) as IAuthNetResponse;

    console.log("- Authorize.Net:", JSON.stringify(authorizeNetResponse));
    console.log(
      "-------------------------------------------------------------"
    );

    if (authorizeNetResponse.messages.resultCode !== "Ok") {
      return {
        result: "error",
        message: authorizeNetResponse.messages.message[0].text,
        data: authorizeNetResponse,
      };
    }

    return {
      auth_code: authorizeNetResponse.transactionResponse.authCode,
      transaction_id: authorizeNetResponse.transactionResponse.transId,
      network_trans_id: authorizeNetResponse.transactionResponse.networkTransId,
    };
  };

  const sendAssociateEmail = async (
    payload: AssociateMembershipPayload,
    subject: string
  ) => {
    const html = `
      <html>
      <body style="font-family: Arial, sans-serif; color: black;">
        <table style="width: 100%; margin: auto; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0,0,0,0.1);">
          <thead>
            <tr>
              <th colspan="2" style="text-align: center; padding-bottom: 20px; color: black;">
                <h2>${subject}</h2>
                <p style="color: #666;">Details for Associate: <strong>${
                  payload.associate
                }</strong></p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="2" style="padding-bottom: 10px; padding-left: 10px; border-bottom: 1px solid #eee;">
                <h3 style="font: bold;">Basic Information</h3>
              </td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px;"><strong>Name:</strong></td>
              <td style="padding: 10px;">${payload.name}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px;"><strong>Category:</strong></td>
              <td style="padding: 10px;">${payload.category}</td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px;"><strong>Member Level:</strong></td>
              <td style="padding: 10px;">${payload.membership}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px;"><strong>Phone:</strong></td>
              <td style="padding: 10px;">${payload.phone}</td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px;"><strong>Email:</strong></td>
              <td style="padding: 10px;">${payload.email}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px;"><strong>Website:</strong></td>
              <td style="padding: 10px;">${payload.website}</td>
            </tr>
            <tr>
            <td colspan="2" style="padding-bottom: 10px; padding-left: 10px; border-bottom: 1px solid #eee;">
            <h3 style="font: bold;">Address Information</h3>
              </td>
            </tr>
             ${
               payload.address_street
                 ? `
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px;"><strong>Primary Mailing Address:</strong></td>
              <td style="padding: 10px;">${payload.address_street}, ${payload.address_city}, ${payload.address_state}, ${payload.address_zip}</td>
            </tr>`
                 : ""
             }

            ${
              payload.mailing_address_street
                ? `<tr style="background-color: #f9f9f9;">
              <td style="padding: 10px;"><strong>Secondary Mailing Address:</strong></td>
              <td style="padding: 10px;">${payload.mailing_address_street}, ${payload.mailing_address_city}, ${payload.mailing_address_state}, ${payload.mailing_address_zip}</td>
            </tr>`
                : ""
            }         
           
            <tr>
            <td colspan="2" style="padding-bottom: 10px; padding-left: 10px; border-bottom: 1px solid #eee;">
            <h3 style="font: bold;">Billing Information</h3>
              </td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px;"><strong>Billing Email:</strong></td>
              <td style="padding: 10px;">${payload.billing_email}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px;"><strong>Billing Phone:</strong></td>
              <td style="padding: 10px;">${payload.billing_phone}</td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px;"><strong>Billing Name:</strong></td>
              <td style="padding: 10px;">${
                payload.billing_first_name + " " + payload.billing_last_name
              }</td>
            </tr>
  
            <tr>
            <td colspan="2" style="padding-bottom: 10px; padding-left: 10px; border-bottom: 1px solid #eee;">
            <h3 style="font: bold;">Payment Information</h3>
              </td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px;"><strong>Payment Method:</strong></td>
              <td style="padding: 10px;">${payload.payment_method}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px;"><strong>Payment Amount:</strong></td>
              <td style="padding: 10px;">$${payload.payment_amount}</td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px;"><strong>Membership Fee:</strong></td>
              <td style="padding: 10px;">$${payload.fee_membership}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px;"><strong>Scholarship Fee:</strong></td>
              <td style="padding: 10px;">$${payload.fee_scholarship}</td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px;"><strong>Payment Details:</strong></td>
              <td style="padding: 10px;">${payload.payment_details}</td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>`;

    const emailPayloadOffice = {
      to: "office@orwa.org",
      // to: "marcosje2005@gmail.com",
      from: "website@orwa.org",
      subject,
      html,
    };

    const myEmailPayload = {
      to: "marcosje2005@gmail.com",
      from: "website@orwa.org",
      subject,
      html,
    };

    const recipient = {
      to: payload.billing_email,
      // to: "marcosje2005@gmail.com",
      from: "website@orwa.org",
      subject,
      html,
    };

    await strapi.plugins["email"].services.email.send(myEmailPayload);

    if (payload.adminOptions) {
      const { registrantNotification, adminNotification, customEmail } =
        payload.adminOptions as AdminOptions;

      if (registrantNotification && !customEmail) {
        await strapi.plugins["email"].services.email.send(recipient);
      }

      if (adminNotification && !customEmail) {
        await strapi.plugins["email"].services.email.send(emailPayloadOffice);
      }

      if (customEmail) {
        const emails = (customEmail as string).split(",");

        emails.forEach(async (email) => {
          await strapi.plugins["email"].services.email.send({
            to: email.trim(),
            from: "website@orwa.org",
            subject,
            html,
          });
        });
      }
    } else {
      await strapi.plugins["email"].services.email.send(emailPayloadOffice);
      await strapi.plugins["email"].services.email.send(recipient);
    }
  };

  const escapeHtml = (value: unknown) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const isDirectoryContactRowPresent = (row: IContact) => {
    const t = (v: unknown) => (typeof v === "string" ? v.trim() : "");
    return !!(
      t(row.title) ||
      t(row.first) ||
      t(row.last) ||
      t(row.email) ||
      t(row.phone) ||
      t(row.address_mailing_line1) ||
      t(row.address_mailing_line2) ||
      t(row.address_mailing_city) ||
      t(row.address_mailing_state) ||
      t(row.address_mailing_zip)
    );
  };

  const buildWatersystemDirectoryContactsEmailSection = (
    contacts?: IContact[]
  ): string => {
    if (!Array.isArray(contacts) || contacts.length === 0) return "";
    const rows = contacts.filter((c) => c && isDirectoryContactRowPresent(c));
    if (rows.length === 0) return "";

    const contactBlocks = rows
      .map((c, index) => {
        const name = [c.first, c.last]
          .map((x) => (typeof x === "string" ? x.trim() : ""))
          .filter(Boolean)
          .join(" ");
        const cityState = [c.address_mailing_city, c.address_mailing_state]
          .map((x) => (typeof x === "string" ? x.trim() : ""))
          .filter(Boolean)
          .join(", ");
        const mailLine = [
          c.address_mailing_line1,
          c.address_mailing_line2,
        ]
          .map((x) => (typeof x === "string" ? x.trim() : ""))
          .filter(Boolean)
          .join(", ");
        const zip = typeof c.address_mailing_zip === "string" ? c.address_mailing_zip.trim() : "";
        const mailing = [mailLine, cityState, zip].filter(Boolean).join(", ");

        const titleRow = c.title
          ? `<tr><td style="padding:2px 8px 2px 0; width:120px; vertical-align:top;"><strong>Title</strong></td><td style="padding:2px 0;">${escapeHtml(
              c.title
            )}</td></tr>`
          : "";
        const nameRow = name
          ? `<tr><td style="padding:2px 8px 2px 0; vertical-align:top;"><strong>Name</strong></td><td style="padding:2px 0;">${escapeHtml(
              name
            )}</td></tr>`
          : "";
        const emailRow = c.email
          ? `<tr><td style="padding:2px 8px 2px 0; vertical-align:top;"><strong>Email</strong></td><td style="padding:2px 0;">${escapeHtml(
              c.email
            )}</td></tr>`
          : "";
        const phoneRow = c.phone
          ? `<tr><td style="padding:2px 8px 2px 0; vertical-align:top;"><strong>Phone</strong></td><td style="padding:2px 0;">${escapeHtml(
              c.phone
            )}</td></tr>`
          : "";
        const mailRow = mailing
          ? `<tr><td style="padding:2px 8px 2px 0; vertical-align:top;"><strong>Mailing</strong></td><td style="padding:2px 0;">${escapeHtml(
              mailing
            )}</td></tr>`
          : "";
        const optOutRow = c.directory_opt_out
          ? `<tr><td style="padding:2px 8px 2px 0; vertical-align:top;"><strong>Directory</strong></td><td style="padding:2px 0;">Opted out (not published)</td></tr>`
          : `<tr><td style="padding:2px 8px 2px 0; vertical-align:top;"><strong>Directory</strong></td><td style="padding:2px 0;">Published</td></tr>`;

        return `
            <tr style="background-color: ${
              index % 2 === 0 ? "#ffffff" : "#f9f9f9"
            };">
              <td colspan="2" style="padding: 12px 10px; vertical-align: top;">
                <strong style="display:block; margin-bottom:6px;">Directory contact ${
                  index + 1
                }</strong>
                <table role="presentation" style="width:100%; border-collapse: collapse; font-size: 14px;">
                  ${titleRow}
                  ${nameRow}
                  ${emailRow}
                  ${phoneRow}
                  ${mailRow}
                  ${optOutRow}
                </table>
              </td>
            </tr>`;
      })
      .join("");

    return `
            <tr>
              <td colspan="2" style="padding-bottom: 10px; padding-left: 10px; border-bottom: 1px solid #eee;">
                <h3 style="font: bold;">Directory contacts (office roster)</h3>
              </td>
            </tr>
            ${contactBlocks}`;
  };

  const sendWatersystemEmail = async (
    payload: waterSystemRenewalPayload,
    subject: string
  ) => {
    const directoryContactsHtml =
      buildWatersystemDirectoryContactsEmailSection(payload.contacts);

    const html = `     
        <html>
        <body style="font-family: Arial, sans-serif; color: black;">
          <table style="width: 100%; margin: auto; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0,0,0,0.1);">
            <thead>
              <tr>
                <th colspan="2" style="text-align: center; padding-bottom: 20px; color: black;">
                  <h2>${subject}</h2>
                  <p style="color: #666;">Details for Watersystem: <strong>${
                    payload.watersystem
                  }</strong></p>
                </th>
              </tr>
            </thead>
            <tbody>
            <!-- Basic Information -->
            <tr>
            <td colspan="2" style="padding-bottom: 10px; padding-left: 10px; border-bottom: 1px solid #eee;">
                <h3 style="font: bold;">Basic Information</h3>
              </td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px;"><strong>Watersystem Name:</strong></td>
              <td style="padding: 10px;">${payload.name}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px;"><strong>Phone:</strong></td>
              <td style="padding: 10px;">${payload.phone}</td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px;"><strong>Email:</strong></td>
              <td style="padding: 10px;">${payload.email}</td>
            </tr>
        
            <!-- Address Information -->
            <tr>
            <td colspan="2" style="padding-bottom: 10px; padding-left: 10px; border-bottom: 1px solid #eee;">
                <h3 style="font: bold;"">Address Information</h3>
              </td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px;"><strong>Mailing Address:</strong></td>
              <td style="padding: 10px;">${payload.address_mailing_pobox}, ${
      payload.address_mailing_city
    }, ${payload.address_mailing_state}, ${payload.address_mailing_zip}</td>
            </tr>
            ${
              payload.address_physical_line1
                ? `
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px;"><strong>Physical Address:</strong></td>
              <td style="padding: 10px;">${payload.address_physical_line1}, ${payload.address_physical_city}, ${payload.address_physical_state}, ${payload.address_physical_zip}</td>
            </tr>`
                : ""
            }
            ${directoryContactsHtml}

            <!-- Billing Information -->
            <tr>
            <td colspan="2" style="padding-bottom: 10px; padding-left: 10px; border-bottom: 1px solid #eee;">
                <h3 style="font: bold;">Billing Information</h3>
              </td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px;"><strong>Billing Email:</strong></td>
              <td style="padding: 10px;">${payload.billing_email}</td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px;"><strong>Billing Phone:</strong></td>
              <td style="padding: 10px;">${payload.billing_phone}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px;"><strong>Billing Name:</strong></td>
              <td style="padding: 10px;">${payload.billing_first_name} ${
      payload.billing_last_name
    }</td>
            </tr>

            <!-- Payment Information -->
            <tr>
            <td colspan="2" style="padding-bottom: 10px; padding-left: 10px; border-bottom: 1px solid #eee;">
                <h3 style="font: bold;">Payment Information</h3>
              </td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px;"><strong>Payment Method:</strong></td>
              <td style="padding: 10px;">${payload.payment_method}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px;"><strong>Payment Amount:</strong></td>
              <td style="padding: 10px;">$${payload.payment_amount}</td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px;"><strong>Membership Fee:</strong></td>
              <td style="padding: 10px;">$${payload.fee_membership}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px;"><strong>Scholarship Fee:</strong></td>
              <td style="padding: 10px;">$${payload.fee_scholarship}</td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px;"><strong>Payment Details:</strong></td>
              <td style="padding: 10px;">${payload.payment_details}</td>
            </tr>
          </tbody>
          </table>
        </body>
        </html>`;

    const emailPayloadOffice = {
      to: "office@orwa.org",
      // to: "marcosje2005@gmail.com",
      from: "website@orwa.org",
      subject,
      html,
    };

    const myEmailPayload = {
      to: "marcosje2005@gmail.com",
      from: "website@orwa.org",
      subject,
      html,
    };

    const recipient = {
      to: payload.billing_email,
      // to: "marcosje2005@gmail.com",
      from: "website@orwa.org",
      subject,
      html,
    };

    await strapi.plugins["email"].services.email.send(myEmailPayload);

    if (payload.adminOptions) {
      const { registrantNotification, adminNotification, customEmail } =
        payload.adminOptions as AdminOptions;

      if (registrantNotification && !customEmail) {
        await strapi.plugins["email"].services.email.send(recipient);
      }

      if (adminNotification && !customEmail) {
        await strapi.plugins["email"].services.email.send(emailPayloadOffice);
      }

      if (customEmail) {
        const emails = (customEmail as string).split(",");

        emails.forEach(async (email) => {
          await strapi.plugins["email"].services.email.send({
            to: email.trim(),
            from: "website@orwa.org",
            subject,
            html,
          });
        });
      }
    } else {
      await strapi.plugins["email"].services.email.send(emailPayloadOffice);
      await strapi.plugins["email"].services.email.send(recipient);
    }
  };

  const logFormData = async (data: any, resource: string) => {
    await strapi.documents("api::log.log").create({
      data: {
        data: {
          ...data,
          payment_information: null,
          user_agent: data.user_agent,
        },
        resource,
      },
    });
  };
  // Exported service functions
  return {
    watersystemMembershipApplication: async (
      data: WatersystemMembershipPayload
    ) => {
      let payment: any;

      if (
        (data.adminOptions && data.adminOptions.resubmit) ||
        !data.adminOptions
      ) {
        await logFormData(data, "watersystems");

        try {
          const system_type_dirty = data.system_type_dirty.join(", ");

          if (data.payment_method === "Card") {
            payment = await submitPayment({
              address_billing_line1: data.address_billing_line1,
              address_billing_city: data.address_billing_city,
              address_billing_state: data.address_billing_state,
              address_billing_zip: data.address_billing_zip,
              billing_email: data.billing_email,
              billing_phone: data.billing_phone,
              amount: data.payment_amount,
              billing_first_name: data.billing_first_name,
              billing_last_name: data.billing_last_name,
              company: data.legal_entity_name,
              payment_information: data.payment_information as any,
            });

            if (payment?.result === "error") {
              return {
                message: "error",
                error: payment.message,
              };
            }
          }

          const response = await strapi.documents("api::watersystem.watersystem").create({
            data: coerceToSchema("api::watersystem.watersystem", {
              ...pickWatersystemEntityData(data),
              system_type_dirty: system_type_dirty,
              total_years: data.payment_method === "Card" ? 1 : 0,
              application_date: new Date().toISOString(),
              payment_last_date:
                data.payment_method === "Card"
                  ? new Date().toISOString()
                  : null,
            }),
          });

          if (data.contacts !== undefined && Array.isArray(data.contacts)) {
            const contactIds = await syncWatersystemDirectoryContacts(data);
            await strapi.documents("api::watersystem.watersystem").update({
              documentId: response.documentId,
              data: { contacts: contactIds }
            });
          }

          // Submit transaction
          try {
            await strapi.documents("api::invoice.invoice").create({
              data: coerceToSchema("api::invoice.invoice", {
                ...payment,
                amount: data.payment_amount,
                context: "membership-form",
                resource: "watersystems",
                entity_id: response.id,
                email: data.billing_email,
                company: data.name,
                payment_details: data.payment_details,
                payment_method: data.payment_method,
                data: { ...data, payment_information: null },
                year: new Date().getFullYear(),
                payment_date:
                  data.payment_method === "Card"
                    ? new Date().toISOString()
                    : null,
              }),
            });
          } catch (error) {
            return {
              message: "error",
              error: error.message,
            };
          }

          sendWatersystemEmail(
            { ...data, watersystem: response.id },
            `ORWA System Membership - ${data.legal_entity_name}`
          );

          return {
            message: "success",
            response,
          };
        } catch (error) {
          return {
            message: "error",
            error: error.details.errors,
          };
        }
      } else {
        sendWatersystemEmail(
          { ...data, watersystem: "0" },
          `ORWA System Membership - ${data.legal_entity_name}`
        );
        return {
          message: "success",
        };
      }
    },
    associateMembershipApplication: async (
      data: AssociateMembershipPayload
    ) => {
      if (
        (data.adminOptions && data.adminOptions.resubmit) ||
        !data.adminOptions
      ) {
        try {
          let contact_primary = null as number | null;
          let contact_secondary = null as number | null;
          let payment: any;

          await logFormData(data, "associates");

          // Handle priamry contact

          const contactData = {
            first: data.contact_primary.first,
            last: data.contact_primary.last,
            email: data.contact_primary.email,
            phone: data.contact_primary.phone,
            title: data.contact_primary.title,
          };

          const userData = {
            ...user_base,
            username: data.contact_primary.email,
            email: data.contact_primary.email,
          };

          const fetchedPrimaryContact = await getContact(
            data.contact_primary.email,
            contactData,
            userData
          );

          contact_primary = fetchedPrimaryContact.id;

          // Handle secondary contact

          if (data.contact_secondary.email) {
            const contactData = {
              first: data.contact_secondary.first,
              last: data.contact_secondary.last,
              email: data.contact_secondary.email,
              phone: data.contact_secondary.phone,
              title: data.contact_secondary.title,
            };

            const userData = {
              ...user_base,
              username: data.contact_secondary.email,
              email: data.contact_secondary.email,
            };

            const fetchedSecondaryContact = await getContact(
              data.contact_secondary.email,
              contactData,
              userData
            );

            contact_secondary = fetchedSecondaryContact.id;
          }

          if (data.payment_method === "Card") {
            payment = await submitPayment({
              address_billing_line1: data.address_billing_line1,
              address_billing_city: data.address_billing_city,
              address_billing_state: data.address_billing_state,
              address_billing_zip: data.address_billing_zip,
              billing_email: data.billing_email,
              billing_phone: data.billing_phone,
              amount: data.payment_amount,
              billing_first_name: data.billing_first_name,
              billing_last_name: data.billing_last_name,
              company: data.name,
              payment_information: data.payment_information as any,
            });

            if (payment?.result === "error") {
              return {
                message: "error",
                error: payment.message,
              };
            }
          }

          // coerceToSchema strips form-only keys (adminOptions, payment_information,
          // billing_*, user_agent, ...) that Strapi 5 rejects as "Invalid key".
          const response = await strapi.documents("api::associate.associate").create({
            data: coerceToSchema("api::associate.associate", {
              ...data,
              total_years: data.payment_method === "Card" ? 1 : 0,
              contact_primary: contact_primary,
              contact_secondary: contact_secondary,
              application_date: new Date().toISOString(),
              payment_last_date:
                data.payment_method === "Card"
                  ? new Date().toISOString()
                  : null,
            }),
          });

          try {
            await strapi.documents("api::invoice.invoice").create({
              data: coerceToSchema("api::invoice.invoice", {
                ...payment,
                amount: data.payment_amount,
                context: "membership-form",
                resource: "associates",
                entity_id: response.id,
                email: data.billing_email,
                company: data.name,
                payment_details: data.payment_details,
                payment_method: data.payment_method,
                year: new Date().getFullYear(),
                data: { ...data, payment_information: null },
                payment_date:
                  data.payment_method === "Card"
                    ? new Date().toISOString()
                    : null,
              }),
            });
          } catch (error) {
            return {
              message: "error",
              error: error.message,
            };
          }

          // Fetched membership with id

          const membership = await findOneById("api::membership.membership", data.membership, {
            populate: "*",
          });

          await sendAssociateEmail(
            {
              ...data,
              associate: response.id,
              total_years: 1,
              membership: membership?.name,
            },
            `ORWA Associate Membership - ${data.name}`
          );

          return {
            message: "success",
            response,
          };
        } catch (error) {
          return {
            message: "error",
            error: error.details.errors,
          };
        }
      } else {
        const membership = await findOneById("api::membership.membership", data.membership, {
          populate: "*",
        });

        sendAssociateEmail(
          { ...data, associate: "0", membership: membership?.name },
          `ORWA Associate Membership - ${data.name}`
        );
        return {
          message: "success",
        };
      }
    },
    watersystemMembershipRenewal: async (data: waterSystemRenewalPayload) => {
      if (
        (data.adminOptions && data.adminOptions.resubmit) ||
        !data.adminOptions
      ) {
        try {
          let payment: any;
          await logFormData(data, "watersystems");

          const system_type_dirty = data.system_type_dirty.join(", ");

          if (data.payment_method === "Card") {
            const payment = await submitPayment({
              address_billing_line1: data.address_billing_line1,
              address_billing_city: data.address_billing_city,
              address_billing_state: data.address_billing_state,
              address_billing_zip: data.address_billing_zip,
              billing_email: data.billing_email,
              billing_phone: data.billing_phone,
              amount: data.payment_amount,
              billing_first_name: data.billing_first_name,
              billing_last_name: data.billing_last_name,
              company: data.legal_entity_name,
              payment_information: data.payment_information as any,
            });

            if (payment?.result === "error") {
              return {
                message: "error",
                error: payment.message,
              };
            }
          }

          const watersystemId = parseInt(data.watersystem);

          const contactIds =
            data.contacts !== undefined && Array.isArray(data.contacts)
              ? await syncWatersystemDirectoryContacts(data)
              : null;

          const renewalData: Record<string, any> = {
            ...pickWatersystemEntityData(data),
            system_type_dirty: system_type_dirty,
            application_date: new Date().toISOString(),
            payment_previous_date: data.payment_last_date,
            total_years:
              data.payment_method === "Card" && data.total_years
                ? data.total_years + 1
                : data.total_years,
            payment_last_date:
              data.payment_method === "Card"
                ? new Date().toISOString()
                : null,
          };
          if (contactIds !== null) {
            renewalData.contacts = contactIds;
          }

          const response = await updateById("api::watersystem.watersystem", watersystemId, {
            data: coerceToSchema("api::watersystem.watersystem", renewalData),
          });

          try {
            await strapi.documents("api::invoice.invoice").create({
              data: coerceToSchema("api::invoice.invoice", {
                ...payment,
                amount: data.payment_amount,
                context: "membership-form",
                resource: "watersystems",
                entity_id: watersystemId,
                email: data.billing_email,
                company: data.name,
                data: { ...data, payment_information: null },
                payment_details: data.payment_details,
                payment_method: data.payment_method,
                year: new Date().getFullYear(),
                payment_date:
                  data.payment_method === "Card"
                    ? new Date().toISOString()
                    : null,
              }),
            });
          } catch (error) {
            return {
              message: "error",
              error: error.message,
            };
          }

          await sendWatersystemEmail(
            {
              ...data,
              watersystem: response.id,
              total_years: data.total_years ? data.total_years + 1 : 1,
            },
            `ORWA System Membership Renewal - ${data.legal_entity_name}`
          );

          return {
            message: "success",
            response,
          };
        } catch (error) {
          return {
            message: "error",
            error: error.message,
          };
        }
      } else {
        sendWatersystemEmail(
          { ...data, watersystem: data.watersystem },
          `ORWA System Membership - ${data.legal_entity_name}`
        );
        return {
          message: "success",
        };
      }
    },
    associateMembershipRenewal: async (data: AssociateMembershipPayload) => {
      if (
        (data.adminOptions && data.adminOptions.resubmit) ||
        !data.adminOptions
      ) {
        try {
          let contact_primary = null as number | null;
          let contact_secondary = null as number | null;
          let payment: any;

          await logFormData(data, "associates");

          // Handle priamry contact

          const contactData = {
            first: data.contact_primary.first,
            last: data.contact_primary.last,
            email: data.contact_primary.email,
            phone: data.contact_primary.phone,
            title: data.contact_primary.title,
          };

          const userData = {
            ...user_base,
            username: data.contact_primary.email,
            email: data.contact_primary.email,
          };

          const fetchedPrimaryContact = await getContact(
            data.contact_primary.email,
            contactData,
            userData
          );

          contact_primary = fetchedPrimaryContact.id;

          // Handle secondary contact

          if (data.contact_secondary.email) {
            const contactData = {
              first: data.contact_secondary.first,
              last: data.contact_secondary.last,
              email: data.contact_secondary.email,
              phone: data.contact_secondary.phone,
              title: data.contact_secondary.title,
            };

            const userData = {
              ...user_base,
              username: data.contact_secondary.email,
              email: data.contact_secondary.email,
            };

            const fetchedSecondaryContact = await getContact(
              data.contact_secondary.email,
              contactData,
              userData
            );

            contact_secondary = fetchedSecondaryContact.id;
          }

          if (data.payment_method === "Card") {
            payment = await submitPayment({
              address_billing_line1: data.address_billing_line1,
              address_billing_city: data.address_billing_city,
              address_billing_state: data.address_billing_state,
              address_billing_zip: data.address_billing_zip,
              billing_email: data.billing_email,
              billing_phone: data.billing_phone,
              amount: data.payment_amount,
              billing_first_name: data.billing_first_name,
              billing_last_name: data.billing_last_name,
              company: data.name,
              payment_information: data.payment_information as any,
            });

            if (payment?.result === "error") {
              return {
                message: "error",
                error: payment.message,
              };
            }
          }

          // coerceToSchema strips form-only keys (adminOptions, payment_information,
          // billing_*, associate, user_agent, ...) that Strapi 5 rejects as "Invalid key".
          const response = await updateById("api::associate.associate", parseInt(data.associate), {
            data: coerceToSchema("api::associate.associate", {
              ...data,
              contact_primary: contact_primary,
              contact_secondary: contact_secondary,
              application_date: new Date().toISOString(),
              payment_previous_date: data.payment_last_date,
              total_years:
                data.payment_method === "Card" && data.total_years
                  ? data.total_years + 1
                  : data.total_years,
              payment_last_date:
                data.payment_method === "Card"
                  ? new Date().toISOString()
                  : null,
            })
          });

          try {
            await strapi.documents("api::invoice.invoice").create({
              data: coerceToSchema("api::invoice.invoice", {
                ...payment,
                amount: data.payment_amount,
                context: "membership-form",
                resource: "associates",
                entity_id: parseInt(data.associate),
                email: data.billing_email,
                company: data.name,
                payment_details: data.payment_details,
                payment_method: data.payment_method,
                data: { ...data, payment_information: null },
                year: new Date().getFullYear(),
                payment_date:
                  data.payment_method === "Card"
                    ? new Date().toISOString()
                    : null,
              }),
            });
          } catch (error) {
            return {
              message: "error",
              error: error.message,
            };
          }

          // Fetched membership with id

          const membership = await findOneById("api::membership.membership", data.membership, {
            populate: "*",
          });

          await sendAssociateEmail(
            {
              ...data,
              associate: response.id,
              total_years: data.total_years ? data.total_years + 1 : 1,
              membership: membership.name,
            },
            `ORWA Associate Membership Renewal - ${data.name}`
          );

          return {
            message: "success",
            response,
            payment,
          };
        } catch (error) {
          return {
            message: "error",
            error: error.message,
          };
        }
      } else {
        const membership = await findOneById("api::membership.membership", data.membership, {
          populate: "*",
        });

        sendAssociateEmail(
          { ...data, associate: data.associate, membership: membership.name },
          `ORWA Associate Membership - ${data.name}`
        );
        return {
          message: "success",
        };
      }
    },

    getUserIdByEmail,
    getContact,
    updateContact,
  };
};
