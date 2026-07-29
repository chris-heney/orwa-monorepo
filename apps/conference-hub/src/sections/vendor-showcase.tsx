import { useEffect, useState } from "react";
import { useGetVendors } from "../helpers/API";
import LoadingIcon from "../components/LoadingIcon";
import IOrganization from "../types/IOrganization";
import TitleBar from "../components/titlebar";

const VendorShowcase = () => {
  const [vendorOrganizations, setVendorOrganizations] = useState<
    IOrganization[]
  >([]);

  const { data: vendors, loading: loadingVendors } = useGetVendors();

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
        <div className="bg-white p-4 rounded-lg overflow-y-scroll md:max-h-well order-first md:order-last">
          
        </div>

        {/* Vendor Showcase */}
        <div className="bg-white p-4 rounded-lg overflow-y-scroll md:max-h-well order-first md:order-last">
          <div className="sticky -top-4">
            <TitleBar>Vendor Showcase</TitleBar>
          </div>
          <div className="text-sm">
            {loadingVendors ? (
              <LoadingIcon />
            ) : (
              vendorOrganizations.map((org, i) => (
                <div
                  key={"v-org-" + i}
                  className={
                    "-mx-4 px-4 py-3 bg-gray-" + (i % 2 === 0 ? "100" : "300")
                  }
                >
                  <h3 className="text-xl text-gray-700 font-bold mb-2">
                    {org.name}
                  </h3>
                  {org.attendees.map((vendor) => (
                    <div className="my-2" key={"vendor-" + vendor.id}>
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
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorShowcase;
