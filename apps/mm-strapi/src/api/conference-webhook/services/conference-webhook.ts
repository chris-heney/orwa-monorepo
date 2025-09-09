/**
 * conference-webhook service
 */

import {
  IContactEntity,
  IExtraEntity,
  IAuthNetResponse,
  state_map,
} from "../types";

// Constants
const PAYMENT_GATEWAY_API = "https://api.authorize.net/xml/v1/request.api";
const PAYMENT_GATEWAY_API_SANDBOX =
  "https://apitest.authorize.net/xml/v1/request.api";
const PAYMENT_GATEWAY_LOGIN = "7u228GQk2DK";
const PAYMENT_GATEWAY_KEY = "56nen4B5v4P35H3A";
const PAYMENT_GATEWAY_LOGIN_SANDBOX = "3946T8QkQw2";
const PAYMENT_GATEWAY_KEY_SANDBOX = "67wC6W9s3b3yj9Cj";

const user_base = {
  provider: "local",
  confirmed: true,
  blocked: false,
  role: 9,
  username: "",
  email: "",
  password: "password",
};

const currentYear = new Date().getFullYear();

export default ({ strapi }) => {
  const serviceObj = {
    // Contact Management
    getUserIdByEmail: async (email) => {
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
    },

    getContact: async (email, contactData, userData) => {
      const contactList =
        (await strapi.documents("api::contact.contact").findMany({
          fields: ["id", "first", "last", "phone", "contact_type"],
          filters: { email },
          limit: 1,
          populate: { user: true },
        })) || [];

      // Contact Not Found ... Creating One
      if (contactList.length === 0) {
        contactList.push(
          await strapi.documents("api::contact.contact").create({
            data: contactData,
          })
        );
      }

      // Make sure contactList[0] exists before using it
      if (!contactList[0]) {
        throw new Error(`Failed to create or find contact for email: ${email}`);
      }

      // Contact Found With User Included
      if (contactList[0].user) {
        // Update the contact found with missing information
        await serviceObj.updateContact(contactList[0].id, {
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

      // Update the contact found with missing information
      if (contactList[0].first || contactList[0].last || contactList[0].phone) {
        await serviceObj.updateContact(contactList[0].id, {
          first: contactList[0].first ? contactList[0].first : contactData.first,
          last: contactList[0].last ? contactList[0].last : contactData.last,
          phone: contactList[0].phone ? contactList[0].phone : contactData.phone,
        });
      }

      const { userId, wp_uid } = await serviceObj.getUserIdByEmail(email);

      // User Found: Return the contact with user
      if (userId) {
        await serviceObj.updateContact(contactList[0].id, {
          user: userId,
        });

        return {
          ...contactList[0],
          user: userId,
          passport: wp_uid,
        };
      }

      // User Not Found: Create user and return contact with the new user
      const user = await strapi.plugins["users-permissions"].services.user.add(
        userData
      );
      
      return {
        ...contactList[0],
        user: user.id,
        passport: null,
      };
    },

    updateContact: async (
      contactId: number,
      contact: Partial<IContactEntity>,
      retries = 3
    ) => {
      let attempt = 0;
      while (attempt < retries) {
        try {
          console.log(
            `Updating Contact (Attempt ${attempt + 1}):`,
            JSON.stringify(contact)
          );
          const response = await strapi.documents("api::contact.contact").update({
            documentId: "__TODO__",
            data: contact
          });
          return response.data;
        } catch (error) {
          if (error.code === "ER_LOCK_DEADLOCK" && attempt < retries - 1) {
            console.warn(
              `Deadlock detected. Retrying (${attempt + 1}/${retries})...`
            );
            await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay before retry
          } else {
            throw error; // Throw error if all retries fail
          }
        }
        attempt++;
      }
    },

    // Item Management
    handleSubractExtrasAvailable: async (extras: IExtraEntity[]) => {
      if (extras.length === 0) return;

      for (const extra of extras) {
        const extraData = await strapi.documents("api::conference-extra.conference-extra").findOne({
          documentId: "__TODO__"
        });
        await strapi.documents("api::conference-extra.conference-extra").update({
          documentId: "__TODO__",

          data: {
            max_qty: extraData.max_qty - 1,
          }
        });
      }
    },

    handleSubractRegistrationAddonsAvailable: async (extras: IExtraEntity[]) => {
      if (extras.length === 0) return;

      for (const extra of extras) {
        const extraData = await strapi.documents("api::registration-addon.registration-addon").findOne({
          documentId: "__TODO__"
        });
        await strapi.documents("api::registration-addon.registration-addon").update({
          documentId: "__TODO__",

          data: {
            max_qty: extraData.max_qty - 1,
          }
        });
      }
    },

    // Data Fetching
    fetchExtrasData: async (conference: number, extraIds: number[] = []) => {
      if (!extraIds || extraIds.length === 0) return [];
      
      return await strapi.documents("api::conference-extra.conference-extra").findMany({
        filters: {
          conference,
          year: currentYear,
          id: {
            $in: extraIds,
          },
        },
        populate: "*",
      });
    },

    fetchRegistrationAddonData: async (conference: number, addonIds: number[] = []) => {
      if (!addonIds || addonIds.length === 0) return [];
      
      return await strapi.documents("api::registration-addon.registration-addon").findMany({
        filters: {
          conference,
          year: currentYear,
          id: {
            $in: addonIds,
          },
        },
        populate: "*",
      });
    },

    // Logging
    logFormData: async (data: any, resource: string) => {
      await strapi.documents("api::log.log").create({
        data: {
          data: {
            ...data,
            paymentData: data.paymentData ? {
              ...data.paymentData,
              cardNumber: null,
              expirationDate: null,
              cardCode: null,
            } : null,
          },
          resource,
        },
      });
    },

    // Payment Processing
    processPayment: async (paymentData, registrant, organization) => {
      const { billingAddress, amount, cardNumber, expirationDate, cardCode } = paymentData;

      const createTransactionRequest = {
        createTransactionRequest: {
          merchantAuthentication: {
            name: PAYMENT_GATEWAY_LOGIN,
            transactionKey: PAYMENT_GATEWAY_KEY,
          },
          transactionRequest: {
            transactionType: "authCaptureTransaction",
            amount,
            payment: {
              creditCard: {
                cardNumber,
                expirationDate,
                cardCode,
              },
            },
            billTo: {
              firstName: registrant.first,
              lastName: registrant.last,
              company: organization,
              state: state_map.find((state) => state[billingAddress.state])?.[billingAddress.state] ?? billingAddress.state,
              country: "US",
            },
          },
        },
      };

      const response = await fetch(PAYMENT_GATEWAY_API, {
        method: "POST",
        body: JSON.stringify(createTransactionRequest),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const authorizeNetResponse = await response.json() as IAuthNetResponse;

      console.log("- Authorize.Net:", JSON.stringify(authorizeNetResponse));
      console.log("-------------------------------------------------------------");

      return authorizeNetResponse;
    },

    // Helper Methods
    generateEmailHTML: async (ctx) => {
      const {
        booths,
        conference,
        organization,
        registrant,
        registration_type,
        paymentType,
        paymentData,
        tickets,
        sponsors,
        registrationSource,
        nonMemberFee,
        registrationAddonsIds,
        registrationExtrasIds,
        team,
        watersystem,
      } = ctx.request.body;

      const conferenceData = await strapi.documents("api::conference.conference").findOne({
        documentId: "__TODO__",
        populate: "*"
      });

      // Helper functions
      const fetchExtrasForTickets = async (ticketsArray: any[] = []) => {
        if (!ticketsArray || ticketsArray.length === 0) return [];
        return await Promise.all(
          ticketsArray.map(async (ticket: any) => {
            const selectedExtras = await serviceObj.fetchExtrasData(
              conference,
              ticket.extras || []
            );
            return { ticket, selectedExtras };
          })
        );
      };

      const fetchExtrasForBooths = async (boothsArray: any[] = []) => {
        if (!boothsArray || boothsArray.length === 0) return [];
        return await Promise.all(
          boothsArray.map(async (booth: any) => {
            const selectedExtras = await serviceObj.fetchExtrasData(
              conference,
              booth.extras || []
            );
            return { booth, selectedExtras };
          })
        );
      };

      const isExtraIncluded = (ticket: any, extra: any) => {
        return extra.included && extra.included.some((include: any) => {
          return include.id === ticket.ticket_type?.id;
        });
      };

      const freeVendors = () => {
        if (booths && booths.length === 1) {
          return 2;
        } else if (booths && booths.length === 2) {
          return 3;
        } else {
          return 0;
        }
      };

      // Formatting
      const currencyFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      });

      const YearMonthDay: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour12: true,
      };

      const createdAt = new Date().toLocaleDateString("en-US", YearMonthDay);

      // Fetch all data for the email
      const ticketDetails = await fetchExtrasForTickets(tickets);
      const boothDetails = await fetchExtrasForBooths(booths);
      const registrationAddonsDetails = await serviceObj.fetchRegistrationAddonData(
        conference,
        registrationAddonsIds || []
      );
      const registrationExtrasDetails = await serviceObj.fetchExtrasData(
        conference,
        registrationExtrasIds || []
      );

      // Generate the HTML
      return `
        <div>
            <h3>
                <span class="il">ORWA ${conferenceData.name}</span>
                <span class="il">Registration</span> Details
            </h3>
            <div>
            <label style="font-weight:800">
                <span class="il">Registration Source </span> </label>: ${
                  registrationSource ? registrationSource.charAt(0).toUpperCase() + registrationSource.slice(1) : 'Online'
                }
          </div>
            <div>
              <label style="font-weight:800">
                  <span class="il">Registration </span> Date </label>: ${createdAt}
            </div>
            ${
              registration_type
                ? `
            <div>
                <label style="font-weight:800">
                    <span class="il">Registration</span> Type </label>: ${registration_type}
            </div>
            `
                : ""
            }
            ${
              organization
                ? `
            <div>
                <label style="font-weight:800">Organization</label>: ${organization}
            </div>
            `
                : ""
            }
            <label style="font-weight:800">Registrant:</label> ${
              registrant.first + " " + registrant.last
            }
            </div>
            <div>
                <label style="font-weight:800">Phone</label>: ${registrant.phone}
            </div>
            <div>
                <label style="font-weight:800">Email</label>: <a href="${
                  registrant.email
                }" target="_blank">${registrant.email}</a>
            </div>
            <div>
                <label style="font-weight:800">Pay By</label>: ${paymentType}
            </div>
            <div>
                <label style="font-weight:800">Address</label>: 
                ${paymentData.billingAddress.address}, 
                ${paymentData.billingAddress.city}, 
                ${paymentData.billingAddress.state},
                ${paymentData.billingAddress.zip}
            </div>
            ${
              watersystem
                ? `<div>
              <label style="font-weight:800">Watersystem</label>:
              <ul style="margin: 0; padding-left: 20px; list-style-type: disc;">
                <li><strong>Name:</strong> ${watersystem.name ?? ""}</li>
                <li><strong>County:</strong> ${watersystem.county ?? ""}</li>
                <li><strong>Address:</strong> ${watersystem.address ?? ""}</li>
                <li><strong>Phone:</strong> ${watersystem.phone ?? ""}</li>
                <li>
                  <strong>Email:</strong> 
                  <a href="mailto:${watersystem.email ?? ""}" target="_blank">
                    ${watersystem.email ?? ""}
                  </a>
                </li>
              </ul>
            </div>`
                : ""
            }
            
            <hr/>
    
            ${
              nonMemberFee
                ? `<div>
    
            <label style="font-weight:800">Non Member Fee</label>: ${currencyFormatter.format(
              conferenceData.non_member_fee
            )}
    
        </div>`
                : ""
            }
            ${
              booths && booths.length > 0
                ? `
        <div>
        <label style="font-weight: 800; margin-top: 10px; display: inline-block;">Booth Count</label>: ${
          booths.length
        }
        </div>
        <table cellspacing="0" cellpadding="0" style="width:100%">
        <table cellspacing="0" cellpadding="0" style="width:100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color:#000; color:#fff; text-align:left; border-bottom: 2px solid #000;">
            <th style="padding: 8px; text-align:left;">Registration Fee</th>
            <th style="padding: 8px; text-align:left;">Items</th>
          </tr>
        </thead>
        <tbody>
          ${boothDetails
            .map(
              ({ booth, selectedExtras }, index) => `
              <tr style="background-color:${
                index % 2 === 0 ? "#f9f9f9" : "#fff"
              }; border-bottom: 1px solid #ddd;">
          
                <td style="padding: 8px; border-right: 1px solid #ddd;">
                  ${
                    index === 0
                      ? currencyFormatter.format(conferenceData.booth_price)
                      : currencyFormatter.format(conferenceData.booth_price_2)
                  }
                </td>
                <td style="padding: 8px; border-right: 1px solid #ddd;">
                  <ul style="margin: 0; padding-left: 20px; list-style-type: disc;">
                    ${selectedExtras
                      .map(
                        (extra) => `
                        <li>${extra.name} ${
                          registrationSource === "online"
                            ? currencyFormatter.format(extra.price_online)
                            : currencyFormatter.format(extra.price_event)
                        }</li>`
                      )
                      .join("")}
                  </ul>
                </td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
        <hr>
    `
                : ""
            }
    ${
      sponsors && sponsors.length > 0
        ? `
    <div>
    <label style="font-weight: 800; margin-top: 10px; display: inline-block;">Sponsorship Count</label>: ${
      sponsors.length
    }
    </div>
    <table cellspacing="0" cellpadding="0" style="width:100%">
    <table cellspacing="0" cellpadding="0" style="width:100%; border-collapse: collapse;">
    <thead>
      <tr style="background-color:#000; color:#fff; text-align:left; border-bottom: 2px solid #000;">
        <th style="padding: 8px;">Sponsorship</th>
        <th style="padding: 8px;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${sponsors
        .map(
          (sponsor, index) => `
          <tr style="background-color:${
            index % 2 === 0 ? "#f9f9f9" : "#fff"
          }; border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; border-right: 1px solid #ddd;">${
              sponsor.name
            }</td>
            <td style="padding: 8px;">${currencyFormatter.format(
              sponsor.amount
            )}</td>
          </tr>
        `
        )
        .join("")}
    </tbody>
  </table>
    `
        : ""
    }
    
    ${
      tickets && tickets.length > 0
        ? `
    <div>
    <label style="font-weight: 800; margin-top: 10px; display: inline-block;">Ticket Count</label>: ${
      tickets.length
    }
    </div>

    ${
      team
        ? `<div>
        <label style="font-weight:800">Team Name</label>: ${team}
    </div>`
        : ``
    }
    
    <table cellspacing="0" cellpadding="0" style="width:100%; border-collapse: collapse;">
    <thead>
      <tr style="text-align:left; background-color:#000; color:#fff; border-bottom: 2px solid #000;">
        <th style="padding: 8px;">Name</th>
        <th style="padding: 8px;">Ticket Type</th>
        <th style="padding: 8px;">Fee</th>
        <th style="padding: 8px;">Items</th>
      </tr>
    </thead>
    <tbody>
      ${ticketDetails
        .map(({ ticket, selectedExtras }, ticketIndex) => {
          return `
          <tr style="background-color:#f9f9f9; border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; border-right: 1px solid #ddd;">${
              ticket.first
            } ${ticket.last}</td>
            <td style="padding: 8px; border-right: 1px solid #ddd;">${
              ticket.ticket_type.name
            }</td>
            <td style="padding: 8px; border-right: 1px solid #ddd;">
              ${
                ticket.type === "Vendor" && ticketIndex + 1 <= freeVendors()
                  ? "Included"
                  : currencyFormatter.format(
                      registrationSource === "online"
                        ? ticket.ticket_type.price_online
                        : ticket.ticket_type.price_event
                    )
              }
            </td>
            <td style="padding: 8px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tbody>
                  ${selectedExtras
                    .sort((extra) => {
                      return isExtraIncluded(ticket, extra) ? -1 : 1;
                    })
                    .map(
                      (extra) => `
                      <tr>
                        <td style="padding: 4px; border-bottom: 1px solid #ddd;">${
                          extra.name
                        }</td>
                        <td style="padding: 4px; text-align: right;">${
                          isExtraIncluded(ticket, extra)
                            ? "Included"
                            : registrationSource === "online"
                            ? currencyFormatter.format(extra.price_online)
                            : currencyFormatter.format(extra.price_event)
                        }</td>
                      </tr>
                    `
                    )
                    .join("")}
                </tbody>
              </table>
            </td>
          </tr>
          `;
        })
        .join("")}
    </tbody>
  </table>
    `
        : ""
    }
    ${
      registrationAddonsIds && registrationAddonsIds.length > 0
        ? `
    <div>
    <label style="font-weight: 800; margin-top: 10px; display: inline-block;">Registration Addons Count</label>: ${
      registrationAddonsIds.length
    }
    </div>
    <table cellspacing="0" cellpadding="0" style="width:100%; border-collapse: collapse;">
    <thead>
      <tr style="background-color:#000; color:#fff; text-align:left; border-bottom: 2px solid #000;">
        <th style="padding: 8px; text-align:left;">Item</th>
        <th style="padding: 8px; text-align:left;">Fee</th>
      </tr>
    </thead>
    <tbody>
      ${registrationAddonsDetails
        .map(
          (addon, index) => `
          <tr style="background-color:${
            index % 2 === 0 ? "#f9f9f9" : "#fff"
          }; border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; border-right: 1px solid #ddd;">${
              addon.name
            }</td>
            <td style="padding: 8px;">
              ${
                registrationSource === "online"
                  ? currencyFormatter.format(addon.price_online)
                  : currencyFormatter.format(addon.price_event)
              }
            </td>
          </tr>
        `
        )
        .join("")}
    </tbody>
  </table>
  `
        : ""
    }

    ${
      registrationExtrasIds && registrationExtrasIds.length > 0
        ? `
    <div>
    <label style="font-weight: 800; margin-top: 10px; display: inline-block;">Registration Extras Count</label>: ${
      registrationExtrasIds.length
    }
    </div>
    <table cellspacing="0" cellpadding="0" style="width:100%; border-collapse: collapse;">
    <thead>
      <tr style="background-color:#000; color:#fff; text-align:left; border-bottom: 2px solid #000;">
        <th style="padding: 8px; text-align:left;">Item</th>
        <th style="padding: 8px; text-align:left;">Fee</th>
      </tr>
    </thead>
    <tbody>
      ${registrationExtrasDetails
        .map(
          (extra, index) => `
          <tr style="background-color:${
            index % 2 === 0 ? "#f9f9f9" : "#fff"
          }; border-bottom: 1px solid #ddd;">
            <td style="padding: 8px; border-right: 1px solid #ddd;">${
              extra.name
            }</td>
            <td style="padding: 8px;">
              ${
                registrationSource === "online"
                  ? currencyFormatter.format(extra.price_online)
                  : currencyFormatter.format(extra.price_event)
              }
            </td>
          </tr>
        `
        )
        .join("")}
    </tbody>
  </table>
  `
        : ""
    }
      <div> Total Fee: ${currencyFormatter.format(paymentData.amount)}</div>
    `;
    },

    // This method holds the constant values like user_base, payment gateway details, etc.
    getConstants: () => ({
      PAYMENT_GATEWAY_API,
      PAYMENT_GATEWAY_API_SANDBOX,
      PAYMENT_GATEWAY_LOGIN,
      PAYMENT_GATEWAY_KEY,
      PAYMENT_GATEWAY_LOGIN_SANDBOX,
      PAYMENT_GATEWAY_KEY_SANDBOX,
      user_base,
      currentYear,
    })
  };

  // Bind all methods to the serviceObj to fix "this" context
  for (const key of Object.keys(serviceObj)) {
    if (typeof serviceObj[key] === 'function') {
      serviceObj[key] = serviceObj[key].bind(serviceObj);
    }
  }

  return serviceObj;
};
