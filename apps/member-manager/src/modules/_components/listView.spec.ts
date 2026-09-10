import { describe, expect, it } from 'vitest';
import {
  buildListView,
  canRestoreColumns,
  columnsPreferenceKeyFor,
  columnsStorePath,
  SavedListView,
} from './listView';

describe('columnsPreferenceKeyFor', () => {
  it('defaults to the RA convention for the list resource', () => {
    expect(columnsPreferenceKeyFor(undefined, 'watersystems')).toBe(
      'watersystems.datagrid'
    );
  });

  it('honours a manifest override for grids mounted with a custom key', () => {
    // e.g. EventPanelRoster's 'training-event-registrations.datagrid'
    expect(
      columnsPreferenceKeyFor('training-event-registrations.datagrid', 'events')
    ).toBe('training-event-registrations.datagrid');
  });

  it('builds the RaStore path the configurable datagrids read', () => {
    expect(columnsStorePath('watersystems.datagrid')).toBe(
      'preferences.watersystems.datagrid.columns'
    );
  });
});

describe('buildListView', () => {
  const base = { columnsKey: 'watersystems.datagrid' };

  it('captures sort, page size, shown filters and column order', () => {
    expect(
      buildListView({
        ...base,
        sort: { field: 'name', order: 'DESC' },
        perPage: 50,
        displayedFilters: { city: true },
        columns: ['2', '0', '5'],
      })
    ).toEqual({
      sort: { field: 'name', order: 'DESC' },
      perPage: 50,
      displayedFilters: { city: true },
      columns: ['2', '0', '5'],
      columnsKey: 'watersystems.datagrid',
    });
  });

  it('preserves column order, not just membership', () => {
    const view = buildListView({ ...base, columns: ['3', '1', '2'] });
    expect(view.columns).toEqual(['3', '1', '2']);
  });

  it('drops a sort with no field rather than persisting a half-built one', () => {
    expect(buildListView({ ...base, sort: { order: 'ASC' } }).sort).toBeUndefined();
    expect(buildListView(base).sort).toBeUndefined();
  });

  it('normalises any non-DESC order to ASC', () => {
    expect(buildListView({ ...base, sort: { field: 'id' } }).sort).toEqual({
      field: 'id',
      order: 'ASC',
    });
  });

  it('always emits an object for displayedFilters so apply can spread it', () => {
    expect(buildListView(base).displayedFilters).toEqual({});
  });
});

describe('canRestoreColumns', () => {
  const columns = ['1', '0'];

  it('restores columns saved on the same list', () => {
    const view: SavedListView = { columns, columnsKey: 'watersystems.datagrid' };
    expect(canRestoreColumns(view, 'watersystems.datagrid')).toBe(true);
  });

  it('refuses columns captured on a different list', () => {
    const view: SavedListView = { columns, columnsKey: 'associates.datagrid' };
    expect(canRestoreColumns(view, 'watersystems.datagrid')).toBe(false);
  });

  it('trusts legacy rows that predate columnsKey', () => {
    expect(canRestoreColumns({ columns }, 'watersystems.datagrid')).toBe(true);
  });

  it('is a no-op for filters-only saved queries', () => {
    expect(canRestoreColumns(undefined, 'x.datagrid')).toBe(false);
    expect(canRestoreColumns({}, 'x.datagrid')).toBe(false);
    expect(canRestoreColumns({ columns: [] }, 'x.datagrid')).toBe(false);
  });
});
