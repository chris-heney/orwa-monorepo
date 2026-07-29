import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useGetAttendees, useGetVendors } from "../helpers/API";
import LoadingIcon from "../components/LoadingIcon";
import IOrganization from "../types/IOrganization";
import TitleBar from "../components/titlebar";
import Statistics from "../components/Statistics";

const Showcase = () => {
  const [vendorOrganizations, setVendorOrganizations] = useState<IOrganization[]>([]);

  const { data: vendors, loading: loadingVendors } = useGetVendors();
  const { data: attendees, loading: loadingAttendees } = useGetAttendees();

  // Transform Vendors grouping them by organization
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

  return (
    <div>
      <div className="text-left grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Attendee Forms */}
        <motion.div
          className="bg-white p-4 rounded-lg overflow-y-scroll md:max-h-well order-first md:order-last"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="sticky -top-4">
            <TitleBar>Attendee Roster</TitleBar>
          </div>
          <div className="text-sm">
            {loadingAttendees ? (
              <LoadingIcon />
            ) : attendees?.length > 0 ? (
              attendees
                .filter(
                  (attendee) =>
                    attendee.conference_ticket &&
                    attendee.conference_ticket?.name !== "Vendor"
                )
                .map((attendee, i) => (
                  <motion.div
                    className={`py-3 px-4 -mx-4 bg-gray-${
                      i % 2 === 0 ? "100" : "300"
                    } flex justify-between`}
                    key={"vendor-" + attendee.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <div className="whitespace-nowrap text-right">
                      {attendee.first} {attendee.last}
                    </div>
                    {attendee.organization && (
                      <div className="text-sm max-w-sm text-right">
                        {attendee.organization}
                      </div>
                    )}
                  </motion.div>
                ))
            ) : (
              <p className="text-center text-gray-600 font-medium mt-6">
                No attendees yet registered.
              </p>
            )}
          </div>
        </motion.div>

        {/* Vendor Showcase */}
        <motion.div
          className="bg-white p-4 rounded-lg overflow-y-scroll md:max-h-well order-first md:order-last"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="sticky -top-4">
            <TitleBar>Vendor Showcase</TitleBar>
          </div>
          <div className="text-sm">
            {loadingVendors ? (
              <LoadingIcon />
            ) : vendorOrganizations?.length > 0 ? (
              vendorOrganizations.map((org, i) => (
                <motion.div
                  key={"v-org-" + i}
                  className={`-mx-4 px-4 py-3 bg-gray-${
                    i % 2 === 0 ? "100" : "300"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <h3 className="text-xl text-gray-700 font-bold mb-2">
                    {org.name}
                  </h3>
                  {org.attendees.map((vendor) => (
                    <motion.div
                      className="my-2"
                      key={"vendor-" + vendor.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <p className="font-bold">
                        {vendor.first} {vendor.last}
                      </p>
                      <p>
                        <a
                          href={`mailto:${vendor.email}`}
                          target="_blank"
                          className="text-blue-500 underline hover:no-underline"
                        >
                          {vendor.email}
                        </a>
                      </p>
                      <p>
                        <a
                          href={`tel:+1${vendor.phone?.replace(
                            /[-\s()]/g,
                            ""
                          )}`}
                          target="_blank"
                          className="text-blue-500 underline hover:no-underline"
                        >
                          {vendor.phone}
                        </a>
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-600 font-medium mt-6">
                No vendors yet registered.
              </p>
            )}
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
      >
        <Statistics />
      </motion.div>
    </div>
  );
};

export default Showcase;