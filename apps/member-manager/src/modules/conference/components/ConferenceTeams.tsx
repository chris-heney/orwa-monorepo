import React from 'react';
import {
  TextField,
  RaRecord,
  Edit,
  SimpleForm,
  ReferenceInput,
  NumberInput,
  AutocompleteInput,
  TextInput,
  useNotify,
  Create,
  useRemoveFromStore,
  useUpdate,
  useCreate,
  ReferenceArrayField,
  SingleFieldList,
  AutocompleteArrayInput,
  ReferenceArrayInput,
  DateField,
  ReferenceField,
  useListFilterContext,
} from 'react-admin';
import { DatagridConfigurable } from "@orwa/entity-id";
import { Button, Chip, Grid } from '@mui/material';
import { useConferenceContext } from '../ConferenceContext';
import CustomSecondaryHeader from '../../_components/CustomSecondaryHeader';
import CustomToolBar from '../../_components/CustomToolbar';
import { createRecord } from '../../_helpers/createRecord';
import { updateRecord } from '../../_helpers/updateRecord';
import { customDatagridStyle, positionStickyComponent } from '../../../css';
import CustomPagination from '../../_components/CustomPagination';
//TODO fix so tickets and extras work theyre turning the contact into a null object
import { getPrimaryConferenceId } from '../helpers/mergeConferenceAcrossTabFilters';

const TeamFormFields = () => {
  const { filterValues } = useListFilterContext();
  const filterConferenceId = getPrimaryConferenceId(filterValues);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <TextInput
          source="name"
          label="Name"
          fullWidth
          helperText="Team Name"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <ReferenceArrayInput
          reference="conference-contestants"
          source="contestants"
          label="Contestants"
          fullWidth
        >
          <AutocompleteArrayInput
            optionText={(record) => {
              return record.first + ' ' + record.last;
            }}
            fullWidth
          />
        </ReferenceArrayInput>
      </Grid>
      <Grid item xs={12} md={3}>
        <ReferenceInput
          reference="conference-registrations"
          source="registration"
          label="Registration"
          fullWidth
        >
          <AutocompleteInput
            optionText={(record) => {
              return record.organization + ' | ' + record.registration_date;
            }}
            fullWidth
          />
        </ReferenceInput>
      </Grid>
      <Grid item xs={12} md={3} display={'hidden'}>
        <NumberInput
          source="year"
          label="Year"
          fullWidth
          defaultValue={filterValues.year}
        />
      </Grid>
      <Grid item xs={12} md={6} display={'hidden'}>
        <NumberInput
          source="conference"
          defaultValue={filterConferenceId}
          sx={{ display: 'none' }}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

const ConferenceTeams = () => {
  const { isCreating, setIsCreating } = useConferenceContext();

  const notify = useNotify();
  const [create] = useCreate();
  const [update] = useUpdate();
  const remove = useRemoveFromStore();

  return isCreating ? (
    <Create
      sx={{
        mt: -2,
      }}
      title={' '}
      resource="conference-teams"
      component={'div'}
    >
      <CustomSecondaryHeader title="Add New Team" />
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
          createRecord(
            formData,
            create,
            notify,
            setIsCreating,
            'conference-teams'
          )
        }
      >
        <TeamFormFields />
      </SimpleForm>
    </Create>
  ) : (
    <>
      <DatagridConfigurable
        sx={customDatagridStyle}
        bulkActionButtons={false}
        expandSingle={true}
        isRowExpandable={() => true}
        isRowSelectable={() => false}
        rowClick="expand"
        expand={(record: RaRecord) => {
          return (
            <Edit
              sx={positionStickyComponent}
              redirect={false}
              title={' '}
              resource="conference-teams"
              component={'div'}
              id={record.id}
            >
              <SimpleForm
                onSubmit={(formData) =>
                  updateRecord(
                    formData,
                    record,
                    update,
                    notify,
                    remove,
                    'conference-teams'
                  )
                }
                toolbar={<CustomToolBar />}
              >
                <Grid container spacing={2}>
                  <TeamFormFields />
                </Grid>
              </SimpleForm>
            </Edit>
          );
        }}
      >
        <TextField source="name" label="Team Name" noWrap />

        <ReferenceArrayField
          source="contestants"
          reference="conference-contestants"
          label="Contestants"
          sortBy={'contestants.first'}
        >
          <SingleFieldList linkType={false}>
            <Chip
              label={
                <>
                  <TextField source="first" />
                  <TextField ml={0.5} source="last" />
                </>
              }
            />
          </SingleFieldList>
        </ReferenceArrayField>

        <ReferenceField
          source="registration"
          reference="conference-registrations"
          label="Registration Date"
          sortBy={'registration.registration_date'}
        >
          <DateField source="registration_date" label="Registration Date" />
        </ReferenceField>
      </DatagridConfigurable>
      <CustomPagination />
    </>
  );
};

export default ConferenceTeams;
