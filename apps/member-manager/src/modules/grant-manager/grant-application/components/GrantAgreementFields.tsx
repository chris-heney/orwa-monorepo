import React from 'react'
import { FunctionField, useRecordContext } from 'react-admin'
import BalanceField from '../../payouts/components/BalanceField'
import TotalPayoutsField from '../../payouts/components/TotalPayoutField'




export const TotalPaidOutField = () => {
  const record = useRecordContext()
  return record.status.name === 'Grant Agreement Signed/Sealed/Returned' ?  (
    <FunctionField
      label="Total Paid Out"
      sx={{ display: 'block', textAlign: 'right' }}
      textAlign="right"
      render={() => <TotalPayoutsField applicationId={record.id} />}
    />
  ) : (
    null
  )
}

export const BalanceFieldComponent = () => {
  const record = useRecordContext()
  return record.status.name === 'Grant Agreement Signed/Sealed/Returned' ?  (
    <FunctionField
      label="Balance"
      textAlign="right"
      render={() => <BalanceField applicationId={record.id} />}
    />
  ) : (
    null
  )
}