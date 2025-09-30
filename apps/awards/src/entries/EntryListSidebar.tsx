// components/Sidebar.js

import { useEntryList } from "../providers/EntryListProvider";
import { useFormContext } from "react-hook-form";
import { useUserContext } from "../providers/UserContextProvider";
import { useNotify } from "../NotificationProvider";
import { IAwardNominationPayload } from "../types/types";
import { processAndUploadFiles } from "../helpers/processAndUploadFiles";
import { clearSavedFormData } from "../helpers/formPersistence";
import { fileCache } from "../helpers/fileCache";
import { submitAwardNomination } from "../data/API";

const EntryListSidebar = () => {
  const formContext = (() => {
    try {
      return useFormContext();
    } catch {
      return null; // Prevent errors if no form context exists
    }
  })();


  const { getValues } = formContext || {
    getValues: (string?: string) => ({
      string,
    }),
  };

  const { adminOptions, updateAdminOptions, selectedSubmission } =
    useEntryList();
  const { setViewingEntries } = useUserContext();

  const { notify } = useNotify();

  const onSubmitFunction = async (entry: {
    resource: string;
    data: IAwardNominationPayload;
  }) => {
    const formPayload: IAwardNominationPayload = {
      ...entry.data,
      ...getValues(),
    };

    try {
      // Process the payload and upload files if necessary
      const processedPayload = await processAndUploadFiles(
        {
          ...formPayload,
        },
        notify
      );

      
      // Submit the processed payload
      const response = await submitAwardNomination(processedPayload);

      if (response.message === "success") {
        clearSavedFormData(); // Clear saved form data on successful submission
        
        // Clear file cache on successful submission
        try {
          await fileCache.clearCache();
        } catch (error) {
          console.warn('Failed to clear file cache:', error);
        }
        
        notify("Application submitted successfully!", "success");
        setViewingEntries(true);
      } else {
        notify(
          "Error submitting application. Please try again later.",
          "error"
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      notify("Error submitting application. Please try again later.", "error");
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
          Resubmit Entry: {selectedSubmission?.data.nominee_name}
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
        onClick={() => {
          if (selectedSubmission) {
            onSubmitFunction({
              resource: 'scholarship-application',
              data: selectedSubmission.data
            });
          }
        }}
        disabled={!selectedSubmission}
      >
        Submit
      </button>
    </div>
  );
};

export default EntryListSidebar;
