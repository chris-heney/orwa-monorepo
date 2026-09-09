/**
 * Applicant-facing RIG reimbursement requests.
 *
 * Flow (mirrors the "modify existing application" edit-link flow):
 *   POST /grant-reimbursement/request-link { email }
 *     -> emails a signed, expiring link when the address is a contact on at
 *        least one application that is eligible to draw reimbursements.
 *   GET  /grant-reimbursement/session?token=...
 *     -> re-validates the token and returns the eligible applications with the
 *        same award / paid / remaining math the Grant Manager dashboard uses.
 *   POST /grant-reimbursement/submit { token, ...request }
 *     -> re-validates token, application eligibility and remaining balance,
 *        normalizes the payload, creates a `grant-payout` (type Reimbursement,
 *        status Requested, source Applicant Portal) and notifies both the
 *        applicant and the RIG shared inbox using the required subject line
 *        "REIMBURSEMENT REQUEST | System Name | Application ID #".
 *
 * The link itself is never trusted: every call re-checks status and balance.
 */

import {
  computeAwardBalance,
  computeRequestedAmount,
  createReimbursementToken,
  isReimbursementEligibleStatusName,
  reimbursementSubjectLine,
  ReimbursementSubmissionInput,
  roundMoney,
  validateReimbursementSubmission,
  verifyReimbursementToken,
} from "../helpers/reimbursement-rules";

const GRANT_APPLICATION_UID =
  "api::grant-application-final.grant-application-final" as const;
const GRANT_PAYOUT_UID = "api::grant-payout.grant-payout" as const;

const GRANT_APP_URL =
  process.env.GRANT_APP_URL || "https://orwa.org/gapp-form";
const MEMBER_MANAGER_URL =
  process.env.MEMBER_MANAGER_URL || "https://orwa.org/member-manager";
const FILE_BASE_URL =
  process.env.PUBLIC_URL || process.env.URL || "https://admin.orwa.org";
const RIG_MANAGER_EMAIL = process.env.RIG_MANAGER_EMAIL || "rig@orwa.org";
const DEFAULT_FROM = "RIG Manager <rig@orwa.org>";

/** Brevo rejects oversized attachment sets; fall back to links past this. */
const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;

const APPLICATION_POPULATE = {
  status: true,
  grant: true,
  point_of_contact: true,
  chairman: true,
  engineer: true,
  additional_contacts: true,
  payouts: { populate: { payout_status: true } },
} as const;

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value || 0);

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const fileUrl = (file: { url?: string }) =>
  file?.url?.startsWith("http") ? file.url : `${FILE_BASE_URL}${file?.url ?? ""}`;

export default ({ strapi }) => {
  const tokenSecret = (): string => {
    const explicit = process.env.REIMBURSEMENT_TOKEN_SECRET;
    if (explicit) return explicit;
    const keys = strapi.config.get("server.app.keys") as string[] | undefined;
    if (!keys?.length) {
      throw new Error("APP_KEYS must be configured to sign reimbursement links");
    }
    return `${keys[0]}:grant-reimbursement`;
  };

  const logFormData = async (data: unknown, resource: string) => {
    try {
      await strapi.documents("api::log.log").create({ data: { data, resource } });
    } catch (err) {
      strapi.log.warn(`grant-reimbursement: log write failed: ${err.message}`);
    }
  };

  /** Every application where the address is any contact, newest first. */
  const findApplicationsByContactEmail = async (email: string) =>
    strapi.documents(GRANT_APPLICATION_UID).findMany({
      filters: {
        $or: [
          { point_of_contact: { email: { $eqi: email } } },
          { chairman: { email: { $eqi: email } } },
          { engineer: { email: { $eqi: email } } },
          { additional_contacts: { email: { $eqi: email } } },
        ],
      },
      sort: { createdAt: "desc" },
      limit: 100,
      populate: APPLICATION_POPULATE,
    });

  const isEligible = (application) =>
    isReimbursementEligibleStatusName(application.status?.name) &&
    !application.closed_out;

  /** Compact, client-safe view of an application for the picker + summary. */
  const toSessionApplication = (a) => {
    const balance = computeAwardBalance(a);
    const poc = a.point_of_contact;
    return {
      documentId: a.documentId,
      application_id: a.application_id ?? "",
      legal_entity_name: a.legal_entity_name ?? "",
      facility_id: a.facility_id ?? "",
      county: a.county ?? "",
      status: a.status?.name ?? "",
      committee_date: a.committee_date ?? null,
      grant_name: a.grant?.name ?? "",
      point_of_contact: poc
        ? {
            first: poc.first ?? "",
            last: poc.last ?? "",
            title: poc.title ?? "",
            email: poc.email ?? "",
            phone: poc.phone ?? "",
          }
        : null,
      award_amount: balance.award,
      paid_to_date: balance.paid,
      pending_requests: balance.pending,
      remaining_balance: balance.remaining,
      payout_count: (a.payouts ?? []).filter((p) => p.type !== "Administrative")
        .length,
    };
  };

  const requestLink = (token: string) =>
    `${GRANT_APP_URL}/?reimburse_token=${encodeURIComponent(token)}`;

  const findTemplate = async (emailName: string) => {
    const templates = await strapi
      .documents("api::email-template.email-template")
      .findMany({ filters: { email_name: emailName }, limit: 1 });
    return templates[0] ?? null;
  };

  const interpolate = (text: string, variables: Record<string, unknown>) =>
    text.replace(/{([^}]+)}/g, (match, key) => {
      const replacement = variables[key.trim()];
      return replacement !== undefined ? String(replacement) : match;
    });

  const sendRequestLinkEmail = async (email: string, applications, token) => {
    const link = requestLink(token);
    const systems = applications
      .map((a) => `${a.legal_entity_name} (Application #${a.application_id})`)
      .join(", ");
    const variables = {
      systems,
      reimbursement_link: link,
      request_link: link,
    };
    const template = await findTemplate("Reimbursement Request Link");
    const subject = template
      ? interpolate(template.subject, variables)
      : "Submit a RIG Reimbursement Request";
    const html = template
      ? interpolate(template.body, variables)
      : `<p>Hello,</p>
         <p>We received a request to submit a Rural Infrastructure Grant
         reimbursement request for <strong>${escapeHtml(systems)}</strong>.</p>
         <p><a href="${link}">Click here to submit your reimbursement request</a></p>
         <p>This link is valid for 14 days. Have your paid invoices, proof of
         payment, and project photos ready to upload. If you did not request
         this, you can safely ignore this email.</p>
         <p>&mdash; Oklahoma Rural Water Association</p>`;

    await strapi.plugins["email"].services.email.send({
      to: email,
      from: template
        ? `${template.from_name} <${template.from_email}>`
        : DEFAULT_FROM,
      replyTo: RIG_MANAGER_EMAIL,
      subject,
      html,
    });
  };

  const findRequestedPayoutStatus = async () =>
    strapi.db.query("api::payout-status.payout-status").findOne({
      where: { name: "Requested", publishedAt: { $notNull: true } },
      orderBy: { id: "asc" },
    });

  const findFiles = async (ids: number[]) =>
    ids.length
      ? strapi.db.query("plugin::upload.file").findMany({
          where: { id: { $in: ids } },
          select: ["id", "name", "url", "mime", "size", "ext"],
        })
      : [];

  /**
   * Feed entry attached to the application and the new payout, using the same
   * entity names the activity-feed plugin uses ("grant-application" /
   * "grant-payouts") so both dashboards pick it up.
   */
  const recordActivity = async (
    description: string,
    relations: { entity: "grant-application" | "grant-payouts"; id: number }[]
  ) => {
    try {
      const activity = await strapi.documents("api::activity.activity").create({
        data: { description, timestamp: new Date().toISOString() },
      });
      for (const relation of relations) {
        await strapi.documents("api::activity-relation.activity-relation").create({
          data: {
            activity: activity.id,
            entity: relation.entity,
            entity_id: relation.id,
          },
        });
      }
    } catch (err) {
      strapi.log.warn(`grant-reimbursement: activity write failed: ${err.message}`);
    }
  };

  const buildRequestHtml = (opts: {
    application;
    input: ReimbursementSubmissionInput;
    invoiceTotal: number;
    requestedAmount: number;
    balanceBefore: ReturnType<typeof computeAwardBalance>;
    files: { paid_invoices; proof_of_payment; project_photos };
    payoutId: number;
    forManager: boolean;
  }) => {
    const {
      application: a,
      input,
      invoiceTotal,
      requestedAmount,
      balanceBefore,
      files,
      payoutId,
      forManager,
    } = opts;

    const rows = input.invoices
      .map(
        (inv, i) => `<tr>
          <td style="padding:6px 8px;border:1px solid #ddd;">${i + 1}</td>
          <td style="padding:6px 8px;border:1px solid #ddd;">${escapeHtml(inv.vendor)}</td>
          <td style="padding:6px 8px;border:1px solid #ddd;">${escapeHtml(inv.invoice_number)}</td>
          <td style="padding:6px 8px;border:1px solid #ddd;text-align:right;">${money(inv.amount)}</td>
        </tr>`
      )
      .join("");

    const fileList = (label: string, list) =>
      `<p style="margin:8px 0 2px;"><strong>${label}</strong>${
        list.length ? "" : " &mdash; <em>none</em>"
      }</p>` +
      (list.length
        ? `<ul style="margin:0 0 8px 18px;padding:0;">${list
            .map(
              (f) =>
                `<li><a href="${fileUrl(f)}">${escapeHtml(f.name)}</a> <span style="color:#666;">(${Math.max(1, Math.round((f.size ?? 0)))} KB)</span></li>`
            )
            .join("")}</ul>`
        : "");

    const remainingAfter = roundMoney(balanceBefore.remaining - requestedAmount);
    const capped = requestedAmount < invoiceTotal;

    const managerLink = `${MEMBER_MANAGER_URL}/#/grant-application-finals/${a.documentId}/show`;

    return `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222;">
        <h2 style="margin:0 0 4px;color:#1a237e;">RIG Reimbursement Request</h2>
        <p style="margin:0 0 12px;color:#555;">Request #${payoutId} &middot; submitted ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })} (Central)</p>

        <table style="border-collapse:collapse;margin-bottom:14px;">
          <tr><td style="padding:3px 12px 3px 0;color:#555;">System</td><td><strong>${escapeHtml(a.legal_entity_name)}</strong></td></tr>
          <tr><td style="padding:3px 12px 3px 0;color:#555;">Application ID #</td><td><strong>${escapeHtml(a.application_id)}</strong></td></tr>
          <tr><td style="padding:3px 12px 3px 0;color:#555;">Facility ID</td><td>${escapeHtml(a.facility_id || "—")}</td></tr>
          <tr><td style="padding:3px 12px 3px 0;color:#555;">Requester</td><td>${escapeHtml(input.requester_name)}, ${escapeHtml(input.requester_title)}</td></tr>
          <tr><td style="padding:3px 12px 3px 0;color:#555;">Requester email</td><td><a href="mailto:${escapeHtml(input.requester_email)}">${escapeHtml(input.requester_email)}</a></td></tr>
          <tr><td style="padding:3px 12px 3px 0;color:#555;">Requester phone</td><td>${escapeHtml(input.requester_phone || "—")}</td></tr>
        </table>

        <h3 style="margin:14px 0 6px;color:#1a237e;">Invoice / Pay Application Details</h3>
        <table style="border-collapse:collapse;width:100%;max-width:640px;">
          <thead>
            <tr style="background:#e8eaf6;">
              <th style="padding:6px 8px;border:1px solid #ddd;text-align:left;">#</th>
              <th style="padding:6px 8px;border:1px solid #ddd;text-align:left;">Vendor Invoice Name</th>
              <th style="padding:6px 8px;border:1px solid #ddd;text-align:left;">Invoice #</th>
              <th style="padding:6px 8px;border:1px solid #ddd;text-align:right;">Invoice Amount</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr><td colspan="3" style="padding:6px 8px;border:1px solid #ddd;text-align:right;"><strong>Total Amount Paid</strong></td><td style="padding:6px 8px;border:1px solid #ddd;text-align:right;"><strong>${money(invoiceTotal)}</strong></td></tr>
            <tr><td colspan="3" style="padding:6px 8px;border:1px solid #ddd;text-align:right;">Reimbursement Requested</td><td style="padding:6px 8px;border:1px solid #ddd;text-align:right;"><strong>${money(requestedAmount)}</strong></td></tr>
          </tfoot>
        </table>
        ${
          capped
            ? `<p style="margin:8px 0;color:#8a6d00;">Invoices exceed the remaining grant balance; the request was capped at the ${money(balanceBefore.remaining)} remaining.</p>`
            : ""
        }

        <h3 style="margin:14px 0 6px;color:#1a237e;">Award Balance</h3>
        <table style="border-collapse:collapse;">
          <tr><td style="padding:3px 12px 3px 0;color:#555;">Award amount</td><td style="text-align:right;">${money(balanceBefore.award)}</td></tr>
          <tr><td style="padding:3px 12px 3px 0;color:#555;">Paid to date</td><td style="text-align:right;">${money(balanceBefore.paid)}</td></tr>
          <tr><td style="padding:3px 12px 3px 0;color:#555;">Other pending requests</td><td style="text-align:right;">${money(balanceBefore.pending)}</td></tr>
          <tr><td style="padding:3px 12px 3px 0;color:#555;">This request</td><td style="text-align:right;">${money(requestedAmount)}</td></tr>
          <tr><td style="padding:3px 12px 3px 0;color:#555;"><strong>Remaining after this request</strong></td><td style="text-align:right;"><strong>${money(remainingAfter)}</strong></td></tr>
        </table>

        <h3 style="margin:14px 0 6px;color:#1a237e;">Required Documentation</h3>
        ${fileList("Copy of all paid invoices / pay applications", files.paid_invoices)}
        ${fileList("Proof of payment (cleared check, card receipt, ACH, etc.)", files.proof_of_payment)}
        ${
          input.photos_not_applicable
            ? `<p style="margin:8px 0 2px;"><strong>Photos of project / work performed</strong> &mdash; <em>marked not applicable by requester</em></p>`
            : fileList("Photos of project / work performed", files.project_photos)
        }
        ${
          input.applicant_notes
            ? `<h3 style="margin:14px 0 6px;color:#1a237e;">Notes from Requester</h3><p style="white-space:pre-wrap;">${escapeHtml(input.applicant_notes)}</p>`
            : ""
        }

        <h3 style="margin:14px 0 6px;color:#1a237e;">Certification</h3>
        <p style="margin:0 0 6px;">${escapeHtml(input.requester_name)} certified that the information provided is true and correct to the best of their knowledge and that the requested reimbursement is for eligible expenses related to the approved RIG project.</p>
        <p style="margin:0;"><img src="${input.requester_signature}" alt="Signature" style="max-height:90px;border:1px solid #ddd;padding:4px;background:#fff;" /></p>

        ${
          forManager
            ? `<p style="margin:18px 0 0;"><a href="${managerLink}" style="background:#1a237e;color:#fff;padding:8px 14px;border-radius:4px;text-decoration:none;">Open application in Grant Manager</a></p>
               <p style="margin:8px 0 0;color:#555;font-size:12px;">Reply to this email to reach the requester directly; the thread keeps the required subject line.</p>`
            : `<p style="margin:18px 0 0;color:#555;">ORWA will review your request. If additional items are needed we will reply to this email &mdash; please <strong>reply to the existing thread</strong> rather than starting a new message so your request stays together.</p>`
        }
      </div>`;
  };

  return {
    /** POST /grant-reimbursement/request-link { email } */
    requestLink: async (ctx) => {
      try {
        const { email } = (ctx.request.body ?? {}) as { email?: string };
        if (!email || typeof email !== "string" || !email.includes("@")) {
          ctx.status = 400;
          ctx.body = { code: "invalid_request", message: "Email is required." };
          return;
        }

        const applications = await findApplicationsByContactEmail(email.trim());
        if (applications.length === 0) {
          ctx.body = { code: "not_found" };
          return;
        }

        const eligible = applications.filter(isEligible);
        if (eligible.length === 0) {
          ctx.body = { code: "not_eligible" };
          return;
        }

        const token = createReimbursementToken(email, tokenSecret());
        await sendRequestLinkEmail(email.trim(), eligible, token);
        ctx.body = { code: "sent" };
      } catch (err) {
        strapi.log.error(`grant-reimbursement requestLink: ${err.message}`);
        ctx.status = 500;
        ctx.body = { code: "error", error: err.message };
      }
    },

    /** GET /grant-reimbursement/session?token=... */
    getSession: async (ctx) => {
      try {
        const parsed = verifyReimbursementToken(ctx.query?.token, tokenSecret());
        if (!parsed) {
          ctx.status = 404;
          ctx.body = { code: "invalid" };
          return;
        }

        const applications = await findApplicationsByContactEmail(parsed.email);
        const eligible = applications.filter(isEligible);
        if (eligible.length === 0) {
          ctx.status = 409;
          ctx.body = { code: "not_eligible" };
          return;
        }

        ctx.body = {
          code: "ok",
          email: parsed.email,
          expires: new Date(parsed.expires).toISOString(),
          applications: eligible.map(toSessionApplication),
        };
      } catch (err) {
        strapi.log.error(`grant-reimbursement getSession: ${err.message}`);
        ctx.status = 500;
        ctx.body = { code: "error", error: err.message };
      }
    },

    /** POST /grant-reimbursement/submit { token, ...request } */
    submit: async (ctx) => {
      try {
        const { token, ...body } = (ctx.request.body ?? {}) as Record<
          string,
          unknown
        > & { token?: string };

        const parsed = verifyReimbursementToken(token, tokenSecret());
        if (!parsed) {
          ctx.status = 404;
          ctx.body = { code: "invalid" };
          return;
        }

        const validation = validateReimbursementSubmission(body);
        if (validation.ok === false) {
          ctx.status = 400;
          ctx.body = { code: "validation", errors: validation.errors };
          return;
        }
        const input = validation.value;

        // The application must be one the verified email is a contact on, and
        // must still be eligible right now (status can change after the link
        // was sent).
        const applications = await findApplicationsByContactEmail(parsed.email);
        const application = applications.find(
          (a) => a.documentId === input.application
        );
        if (!application) {
          ctx.status = 403;
          ctx.body = { code: "forbidden", message: "That application is not linked to your email." };
          return;
        }
        if (!isEligible(application)) {
          ctx.status = 409;
          ctx.body = { code: "not_eligible" };
          return;
        }

        // Idempotency: a double-click / retry with the same client submission
        // id returns the original request instead of creating a duplicate.
        const existing = await strapi.db.query(GRANT_PAYOUT_UID).findOne({
          where: { portal_submission_id: input.portal_submission_id },
        });
        if (existing) {
          ctx.body = {
            code: "ok",
            duplicate: true,
            payout: { id: existing.id, amount: existing.amount },
            subject: reimbursementSubjectLine(
              application.legal_entity_name,
              application.application_id
            ),
          };
          return;
        }

        const balanceBefore = computeAwardBalance(application);
        if (balanceBefore.remaining <= 0) {
          ctx.status = 409;
          ctx.body = {
            code: "no_balance",
            message: "This grant has no remaining balance available for reimbursement.",
            balance: balanceBefore,
          };
          return;
        }

        const invoiceTotal = validation.invoice_total;
        const requestedAmount = computeRequestedAmount(
          invoiceTotal,
          balanceBefore.remaining
        );
        if (requestedAmount <= 0) {
          ctx.status = 400;
          ctx.body = {
            code: "validation",
            errors: ["The reimbursement amount must be greater than $0."],
          };
          return;
        }

        // Only link files that actually exist in the media library.
        const [paidFiles, proofFiles, photoFiles] = await Promise.all([
          findFiles(input.paid_invoices),
          findFiles(input.proof_of_payment),
          findFiles(input.project_photos),
        ]);
        const missing: string[] = [];
        if (paidFiles.length === 0) missing.push("Paid invoice uploads were not found. Please re-attach them.");
        if (proofFiles.length === 0) missing.push("Proof of payment uploads were not found. Please re-attach them.");
        if (input.project_photos.length > 0 && photoFiles.length === 0) {
          missing.push("Project photo uploads were not found. Please re-attach them.");
        }
        if (missing.length) {
          ctx.status = 400;
          ctx.body = { code: "validation", errors: missing };
          return;
        }

        const requestedStatus = await findRequestedPayoutStatus();
        const today = new Date().toISOString().slice(0, 10);

        await logFormData({ ...body, token: undefined }, "grant-reimbursement");

        const payout = await strapi.documents(GRANT_PAYOUT_UID).create({
          data: {
            type: "Reimbursement",
            source: "Applicant Portal",
            status: "Requested",
            payout_status: requestedStatus?.id ?? null,
            application: application.id,
            grant: application.grant?.id ?? null,
            transaction_date: today,
            amount: requestedAmount,
            invoice_total: invoiceTotal,
            invoices: input.invoices,
            requester_name: input.requester_name,
            requester_title: input.requester_title,
            requester_email: input.requester_email,
            requester_phone: input.requester_phone,
            requester_signature: input.requester_signature,
            certified: true,
            applicant_notes: input.applicant_notes || null,
            paid_invoices: paidFiles.map((f) => f.id),
            proof_of_payment: proofFiles.map((f) => f.id),
            project_photos: photoFiles.map((f) => f.id),
            photos_not_applicable: input.photos_not_applicable,
            portal_submission_id: input.portal_submission_id,
            supporting_documents: [
              ...paidFiles,
              ...proofFiles,
              ...photoFiles,
            ]
              .map((f) => fileUrl(f))
              .join("\n"),
          },
        });

        const subject = reimbursementSubjectLine(
          application.legal_entity_name,
          application.application_id
        );

        await recordActivity(
          `Reimbursement request #${payout.id} for ${money(requestedAmount)} submitted via applicant portal by ${input.requester_name} (${input.requester_email}) for ${application.legal_entity_name}`,
          [
            { entity: "grant-application", id: application.id },
            { entity: "grant-payouts", id: payout.id },
          ]
        );

        const files = {
          paid_invoices: paidFiles,
          proof_of_payment: proofFiles,
          project_photos: photoFiles,
        };
        const htmlOpts = {
          application,
          input,
          invoiceTotal,
          requestedAmount,
          balanceBefore,
          files,
          payoutId: payout.id,
        };

        // Attach the documents to the manager copy when they fit; the body
        // always carries links so nothing is lost if attachments are skipped.
        const allFiles = [...paidFiles, ...proofFiles, ...photoFiles];
        const totalBytes = allFiles.reduce(
          (sum, f) => sum + Math.round((f.size ?? 0) * 1024),
          0
        );
        const attachment =
          totalBytes > 0 && totalBytes <= MAX_ATTACHMENT_BYTES
            ? allFiles.map((f) => ({ name: f.name, url: fileUrl(f) }))
            : [];

        const emailErrors: string[] = [];
        const managerTemplate = await findTemplate(
          "Reimbursement Request Admin Notification"
        );
        const applicantTemplate = await findTemplate(
          "Reimbursement Request Receipt"
        );
        const templateVars = {
          subject_line: subject,
          legal_entity_name: application.legal_entity_name ?? "",
          system_name: application.legal_entity_name ?? "",
          application_id: application.application_id ?? "",
          requester_name: input.requester_name,
          requester_email: input.requester_email,
          invoice_total: money(invoiceTotal),
          requested_amount: money(requestedAmount),
          remaining_balance: money(
            roundMoney(balanceBefore.remaining - requestedAmount)
          ),
          request_id: String(payout.id),
        };

        try {
          const managerHtml = buildRequestHtml({ ...htmlOpts, forManager: true });
          await strapi.plugins["email"].services.email.send({
            to: RIG_MANAGER_EMAIL,
            from: managerTemplate
              ? `${managerTemplate.from_name} <${managerTemplate.from_email}>`
              : DEFAULT_FROM,
            replyTo: input.requester_email,
            subject,
            html: managerTemplate
              ? interpolate(managerTemplate.body, {
                  ...templateVars,
                  request_details: managerHtml,
                })
              : managerHtml,
            attachment,
          });
        } catch (err) {
          emailErrors.push(`manager: ${err.message}`);
        }

        try {
          const applicantHtml = buildRequestHtml({ ...htmlOpts, forManager: false });
          await strapi.plugins["email"].services.email.send({
            to: input.requester_email,
            from: applicantTemplate
              ? `${applicantTemplate.from_name} <${applicantTemplate.from_email}>`
              : DEFAULT_FROM,
            replyTo: RIG_MANAGER_EMAIL,
            subject,
            html: applicantTemplate
              ? interpolate(applicantTemplate.body, {
                  ...templateVars,
                  request_details: applicantHtml,
                })
              : applicantHtml,
          });
        } catch (err) {
          emailErrors.push(`applicant: ${err.message}`);
        }

        if (emailErrors.length) {
          strapi.log.warn(
            `grant-reimbursement submit #${payout.id}: email issues: ${emailErrors.join("; ")}`
          );
        }

        ctx.body = {
          code: "ok",
          payout: {
            id: payout.id,
            documentId: payout.documentId,
            amount: requestedAmount,
            invoice_total: invoiceTotal,
            transaction_date: today,
          },
          balance: {
            ...balanceBefore,
            remaining_after: roundMoney(balanceBefore.remaining - requestedAmount),
          },
          capped: requestedAmount < invoiceTotal,
          subject,
          emails_sent: emailErrors.length === 0,
        };
      } catch (err) {
        strapi.log.error(`grant-reimbursement submit: ${err.message}`);
        console.error(require("util").inspect(err, { depth: 4 }));
        ctx.status = 500;
        ctx.body = { code: "error", error: err.message };
      }
    },
  };
};
