import React from "react";
import {
  DataProvider,
  Identifier,
  Loading,
  NumberField,
  RaRecord,
  useGetOne,
} from "react-admin";

const BalanceField = ({ applicationId }: { applicationId: Identifier }) => {
  const { data: application, isLoading } = useGetOne(
    "grant-application-finals",
    { id: applicationId, meta: { raw: true, populate: true } }
  );

  if (isLoading) return <Loading />;

  const totalPaid = application.payouts.reduce(
    (acc: number, payout: RaRecord) => acc + payout.amount,
    0
  );
  let payoutBalance = application.award_amount - totalPaid;

  // Check if payoutBalance is NaN, then set it to 0
  if (isNaN(payoutBalance)) {
    payoutBalance = 0;
  }

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
    { id: applicationId, meta: { raw: true, populate: true } }
  );

  const totalPaid = application.payouts.reduce(
    (acc: number, payout: RaRecord) => acc + payout.amount,
    0
  );
  let payoutBalance = application.award_amount - totalPaid;

  // Check if payoutBalance is NaN, then set it to 0
  if (isNaN(payoutBalance)) {
    payoutBalance = 0;
  }

  return payoutBalance;
};
