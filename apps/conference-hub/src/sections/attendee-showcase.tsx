import { useGetAttendees } from "../helpers/API";
import LoadingIcon from "../components/LoadingIcon";
import TitleBar from "../components/titlebar";

const AttendeeShowcase = () => {
  const { data: attendees, loading: loadingAttendees } = useGetAttendees();

  console.log(attendees);
  return (
    <div>
      <div className="text-left grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Attendee Forms */}
        <div className="bg-white p-4 rounded-lg overflow-y-scroll md:max-h-well order-first md:order-last">
          <div className="sticky -top-4">
            <TitleBar>Attendee Roster</TitleBar>
          </div>
          <div className="text-sm">
            {loadingAttendees ? (
              <LoadingIcon />
            ) : (
              attendees
                .filter((attendee) => attendee.organization)
                .filter(
                  (attendee) =>
                    
                    attendee.conference_ticket?.name !== "Vendor"
                )
                .map((attendee, i) => (
                  <>
                    {/* <h3 className="text-xl text-gray-700 font-bold mb-2">{org.name}</h3> */}
                    <div
                      className={`py-3 px-4 -mx-4 bg-gray-${
                        i % 2 === 0 ? "100" : "300"
                      } flex justify-between`}
                      key={"vendor-" + attendee.id}
                    >
                      <div>{attendee.organization}</div>
                      <div className="whitespace-nowrap text-right">
                        {attendee.first} {attendee.last}
                      </div>
                    </div>
                  </>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeShowcase;
