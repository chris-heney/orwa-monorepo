import * as React from 'react'
import { DateInput, Edit, Identifier, NumberInput, RaRecord, SimpleForm, TextInput, useDataProvider, useNotify, useRefresh, useUpdate } from 'react-admin'
import Grid from '@mui/material/Grid'
import { Box, Checkbox, Typography } from '@mui/material'
import { FieldValues } from 'react-hook-form'
import CustomSecondaryHeader from '../../../_components/CustomSecondaryHeader'
import PayoutDenialReason from '../../grant-application/components/PayoutDenialReason'
import authProvider from '../../../../authProvider'
import CustomToolBar from '../../../_components/CustomToolbar'
import { sendActivity } from '../../../../helpers/sendActivity'

interface ModalContentProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPayout: RaRecord<Identifier> | undefined
  templateId?: number | null
  payoutStatus: RaRecord<Identifier> | null | undefined
}

const PayoutModal = ({ setIsModalOpen, selectedPayout , payoutStatus }: ModalContentProps) => {
  const [update] = useUpdate()
  const notify = useNotify()
  const dataProvider = useDataProvider()
  const refresh = useRefresh()
  const [statusId, setStatusId] = React.useState<null | number>(null)
  const [sendEmail, setSendEmail] = React.useState(false)

  const updatePayout = async (data: FieldValues) => {

    const identity = await authProvider.getIdentity?.()
    if (!identity) {
      return alert('You must has access in to perform this action')
    }

    try {
      update('grant-payouts', { id: selectedPayout?.id, previousData: { ...selectedPayout }, data: { ...data, payout_status: payoutStatus?.id, denial_reason: statusId ?? null } })
      notify('Payout Was Updated', { type: 'success' })
      sendActivity(dataProvider, 'grant-application', `Grant Payout for ${selectedPayout?.application.legal_entity_name} was ${payoutStatus?.name} `, [selectedPayout?.id, selectedPayout?.application.id])
      setIsModalOpen(false)
      refresh()
    } catch (error) {
      console.error('Error updating payout:', error)
      notify('Error updating payout', { type: 'error' })
      setIsModalOpen(false)
    }

    if (payoutStatus?.name === 'Approved') {
      // @TODO
      // send email to DEQ to notify them of the approval
    }
    if (!sendEmail )return
   
  
    const { data: template } = await dataProvider.getOne('email-templates', { id: payoutStatus?.email_template.id })
    

    if (!selectedPayout?.application.email && !selectedPayout?.application.point_of_contact) return alert('No email address found for this applicant')
    const payload = {
      variables: {
        legal_entity_name: selectedPayout?.application.legal_entity_name
      },
      templateId: template?.id,
      to: selectedPayout.application.email ? selectedPayout.application.email : selectedPayout.application.point_of_contact.email  ,
      // to: 'marcosje2005@gmail.com'
    }

    try {
      const response = await fetch(import.meta.env.VITE_MAILER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${identity?.token}`
        },
        body: JSON.stringify(payload)
      })

      response.status === 500 ? notify(`Error sending Email ${template.email_name}`, { type: 'error' }) : notify(`Email ${template?.email_name} Sent`, { type: 'success' })
      sendActivity(dataProvider, 'grant-application', `Email ${template?.email_name} Sent`, [selectedPayout?.id, selectedPayout?.application.id])
    } catch (error) {
      notify(`Error sending Email ${template?.email_name}`, { type: 'error' })
      console.log(error)
    }
  }
  return (
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '50vw',
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
    }}>

      <CustomSecondaryHeader sx={{ textAlign: 'center' }} title={`Grant Payout ${status}`} />
      <Edit component={'div'} id={selectedPayout?.id} title={' '} sx={{
        '& .css-1a69w1n-MuiStack-root': {
          alignItems: 'center',
        }
      }} resource="grant-payouts" redirect={false}>
        <SimpleForm toolbar={<CustomToolBar/>} onSubmit={(data) => updatePayout(data)}  >
          <Grid container spacing={2}>
            {payoutStatus?.name === 'Not Approved' &&
              <Grid item xs={12}>
                <PayoutDenialReason setStatusId={setStatusId} />
              </Grid>
            }
            {payoutStatus?.name === 'Paid' &&
              <Grid item xs={12}>
                <DateInput source="transaction_date" fullWidth />
              </Grid>
            }
            {payoutStatus?.name === 'Paid' &&
              <Grid item xs={12}>
                <NumberInput source="amount" fullWidth />
              </Grid>
            }
            <Grid item xs={12}>
              <Grid item xs={12}>
                <TextInput source="comments" fullWidth multiline minRows={5} helperText={false}/>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{display: 'flex' , alignItems:'center'}}>
                <Checkbox checked={sendEmail} onClick={() => sendEmail ? setSendEmail(false) : setSendEmail(true)}/>
                <Typography variant="body1">Send {`Email Payout ${status}`} to Applicant</Typography>
              </Box>          
            </Grid>
          </Grid>
        </SimpleForm>
      </Edit>
    </Box>
  )
}
export default PayoutModal
