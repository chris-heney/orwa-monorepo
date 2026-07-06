// components/Sidebar.js
import { useNotify } from "mj-react-form-builder";
import { submitMembershipForm } from "../data/API";
import { useEntryList } from "../providers/EntryListProvider";
import { AssociateMembershipPayload } from "../types/AssociateMembership";
import { WatersystemMembershipPayload } from "../types/WatersystemMebership";
import currencyFormatter from "../helpers/currencyFormatter";
import { getFormRoute } from "../helpers/getFormRoute";
import { useNavigate } from "react-router";
import { AdminOptions } from "../types";
import { useFormContext } from "react-hook-form";

const EntryListSidebar = () => {
  
  const formContext = (() => {
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useFormContext();
    } catch {
      return null; // Prevent errors if no form context exists
    }
  })();

  const { getValues } = formContext || { getValues: (string?: string) => ({
    string
  }) };

  const {
    adminOptions,
    updateAdminOptions,
    selectedSubmission,
  } = useEntryList();

  const { notify } = useNotify();
  const navigate = useNavigate();


  const onSubmitFunction = async (entry: {
    resource: string;
    data: WatersystemMembershipPayload | AssociateMembershipPayload;
  }) => {
    const formPayload = { ...entry.data, ...getValues() };

    try {
      const response = await submitMembershipForm(
        {
          ...formPayload,
          adminOptions: adminOptions as AdminOptions,
          mailing_address_state: (formPayload as AssociateMembershipPayload).mailing_address_state === "" ? null : (formPayload as AssociateMembershipPayload).mailing_address_state,
          fee_scholarship: formPayload.fee_scholarship
            ? isNaN(formPayload.fee_scholarship)
              ? 0
              : formPayload.fee_scholarship
            : 0,
          payment_details: `==========\n${
            getFormRoute(entry).includes("watersystem")
              ? `Number of Connections: ${
                  (formPayload as WatersystemMembershipPayload)?.meters
                } x $0.9\n`
              : ""
          }Base Membership Fee: ${currencyFormatter.format(
            formPayload.fee_membership || 0
          )}\nScholarship Support: ${currencyFormatter.format(
            formPayload.fee_scholarship
              ? isNaN(formPayload.fee_scholarship)
                ? 0
                : formPayload.fee_scholarship
              : 0
          )}\n==========\nTotal: ${currencyFormatter.format(
            formPayload.payment_amount || 0
          )}\n==========\nBilling Address: ${
            formPayload.address_billing_line1
          }, ${formPayload.address_billing_city}, ${
            formPayload.address_billing_state
          }, ${formPayload.address_billing_zip}\nBilling Email:${
            formPayload.billing_email
          }\nBilling Phone: ${formPayload.billing_phone}\nBilling First Name: ${
            formPayload.billing_first_name
          }\nBilling Last Name: ${formPayload.billing_last_name}\n==========`,
        },
        getFormRoute(entry).replace("/", "")
      );
      if (response.message === "success") {
        notify("Entry successfully submitted!", "success");
        navigate("/entries");
      } else {
        notify(
          `Error submitting application. Please try again later. Error: ${response.error}`,
          "error"
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      notify(
        `Error submitting application. Please try again later. ${(error as Error).message}`,
        "error"
      );
    }
  };

  return (
    <div className="bg-white rounded-md py-2 px-6 space-y-6 border border-gray-200 col-span-3 min-w-0">
      {/* Notifications Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2 text-left">
          Notifications
        </h3>
        <hr className="border-gray-300 py-2" />

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={adminOptions.registrantNotification}
              onChange={() =>
                updateAdminOptions({
                  registrantNotification: !adminOptions.registrantNotification,
                })
              }
              className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-800 font-medium">
              Registrant Notification
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={adminOptions.adminNotification}
              onChange={() =>
                updateAdminOptions({
                  adminNotification: !adminOptions.adminNotification,
                })
              }
              className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-800 font-medium">
              Admin Notification
            </span>
          </label>

          <p className="text-xs text-gray-500 leading-5">
            Override default notifications by entering a comma-separated list of
            emails.
          </p>

          <input
            type="email"
            placeholder="Enter custom email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            value={adminOptions.customEmail}
            onChange={(e) =>
              updateAdminOptions({ customEmail: e.target.value })
            }
          />
        </div>
      </div>

      <hr className="border-gray-300" />

      {/* Resubmit Section */}
      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-2">
          Resubmit Entry: {selectedSubmission?.data?.name}
        </h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={adminOptions.resubmit}
            onChange={() =>
              updateAdminOptions({ resubmit: !adminOptions.resubmit })
            }
            className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-800 font-medium">
            Resubmit this entry?
          </span>
        </label>
      </div>

      {/* Resubmit Button */}
      <button
        type="button"
        className="w-full bg-green-600 text-white font-semibold text-sm px-4 py-3 rounded-lg shadow-md hover:bg-green-700 transition-transform duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() =>
          onSubmitFunction(
            selectedSubmission as {
              resource: string;
              data: WatersystemMembershipPayload | AssociateMembershipPayload;
            }
          )
        }
        disabled={!selectedSubmission}
      >
        Submit
      </button>
    </div>
  );
};

export default EntryListSidebar;
