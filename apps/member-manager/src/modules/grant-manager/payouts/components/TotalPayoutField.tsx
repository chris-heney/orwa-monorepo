import React from 'react'
import { DataProvider, Identifier, Loading, NumberField, RaRecord, useGetList } from 'react-admin'
import { isCountableTowardAward, sumPayoutAmounts } from '../helpers/payoutAmounts'


const TotalPayoutField = ({ applicationId }: { applicationId: Identifier }) => {
  const { data: appPayouts, isLoading } = useGetList('grant-payouts', { pagination: { page: 1, perPage: 100 }, sort: { field: 'id', order: 'ASC' }, filter: applicationId != null && applicationId !== '' ? { application: applicationId } : {}, meta: { raw: true, populate: { payout_status: true } } }, { enabled: applicationId != null && applicationId !== '' })

  const totalPayouts = sumPayoutAmounts(appPayouts, isCountableTowardAward)

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
