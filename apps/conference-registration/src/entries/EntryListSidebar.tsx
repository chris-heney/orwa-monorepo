// components/Sidebar.js
import { useNotify } from "mj-react-form-builder";
import { useSubmitRegistration2 } from "../data/API";
import { IRegistrationPayload } from "../types/types";
import { processAndUploadFiles } from "../helpers/processAndUploadFiles";
import {
  useRegistrationOptions,
  useRegistrationSource,
  useUserContext,
} from "../AppContextProvider";
import { useEntryList } from "../providers/EntryListProvider";
import { calculateSubtotal } from "../helpers/calculateSubtotal";
import { useFormContext } from "react-hook-form";

const EntryListSidebar = () => {
  const formContext = (() => {
    try {
      return useFormContext();
    } catch {
      return null; // Prevent errors if no form context exists
    }
  })();

  const { getValues } = formContext || { getValues: (string?: string) => ({
    string
  }) };

  const { adminOptions, updateAdminOptions, selectedSubmission } =
    useEntryList();
    const {setViewingEntries} = useUserContext();

  const registrationSource = useRegistrationSource();
  const { ConferenceOptions, ExtraOptions } = useRegistrationOptions();

  const { notify } = useNotify();

  const onSubmitFunction = async (entry: {
    resource: string;
    data: IRegistrationPayload;
  }) => {
    const payload: IRegistrationPayload = { ...entry.data, ...getValues() };

    try {
      const processedPayload = await processAndUploadFiles(payload, notify);

      // Format card expiration from MM/YY to YYYY-MM
      const cardExpiration = (() => {
        const expirationDate = getValues("paymentData.expirationDate") ?? "/";
        if (!expirationDate) return ""; // Handle missing input gracefully
        const [month, year] = (typeof expirationDate === "string" ? expirationDate : "/").split("/"); // Split into MM and YY
        return `20${year}-${month}`; // Combine into YYYY-MM
      })();

      const cardNumber = (() => {
        const number = getValues("paymentData.cardNumber");
        return typeof number === "string" ? (number as string).replace(/\s+/g, "") : ""; // Only replace if it's a string
      })();
           
      const updatedRegistrationPayload = {
        ...processedPayload,
        adminOptions: adminOptions,
        paymentData: {
          ...processedPayload.paymentData,
          cardNumber: cardNumber,
          expirationDate: cardExpiration,
          amount: calculateSubtotal(
            processedPayload,
            registrationSource,
            payload["agency"] === "false" &&
              payload["member_status"] === "Non Member"
              ? ConferenceOptions.non_member_fee
              : 0,
            ExtraOptions
          ),
        },
        nonMemberFee:
          payload["agency"] === "false" &&
          payload["member_status"] === "Non Member",
        // paymentType: getValues("paymentType"),
        registrationSource,
        // organization: getValues("organization"),
        team: payload["team"],
      };

      const submitResponse = await useSubmitRegistration2(
        updatedRegistrationPayload
      );

      if (submitResponse.result === "success") {
        notify(submitResponse.message, "success");
        setViewingEntries(true);
      } else {
        notify(
          submitResponse.message || "An error occurred during submission",
          "error"
        );
        if (submitResponse.data?.transactionResponse?.errors?.length > 0) {
          notify(
            submitResponse.data.transactionResponse.errors[0].errorText,
            "error"
          );
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      notify(
        `Error submitting application. Please try again later. ${errorMessage}`,
        "error"
      );
    }
  };

  return (
    <div className="bg-white rounded-md py-2 px-6 space-y-6 border border-gray-200 col-span-3">
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
          Resubmit Entry: {selectedSubmission?.data?.organization}
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
              data: IRegistrationPayload;
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
