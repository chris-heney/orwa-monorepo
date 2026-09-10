import React from 'react';
import { ListView } from 'react-admin';
import { InvoicesGrid, InvoicesPagination } from '../../invoices/InvoicesList';

/**
 * Transactions tab panel — renders INSIDE the tab's `ListScope` (resource
 * `invoices`, permanent filter `{ context: 'membership-form' }` + the
 * "Hide marked payments" preference from the manifest).
 */
const TransactionsPanel = () => (
  <ListView
    component="div"
    title=" "
    actions={false}
    pagination={<InvoicesPagination />}
  >
    <InvoicesGrid />
  </ListView>
);

export default TransactionsPanel;
