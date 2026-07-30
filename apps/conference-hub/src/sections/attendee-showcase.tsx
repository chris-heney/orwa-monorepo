import { useGetAttendees } from "../helpers/API";
import LoadingIcon from "../components/LoadingIcon";
import Panel from "../components/Panel";
import { ui, zebraRow } from "../ui/tokens";

const AttendeeShowcase = () => {
  const { data: attendees, loading: loadingAttendees } = useGetAttendees();

  const roster = attendees
    .filter((attendee) => attendee.organization)
    .filter((attendee) => attendee.conference_ticket?.name !== "Vendor");

  return (
    <div className="mx-auto max-w-3xl">
      <Panel title="Attendee Roster" scroll bodyClassName="!p-0">
        {loadingAttendees ? (
          <div className="flex justify-center py-8">
            <LoadingIcon />
          </div>
        ) : roster.length > 0 ? (
          roster.map((attendee, i) => (
            <div
              key={"attendee-" + attendee.id}
              className={`${zebraRow(i)} flex items-start justify-between gap-3 text-sm`}
            >
              <div className="text-slate-500">{attendee.organization}</div>
              <div className="whitespace-nowrap font-medium text-slate-800">
                {attendee.first} {attendee.last}
              </div>
            </div>
          ))
        ) : (
          <p className={ui.empty}>No attendees yet registered.</p>
        )}
      </Panel>
    </div>
  );
};

export default AttendeeShowcase;
