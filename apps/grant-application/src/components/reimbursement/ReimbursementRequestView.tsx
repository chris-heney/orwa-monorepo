import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import FormSection from "../_components/FormSection";
import StepShell from "../_components/StepShell";
import FileInput from "../_components/FileInput";
import { TextInput } from "../_components/TextInput";
import { CheckboxInput } from "../_components/CheckboxInput";
import { TextAreaInput } from "../_components/TextAreaInput";
import MaskedPhoneInput from "../_components/MaskedPhoneInput";
import ApplicationPicker from "./ApplicationPicker";
import InvoiceLinesInput, {
  emptyInvoiceLine,
  sumInvoiceLines,
} from "./InvoiceLinesInput";
import SignatureInput from "./SignatureInput";
import ReimbursementSuccess from "./ReimbursementSuccess";
import { useNotify } from "../../NotificationProvider";
import { useEditSession } from "../../providers/EditSessionProvider";
import {
  REIMBURSE_MESSAGES,
  useReimbursementSession,
} from "../../providers/ReimbursementSessionProvider";
import { submitReimbursementRequest } from "../../data/API";
import { processAndUploadFiles } from "../../helpers/processAndUploadFiles";
import { validationHighlightClassName } from "../../helpers/validationHighlight";
import currencyFormatter from "../../helpers/currencyFormat";
import {
  IReimbursableApplication,
  IReimbursementFormValues,
  IReimbursementSubmitResponse,
} from "../../types/reimbursement";

const money = (n: number) => currencyFormatter.format(n || 0);

type SectionKey =
  | "application"
  | "invoices"
  | "documents"
  | "requester"
  | "certification";

const newSubmissionId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `sub_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

const buildDefaults = (
  apps: IReimbursableApplication[],
  email: string
): IReimbursementFormValues => {
  const eligible = apps.filter((a) => a.remaining_balance > 0);
  const only = eligible.length === 1 ? eligible[0] : null;
  const poc = only?.point_of_contact;
  const pocIsRequester =
    poc?.email && poc.email.toLowerCase() === email.toLowerCase();
  return {
    application: only?.documentId ?? "",
    invoices: [emptyInvoiceLine()],
    requester_name: pocIsRequester ? `${poc?.first ?? ""} ${poc?.last ?? ""}`.trim() : "",
    requester_title: pocIsRequester ? poc?.title ?? "" : "",
    requester_email: email,
    requester_phone: pocIsRequester ? poc?.phone ?? "" : "",
    requester_signature: "",
    certified: false,
    applicant_notes: "",
    paid_invoices: [],
    proof_of_payment: [],
    project_photos: [],
    photos_not_applicable: false,
  };
};

/** Map react-hook-form error paths to the form sections that get the red outline. */
const sectionsFromErrors = (errors: Record<string, unknown>): SectionKey[] => {
  const keys = new Set<SectionKey>();
  for (const path of Object.keys(errors)) {
    if (path === "application") keys.add("application");
    else if (path === "invoices") keys.add("invoices");
    else if (
      path === "paid_invoices" ||
      path === "proof_of_payment" ||
      path === "project_photos" ||
      path === "photos_not_applicable"
    )
      keys.add("documents");
    else if (path.startsWith("requester_") && path !== "requester_signature")
      keys.add("requester");
    else if (path === "certified" || path === "requester_signature")
      keys.add("certification");
  }
  return [...keys];
};

const ReimbursementRequestView = () => {
  const { setView } = useEditSession();
  const { token, session, refreshSession, invalidate, signOut } =
    useReimbursementSession();
  const { notify } = useNotify();

  const applications = session?.applications ?? [];
  const email = session?.email ?? "";

  const methods = useForm<IReimbursementFormValues>({
    defaultValues: buildDefaults(applications, email),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { watch, trigger, getValues, setError, clearErrors, reset, formState } =
    methods;

  const [submissionId, setSubmissionId] = useState(newSubmissionId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invalidSections, setInvalidSections] = useState<Set<SectionKey>>(
    () => new Set()
  );
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [result, setResult] = useState<IReimbursementSubmitResponse | null>(null);

  const selectedId = watch("application");
  const invoices = watch("invoices");
  const paidInvoices = watch("paid_invoices") ?? [];
  const proofOfPayment = watch("proof_of_payment") ?? [];
  const projectPhotos = watch("project_photos") ?? [];
  const photosNotApplicable = watch("photos_not_applicable");
  const certified = watch("certified");

  const selected = useMemo(
    () => applications.find((a) => a.documentId === selectedId) ?? null,
    [applications, selectedId]
  );
  const invoiceTotal = sumInvoiceLines(invoices);
  const remaining = selected?.remaining_balance ?? 0;
  const requestedAmount = Math.max(0, Math.min(invoiceTotal, remaining));
  const isCapped = selected != null && invoiceTotal > remaining && remaining > 0;

  // Photos: clear the N/A tick automatically once photos are attached.
  useEffect(() => {
    if (projectPhotos.length > 0 && photosNotApplicable) {
      methods.setValue("photos_not_applicable", false);
    }
  }, [projectPhotos.length, photosNotApplicable, methods]);

  const clearHighlights = () => {
    setInvalidSections(new Set());
    setServerErrors([]);
  };

  const highlight = (sections: SectionKey[]) => {
    setInvalidSections(new Set(sections));
    requestAnimationFrame(() => {
      document
        .querySelector(`[data-section="${sections[0]}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  /** Cross-field rules react-hook-form cannot express per input. */
  const validateDocuments = (): boolean => {
    let ok = true;
    clearErrors(["paid_invoices", "proof_of_payment", "project_photos"]);
    if (paidInvoices.length === 0) {
      setError("paid_invoices", {
        type: "required",
        message: "Attach a copy of all paid invoices / pay applications",
      });
      ok = false;
    }
    if (proofOfPayment.length === 0) {
      setError("proof_of_payment", {
        type: "required",
        message: "Attach proof of payment",
      });
      ok = false;
    }
    if (projectPhotos.length === 0 && !photosNotApplicable) {
      setError("project_photos", {
        type: "required",
        message:
          "Attach project photos, or confirm that photos are not applicable",
      });
      ok = false;
    }
    return ok;
  };

  const handleSubmit = async () => {
    if (!token || !session) return;
    clearHighlights();

    const fieldsValid = await trigger();
    const docsValid = validateDocuments();
    if (!fieldsValid || !docsValid) {
      const sections = sectionsFromErrors(
        methods.formState.errors as Record<string, unknown>
      );
      if (!docsValid && !sections.includes("documents")) sections.push("documents");
      highlight(sections.length ? sections : ["application"]);
      notify("Please complete the highlighted sections before submitting.", "error");
      return;
    }

    if (!selected || selected.remaining_balance <= 0) {
      highlight(["application"]);
      notify(REIMBURSE_MESSAGES.no_balance, "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const values = getValues();
      const uploaded = await processAndUploadFiles(
        {
          paid_invoices: values.paid_invoices,
          proof_of_payment: values.proof_of_payment,
          project_photos: values.project_photos,
        },
        notify
      );

      const payload = {
        application: values.application,
        invoices: values.invoices.map((line) => ({
          vendor: line.vendor?.trim() ?? "",
          invoice_number: line.invoice_number?.trim() ?? "",
          amount: line.amount,
        })),
        requester_name: values.requester_name,
        requester_title: values.requester_title,
        requester_email: values.requester_email,
        requester_phone: values.requester_phone,
        requester_signature: values.requester_signature,
        certified: values.certified === true,
        applicant_notes: values.applicant_notes ?? "",
        paid_invoices: uploaded.paid_invoices ?? [],
        proof_of_payment: uploaded.proof_of_payment ?? [],
        project_photos: uploaded.project_photos ?? [],
        photos_not_applicable: values.photos_not_applicable === true,
        portal_submission_id: submissionId,
      };

      const response = await submitReimbursementRequest(token, payload);

      if (response.code === "ok") {
        setResult(response);
        notify("Reimbursement request submitted.", "success");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (response.code === "validation") {
        setServerErrors(response.errors ?? ["Please review the form and try again."]);
        highlight(["application"]);
        notify("Please correct the errors listed at the top of the form.", "error");
        return;
      }
      if (response.code === "invalid") {
        invalidate(REIMBURSE_MESSAGES.invalid);
        return;
      }
      if (response.code === "not_eligible") {
        invalidate(REIMBURSE_MESSAGES.not_eligible);
        return;
      }
      if (response.code === "no_balance") {
        await refreshSession();
        highlight(["application"]);
        notify(REIMBURSE_MESSAGES.no_balance, "error");
        return;
      }
      notify(
        response.message ||
          "Error submitting reimbursement request. Please try again later.",
        "error"
      );
    } catch (err) {
      console.error("Reimbursement submission error:", err);
      notify("Error submitting reimbursement request. Please try again later.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startAnother = async () => {
    await refreshSession();
    setResult(null);
    setSubmissionId(newSubmissionId());
    clearHighlights();
  };

  // After a submission cycle ends ("Submit another"), rebuild defaults from the
  // refreshed session so balances and the picker reflect the new request.
  // Guarded so it never fires on mount: resetting a form that owns a
  // `useFieldArray` during the initial (StrictMode double) effect pass
  // duplicated the first invoice row.
  const hadResult = useRef(false);
  useEffect(() => {
    if (result !== null) {
      hadResult.current = true;
      return;
    }
    if (hadResult.current && session) {
      hadResult.current = false;
      reset(buildDefaults(session.applications, session.email), {
        keepDefaultValues: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when a submission cycle ends
  }, [result]);

  if (!session) {
    return (
      <main className="flex flex-col items-center px-4 py-20">
        <CircularProgress size={28} />
      </main>
    );
  }

  if (result && selected) {
    return (
      <ReimbursementSuccess
        result={result}
        application={selected}
        requesterEmail={getValues("requester_email")}
        onAnother={startAnother}
        onDone={() => {
          setResult(null);
          setView("landing");
        }}
      />
    );
  }

  const sectionClass = (key: SectionKey) =>
    invalidSections.has(key) ? validationHighlightClassName : "";

  const hasAnyBalance = applications.some((a) => a.remaining_balance > 0);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        noValidate
      >
        <StepShell
          title="RIG Reimbursement Request"
          description={
            <>
              Complete this form in its entirety and attach all required
              documentation. Incomplete requests cannot be processed. Signed in
              as <span className="font-semibold text-slate-800">{email}</span>{" "}
              (
              <button
                type="button"
                onClick={signOut}
                className="font-medium text-blue-600 hover:underline"
              >
                not you?
              </button>
              ).
            </>
          }
        >
          {serverErrors.length > 0 && (
            <div
              role="alert"
              className="mb-6 rounded-lg border-2 border-red-500 bg-red-50 p-4 text-left"
            >
              <p className="text-sm font-semibold text-red-800">
                Your request could not be submitted. Please fix the following:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-800">
                {serverErrors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          )}

          {!hasAnyBalance && (
            <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              {REIMBURSE_MESSAGES.no_balance} If you believe this is incorrect,
              contact rig@orwa.org.
            </div>
          )}

          <div data-section="application" className={sectionClass("application")}>
            <FormSection
              title="Grant application"
              description={
                applications.length > 1
                  ? "Select the approved application this reimbursement applies to."
                  : "This reimbursement applies to the approved application below."
              }
            >
              <ApplicationPicker applications={applications} />
              {formState.errors.application?.message && (
                <p className="mt-2 text-sm text-red-600">
                  {String(formState.errors.application.message)}
                </p>
              )}
            </FormSection>
          </div>

          <div data-section="invoices" className={sectionClass("invoices")}>
            <FormSection
              title="Invoice / pay application details"
              description="List each paid vendor invoice or pay application you are requesting reimbursement for. Amounts must match the attached invoices."
            >
              <InvoiceLinesInput />

              {selected && (
                <div className="mt-5 grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Total invoices
                    </p>
                    <p className="text-lg font-bold tabular-nums text-slate-900">
                      {money(invoiceTotal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Remaining grant balance
                    </p>
                    <p className="text-lg font-bold tabular-nums text-slate-900">
                      {money(remaining)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Reimbursement requested
                    </p>
                    <p
                      data-testid="requested-amount"
                      className="text-lg font-bold tabular-nums text-emerald-700"
                    >
                      {money(requestedAmount)}
                    </p>
                  </div>
                  {isCapped && (
                    <p className="sm:col-span-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                      Your invoices total more than the remaining grant balance.
                      The request will be capped at {money(remaining)}; the
                      difference is not reimbursable under this grant.
                    </p>
                  )}
                </div>
              )}
            </FormSection>
          </div>

          <div data-section="documents" className={sectionClass("documents")}>
            <FormSection
              title="Required documentation"
              description="Verify all applicable items are attached before submitting. PDF or image files are accepted."
            >
              <div className="divide-y divide-slate-200">
                <FileInput
                  name="paid_invoices"
                  label="Copy of all paid invoices / pay applications"
                  required
                  multiple
                />
                <FileInput
                  name="proof_of_payment"
                  label="Copy of proof of payment (cleared check, credit/debit card receipt, ACH, etc.)"
                  required
                  multiple
                />
                <FileInput
                  name="project_photos"
                  label="Photos of project pertaining to invoice(s) and/or work performed"
                  required={!photosNotApplicable}
                  multiple
                  helperText="Required unless photos do not apply to this request."
                />
                {projectPhotos.length === 0 && (
                  <div className="pt-4">
                    <CheckboxInput
                      name="photos_not_applicable"
                      label="Photos are not applicable to this request (e.g. engineering, permitting, or other non-construction expenses)."
                    />
                  </div>
                )}
              </div>
            </FormSection>
          </div>

          <div data-section="requester" className={sectionClass("requester")}>
            <FormSection
              title="Requester"
              description="Who should ORWA contact about this request? Confirmation and any follow-up questions will go to this email."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextInput name="requester_name" label="Requester name" required maxLength={120} />
                <TextInput name="requester_title" label="Title" required maxLength={120} />
                <TextInput
                  name="requester_email"
                  label="Email"
                  type="email"
                  required
                  maxLength={254}
                  validation={{
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  }}
                />
                <MaskedPhoneInput source="requester_phone" />
              </div>
              <TextAreaInput
                name="applicant_notes"
                label="Notes for the Grant Manager (optional)"
                rows={3}
                maxCharCount={2000}
              />
            </FormSection>
          </div>

          <div data-section="certification" className={sectionClass("certification")}>
            <FormSection title="Certification & signature">
              <CheckboxInput
                name="certified"
                label="I certify that the information provided above is true and correct to the best of my knowledge and that the requested reimbursement is for eligible expenses related to the approved RIG project."
                required
              />
              <SignatureInput name="requester_signature" />
              <p className="mt-3 text-xs text-slate-500">
                Date: {new Date().toLocaleDateString("en-US")}
              </p>
            </FormSection>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={() => setView("landing")}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              ← Back
            </button>
            {isSubmitting ? (
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <CircularProgress size={24} />
                Uploading documents and submitting…
              </div>
            ) : (
              <button
                type="submit"
                disabled={!hasAnyBalance || !certified}
                title={!certified ? "Check the certification box to enable submission" : undefined}
                className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Submit Reimbursement Request
              </button>
            )}
          </div>
        </StepShell>
      </form>
    </FormProvider>
  );
};

export default ReimbursementRequestView;
