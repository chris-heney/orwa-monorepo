import type { DataProvider, Identifier } from "react-admin";

/**
 * `award_winner.award_nomination` is a one-way oneToOne (no `inversedBy` on
 * the nomination), so a nomination row cannot tell whether a gallery winner
 * points at it. Before a bulk delete, ask the winners side instead.
 */
export const fetchLinkedWinnerCount = async (
  ids: Identifier[],
  dataProvider: DataProvider
): Promise<number> => {
  if (ids.length === 0) return 0;
  const { total, data } = await dataProvider.getList("award-winners", {
    // documentId leaves under a relation key serialise to
    // `filters[award_nomination][documentId][$in][]=…`.
    filter: { award_nomination: { $in: ids } },
    pagination: { page: 1, perPage: Math.max(ids.length, 1) },
    sort: { field: "id", order: "ASC" },
    meta: { raw: true },
  });
  return typeof total === "number" ? total : data.length;
};

/** Confirmation lines for linked winners (empty when nothing is linked). */
export const linkedWinnerWarningLines = (
  linked: number,
  selected: number
): string[] => {
  if (linked <= 0) return [];
  const subject =
    selected === 1
      ? "This nomination is"
      : linked === selected
        ? `All ${selected} selected nominations are`
        : `${linked} of the ${selected} selected nominations ${linked === 1 ? "is" : "are"}`;
  return [
    `${subject} linked to an Award Winner. The winner entry stays in the gallery but loses its link back to the nomination.`,
  ];
};

/** `BulkDeleteOptions.warnings` for the Nominations tab. */
export const nominationBulkDeleteWarnings = async (
  ids: Identifier[],
  dataProvider: DataProvider
): Promise<string[]> =>
  linkedWinnerWarningLines(await fetchLinkedWinnerCount(ids, dataProvider), ids.length);
