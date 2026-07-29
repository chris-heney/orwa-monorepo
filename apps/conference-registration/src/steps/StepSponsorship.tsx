import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import currencyFormatter from "../helpers/currencyFormat";
import { ISponsorshipOption } from "../types/types";
import { useRegistrationOptions } from "../AppContextProvider";
import { FileInput, TextInput } from "mj-react-form-builder";
import SelectOrganization from "../components/_components/SelectOrganization";
import { ValidationHighlight } from "../helpers/validationHighlight";

/** Web-friendly raster/vector images only — excludes PDF and other docs. */
const WEB_IMAGE_ACCEPT =
  "image/jpeg,image/png,image/gif,image/webp,image/svg+xml,.jpg,.jpeg,.png,.gif,.webp,.svg";
const WEB_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]);
const WEB_IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp|svg)$/i;

const parseAmount = (raw: string): number => {
  const n = parseFloat(raw.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : NaN;
};

const StepSponsorship = () => {
  const { SponsorshipOptions } = useRegistrationOptions();
  const { watch, setValue, control } = useFormContext();
  const { append, replace } = useFieldArray({
    control,
    name: "sponsors",
  });
  const logoUploadRef = useRef<HTMLDivElement>(null);

  const sponsors = watch("sponsors") || [];
  const hasSelectedSponsors = sponsors.length > 0;

  // Draft custom amounts (keyed by sponsorship id), pre-filled with catalog minimum.
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      for (const option of SponsorshipOptions) {
        if (option.allow_custom_amount) {
          initial[String(option.id)] = String(option.amount ?? "");
        }
      }
      return initial;
    }
  );

  useEffect(() => {
    setCustomAmounts((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const option of SponsorshipOptions) {
        if (!option.allow_custom_amount) continue;
        const key = String(option.id);
        if (next[key] === undefined) {
          next[key] = String(option.amount ?? "");
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [SponsorshipOptions]);

  // mj-react-form-builder FileInput hardcodes accept="*/*"; constrain the picker here.
  useEffect(() => {
    if (!hasSelectedSponsors) return;
    const input = logoUploadRef.current?.querySelector<HTMLInputElement>(
      'input[type="file"]'
    );
    if (input) {
      input.accept = WEB_IMAGE_ACCEPT;
    }
  }, [hasSelectedSponsors]);

  const getSelectedCount = (sponsorshipId: number | string) =>
    sponsors.filter((s: ISponsorshipOption) => s.id === sponsorshipId).length;

  const isSelected = (sponsorshipId: number | string) =>
    getSelectedCount(sponsorshipId) > 0;

  const resolveAmount = (sponsorship: ISponsorshipOption): number => {
    if (!sponsorship.allow_custom_amount) {
      return Number(sponsorship.amount) || 0;
    }
    const draft = customAmounts[String(sponsorship.id)];
    const parsed = parseAmount(draft ?? String(sponsorship.amount ?? ""));
    return Number.isFinite(parsed) ? parsed : Number(sponsorship.amount) || 0;
  };

  const buildSponsorEntry = (
    sponsorship: ISponsorshipOption
  ): ISponsorshipOption => ({
    ...sponsorship,
    amount: resolveAmount(sponsorship),
    max_purchasable: sponsorship.allow_custom_amount
      ? 1
      : sponsorship.max_purchasable,
  });

  const handleSponsorshipChange =
    (sponsorship: ISponsorshipOption) => (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        append(buildSponsorEntry(sponsorship));
      } else {
        setValue(
          "sponsors",
          sponsors.filter((s: ISponsorshipOption) => s.id !== sponsorship.id)
        );
      }
    };

  const handleRowToggle = (sponsorship: ISponsorshipOption) => {
    if (isSelected(sponsorship.id)) {
      setValue(
        "sponsors",
        sponsors.filter((s: ISponsorshipOption) => s.id !== sponsorship.id)
      );
    } else {
      append(buildSponsorEntry(sponsorship));
    }
  };

  const handleQuantityChange =
    (sponsorship: ISponsorshipOption) => (e: ChangeEvent<HTMLInputElement>) => {
      if (sponsorship.allow_custom_amount) return;

      const quantity = Math.max(
        1,
        Math.min(
          Math.min(sponsorship.available, sponsorship.max_purchasable),
          parseInt(e.target.value || "1", 10) || 1
        )
      );

      const updatedSponsors = sponsors.filter(
        (s: ISponsorshipOption) => s.id !== sponsorship.id
      );
      const newSponsors = Array(quantity).fill(buildSponsorEntry(sponsorship));
      replace([...updatedSponsors, ...newSponsors]);
    };

  const handleCustomAmountChange =
    (sponsorship: ISponsorshipOption) => (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const key = String(sponsorship.id);
      setCustomAmounts((prev) => ({ ...prev, [key]: raw }));

      if (!isSelected(sponsorship.id)) return;

      const parsed = parseAmount(raw);
      const amount = Number.isFinite(parsed)
        ? parsed
        : Number(sponsorship.amount) || 0;

      const updated = sponsors.map((s: ISponsorshipOption) =>
        s.id === sponsorship.id ? { ...s, amount } : s
      );
      setValue("sponsors", updated, { shouldDirty: true });
    };

  const calculateSubtotal = () =>
    sponsors.reduce(
      (total: number, sponsor: ISponsorshipOption) =>
        total + (Number(sponsor.amount) || 0),
      0
    );

  const sponsorshipAvailable = SponsorshipOptions.filter(
    (sponsorship) => sponsorship.available > 0
  );

  const validateImageFile = (file: File) => {
    if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) {
      return "PDFs are not accepted. Please upload a JPEG, PNG, GIF, WebP, or SVG image.";
    }
    const typeOk = WEB_IMAGE_TYPES.has(file.type);
    const extensionOk = WEB_IMAGE_EXTENSIONS.test(file.name);
    if (!typeOk && !extensionOk) {
      return "Only web image files are allowed (JPEG, PNG, GIF, WebP, or SVG). PDFs are not accepted.";
    }
    return true;
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 text-left">
      <header className="mb-6 border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Conference Sponsorships
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 max-w-2xl">
          Optional — select any packages you want to purchase, or click Next to
          continue without sponsoring.
        </p>
      </header>

      {sponsorshipAvailable.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
          <p className="text-lg font-semibold text-slate-500">
            No sponsorship packages available at this time
          </p>
        </div>
      ) : (
        <section aria-label="Available sponsorship packages">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Available packages
            </h3>
            <span className="text-xs text-slate-400">
              {sponsorshipAvailable.length} option
              {sponsorshipAvailable.length === 1 ? "" : "s"}
            </span>
          </div>

          <ValidationHighlight
            field="sponsorships"
            className="overflow-hidden rounded-lg border border-slate-200 bg-white"
          >
            <ul className="divide-y divide-slate-200">
              {sponsorshipAvailable.map((sponsorship) => {
                const selected = isSelected(sponsorship.id);
                const quantity = getSelectedCount(sponsorship.id) || 1;
                const showQuantity =
                  !sponsorship.allow_custom_amount &&
                  sponsorship.max_purchasable > 1;
                const amountFieldId = `sponsor-amount-${sponsorship.id}`;
                const draftRaw =
                  customAmounts[String(sponsorship.id)] ??
                  String(sponsorship.amount ?? "");
                const draftAmount = parseAmount(draftRaw);
                const amountBelowMin =
                  sponsorship.allow_custom_amount &&
                  selected &&
                  (!Number.isFinite(draftAmount) ||
                    draftAmount < Number(sponsorship.amount));

                return (
                  <li key={sponsorship.id}>
                    <div
                      className={`grid grid-cols-1 gap-3 px-4 py-4 transition-colors sm:grid-cols-[auto_1fr_auto] sm:items-start sm:gap-4 ${
                        selected ? "bg-blue-50/70" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-3 sm:contents">
                        <label className="flex cursor-pointer items-start pt-0.5 sm:pt-1">
                          <input
                            type="checkbox"
                            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            checked={selected}
                            onChange={handleSponsorshipChange(sponsorship)}
                            aria-label={`Select ${sponsorship.name}`}
                          />
                        </label>

                        <button
                          type="button"
                          className="min-w-0 flex-1 text-left"
                          onClick={() => handleRowToggle(sponsorship)}
                        >
                          <span className="block font-semibold text-slate-900">
                            {sponsorship.name}
                          </span>
                          {sponsorship.description ? (
                            <span className="mt-1 block text-sm leading-snug text-slate-600">
                              {sponsorship.description}
                            </span>
                          ) : null}
                        </button>
                      </div>

                      <div
                        className="flex min-w-[8.5rem] flex-wrap items-center justify-between gap-x-4 gap-y-2 pl-7 sm:flex-col sm:items-end sm:justify-start sm:gap-2 sm:pl-0 sm:pt-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {sponsorship.allow_custom_amount ? (
                          <label
                            htmlFor={amountFieldId}
                            className="flex flex-col items-stretch gap-1 sm:items-end"
                          >
                            <span className="text-xs font-medium text-slate-500">
                              Amount (min{" "}
                              {currencyFormatter.format(sponsorship.amount)})
                            </span>
                            <div className="relative">
                              <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-sm text-slate-500">
                                $
                              </span>
                              <input
                                id={amountFieldId}
                                type="number"
                                min={sponsorship.amount}
                                step="0.01"
                                inputMode="decimal"
                                value={draftRaw}
                                onChange={handleCustomAmountChange(sponsorship)}
                                className={`w-28 rounded border bg-white py-1 pl-6 pr-2 text-right text-sm font-bold tabular-nums text-slate-900 focus:outline-none focus:ring-1 ${
                                  amountBelowMin
                                    ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500"
                                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                }`}
                                aria-label={`Donation amount for ${sponsorship.name}`}
                              />
                            </div>
                          </label>
                        ) : (
                          <span className="text-base font-bold tabular-nums text-slate-900">
                            {currencyFormatter.format(sponsorship.amount)}
                          </span>
                        )}

                        {showQuantity && (
                          <label
                            className={`flex items-center gap-2 text-sm text-slate-600 ${
                              selected ? "" : "opacity-50"
                            }`}
                          >
                            <span className="whitespace-nowrap">Qty</span>
                            <input
                              type="number"
                              min={1}
                              max={Math.min(
                                sponsorship.available,
                                sponsorship.max_purchasable
                              )}
                              disabled={!selected}
                              value={quantity}
                              onChange={handleQuantityChange(sponsorship)}
                              className="w-16 rounded border border-slate-300 bg-white px-2 py-1 text-center text-sm tabular-nums text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </ValidationHighlight>
        </section>
      )}

      {hasSelectedSponsors && (
        <ValidationHighlight
          field="sponsor_details"
          className="mt-8 rounded-lg border border-slate-200 bg-slate-50/80 p-5"
          clearWhen={Boolean(watch("organization") && watch("logo"))}
        >
          <h3 className="mb-1 text-base font-semibold text-slate-900">
            Sponsor organization details
          </h3>
          <p className="mb-4 text-sm text-slate-600">
            Provide the organization name and logo that should appear with your
            sponsorship.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
            <ValidationHighlight
              field="organization"
              className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4"
              clearWhen={Boolean(watch("organization"))}
            >
              <SelectOrganization updateLogo required={false} />
              <div className="flex items-center gap-3 py-1">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-xs uppercase tracking-wide text-slate-400">
                  or
                </span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <TextInput
                source="organization"
                label="Enter Organization Name"
                required
              />
            </ValidationHighlight>

            <div
              ref={logoUploadRef}
              className="sponsor-logo-upload rounded-md border border-slate-200 bg-white p-4"
            >
              <FileInput
                required
                source="logo"
                label="Logo"
                helperText="Upload a web image logo (JPEG, PNG, GIF, WebP, or SVG). PDFs are not accepted."
                validate={validateImageFile}
              />
            </div>
          </div>
        </ValidationHighlight>
      )}

      <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
        <span className="text-sm text-slate-500">
          {hasSelectedSponsors
            ? `${sponsors.length} package${sponsors.length === 1 ? "" : "s"} selected`
            : "No packages selected"}
        </span>
        <p className="text-lg text-slate-900">
          Subtotal:{" "}
          <span className="font-bold tabular-nums">
            {currencyFormatter.format(calculateSubtotal())}
          </span>
        </p>
      </div>
    </div>
  );
};

export default StepSponsorship;
