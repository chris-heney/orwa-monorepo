import { Box, Button, Divider, FormControl, FormControlLabel, Paper, Radio, RadioGroup } from '@mui/material';
import React from 'react';
import CustomHeader from '../_components/CustomHeader';
import { useGetList, useNotify } from 'react-admin';
import CustomTextInput from '../_components/CustomTextInput';
import authProvider from '../../authProvider';
import { createPayloadVariables, extractFieldsFromHTML } from './helper';
import { useSoonerwarnContext } from '../soonerwarn/SoonerwarnContextProvider';

const SoonerwarnEmailSideBar = ({module} : {
  module: string
}) => {
  
  const [overrideTo, setOverrideTo] = React.useState('');
  const { data: emails } = useGetList('email-templates', { pagination: { page: 1, perPage: 100 }, sort: { field: 'email_name', order: 'ASC' }, filter: { module: module } });
  const [emailIndex, setEmailIndex] = React.useState(0);
  const {selectedApplication} = useSoonerwarnContext();

  const notify = useNotify();

  const sendEmail = async () => {

    if (!selectedApplication?.email) {
      return notify('Missing Email', { type: 'error' });
    }

    const identity = await authProvider.getIdentity?.();
    if (!identity) {
      return;
    }

    const payloadVariables = createPayloadVariables(selectedApplication , extractFieldsFromHTML(emails ? emails[emailIndex] : ''));

    let attachments = null;

    // // Fetch the award letter PDF only if the selected email template is "Grant Award Letter"
    // if (emails && emails[emailIndex]?.email_name === 'Grant Award Letter' && grantContext.application.award_letter ) {
      
    //   attachments = grantContext.application.award_letter ? [
    //     {
    //       name: 'Awards-Letter.pdf',
    //       url: `${import.meta.env.VITE_API_ENDPOINT}${grantContext.application.award_letter.url}`,
    //     }, 
    //   ] : null;
    // }

    const payload = {
      variables: payloadVariables,
      templateId: emails ? emails[emailIndex].id : '',
      to: overrideTo ? overrideTo :  selectedApplication.email,
      ...selectedApplication,
      attachments,
    };

    try {
      const response = await fetch(import.meta.env.VITE_MAILER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${identity.token}`
        },
        body: JSON.stringify(payload)
      });


      if (response.status === 500) {
        notify(`Error sending Email ${emails ? emails[emailIndex].email_name : ' '}` + ' to ' + `${overrideTo ? overrideTo :   selectedApplication.system_name}`, { type: 'error' });
      } else {
        notify(`Email ${emails ? emails[emailIndex].email_name : ' '}` + ' Sent to ' + `${overrideTo ? overrideTo : selectedApplication.system_name}`, { type: 'success' });
      }

    } catch (error) {
      notify(`Error sending Email ${emails ? emails[emailIndex].email_name : ' '}` + ' to ' + `${overrideTo ? overrideTo :  selectedApplication.system_name}`, { type: 'error' });
      console.error(error);
    }
  };

  return (
    <Paper
      component={'aside'}
      sx={{
        mt: 3,
        ml: 2,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        minWidth: 300,
      }}
    >
      <CustomHeader
        title="Notifications"
      />
      <Box sx={{ p: 2, overflowY: 'scroll', maxHeight: '70vh' }}>
        <FormControl>
          <RadioGroup value={emailIndex} onClick={(e) => {
            const target = e.target as HTMLInputElement;

            const clickedIndex = parseInt(target.value);
            if (clickedIndex === emailIndex) {
              setEmailIndex(-1);
            } else {
              setEmailIndex(clickedIndex);
            }
          }}>
            {emails?.map((email, i) => {
              return (
                <FormControlLabel
                  key={`conference-${i}`}
                  value={i}
                  control={
                    <Radio checked={i === emailIndex} />
                  }
                  label={email.email_name}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
        <Divider />
      </Box>
      <Box sx={{ p: 2 }}>
        {emailIndex !== -1 && <CustomTextInput label="Override To" value={overrideTo} onChange={(value) => setOverrideTo(value)} />}
        <Button
          onClick={() => sendEmail()}
          sx={{ mt: 3 }} variant='outlined'>
          Resend
        </Button>
      </Box>
    </Paper >
  );
};

export default SoonerwarnEmailSideBar;