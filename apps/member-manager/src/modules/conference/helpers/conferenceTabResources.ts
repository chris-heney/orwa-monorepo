/** List resource for each Conference Manager tab. Summary / Tools / Edit have none. */
export const CONFERENCE_TAB_RESOURCES: Record<string, string> = {
  registrations: "conference-registrations",
  attendees: "conference-attendees",
  booths: "conference-booths",
  contestants: "conference-contestants",
  teams: "conference-teams",
  "taste test": "taste-test-contestants",
  sponsors: "conference-sponsors",
  schedule: "conference-schedules",
  tickets: "conference-tickets",
  extras: "conference-extras",
  addons: "registration-addons",
  sponsorships: "conference-sponsorships",
  feedback: "conference-feedbacks",
};

export const resourceForConferenceTab = (tab: string): string =>
  CONFERENCE_TAB_RESOURCES[tab] || "";
