import React, { useEffect } from "react";
import { NumberInput, useDataProvider } from "react-admin";
import { useFormContext } from "react-hook-form";
import { findSponsorshipCatalogRow } from "./helpers/sponsorWritePayload";
import { useConferenceContext } from "../ConferenceContext";

const CalculateSponsorCost = () => {
  const { watch, setValue } = useFormContext();
  const sponsorItems = watch("sponsorship_items") || [];
  const dataProvider = useDataProvider();
  const { currentFilter } = useConferenceContext();

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
          filter: { conference: currentFilter.conference },
        }
      );

      sponsorItems.forEach((item: { sponsorship?: unknown; value?: number | string }) => {
        const sponsorship = findSponsorshipCatalogRow(
          sponsorships,
          item.sponsorship
        );
        const amount = Number(sponsorship?.amount ?? item.value ?? 0);
        total += Number.isFinite(amount) ? amount : 0;
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