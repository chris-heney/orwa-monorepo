import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { TextInput, useNotify } from "mj-react-form-builder";
import { useNavigate } from "react-router";
import { useAssociateContext } from "../providers/MembershipContextProvider";
import { formatBackendFile } from "../helpers/formatBackendFile";
import { stripStrapiIds } from "../helpers/stripStrapiIds";

const ValidateAssociateNameInput = () => {
  const { associates } = useAssociateContext();
  const { watch, setValue } = useFormContext();
  const navigate = useNavigate();
  const { notify } = useNotify();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (name: string) => {
    const system = associates.find(
      (ws) => ws.name.toLowerCase() === name.toLowerCase()
    );
    if (system) {
      setIsModalOpen(true);
    }
  };

  const findSystem = (name: string) => {
    return associates.find(
      (ws) => ws.name.toLowerCase() === name.toLowerCase()
    );
  };

  const handleConfirm = () => {
    const selectedAssociate = findSystem(watch("name"));

    if (!selectedAssociate) {
      notify("Associate not found", "error");
      return;
    }

    setValue("associate", selectedAssociate.id.toString());

    setValue(
      "membership_directory_type",
      selectedAssociate.membership_directory_type || ""
    );
    setValue("category", selectedAssociate.category || "");

    setValue("name", selectedAssociate.name);
    setValue("phone", selectedAssociate.phone || "");
    setValue("website", selectedAssociate.website || "");
    setValue("total_years", selectedAssociate.total_years || 0);
    setValue("email", selectedAssociate.email || "");

    setValue(
      "mailing_address_street",
      selectedAssociate.mailing_address_street || ""
    );
    setValue(
      "mailing_address_city",
      selectedAssociate.mailing_address_city || ""
    );
    setValue(
      "mailing_address_state",
      selectedAssociate.mailing_address_state || ""
    );
    setValue(
      "membership",
      selectedAssociate.membership ? selectedAssociate.membership.id : ""
    );

    setValue(
      "fee_membership",
      selectedAssociate.membership ? selectedAssociate.membership.price : 0
    );

    setValue("mailing_address_zip", selectedAssociate.mailing_address_zip);
    setValue("address_street", selectedAssociate.address_street);
    setValue("address_city", selectedAssociate.address_city);
    setValue("address_state", selectedAssociate.address_state);
    setValue("address_zip", selectedAssociate.address_zip);

    const formattedLogo = selectedAssociate.logo
      ? selectedAssociate.logo.map((logo) => {
          return formatBackendFile(logo);
        })
      : null;

    setValue("logo", formattedLogo);

    const formattedPrimaryAd = selectedAssociate.primary_ad
      ? [formatBackendFile(selectedAssociate.primary_ad)]
      : null;

    // Update form values, including the formatted primary_ad
    setValue("primary_ad", formattedPrimaryAd);

    setValue(
      "contact_primary",
      selectedAssociate?.contact_primary
        ? stripStrapiIds(selectedAssociate.contact_primary)
        : null
    );

    setValue(
      "contact_secondary",
      selectedAssociate?.contact_secondary
        ? stripStrapiIds(selectedAssociate.contact_secondary)
        : null
    );
    setValue(
      "payment_last_date",
      selectedAssociate.payment_last_date &&
        selectedAssociate.payment_last_date !== ""
        ? selectedAssociate.payment_last_date
        : null
    );

    // setModalOpen(false); // Close the modal
    notify("Associate confirmed successfully", "success");
  };

  useEffect(() => {
    if (watch("name")) {
      handleChange(watch("name"));
    }
  }, [watch("name")]);

  return (
    <div className="relative w-full">
      <TextInput
        label="Company or Organization Name"
        source="name"
        helperText="Please enter the name of your company or organization"
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
              🚨 Company or Organization is Already a Member
            </h2>

            <p className="text-gray-600 mb-5 leading-6">
              It appears you are already a member. Follow the link below to
              renew your membership.
            </p>

            <a
              onClick={() => {
                handleConfirm();
                navigate("/associate-renewal");
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

export default ValidateAssociateNameInput;
