import { Divider, Modal } from "@mui/material";
import { useContext } from "react";
import FormStepper from "./FormStepper";
import {
  ConferenceId,
  useEntryPayload,
  useExtraDetails,
  useFormSubmitted,
  useRegistrationOptions,
  useRegistrationSource,
  useStepContext,
  useUserContext,
} from "../AppContextProvider";
import StepNavigation from "./StepNavigation";
import { Form, NotifyProvider } from "mj-react-form-builder";
import { defaultPayload } from "../types/types";
import Loading from "./Loading";
import EntryListSidebar from "../entries/EntryListSidebar";

const ConferenceForm = () => {
  const { steps, setStepIndex, stepIndex } = useStepContext();
  const { isOpen, extraDetails, setExtraDetails, setIsOpen } =
    useExtraDetails();
  const registrationSource = useRegistrationSource();
  const conferenceId = useContext(ConferenceId);
  const { isLoading, ConferenceOptions } = useRegistrationOptions();
  const { isAdminView, isLoggedIn } = useUserContext();
  const { submitted } = useFormSubmitted();
  const { entryPayload } = useEntryPayload();

  // Handle loading state
  if (isLoading) {
    return <Loading />;
  }

  return ConferenceOptions.status === "Online Registration" ||
    (ConferenceOptions.status === "Kiosk Registration" &&
      registrationSource === "kiosk") ||
    isAdminView ? (
    <NotifyProvider>
      <main className="flex flex-col text-center">
        {/* Form Stepper */}
        <FormStepper stepIndex={stepIndex} setStepIndex={setStepIndex} />

        <Divider className="my-4" />

        {/* Active Step */}
        <section className="min-h-96">
          <Form
            defaultValues={
              entryPayload ?? { ...defaultPayload, conference: conferenceId }
            }
          >
            <div className="gap-4 grid grid-cols-12 align-middle p-5">
              <div
                className={`${
                  isLoggedIn && isAdminView ? "col-span-9" : "col-span-12"
                }`}
              >
                {steps.filter((step) => step.active)[stepIndex].component}
              </div>
              {isLoggedIn && isAdminView && <EntryListSidebar />}
            </div>
            {!submitted && <StepNavigation />}
          </Form>
        </section>

        {/* Extra Details Modal */}
        <Modal
          open={isOpen}
          onClose={() => {
            setExtraDetails("");
            setIsOpen(false);
          }}
          style={{
            zIndex: 9999,
          }}
          disableAutoFocus
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-black rounded-lg shadow-lg w-full max-w-xl">
            {/* Exit Button */}
            <button
              onClick={() => {
                setExtraDetails("");
                setIsOpen(false);
              }}
              className="absolute top-2 right-2 text-2xl text-black transform hover:scale-110 hover:text-gray-400 transition-transform duration-200 ease-in-out"
            >
              &times;
            </button>
            <div className="p-4">
              <div
                className="text-justify fetched-html-content"
                dangerouslySetInnerHTML={{ __html: extraDetails }}
              />
            </div>
          </div>
        </Modal>
      </main>
    </NotifyProvider>
  ) : (
    <div className="h-screen p-3 flex justify-center items-center -mt-20">
      {/* Handle "Kiosk Registration" */}
      {ConferenceOptions.status === "Kiosk Registration" &&
        registrationSource === "online" && (
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              Online Registration is currently closed
            </h1>
            <p className="text-xl mt-2">
              Please go through the kiosk to register
            </p>
            <a
              href={`https://orwa.org/conference-registration?conference_id=${conferenceId}&source=kiosk`}
              className="text-blue-500 underline mt-4 text-xl"
            >
              Go to Kiosk
            </a>
          </div>
        )}

      {/* Handle "Online Registration Closed" or "Coming Soon" */}
      {(ConferenceOptions.status === "Closed" ||
        ConferenceOptions.status === "Archived" ||
        ConferenceOptions.status === "Online Registration Closed" ||
        ConferenceOptions.status === "Coming Soon") && (
        <div className="container mx-auto max-w-3xl px-4 py-8">
          {ConferenceOptions.closed_message ? (
            // <div
            //   className="text-center"
            //   dangerouslySetInnerHTML={{
            //     __html: ConferenceOptions.closed_message,
            //   }}
            // />
            <h1 className="text-xl font-bold text-center max-w-5xl text-wrap">
              {ConferenceOptions.closed_message}
            </h1>
          ) : (
            <h1 className="text-xl font-bold text-center">
              {conferenceId === "1" &&
                "Online registration is closed until February."}
              {conferenceId === "2" &&
                "Online registration is closed, however attendees and additional Vendor Reps can still register at the event for $100 each."}
              {conferenceId === "3" &&
                "Online registration is closed, however attendees and additional Reps can still register at the event for $150 each."}
            </h1>
          )}
        </div>
      )}
    </div>
  );
};

export default ConferenceForm;
