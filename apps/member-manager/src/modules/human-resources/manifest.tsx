import React from 'react';
import PeopleIcon from '@mui/icons-material/Groups';
import { useGetOne, useRecordContext } from 'react-admin';
import type { Identifier, RaRecord } from 'react-admin';
import type { ModuleManifest, PageCtx } from '../../framework/manifest';
import { pageView } from '../../framework/registry';
import {
  columnsAction,
  createAction,
  editRecordAction,
  exportAction,
  searchAction,
} from '../../framework/actions';
import Contacts from './contacts';
import Staff from './staff';
import Users from './users';
import ActivityFeed from '../activity';
import ContactsPanel from './contacts/ContactList';
import ContactFilters from './contacts/ContactFilters';
import ContactShowBody from './contacts/ContactShow';
import StaffShowBody from './staff/StaffShow';
import CustomContactExport from './contacts/CustomContactExport';

/** Dashboard the Contacts / Staff show pages return to. */
export const CONTACTS_DASHBOARD = '/human-resources/dashboard';

/** DatagridConfigurable prefs the CSV export honours (same keys the grid writes). */
const CONTACT_COLUMN_PREFS = {
  available: 'preferences.contacts.datagrid.availableColumns',
  selected: 'preferences.contacts.datagrid.columns',
};

const fullName = (record: RaRecord | undefined) =>
  `${record?.first ?? ''} ${record?.last ?? ''}`.trim();

const personTitle = (fallback: string) => (ctx: PageCtx) =>
  fullName(ctx.record) || fallback;

/** Staff rows carry the contact as a relation id — resolve the name for the bar. */
const StaffShowTitle = () => {
  const record = useRecordContext();
  const raw = record?.contact as RaRecord | Identifier | null | undefined;
  const inline = raw != null && typeof raw === 'object' ? raw : undefined;
  const contactId: Identifier | undefined = inline
    ? (inline.documentId as Identifier | undefined) ?? inline.id
    : (raw as Identifier | null | undefined) ?? undefined;
  const { data: contact } = useGetOne(
    'contacts',
    { id: contactId as Identifier },
    { enabled: contactId != null && contactId !== '' && !fullName(inline) }
  );
  return <>{fullName(inline) || fullName(contact) || 'Staff'}</>;
};

/**
 * Contacts (legacy "Human Resources") — proposal §5 step 6.
 *
 * One tab-less `kind: 'list'` page owns the Contacts ListBase (count, Add,
 * Export, Columns, Filters drawer and the collapsible search all read it);
 * Contact / Staff show pages are `kind: 'show'` pages so Back lands far
 * right by construction. Staff / Instructors / Users lists live on Settings.
 */
export const contactsModule: ModuleManifest = {
  id: 'contacts',
  title: 'Contacts',
  icon: PeopleIcon,
  menu: { label: 'Contacts', to: CONTACTS_DASHBOARD },
  permissions: {
    pathPrefixes: [
      '/human-resources',
      '/contacts',
      '/staff',
      '/users',
      '/activities',
    ],
    resources: ['contacts', 'staff', 'users', 'activities', 'activity-relations'],
  },
  resources: {
    contacts: {
      ...Contacts,
      list: pageView('contacts.list'),
      show: pageView('contacts.contactShow'),
    },
    staff: { ...Staff, show: pageView('contacts.staffShow') },
    users: Users,
    activities: ActivityFeed,
    'activity-relations': {},
  },
  pages: [
    {
      id: 'contacts.list',
      route: 'human-resources/dashboard',
      kind: 'list',
      titleBar: {
        title: 'Contacts',
        showCount: true,
        search: { placeholder: 'Search contacts by name, email, phone, or title…' },
      },
      list: {
        resource: 'contacts',
        filterBody: ContactFilters,
        exporter: (_records, ctx, { dataProvider }) =>
          CustomContactExport(
            'contacts',
            ctx.store(CONTACT_COLUMN_PREFS.available, []),
            ctx.store(CONTACT_COLUMN_PREFS.selected, []),
            dataProvider,
            `Contacts-${new Date().toLocaleDateString()}`
          ),
      },
      actions: [
        createAction('contacts', { label: 'Add Contact' }),
        exportAction,
        columnsAction,
        { ...searchAction, order: 85 },
      ],
      body: ContactsPanel,
    },
    {
      id: 'contacts.contactShow',
      kind: 'show',
      record: { resource: 'contacts' },
      titleBar: {
        title: personTitle('Contact'),
        appBarTitle: 'Contact',
        back: CONTACTS_DASHBOARD,
        backLabel: 'Dashboard',
      },
      actions: [editRecordAction('contacts', { label: 'Edit Contact' })],
      body: ContactShowBody,
    },
    {
      id: 'contacts.staffShow',
      kind: 'show',
      record: { resource: 'staff' },
      titleBar: {
        title: () => <StaffShowTitle />,
        appBarTitle: 'Staff',
        back: CONTACTS_DASHBOARD,
        backLabel: 'Dashboard',
      },
      actions: [editRecordAction('staff', { label: 'Edit Staff' })],
      body: StaffShowBody,
    },
  ],
};

export default contactsModule;
