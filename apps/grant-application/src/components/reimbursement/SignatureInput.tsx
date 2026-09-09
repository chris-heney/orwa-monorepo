import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import SignaturePad from "signature_pad";

interface Props {
  name: string;
  label?: string;
}

/** Touch/mouse signature pad bound to a react-hook-form field (PNG data URL). */
const SignatureInput = ({ name, label = "Authorized signature" }: Props) => {
  const { register, setValue, watch, formState } = useFormContext();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const value = watch(name) as string | undefined;
  const error = (formState.errors as Record<string, { message?: string }>)[name];

  register(name, {
    validate: (v: string) =>
      typeof v === "string" && v.startsWith("data:image/")
        ? true
        : "Please sign the certification.",
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d")?.scale(ratio, ratio);
    const pad = new SignaturePad(canvas, { backgroundColor: "rgba(255,255,255,0)" });
    padRef.current = pad;
    if (value) pad.fromDataURL(value);

    const commit = () => {
      setValue(name, pad.isEmpty() ? "" : pad.toDataURL("image/png"), {
        shouldValidate: true,
        shouldDirty: true,
      });
    };
    pad.addEventListener("endStroke", commit);
    return () => {
      pad.removeEventListener("endStroke", commit);
      pad.off();
    };
    // Only mount once; value is restored on mount, later changes come from the pad itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clear = () => {
    padRef.current?.clear();
    setValue(name, "", { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          {label}: sign in the box below using your mouse or touch screen.
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
        className={`h-[200px] w-full overflow-hidden rounded-lg border-2 bg-white ${
          error ? "border-red-500 bg-red-50" : "border-slate-300"
        }`}
      >
        <canvas
          ref={canvasRef}
          data-testid="signature-canvas"
          style={{ width: "100%", height: "100%", touchAction: "none" }}
        />
      </div>
      {error?.message && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};

export default SignatureInput;
