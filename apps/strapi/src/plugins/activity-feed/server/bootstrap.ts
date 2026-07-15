"use strict";
import dayjs from "dayjs";
import { findOneById } from "./utils/document-compat";
/**
 * Supported Activities:
 *   - Asset Assigned: ${asset.name} has been assigned to ${staff.contact.first} ${staff.contact.last}. //done
 *   - Asset Returned: ${asset.name} as been turned in by ${staff.contact.first} ${staff.contact.last}. //done
 *   - Grants & Applications
 *     - Grant Created / Opened //done
 *     - Grant Application Approved
 *     - Grant Application Denied
 *     - Grant Application Rejected
 *   - Grant Reimbursement Issued
 *   - Training
 *     - Trainer Created Event // done
 *     - Training Manager Sends Event to DEQ | ctx: class name
 *     - Training Registratoin Received | ctx: class name
 *     - Contact | ctx: title
 *   - Training Hours Logged //done
 *     - Contact | ctx: title
 *   - Membership Application
 *     - Watersystem - applied or renewed
 *     - Associate - applied or renewed
 *   - Membership Renewal
 *     - Watersystem -
 *     - Associate -
 *   - Associate Adding Contact
 *   - Staff Adding Contact
 *   - Conference Registration
 *     - System Attendee
 *     - Associate Vendor
 *     - Staff
 */

/**
 * Example Message Structure:
 *
 * const message [
 *   Entity,
 *   EntityContext,
 *   Verb,
 *   RelatedEntity,
 *   RelatedEntityContext,
 *   InitiatingUser,	// @TODO: Add outside of switch statement
 * ]
 */

const YearMonthDay: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour12: true,
};
const YearMonthDayMinute: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
};
const format_message = (message: string[]) => message.join(" ") + ".";

export default async ({ strapi, env }: { strapi: any; env: any }) => {
  const add_activity = async (message: string[]): Promise<number> => {
    const newActivity = await strapi.documents("api::activity.activity").create({
      data: {
        timestamp: new Date().toISOString(),
        description: format_message(message),
      },
    });

    return newActivity.id as number;
  };

  const relate_activity = async (
    activityId: number,
    entities: { id: number; name: string }[]
  ) => {
    const relations = entities.map((entity) =>
      strapi.documents("api::activity-relation.activity-relation").create({
        data: {
          activity: activityId,
          entity: entity.name,
          entity_id: entity.id,
        },
      })
    );

    return await Promise.all(relations);
  };

  // getTrainingSchedule: async (trainingSchedule, duplicateBlockIds) => {
  //   submitTrainingSchedule: async (trainingScheduleBlocks, eventId, duplicateBlocks, duplicateHours) => {

  const duplicateSchedule = async (
    blockIds,
    eventId,
    duplicateHours,
    scheduleId
  ) => {
    const result = await strapi
      .service("api::schedule-functions.schedule-functions")
      .getTrainingSchedule(scheduleId, blockIds);
    return await strapi
      .service("api::schedule-functions.schedule-functions")
      .submitTrainingSchedule(undefined, eventId, result.data, duplicateHours);
  };

  strapi.db.lifecycles.subscribe({
    beforeUpdate: async (event: any) => {
      const message: string[] = [];
      const relations: { id: number; name: string }[] = [];

      switch (event.model.singularName) {
        case "asset":
          const assetId = event.params.where.id;
          const assetBase = await findOneById("api::asset.asset", assetId, {
            populate: {
              assigned_to: {
                fields: ["id"],
              },
              sub_assets: {
                fields: ["id"],
              },
            }
          });
          const assetOld = {
            ...assetBase,
            assigned_to: assetBase?.assigned_to?.id ?? 0,
            sub_assets:
              assetBase?.sub_assets?.map((asset: any) => asset.id) ?? [],
          };

          const assetNew = {
            ...assetOld,
            ...event.params.data,
            assigned_to: event.params.data?.assigned_to
              ? event.params.data?.assigned_to
              : event.params.data?.sub_assets
              ? assetBase.assigned_to
                ? assetBase.assigned_to.id
                : 0
              : 0,
            sub_assets: event.params.data?.sub_assets ?? [],
          };

          message.push(assetNew.name);
          relations.push({ id: assetId, name: "asset" });
          const changeInAssignment =
            assetOld.assigned_to === assetNew.assigned_to ? false : true;

          const addedSubAsset = assetNew.sub_assets.find(
            (id: number) => !assetOld.sub_assets.includes(id)
          );

          const removedSubAsset = assetOld.sub_assets.find(
            (id: number) => !assetNew.sub_assets.includes(id)
          );

          if (changeInAssignment) {
            // Assset Transferred
            if (assetNew.assigned_to !== 0 && assetOld.assigned_to !== 0) {
              console.log("Asset transferred.");

              const staffOld = await findOneById("api::staff-member.staff-member", assetOld.assigned_to, {
                populate: { contact: true }
              });

              const staffNew = await findOneById("api::staff-member.staff-member", assetNew.assigned_to, {
                populate: { contact: true }
              });

              message.push(
                `transferred from ${staffOld.contact.first} ${staffOld.contact.last} to ${staffNew.contact.first} ${staffNew.contact.last}`
              );
              relations.push({ id: staffOld.id, name: "staff" });
              relations.push({ id: staffNew.id, name: "staff" });
            }

            // Assset Returned
            if (assetNew.assigned_to === 0 && assetOld.assigned_to > 0) {
              console.log(".....Asset returned.");

              const staffOld = await findOneById("api::staff-member.staff-member", assetOld.assigned_to, {
                populate: { contact: true }
              });

              message.push(
                `returned by ${staffOld.contact.first} ${staffOld.contact.last}`
              );
              relations.push({ id: staffOld.id, name: "staff" });
            }

            // Assset Assigned
            if (assetOld.assigned_to === 0 && assetNew.assigned_to > 0) {
              console.log("Asset assigned.....");

              const staffNew = await findOneById("api::staff-member.staff-member", assetNew.assigned_to, {
                populate: { contact: true }
              });

              message.push(
                `assigned to ${staffNew.contact.first} ${staffNew.contact.last}`
              );
              relations.push({ id: staffNew.id, name: "staff" });
            }

            // check if sub assets were added or removed
          } else if (addedSubAsset) {
            const subAsset = await findOneById("api::asset.asset", addedSubAsset, {
              populate: "*"
            });
            message.push(`sub asset added: ${subAsset.name}`);
            relations.push({ id: subAsset.id, name: "asset" });
          } else if (removedSubAsset) {
            const subAsset = await findOneById("api::asset.asset", removedSubAsset, {
              populate: "*"
            });
            message.push(`sub asset removed: ${subAsset.name}`);
            relations.push({ id: subAsset.id, name: "asset" });
          } else {
            // Asset Details Updated (no change in assignment)
            // @TODO: Get update details.
            message.push("was updated");
          }

          break;
        case "watersystem":
          break;
        case "training-event":
          break;
      }
      if (message.length > 0) {
        await relate_activity(await add_activity(message), relations);
      }
    },
    afterCreate: async (event: any) => {
      const message: string[] = [];
      const relations: { id: number; name: string }[] = [];

      switch (event.model.singularName) {
        case "training-event":
          const scheduleId = event.params.data.schedule;

          if (scheduleId) {
            const scheduleData = await findOneById("api::training-schedule.training-schedule", scheduleId, {
              populate: "*"
            });
            const blockIds = scheduleData.training_schedule_blocks.map(
              (block) => block.id
            );
            // duplicateTrainingSchedule(blockIds, event.result.id, event.params.data.hours, env)
            duplicateSchedule(
              blockIds,
              event.result.id,
              event.params.data.hours,
              scheduleId
            );
          }

          const eventId = event.result.id;

          const start = new Date(event.params.data.start);
          const formattedStart = start.toLocaleString("en-US", YearMonthDay);
          const end = new Date(event.params.data.end);
          const formattedEnd = end.toLocaleString("en-US", YearMonthDay);

          message.push(
            `A ${event.result.training_type} event was created from ${formattedStart} to ${formattedEnd}`
          );
          relations.push({ id: eventId, name: "training-event" });
          break;
        case "training-event-log":
          const contactId = event.params.data.contact;
          const eventAttendedId = event.params.data.event;
          const sessionId = event.params.data.session;

          const logDate = new Date(event.params.data.createdAt);
          const formattedLogDate = logDate.toLocaleString(
            "en-US",
            YearMonthDayMinute
          );

          const contact = await findOneById("api::contact.contact", contactId, {
            populate: "*"
          });

          const eventAtteded = await findOneById("api::training-event.training-event", eventAttendedId, {
            populate: "*"
          });
          const eventStart = new Date(eventAtteded.start);
          const formattedEventStart = eventStart.toLocaleString(
            "en-US",
            YearMonthDay
          );
          const eventEnd = new Date(eventAtteded.end);
          const formattedEventEnd = eventEnd.toLocaleString(
            "en-US",
            YearMonthDay
          );

          const session = await findOneById("api::training-session.training-session", sessionId, {
            populate: "*"
          });

          let totalMinutes = 0;
          let totalHours = 0;
          const sessionStart = dayjs("2005-08-04 " + session.start);
          const sessionEnd = dayjs("2005-08-04 " + session.end);
          const minutes = sessionEnd.diff(sessionStart, "minutes");
          const hours = sessionEnd.diff(sessionStart, "hours");
          totalMinutes += Math.ceil(minutes / 60);
          totalHours += hours;
          const totalDuration = totalHours + totalMinutes;
          const creditHours =
            event.params.data.type === "Block" ? 4 : totalDuration;

          message.push(
            `${contact.first + " " + contact.last} checked in ${
              creditHours + " " + (creditHours === 1 ? "Hour" : "Hours")
            } on ${formattedLogDate} for the event ${
              eventAtteded.training_type
            } from ${formattedEventStart} to ${formattedEventEnd}`
          );
          relations.push({ id: contactId, name: "training-event" });

          break;
        case "grant":
          // grant created/opened
          const grantId = event.result.id;
          console.log("Grant: ", event);
          const open = new Date(event.result.opens);
          const formattedOpen = open.toLocaleString("en-US", YearMonthDay);
          const close = new Date(event.result.closes);
          const formattedClose = close.toLocaleString("en-US", YearMonthDay);
          message.push(
            `${event.result.name} was opened for applications from ${formattedOpen} to ${formattedClose} - Amount: $${event.result.grant_amount}`
          );
          relations.push({ id: grantId, name: "grant" });
          break;

        // when a grant gra is made make an activity for the payout and attatch it to the grant application
        case "grant-payout":
          let application;

          console.log("Grant Payout: ", event.params.data);

          const payoutId = event.result.id;

          const payout = await findOneById("api::grant-payout.grant-payout", payoutId, {
            populate: "*"
          });

          // NOTE: hard-coded grant id 4 preserved from the original v4 code
          const grant = await findOneById("api::grant.grant", 4, {
            populate: "*"
          });

          const createdStatusName = payout?.payout_status?.name ?? "created";

          // In v5 lifecycles, relation values in event.params.data are already
          // transformed to { set: [...] } shapes — read the populated payout instead.
          if (payout?.application?.id) {
            application = await findOneById("api::grant-application-final.grant-application-final", payout.application.id, {
              populate: "*"
            });

            message.push(
              `Grant Payout of $${event.params.data.amount} was ${createdStatusName} for ${application?.legal_entity_name ?? "unknown applicant"} for ${grant?.name ?? "grant"}`
            );
            if (application) {
              relations.push({ id: application.id, name: "grant-application" });
            }
          } else {
            message.push(
              `Grant Payout of $${event.params.data.amount} was ${createdStatusName} for ${grant?.name ?? "grant"} type: ${event.params.data.type}`
            );
          }

          // const pointOfContact = await strapi.entityService.findOne('api::contact.contact', application.point_of_contact.id, {
          //   populate: "*"
          // })

          relations.push({ id: payoutId, name: "grant-payouts" });
          if (grant) {
            relations.push({ id: grant.id, name: "grant" });
          }
          // relations.push({ id: pointOfContact.id, name: 'contacts' });
          break;
      }
      if (message.length > 0) {
        await relate_activity(await add_activity(message), relations);
      }
    },
    afterUpdate: async (event: any) => {
      const message: string[] = [];
      const relations: { id: number; name: string }[] = [];

      switch (event.model.singularName) {
        case "training-event":
          if (event.result.status === "DEQ") {
            const eventId = event.result.id;
            const start = new Date(event.result.start);
            const formattedStart = start.toLocaleString("en-US", YearMonthDay);
            const end = new Date(event.result.end);
            const formattedEnd = end.toLocaleString("en-US", YearMonthDay);

            message.push(
              `Training Event ${event.result.training_type} from ${formattedStart} to ${formattedEnd} was sent to DEQ for approval`
            );
            relations.push({ id: eventId, name: "training-event" });
          }

          break;
        case "grant-application": {
          // Clients may send the status relation as an object ({ id }) or a raw id.
          const rawStatus = event.params.data.status;
          const statusId = rawStatus && typeof rawStatus === "object" ? rawStatus.id : rawStatus;
          if (!statusId) break;

          const status = await findOneById("api::grant-denial-reason.grant-denial-reason", statusId, {
            populate: "*"
          });

          const applicationId = event.result.id;
          const application = await findOneById("api::grant-application.grant-application", applicationId, {
            populate: "*"
          });
          if (!status || !application) break;

          const grant = application.grant?.id
            ? await findOneById("api::grant.grant", application.grant.id, {
                populate: "*"
              })
            : null;
          const contact = application.applicant?.id
            ? await findOneById("api::contact.contact", application.applicant.id, {
                populate: "*"
              })
            : null;
          message.push(
            `Grant Application for ${grant?.name ?? "grant"} was ${
              status.name === "Approved"
                ? "Approved"
                : status.name === "Not Approved"
                ? "Not Approved"
                : `rejected ${status.name}`
            } for ${contact?.first ?? ""} ${contact?.last ?? ""} by ${
              application.updatedBy?.firstname ?? ""
            } ${application.updatedBy?.lastname ?? ""}`
          );

          relations.push({ id: applicationId, name: "grant-application" });
          if (grant) {
            relations.push({ id: grant.id, name: "grant" });
          }
          if (contact) {
            relations.push({ id: contact.id, name: "contact" });
          }

          break;
        }
        // on status change of a payout make an activity for the payout and attatch it to the grant application and related entities
        case "grant-payout":
          const payoutId = event.result.id;
          let applicationApplied
          console.log("Grant Payout: ", event.result);

          const payout = await findOneById("api::grant-payout.grant-payout", payoutId, {
            populate: "*"
          });
          // NOTE: hard-coded grant id 4 preserved from the original v4 code
          const grantApplied = await findOneById("api::grant.grant", 4, {
            populate: "*"
          });

          const updatedStatusName = payout?.payout_status?.name ?? "updated";

          if (event.params.data.application && payout?.application?.id) {

            applicationApplied = await findOneById("api::grant-application-final.grant-application-final", payout.application.id, {
              populate: "*"
            });
            message.push(
              `Grant Payout of $${payout?.amount ?? event.result.amount} was ${updatedStatusName} for ${applicationApplied?.legal_entity_name ?? "unknown applicant"} for ${grantApplied?.name ?? "grant"}`
            );
            if (applicationApplied) {
              relations.push({
                id: applicationApplied.id,
                name: "grant-application",
              });
            }
          } else {
            message.push(
              `Grant Payout of $${event.result.amount} was ${updatedStatusName} for ${grantApplied?.name ?? "grant"} type: ${event.result.type}`
            );
          }
          
         
          relations.push({ id: payoutId, name: "grant-payouts" });
          if (grantApplied) {
            relations.push({ id: grantApplied.id, name: "grant" });
          }
          // relations.push({ id: pointOfContact.id, name: 'contacts' })
          
          break;
      }
      if (message.length > 0) {
        await relate_activity(await add_activity(message), relations);
      }
    },
  });
};
