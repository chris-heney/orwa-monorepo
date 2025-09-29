import React, { useEffect } from "react";
import { NumberInput, useDataProvider } from "react-admin";
import { useFormContext } from "react-hook-form";

const CalculateSponsorCost = () => {
  const { watch, setValue } = useFormContext();
  const sponsorItems = watch("sponsorship_items") || [];
  const dataProvider = useDataProvider();

  useEffect(() => {
    const fetchAndCalculateAmount = async () => {
      try {
        const total = await calculateAmount();
        setValue("amount", total); // Update the `amount` field
      } catch (error) {
        console.error("Error calculating sponsor amount:", error);
      }
    };

    fetchAndCalculateAmount();
}, [JSON.stringify(sponsorItems)]); // Track changes in the entire array content

  const calculateAmount = async () => {
    let total = 0;

    try {
      const { data: sponsorships } = await dataProvider.getList(
        "conference-sponsorships",
        {
          pagination: { page: 1, perPage: 100 },
          sort: { field: "name", order: "ASC" },
          filter: {},
        }
      );

      sponsorItems.forEach((item: any) => {
        const sponsorship = sponsorships.find(
          (s: any) => s.id === item.sponsorship
        );
        total += sponsorship?.amount || 0; // Add sponsorship amount if found
      });
    } catch (error) {
      console.error("Error fetching sponsorships:", error);
    }

    return total; // Ensure a value is always returned
  };

  return (
    <NumberInput
      source="amount"
      label="Amount"
      fullWidth
      helperText="This value is calculated automatically based on selected sponsorship items."
    />
  );
};

export default CalculateSponsorCost;