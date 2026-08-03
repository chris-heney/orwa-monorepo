import "./index.css";
import { Form } from "mj-react-form-builder";
import {
  useEntryPayload,
  useFormSubmittedContext,
  useMembershipsContext,
  useUserContext,
} from "./providers/MembershipContextProvider";
import FormStepper from "./components/FormStepper";
import StepNavigation from "./components/StepNavigation";
import { emptyWatersystemPayload } from "./testPayloads/watersytemsTestPayload";
import { emptyAssociatePayload } from "./testPayloads/associateTestPayload";
import { useFormStepsContext } from "./providers/StepProvider";
import EntryListSidebar from "./entries/EntryListSidebar";
import { ValidationHighlightProvider } from "./helpers/validationHighlight";

const MembershipForm = () => {
  const path = window.location.hash.substring(2);
  const { isLoggedIn, isAdminView} = useUserContext();
  const { setStepIndex, stepIndex, steps } = useFormStepsContext();
  const { memberships } = useMembershipsContext();
  const { isFormSubmitted } = useFormSubmittedContext();
  const { entryPayload } = useEntryPayload();

  return !memberships ? (
    <div className="flex justify-center items-center h-screen bg-transparent">
      <div className="loader" />
    </div>
  ) : (
    <main className="flex flex-col text-center">
      {/* Form Stepper */}

      {!isFormSubmitted ? (
        <>
          <FormStepper stepIndex={stepIndex} setStepIndex={setStepIndex} />

          {/* Active Step */}
          <section className="min-h-96 p-3 md:py-6">
            <Form
              defaultValues={
                entryPayload
                  ? entryPayload
                  : path.includes("watersystem")
                  ? emptyWatersystemPayload
                  : emptyAssociatePayload
              }
            >
              <ValidationHighlightProvider clearOn={stepIndex}>
                <div className="gap-4 grid grid-cols-12 align-middle min-w-0">
                  <div
                    className={`min-w-0 ${
                      isLoggedIn && isAdminView ? "col-span-9" : "col-span-12"
                    }`}
                  >
                    {steps.filter((step) => step.active)[stepIndex].component}
                  </div>
                  {(isLoggedIn && isAdminView) && <EntryListSidebar />}
                </div>
                <StepNavigation />
              </ValidationHighlightProvider>
            </Form>

            {/* <ManualUploadTest/> */}
            {/* <DevTool control={form.control} placement='top-right' /> */}
          </section>
        </>
      ) : (
        <div className="container mx-auto max-w-2xl px-6 py-16">
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                className="h-7 w-7 text-green-600"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {path.includes("renewal")
                ? "Thank you for your renewal!"
                : "Thank you for your submission!"}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {path.includes("renewal")
                ? "Your renewal application has been submitted successfully."
                : "Your membership application has been submitted successfully."}
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default MembershipForm;
