import jsonExport from "jsonexport/dist";
import { downloadCSV, DataProvider, RaRecord } from "react-admin";
import fetchRelatedRecord from "../../../helpers/fetchRelatedRecord";
import { isDocumentId } from "../../../helpers/strapiIds";

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
  const ticketVendorCache = new Map<string, boolean>();
  const regBundleCache = new Map<string, RegistrationBundle>();

  const isVendorTicket = async (ticket: unknown): Promise<boolean> => {
    const resolved = await fetchRelatedRecord(
      dataProvider,
      "conference-tickets",
      ticket
    );
    const key = String(resolved.id ?? ticket ?? "");
    if (key && ticketVendorCache.has(key)) return ticketVendorCache.get(key)!;
    const v = resolved.name === "Vendor";
    if (key) ticketVendorCache.set(key, v);
    return v;
  };

  const registrantContactId = (
    registration: RaRecord | undefined
  ): string | number | undefined => {
    const r = registration?.registrant;
    if (typeof r === "number") return r;
    if (typeof r === "string" && (isDocumentId(r) || /^\d+$/.test(r))) return r;
    if (r && typeof r === "object") {
      const id = (r as RaRecord).id ?? (r as { documentId?: string }).documentId;
      if (id != null && id !== "") return id as string | number;
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
    regId: string | number
  ): Promise<RegistrationBundle> => {
    const cacheKey = String(regId);
    if (regBundleCache.has(cacheKey)) return regBundleCache.get(cacheKey)!;

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
    regBundleCache.set(cacheKey, bundle);
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
    if (ticket != null && (await isVendorTicket(ticket))) {
      vendorRows.push(r);
    }
  }

  const rows = await Promise.all(
    vendorRows.map(async (record) => {
      const rawReg = record.registration;
      const rid =
        typeof rawReg === "number" ||
        isDocumentId(rawReg) ||
        (typeof rawReg === "string" && /^\d+$/.test(rawReg))
          ? rawReg
          : rawReg && typeof rawReg === "object"
            ? ((rawReg as RaRecord).id ??
              (rawReg as { documentId?: string }).documentId)
            : undefined;

      const bundle =
        rid != null && rid !== ""
          ? await resolveRegistrationBundle(rid as string | number)
          : null;
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
