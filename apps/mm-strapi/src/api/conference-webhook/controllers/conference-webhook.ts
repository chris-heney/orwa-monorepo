import { AdminOptions } from "../../membership-forms/types";
import { 
  IContactEntity, 
  IAttendeeEntity, 
  ITicketPayload, 
  IExtraEntity,
  ISponsorEntity,
} from "../types";

/**
 * Conference webhook controller
 */
export default ({ strapi }) => {
  const service = strapi.service("api::conference-webhook.conference-webhook");
  const { currentYear } = service.getConstants();

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
          secondary_email,
        } = ctx.request.body;

        // Get conference data
        const conferenceData = await strapi.documents("api::conference.conference").findOne({
          documentId: "__TODO__",
          populate: "*"
        });

        // Only proceed with new registration if not a resubmission or no admin options
        if ((adminOptions && adminOptions.resubmit) || !adminOptions) {
          // Log form data
          await service.logFormData(ctx.request.body, "conference-registration");
          console.log("- Request Body:", JSON.stringify(ctx.request.body));
          console.log("-------------------------------------------------------------");

          // Process payment if payment type is Card
          if (paymentType === "Card") {
            const authorizeNetResponse = await service.processPayment(
              paymentData, 
              registrant, 
              organization
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

          // Create registration
          const newRegistration = await strapi.documents("api::conference-registration.conference-registration").create({
            data: {
              conference,
              year: currentYear,
              registration_date: new Date(),
              registrant: registrantContact.id,
              total: paymentData.amount,
              payment_method: paymentType === "Card" ? "Card" : paymentType,
              type: registration_type,
              organization: organization,
              sponsorships: sponsors.map((sponsor: ISponsorEntity) => sponsor.id),
              address: {
                street: paymentData.billingAddress.address,
                city: paymentData.billingAddress.city,
                state: paymentData.billingAddress.state,
                zip: paymentData.billingAddress.zip,
              },
              non_member_fee: nonMemberFee ? true : false,
              items: items,
              registration_source: registrationSource ?? "online",
            },
          });

          console.log("- Registration:", JSON.stringify(newRegistration));
          console.log("-------------------------------------------------------------");

          const registrationId = newRegistration.id;

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
            secondary_email,
            conferenceData
          );

          // Handle Contestants
          const contestantIds = await handleContestants(
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
        data: {
          conference,
          year: currentYear,
          first: registrant.first,
          last: registrant.last,
          email: registrant.email,
          phone: registrant.phone,
          organization,
          watersystem: watersystem.id,
          registration: registrationId,
        },
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
      data: {
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
      },
    });

    // Update available sponsorships
    for (const sponsor of sponsors) {
      const sponsorData = await strapi.documents("api::conference-sponsorship.conference-sponsorship").findOne({
        documentId: "__TODO__"
      });
      
      await strapi.documents("api::conference-sponsorship.conference-sponsorship").update({
        documentId: "__TODO__",

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
      (ticket: ITicketPayload) => ticket.ticket_type.context !== "Contestant"
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

      const attendee = await strapi.documents("api::conference-attendee.conference-attendee").create({ data: attendeeData });

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
    secondary_email,
    conferenceData
  ) {
    if (!booths || booths.length === 0) return;
    
    // Update available booths
    await strapi.documents("api::conference.conference").update({
      documentId: "__TODO__",

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
        booth_number: boothNumber.toString(),
        items: boothExtras,
        secondary_email: secondary_email,
      };

      const newBooth = await strapi.documents("api::conference-booth.conference-booth").create({
        data: boothData,
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
    
    const contestants = tickets.filter(
      (ticket: ITicketPayload) => ticket.ticket_type.context === "Contestant"
    );
    
    if (contestants.length === 0) return [];

    const contestantIds: number[] = [];

    // Process all contestants
    const contestantPromises = contestants.map(async (contestant: ITicketPayload) => {
      const selectedExtras = await service.fetchExtrasData(
        conference,
        contestant.extras
      );

      const contestantExtras = selectedExtras.map((extra, index) => ({
        key: extra.name + " " + index,
        value: registrationSource === "online" ? extra.price_online.toString() : extra.price_event.toString(),
        label: extra.name,
        item: extra.id,
      }));

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
        data: newContestant,
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
        documentId: "__TODO__",

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
      data: {
        conference,
        year: currentYear,
        registration: registrationId,
        name: team,
        contestants: contestantIds,
      },
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
