import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useGetApplicationId, useGetProjects } from "../../data/API";
import { buildPreviewPdf } from "../../helpers/applicantPdfPreview";
import { useNotify } from "../../NotificationProvider";
import { useScoringCriterias } from "../../providers/AppContextProvider";
import { useEditSession } from "../../providers/EditSessionProvider";
import { useEntryList } from "../../providers/EntryListProvider";
import { IProject } from "../../types/types";

interface ApplicationPdfActionsProps {
  /** `sidebar` stacks full-width buttons; `inline` lays them out in a row. */
  layout?: "sidebar" | "inline";
}

/**
 * View / Download the application as the PDF Strapi will store on save.
 * Generation is implicit — there is no separate "Generate" step — and the
 * header carries the real application number when one exists.
 */
const ApplicationPdfActions = ({ layout = "sidebar" }: ApplicationPdfActionsProps) => {
  const { getValues } = useFormContext();
  const { scoringCriterias } = useScoringCriterias();
  const { data: projects } = useGetProjects();
  const nextApplicationId = useGetApplicationId();
  const { editPayload } = useEditSession();
  const { selectedSubmission } = useEntryList();
  const { notify } = useNotify();
  const [busy, setBusy] = useState<"view" | "download" | null>(null);

  const identity = () => {
    const values = getValues() as Record<string, any>;
    const edit = (editPayload ?? {}) as Record<string, any>;
    const entry = (selectedSubmission?.data ?? {}) as Record<string, any>;
    const existingNumber =
      values.application_id || edit.application_id || entry.application_id;
    const existingDate =
      values.application_date || edit.application_date || selectedSubmission?.createdAt;
    return {
      applicationNumber: String(existingNumber || nextApplicationId.data || ""),
      applicationDate: existingDate ?? null,
    };
  };

  const render = async (mode: "view" | "download") => {
    setBusy(mode);
    try {
      const { blob, fileName } = await buildPreviewPdf(
        getValues() as Record<string, any>,
        scoringCriterias,
        (projects as unknown as IProject[]) ?? [],
        identity()
      );
      const url = URL.createObjectURL(blob);
      if (mode === "view") {
        const tab = window.open(url, "_blank", "noopener");
        if (!tab) notify("Pop-up blocked. Allow pop-ups to view the PDF.", "error");
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10_000);
      }
    } catch (error) {
      console.error("Applicant PDF preview failed:", error);
      notify("Could not build the application PDF. Check the form for missing values.", "error");
    } finally {
      setBusy(null);
    }
  };

  const buttonClass =
    "rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className={layout === "sidebar" ? "space-y-2" : "flex flex-wrap items-center gap-2"}>
      <button
        type="button"
        onClick={() => render("view")}
        disabled={busy !== null}
        className={`${buttonClass} ${layout === "sidebar" ? "w-full" : ""}`}
      >
        {busy === "view" ? "Building PDF…" : "View PDF"}
      </button>
      <button
        type="button"
        onClick={() => render("download")}
        disabled={busy !== null}
        className={`${buttonClass} ${layout === "sidebar" ? "w-full" : ""}`}
      >
        {busy === "download" ? "Building PDF…" : "Download PDF"}
      </button>
    </div>
  );
};

export default ApplicationPdfActions;
