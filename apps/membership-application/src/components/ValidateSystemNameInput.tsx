import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useWatersystemContext } from "../providers/MembershipContextProvider";
import { TextInput, useNotify } from "mj-react-form-builder";
import { useNavigate } from "react-router";

const ValidateSystemNameInput = () => {
  const { watersystems } = useWatersystemContext();
  const { watch, setValue } = useFormContext();
  const navigate = useNavigate();
  const { notify } = useNotify();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (name: string) => {
    const system = watersystems.find(
      (ws) => ws.name.toLowerCase() === name.toLowerCase()
    );
    if (system) {
      setIsModalOpen(true);
    }
  };

  const findSystem = (name: string) => {
    return watersystems.find(
      (ws) => ws.name.toLowerCase() === name.toLowerCase()
    );
  };

  const handleConfirm = () => {
    const selectedWatersystem = findSystem(watch("name"));

    if (!selectedWatersystem) {
      notify("System not found", "error");
      return;
    }

    // If email matches, update all relevant fields and close the modal
    setValue("watersystem", selectedWatersystem.id.toString());
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

  useEffect(() => {
    if (watch("name")) {
      handleChange(watch("name"));
    }
  }, [watch("name")]);

  return (
    <div className="relative w-full">
      <TextInput
        label="Name"
        source="name"
        helperText="This is how your water utility is commonly referred to."
        required
      />

{isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center w-96 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              🚨 System Already Exists
            </h2>

            <p className="text-gray-600 mb-5 leading-6">
              It appears you are already a member. Follow the link below to renew
              your membership.
            </p>

            <a
              onClick={() => {
                handleConfirm();
                navigate("/watersystem-renewal");
              }}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-transform duration-200 transform hover:scale-105 cursor-pointer"
            >
              Renew Membership
            </a>

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-transform duration-200 transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidateSystemNameInput;
