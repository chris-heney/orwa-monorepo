import React, { useContext } from 'react';
import {
  TextField,
  ReferenceField,
  DateField,
  NumberField,
  RaRecord,
  RecordContextProvider,
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
  useStore,
} from 'react-admin';
import { DatagridConfigurable } from "@orwa/entity-id";
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  Stack,
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
import {
  applyContestantStatusFilter,
  contestantStatusFromFilters,
  CONTESTANT_STATUS_VIEW_STORE_KEY,
  DEFAULT_CONTESTANT_STATUS_FILTER,
} from '../helpers/listQueryFilters';
import type { ContestantStatusFilter } from '../helpers/listQueryFilters';
import {
  contestantCreateDefaults,
  contestantUpdatePayload,
} from '../helpers/contestantFormDefaults';
import { groupItemsByExtra } from '../helpers/contestantExtras';
import ContestantExtrasEditor from './ContestantExtrasEditor';
import ContestantCancellationActions from './ContestantCancellationActions';
import {
  canEditContestant,
  isCancelledContestant,
} from '../helpers/contestantStatus';
import { useCan } from '../../rbac-manager/useCan';

const ContestantFormFields = ({ isEditing = false }: { isEditing?: boolean }) => {
  const { filterValues } = useListContext();
  const filterConferenceId = getPrimaryConferenceId(filterValues);
  const createDefaults = contestantCreateDefaults({
    conference: filterConferenceId,
    year: filterValues.year,
  });

  return (
    <Grid item xs={12} md={12} sx={{ p: 2, overflow: 'hidden' }}>
      <Typography variant="h6">Contestant Info.</Typography>
      <Divider />
      <Grid display={'none'} item xs={12} md={6} lg={4}>
        <ReferenceInput
          source="conference"
          reference="conferences"
          label="Conference"
          disabled={isEditing}
        >
          <AutocompleteInput
            optionText="name"
            fullWidth
            defaultValue={createDefaults.conference}
            helperText={false}
            disabled={isEditing}
          />
        </ReferenceInput>
      </Grid>
      <Grid display={'none'} item xs={12} md={6} lg={4}>
        <NumberInput
          source="year"
          label="Year"
          defaultValue={createDefaults.year}
          fullWidth
          helperText={false}
          validate={required('Year is required')}
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
            disabled={isEditing}
          >
            <AutocompleteInput
              optionText={'name'}
              helperText={false}
              validate={required('Conference Ticket is required')}
              disabled={isEditing}
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

const ContestantStatusFilterControl = () => {
  const { filterValues, setFilters } = useListContext();
  // The list store is keyed on the current tab filters, so it is rebuilt
  // whenever the conference or year changes. Persisting the view separately
  // keeps the operator's choice through those remounts.
  const [, setStoredStatus] = useStore<ContestantStatusFilter>(
    CONTESTANT_STATUS_VIEW_STORE_KEY,
    DEFAULT_CONTESTANT_STATUS_FILTER
  );
  const statusValue = contestantStatusFromFilters(filterValues);

  const handleStatusChange = (
    _event: React.MouseEvent<HTMLElement>,
    nextStatus: ContestantStatusFilter | null
  ) => {
    if (!nextStatus) return;

    setStoredStatus(nextStatus);
    setFilters(
      applyContestantStatusFilter(filterValues, nextStatus),
      undefined,
      false
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        // The contestant table is wider than the viewport and the dashboard
        // scrolls sideways as a whole, so aligning right put this control
        // ~2600px out and the operator never saw it. The left edge is where an
        // unscrolled page starts, on a phone as much as on a desktop.
        justifyContent: 'flex-start',
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

const contestantRecordStatus = (record: RaRecord) => ({
  status: record.status as string | null | undefined,
});

const ContestantItemsChips = ({ record }: { record: RaRecord }) => {
  const grouped = groupItemsByExtra((record?.items ?? []) as ISharedMeta[]);

  return (
    <>
      {Array.from(grouped.entries()).map(([groupKey, { label, count }]) => (
        <Chip
          key={`item-${record.id}-${groupKey}`}
          size="small"
          label={`${label} (x${count})`}
        />
      ))}
    </>
  );
};

const ContestantEditToolbar = ({ record }: { record: RaRecord }) => {
  const resource = useResourceContext();
  const { canOnResource } = useCan();
  const canSave =
    canOnResource('update', resource ?? '') &&
    canEditContestant(contestantRecordStatus(record));

  return (
    <Card
      sx={{
        backgroundColor: 'action.hover',
        padding: 2,
        borderRadius: 0,
      }}
    >
      <Grid container spacing={2}>
        {canSave && (
          <Grid item>
            <SaveButton alwaysEnable />
          </Grid>
        )}
        <Grid item sx={{ marginLeft: 'auto' }}>
          <ContestantCancellationActions record={record} />
        </Grid>
      </Grid>
    </Card>
  );
};

const ReadOnlyValue = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <Grid item xs={12} md={6} lg={4}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2">{children || 'Not recorded'}</Typography>
  </Grid>
);

const ContestantReadonlyExpansion = ({ record }: { record: RaRecord }) => (
  <RecordContextProvider value={record}>
    <Card
      sx={{
        ...positionStickyComponent,
        p: 2,
        bgcolor: 'background.paper',
        border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h6">Cancelled Contestant</Typography>
          <Typography variant="body2" color="text.secondary">
            Historical contestant details are read-only. Restore remains
            available for authorized roles.
          </Typography>
        </Box>
        <ContestantCancellationActions record={record} />
      </Stack>

      <Grid container spacing={2}>
        <ReadOnlyValue label="First Name">{record.first}</ReadOnlyValue>
        <ReadOnlyValue label="Last Name">{record.last}</ReadOnlyValue>
        <ReadOnlyValue label="Organization">{record.organization}</ReadOnlyValue>
        <ReadOnlyValue label="Email">{record.email}</ReadOnlyValue>
        <ReadOnlyValue label="Phone">{record.phone}</ReadOnlyValue>
        <ReadOnlyValue label="Type">{record.type}</ReadOnlyValue>
        <Grid item xs={12} md={6} lg={4}>
          <Typography variant="caption" color="text.secondary">
            Ticket
          </Typography>
          <Typography variant="body2">
            <ReferenceField
              source="conference_ticket"
              reference="conference-tickets"
              link={false}
            >
              <TextField source="name" />
            </ReferenceField>
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Typography variant="caption" color="text.secondary">
            Fee
          </Typography>
          <Typography variant="body2">
            <NumberField
              source="fee"
              options={CurrencyOptions}
              sortable={false}
            />
          </Typography>
        </Grid>
        <ReadOnlyValue label="Cancelled By">{record.cancelled_by}</ReadOnlyValue>
        <Grid item xs={12} md={6} lg={4}>
          <Typography variant="caption" color="text.secondary">
            Cancelled At
          </Typography>
          <Typography variant="body2">
            <DateField source="cancelled_at" showTime />
          </Typography>
        </Grid>
        <ReadOnlyValue label="Reason">{record.cancelled_reason}</ReadOnlyValue>
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary">
            Items
          </Typography>
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            <ContestantItemsChips record={record} />
          </Stack>
        </Grid>
      </Grid>
    </Card>
  </RecordContextProvider>
);

const cancelledContestantRowSx = {
  backgroundColor: (theme: Theme) => alpha(theme.palette.warning.main, 0.14),
  '&:hover': {
    backgroundColor: (theme: Theme) => alpha(theme.palette.warning.main, 0.2),
  },
} as unknown as SxProps;

const contestantRowSx = (record: RaRecord, _index: number): SxProps =>
  isCancelledContestant(contestantRecordStatus(record))
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
          if (!canEditContestant(contestantRecordStatus(record))) {
            return <ContestantReadonlyExpansion record={record} />;
          }

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
                    contestantUpdatePayload(formData),
                    record,
                    update,
                    notify,
                    remove,
                    'conference-contestants'
                  )
                }
                toolbar={<ContestantEditToolbar record={record} />}
              >
                <Grid container spacing={2}>
                  <ContestantFormFields isEditing />
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
            const cancelled = isCancelledContestant(contestantRecordStatus(record));
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
            return <ContestantItemsChips record={record} />;
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
