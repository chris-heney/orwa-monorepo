import { useFieldArray, useFormContext } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import currencyFormatter from "../../helpers/currencyFormat";
import { IInvoiceLine } from "../../types/reimbursement";

export const MAX_INVOICE_LINES = 25;

export const emptyInvoiceLine = (): IInvoiceLine => ({
  vendor: "",
  invoice_number: "",
  amount: undefined,
});

export const sumInvoiceLines = (lines: IInvoiceLine[] | undefined): number =>
  Math.round(
    (lines ?? []).reduce(
      (sum, line) =>
        sum + (typeof line?.amount === "number" && Number.isFinite(line.amount) ? line.amount : 0),
      0
    ) * 100
  ) / 100;

const cell =
  "w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2";
const okCell = `${cell} border-slate-300 focus:border-blue-500 focus:ring-blue-500/20`;
const badCell = `${cell} border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/20`;

/**
 * Dynamic "Invoice / Pay Application Details" table: vendor, invoice #, amount.
 * Mirrors the five-row paper form but lets the applicant add up to 25 lines.
 */
const InvoiceLinesInput = () => {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: "invoices" });
  const lines = (watch("invoices") ?? []) as IInvoiceLine[];
  const total = sumInvoiceLines(lines);

  const rowErrors = (errors.invoices ?? []) as Array<
    Record<string, { message?: string }> | undefined
  >;

  return (
    <div>
      <div className="hidden grid-cols-12 gap-2 px-1 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
        <div className="col-span-5">Vendor Invoice Name</div>
        <div className="col-span-3">Invoice #</div>
        <div className="col-span-3">Invoice Amount</div>
        <div className="col-span-1" />
      </div>

      <div className="flex flex-col gap-3">
        {fields.map((field, index) => {
          const err = rowErrors[index];
          return (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-2 rounded-lg border border-slate-200 bg-slate-50/60 p-3 md:border-0 md:bg-transparent md:p-0"
            >
              <div className="col-span-12 md:col-span-5">
                <label className="mb-1 block text-xs font-semibold text-slate-600 md:hidden">
                  Vendor Invoice Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Pipe & Supply"
                  maxLength={120}
                  className={err?.vendor ? badCell : okCell}
                  {...register(`invoices.${index}.vendor`, {
                    required: "Vendor name is required",
                    validate: (v: string) =>
                      v?.trim() ? true : "Vendor name is required",
                  })}
                />
                {err?.vendor?.message && (
                  <p className="mt-1 text-xs text-red-600">{err.vendor.message}</p>
                )}
              </div>
              <div className="col-span-7 md:col-span-3">
                <label className="mb-1 block text-xs font-semibold text-slate-600 md:hidden">
                  Invoice #
                </label>
                <input
                  type="text"
                  placeholder="Invoice or pay app #"
                  maxLength={60}
                  className={err?.invoice_number ? badCell : okCell}
                  {...register(`invoices.${index}.invoice_number`, {
                    required: "Invoice # is required",
                    validate: (v: string) =>
                      v?.trim() ? true : "Invoice # is required",
                  })}
                />
                {err?.invoice_number?.message && (
                  <p className="mt-1 text-xs text-red-600">
                    {err.invoice_number.message}
                  </p>
                )}
              </div>
              <div className="col-span-5 md:col-span-3">
                <label className="mb-1 block text-xs font-semibold text-slate-600 md:hidden">
                  Invoice Amount
                </label>
                <NumericFormat
                  {...register(`invoices.${index}.amount`, {
                    validate: (v: unknown) =>
                      typeof v === "number" && v > 0
                        ? true
                        : "Amount must be greater than $0",
                  })}
                  value={lines[index]?.amount ?? ""}
                  onValueChange={({ floatValue }) =>
                    setValue(`invoices.${index}.amount`, floatValue, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  thousandSeparator=","
                  prefix="$"
                  decimalScale={2}
                  fixedDecimalScale={false}
                  allowNegative={false}
                  inputMode="decimal"
                  placeholder="$0.00"
                  className={`${err?.amount ? badCell : okCell} text-right tabular-nums`}
                />
                {err?.amount?.message && (
                  <p className="mt-1 text-xs text-red-600">{err.amount.message}</p>
                )}
              </div>
              <div className="col-span-12 flex items-start justify-end md:col-span-1 md:items-center">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                  aria-label={`Remove invoice ${index + 1}`}
                  title="Remove this invoice"
                  className="rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm font-medium text-slate-600 hover:border-red-400 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => append(emptyInvoiceLine())}
          disabled={fields.length >= MAX_INVOICE_LINES}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          + Add another invoice
        </button>
        <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-900 px-4 py-2.5 text-white sm:justify-end">
          <span className="text-sm font-medium uppercase tracking-wide text-slate-300">
            Total Amount Paid
          </span>
          <span
            data-testid="invoice-total"
            className="text-lg font-bold tabular-nums"
          >
            {currencyFormatter.format(total)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceLinesInput;
