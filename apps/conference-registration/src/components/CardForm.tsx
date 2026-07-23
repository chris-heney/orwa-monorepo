import { useState } from "react";
import InputMask from "react-input-mask";
import creditCardType from "credit-card-type";
import CardImage from "./CardImage";
import { useFormContext } from "react-hook-form";

const CardForm = () => {
  const {
    register,
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

  const [cardMask, setCardMask] = useState(masks.card.other);
  const [CVVMask, setCVVMask] = useState(masks.cvv.other);

  const fieldClass =
    "h-[48px] w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

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
          <InputMask
            {...register("paymentData.cardNumber", {
              required: "Card number is required",
            })}
            mask={cardMask}
            onKeyUp={(e) => updateMasks(e.currentTarget.value)}
            required
            placeholder="XXXX XXXX XXXX XXXX"
            className={`${fieldClass} pr-12`}
          />
          {errors.card && (
            <span className="mt-1 text-left text-sm text-red-500">
              *{errors.card.message as string}
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

          <InputMask
            {...register("paymentData.expirationDate", {
              required: "Expiration date is required",
            })}
            mask="99/99"
            required
            placeholder="MM/YY"
            className={fieldClass}
          />
          {errors.exp && (
            <span className="mt-1 text-left text-sm text-red-500">
              *{errors.exp.message as string}
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

          <InputMask
            {...register("paymentData.cardCode", {
              required: "CVV is required",
            })}
            mask={CVVMask}
            required
            placeholder="999"
            className={fieldClass}
          />
          {errors.cvv && (
            <span className="mt-1 text-left text-sm text-red-500">
              *{errors.cvv.message as string}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardForm;
