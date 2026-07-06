import * as React from 'react'
import { Edit, Identifier, Loading, RaRecord, SimpleForm, TextInput, useDataProvider, useNotify, useRefresh, useUpdate } from 'react-admin'
import { Box, Button, Checkbox, Divider, Grid, Typography } from '@mui/material'
import CustomSecondaryHeader from '../../../_components/CustomSecondaryHeader'
import { FieldValues } from 'react-hook-form'
import authProvider from '../../../../authProvider'
import GrantSubStatus from './GrantSubStatus'
import { createPayloadVariables, extractFieldsFromHTML } from '../../../emails-magement/helper'
import SendIcon from '@mui/icons-material/Send'
import { sendActivity } from '../../../../helpers/sendActivity'

interface ModalContentProps {
  applicationStatus: RaRecord | null
  selectedApplication: RaRecord | null
  setIsEmailModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  applicationSubStatus?: RaRecord | null
  setApplicationSubStatus?: React.Dispatch<React.SetStateAction<RaRecord | null>>
}

//Dear {point_of_contact_first} {point_of_contact_last},  
//We are pleased to formally notify you that the Oklahoma Rural Water Association (ORWA) 
//and the Oklahoma Department of Environmental Quality (DEQ) approved your request for a Rural Infrastructure Grant ("RIG"),
// application #{id}. With this approval, and subject to limitations, requirements, and points of understanding set out below, 
//the RIG Committee has committed funds to be made available to you for purposes of the project subject of this RIG grant. 
// Approval of the RIG grant request is based on the proposed project(s) which shall be {approved_drinking_water_projects}{approved_wastewater_projects} 
//as more fully described in the grant application #{ id}. Under DEQ and RIG program rules, RIG funding is a reimbursement for funds expended on projects 
//approved by the RIG Committee. The approval was made subject to the terms of the enclosed RIG Grant Agreement which is to be signed, attested, and returned before 
//the disbursement of RIG funds. It is our understanding that funding for this project, estimated at {approved_project_cost} is being secured as follows:
//RIG Funds  Matching Funds Grant Amount {approved_grant_amount}  Match Amount {approved_utility_match}        Total Project Cost {approved_project_cost}   

// abstract all {} from the email and check if they are in the record if the record doesnt containt one of the {} then it should be display a text input for the user to fill in the value
// and then save it to the record

const ApplicationEmailModal = ({ applicationStatus, selectedApplication, setIsEmailModalOpen }: ModalContentProps) => {
  const dataProvider = useDataProvider()
  const [checkedEmails, setCheckedEmails] = React.useState<{ [key: string]: boolean }>({})
  const [subEmail, setSubEmail] = React.useState([])

  interface Status {
    id: string
    name: string
    color: `#${string}`
  }

  const [applicationSubStatus, setApplicationSubStatus] = React.useState<Status>(null as unknown as Status)

  const handleCheckboxChange = (templateId: Identifier) => {
    setCheckedEmails(prevState => ({
      ...prevState,
      [templateId]: !prevState[templateId],
    }))
  }

  const [update] = useUpdate()
  const notify = useNotify()
  const refresh = useRefresh()
 
  const checkIfPayloadHasUndefined = (payloadVariables: Record<string, unknown>, fields: string[]) => {
    return fields.some(field => payloadVariables[field] === undefined)
  }

  const fields = extractFieldsFromHTML(applicationStatus?.email_templates[0] as RaRecord)

  const payloadVariables: Record<string, unknown> = createPayloadVariables(selectedApplication as RaRecord, fields)

  const sendEmails = async (email?: string, applicationData?: { [x: string]: unknown }) => {
    const identity = await authProvider.getIdentity?.()
    if (!identity) {
      return
    }

    const selectedEmailTemplates = applicationStatus?.email_templates.concat(subEmail).filter((template: RaRecord) => checkedEmails[template.id])
    if (!selectedEmailTemplates || selectedEmailTemplates.length === 0) {
      return
    }
    
    for (const template of selectedEmailTemplates) {
      const payloadVariables = createPayloadVariables(selectedApplication as RaRecord, extractFieldsFromHTML(template))
      const payload = {
        variables: { ...payloadVariables, ...applicationData }, 
        templateId: template.id,
        to: email ?? selectedApplication?.point_of_contact.email ,
      }
      try {
        const response = await fetch(import.meta.env.VITE_MAILER_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${identity.token}`,
          },
          body: JSON.stringify(payload),
        })
        if (response.status === 200 && selectedApplication ) sendActivity(dataProvider, 'grant-application', `Email Sent: ${template.email_name}`, [selectedApplication?.id])
        response.status === 500 ? notify(`Error sending Email for ${template.email_name}`, { type: 'error' }) : notify(`Email for ${template.email_name} Sent`, { type: 'success' })

      } catch (error) {
        notify(`Error sending Email for ${template.email_name}`, { type: 'error' })
        console.error(error)
      }
    }
    refresh()
    setIsEmailModalOpen(false)
  }


  const updateApplication = async (data: FieldValues, record: RaRecord | null) => {

    const applicationData = {
      ...data,
      status: applicationStatus?.id,
    }
    const updatedPayloadVariables = {
      ...payloadVariables,
      ...applicationData,
    }

    update('grant-application-finals', { id: record?.id, data: applicationData, previousData: record })
    notify('Grant Application Was Updated', { type: 'success', autoHideDuration: 3000 })

    await sendEmails(data.email, applicationData)

    setIsEmailModalOpen(false)
  }

  const updateSendEmails = async () => {
    const applicationData = {
      status: applicationStatus?.id,
      sub_status: applicationSubStatus ? applicationSubStatus?.id : null,
    }
    try {
      await update('grant-application-finals', { id: selectedApplication?.id, data: applicationData ,previousData: selectedApplication })
      notify(`Grant Application Was Updated to ${applicationStatus?.name}`, { type: 'success', autoHideDuration: 3000 })

      // send an activity to the activity feed that the application was updated
      if (selectedApplication) sendActivity(dataProvider, 'grant-application', `Grant Application Was Updated to ${applicationStatus?.name}`, [selectedApplication?.id])
    } catch (error) {
      notify(`Error updating Grant Application to ${applicationStatus?.name}`, { type: 'error' })
      console.error(error)
    }
    try {
      await sendEmails()

    } catch (error) {
      notify('Error Sending Email', { type: 'error' })
      console.error(error)
    }
    setIsEmailModalOpen(false)
  }

  return (!selectedApplication || !applicationStatus || !setIsEmailModalOpen) ? <Loading/> : (
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '50vw',
      maxHeight: '90vh',
      overflowY: 'auto',
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
    }}>

      <CustomSecondaryHeader sx={{ textAlign: 'center' }} title={selectedApplication?.legal_entity_name + ' ' + `(${applicationStatus?.name})`} />
      <Box p={1}>
        {applicationStatus?.grant_sub_statuses.length > 0 && 
        <Box>
          <Typography >Select Sub Status</Typography>   
          <GrantSubStatus 
            applicationSubStatus={applicationSubStatus} 
            setApplicationSubStatus={setApplicationSubStatus}
            setSubEmail={setSubEmail} 
            statusId={applicationStatus?.id} 
            selectedApplication={selectedApplication} 
          />
        </Box>
        }
        <Typography mt={5}>Available Emails {checkIfPayloadHasUndefined(payloadVariables, fields) ? '(Sent After Updating Fields)' : '' }</Typography>
        <Divider />
        {applicationStatus?.email_templates.concat(subEmail).map((template: RaRecord) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }} key={template.id}>
              <Checkbox
                checked={checkedEmails[template.id] || false}
                onChange={() => handleCheckboxChange(template.id)}
              />
              <Typography>{template.email_name}</Typography>
            </Box>
          )
        })}
        {!checkIfPayloadHasUndefined(payloadVariables, fields) &&
          <Box>
            <Button onClick={() => updateSendEmails()}>Save or Email Grant Applicant <SendIcon sx={{ml: 1}}/></Button>
            <Typography mt={5}>No Missing Fields</Typography>
          </Box>
        }
        {checkIfPayloadHasUndefined(payloadVariables, fields) &&
          <Box mt={2}>
            <Typography>Please fill in the missing fields</Typography>
            <Divider />
            <Edit title={' '} redirect={false} id={selectedApplication?.id} resource='grant-application-finals'>
              <SimpleForm onSubmit={(data) => updateApplication(data, selectedApplication)}>
                <Grid container spacing={2}>
                  {fields.map((field, index) => {
                    return (
                      payloadVariables[field] === undefined && (
                        <Grid key={field + index} item xs={12} md={6}>
                          {/* Render an input field if the value is missing */}
                          <TextInput
                            source={field}
                            fullWidth
                            helperText={false}
                          />
                        </Grid>
                      )
                    )
                  })}
                  {(selectedApplication?.point_of_contact === undefined  || selectedApplication.email) && <Grid item xs={12} md={6}>
                    {/* Render an input field if the value is missing */}
                    <TextInput
                      source='email'
                      fullWidth
                      helperText={false}
                    />
                  </Grid>}
                </Grid>
              </SimpleForm>
            </Edit>
          </Box>
        }
      </Box>
    </Box>
  )
}
export default ApplicationEmailModal
