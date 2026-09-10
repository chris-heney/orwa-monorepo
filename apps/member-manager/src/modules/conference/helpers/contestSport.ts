/**
 * Which tournament a contestant belongs to.
 *
 * Golf/fishing used to live on `contestant.type` ("Golfer"/"Fisher").
 * Registration now stores type "Contestant" and puts the sport on
 * `conference_ticket.name`, which varies per conference ("Golfer",
 * "Golfer - Contestant Only", "Fishing Tournament", "Bass Tournament").
 * Match on the "golf"/"fish" stem so every ticket variant lands in its
 * bucket; prefer the ticket name and fall back to `type` for legacy rows.
 *
 * Mirrors `resolveRosterKind` in conference-hub's tournament section.
 */
export type ContestSport = "golf" | "fish";

type SportRecord = {
  type?: unknown;
  conference_ticket?: unknown;
};

const relationName = (relation: unknown): string => {
  if (relation && typeof relation === "object") {
    const name = (relation as { name?: unknown }).name;
    return typeof name === "string" ? name : "";
  }
  return typeof relation === "string" ? relation : "";
};

export const resolveContestSport = (
  record: SportRecord | null | undefined
): ContestSport | null => {
  if (record == null) return null;

  const ticketName = relationName(record.conference_ticket);
  const legacyType = typeof record.type === "string" ? record.type : "";
  const raw = (ticketName || legacyType).trim().toLowerCase();

  // A bare "Contestant" ticket names no sport — leave it unclassified rather
  // than guessing a bucket for it.
  if (!raw || raw === "contestant") return null;
  if (raw.includes("golf")) return "golf";
  if (raw.includes("fish") || raw.includes("bass")) return "fish";
  return null;
};

type TeamRecord = { team?: unknown };

/**
 * Stable identity for a contestant's team relation. Names collide across
 * organizations, so dedupe on the record id and only fall back to the name
 * when the relation arrived unpopulated.
 */
const teamKey = (record: TeamRecord): string | null => {
  const team = record.team;
  if (team == null) return null;
  if (typeof team === "object") {
    const t = team as { id?: unknown; documentId?: unknown; name?: unknown };
    const id = t.id ?? t.documentId;
    if (id != null && id !== "") return `id:${String(id)}`;
    const name = typeof t.name === "string" ? t.name.trim() : "";
    return name ? `name:${name.toLowerCase()}` : null;
  }
  if (typeof team === "number") return `id:${team}`;
  if (typeof team === "string" && team.trim()) return `id:${team.trim()}`;
  return null;
};

export interface ContestSportTotals {
  /** Contestants on a fishing ticket (any variant). */
  fishers: number;
  /** Contestants on a golf ticket (any variant). */
  golfers: number;
  /** Distinct teams fielding at least one golfer. */
  golfTeams: number;
  /**
   * Every contestant, including rows whose ticket names no sport — so this is
   * not necessarily `fishers + golfers`.
   */
  total: number;
}

/**
 * Bucket contestants into the tournament totals the Contest Corner shows.
 * Callers pass the already-active set; cancelled rows never reach here.
 */
export const summarizeContestSports = (
  records: Array<SportRecord & TeamRecord> | null | undefined
): ContestSportTotals => {
  const golfTeamKeys = new Set<string>();
  let fishers = 0;
  let golfers = 0;
  let total = 0;

  for (const record of records ?? []) {
    if (record == null) continue;
    total += 1;

    const sport = resolveContestSport(record);
    if (sport === "fish") {
      fishers += 1;
    } else if (sport === "golf") {
      golfers += 1;
      const key = teamKey(record);
      if (key) golfTeamKeys.add(key);
    }
  }

  return { fishers, golfers, golfTeams: golfTeamKeys.size, total };
};
