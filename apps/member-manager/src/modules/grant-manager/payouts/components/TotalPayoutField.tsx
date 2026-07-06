import React from 'react'
import { DataProvider, Identifier, Loading, NumberField, RaRecord, useGetList, useRecordContext } from 'react-admin'


const TotalPayoutField = ({ applicationId }: { applicationId: Identifier }) => {
  const record = useRecordContext()
  const { data: appPayouts, isLoading } = useGetList('grant-payouts', { pagination: { page: 1, perPage: 100 }, sort: { field: 'id', order: 'ASC' }, filter: { application: applicationId } })

  const totalPayouts = appPayouts?.reduce((acc: number, payout: RaRecord) => acc + payout.amount, 0)

  record.totalPayouts = totalPayouts
  const balance = record.award_amount - record.totalPayouts
  record.balance = balance

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


// function to return total paid out as number 

export const totalPaidOut = (dataProvider: DataProvider, applicationId: Identifier) => {
  return dataProvider.getList('grant-payouts', { pagination: { page: 1, perPage: 100 }, sort: { field: 'id', order: 'ASC' }, filter: { application: applicationId } })
    .then(({ data }: { data: RaRecord[] }) => {
      return data.reduce((acc: number, payout: RaRecord) => acc + payout.amount, 0)
    })
}