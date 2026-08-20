import dayjs from 'dayjs';
import { CronExpressionParser } from 'cron-parser';
import { coerceToSchema } from '../src/utils/coerce-to-schema';
import { resolveRelativeDates } from '../src/utils/relative-dates';

export default {
  dynamicEmailScheduler: {
    task: async ({ strapi }) => {
      console.log('🔄 Checking Scheduled Email Tasks');

      // Fetch active email tasks
      const tasks = await strapi
        .documents('api::scheduled-email-task.scheduled-email-task')
        .findMany({
          filters: { active: true },
          populate: {
            email_template: { populate: { attachments: true } },
            saved_query: true,
          },
        });

      if (tasks.length === 0) {
        console.log('🚫 No active scheduled tasks found.');
        return;
      }

      for (const task of tasks) {
        const {
          cron_rule,
          email_template,
          entity,
          condition,
          saved_query,
          last_sent,
          name,
        } = task;

        /** Always advance the clock, even when nothing was sent — otherwise a
         * run that matches no one leaves last_sent stale and the task requeues
         * on every tick, forever. */
        const markRun = async () => {
          try {
            await strapi.db
              .query('api::scheduled-email-task.scheduled-email-task')
              .update({
                where: { id: task.id },
                data: { last_sent: new Date() },
              });
          } catch (updateError) {
            console.error(
              `❌ Error updating last_sent for: ${name}`,
              updateError,
            );
          }
        };

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

        // Prefer the linked saved query so edits to it take effect here; the
        // stored condition is the fallback for tasks predating that link.
        const storedCondition = saved_query?.filters ?? condition;

        // An empty condition means "no filter", which would mail the entire
        // table. Refuse rather than guess — the task needs a query.
        if (
          !storedCondition ||
          typeof storedCondition !== 'object' ||
          Object.keys(storedCondition).length === 0
        ) {
          console.warn(
            `⛔ Task "${name}" has no query; skipping (an empty condition would email every ${entity}).`,
          );
          await markRun();
          continue;
        }

        // Expand relative date tokens ($now-1y, …) against the current clock,
        // so a stored window means the same thing every month.
        const effectiveCondition = resolveRelativeDates(storedCondition);

        const entities = await strapi.db
          .query(`api::${entity}.${entity}`)
          .findMany({
            where: {
              ...effectiveCondition,
            },
            populate: true,
          });

        console.log(`Entities found: ${entities.length}`);

        if (entities.length === 0) {
          console.log(`⚠️ No matching entities found for task: ${name}`);
          await markRun();
          continue;
        }

        console.log(`📧 Sending emails for task: ${name}`);
        let emailsSent = 0;

        for (const entity of entities) {
          const emailBody = email_template.body.replace(
            /{([^}]+)}/g,
            (_, key) => {
              const keys = key.trim().split('.');
              let value = entity;
              for (const k of keys) {
                value = value ? value[k] : null;
              }
              return value !== undefined && value !== null ? value : `{${key}}`;
            },
          );

          const toEmail = email_template.to.replace(/{([^}]+)}/g, (_, key) => {
            const keys = key.trim().split('.');
            let value = entity;
            for (const k of keys) {
              value = value ? value[k] : null;
            }
            return value !== undefined && value !== null ? value : '';
          });

          if (!toEmail) {
            console.warn(
              `❌ No recipient email found for entity in task: ${name}`,
            );
            continue;
          }

          const attachments = email_template?.attachments?.map(
            (attachment: any) => {
              return {
                name: attachment.name,
                url: `${process.env.STRAPI_API_ENDPOINT}${attachment.url}`,
              };
            },
          );

          try {
            await strapi.plugins['email'].services.email.send({
              to: toEmail,
              // to: "Marcosje2005@gmail.com",
              from: email_template.from_name + `<${email_template.from_email}>`,
              subject: email_template.subject || 'Scheduled Notification',
              html: emailBody,
              attachments: attachments,
            });

            emailsSent++;

            // Log success in the email_logs collection.
            // coerceToSchema drops keys that are not email-log attributes
            // (subject, sent_at, status, ...); Strapi 5 throws "Invalid key"
            // for them, which would abort the task loop before last_sent is
            // updated and cause the emails to be re-sent every minute.
            await strapi.documents('api::email-log.email-log').create({
              data: coerceToSchema('api::email-log.email-log', {
                html: emailBody,
                to: toEmail,
                from:
                  email_template.from_name + `<${email_template.from_email}>`,
                subject: email_template.subject,
                template: email_template.id,
                sent_at: new Date(),
                status: 'success',
                recipient_name: entity.name || 'Unknown',
                task_name: name,
                entity_id: entity.id,
                cron_rule: cron_rule,
              }),
            });
          } catch (error) {
            console.error(`❌ Error sending email to: ${toEmail}`, error);

            // Log failure in the email_logs collection (see note above on
            // coerceToSchema stripping non-schema keys).
            await strapi.documents('api::email-log.email-log').create({
              data: coerceToSchema('api::email-log.email-log', {
                html: emailBody,
                to: toEmail,
                from: 'office@orwa.org',
                subject: email_template.subject,
                template: email_template.id,
                sent_at: new Date(),
                status: 'failure',
                error_message: error.message,
                recipient_name: entity.name || 'Unknown',
                task_name: name,
                entity_id: entity.id,
                cron_rule: cron_rule,
              }),
            });
          }
        }

        // The window is derived from the clock, not ratcheted forward, so
        // there is no condition to write back — just record the run.
        await markRun();
        console.log(`📨 Sent ${emailsSent} email(s) for task: ${name}`);

        console.log(`✅ Task "${name}" processed successfully.`);
      }

      console.log('✅ All scheduled email tasks processed successfully.');
    },

    options: {
      rule: '*/1 * * * *', // Runs every minute to check for scheduled tasks dynamically
    },
  },
};
