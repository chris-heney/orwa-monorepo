import jsonExport from "jsonexport/dist";
import { downloadCSV, DataProvider, RaRecord } from "react-admin";

type RegistrationBundle = {
  registration: RaRecord;
  registrantFirst: string;
  registrantLast: string;
  registrantEmail: string;
};

/**
 * CSV roster for vendor booth staff (attendee rows) plus the registration's
 * primary contact email — for mailing lists.
 */
const exportVendorAttendeeRoster = async (
  records: RaRecord[],
  dataProvider: DataProvider,
  title: string
): Promise<number> => {
  const ticketVendorCache = new Map<number, boolean>();
  const regBundleCache = new Map<number, RegistrationBundle>();

  const isVendorTicketId = async (id: number): Promise<boolean> => {
    if (ticketVendorCache.has(id)) return ticketVendorCache.get(id)!;
    const { data: ticket } = await dataProvider.getOne("conference-tickets", {
      id,
    });
    const v = ticket?.name === "Vendor";
    ticketVendorCache.set(id, v);
    return v;
  };

  const registrantContactId = (registration: RaRecord | undefined): number | undefined => {
    const r = registration?.registrant;
    if (typeof r === "number") return r;
    if (typeof r === "string" && /^\d+$/.test(r)) return parseInt(r, 10);
    if (r && typeof r === "object") {
      const id = (r as RaRecord).id;
      if (typeof id === "number") return id;
      if (typeof id === "string" && /^\d+$/.test(id)) return parseInt(id, 10);
    }
    return undefined;
  };

  /** Prefer nested contact fields from populated registration (avoids contacts getOne permission gaps). */
  const readRegistrantFields = async (
    registration: RaRecord | undefined
  ): Promise<{ first: string; last: string; email: string }> => {
    const r = registration?.registrant;
    if (r && typeof r === "object") {
      const o = r as RaRecord;
      if (o.first != null || o.last != null || o.email != null) {
        return {
          first: String(o.first ?? ""),
          last: String(o.last ?? ""),
          email: String(o.email ?? ""),
        };
      }
    }
    const contactId = registrantContactId(registration);
    if (contactId === undefined) {
      return { first: "", last: "", email: "" };
    }
    const { data: c } = await dataProvider.getOne("contacts", {
      id: contactId,
    });
    return {
      first: String((c?.first as string) ?? ""),
      last: String((c?.last as string) ?? ""),
      email: String((c?.email as string) ?? ""),
    };
  };

  const resolveRegistrationBundle = async (
    regId: number
  ): Promise<RegistrationBundle> => {
    if (regBundleCache.has(regId)) return regBundleCache.get(regId)!;

    const { data: registration } = await dataProvider.getOne(
      "conference-registrations",
      {
        id: regId,
        meta: {
          raw: true,
          populate: [],
          customFilter: "populate[registrant]=true",
        },
      }
    );

    const { first: registrantFirst, last: registrantLast, email: registrantEmail } =
      await readRegistrantFields(registration);

    const bundle: RegistrationBundle = {
      registration: registration ?? {},
      registrantFirst,
      registrantLast,
      registrantEmail,
    };
    regBundleCache.set(regId, bundle);
    return bundle;
  };

  const vendorRows: RaRecord[] = [];

  for (const r of records) {
    if (r.type === "Vendor") {
      vendorRows.push(r);
      continue;
    }
    const ticket = r.conference_ticket;
    if (ticket && typeof ticket === "object" && (ticket as RaRecord).name === "Vendor") {
      vendorRows.push(r);
      continue;
    }
    if (typeof ticket === "number" && (await isVendorTicketId(ticket))) {
      vendorRows.push(r);
    }
  }

  const rows = await Promise.all(
    vendorRows.map(async (record) => {
      const rawReg = record.registration;
      const rid =
        typeof rawReg === "number"
          ? rawReg
          : rawReg && typeof rawReg === "object"
            ? (rawReg as RaRecord).id
            : undefined;

      const bundle =
        typeof rid === "number" ? await resolveRegistrationBundle(rid) : null;
      const registration = bundle?.registration ?? {};

      return {
        Organization:
          (record.organization as string) ||
          (registration as unknown as { organization: string })?.organization ||
          "",
        "Vendor registrant first": bundle?.registrantFirst ?? "",
        "Vendor registrant last": bundle?.registrantLast ?? "",
        "Vendor registrant email": bundle?.registrantEmail ?? "",
        "Rep first": (record.first as string) ?? "",
        "Rep last": (record.last as string) ?? "",
        "Rep email": (record.email as string) ?? "",
        "Rep phone": (record.phone as string) ?? "",
        "Rep title": (record.title as string) ?? "",
        "Registration date": (registration as unknown as { registration_date: string })?.registration_date ?? "",
        "Attendee ID": String(record.id ?? ""),
      };
    })
  );

  await new Promise<void>((resolve, reject) => {
    jsonExport(rows, (err: Error, csv: string) => {
      if (err) reject(err);
      else {
        downloadCSV(csv, title);
        resolve();
      }
    });
  });

  return rows.length;
};

export default exportVendorAttendeeRoster;
