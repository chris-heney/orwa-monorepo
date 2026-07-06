import { Divider } from "@mui/material";
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

          <Divider />

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
            </Form>

            {/* <ManualUploadTest/> */}
            {/* <DevTool control={form.control} placement='top-right' /> */}
          </section>
        </>
      ) : (
        <div className="container mx-auto max-w-6xl px-6 py-8">
          <div className="text-center">
            {path.includes("renewal") ? (
              <div>
                <h1 className="text-3xl font-semibold text-green-700">
                  Thank you for your renewal!
                </h1>
                <p className="text-gray-800 mt-4">
                  Your renewal application has been submitted successfully.
                </p>
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-semibold text-green-700">
                  Thank you for your submission!
                </h1>
                <p className="text-gray-800 mt-4">
                  Your membership application has been submitted successfully.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default MembershipForm;
