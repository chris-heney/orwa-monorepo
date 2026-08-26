import React, { useState } from 'react';
import {
  TextField,
  NumberField,
  Pagination,
  List,
  RaRecord,
  useDataProvider,
  useNotify,
  FunctionField,
  useRefresh,
  DateField,
  useRedirect,
} from 'react-admin';
import { DatagridConfigurable } from "@orwa/entity-id";

import {
  Box,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import { CurrencyOptions } from '../../config/Settings';
import { customDatagridStyle } from '../../css';
import ConfirmInvoicePaymentModal from './components/InvoicePaymentModal';
import ResponsiveListItem from '../_components/ResponsiveListItem';
import InfoIcon from '@mui/icons-material/Info';
import { useMembershipContext } from '../memberships_v2/MembershipsContextProvider';
import { useCan } from '../rbac-manager/useCan';

const InvoicesList = ({ filters }: { filters: any }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<RaRecord | null>(null);

  const { invoicesFilters } = useMembershipContext();

  const dataProvider = useDataProvider();
  const notify = useNotify();
  const redirect = useRedirect();
  const refresh = useRefresh(); // Trigger data refresh after updates
  const { can } = useCan();

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

  const handleConfirmPayment = async (data: { payment_date: string }) => {
    if (!selectedInvoice) return;

    try {
      // Update invoice payment details
      await dataProvider.update('invoices', {
        id: selectedInvoice.id,
        data: {
          payment_date: data.payment_date,
          payment_method: 'Invoice',
        },
        previousData: selectedInvoice,
      });

      // Update associated entity
      if (selectedInvoice.entity_id) {
        const { data: member } = await dataProvider.getOne(
          selectedInvoice.resource,
          { id: selectedInvoice.entity_id }
        );

        await dataProvider.update(selectedInvoice.resource, {
          id: selectedInvoice.entity_id,
          data: {
            payment_last_date: data.payment_date,
            total_years: member.total_years + 1,
          },
          previousData: {},
        });
      }

      notify('Payment successfully confirmed', { type: 'success' });
      setModalOpen(false);
      refresh();
    } catch (error: any) {
      notify(`Error confirming payment: ${error.message}`, { type: 'error' });
    }
  };

  // @TODO Make this reusable please
  const handleNavigate = async (
    resource: string,
    id: string | undefined,
    data: any
  ) => {
    if (!resource) {
      notify('Invalid resource type', { type: 'error' });
      return;
    }

    if (id) {
      // If ID is available, redirect to the resource's edit page
      redirect(`/${resource}/${id}/show`);
    } else if (data) {
      // Search for a matching entity
      try {
        const { data: matchedEntities } = await dataProvider.getList(resource, {
          filter: { name: data.name, email: data.email },
          pagination: { page: 1, perPage: 1 },
          sort: { field: 'id', order: 'ASC' },
        });

        if (matchedEntities.length > 0) {
          const matchedId = matchedEntities[0].id;
          redirect(`/${resource}/${matchedId}/show`);
        } else {
          notify('No matching entity found', { type: 'warning' });
        }
      } catch (error: any) {
        notify(`Error finding entity: ${error.message}`, { type: 'error' });
      }
    } else {
      notify('No ID or matching data provided', { type: 'error' });
    }
  };

  return (
    <List
      component="div"
      resource="invoices"
      filter={{ ...invoicesFilters, ...filters }}
      disableSyncWithLocation
      title=" "
      actions={false}
      pagination={
        <Box sx={{ maxWidth: '32vw', position: 'sticky', left: 0 }}>
          <Pagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            sx={{ flexDirection: 'row-reverse' }}
          />
        </Box>
      }
    >
      {isSmall ? (
        <Typography>Use larger screen to view data</Typography>
      ) : (
        <DatagridConfigurable
          bulkActionButtons={false}
          sx={customDatagridStyle}
          rowClick="expand"
          expandSingle={true}
          isRowExpandable={() => true}
          isRowSelectable={() => false}
          expand={(record: RaRecord) => {
            return (
              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {record.record.payment_method === 'Card' && (
                  <>
                    <Typography variant="h6">Transaction Details</Typography>
                    <Divider />
                    <ResponsiveListItem
                      label="Network Transaction Id"
                      value={record.record.network_trans_id}
                      divider
                    />
                    <ResponsiveListItem
                      label="Transaction Id"
                      value={record.record.transaction_id}
                      divider
                    />
                    <ResponsiveListItem
                      label="Auth Code"
                      value={record.record.auth_code}
                      divider
                    />
                  </>
                )}
                <Typography variant="h6" mt={3}>
                  Payment Details
                </Typography>
                <Divider />
                <Typography
                  variant="body1"
                  ml={2}
                  style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                >
                  {record.record.payment_details}
                </Typography>
              </Box>
            );
          }}
        >
          <FunctionField
            noWrap
            label="Company"
            render={(record: RaRecord) => (
              <>
                <Tooltip title={`View ${record.company}`} placement="top">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => {
                      const resource = record.resource;
                      const id =
                        record.data?.associate ||
                        record.data?.watersystem ||
                        record.entity_id;
                      handleNavigate(resource, id, record.data);
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
                <TextField source="company" label="Company" />
              </>
            )}
          />
          <TextField source="email" label="Email" />
          <NumberField
            source="amount"
            label="Amount"
            options={CurrencyOptions}
          />
          <TextField source="payment_method" label="Payment Method" />
          <DateField source="createdAt" label="Received" />
          {can('update', 'invoice') && (
            <FunctionField
              source="payment_date"
              label="Payment Date"
              render={(record: RaRecord) =>
                record.payment_method === 'Invoice' && !record.payment_date ? (
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{
                      fontSize: '0.75rem',
                    }}
                    onClick={() => {
                      setSelectedInvoice(record);
                      setModalOpen(true);
                    }}
                  >
                    Mark Payment
                  </Button>
                ) : (
                  <DateField source="payment_date" label="Payment Date" />
                )
              }
            />
          )}
        </DatagridConfigurable>
      )}

      <ConfirmInvoicePaymentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        record={selectedInvoice}
        onConfirm={handleConfirmPayment}
      />
    </List>
  );
};

export default InvoicesList;
