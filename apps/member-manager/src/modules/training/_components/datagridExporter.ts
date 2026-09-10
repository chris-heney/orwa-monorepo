import type { ConfigurableDatagridColumn } from 'react-admin';
import type { ListManifest } from '../../../framework/manifest';
import CustomExportFunction from '../../../helpers/custom-export-function';

/**
 * `list.exporter` for the training list pages: exports the columns the user
 * picked in the configurable datagrid (RaStore `preferences.<key>.*`, read
 * through the page ctx) and resolves relations via the data provider.
 */
export const datagridExporter =
  (preferenceKey: string, title: string): NonNullable<ListManifest['exporter']> =>
  (records, ctx, tools) => {
    const availableColumns = ctx.store<ConfigurableDatagridColumn[]>(
      `preferences.${preferenceKey}.availableColumns`,
      []
    );
    const columnIds = ctx.store<string[]>(`preferences.${preferenceKey}.columns`, []);
    void CustomExportFunction(
      records,
      availableColumns,
      columnIds,
      title,
      tools?.dataProvider
    );
  };

export default datagridExporter;
