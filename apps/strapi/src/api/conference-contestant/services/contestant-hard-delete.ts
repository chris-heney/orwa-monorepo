import { countsAgainstGolfCapacity } from "../../conference-webhook/helpers/contestant-capacity";
import { withContestantHardDelete } from "./contestant-lifecycle-context";

const CONTESTANT_UID = "api::conference-contestant.conference-contestant";

const isActive = (status: unknown): boolean =>
  status == null || status === "" || status === "active";

export const hardDeleteContestantForRegistrationRemoval = async (
  strapi: any,
  documentId: string
) => {
  const contestant = await strapi.documents(CONTESTANT_UID).findOne({
    documentId,
    populate: { conference: true, conference_ticket: true },
  });
  if (!contestant) return null;

  const shouldRestoreGolfSlot =
    isActive(contestant.status) &&
    countsAgainstGolfCapacity({
      ticket_type: contestant.conference_ticket ?? null,
    } as never);

  if (shouldRestoreGolfSlot) {
    const conferenceDocumentId = contestant.conference?.documentId;
    if (!conferenceDocumentId) {
      throw new Error("Conference is required before deleting an active golfer.");
    }

    await strapi.db.transaction(async ({ trx }: { trx: unknown }) => {
      const row = await strapi.db
        .connection("conferences")
        .where({ document_id: conferenceDocumentId })
        .forUpdate()
        .transacting(trx)
        .first();
      if (!row) throw new Error("Conference was not found before contestant delete.");

      await strapi.db
        .connection("conferences")
        .where({ document_id: conferenceDocumentId })
        .transacting(trx)
        .increment("available_contestants", 1);
    });
  }

  return withContestantHardDelete(() =>
    strapi.documents(CONTESTANT_UID).delete({ documentId })
  );
};
