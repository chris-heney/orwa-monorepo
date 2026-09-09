/** @vitest-environment jsdom */
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  CoreAdminContext,
  ListBase,
  memoryStore,
  useGetOne,
  useListContext,
} from 'react-admin';
import { listParamsForTab, listQueryKey, oneQueryKey } from './prefetch';
import type { PageCtx, TabManifest } from './manifest';
import SettingsIcon from '@mui/icons-material/Settings';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * Proposal §6.8: the prefetch key must be byte-identical to the key
 * react-admin's own controllers build, or `setTab()` prefetches are wasted.
 * This mounts the real `ListBase` / `useGetOne` against a stub provider and
 * compares the cache keys with ours. An RA upgrade that changes the shape
 * fails here instead of silently double-fetching in production.
 */

const dataProvider: any = {
  getList: async () => ({ data: [{ id: 1 }], total: 1 }),
  getOne: async () => ({ data: { id: 1 } }),
  getMany: async () => ({ data: [] }),
  getManyReference: async () => ({ data: [], total: 0 }),
  create: async () => ({ data: {} }),
  update: async () => ({ data: {} }),
  updateMany: async () => ({ data: [] }),
  delete: async () => ({ data: {} }),
  deleteMany: async () => ({ data: [] }),
};

let root: Root | undefined;
let container: HTMLDivElement | undefined;

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
});

const mount = async (qc: QueryClient, ui: React.ReactElement) => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => {
    root!.render(
      <QueryClientProvider client={qc}>
        <CoreAdminContext
          dataProvider={dataProvider}
          queryClient={qc}
          store={memoryStore()}
        >
          {ui}
        </CoreAdminContext>
      </QueryClientProvider>
    );
  });
  await act(async () => {
    await new Promise((r) => setTimeout(r, 20));
  });
};

const ctx: PageCtx = {
  moduleId: 'emails',
  pageId: 'emails.dashboard',
  selectedIds: [],
  can: () => true,
  store: (_k, fb) => fb,
  params: {},
  isSmall: false,
};

describe('listQueryKey', () => {
  it('matches the key ListBase/useGetList stores in the query cache', async () => {
    const qc = new QueryClient();
    const tab: TabManifest = {
      key: 'email-templates',
      label: 'Emails',
      icon: SettingsIcon,
      panel: () => null,
      list: {
        resource: 'email-templates',
        filter: { module: 'Training' },
        sort: { field: 'email_name', order: 'ASC' },
        perPage: 10,
        meta: { populate: '*' },
      },
    };
    const Probe = () => {
      useListContext();
      return null;
    };
    await mount(
      qc,
      <ListBase
        resource="email-templates"
        storeKey="emails.dashboard.email-templates"
        filter={{ module: 'Training' }}
        sort={{ field: 'email_name', order: 'ASC' }}
        perPage={10}
        queryOptions={{ meta: { populate: '*' } }}
        disableSyncWithLocation
      >
        <Probe />
      </ListBase>
    );
    const cached = qc
      .getQueryCache()
      .getAll()
      .map((q) => q.queryKey)
      .find((k) => Array.isArray(k) && k[1] === 'getList');
    expect(cached).toBeDefined();
    const ours = listQueryKey(
      'email-templates',
      listParamsForTab(memoryStore(), tab, ctx)
    );
    expect(JSON.stringify(ours)).toBe(JSON.stringify(cached));
  });
});

describe('oneQueryKey', () => {
  it('matches the key useGetOne stores in the query cache', async () => {
    const qc = new QueryClient();
    const Probe = () => {
      useGetOne('grants', { id: 7, meta: { raw: true } });
      return null;
    };
    await mount(qc, <Probe />);
    const cached = qc
      .getQueryCache()
      .getAll()
      .map((q) => q.queryKey)
      .find((k) => Array.isArray(k) && k[1] === 'getOne');
    expect(JSON.stringify(oneQueryKey('grants', 7, { raw: true }))).toBe(
      JSON.stringify(cached)
    );
  });
});
