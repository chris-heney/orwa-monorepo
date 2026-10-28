/**
 * grant-application-final lifecycles: keep `applicant_pdf` in sync.
 *
 * afterCreate: render the PDF before the grant-management plugin's receipt
 * email runs (content-type lifecycles are subscribed before plugin bootstrap
 * subscribers), so the attachment is the server-rendered file.
 *
 * afterUpdate: regenerate while the application is still being shaped
 * (New Application / Awaiting Committee) and the write touched a field the
 * PDF prints. Covers Member Manager, the applicant edit link, the Content
 * Manager and direct API writes alike. Never throws.
 */

import { shouldRegenerateFor } from "../../../grant-application/helpers/applicant-pdf-rules";

const GRANT_APPLICATION_UID = "api::grant-application-final.grant-application-final";

type LifecycleEvent = {
  result?: { id?: number; documentId?: string };
  params?: { data?: Record<string, unknown> };
};

const service = () => (strapi as any).service("api::grant-application.applicant-pdf");

const currentStatusName = async (id: number): Promise<string | null> => {
  const row = await (strapi as any).db.query(GRANT_APPLICATION_UID).findOne({
    where: { id },
    populate: { status: { select: ["name"] } },
  });
  return row?.status?.name ?? null;
};

const safeRegenerate = async (documentId: string, reason: string) => {
  try {
    await service().regenerate(documentId, { reason });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    (strapi as any).log.error(`applicant-pdf regenerate failed ${documentId} (${reason}): ${message}`);
  }
};

export default {
  async afterCreate(event: LifecycleEvent) {
    const documentId = event.result?.documentId;
    if (!documentId) return;
    await safeRegenerate(documentId, "create");
  },

  async afterUpdate(event: LifecycleEvent) {
    const id = event.result?.id;
    const documentId = event.result?.documentId;
    if (!id || !documentId) return;

    const keys = Object.keys(event.params?.data ?? {});
    let statusName: string | null = null;
    try {
      statusName = await currentStatusName(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      (strapi as any).log.error(`applicant-pdf status lookup failed ${documentId}: ${message}`);
      return;
    }

    if (!shouldRegenerateFor(statusName, keys)) return;
    await safeRegenerate(documentId, `update:${statusName}`);
  },
};
