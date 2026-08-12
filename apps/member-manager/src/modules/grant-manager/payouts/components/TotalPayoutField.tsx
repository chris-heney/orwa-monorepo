import React from 'react'
import { DataProvider, Identifier, Loading, NumberField, RaRecord, useGetList, useRecordContext } from 'react-admin'
import { isCountableTowardAward, sumPayoutAmounts, toMoney } from '../helpers/payoutAmounts'


const TotalPayoutField = ({ applicationId }: { applicationId: Identifier }) => {
  const record = useRecordContext()
  const { data: appPayouts, isLoading } = useGetList('grant-payouts', { pagination: { page: 1, perPage: 100 }, sort: { field: 'id', order: 'ASC' }, filter: { application: applicationId }, meta: { raw: true, populate: { payout_status: true } } })

  const totalPayouts = sumPayoutAmounts(appPayouts, isCountableTowardAward)
  if (record) {
    record.totalPayouts = totalPayouts
    record.balance = toMoney(record.award_amount) - totalPayouts
  }

  return isLoading ? <Loading /> : (
    <NumberField
      source='balance'
      label='Balance'
      record={{ balance: totalPayouts }}
      options={{ style: 'currency', currency: 'USD', minimumFractionDigits: 0}}
    />
  )
}

export default TotalPayoutField


export const totalPaidOut = (dataProvider: DataProvider, applicationId: Identifier) => {
  return dataProvider.getList('grant-payouts', { pagination: { page: 1, perPage: 100 }, sort: { field: 'id', order: 'ASC' }, filter: { application: applicationId }, meta: { raw: true, populate: { payout_status: true } } })
    .then(({ data }: { data: RaRecord[] }) => {
      return sumPayoutAmounts(data, isCountableTowardAward)
    })
}
