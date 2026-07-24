import { useFormContext } from "react-hook-form";
import React, { useEffect } from "react";
import Signature_Pad from "signature_pad";
import { TextInput } from "./_components/TextInput";
import { CheckboxInput } from "./_components/CheckboxInput";
import FormSection from "./_components/FormSection";
import StepShell from "./_components/StepShell";
import { useFormSubmittedContext } from "../providers/AppContextProvider";
import { ValidationHighlight } from "../helpers/validationHighlight";

const SignatureStep = () => {
  const { setValue, watch } = useFormContext();
  const { isFormSubmitted } = useFormSubmittedContext();

  const email = watch("point_of_contact.email");
  const existingSignature = watch("signature");

  const [signaturePad, setSignaturePad] = React.useState<
    Signature_Pad | undefined
  >(undefined);

  const clear = () => {
    if (signaturePad) {
      signaturePad.clear();
      setValue("signature", "");
    }
  };

  const update = () => {
    if (signaturePad) {
      setValue("signature", signaturePad.toDataURL());
    }
  };

  useEffect(() => {
    const readyPad = () => {
      const wrapper = document.getElementById("signature-pad");
      const canvas = wrapper?.querySelector("canvas");
      if (canvas) {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d")?.scale(ratio, ratio);
        const readySignaturePad = new Signature_Pad(canvas);
        setSignaturePad(readySignaturePad);

        if (existingSignature) {
          readySignaturePad.fromDataURL(existingSignature);
        }
      }
    };
    readyPad();
  }, [existingSignature]);

  if (isFormSubmitted) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-8 w-8"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.704 5.004a.75.75 0 011.058 1.058l-8.5 8.5a.75.75 0 01-1.058 0l-4.25-4.25a.75.75 0 011.058-1.058l3.72 3.72 7.972-7.972z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Submission successful
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Thank you — your application has been received.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          A confirmation email will be sent to{" "}
          <span className="font-semibold text-slate-800">{email}</span>.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          If you do not see it, check spam or contact us.
        </p>
      </div>
    );
  }

  return (
    <StepShell
      title="Signature"
      description="Certify the application and provide an authorized signature to submit."
    >
      <ValidationHighlight field="signature">
        <FormSection title="Certification">
          <CheckboxInput
            name="certify"
            label="I certify that, to the best of my knowledge and belief, the information included on and with this Application, including all attachments, are true and correct, and that I agree to abide by the qualifying conditions of the Rural Infrastructure Grant (RIG) program."
            required
          />
        </FormSection>

        <FormSection title="Signatory">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextInput name="signatory_name" label="Name" required />
            <TextInput name="signatory_title" label="Title" required />
          </div>
        </FormSection>

        <FormSection title="Authorized signature">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              Sign in the box below using your mouse or touch screen.
            </p>
            <button
              type="button"
              onClick={clear}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear
            </button>
          </div>
          <div
            id="signature-pad"
            className="h-[290px] w-full overflow-hidden rounded-lg border-2 border-slate-300 bg-white"
          >
            <canvas
              style={{ width: "100%", height: "100%" }}
              onClick={update}
              onDrag={update}
              onTouchStart={update}
              onTouchEnd={update}
            />
          </div>
        </FormSection>
      </ValidationHighlight>
    </StepShell>
  );
};

export default SignatureStep;
