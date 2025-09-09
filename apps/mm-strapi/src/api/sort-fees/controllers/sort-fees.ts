/**
 * A set of functions called "actions" for `sort-fees`
 */

export default ({ strapi }) => ({
  myTest: async (ctx, next) => {
    try {
      const user = await strapi.plugins[
        "users-permissions"
      ].services.user.fetchAll({
        fields: ["id"],
        filters: { email: "chris.heney@gmail.com" },
        limit: 1,
      });
      ctx.body = user;
    } catch (err) {
      ctx.body;
    }
  },
  sortSystemFees: async (ctx, next) => {
    try {
      const systems = await strapi.documents("api::watersystem.watersystem").findMany({
        start: 0,
        limit: 1000,
      });

      const paymentUpdates: Record<any, any>[] = [];

      for (let i = 0; i < systems.length; i++) {
        const { id, name, payment_details, meters } = systems[i];
        if (!payment_details) {
          continue;
        }

        const amountRegex = /(\d+(?:,\d+)*)(\.\d+)?/;

        // Find the line containing "Scholarship Support:"
        const scholarshipLine = payment_details
          .split("\r\n")
          .find((line) => line.startsWith("Scholarship Support:"));
        const fee_scholarship = parseFloat(
          amountRegex.exec(
            scholarshipLine?.slice(20).replace(",", "").trim()
          )?.[1] || "0"
        );

        // Find the line containing "Apprenticeship Support:"
        const apprenticeshipLine = payment_details
          .split("\r\n")
          .find((line) => line.startsWith("Apprenticeship Support:"));
        const fee_apprenticeship = parseFloat(
          amountRegex.exec(
            apprenticeshipLine?.toString().slice(24).replace(",", "").trim()
          )?.[1] || "0"
        );

        const connectionFee = Math.round(meters * 0.9 * 100) / 100;

        paymentUpdates.push({
          id,
          data: {
            system: name,
            fee_connections: connectionFee > 4000 ? 4000 : connectionFee,
            fee_membership: 90,
            fee_scholarship,
            fee_apprenticeship,
          },
          debug: {
            apprenticeshipLine,
            scholarshipLine,
          },
        });
      }

      const results: Record<any, any>[] = [];
      paymentUpdates.forEach(async (paymentUpdates) => {
        console.log("Updating", paymentUpdates.data.system);
        console.log("Debug", paymentUpdates.debug);
        const response = await strapi.documents("api::watersystem.watersystem").update({
          documentId: "__TODO__",
          data: paymentUpdates.data
        });
        results.push(response);
      });

      ctx.body = paymentUpdates;
    } catch (err) {
      ctx.body = err;
    }
  },
  sortAssociateFees: async (ctx, next) => {
    try {
      const systems = await strapi.documents("api::associate.associate").findMany({
        start: 0,
        limit: 1000,
      });

      const paymentUpdates: Record<any, any>[] = [];

      for (let i = 0; i < systems.length; i++) {
        const { id, name, payment_details, meters } = systems[i];
        if (!payment_details) {
          continue;
        }

        const amountRegex = /\$([\d,]+(?:\.\d{2})?)/;

        // ==========
        // each can be different ex (Gold, Silver, Platinum)
        // Membership Level (Platinum): $7500
        // Scholarship Support:
        // ----------
        // Total: $7,500.00
        // ==========

        const scholarshipLine = payment_details
          .split("\r\n")
          .find((line) => line.startsWith("Scholarship Support:"));
        const fee_scholarship = parseFloat(
          amountRegex.exec(
            scholarshipLine?.slice(20).replace(",", "").trim()
          )?.[1] || "0"
        );

        // Find the line containing "Apprenticeship Support:"
        const apprenticeshipLine = payment_details
          .split("\r\n")
          .find((line) => line.startsWith("Apprenticeship Support:"));
        const fee_apprenticeship = parseFloat(
          amountRegex.exec(
            apprenticeshipLine?.toString().slice(24).replace(",", "").trim()
          )?.[1] || "0"
        );

        const membershipLine = payment_details
          .split("\r\n")
          .find((line) => 
            line.includes("Membership") 
          );

        // Extract the fee from the membership line
        const membershipFeeMatch = amountRegex.exec(membershipLine || "");
        const membershipFee = membershipFeeMatch
          ? parseFloat(membershipFeeMatch[1].replace(/,/g, ""))
          : 0;
                  
        paymentUpdates.push({
          id,
          data: {
            associate: name,
            // fee_connections: connectionFee > 4000 ? 4000 : connectionFee,
            fee_membership: membershipFee,
            fee_scholarship,
            fee_apprenticeship,
          },
          debug: {
            // apprenticeshipLine,
            // scholarshipLine,
            membershipLine,
            membershipFee,
            membershipLineDebug: membershipLine ? membershipLine[0] : "Not Found",
            membershipFeeMatch:  membershipFeeMatch 
          },
        });
      }

      const results: Record<any, any>[] = [];
      paymentUpdates.forEach(async (paymentUpdates) => {
        // console.log("Updating", paymentUpdates.data.system);
        console.log("Debug", paymentUpdates.debug);
        const response = await strapi.documents("api::associate.associate").update({
          documentId: "__TODO__",
          data: paymentUpdates.data
        });
        results.push(response);
      });

      ctx.body = paymentUpdates;
    } catch (err) {
      ctx.body = err;
    }
  },
});
