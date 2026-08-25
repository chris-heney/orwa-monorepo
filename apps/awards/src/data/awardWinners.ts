/**
 * Seed data for the `award-winner` collection, transcribed from the public
 * awards page at https://orwa.org/awards/ (2026, 2024, 2023 and 2022).
 *
 * The landing page reads winners from Strapi at runtime — this file exists so
 * `scripts/seed-award-winners.ts` can populate an empty database. Editing a
 * winner is done in member-manager, not here.
 */

export type AwardWinner = {
  /** Award title as presented at the ceremony. */
  title: string;
  /** Recipient and, where given, their system or organization. */
  recipient?: string;
  thumbnail: string;
  full: string;
};

export type AwardYear = {
  year: number;
  /** Anchor id used by the year navigation. */
  id: string;
  winners: AwardWinner[];
};

const UPLOADS = "https://orwa.org/wp-content/uploads";

const winner = (
  title: string,
  recipient: string,
  file: string,
  thumb: string
): AwardWinner => ({
  title,
  recipient: recipient || undefined,
  full: `${UPLOADS}/${file}`,
  thumbnail: `${UPLOADS}/${thumb}`,
});

export const AWARD_YEARS: AwardYear[] = [
  {
    year: 2026,
    id: "winners-2026",
    winners: [
      winner(
        "Man of the Year",
        "Jacob Bodie Bachelor — Centennial Law Group",
        "Man-of-the-Year-Jacob-Bodie-Bachelor-Centennial-Law-Group.jpg",
        "Man-of-the-Year-Jacob-Bodie-Bachelor-Centennial-Law-Group-768x512.jpg"
      ),
      winner(
        "Excellence in Management",
        "Johnny Ketcherside — Woodward Co RWD #2",
        "Excellence-in-Management-Johnny-Ketcherside-Woodward-Co-RWD-2.png",
        "Excellence-in-Management-Johnny-Ketcherside-Woodward-Co-RWD-2-768x1152.png"
      ),
      winner(
        "Excellence in Operations",
        "Roger McCracken — Lincoln Co RW&SD #4",
        "Excellence-in-Operations-Roger-McCracken-Lincoln-Co-RWSD-4.jpg",
        "Excellence-in-Operations-Roger-McCracken-Lincoln-Co-RWSD-4-768x504.jpg"
      ),
      winner(
        "Friends of Rural Water (Associate)",
        "Jodie Giocondi & Ken Guthery — Intrust Bank",
        "Freinds-of-Rural-Water-Associate-Jodie-Giocondi-Ken-Guthery-Intrust-Bank.jpg",
        "Freinds-of-Rural-Water-Associate-Jodie-Giocondi-Ken-Guthery-Intrust-Bank-768x512.jpg"
      ),
      winner(
        "Friends of Rural Water (Agency)",
        "Rob Singletary — ODEQ",
        "Friends-of-Rural-Water-Agency-Rob-Singletary-ODEQ.jpg",
        "Friends-of-Rural-Water-Agency-Rob-Singletary-ODEQ-768x512.jpg"
      ),
      winner(
        "Friends of Rural Water (Strategic Partner)",
        "Owen Mills — ODEQ",
        "Friends-of-Rural-Water-Strategic-Partner-Owen-Mills-ODEQ.jpg",
        "Friends-of-Rural-Water-Strategic-Partner-Owen-Mills-ODEQ-768x512.jpg"
      ),
      winner(
        "Legislative Appreciation",
        "Caleb Cochran accepting on behalf of Markwayne Mullin — U.S. Senate",
        "Legislative-Appreciation-Markwayne-Mullin-U.S.-Senate-Caleb-Cochran-accepted-award-on-his-behalf.jpg",
        "Legislative-Appreciation-Markwayne-Mullin-U.S.-Senate-Caleb-Cochran-accepted-award-on-his-behalf-768x512.jpg"
      ),
      winner(
        "5 Years of Service",
        "Richey Kirkpatrick — ORWA",
        "5-Years-of-Service-Richey-Kirkpatrick-ORWA.jpg",
        "5-Years-of-Service-Richey-Kirkpatrick-ORWA-768x518.jpg"
      ),
      winner(
        "10 Years of Service",
        "Jimmy E. Seago — ORWA",
        "10-Years-of-Service-Jimmy-E.-Seago-ORWA.jpg",
        "10-Years-of-Service-Jimmy-E.-Seago-ORWA-768x512.jpg"
      ),
      winner(
        "19 Years of Service",
        "Darrell Wootton — ORWA",
        "19-Years-of-Service-Darrell-Wootton-ORWA.jpg",
        "19-Years-of-Service-Darrell-Wootton-ORWA-768x512.jpg"
      ),
      winner(
        "25 Years of Service",
        "Charles Matheson — ORWA",
        "25-Years-of-Service-Charles-Matheson-ORWA.jpg",
        "25-Years-of-Service-Charles-Matheson-ORWA-768x512.jpg"
      ),
    ],
  },
  {
    year: 2024,
    id: "winners-2024",
    winners: [
      winner(
        "System of the Year",
        "Hughes Co RWD #6",
        "annual-conference-56.jpg",
        "annual-conference-56-768x512.jpg"
      ),
      winner(
        "Man of the Year",
        "Charlie Swinton — BancFirst",
        "annual-conference-57.jpg",
        "annual-conference-57-768x512.jpg"
      ),
      winner(
        "Excellence in Management",
        "Mike Callanan — Lincoln Co RW&SD #4",
        "annual-conference-52.jpg",
        "annual-conference-52-768x512.jpg"
      ),
      winner(
        "Excellence in Operations",
        "Joshua Mosley",
        "annual-conference-53.jpg",
        "annual-conference-53-768x512.jpg"
      ),
      winner(
        "Excellence in Office Operations",
        "Charleen Ream — Woods Co RWD #3",
        "annual-conference-54.jpg",
        "annual-conference-54-768x512.jpg"
      ),
      winner(
        "Friends of Rural Water (Strategic Partner)",
        "Mike Fina — Oklahoma Municipal League",
        "annual-conference-55.jpg",
        "annual-conference-55-768x512.jpg"
      ),
      winner(
        "Friends of Rural Water (Associate)",
        "Samantha McPheter — eLynx Technologies",
        "annual-conference-51.jpg",
        "annual-conference-51-768x512.jpg"
      ),
      winner(
        "Friends of Rural Water (Agency)",
        "Shellie Chard — Oklahoma Dept. of Environmental Quality",
        "annual-conference-50.jpg",
        "annual-conference-50-768x512.jpg"
      ),
      winner(
        "Legislative Appreciation",
        "Speaker Charles McCall — OK House of Representatives",
        "annual-conference-48.png",
        "annual-conference-48-768x512.png"
      ),
      winner(
        "21 Years of Service",
        "Bill Sims",
        "annual-conference-58.jpg",
        "annual-conference-58-768x512.jpg"
      ),
      winner(
        "5 Years of Service",
        "Gary Calvert",
        "annual-conference-59.jpg",
        "annual-conference-59-768x512.jpg"
      ),
      winner(
        "5 Years of Service",
        "James Conover",
        "annual-conference-60.jpg",
        "annual-conference-60-768x512.jpg"
      ),
      winner(
        "5 Years of Service",
        "Keath Garramone",
        "annual-conference-61.jpg",
        "annual-conference-61-768x512.jpg"
      ),
      winner(
        "5 Years of Service",
        "Charlene Westmoland",
        "annual-conference-62.jpg",
        "annual-conference-62-768x512.jpg"
      ),
    ],
  },
  {
    year: 2023,
    id: "winners-2023",
    winners: [
      winner(
        "System of the Year",
        "Okmulgee Co RWD #1",
        "JR_08787.jpg",
        "JR_08787-300x214.jpg"
      ),
      winner(
        "Man of the Year",
        "Jimmy Seago, CEO — Oklahoma Rural Water Association",
        "JR_08790.jpg",
        "JR_08790-300x200.jpg"
      ),
      winner(
        "Excellence in Management",
        "David Rodriguez — Cotton Co RWD #2",
        "JR_08775.jpg",
        "JR_08775-300x200.jpg"
      ),
      winner(
        "Excellence in Operations",
        "Steve Randolph — Town of Ringwood",
        "JR_08778.jpg",
        "JR_08778-300x200.jpg"
      ),
      winner(
        "Excellence in Office Operations",
        "Gayla Keeter — Jefferson Co RWD #1",
        "JR_08782.jpg",
        "JR_08782-300x200.jpg"
      ),
      winner(
        "Friends of Rural Water (Strategic Partner)",
        "Cherokee Nation",
        "JR_08768.jpg",
        "JR_08768-300x200.jpg"
      ),
      winner(
        "Friends of Rural Water (Agency)",
        "Scott Thompson — DEQ",
        "JR_08773.jpg",
        "JR_08773-300x200.jpg"
      ),
      winner(
        "Friends of Rural Water (Associate)",
        "Rural Water Impact / Municipal Impact",
        "JR_08784.jpg",
        "JR_08784-300x214.jpg"
      ),
      winner(
        "Legislative Appreciation",
        "Senator Chuck Hall — Oklahoma State Senate",
        "JR_08764.jpg",
        "JR_08764-300x200.jpg"
      ),
      winner(
        "28 Years of Service",
        "Boyd Hughes — Oklahoma Rural Water Association",
        "JR_08793.jpg",
        "JR_08793-300x200.jpg"
      ),
      winner(
        "15 Years of Service",
        "Risa Reagan — Oklahoma Rural Water Association",
        "risa.jpg",
        "risa-300x200.jpg"
      ),
      winner(
        "12 Years of Service",
        "Wayne Johnson — Oklahoma Rural Water Association",
        "JR_08797.jpg",
        "JR_08797-300x200.jpg"
      ),
      winner(
        "5 Years of Service",
        "Randy Clark — Oklahoma Rural Water Association",
        "JR_08799.jpg",
        "JR_08799-300x200.jpg"
      ),
    ],
  },
  {
    year: 2022,
    id: "winners-2022",
    winners: [
      winner(
        "System of the Year",
        "Dewar Public Works Authority",
        "JD209147-1024x684.jpg",
        "JD209147-768x513.jpg"
      ),
      winner(
        "Excellence in Management",
        "Daniel Napier",
        "JD209189-1024x710.jpg",
        "JD209189-768x532.jpg"
      ),
      winner(
        "Excellence in Operations",
        "Jennie Woods",
        "JD209216-1024x731.jpg",
        "JD209216-768x549.jpg"
      ),
      winner(
        "Excellence in Office Operations",
        "Mary Ann Starkey",
        "JD209199-1024x684.jpg",
        "JD209199-768x513.jpg"
      ),
      winner(
        "Friend of ORWA",
        "Steve Orr",
        "JD209224-1024x731.jpg",
        "JD209224-768x549.jpg"
      ),
      winner(
        "Legislative Appreciation",
        "Rep. Dick Lowe",
        "JD209181-1024x731.jpg",
        "JD209181-768x549.jpg"
      ),
    ],
  },
];

export type AwardCategory = {
  name: string;
  /** Who the category is open to. */
  audience: "Individual" | "System";
  description: string;
};

export const AWARD_CATEGORIES: AwardCategory[] = [
  {
    name: "System of the Year",
    audience: "System",
    description:
      "Any member system that has displayed outstanding achievement in all areas of operating a water/wastewater system.",
  },
  {
    name: "Excellence in Management",
    audience: "Individual",
    description:
      "Recognizes a manager whose leadership keeps a member system running well day after day.",
  },
  {
    name: "Excellence in Operations",
    audience: "Individual",
    description:
      "Recognizes an operator whose work in the field keeps water flowing and standards met.",
  },
  {
    name: "Excellence in Office Operations",
    audience: "Individual",
    description:
      "Recognizes the office staff who keep billing, records, and customer service on track.",
  },
];

export const READINESS_CHECKLIST: string[] = [
  "A list of board members & employees",
  "Nominee biography",
  "A high quality photo of the system or person being nominated",
];

/** Deadline as published on orwa.org/awards. */
export const NOMINATION_DEADLINE = "January 9, 2026";

export const CONTACT = {
  phone: "405-672-8925",
  phoneHref: "tel:4056728925",
  email: "office@orwa.org",
};

/** Strapi `award-winner` row as returned by useGetAwardWinners. */
export type AwardWinnerRecord = {
  documentId?: string;
  award_year?: number;
  title?: string;
  recipient?: string | null;
  photo_url?: string | null;
  thumbnail_url?: string | null;
  sort_order?: number | null;
  photo?: {
    url?: string;
    formats?: Record<string, { url?: string }>;
  } | null;
};

/** Strapi returns upload paths relative to the API host. */
const absoluteMediaUrl = (url: string, apiEndpoint: string): string => {
  if (/^https?:\/\//i.test(url)) return url;
  const origin = apiEndpoint.replace(/\/api\/?$/, "").replace(/\/$/, "");
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
};

/**
 * Prefer the image uploaded into Strapi; fall back to the orwa.org URL for
 * winners that have not been migrated into the media library yet.
 */
export const groupWinnersByYear = (
  records: AwardWinnerRecord[],
  apiEndpoint: string
): AwardYear[] => {
  const years = new Map<number, AwardWinner[]>();

  const sorted = [...records].sort((a, b) => {
    const byYear = (b.award_year ?? 0) - (a.award_year ?? 0);
    if (byYear !== 0) return byYear;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });

  for (const record of sorted) {
    if (!record.award_year || !record.title) continue;

    const uploaded = record.photo?.url
      ? absoluteMediaUrl(record.photo.url, apiEndpoint)
      : null;
    const uploadedThumb = record.photo?.formats?.medium?.url
      ? absoluteMediaUrl(record.photo.formats.medium.url, apiEndpoint)
      : record.photo?.formats?.small?.url
        ? absoluteMediaUrl(record.photo.formats.small.url, apiEndpoint)
        : null;

    const full = uploaded || record.photo_url || "";
    const thumbnail = uploadedThumb || record.thumbnail_url || full;
    if (!full) continue;

    const bucket = years.get(record.award_year) ?? [];
    bucket.push({
      title: record.title,
      recipient: record.recipient || undefined,
      full,
      thumbnail,
    });
    years.set(record.award_year, bucket);
  }

  return [...years.entries()].map(([year, winners]) => ({
    year,
    id: `winners-${year}`,
    winners,
  }));
};
