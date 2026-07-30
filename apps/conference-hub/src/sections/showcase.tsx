import { useEffect, useState } from "react";
import { useGetAttendees, useGetVendors } from "../helpers/API";
import LoadingIcon from "../components/LoadingIcon";
import IOrganization from "../types/IOrganization";
import Panel from "../components/Panel";
import Statistics from "../components/Statistics";
import { ui, zebraRow } from "../ui/tokens";

const Showcase = () => {
  const [vendorOrganizations, setVendorOrganizations] = useState<
    IOrganization[]
  >([]);

  const { data: vendors, loading: loadingVendors } = useGetVendors();
  const { data: attendees, loading: loadingAttendees } = useGetAttendees();

  useEffect(() => {
    if (vendorOrganizations.length === 0 && vendors.length > 0) {
      const orgs = vendors.reduce((acc, vendor) => {
        const org = acc.find((o) => o.name === vendor.organization);
        if (org) {
          org.attendees.push(vendor);
        } else {
          acc.push({ name: vendor.organization, attendees: [vendor] });
        }
        return acc;
      }, [] as IOrganization[]);
      setVendorOrganizations(orgs);
    }
  }, [vendors, vendorOrganizations]);

  const roster = attendees.filter(
    (attendee) =>
      attendee.conference_ticket &&
      attendee.conference_ticket?.name !== "Vendor"
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                <div className="font-medium text-slate-800">
                  {attendee.first} {attendee.last}
                </div>
                {attendee.organization && (
                  <div className="max-w-[55%] text-right text-slate-500">
                    {attendee.organization}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className={ui.empty}>No attendees yet registered.</p>
          )}
        </Panel>

        <Panel title="Vendor Showcase" scroll bodyClassName="!p-0">
          {loadingVendors ? (
            <div className="flex justify-center py-8">
              <LoadingIcon />
            </div>
          ) : vendorOrganizations.length > 0 ? (
            vendorOrganizations.map((org, i) => (
              <div key={"v-org-" + i} className={zebraRow(i)}>
                <h3 className="mb-2 text-base font-semibold text-slate-900">
                  {org.name}
                </h3>
                <div className="space-y-2">
                  {org.attendees.map((vendor) => (
                    <div key={"vendor-" + vendor.id} className="text-sm">
                      <p className="font-medium text-slate-800">
                        {vendor.first} {vendor.last}
                      </p>
                      {vendor.email && (
                        <p>
                          <a href={`mailto:${vendor.email}`} className={ui.link}>
                            {vendor.email}
                          </a>
                        </p>
                      )}
                      {vendor.phone && (
                        <p>
                          <a
                            href={`tel:+1${vendor.phone.replace(/[-\s()]/g, "")}`}
                            className={ui.link}
                          >
                            {vendor.phone}
                          </a>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className={ui.empty}>No vendors yet registered.</p>
          )}
        </Panel>
      </div>
      <Statistics />
    </div>
  );
};

export default Showcase;
