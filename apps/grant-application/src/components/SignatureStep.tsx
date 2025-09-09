import { useFormContext } from "react-hook-form";
import { Box, Button } from "@mui/material";
import React, { useEffect } from "react";
import Signature_Pad from "signature_pad";
import { TextInput } from "./_components/TextInput";
import { CheckboxInput } from "./_components/CheckboxInput";
import { useFormSubmittedContext } from "../providers/AppContextProvider";

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

        // Load existing signature if available
        if (existingSignature) {
          readySignaturePad.fromDataURL(existingSignature);
        }
      }
    };
    readyPad();
  }, [existingSignature]);

  return isFormSubmitted ? (
    <div className="max-w-md mx-auto text-center">
       <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="green"          
          className="max-w-60 mx-auto"
        >
          <path
            fillRule="evenodd"
            d="M16.704 5.004a.75.75 0 011.058 1.058l-8.5 8.5a.75.75 0 01-1.058 0l-4.25-4.25a.75.75 0 011.058-1.058l3.72 3.72 7.972-7.972z"
            clipRule="evenodd"
          />
        </svg>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Submission Successful
      </h2>
      <p className="text-gray-600 mb-4">Thank you for your submission! Your application has been successfully received.</p>
      <p className="text-gray-600">
        You will receive a confirmation email at{" "}
        <span className="font-semibold">{email}</span>.
      </p>
      <p className="text-gray-600 mt-2">
        If you do not see it, please check your spam folder or contact us.
      </p>
    </div>
  ) : (
    <div className="container mx-auto max-w-3xl px-2 py-2">
      <div className="mb-4">
        <label className="block text-gray-700 mb-1 text-left">Certify</label>
        <div className="mb-2 p-4 border rounded border-gray-300">
          <CheckboxInput
            name="certify"
            label="I certify that, to the best of my knowledge and belief, the information included on and with this Application, including all attachments, are true and correct, and that I agree to abide by the qualifying conditions of the Rural Infrastructure Grant (RIG) program."
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <Box display="flex" gap={4}>
          <div className="flex-1">
            <TextInput name="signatory_name" label="Name" required />
          </div>
          <div className="flex-1">
            <TextInput name="signatory_title" label="Title" required />
          </div>
        </Box>
      </div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <label className="text-gray-700 text-left">Authorized Signature</label>
        <Button onClick={clear}>Clear Signature</Button>
      </Box>
      <Box
        id="signature-pad"
        style={{
          width: "100%",
          height: 290,
          border: "3px solid",
          borderRadius: 10,
          backgroundColor: "white",
        }}
      >
        <canvas
          style={{ width: "100%", height: "100%" }}
          onClick={update}
          onDrag={update}
          onTouchStart={update}
          onTouchEnd={update}
        />
      </Box>
    </div>
  );
};

export default SignatureStep;
