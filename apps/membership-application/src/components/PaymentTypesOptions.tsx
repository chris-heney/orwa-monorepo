import CardSVG from "./CardSVG";
import InvoiceSVG from "./InvoiceSVG";

interface PaymentTypeOptionsProps {
  paymentType: "Invoice" | "Card" | null;
  checked: "Invoice" | "Card" | null;
  setRegistrationType: React.Dispatch<
    React.SetStateAction<"Card" | "Invoice" | null>
  >;
}

/** Choice tile matching conference-registration's payment selector. */
const PaymentTypeOptions = ({
  paymentType,
  checked,
  setRegistrationType,
}: PaymentTypeOptionsProps) => {
  if (!paymentType) return null;

  const isSelected = checked === paymentType;
  const description =
    paymentType === "Card"
      ? "Pay now with a credit or debit card"
      : "Receive an invoice and pay later";

  return (
    <button
      type="button"
      onClick={() => setRegistrationType(paymentType)}
      aria-pressed={isSelected}
      className={`group flex w-full cursor-pointer flex-col items-center rounded-xl border-2 px-4 py-5 text-center transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isSelected
          ? "border-blue-600 bg-blue-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <div
        className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full ${
          isSelected ? "bg-blue-100" : "bg-slate-100 group-hover:bg-slate-200/80"
        }`}
      >
        <div className="h-8 w-8">
          {paymentType === "Invoice" ? (
            <InvoiceSVG active={isSelected} />
          ) : (
            <CardSVG active={isSelected} />
          )}
        </div>
      </div>
      <span
        className={`text-base font-bold ${
          isSelected ? "text-blue-700" : "text-slate-800"
        }`}
      >
        {paymentType}
      </span>
      <span
        className={`mt-1 text-xs leading-snug ${
          isSelected ? "text-blue-700/80" : "text-slate-500"
        }`}
      >
        {description}
      </span>
      {isSelected && (
        <span className="mt-3 inline-flex items-center rounded-full bg-blue-600 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
          Selected
        </span>
      )}
    </button>
  );
};

export default PaymentTypeOptions;
