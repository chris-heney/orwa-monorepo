import { AutoCompleteInput, useNotify } from "mj-react-form-builder";
import { useFormContext } from "react-hook-form";
import { useAssociateContext } from "../providers/MembershipContextProvider";
import { Associate } from "../types/AssociateMembership";
import { formatBackendFile } from "../helpers/formatBackendFile";
import { stripStrapiIds } from "../helpers/stripStrapiIds";

const SelectAssociateInput = () => {
  const { associates } = useAssociateContext();
  const path = window.location.hash.substring(2);
  const {
    setValue,
  } = useFormContext();
  const { notify } = useNotify();

  if (!associates) {
    return <div>Loading...</div>;
  }

  const handleWatersystemChange = (watersystemId: string) => {
    const selected = associates.find(
      (ws) => ws.id.toString() === watersystemId
    );
    handleConfirm(selected as Associate);
  };
  const handleConfirm = (selectedAssociate: Associate) => {

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

    // } else {
    //   // If the email doesn't match, display an error
    //   setValue("associate", "");
    //   notify(
    //     "The email you entered does not match the selected associate's email.",
    //     "error"
    //   );
    // }
  };

  return (
    <div className="text-left">
      <AutoCompleteInput
        source="associate"
        label={path === "associate-renewal" ? "Company/Organization" : "Have you ever been a member?"}
        onChange={(id) => {
          handleWatersystemChange(id);
          setValue("associate", id);
        }}
        options={associates.map((watersystem) => ({
          value: watersystem.id.toString(),
          label: watersystem.name,
        }))}       
        helperText={path === "associate-renewal" ? "Select your company/organization" : "Select your company/organization to renew your membership"}
        required={path === "associate-renewal" ? true : false}
      />

      {/* Modal for email confirmation
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 transform transition-all duration-300 ease-in-out scale-105">
            <h2 className="bg-black text-white p-2 text-xl font-semibold text-left rounded-t-lg">
              Confirm Associate
            </h2>
            <div className="p-6">
              <p className="mb-6 text-gray-600 text-base">
                Enter your email for{" "}
                {
                  associates.find((ws) => ws.id.toString() === associateId)
                    ?.name
                }{" "}
                to confirm that you can renew the membership.
              </p>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                }}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                placeholder="Enter system's email"
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all"
                  onClick={() =>
                    handleConfirm(
                      associates.find(
                        (as) => as.id.toString() === associateId
                      ) as Associate
                    )
                  }
                >
                  Confirm
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-all"
                  onClick={() => {
                    setModalOpen(false);
                    setValue("associate", "");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          {errors["associate"] && (
            <p className="text-red-500 text-sm mt-1 text-left">{`${errors["associate"]?.message}*`}</p>
          )}
        </div>
      )} */}
    </div>
  );
};

export default SelectAssociateInput;
