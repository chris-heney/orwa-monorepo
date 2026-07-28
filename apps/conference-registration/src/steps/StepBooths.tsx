import React, { useContext, useEffect } from "react";
import AddBoothsComponent from "../components/AddBoothsComponent";
import AddBoothModal from "../components/_components/ModalBooth";
import {
  RegistrationOptions,
  useBoothIndex,
  useRegistrationSource,
} from "../AppContextProvider";
import { useFormContext } from "react-hook-form";
import { IBoothPayload, IRegistrationOptions } from "../types/types";
import SelectOrganization from "../components/_components/SelectOrganization";
import currencyFormatter from "../helpers/currencyFormat";
import AddExtras from "../components/AddExtras";
import { TextInput } from "mj-react-form-builder";
import SkipBoothStep from "../components/SkipBoothStep";
import Loading from "../components/Loading";
import { getExtraData } from "../helpers/getExtraData";
import { ValidationHighlight } from "../helpers/validationHighlight";

const OptionWrap = ({
  selected,
  onClick,
  children,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  children?: React.ReactNode;
  label: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${
      selected
        ? "border-blue-600 bg-blue-50 text-blue-800"
        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
    }`}
  >
    <span
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
        selected ? "border-blue-600 bg-blue-600" : "border-slate-300 bg-white"
      }`}
      aria-hidden="true"
    >
      {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
    </span>
    <span className="flex-1">{label}</span>
    {children}
  </button>
);

const StepBooths = () => {
  const { ConferenceOptions, ExtraOptions } =
    useContext<IRegistrationOptions>(RegistrationOptions);
  const { boothIndex } = useBoothIndex();

  const {
    formState: { errors },
    watch,
    register,
    unregister,
    setValue,
  } = useFormContext();

  const registrationSource = useRegistrationSource();

  const [isBoothModalOpen, setIsBoothModalOpen] = React.useState({
    open: false,
    context: "create",
  });

  const memberType = watch("member_status") ?? "";
  const agencyType = watch("agency") ?? "";
  const booths = (watch("booths") || []) as IBoothPayload[];
  const registrationExtras = (watch("registrationExtras") || []) as number[];

  const [boothCheckout, setBoothCheckout] = React.useState(0);

  useEffect(() => {
    const boothTotal = booths.reduce(
      (acc: number, booth: IBoothPayload) => acc + (booth.subtotal || 0),
      0
    );
    const extrasTotal = registrationExtras.reduce(
      (total: number, extra: number) => {
        const currentExtra = getExtraData(ExtraOptions, extra);
        if (!currentExtra) return total;
        return (
          total +
          (registrationSource === "kiosk"
            ? currentExtra.price_event
            : currentExtra.price_online)
        );
      },
      0
    );
    const nonMemberFee =
      memberType === "Non Member" && agencyType === "false"
        ? ConferenceOptions.non_member_fee
        : 0;

    setBoothCheckout(boothTotal + extrasTotal + nonMemberFee);
  }, [
    booths,
    registrationExtras,
    memberType,
    agencyType,
    ExtraOptions,
    ConferenceOptions.non_member_fee,
    registrationSource,
  ]);

  const selectMember = (value: "Member" | "Non Member") => {
    if (value === "Non Member" && memberType !== "Non Member") {
      setValue("organization", "");
      unregister("organization");
    }
    setValue("member_status", value, { shouldValidate: true });
  };

  const selectAgency = (value: "true" | "false") => {
    setValue("agency", value, { shouldValidate: true });
  };

  if (!ConferenceOptions || !ExtraOptions) {
    return <Loading />;
  }

  return (
    <>
      <div className="container mx-auto max-w-3xl px-4 py-6 text-left">
        <header className="mb-6 border-b border-slate-200 pb-5">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Booth Information
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Confirm member status and add booths.
          </p>
        </header>

        <SkipBoothStep />

        <ValidationHighlight
          field="member_status"
          className="mb-6 rounded-lg border border-slate-200 bg-white p-5"
          clearWhen={Boolean(memberType)}
        >
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
            ORWA Associate Member Status
          </h3>
          <p className="mb-4 text-sm text-slate-600">
            Member pricing applies to ORWA associate members.
          </p>

          <input
            type="hidden"
            {...register("member_status", {
              required: "Member status is required",
            })}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <OptionWrap
              label="Member"
              selected={memberType === "Member"}
              onClick={() => selectMember("Member")}
            />
            <OptionWrap
              label="Non Member"
              selected={memberType === "Non Member"}
              onClick={() => selectMember("Non Member")}
            />
          </div>

          {errors.member_status && (
            <p className="mt-2 text-sm text-red-500">
              *{errors.member_status.message as string}
            </p>
          )}

          {memberType === "Member" && (
            <div className="mt-5 space-y-2 border-t border-slate-100 pt-5">
              <ValidationHighlight
                field="organization"
                clearWhen={Boolean(watch("organization"))}
              >
                <SelectOrganization />
              </ValidationHighlight>
              <p className="text-sm text-slate-600">
                <span className="text-red-600">
                  *** If you do not see your company listed, please{" "}
                </span>
                <a
                  href="http://orwa.org/new-associate-application/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 underline hover:text-blue-800"
                >
                  feel free to apply
                </a>
                <span className="font-semibold text-green-700">
                  {" "}
                  (SAVE $1000!)
                </span>
              </p>
            </div>
          )}

          {memberType === "Non Member" && (
            <div className="mt-5 space-y-4 border-t border-slate-100 pt-5">
              <ValidationHighlight
                field="agency"
                clearWhen={agencyType === "true" || agencyType === "false"}
              >
                <h4 className="mb-1 text-sm font-semibold text-slate-800">
                  Are you an Agency?
                </h4>
                <p className="mb-3 text-xs text-slate-500">
                  An agency is Rural Development, DEQ, etc.
                </p>
                <input
                  type="hidden"
                  {...register("agency", {
                    validate: (v) =>
                      v === "true" ||
                      v === "false" ||
                      "Agency is required",
                  })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <OptionWrap
                    label="Yes"
                    selected={agencyType === "true"}
                    onClick={() => selectAgency("true")}
                  />
                  <OptionWrap
                    label="No"
                    selected={agencyType === "false"}
                    onClick={() => selectAgency("false")}
                  />
                </div>
                {errors.agency && (
                  <p className="mt-2 text-sm text-red-500">
                    *{errors.agency.message as string}
                  </p>
                )}
              </ValidationHighlight>

              {agencyType === "false" && (
                <>
                  <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    <strong className="tabular-nums text-red-600">
                      {currencyFormatter.format(
                        ConferenceOptions.non_member_fee
                      )}
                    </strong>{" "}
                    non-member fee applies.
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="text-red-600">
                      *** If you do not see your company listed, please{" "}
                    </span>
                    <a
                      href="http://orwa.org/new-associate-application/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 underline hover:text-blue-800"
                    >
                      feel free to apply
                    </a>
                    <span className="font-semibold text-green-700">
                      {" "}
                      (SAVE $1000!)
                    </span>
                  </p>
                </>
              )}

              <ValidationHighlight
                field="organization"
                clearWhen={Boolean(watch("organization"))}
              >
                <TextInput
                  source="organization"
                  label="Organization"
                  required
                />
              </ValidationHighlight>
            </div>
          )}
        </ValidationHighlight>

        <ValidationHighlight
          field="booths"
          className="mb-6 p-2"
          clearWhen={booths.length > 0}
        >
          <section aria-label="Booths">
            <div className="mb-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Booths
              </h3>
            </div>
            <AddBoothsComponent setIsBoothModalOpen={setIsBoothModalOpen} />
          </section>
        </ValidationHighlight>

        <div className="mb-6">
          <AddExtras
            useYesNo
            field="registrationExtrasIds"
            context="Registration"
          />
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
          <span className="text-sm text-slate-500">
            {booths.length === 0
              ? "No booths added yet"
              : `${booths.length} booth${booths.length === 1 ? "" : "s"}`}
          </span>
          <p className="text-lg text-slate-900">
            Subtotal:{" "}
            <span className="font-bold tabular-nums">
              {currencyFormatter.format(boothCheckout)}
            </span>
          </p>
        </div>
      </div>

      {isBoothModalOpen.open && boothIndex !== null && boothIndex >= 0 && (
        <AddBoothModal
          setIsOpen={setIsBoothModalOpen}
          isOpen={isBoothModalOpen}
        />
      )}
    </>
  );
};

export default StepBooths;
