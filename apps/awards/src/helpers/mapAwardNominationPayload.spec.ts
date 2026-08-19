import { describe, expect, it } from "vitest";
import { mapAwardNominationPayload } from "./mapAwardNominationPayload";

describe("mapAwardNominationPayload", () => {
  it("maps leftover watersystem_id and keeps dates as YYYY-MM-DD strings", () => {
    const mapped = mapAwardNominationPayload({
      nominee_name: "Jane Doe",
      email: "jane@example.com",
      daytime_phone: "4055551212",
      address: "1 Main",
      city: "Ada",
      state: "OK",
      zip: "74820",
      county: "Pontotoc",
      system_name: "Ada RWD",
      watersystem_id: "abcdocumentid1234",
      operation_start_date: "2010-06-15",
      employment_date: "",
      current_members: "",
      nomination_description: "Great system",
      award_type: "Excellence in Operations",
      award_year: "2026",
      nominator_first_name: "Pat",
      nominator_last_name: "Lee",
      nominator_address: "9 Oak",
      nominator_city: "Ada",
      nominator_state: "OK",
      nominator_zip: "74820",
      nominator_email: "pat@example.com",
      nominator_phone: "4055559999",
    } as any);

    expect(mapped.watersystem).toBe("abcdocumentid1234");
    expect(mapped.nominator_first_name).toBe("Pat");
    expect(mapped.nominator_last_name).toBe("Lee");
    expect(mapped.nominator_country).toBe("United States");
    expect(mapped.nominator_email).toBe("pat@example.com");
    expect(mapped.operation_start_date).toBe("2010-06-15");
    expect(mapped.employment_date).toBeUndefined();
    expect(mapped.current_members).toBeUndefined();
    expect(mapped.award_year).toBe(2026);
    expect(mapped.watersystem_id).toBeUndefined();
  });

  it("does not invent a Date instance for empty dates", () => {
    const mapped = mapAwardNominationPayload({
      nominee_name: "Pat",
      email: "pat@example.com",
      daytime_phone: "4055550000",
      address: "2 Oak",
      city: "Norman",
      state: "OK",
      zip: "73069",
      county: "Cleveland",
      system_name: "Norman",
      nomination_description: "Notes",
      award_type: "Excellence in Management",
    } as any);

    expect(mapped.operation_start_date).toBeUndefined();
    expect(typeof mapped.award_year).toBe("number");
  });

  it("normalizes legacy System of the Year award type on write", () => {
    const mapped = mapAwardNominationPayload({
      nominee_name: "Pat",
      email: "pat@example.com",
      daytime_phone: "4055550000",
      address: "2 Oak",
      city: "Norman",
      state: "OK",
      zip: "73069",
      county: "Cleveland",
      system_name: "Norman",
      nomination_description: "Notes",
      award_type: "Water/Wastewater System of the Year",
      biography_method: "Copy/Paste or Type Biography",
      biography_text: "Bio text",
      photographs: [],
    } as any);

    expect(mapped.award_type).toBe("System of the Year");
    expect(mapped.biography_method).toBe("Copy/Paste or Type Biography");
    expect(mapped.biography_text).toBe("Bio text");
  });
});
