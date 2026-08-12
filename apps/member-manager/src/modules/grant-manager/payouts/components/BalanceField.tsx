import React from "react";
import {
  DataProvider,
  Identifier,
  Loading,
  NumberField,
  useGetOne,
} from "react-admin";
import { computeBalance } from "../helpers/payoutAmounts";

export { computeBalance, isAwardPaidInFull } from "../helpers/payoutAmounts";

// Nested populate so `type` and `payout_status.name` are available for
// award-balance math (admin draws and rejected requests must not count).
const BALANCE_META = { raw: true, populate: { payouts: "*" } };

const BalanceField = ({ applicationId }: { applicationId: Identifier }) => {
  const { data: application, isLoading } = useGetOne(
    "grant-application-finals",
    { id: applicationId, meta: BALANCE_META }
  );

  if (isLoading) return <Loading />;

  const payoutBalance = computeBalance(application);

  return (
    <NumberField
      source="payoutBalance"
      label="Balance"
      record={{ payoutBalance }}
      options={{ style: "currency", currency: "USD", minimumFractionDigits: 0 }}
    />
  );
};

export default BalanceField;

export const balance = async (
  dataProvider: DataProvider,
  applicationId: Identifier
) => {
  const { data: application } = await dataProvider.getOne(
    "grant-application-finals",
    { id: applicationId, meta: BALANCE_META }
  );

  return computeBalance(application);
};
