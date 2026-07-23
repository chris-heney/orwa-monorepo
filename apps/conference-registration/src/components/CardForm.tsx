import { useState, ChangeEvent } from "react";
import creditCardType from "credit-card-type";
import CardImage from "./CardImage";
import { Controller, useFormContext } from "react-hook-form";

/** Apply a `9`-digit mask (e.g. `9999 9999 9999 9999`) without react-input-mask. */
const applyDigitMask = (raw: string, mask: string): string => {
  const digits = raw.replace(/\D/g, "");
  let digitIndex = 0;
  let result = "";

  for (const char of mask) {
    if (char === "9") {
      if (digitIndex >= digits.length) break;
      result += digits[digitIndex++];
    } else if (digitIndex < digits.length) {
      // Insert separators only once the next digit exists (e.g. "12" → "12", "123" → "12/3")
      result += char;
    } else {
      break;
    }
  }

  return result;
};

const CardForm = () => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const returnCardType = (value: string) => {
    if (!value) return;
    return creditCardType(value)[0]?.type;
  };

  const masks = {
    card: {
      other: "9999 9999 9999 9999",
      "american-express": "9999 999999 99999",
    },
    cvv: {
      other: "999",
      "american-express": "9999",
    },
  };

  const [cardMask, setCardMask] = useState(masks.card.other);
  const [CVVMask, setCVVMask] = useState(masks.cvv.other);

  const updateMasks = (value: string) => {
    if (!value) return;

    if (value.startsWith("3")) {
      setCardMask(masks.card["american-express"]);
      setCVVMask(masks.cvv["american-express"]);
    } else {
      setCardMask(masks.card.other);
      setCVVMask(masks.cvv.other);
    }
  };

  const fieldClass =
    "h-[48px] w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

  const cardNumberError =
    (errors.paymentData as { cardNumber?: { message?: string } } | undefined)
      ?.cardNumber?.message ??
    (errors.card?.message as string | undefined);
  const expirationError = (
    errors.paymentData as { expirationDate?: { message?: string } } | undefined
  )?.expirationDate?.message;
  const cvvError = (
    errors.paymentData as { cardCode?: { message?: string } } | undefined
  )?.cardCode?.message;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col">
        <label
          className="mb-1.5 text-sm font-medium text-slate-700"
          htmlFor="cardNumber"
        >
          Card number
        </label>

        <div className="relative block">
          <Controller
            name="paymentData.cardNumber"
            control={control}
            rules={{ required: "Card number is required" }}
            render={({ field }) => (
              <input
                {...field}
                id="cardNumber"
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                required
                placeholder="XXXX XXXX XXXX XXXX"
                className={`${fieldClass} pr-12`}
                value={field.value ?? ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const nextMask = e.target.value.startsWith("3")
                    ? masks.card["american-express"]
                    : masks.card.other;
                  const masked = applyDigitMask(e.target.value, nextMask);
                  updateMasks(masked);
                  field.onChange(masked);
                }}
              />
            )}
          />
          {cardNumberError && (
            <span className="mt-1 text-left text-sm text-red-500">
              *{cardNumberError}
            </span>
          )}

          <span className="absolute inset-y-0 right-3 flex items-center">
            <span className="flex h-6 w-[34px] items-center justify-center rounded border border-slate-200 bg-white">
              <CardImage
                type={
                  returnCardType(watch("paymentData.cardNumber")) as string
                }
              />
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label
            className="mb-1.5 text-sm font-medium text-slate-700"
            htmlFor="expirationDate"
          >
            Expiry date
          </label>

          <Controller
            name="paymentData.expirationDate"
            control={control}
            rules={{ required: "Expiration date is required" }}
            render={({ field }) => (
              <input
                {...field}
                id="expirationDate"
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                required
                placeholder="MM/YY"
                className={fieldClass}
                value={field.value ?? ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  field.onChange(applyDigitMask(e.target.value, "99/99"));
                }}
              />
            )}
          />
          {expirationError && (
            <span className="mt-1 text-left text-sm text-red-500">
              *{expirationError}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label
            className="mb-1.5 text-sm font-medium text-slate-700"
            htmlFor="cardCode"
          >
            CVC / CVV
          </label>

          <Controller
            name="paymentData.cardCode"
            control={control}
            rules={{ required: "CVV is required" }}
            render={({ field }) => (
              <input
                {...field}
                id="cardCode"
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                required
                placeholder={CVVMask.length === 4 ? "9999" : "999"}
                className={fieldClass}
                value={field.value ?? ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  field.onChange(applyDigitMask(e.target.value, CVVMask));
                }}
              />
            )}
          />
          {cvvError && (
            <span className="mt-1 text-left text-sm text-red-500">
              *{cvvError}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardForm;
