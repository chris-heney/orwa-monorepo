"use strict";

import {
  AdminOptions,
  AssociateMembershipPayload,
  IAuthNetResponse,
  WatersystemMembershipPayload,
  waterSystemRenewalPayload,
} from "../types";

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
    const response = await strapi.documents("api::contact.contact").update({
      documentId: "__TODO__",
      data: contact
    });
    return response.data;
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

  const sendWatersystemEmail = async (
    payload: waterSystemRenewalPayload,
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
            data: {
              ...data,
              system_type_dirty: system_type_dirty,
              total_years: data.payment_method === "Card" ? 1 : 0,
              application_date: new Date().toISOString(),
              payment_last_date:
                data.payment_method === "Card"
                  ? new Date().toISOString()
                  : null,
            },
          });

          // Submit transaction
          try {
            await strapi.documents("api::invoice.invoice").create({
              data: {
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
              },
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

          const response = await strapi.documents("api::associate.associate").create({
            data: {
              ...data,
              total_years: data.payment_method === "Card" ? 1 : 0,
              contact_primary: contact_primary,
              contact_secondary: contact_secondary,
              application_date: new Date().toISOString(),
              payment_last_date:
                data.payment_method === "Card"
                  ? new Date().toISOString()
                  : null,
            },
          });

          try {
            await strapi.documents("api::invoice.invoice").create({
              data: {
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
              },
            });
          } catch (error) {
            return {
              message: "error",
              error: error.message,
            };
          }

          // Fetched membership with id

          const membership = await strapi.documents("api::membership.membership").findOne({
            documentId: "__TODO__",
            populate: "*"
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
        const membership = await strapi.documents("api::membership.membership").findOne({
          documentId: "__TODO__",
          populate: "*"
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

          const response = await strapi.documents("api::watersystem.watersystem").update({
            documentId: "__TODO__",

            data: {
              ...data,
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
            }
          });

          try {
            await strapi.documents("api::invoice.invoice").create({
              data: {
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
              },
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

          const response = await strapi.documents("api::associate.associate").update({
            documentId: "__TODO__",

            data: {
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
            }
          });

          try {
            await strapi.documents("api::invoice.invoice").create({
              data: {
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
              },
            });
          } catch (error) {
            return {
              message: "error",
              error: error.message,
            };
          }

          // Fetched membership with id

          const membership = await strapi.documents("api::membership.membership").findOne({
            documentId: "__TODO__",
            populate: "*"
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
        const membership = await strapi.documents("api::membership.membership").findOne({
          documentId: "__TODO__",
          populate: "*"
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
