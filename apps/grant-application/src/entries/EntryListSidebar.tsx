// components/Sidebar.js

import { useEntryList } from "../providers/EntryListProvider";
import { useFormContext } from "react-hook-form";
import { useUserContext } from "../providers/UserContextProvider";
import { useNotify } from "../NotificationProvider";
import { IGrantApplicationFormPayload, IProject } from "../types/types";
import {
  fileUploadErrorMessage,
  processAndUploadFiles,
} from "../helpers/processAndUploadFiles";
import {
  useGetApplicationId,
  useGetProjects,
  useSubmitApplication,
} from "../data/API";
import { clearSavedFormData } from "../helpers/formPersistence";
import ApplicationPdfActions from "../components/_components/ApplicationPdfActions";
import { fileCache } from "../helpers/fileCache";
import {
  projectCostsMapToRows,
  ProjectCostsMap,
  sumProjectCosts,
} from "../helpers/projectCosts";

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

  const applicationId = useGetApplicationId();
  const { data: projects } = useGetProjects();

  const { notify } = useNotify();

  const onSubmitFunction = async (entry: {
    resource: string;
    data: IGrantApplicationFormPayload;
  }) => {
    const formPayload: IGrantApplicationFormPayload = {
      ...entry.data,
      ...getValues(),
    };
    const selectedProjectIds = formPayload.selected_projects ?? [];
    const costsMap = (formPayload.project_costs ?? {}) as ProjectCostsMap;
    const projectCostRows = projectCostsMapToRows(
      costsMap,
      selectedProjectIds,
      (projects as unknown as IProject[]) ?? []
    );
    const combinedCost = sumProjectCosts(costsMap, selectedProjectIds);

    try {
      // Upload any newly selected attachments; throws FileUploadError (and
      // stops the submit) when one cannot be uploaded.
      const processedPayload = await processAndUploadFiles({
        ...formPayload,
        project_costs: projectCostRows,
        combined_cost_of_projects: combinedCost,
        id: applicationId.data,
      });

      // The applicant PDF is rendered and stored by Strapi on create.
      const payload = {
        ...processedPayload,
        project_costs: projectCostRows,
        combined_cost_of_projects: combinedCost,
        adminOptions,
        additional_funding_requested: Math.round(formPayload.additional_funding_requested),
        application_id: applicationId.data,
        engineering_report_deq_approved:
          formPayload.engineering_report_deq_approved === "Yes" ? true : false,
      };

      const response = await useSubmitApplication(payload);

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
      } else if (response.code === "invalid_request" && response.message) {
        notify(response.message, "error");
      } else {
        notify(
          "Error submitting application. Please try again later.",
          "error"
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      notify(
        fileUploadErrorMessage(error) ??
          "Error submitting application. Please try again later.",
        "error"
      );
    }
  };
  return (
    <div className="bg-white rounded-md py-2 px-6 space-y-6 border border-gray-200 col-span-3">
      {/* Application PDF: rendered from the current form values with the
          real application number — same renderer Strapi stores on save. */}
      {formContext && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2 text-left">
            Application PDF
          </h3>
          <hr className="border-gray-300 py-2" />
          <ApplicationPdfActions layout="sidebar" />
          <p className="text-xs text-gray-500 leading-5 mt-2 text-left">
            Built from what is on the form right now. The stored PDF updates
            automatically whenever the application is saved.
          </p>
        </div>
      )}

      {formContext && <hr className="border-gray-300" />}

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
          Resubmit Entry: {selectedSubmission?.data.legal_entity_name}
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
              data: IGrantApplicationFormPayload;
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
