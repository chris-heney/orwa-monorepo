import React, { useState } from 'react';
import { MenuItem } from '@mui/material';
import {
  ConfigurableDatagridColumn,
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
      const { data: records } = await dataProvider.getList(resource, {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: 'id', order: 'ASC' },
        filter: type === 'default' ? filterValues ?? {} : {},
        ...(resource === 'watersystems'
          ? { meta: { raw: true, populate: ['contacts'] } }
          : {}),
      });

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
        await NaylorExportWaterSystem(
          records as never,
          availableColumns,
          columnIds,
          fileName,
          dataProvider
        );
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
