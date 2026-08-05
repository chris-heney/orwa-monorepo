import { AdminOptions } from "../../membership-forms/types";
import { 
  IContactEntity, 
  IAttendeeEntity, 
  ITicketPayload, 
  IExtraEntity,
  ISponsorEntity,
} from "../types";
import { findOneById } from "../../../utils/document-compat";
import { coerceToSchema } from "../../../utils/coerce-to-schema";
import { shouldUseAuthorizeNetTestMode } from "../helpers/payment-mode";
import {
  assertEligiblePreviousRegistration,
  buildAttachedRegistrationUpdate,
} from "../helpers/previous-registration";
import {
  assertSourcePersonOnRegistration,
  partitionContestantLines,
  sharePaymentAmount,
} from "../helpers/contestant-fanout";
import {
  normalizeSponsorAmounts,
  SponsorAmountError,
  type SponsorshipCatalogRow,
} from "../helpers/normalizeSponsors";

/**
 * Conference webhook controller
 */
// Mirrors the frontend's ticketMatchesContext fallback: legacy Fall tickets
// have no `context`, so match by name too or they get stored as attendees.
const CONTESTANT_NAME_FALLBACKS = ["Golfer", "Fisher", "Contestant"];

const isContestantTicket = (ticket: ITicketPayload): boolean => {
  if (ticket?.ticket_type?.context === "Contestant") return true;
  if (ticket?.ticket_type?.context) return false;
  return CONTESTANT_NAME_FALLBACKS.some(
    (name) =>
      ticket?.ticket_type?.name?.localeCompare(name, undefined, {
        sensitivity: "accent",
      }) === 0
  );
};

export default ({ strapi }) => {
  const service = strapi.service("api::conference-webhook.conference-webhook");
  const  currentYear  = new Date().getFullYear();

  return {
    /**
     * Registration
     * Conference Registrations can come from different source and different contexts.
     * @param ctx Koa Context
     * @param next Koa Next
     */
    registration: async (ctx, next) => {
      ctx.body = "ok";

      console.log("↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ Starting Registration ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓");

      try {
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
          nonMemberFee, // agency false and memberType Non Member
          registrationAddonIds,
          registrationExtrasIds,
          team,
          logo,
          watersystem,
          adminOptions,
          vendor_participation_acknowledgement,
          accepted_terms,
          contestant_already_registered,
          previous_registration_id,
          test,
        } = ctx.request.body;

        // Get conference data
        const conferenceData = await findOneById("api::conference.conference", conference, {
          populate: "*"
        });

        const isContestantOnlyCheckout = registration_type === "Contestant";
        const contestantTickets: ITicketPayload[] = (tickets ?? []).filter(
          (ticket: ITicketPayload) => isContestantTicket(ticket)
        );

        // Legacy cart-level attach → stamp onto lines missing per-line ids.
        if (
          isContestantOnlyCheckout &&
          contestant_already_registered === "Yes" &&
          previous_registration_id != null
        ) {
          for (const ticket of contestantTickets) {
            if (ticket.previous_registration_id == null) {
              ticket.previous_registration_id = previous_registration_id;
            }
          }
        }

        const { attachGroups, standalone: standaloneContestants } =
          partitionContestantLines(contestantTickets);

        // Validate all attach targets before charging.
        const loadedAttachRegistrations = new Map<string, any>();
        if (isContestantOnlyCheckout) {
          for (const [attachId, lines] of attachGroups) {
            const previousRegistration = assertEligiblePreviousRegistration(
              await findOneById(
                "api::conference-registration.conference-registration",
                attachId,
                { populate: "*" }
              ),
              conference,
              currentYear
            );
            for (const line of lines) {
              // Legacy attach without source_ticket_id still allowed until UI ships.
              if (line.source_ticket_id != null) {
                assertSourcePersonOnRegistration(
                  previousRegistration,
                  line.source_ticket_id
                );
              }
            }
            loadedAttachRegistrations.set(attachId, previousRegistration);
          }

          const firstAttach = loadedAttachRegistrations.values().next().value;
          if (firstAttach?.organization) {
            ctx.request.body.organization = firstAttach.organization;
          }
        }

        const paymentOrganization =
          loadedAttachRegistrations.values().next().value?.organization ??
          organization;

        // Resolve sponsor amounts against the catalog before charging.
        // Mutate the original `sponsors` array in place so all downstream
        // handlers (payment total, handleSponsors, registration relations)
        // see the resolved amounts.
        if (Array.isArray(sponsors) && sponsors.length > 0) {
          try {
            const catalogById = new Map<string, SponsorshipCatalogRow>();
            for (const sponsor of sponsors) {
              const key = String(sponsor.id);
              if (catalogById.has(key)) continue;
              const row = await findOneById(
                "api::conference-sponsorship.conference-sponsorship",
                sponsor.id
              );
              if (row) catalogById.set(key, row as SponsorshipCatalogRow);
            }
            const clientSponsorTotal = sponsors.reduce(
              (sum, s) => sum + (Number(s.amount) || 0),
              0
            );
            const normalizedSponsors = normalizeSponsorAmounts(
              sponsors,
              catalogById
            ) as ISponsorEntity[];
            sponsors.splice(0, sponsors.length, ...normalizedSponsors);
            ctx.request.body.sponsors = sponsors;

            const sponsorTotal = sponsors.reduce(
              (sum, s) => sum + (Number(s.amount) || 0),
              0
            );
            if (
              paymentData?.amount != null &&
              Number.isFinite(clientSponsorTotal) &&
              Number.isFinite(Number(paymentData.amount))
            ) {
              const delta = sponsorTotal - clientSponsorTotal;
              if (Math.abs(delta) > 0.001) {
                paymentData.amount = Number(
                  (Number(paymentData.amount) + delta).toFixed(2)
                );
              }
            }
          } catch (err) {
            if (err instanceof SponsorAmountError) {
              ctx.body = {
                result: "error",
                message: err.message,
              };
              return;
            }
            throw err;
          }
        }

        // Only proceed with new registration if not a resubmission or no admin options
        if ((adminOptions && adminOptions.resubmit) || !adminOptions) {
          // Log form data
          await service.logFormData(ctx.request.body, "conference-registration");

          // Process payment if payment type is Card
          if (paymentType === "Card") {
            const testMode = shouldUseAuthorizeNetTestMode({
              nodeEnv: strapi.config.environment ?? process.env.NODE_ENV,
              email: registrant?.email,
              test,
            });
            const authorizeNetResponse = await service.processPayment(
              paymentData, 
              registrant, 
              paymentOrganization,
              testMode
            );

            if (authorizeNetResponse.messages.resultCode !== "Ok") {
              ctx.body = {
                result: "error",
                message: authorizeNetResponse.messages.message[0].text,
                data: authorizeNetResponse,
              };
              return;
            }

            // Create transaction record
            await strapi.documents("api::conference-transaction.conference-transaction").create({
              data: {
                email: registrant.email,
                auth_code: authorizeNetResponse.transactionResponse.authCode,
                transaction_id: authorizeNetResponse.transactionResponse.transId,
                network_trans_id: authorizeNetResponse.transactionResponse.networkTransId,
              },
            });
          }

          // Handle registrant as contact
          console.log("-------------------------------------------------------------");
          console.log("REGISTRANT", registrant);

          const { user_base } = service.getConstants();
          const registrantContact = await service.getContact(
            registrant.email,
            {
              first: registrant.first,
              last: registrant.last,
              email: registrant.email,
              phone: registrant.phone,
            },
            {
              ...user_base,
              username: registrant.email,
              email: registrant.email,
              password: btoa(registrant.email),
            }
          );

          console.log("- Registrant:", JSON.stringify(registrantContact));
          console.log("-------------------------------------------------------------");

          // Process registration add-ons and extras
          const selectedRegistrationAddons = await service.fetchRegistrationAddonData(
            conference,
            registrationAddonIds
          );

          const extrasData = await service.fetchExtrasData(
            conference,
            registrationExtrasIds
          );

          // Format registration add-ons and extras
          const registrationAddons = selectedRegistrationAddons.map(
            (addon, index) => ({
              key: addon.name + " " + index,
              value: registrationSource === "online" ? addon.price_online.toString() : addon.price_event.toString(),
              label: addon.name,
              addon: addon.id,
            })
          );

          const extras = extrasData.map((extra) => ({
            key: extra.name,
            value: registrationSource === "online" ? extra.price_online.toString() : extra.price_event.toString(),
            label: extra.name,
            item: extra.id,
          }));

          // Update quantities
          if (registrationAddons?.length > 0) {
            await service.handleSubractRegistrationAddonsAvailable(selectedRegistrationAddons);
          }
          
          if (registrationExtrasIds?.length > 0) {
            await service.handleSubractExtrasAvailable(extras);
          }

          const items = extras.concat(registrationAddons);

          let registrationId: number | string | undefined;
          let contestantIds: number[] = [];

          if (isContestantOnlyCheckout) {
            // Mixed cart: attach groups update existing regs; standalone lines
            // create one Contestant registration. Reg-level extras ride with
            // standalone, or the first attach group if there is no standalone.
            let regLevelItems = items;
            for (const [attachId, lines] of attachGroups) {
              const previousRegistration =
                loadedAttachRegistrations.get(attachId);
              const attachItems =
                standaloneContestants.length === 0 &&
                regLevelItems.length > 0 &&
                attachId === [...attachGroups.keys()][0]
                  ? regLevelItems
                  : [];
              if (attachItems === regLevelItems) {
                regLevelItems = [];
              }
              await strapi
                .documents(
                  "api::conference-registration.conference-registration"
                )
                .update({
                  documentId: previousRegistration.documentId,
                  data: coerceToSchema(
                    "api::conference-registration.conference-registration",
                    buildAttachedRegistrationUpdate(
                      previousRegistration,
                      sharePaymentAmount(lines),
                      attachItems
                    )
                  ),
                });
              const ids = await handleContestants(
                lines,
                conference,
                previousRegistration.id,
                registrationSource,
                previousRegistration.organization,
                conferenceData
              );
              contestantIds = contestantIds.concat(ids);
              registrationId = previousRegistration.id;
            }

            if (standaloneContestants.length > 0) {
              const newRegistration = await strapi
                .documents(
                  "api::conference-registration.conference-registration"
                )
                .create({
                  data: coerceToSchema(
                    "api::conference-registration.conference-registration",
                    {
                      conference,
                      year: currentYear,
                      registration_date: new Date(),
                      registrant: registrantContact.id,
                      total: sharePaymentAmount(standaloneContestants),
                      payment_method:
                        paymentType === "Card" ? "Card" : paymentType,
                      type: registration_type,
                      organization,
                      sponsorships: sponsors.map(
                        (sponsor: ISponsorEntity) => sponsor.id
                      ),
                      address: {
                        street: paymentData?.billingAddress?.address,
                        city: paymentData?.billingAddress?.city,
                        state: paymentData?.billingAddress?.state,
                        zip: paymentData?.billingAddress?.zip,
                      },
                      non_member_fee: nonMemberFee ? true : false,
                      vendor_participation_acknowledgement:
                        vendor_participation_acknowledgement ? true : false,
                      accepted_terms: Array.isArray(accepted_terms)
                        ? accepted_terms
                        : [],
                      items: regLevelItems,
                      registration_source: registrationSource ?? "online",
                    }
                  ),
                });
              console.log("- Registration:", JSON.stringify(newRegistration));
              console.log("-------------------------------------------------------------");
              registrationId = newRegistration.id;
              const ids = await handleContestants(
                standaloneContestants,
                conference,
                registrationId,
                registrationSource,
                organization,
                conferenceData
              );
              contestantIds = contestantIds.concat(ids);
            }

            if (team && contestantIds.length > 0 && registrationId != null) {
              await handleTeamCreation(
                team,
                conference,
                registrationId,
                contestantIds
              );
            }
          } else {
          // The reduced contestant tier is an add-on to an existing
          // Attendee/Vendor registration. Only standalone Contestant purchases
          // create a new parent registration.
          const newRegistration = await strapi
                .documents(
                  "api::conference-registration.conference-registration"
                )
                .create({
                  // Strapi 5 validates payload types strictly (v4 silently coerced);
                  // kiosk/admin flows send strings for numeric fields and vice versa.
                  data: coerceToSchema(
                    "api::conference-registration.conference-registration",
                    {
                      conference,
                      year: currentYear,
                      registration_date: new Date(),
                      registrant: registrantContact.id,
                      total: paymentData.amount,
                      payment_method:
                        paymentType === "Card" ? "Card" : paymentType,
                      type: registration_type,
                      organization,
                      sponsorships: sponsors.map(
                        (sponsor: ISponsorEntity) => sponsor.id
                      ),
                      address: {
                        street: paymentData?.billingAddress?.address,
                        city: paymentData?.billingAddress?.city,
                        state: paymentData?.billingAddress?.state,
                        zip: paymentData?.billingAddress?.zip,
                      },
                      non_member_fee: nonMemberFee ? true : false,
                      vendor_participation_acknowledgement:
                        vendor_participation_acknowledgement ? true : false,
                      accepted_terms: Array.isArray(accepted_terms)
                        ? accepted_terms
                        : [],
                      items,
                      registration_source: registrationSource ?? "online",
                    }
                  ),
                });

          console.log("- Registration:", JSON.stringify(newRegistration));
          console.log("-------------------------------------------------------------");

          registrationId = newRegistration.id;

          // Handle Water Taste Test Contestants
          await handleWaterTasteTestContestants(
            registrationAddons, 
            registrant, 
            conference, 
            organization,
            watersystem, 
            registrationId
          );

          // Handle Sponsors
          if (sponsors.length > 0) {
            await handleSponsors(
              sponsors, 
              conference, 
              registrationId, 
              registrant, 
              organization,
              logo
            );
          }

          // Handle Attendees
          await handleAttendees(
            tickets, 
            conference, 
            registrationId, 
            registrationSource, 
            organization
          );

          // Handle Booths
          await handleBooths(
            booths, 
            conference, 
            registrationId, 
            organization,
            conferenceData
          );

          // Handle Contestants
          contestantIds = await handleContestants(
            tickets, 
            conference, 
            registrationId, 
            registrationSource, 
            organization,
            conferenceData
          );

          // Handle Team Creation
          if (team && contestantIds.length > 0) {
            await handleTeamCreation(
              team, 
              conference, 
              registrationId, 
              contestantIds
            );
          }
          }
        }

        // Send emails
        await handleEmailNotifications(
          ctx, 
          conferenceData, 
          adminOptions
        );

        console.log("↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ Ending ↑ Registration ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑");

        ctx.body = {
          result: "success",
          message: "Registration Successful",
        };
      } catch (err) {
        console.log("Error:", err);
        console.log("Error: Details", err?.details?.errors);
        ctx.body = err;
      }
    },
  };

  /**
   * Handles Water Taste Test Contestants
   */
  async function handleWaterTasteTestContestants(
    registrationAddons, 
    registrant, 
    conference, 
    organization, 
    watersystem, 
    registrationId
  ) {
    if (registrationAddons.some((item) => item.label === "Water Taste Test Contestant")) {
      await strapi.documents("api::taste-test-contestant.taste-test-contestant").create({
        data: coerceToSchema("api::taste-test-contestant.taste-test-contestant", {
          conference,
          year: currentYear,
          first: registrant.first,
          last: registrant.last,
          email: registrant.email,
          phone: registrant.phone,
          organization,
          // payload may carry a full watersystem object or a bare numeric id
          watersystem: watersystem?.id ?? watersystem ?? null,
          registration: registrationId,
        }),
      });
    }
  }

  /**
   * Handles sponsor registrations
   */
  async function handleSponsors(
    sponsors, 
    conference, 
    registrationId, 
    registrant, 
    organization, 
    logo
  ) {
    const total = sponsors.reduce((acc, sponsor) => acc + sponsor.amount, 0);

    await strapi.documents("api::conference-sponsor.conference-sponsor").create({
      data: coerceToSchema("api::conference-sponsor.conference-sponsor", {
        conference,
        year: currentYear,
        registration: registrationId,
        phone: registrant.phone,
        email: registrant.email,
        organization: organization,
        sponsorship_items: sponsors.map(
          (sponsor: ISponsorEntity, index: number) => ({
            key: sponsor.name + " " + index,
            value: sponsor.amount,
            label: sponsor.name,
            sponsorship: sponsor.id,
          })
        ),
        amount: total ?? 0,
        logo,
      }),
    });

    // Update available sponsorships
    for (const sponsor of sponsors) {
      const sponsorData = await findOneById("api::conference-sponsorship.conference-sponsorship", sponsor.id);
      
      await strapi.documents("api::conference-sponsorship.conference-sponsorship").update({
        documentId: sponsorData.documentId,

        data: {
          available: sponsorData.available - 1,
        }
      });
    }
  }

  /**
   * Handles attendee registrations
   */
  async function handleAttendees(
    tickets, 
    conference, 
    registrationId, 
    registrationSource, 
    organization
  ) {
    if (!tickets || tickets.length === 0) return;
    
    const { user_base } = service.getConstants();
    
    // Filter out contestants
    const attendees = tickets.filter(
      (ticket: ITicketPayload) => !isContestantTicket(ticket)
    );

    for (const ticket of attendees) {
      const selectedExtras = await service.fetchExtrasData(
        conference,
        ticket.extras
      );

      const extras: IExtraEntity[] = selectedExtras.map((extra, index) => ({
        key: extra.name + " " + index,
        value: registrationSource === "online" ? extra.price_online.toString() : extra.price_event.toString(),
        label: extra.name,
        item: extra.id,
      }));

      await service.handleSubractExtrasAvailable(extras);

      const attendeeContact: IContactEntity = await service.getContact(
        ticket.email,
        {
          first: ticket.first,
          last: ticket.last,
          email: ticket.email,
          phone: ticket.phone,
        },
        {
          ...user_base,
          username: ticket.email,
          email: ticket.email,
          password: btoa(ticket.email),
        }
      );

      console.log("- Attendee Contact:", JSON.stringify(ticket));

      // Create a modified attendee object with all properties
      const attendeeData: Partial<IAttendeeEntity> = {
        conference,
        year: currentYear,
        registration: registrationId,
        first: ticket.first,
        last: ticket.last,
        type: ticket.type,
        contact: attendeeContact.id,
        training_type: ticket.training_type || "None",
        organization: ticket.organization ? ticket.organization : organization,
        email: ticket.email,
        phone: ticket.phone,
        items: extras,
        conference_ticket: ticket.ticket_type.id,
        license: ticket.license,
        orwa_voting_status: ticket.orwa_voting_status,
        orwaag_voting_status: ticket.orwaag_voting_status,
        title: ticket.title,
        speaker: ticket.speaker,
        promotional_emails: ticket.promotional_emails,
      };

      const attendee = await strapi.documents("api::conference-attendee.conference-attendee").create({
        data: coerceToSchema("api::conference-attendee.conference-attendee", attendeeData),
      });

      console.log("- Attendee:", JSON.stringify(attendee));
      console.log("-------------------------------------------------------------");
    }
  }

  /**
   * Handles booth registrations
   */
  async function handleBooths(
    booths, 
    conference, 
    registrationId, 
    organization, 
    conferenceData
  ) {
    if (!booths || booths.length === 0) return;
    
    // Update available booths
    await strapi.documents("api::conference.conference").update({
      documentId: conferenceData.documentId,

      data: {
        booths_available: conferenceData.booths_available - booths.length,
      }
    });

    // Get current booths
    const currentBooths = await strapi.documents("api::conference-booth.conference-booth").findMany({
      filters: { conference, year: currentYear },
    });

    for (const [index, booth] of booths.entries()) {
      const boothNumber = currentBooths.length + index + 1;

      const selectedExtras = await service.fetchExtrasData(
        conference,
        booth.extras
      );

      const boothExtras = selectedExtras.map((extra, index) => ({
        key: extra.name + " " + index,
        value: extra.price_online.toString(),
        label: extra.name,
        item: extra.id,
      }));

      await service.handleSubractExtrasAvailable(boothExtras);

      const boothData = {
        conference,
        year: currentYear,
        registration: registrationId,
        organization,
        subtotal: booth.subtotal,
        // schema type is integer; v4 accepted the stringified value, v5 does not
        booth_number: boothNumber,
        items: boothExtras,
      };

      const newBooth = await strapi.documents("api::conference-booth.conference-booth").create({
        data: coerceToSchema("api::conference-booth.conference-booth", boothData),
      });

      console.log("- Booth:", JSON.stringify(newBooth));
      console.log("-------------------------------------------------------------");
    }
  }

  /**
   * Handles contestant registrations and returns contestant IDs
   */
  async function handleContestants(
    tickets, 
    conference, 
    registrationId, 
    registrationSource, 
    organization,
    conferenceData
  ) {
    if (!tickets) return [];
    
    const contestants = tickets.filter((ticket: ITicketPayload) =>
      isContestantTicket(ticket)
    );
    
    if (contestants.length === 0) return [];

    const contestantIds: number[] = [];

    // Process all contestants
    const contestantPromises = contestants.map(async (contestant: ITicketPayload) => {
      const selectedExtras = await service.fetchExtrasData(
        conference,
        contestant.extras
      );
      // Quantity extras (e.g. Mulligans) arrive as repeated IDs in
      // contestant.extras. fetchExtrasData de-dupes via $in — expand back to
      // one field-meta row per unit so the Contestants grid can show (xN).
      // Explicit value type: Map(array-of-tuples) otherwise infers unknown and
      // tsc fails the develop compile (Strapi never binds the HTTP port).
      const extrasById = new Map<any, IExtraEntity>(
        (selectedExtras as IExtraEntity[]).map((extra) => [extra.id, extra])
      );
      const contestantExtras = (contestant.extras || [])
        .map((extraId, index) => {
          const extra = extrasById.get(extraId);
          if (!extra) return null;
          return {
            key: extra.name + " " + index,
            value:
              registrationSource === "online"
                ? extra.price_online.toString()
                : extra.price_event.toString(),
            label: extra.name,
            item: extra.id,
          };
        })
        .filter(Boolean);

      const newContestant = {
        conference,
        year: currentYear,
        registration: registrationId,
        first: contestant.first,
        last: contestant.last,
        organization: organization,
        email: contestant.email,
        phone: contestant.phone,
        conference_ticket: contestant.ticket_type.id,
        type: contestant.type,
        fee: contestant.price,
        items: contestantExtras,
      };

      const contestantEntity = await strapi.documents("api::conference-contestant.conference-contestant").create({
        data: coerceToSchema("api::conference-contestant.conference-contestant", newContestant),
      });

      if (contestant.ticket_type.name === "Golfer") {
        contestantIds.push(contestantEntity.id);
      }

      console.log("- Contestant:", JSON.stringify(contestantEntity));
      console.log("-------------------------------------------------------------");
    });

    await Promise.all(contestantPromises);

    // Update available contestants count
    const golferCount = contestants.filter(
      contestant => contestant.ticket_type.name === "Golfer"
    ).length;
    
    if (golferCount > 0) {
      await strapi.documents("api::conference.conference").update({
        documentId: conferenceData.documentId,

        data: {
          available_contestants: conferenceData.available_contestants - golferCount,
        }
      });
    }

    return contestantIds;
  }

  /**
   * Creates a team with the given contestants
   */
  async function handleTeamCreation(
    team, 
    conference, 
    registrationId, 
    contestantIds
  ) {
    console.log("Creating team with contestantIds:", contestantIds);
    
    const newTeam = await strapi.documents("api::conference-team.conference-team").create({
      data: coerceToSchema("api::conference-team.conference-team", {
        conference,
        year: currentYear,
        registration: registrationId,
        name: team,
        contestants: contestantIds,
      }),
    });

    console.log("- Team:", JSON.stringify(newTeam));
    console.log("-------------------------------------------------------------");
  }

  /**
   * Handles email notifications
   */
  async function handleEmailNotifications(
    ctx, 
    conferenceData, 
    adminOptions
  ) {
    const html = await service.generateEmailHTML(ctx); // Full HTML generation in the service

    const { registrant } = ctx.request.body;

    const emailPayloadRegistrant = {
      to: registrant.email,
      from: "office@orwa.org",
      subject: `ORWA ${conferenceData.name} Registration`,
      html,
    };

    const emailPayloadOffice = {
      to: "office@orwa.org",
      from: "website@orwa.org",
      subject: `ORWA ${conferenceData.name} Registration`,
      html,
    };

    const myEmailPayload = {
      to: "marcosje2005@gmail.com",
      from: "website@orwa.org",
      subject: `ORWA ${conferenceData.name} Registration`,
      html,
    };

    // Always send email to developer
    await strapi.plugins["email"].services.email.send(myEmailPayload);

    if (adminOptions) {
      const { registrantNotification, adminNotification, customEmail } = adminOptions as AdminOptions;

      if (registrantNotification && !customEmail) {
        await strapi.plugins["email"].services.email.send(emailPayloadRegistrant);
      }

      if (adminNotification && !customEmail) {
        await strapi.plugins["email"].services.email.send(emailPayloadOffice);
      }

      if (customEmail) {
        const emails = (customEmail as string).split(",");

        for (const email of emails) {
          await strapi.plugins["email"].services.email.send({
            to: email.trim(),
            from: "website@orwa.org",
            subject: `ORWA ${conferenceData.name} Registration`,
            html,
          });
        }
      }
    } else {
      await strapi.plugins["email"].services.email.send(emailPayloadRegistrant);
      await strapi.plugins["email"].services.email.send(emailPayloadOffice);    
    }
  }
};
