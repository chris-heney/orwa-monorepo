import { Box, Modal } from '@mui/material';
import React from 'react';
import { Create, SaveButton, SimpleForm, Toolbar, useCreate, useNotify, useDataProvider } from 'react-admin';
import CustomHeader from '../../../_components/CustomHeader';
import ContactCreateFormFields from '../../../human-resources/contacts/fields/ContactCreateFields';
import { createRecord } from '../../../_helpers/createRecord';

interface ContactsModalFormProps {
    createContact: boolean;
    setCreateContact: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContactsCreateModal = ({ createContact, setCreateContact }: ContactsModalFormProps) => {
  const dynamicGridItemProps = {
    xs: 12,
    sm: 12,
    md: 6,
    lg: 6,
  };

  const [create] = useCreate();
  const notify = useNotify();
  const dataProvider = useDataProvider();

  const findDuplicateEmail = async (email: string) => {
    try {
      const { data: contacts } = await dataProvider.getList('contacts', {
        pagination: { page: 1, perPage: 1 },
        filter: { email },
        sort: { field: 'id', order: 'ASC' },
      });

      return contacts.length > 0;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return false;
    }
  };

  return (
    <Modal
      open={createContact}
      onClose={() => setCreateContact(false)}
      aria-labelledby="modal-title"
      aria-describedby="modal-description">
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80vw',
      }}>
        <Create resource={'contacts'} redirect={'false'} title={' '} >
          <CustomHeader sx={{textAlign:'center'}} title='Create Contact'/>
          <SimpleForm onSubmit={async (data) => {
            const isDuplicate = await findDuplicateEmail(data.email);
            if (isDuplicate) {
              notify('A contact with this email already exists.', { type: 'warning' });
              return;
            }
            createRecord(data, create, notify, setCreateContact, 'contacts');
          }} toolbar={
            <Toolbar>
              <SaveButton label="Save" />
            </Toolbar>} sx={{maxHeight:'60vh', overflowY:'scroll'}}>
            <ContactCreateFormFields gridItemProps={dynamicGridItemProps}/>
          </SimpleForm>
        </Create>
      </Box>
    </Modal>
  );
};

export default ContactsCreateModal;