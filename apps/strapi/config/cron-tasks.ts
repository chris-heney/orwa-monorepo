import dayjs from "dayjs";
import { CronExpressionParser } from "cron-parser";
import { coerceToSchema } from "../src/utils/coerce-to-schema";

// Helper function to update dates in query conditions
const updateQueryDates = (condition: any, cronRule: string): any => {
  if (!condition || typeof condition !== 'object') return condition;

  // Determine if this is a monthly recurring task
  const isMonthlyRecurring = cronRule.includes('1 *') || cronRule.includes('L *'); // First day or last day of month

  if (!isMonthlyRecurring) return condition;

  const updatedCondition = { ...condition };

  // Recursively process the condition object
  const processObject = (obj: any): any => {
    const processed = { ...obj };
    
    for (const [key, value] of Object.entries(processed)) {
      if (value && typeof value === 'object') {
        // Handle $between date ranges
        if (key === '$between' && Array.isArray(value) && value.length === 2) {
          const [startDate, endDate] = value;
          if (typeof startDate === 'string' && typeof endDate === 'string') {
            // Check if both values look like dates (yyyy-mm-dd format)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (dateRegex.test(startDate) && dateRegex.test(endDate)) {
              // Add one month to both dates
              const newStartDate = dayjs(startDate).add(1, 'month').format('YYYY-MM-DD');
              const newEndDate = dayjs(endDate).add(1, 'month').format('YYYY-MM-DD');
              processed[key] = [newStartDate, newEndDate];
              console.log(`📅 Updated date range: ${startDate} - ${endDate} → ${newStartDate} - ${newEndDate}`);
            }
          }
        }
        // Handle single date fields
        else if (typeof value === 'string') {
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (dateRegex.test(value)) {
            const newDate = dayjs(value).add(1, 'month').format('YYYY-MM-DD');
            processed[key] = newDate;
            console.log(`📅 Updated single date: ${value} → ${newDate}`);
          }
        }
        // Handle nested objects
        else if (typeof value === 'object' && !Array.isArray(value)) {
          processed[key] = processObject(value);
        }
      }
    }
    
    return processed;
  };

  return processObject(updatedCondition);
};

export default {
  dynamicEmailScheduler: {
    task: async ({ strapi }) => {
      console.log("🔄 Checking Scheduled Email Tasks");

      // Fetch active email tasks
      const tasks = await strapi.documents("api::scheduled-email-task.scheduled-email-task").findMany({
        filters: { active: true },
        populate: { email_template: { populate: { attachments: true } } },
      });

      if (tasks.length === 0) {
        console.log("🚫 No active scheduled tasks found.");
        return;
      }

      for (const task of tasks) {
        const {
          cron_rule,
          email_template,
          entity,
          condition,
          last_sent,
          name,
        } = task;

        const now = new Date();
        let previousRun = null;
        let nextRun = null;

        try {
          const cron = CronExpressionParser.parse(cron_rule);
          previousRun = cron.prev().toDate();
          nextRun = cron.next().toDate();
        } catch (err) {
          console.error(`❌ Invalid cron expression for task: ${name}`, err);
          continue;
        }

        console.log(`📌 Task: ${name}`);
        console.log(`🕒 Previous run: ${previousRun}`);
        console.log(`🕒 Next run: ${nextRun}`);
        console.log(`🕒 Last sent: ${last_sent}`);

        // Skip execution if the last sent time is after the previous run
        if (last_sent && dayjs(last_sent).isAfter(dayjs(previousRun))) {
          continue;
        }

        // Fetch entities based on filters (using current condition)
        const entities = await strapi.db
          .query(`api::${entity}.${entity}`)
          .findMany({
            where: {
              ...condition,
            },
            populate: true,
          });

        console.log(`Entities found: ${entities.length}`);

        if (entities.length === 0) {
          console.log(`⚠️ No matching entities found for task: ${name}`);
          continue;
        }

        console.log(`📧 Sending emails for task: ${name}`);
        let emailsSent = 0;

        for (const entity of entities) {
          const emailBody = email_template.body.replace(
            /{([^}]+)}/g,
            (_, key) => {
              const keys = key.trim().split(".");
              let value = entity;
              for (const k of keys) {
                value = value ? value[k] : null;
              }
              return value !== undefined && value !== null ? value : `{${key}}`;
            }
          );

          const toEmail = email_template.to.replace(/{([^}]+)}/g, (_, key) => {
            const keys = key.trim().split(".");
            let value = entity;
            for (const k of keys) {
              value = value ? value[k] : null;
            }
            return value !== undefined && value !== null ? value : "";
          });

          if (!toEmail) {
            console.warn(
              `❌ No recipient email found for entity in task: ${name}`
            );
            continue;
          }

          const attachments = email_template?.attachments?.map((attachment: any) => {
            return {
              name: attachment.name,
              url: `${process.env.STRAPI_API_ENDPOINT}${attachment.url}`,
            };
          });

          try {
            await strapi.plugins["email"].services.email.send({
              to: toEmail,
              // to: "Marcosje2005@gmail.com",
              from: email_template.from_name + `<${email_template.from_email}>`,
              subject: email_template.subject || "Scheduled Notification",
              html: emailBody,
              attachments: attachments,
            });

            emailsSent++;

            // Log success in the email_logs collection.
            // coerceToSchema drops keys that are not email-log attributes
            // (subject, sent_at, status, ...); Strapi 5 throws "Invalid key"
            // for them, which would abort the task loop before last_sent is
            // updated and cause the emails to be re-sent every minute.
            await strapi.documents("api::email-log.email-log").create({
              data: coerceToSchema("api::email-log.email-log", {
                html: emailBody,
                to: toEmail,
                from: email_template.from_name + `<${email_template.from_email}>`,
                subject: email_template.subject,
                template: email_template.id,
                sent_at: new Date(),
                status: "success",
                recipient_name: entity.name || "Unknown",
                task_name: name,
                entity_id: entity.id,
                cron_rule: cron_rule,
              }),
            });
          } catch (error) {
            console.error(`❌ Error sending email to: ${toEmail}`, error);

            // Log failure in the email_logs collection (see note above on
            // coerceToSchema stripping non-schema keys).
            await strapi.documents("api::email-log.email-log").create({
              data: coerceToSchema("api::email-log.email-log", {
                html: emailBody,
                to: toEmail,
                from: "office@orwa.org",
                subject: email_template.subject,
                template: email_template.id,
                sent_at: new Date(),
                status: "failure",
                error_message: error.message,
                recipient_name: entity.name || "Unknown",
                task_name: name,
                entity_id: entity.id,
                cron_rule: cron_rule,
              }),
            });
          }
        }

        // Update query dates AFTER successful email sending (only if emails were sent)
        if (emailsSent > 0) {
          const updatedCondition = updateQueryDates(condition, cron_rule);
          
          // If condition was updated, save it back to the task
          if (JSON.stringify(condition) !== JSON.stringify(updatedCondition)) {
            try {
              await strapi.db
                .query("api::scheduled-email-task.scheduled-email-task")
                .update({
                  where: { id: task.id },
                  data: { 
                    condition: updatedCondition,
                    last_sent: new Date()
                  },
                });
              console.log(`📝 Updated task condition and last_sent for: ${name}`);
            } catch (updateError) {
              console.error(`❌ Error updating task condition for: ${name}`, updateError);
            }
          } else {
            // Update only last_sent timestamp if no condition changes
            await strapi.db
              .query("api::scheduled-email-task.scheduled-email-task")
              .update({
                where: { id: task.id },
                data: { last_sent: new Date() },
              });
          }
        } else {
          console.log(`⚠️ No emails sent for task: ${name}, condition not updated`);
        }

        console.log(`✅ Task "${name}" processed successfully.`);
      }
      
      console.log("✅ All scheduled email tasks processed successfully.");
    },

    options: {
      rule: "*/1 * * * *", // Runs every minute to check for scheduled tasks dynamically
    },
  },
};
