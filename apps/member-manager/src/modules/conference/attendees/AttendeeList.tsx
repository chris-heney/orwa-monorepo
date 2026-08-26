import React, { useContext } from 'react';
import { ConferenceContext } from '../ConferenceContext';
import {
  FunctionField,
  SimpleForm,
  Create,
  TextField,
  ReferenceField,
  DateField,
  BooleanField,
  useCreate,
  RaRecord,
  useListContext,
  useNotify,
  ChipField,
} from 'react-admin';
import { DatagridConfigurable } from "@orwa/entity-id";
import { Button } from '@mui/material';
import { customDatagridStyle } from '../../../css';
import { useCan } from '../../rbac-manager/useCan';
import CustomSecondaryHeader from '../../_components/CustomSecondaryHeader';
import CustomPagination from '../../_components/CustomPagination';
import { createRecord } from '../../_helpers/createRecord';
import { ISharedMeta } from '../types/IConference';
import { ConferenceAttendeeFields } from './AttendeeFormFields';
import { getPrimaryConferenceId } from '../helpers/mergeConferenceAcrossTabFilters';

const AttendeeList = () => {
  const { isCreating, setIsCreating } = useContext(ConferenceContext);

  // Use the list context from the parent ListBase
  const { resource, filterValues } = useListContext();
  const listConferenceId = getPrimaryConferenceId(filterValues);

  const [create] = useCreate();
  const notify = useNotify();
  const { canOnResource } = useCan();
  const canUpdate = canOnResource('update', resource ?? '');

  return isCreating ? (
    <Create
      title={' '}
      resource={resource}
      component={'div'}
      sx={{
        mt: -2,
      }}
    >
      <CustomSecondaryHeader title="Add New Attendee" />
      <Button
        onClick={() =>
          isCreating ? setIsCreating(false) : setIsCreating(true)
        }
      >
        {' '}
        Back
      </Button>
      <SimpleForm
        onSubmit={(formData) =>
          createRecord(formData, create, notify, setIsCreating, resource)
        }
      >
        <ConferenceAttendeeFields context="create" />
      </SimpleForm>
    </Create>
  ) : (
    <>
      <DatagridConfigurable
        sx={customDatagridStyle}
        bulkActionButtons={false}
        rowClick={canUpdate ? 'edit' : false}
        expandSingle={true}
      >
        <TextField source="id" label="ID" />
        <ReferenceField
          source="conference_ticket"
          reference="conference-tickets"
          label="Type"
          link={false}
          sortBy="conference_ticket.name"
        >
          <TextField source="name" label="Type" noWrap />
        </ReferenceField>
        <ReferenceField
          source="registration"
          reference="conference-registrations"
          label="Date Registered"
          link={false}
          sortBy="registration.registration_date"
        >
          <DateField
            source="registration_date"
            label="Date Registered"
            noWrap
          />
        </ReferenceField>
        <TextField source="first" label="First" noWrap />
        <TextField source="last" label="Last" noWrap />
        <TextField source="title" label="Title" noWrap />
        <TextField source="email" label="Email" noWrap />
        <TextField source="phone" label="Phone" noWrap />
        <TextField source="organization" label="Organization" noWrap />
        {listConferenceId === 1 && (
          <TextField
            source="orwa_voting_status"
            label="ORWA Voting Status"
            noWrap
          />
        )}
        {listConferenceId === 1 && (
          <TextField
            source="orwaag_voting_status"
            label="ORWAAG Voting Status"
            noWrap
          />
        )}
        <FunctionField
          sx={{ display: 'flex', gap: '5px' }}
          label="Items"
          sortBy="items.label"
          render={(record: RaRecord) => {
            return record?.items?.map((item: ISharedMeta, index: number) => {
              // Surface the chosen option (e.g. shirt size) on the chip.
              const chipLabel = item.selection
                ? `${item.label} — ${item.selection}`
                : item.label;
              return (
                <ChipField
                  key={`item-${record.id}-${item.key + ' ' + index}`}
                  record={{ ...item, label: chipLabel }}
                  source="label"
                  label={chipLabel}
                />
              );
            });
          }}
        />
        <TextField source="training_type" label="Training" noWrap />
        <TextField source="license" label="License" noWrap />
        <BooleanField source="speaker" label="Speaker" />
        <BooleanField source="promotional_emails" label="Promo Emails" />
      </DatagridConfigurable>
      <CustomPagination />
    </>
  );
};

export default AttendeeList;
