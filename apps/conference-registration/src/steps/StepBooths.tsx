import React, { useContext, useEffect } from "react";
import {
  Divider,
  FormControlLabel,
  FormLabel,
  Modal,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import AddBoothsComponent from "../components/AddBoothsComponent";
import AddBoothModal from "../components/_components/ModalBooth";
import {
  RegistrationOptions,
  useRegistrationSource,
} from "../AppContextProvider";
import { useFormContext } from "react-hook-form";
import { IBoothPayload, IRegistrationOptions } from "../types/types";
import SelectOrganization from "../components/_components/SelectOrganization";
import currencyFormatter from "../helpers/currencyFormat";
import AddExtras from "../components/AddExtras";
import { EmailInput, FormSection, TextInput } from "mj-react-form-builder";
import SkipBoothStep from "../components/SkipBoothStep";
import Loading from "../components/Loading";
import { getExtraData } from "../helpers/getExtraData";

const StepBooths = () => {
  const { ConferenceOptions, ExtraOptions } =
    useContext<IRegistrationOptions>(RegistrationOptions);

  const {
    formState: { errors },
    watch,
    register,
    unregister,
  } = useFormContext();

  const registrationSource = useRegistrationSource();

  const form = useFormContext();

  const [isBoothModalOpen, setIsBoothModalOpen] = React.useState({
    open: false,
    context: "create",
  });

  const memberType = watch("member_status") ?? "";
  const agencyType = watch("agency") ?? "";

  const [boothCheckout, setBoothCheckout] = React.useState<number>(
    agencyType === "false" && memberType === "Non Member"
      ? ConferenceOptions.non_member_fee
      : 0
  );

  // update current steps total price when an booth is added
  const calculateSubtotal = (): number => {
    const registrationExtras = watch("registrationExtras") as
      | number[]
      | undefined;

    if (!registrationExtras || registrationExtras.length === 0) {
      return 0; // Return 0 if there are no extras
    }

    return registrationExtras.reduce((total: number, extra: number) => {
      const currentExtra = getExtraData(ExtraOptions, extra);
      if (!currentExtra) return total; // Skip if the extra is not found
      return (
        total +
        (registrationSource === "kiosk"
          ? currentExtra.price_event
          : currentExtra.price_online)
      );
    }, 0); // Start with an initial total of 0
  };

  useEffect(() => {
    setBoothCheckout(() => {
      const total =
        (watch("booths").reduce((acc: number, booth: IBoothPayload) => {
          return acc + booth.subtotal;
        }, 0) as number) +
        (memberType === "Non Member" && agencyType === "false"
          ? ConferenceOptions.non_member_fee
          : 0);

      return (total + calculateSubtotal()) as number;
    });
  }, [watch("booths"), watch("registrationExtras")]);

  return !ConferenceOptions || !ExtraOptions ? (
    <Loading />
  ) : (
    <>
      <SkipBoothStep />
      <div className="container mx-auto max-w-3xl px-4">
        <FormSection title="Booth Information">
          <div className="grid md:grid-cols-2 gap-4">
            <div title="Booth Information">
              <FormLabel
                sx={{ display: "block", textAlign: "left", fontWeight: 800 }}
              >
                ORWA Associate Member Status
              </FormLabel>
              <RadioGroup value={memberType} aria-label="registration-type">
                <FormControlLabel
                  {...register("member_status", {
                    required: "Member status is required",
                  })}
                  value="Member"
                  control={
                    <Radio
                      onClick={() => {
                        if (agencyType === "false") {
                          setBoothCheckout(
                            boothCheckout - ConferenceOptions.non_member_fee
                          );
                        }
                      }}
                    />
                  }
                  label="Member"
                  checked={form.getValues("member_status") === "Member"}
                />
                <FormControlLabel
                  {...form.register("member_status")}
                  value="Non Member"
                  control={
                    <Radio
                      onClick={() => {
                        if (agencyType === "false") {
                          setBoothCheckout(
                            boothCheckout + ConferenceOptions.non_member_fee
                          )
                        }
                        form.setValue("organization", "");
                        unregister("organization");
                      }}
                    />
                  }
                  label="Non Member"
                  checked={form.getValues("member_status") === "Non Member"}
                />
              </RadioGroup>
              {errors.member_status && (
                <span className="block text-red-500 text-left">
                  *{errors.member_status.message as string}
                </span>
              )}
              {memberType === "Member" && (
                <div>
                  <SelectOrganization />
                  <p className="text-left">
                    <span className="text-red-500">
                      *** If you do not see your company listed, please{" "}
                    </span>
                    <a
                      href="http://orwa.org/new-associate-application/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      feel free to apply
                    </a>
                    <span className="text-green-600"> (SAVE $1000!)</span>
                  </p>
                </div>
              )}
              {memberType === "Non Member" && (
                <div className="my-6">
                  <FormLabel
                    sx={{
                      display: "block",
                      textAlign: "left",
                      fontWeight: 800,
                    }}
                  >
                    Are you an Agency?
                  </FormLabel>
                  <RadioGroup value={agencyType} aria-label="registration-type">
                    <FormControlLabel
                      {...form.register("agency")}
                      value={true}
                      control={
                        <Radio
                          value={true}
                          onClick={() => {
                            if (
                              agencyType === "false" &&
                              memberType === "Non Member"
                            ) {
                              setBoothCheckout(
                                boothCheckout - ConferenceOptions.non_member_fee
                              );
                            }
                          }}
                        />
                      }
                      label="Yes"
                    />
                    <FormControlLabel
                      {...form.register("agency", {
                        required: "Agency is required",
                      })}
                      value={false}
                      control={
                        <Radio
                          value={false}
                          onClick={() => {
                            setBoothCheckout(
                              boothCheckout + ConferenceOptions.non_member_fee
                            );
                          }}
                        />
                      }
                      label="No"
                    />
                  </RadioGroup>
                  <FormLabel sx={{ display: "block", textAlign: "left" }}>
                    {" "}
                    An agency is Rural Development, DEQ, etc.
                  </FormLabel>
                  {errors.agency && (
                    <span className="block text-red-500 text-left">
                      *{errors.agency.message as string}
                    </span>
                  )}
                </div>
              )}
              {memberType === "Non Member" && (
                <div>
                  {agencyType === "false" && (
                    <p className="italic text-slate-700 my-3">
                      <strong className="text-red-600">
                        ${ConferenceOptions.non_member_fee}
                      </strong>{" "}
                      Non-member Fee.
                    </p>
                  )}
                  <TextInput
                    source="organization"
                    label="Organization"
                    required
                  />
                </div>
              )}
            </div>

            <AddBoothsComponent setIsBoothModalOpen={setIsBoothModalOpen} />
            {/* secondary_email */}
            <EmailInput  source="secondary_email" label="Secondary Email" helperText="Used for email notifications" />
          </div>
        </FormSection>
        <AddExtras useYesNo field="registrationExtrasIds" context="Registration" />
        <Typography variant="h6" textAlign={"right"} sx={{ mt: 4 }}>
          Subtotal:
          <strong className="text-red-600">
            {currencyFormatter.format(boothCheckout)}
          </strong>
        </Typography>
        <Divider />
      </div>
      <Modal
        disableAutoFocus
        open={isBoothModalOpen.open}
        onClose={() =>
          setIsBoothModalOpen({
            open: false,
            context: "create",
          })
        }
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <AddBoothModal
            setIsOpen={setIsBoothModalOpen}
            isOpen={isBoothModalOpen}
          />
        </>
      </Modal>
    </>
  );
};

export default StepBooths;
