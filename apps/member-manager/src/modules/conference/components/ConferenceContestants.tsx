import React, { useContext } from 'react';
import {
  TextField,
  ReferenceField,
  DateField,
  NumberField,
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
  FunctionField,
  required,
  SaveButton,
  useListContext,
  useResourceContext,
} from 'react-admin';
import { DatagridConfigurable } from "@orwa/entity-id";
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  type SxProps,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { CurrencyOptions } from '../../../config/Settings';
import { ConferenceContext } from '../ConferenceContext';
import CustomSecondaryHeader from '../../_components/CustomSecondaryHeader';
import { createRecord } from '../../_helpers/createRecord';
import { updateRecord } from '../../_helpers/updateRecord';
import { customDatagridStyle, positionStickyComponent } from '../../../css';
import { ISharedMeta } from '../types/IConference';
import { getPrimaryConferenceId } from '../helpers/mergeConferenceAcrossTabFilters';
import { groupItemsByExtra } from '../helpers/contestantExtras';
import ContestantExtrasEditor from './ContestantExtrasEditor';
import ContestantCancellationActions from './ContestantCancellationActions';
import { isCancelledContestant } from '../helpers/contestantStatus';
import { useCan } from '../../rbac-manager/useCan';

const ContestantFormFields = () => {
  const { filterValues } = useListContext();
  const filterConferenceId = getPrimaryConferenceId(filterValues);

  return (
    <Grid item xs={12} md={12} sx={{ p: 2, overflow: 'hidden' }}>
      <Typography variant="h6">Contestant Info.</Typography>
      <Divider />
      <Grid display={'none'} item xs={12} md={6} lg={4}>
        <ReferenceInput
          source="conference"
          reference="conferences"
          label="Conference"
        >
          <AutocompleteInput
            optionText="name"
            fullWidth
            defaultValue={{ conference: filterConferenceId }}
            helperText={false}
          />
        </ReferenceInput>
      </Grid>
      <Grid display={'none'} item xs={12} md={6} lg={4}>
        <NumberInput
          source="year"
          label="Year"
          defaultValue={filterValues.year}
          fullWidth
          helperText={false}
        />
      </Grid>
      <Grid container spacing={2}>
        {/* first,last email,phoen */}
        <Grid item xs={12} md={6} lg={4}>
          <TextInput
            source="first"
            label="First Name"
            fullWidth
            validate={required('First name is Required')}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <TextInput
            source="last"
            label="Last Name"
            fullWidth
            validate={required('Last name is Required')}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <TextInput source="email" label="Email" fullWidth />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <TextInput source="phone" label="Phone" fullWidth />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <ReferenceInput
            source="team"
            reference="conference-teams"
            label="Team"
            fullWidth
          >
            <AutocompleteInput optionText="name" />
          </ReferenceInput>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <TextInput
            source="organization"
            label="Organization"
            fullWidth
            validate={required('Organization is Required')}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <ReferenceInput
            filter={
              filterConferenceId != null
                ? { conferences: [filterConferenceId] }
                : {}
            }
            source="conference_ticket"
            reference="conference-tickets"
            label="Title"
            fullWidth
            helperText={false}
          >
            <AutocompleteInput
              optionText={'name'}
              helperText={false}
              validate={required('Conference Ticket is required')}
            />
          </ReferenceInput>
          {/* <SelectInput source="type" label='Type' fullWidth choices={[
            {id: 'Golfer', name: 'Golfer'},
            {id: 'Fisher', name: 'Fisher'},
          ]} /> */}
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <NumberInput source="fee" label="Fee" fullWidth />
        </Grid>
      </Grid>
      <ContestantExtrasEditor conferenceId={filterConferenceId} />
    </Grid>
  );
};

type ContestantStatusFilter = 'active' | 'cancelled' | 'all';

const ContestantStatusFilterControl = () => {
  const { filterValues, setFilters } = useListContext();
  const statusValue: ContestantStatusFilter =
    filterValues.status === 'cancelled'
      ? 'cancelled'
      : filterValues.status == null
        ? 'all'
        : 'active';

  const handleStatusChange = (
    _event: React.MouseEvent<HTMLElement>,
    nextStatus: ContestantStatusFilter | null
  ) => {
    if (!nextStatus) return;

    const nextFilters = { ...filterValues };
    if (nextStatus === 'all') {
      delete nextFilters.status;
    } else {
      nextFilters.status = nextStatus;
    }

    setFilters(nextFilters, undefined, false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        mb: 1,
      }}
    >
      <ToggleButtonGroup
        exclusive
        size="small"
        value={statusValue}
        onChange={handleStatusChange}
        aria-label="Contestant status filter"
        sx={{
          bgcolor: 'background.paper',
          '& .MuiToggleButton-root': {
            color: 'text.primary',
            borderColor: 'divider',
            textTransform: 'none',
          },
          '& .Mui-selected': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
            color: 'text.primary',
          },
        }}
      >
        <ToggleButton value="active" aria-label="Show active contestants">
          Active
        </ToggleButton>
        <ToggleButton value="cancelled" aria-label="Show cancelled contestants">
          Cancelled
        </ToggleButton>
        <ToggleButton value="all" aria-label="Show all contestants">
          All
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

const ContestantEditToolbar = () => {
  const resource = useResourceContext();
  const { canOnResource } = useCan();

  if (!canOnResource('update', resource ?? '')) {
    return null;
  }

  return (
    <Card
      sx={{
        backgroundColor: 'action.hover',
        padding: 2,
        borderRadius: 0,
      }}
    >
      <Grid container spacing={2}>
        <Grid item>
          <SaveButton alwaysEnable />
        </Grid>
      </Grid>
    </Card>
  );
};

const cancelledContestantRowSx = {
  backgroundColor: (theme: Theme) => alpha(theme.palette.warning.main, 0.14),
  '&:hover': {
    backgroundColor: (theme: Theme) => alpha(theme.palette.warning.main, 0.2),
  },
} as unknown as SxProps;

const contestantRowSx = (record: RaRecord, _index: number): SxProps =>
  isCancelledContestant({ status: record.status as string | null | undefined })
    ? cancelledContestantRowSx
    : {};

const ConferenceContestants = () => {
  const { isCreating, setIsCreating } = useContext(ConferenceContext);

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
      resource="conference-contestants"
      component={'div'}
    >
      <CustomSecondaryHeader title="Add New Contestant" />
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
            'conference-contestants'
          )
        }
      >
        <ContestantFormFields />
      </SimpleForm>
    </Create>
  ) : (
    <Box>
      <ContestantStatusFilterControl />
      <DatagridConfigurable
        sx={customDatagridStyle}
        rowSx={contestantRowSx}
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
              resource="conference-contestants"
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
                    'conference-contestants'
                  )
                }
                toolbar={<ContestantEditToolbar />}
              >
                <Grid container spacing={2}>
                  <ContestantFormFields />
                </Grid>
              </SimpleForm>
            </Edit>
          );
        }}
      >
        <FunctionField
          source="status"
          label="Status"
          render={(record: RaRecord) => {
            const cancelled = isCancelledContestant({
              status: record.status as string | null | undefined,
            });
            return (
              <Chip
                size="small"
                color={cancelled ? 'warning' : 'success'}
                variant={cancelled ? 'outlined' : 'filled'}
                label={cancelled ? 'Cancelled' : 'Active'}
              />
            );
          }}
        />
        <ReferenceField
          source="team"
          reference="conference-teams"
          label="Team"
          sortBy="team.name"
        >
          <TextField source="name" label="Team" noWrap />
        </ReferenceField>

        <TextField source="organization" label="Organization" noWrap />
        <TextField source="type" label="Type" />
        <ReferenceField
          source="conference_ticket"
          reference="conference-tickets"
          label="Ticket"
          sortBy="conference_ticket.name"
        >
          <TextField source="name" noWrap />
        </ReferenceField>
        <TextField source="first" label="First Name" noWrap />
        <TextField source="last" label="Last Name" noWrap />
        <TextField source="email" label="Email" noWrap />
        <TextField source="phone" label="Phone" noWrap />
        <TextField source="year" label="Year" />
        <DateField source="createdAt" label="Date Registered" />
        <NumberField
          source="fee"
          label="Fee"
          options={CurrencyOptions}
          sortable={false}
        />
        <FunctionField
          sx={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}
          label="Items"
          sortBy="items.label"
          render={(record: RaRecord) => {
            const grouped = groupItemsByExtra(
              (record?.items ?? []) as ISharedMeta[]
            );
            return Array.from(grouped.entries()).map(([groupKey, { label, count }]) => (
              <Chip
                key={`item-${record.id}-${groupKey}`}
                size="small"
                label={`${label} (x${count})`}
              />
            ));
          }}
        />
        <DateField source="cancelled_at" label="Cancelled At" showTime />
        <TextField source="cancelled_reason" label="Reason" />
        <TextField source="cancelled_by" label="Cancelled By" noWrap />
        <FunctionField
          label="Actions"
          sortable={false}
          render={(record: RaRecord) => (
            <ContestantCancellationActions record={record} />
          )}
        />

        {/* Address */}
      </DatagridConfigurable>
    </Box>
  );
};

export default ConferenceContestants;
