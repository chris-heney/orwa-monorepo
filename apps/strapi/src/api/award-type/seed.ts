/**
 * Idempotent award-type catalog. Re-running creates only missing names;
 * existing rows (including Settings edits) are left untouched.
 *
 * Nominatable = types the public awards form currently offers.
 * Ceremony / historical winner titles are seeded with nominatable false.
 */

export type AwardTypeSeed = {
  name: string;
  description: string;
  nominatable: boolean;
  order: number;
};

export const AWARD_TYPE_SEEDS: AwardTypeSeed[] = [
  {
    name: "System of the Year",
    description:
      "Any member system that has displayed outstanding achievement in all areas of operating a water/wastewater system.",
    nominatable: true,
    order: 10,
  },
  {
    name: "Excellence in Operations",
    description:
      "Recognizes an operator whose work in the field keeps water flowing and standards met.",
    nominatable: true,
    order: 20,
  },
  {
    name: "Excellence in Management",
    description:
      "Recognizes a manager whose leadership keeps a member system running well day after day.",
    nominatable: true,
    order: 30,
  },
  {
    name: "Excellence in Office Operations",
    description:
      "Recognizes the office staff who keep billing, records, and customer service on track.",
    nominatable: true,
    order: 40,
  },
  {
    name: "Man of the Year",
    description:
      "Ceremony honor for an individual who has given outstanding service to rural water.",
    nominatable: false,
    order: 50,
  },
  {
    name: "Friends of Rural Water (Associate)",
    description:
      "Recognizes an associate member partner who supports rural water systems.",
    nominatable: false,
    order: 60,
  },
  {
    name: "Friends of Rural Water (Agency)",
    description:
      "Recognizes an agency partner who supports rural water systems.",
    nominatable: false,
    order: 70,
  },
  {
    name: "Friends of Rural Water (Strategic Partner)",
    description:
      "Recognizes a strategic partner who supports rural water systems.",
    nominatable: false,
    order: 80,
  },
  {
    name: "Friend of ORWA",
    description:
      "Legacy ceremony title (2022) for a friend of the association.",
    nominatable: false,
    order: 90,
  },
  {
    name: "Legislative Appreciation",
    description:
      "Ceremony honor for a legislator who has supported rural water.",
    nominatable: false,
    order: 100,
  },
  {
    name: "Water/Wastewater System of the Year",
    description:
      "Legacy nomination label; treated as System of the Year on write.",
    nominatable: false,
    order: 110,
  },
  {
    name: "5 Years of Service",
    description: "Staff service recognition at the annual awards ceremony.",
    nominatable: false,
    order: 120,
  },
  {
    name: "10 Years of Service",
    description: "Staff service recognition at the annual awards ceremony.",
    nominatable: false,
    order: 130,
  },
  {
    name: "12 Years of Service",
    description: "Staff service recognition at the annual awards ceremony.",
    nominatable: false,
    order: 140,
  },
  {
    name: "15 Years of Service",
    description: "Staff service recognition at the annual awards ceremony.",
    nominatable: false,
    order: 150,
  },
  {
    name: "19 Years of Service",
    description: "Staff service recognition at the annual awards ceremony.",
    nominatable: false,
    order: 160,
  },
  {
    name: "21 Years of Service",
    description: "Staff service recognition at the annual awards ceremony.",
    nominatable: false,
    order: 170,
  },
  {
    name: "25 Years of Service",
    description: "Staff service recognition at the annual awards ceremony.",
    nominatable: false,
    order: 180,
  },
  {
    name: "28 Years of Service",
    description: "Staff service recognition at the annual awards ceremony.",
    nominatable: false,
    order: 190,
  },
];

const UID = "api::award-type.award-type";

export const seedAwardTypes = async (strapi: {
  documents: (uid: string) => {
    findMany: (params: {
      filters: { name: string };
      limit: number;
    }) => Promise<unknown[]>;
    create: (params: { data: AwardTypeSeed }) => Promise<unknown>;
  };
  log: { info: (message: string) => void; warn: (message: string) => void };
}) => {
  let created = 0;
  for (const seed of AWARD_TYPE_SEEDS) {
    const existing = await strapi.documents(UID).findMany({
      filters: { name: seed.name },
      limit: 1,
    });
    if (existing?.length) {
      continue;
    }
    await strapi.documents(UID).create({ data: seed });
    created += 1;
  }
  if (created) {
    strapi.log.info(`Seeded ${created} award-type row(s)`);
  }
};
