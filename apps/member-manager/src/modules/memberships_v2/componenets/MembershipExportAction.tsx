import React, { useState } from 'react';
import { MenuItem } from '@mui/material';
import {
  ConfigurableDatagridColumn,
  RaRecord,
  useDataProvider,
  useListContext,
  useNotify,
  useStore,
} from 'react-admin';
import { HeadingSelect } from '../../_components/heading/HeadingActions';
import { NaylorExportWaterSystem } from '../helpers/naylorExportWaterSystem';
import { NaylorExportAssociate } from '../helpers/naylorExportAssociate';
import { defaultWatersystemExport } from '../helpers/defaultWatersystemExport';
import { defaultAssociateExport } from '../helpers/defaultAssociateExport';

type ExportType = 'default' | 'naylor';

/** Records per export request, and a hard stop so a bad `total` cannot spin. */
const EXPORT_PAGE_SIZE = 1000;
const EXPORT_MAX_PAGES = 50;

const TITLES: Record<string, string> = {
  watersystems: 'Watersystems',
  associates: 'Associates',
};

/**
 * Default / Naylor export dropdown for the Water Systems and Associates tabs.
 * Reads the tab's ListScope (resource + the user's current filter values) so
 * the export matches what the grid shows; column selection comes from the
 * DatagridConfigurable preferences.
 */
export const MembershipExportAction = () => {
  const { resource, filterValues } = useListContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [exportType, setExportType] = useState<string>('');

  const preferenceKey = `${resource}.datagrid`;
  const [availableColumns] = useStore<ConfigurableDatagridColumn[]>(
    `preferences.${preferenceKey}.availableColumns`,
    []
  );
  const [columnIds] = useStore<string[]>(
    `preferences.${preferenceKey}.columns`,
    []
  );

  const handleExport = async (type: ExportType) => {
    if (resource !== 'watersystems' && resource !== 'associates') return;
    const title = TITLES[resource] ?? resource;
    const fileName = `${title}-${new Date().toLocaleDateString()}`;
    try {
      // Every export runs its OWN query, never the grid's rows. The Default
      // export honours the user's filters; the Naylor file is the published
      // directory, so it ignores the grid's filters, sort and columns entirely
      // and always re-reads every record.
      const records: RaRecord[] = [];
      let expected: number | undefined;
      for (let page = 1; page <= EXPORT_MAX_PAGES; page += 1) {
        const { data, total } = await dataProvider.getList(resource, {
          pagination: { page, perPage: EXPORT_PAGE_SIZE },
          sort: { field: 'id', order: 'ASC' },
          filter: type === 'default' ? filterValues ?? {} : {},
          ...(resource === 'watersystems'
            ? { meta: { raw: true, populate: ['contacts'] } }
            : {}),
        });
        records.push(...data);
        if (typeof total === 'number') expected = total;
        const done =
          data.length === 0 ||
          (expected !== undefined
            ? records.length >= expected
            : data.length < EXPORT_PAGE_SIZE);
        if (done) break;
      }
      // A directory that silently stops at the page size is worse than no file.
      if (expected !== undefined && records.length < expected) {
        throw new Error(
          `only ${records.length} of ${expected} ${title} could be read`
        );
      }

      if (type === 'default') {
        if (resource === 'watersystems') {
          await defaultWatersystemExport(
            records,
            availableColumns,
            columnIds,
            fileName,
            dataProvider
          );
        } else {
          await defaultAssociateExport(
            records,
            availableColumns,
            columnIds,
            fileName,
            dataProvider
          );
        }
      } else if (resource === 'watersystems') {
        await NaylorExportWaterSystem(records as never, fileName, dataProvider);
      } else {
        await NaylorExportAssociate(records as never, fileName, dataProvider);
      }
    } catch (error) {
      notify(`Export failed: ${(error as Error).message}`, { type: 'error' });
    } finally {
      // Reset the select so the placeholder shows again.
      setExportType('');
    }
  };

  return (
    <HeadingSelect
      emptyLabel="EXPORT"
      value={exportType}
      onChange={(e) => {
        const next = e.target.value as string;
        setExportType(next);
        if (next === 'default' || next === 'naylor') void handleExport(next);
      }}
    >
      <MenuItem value="" disabled>
        EXPORT
      </MenuItem>
      <MenuItem value="default">Default Export</MenuItem>
      <MenuItem value="naylor">Naylor Export</MenuItem>
    </HeadingSelect>
  );
};

export default MembershipExportAction;
