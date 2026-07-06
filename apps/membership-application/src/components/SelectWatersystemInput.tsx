import {  AutoCompleteInput, useNotify } from "mj-react-form-builder";
import { useFormContext } from "react-hook-form";
import { useWatersystemContext } from "../providers/MembershipContextProvider";
import { Watersystem } from "../types/WatersystemMebership";

const SelectWatersystem = () => {
  const { watersystems } = useWatersystemContext();
  const path = window.location.hash.substring(2);
  const {
    setValue,
  } = useFormContext();
  const { notify } = useNotify();

  if (!watersystems) {
    return <div>Loading...</div>;
  }
  //  register the input

  const handleWatersystemChange = (watersystemId: string) => {
    const selected = watersystems.find(
      (ws) => ws.id.toString() === watersystemId
    );

    handleConfirm(selected as Watersystem);
  };
  const handleConfirm = (selectedWatersystem: Watersystem) => {
    // If email matches, update all relevant fields and close the modal
    setValue("legal_entitiy_name", selectedWatersystem.legal_entity_name);
    setValue("name", selectedWatersystem.name);
    setValue("region", selectedWatersystem.region || "");
    setValue("office_hours", selectedWatersystem.office_hours || "");
    setValue("meters", selectedWatersystem.meters);
    setValue("url", selectedWatersystem.url || "");
    setValue("board_meeting", selectedWatersystem.board_meeting || "");
    setValue("funding", selectedWatersystem.funding || false);
    setValue("orwaag", selectedWatersystem.orwaag || false);
    setValue("county", selectedWatersystem.county || "");
    setValue("total_years", selectedWatersystem.total_years || 0);
    setValue("member_type", selectedWatersystem.member_type || "");
    setValue(
      "system_type_dirty",
      // Convert stored string values to an array and filter out duplicates
      selectedWatersystem.system_type_dirty
        ? Array.from(
            new Set(
              selectedWatersystem.system_type_dirty
                .split(",")
                .map((type) => type.trim())
            )
          )
        : []
    );
    setValue("email", selectedWatersystem.email || "");
    setValue("phone", selectedWatersystem.phone || "");
    setValue("fax", selectedWatersystem.fax || "");
    setValue(
      "address_mailing_pobox",
      selectedWatersystem.address_mailing_pobox || ""
    );
    setValue(
      "address_mailing_city",
      selectedWatersystem.address_mailing_city || ""
    );
    setValue(
      "address_mailing_state",
      selectedWatersystem.address_mailing_state || ""
    );
    setValue(
      "address_mailing_zip",
      selectedWatersystem.address_mailing_zip || ""
    );
    setValue(
      "address_physical_line1",
      selectedWatersystem.address_physical_line1 || ""
    );
    setValue(
      "address_physical_line2",
      selectedWatersystem.address_physical_line2 || ""
    );
    setValue(
      "address_physical_city",
      selectedWatersystem.address_physical_city || ""
    );
    setValue(
      "address_physical_state",
      selectedWatersystem.address_physical_state || ""
    );
    setValue(
      "address_physical_zip",
      selectedWatersystem.address_physical_zip || ""
    );
    setValue(
      "membership_directory_type",
      selectedWatersystem.membership_directory_type || ""
    );
    setValue("payment_method", selectedWatersystem.payment_method || "");
    setValue("payment_amount", selectedWatersystem.payment_amount || 0);
    setValue("fee_connections", selectedWatersystem.fee_connections || 0);
    setValue("fee_membership", selectedWatersystem.fee_membership || 0);

    setValue(
      "payment_last_date",
      selectedWatersystem.payment_last_date &&
        selectedWatersystem.payment_last_date !== ""
        ? selectedWatersystem.payment_last_date
        : null
    );

    setValue("legal_entity_name", selectedWatersystem.legal_entity_name || "");
    notify("Watersystem confirmed successfully", "success");
  };

  return (
    <AutoCompleteInput
      source="watersystem"
      label={path === "watersystem-renewal" ? "Watersystem" : "Have you ever been a member?"}
      helperText={path === "watersystem-renewal" ? "Select your watersystem from the dropdown" : "Select your watersystem to renew your membership"}
      onChange={(id) => {
        handleWatersystemChange(id);
        setValue("watersystem", id);
      }}
      options={watersystems.map((watersystem) => ({
        value: watersystem.id.toString(),
        label: watersystem.name,
      }))}
      required={path === "watersystem-renewal" ? true : false}
    />
  );
};

export default SelectWatersystem;
