import { useEffect, useState } from "react";
import IAttendee from "../types/IAttendee";
import IStat from "../types/IStat";
import IBooth from "../types/IBooth";
import { IConference } from "../types/IConferenceKioskProvider";
import { EmailPayload } from "../types/IEmailPayload";
import { ISponsor } from "../types/ISponsor";
import { FeedbackPayload } from "../types/IFeedbackPayload";
import { IContestant } from "../types/IContestant";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const API_KEY = import.meta.env.VITE_API_KEY;

const currentYear = new Date().getFullYear();
const conferenceId =
  new URLSearchParams(window.location.search).get("conference_id") ?? "3";

const _get = async (query: string, method = "GET") => {
  return await (
    await fetch(`${API_ENDPOINT}${query}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    })
  ).json();
};

const getConference = async () => {
  return await _get(`/conferences?filters[id][$eq]=${conferenceId}&populate=*`);
};

const getAllAttendees = async () => {
  return await _get(
    `/conference-attendees?filters[year]=${currentYear}&filters[conference]=${conferenceId}&sort=organization:ASC&populate=*&pagination[limit]=1000`
  );
};

const getAttendees = async () => {
  return await _get(
    `/conference-attendees?filters[year]=${currentYear}&filters[conference]=${conferenceId}&sort=organization:ASC&populate=*&pagination[limit]=1000`
  );
};

const getVendors = async () => {
  return await _get(
    `/conference-attendees?filters[type][$eqi]=Vendor&filters[year]=${currentYear}&filters[conference]=${conferenceId}&sort=organization:ASC&pagination[limit]=1000`
  );
};

const getContestants = async () => {
  return await _get(
    `/conference-contestants?filters[year]=${currentYear}&filters[conference]=${conferenceId}&sort=team.name:ASC&populate=*&pagination[limit]=1000`
  );
};

const getBooths = async () => {
  return await _get(
    `/conference-booths?filters[year][$eq]=${currentYear}&filters[conference]=${conferenceId}&populate=conference&sort=organization:ASC&pagination[limit]=1000`
  );
};

const getSchedule = async () => {
  return await _get(
    `/conference-schedules?filters[year]=${currentYear}&filters[conference]=${conferenceId}&populate=conference`
  );
};

const getSponsors = async () => {
  return await _get(
    `/conference-sponsors?filters[year]=${currentYear}&filters[conference]=${conferenceId}&populate=*&sort=registration.organization:ASC`
  );
};

const getWaterContestant = async () => {
  return await _get(
    `/taste-test-contestants?filters[year]=${currentYear}&filters[conference]=${conferenceId}&sort=organization:ASC&populate=*&pagination[limit]=1000`
  );
};

export const _sendEmail = async (data: EmailPayload) => {
  return fetch(`${API_ENDPOINT}/mailer/send-email`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  })
    .then((httpResponse) => httpResponse.json())
    .then((data) => data);
};

export const _sendFeedback = async (data: FeedbackPayload) => {
  return fetch(`${API_ENDPOINT}/conference-feedbacks`, {
    method: "POST",
    body: JSON.stringify({ data: { ...data } }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  })
    .then((httpResponse) => httpResponse.json())
    .then((data) => data);
};

const getStats = async () => {
  const { data: attendees } = await getAllAttendees();
  const { data: booths } = await getBooths();
  const conference = (await getConference())?.data?.[0];

  return [
    { id: 1, name: "Booths", stat: Array.isArray(booths) ? booths.length : 0 },
    {
      id: 2,
      name: "Attendees",
      stat: Array.isArray(attendees)
        ? attendees.filter((attendee: { conference_ticket?: { name?: string } | null }) => {
            return attendee.conference_ticket
              ? attendee.conference_ticket.name !== "Voter Only"
              : false;
          }).length
        : 0,
    },
    {
      id: 4,
      name: "Training Credit",
      stat: conference?.training_hours_available ?? 0,
    },
  ] as IStat[];
};

export function useGetVendors() {
  const [data, setData] = useState<IAttendee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVendors().then((v) => {
      setData(Array.isArray(v?.data) ? v.data : []);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

export function useGetAttendees() {
  const [data, setData] = useState<IAttendee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAttendees().then((v) => {
      setData(Array.isArray(v?.data) ? v.data : []);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

export function useGetBooths() {
  const [data, setData] = useState<IBooth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooths().then((v) => {
      setData(Array.isArray(v?.data) ? v.data : []);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

export function useGetStats() {
  const [data, setData] = useState<IStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then((v) => {
      setData(v);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

export function useGetSchedule() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSchedule().then((v) => {
      setData(Array.isArray(v?.data) ? v.data : []);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

export function useGetConference() {
  const [data, setData] = useState<IConference>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConference().then((v) => {
      setData(Array.isArray(v?.data) ? v.data[0] : undefined);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

export function useGetSponsors() {
  const [data, setData] = useState<ISponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSponsors().then((v) => {
      setData(Array.isArray(v?.data) ? v.data : []);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

export function useGetContestants() {
  const [data, setData] = useState<IContestant[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getContestants().then((v) => {
      setData(Array.isArray(v?.data) ? v.data : []);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}

export function useGetWaterContestants() {
  const [data, setData] = useState<IContestant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWaterContestant().then((v) => {
      setData(Array.isArray(v?.data) ? v.data : []);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}
