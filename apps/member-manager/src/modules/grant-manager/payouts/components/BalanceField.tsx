import React from "react";
import {
  DataProvider,
  Identifier,
  Loading,
  NumberField,
  useGetOne,
} from "react-admin";

// balance() only needs award_amount + payouts, so populate just that relation
// instead of `populate=*` (~150KB/response); the full populate was overloading
// Strapi 5 when dashboards fanned out hundreds of these calls in parallel.
const BALANCE_META = { raw: true, populate: { payouts: true } };

/**
 * Compute the remaining balance from a record that already has `payouts`
 * populated (e.g. from a getList with populate). Prefer this over `balance()`
 * whenever the data is already loaded — it avoids a network round-trip.
 */
export const computeBalance = (application: {
  award_amount?: number;
  payouts?: { amount?: number }[];
}) => {
  const totalPaid = (application.payouts ?? []).reduce(
    (acc: number, payout) => acc + (payout.amount || 0),
    0
  );
  const payoutBalance = (application.award_amount ?? 0) - totalPaid;

  return isNaN(payoutBalance) ? 0 : payoutBalance;
};

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

// return just a number instead of a NumberField
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
