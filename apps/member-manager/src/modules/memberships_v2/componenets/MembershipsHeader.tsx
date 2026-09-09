import React, { useState } from 'react';
import { useMembershipContext } from '../MembershipsContextProvider';
import {
  Box,
  Typography,
  MenuItem,
  Popover,
  Switch,
  Divider,
} from '@mui/material';
import PageHeadingBar from '../../_components/PageHeadingBar';
import HeadingAction from '../../_components/heading/HeadingAction';
import {
  CreateAction,
  FilterAction,
  HeadingSelect,
} from '../../_components/heading/HeadingActions';
import {
  Button,
  ConfigurableDatagridColumn,
  FieldTitle,
  ListBase,
  useStore,
  useDataProvider,
  useResourceContext,
  useTranslate,
} from 'react-admin';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import RecordCount from '../../_components/RecordCount';
import { NaylorExportWaterSystem } from '../helpers/naylorExportWaterSystem';
import { NaylorExportAssociate } from '../helpers/naylorExportAssociate';
import { useCan } from '../../rbac-manager/useCan';
import { defaultWatersystemExport } from '../helpers/defaultWatersystemExport';
import { defaultAssociateExport } from '../helpers/defaultAssociateExport';
import { styled } from '@mui/material/styles';

const FieldToggleItem = styled('li')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  paddingLeft: 0,
  '& svg': {
    cursor: 'move',
  },
  '&.drag-active': {
    background: 'transparent',
    color: 'transparent',
    outline: `1px solid ${theme.palette.action.selected}`,
    '& .MuiSwitch-root, & svg': {
      visibility: 'hidden',
    },
  },
}));

/**
 * Columns picker with Select All / Unselect All and drag re-ordering (react-admin's
 * SelectColumnsButton lacks the bulk toggles). Trigger is the standard 32px
 * heading action so it lines up with the other presets.
 */
const CustomSelectColumnsButton = (props: { preferenceKey?: string }) => {
  const { preferenceKey: prefKey } = props;
  const resource = useResourceContext();
  const finalPreferenceKey = prefKey || `${resource}.datagrid`;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [availableColumns, setAvailableColumns] = useStore<
    ConfigurableDatagridColumn[]
  >(`preferences.${finalPreferenceKey}.availableColumns`, []);
  const [omit] = useStore<string[]>(
    `preferences.${finalPreferenceKey}.omit`,
    []
  );
  const [columns, setColumns] = useStore<string[]>(
    `preferences.${finalPreferenceKey}.columns`,
    availableColumns
      .filter((column) => !omit?.includes(column.source ?? ''))
      .map((column) => column.index)
  );
  const translate = useTranslate();

  const title = translate('ra.action.select_columns', { _: 'Columns' });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setColumns(
        availableColumns
          .filter(
            (column) =>
              column.index === event.target.name ||
              columns.includes(column.index)
          )
          .map((column) => column.index)
      );
    } else {
      setColumns(columns.filter((index) => index !== event.target.name));
    }
  };

  const handleMove = (index1: string, index2: string) => {
    const index1Pos = availableColumns.findIndex(
      (field) => field.index == index1
    );
    const index2Pos = availableColumns.findIndex(
      (field) => field.index == index2
    );
    if (index1Pos === -1 || index2Pos === -1) return;

    let newAvailableColumns: ConfigurableDatagridColumn[];
    if (index1Pos > index2Pos) {
      newAvailableColumns = [
        ...availableColumns.slice(0, index2Pos),
        availableColumns[index1Pos],
        ...availableColumns.slice(index2Pos, index1Pos),
        ...availableColumns.slice(index1Pos + 1),
      ];
    } else {
      newAvailableColumns = [
        ...availableColumns.slice(0, index1Pos),
        ...availableColumns.slice(index1Pos + 1, index2Pos + 1),
        availableColumns[index1Pos],
        ...availableColumns.slice(index2Pos + 1),
      ];
    }
    setAvailableColumns(newAvailableColumns);
    setColumns((prev) =>
      newAvailableColumns
        .filter((column) => prev.includes(column.index))
        .map((column) => column.index)
    );
  };

  const handleSelectAll = () => {
    setColumns(availableColumns.map((column) => column.index));
  };

  const handleUnselectAll = () => {
    setColumns([]);
  };

  return (
    <>
      <HeadingAction
        icon={<ViewWeekIcon fontSize="small" />}
        label={title}
        onClick={handleClick}
        active={Boolean(anchorEl)}
      />
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box display="flex" justifyContent="center" gap={1} p={1}>
          <Button
            label="Select All"
            size="small"
            onClick={handleSelectAll}
            style={{ color: '#1976d2' }}
          >
            <RestartAltIcon />
          </Button>
          <Button
            label="Unselect All"
            size="small"
            onClick={handleUnselectAll}
            style={{ color: '#d32f2f' }}
          >
            <RestartAltIcon />
          </Button>
        </Box>
        <Divider />
        <Box component="ul" p={1} my={0}>
          {availableColumns.map((column) => (
            <FieldToggleRow
              key={column.index}
              source={column.source}
              label={column.label}
              index={column.index}
              selected={columns.includes(column.index)}
              onToggle={handleToggle}
              onMove={handleMove}
            />
          ))}
        </Box>
      </Popover>
    </>
  );
};

const FieldToggleRow = (props: {
  selected: boolean;
  label?: string;
  onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onMove: (index1: string, index2: string) => void;
  source?: string;
  index: string;
}) => {
  const { selected, label, onToggle, onMove, source, index } = props;
  const resource = useResourceContext();
  const dropIndex = React.useRef<string | null>(null);
  const x = React.useRef<number>(0);
  const y = React.useRef<number>(0);

  const handleDocumentDragOver = React.useCallback((event: DragEvent) => {
    x.current = event.clientX;
    y.current = event.clientY;
  }, []);

  const handleDragStart = () => {
    document.addEventListener('dragover', handleDocumentDragOver);
  };

  const handleDrag = (event: React.DragEvent<HTMLLIElement>) => {
    const selectedItem = event.target as HTMLElement;
    selectedItem.classList.add('drag-active');
    const list = selectedItem.closest('ul');
    let dropItem =
      document.elementFromPoint(x.current, y.current) === null
        ? selectedItem
        : (
            document.elementFromPoint(x.current, y.current) as HTMLElement
          )?.closest('li');

    if (!dropItem) return;
    if (dropItem.classList.contains('dragIcon')) {
      dropItem = dropItem.parentNode as HTMLElement;
    }
    if (dropItem === selectedItem) return;
    if (list === (dropItem.parentNode as HTMLElement)?.closest('ul')) {
      dropIndex.current = (dropItem as HTMLElement).dataset.index ?? null;
      if (dropItem === selectedItem.nextSibling) {
        dropItem = dropItem.nextSibling as HTMLElement;
      }
      list?.insertBefore(selectedItem, dropItem);
    }
  };

  const handleDragEnd = (event: React.DragEvent<HTMLLIElement>) => {
    const selectedItem = event.target as HTMLElement;
    const list = selectedItem.closest('ul');
    let dropItem =
      document.elementFromPoint(x.current, y.current) === null
        ? selectedItem
        : (
            document.elementFromPoint(x.current, y.current) as HTMLElement
          )?.closest('li');

    if (!dropItem) {
      if (
        y.current >
        (selectedItem.closest('ul')?.getBoundingClientRect().bottom ?? 0)
      ) {
        dropItem = list?.lastChild as HTMLElement;
      } else {
        dropItem = list?.firstChild as HTMLElement;
      }
    }

    if (dropItem && list === dropItem.closest('ul')) {
      onMove(selectedItem.dataset.index!, dropIndex.current!);
    } else {
      event.preventDefault();
      event.stopPropagation();
    }
    selectedItem.classList.remove('drag-active');
    document.removeEventListener('dragover', handleDocumentDragOver);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLIElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  return (
    <FieldToggleItem
      key={source}
      draggable="true"
      onDrag={handleDrag}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      data-index={index}
    >
      <label htmlFor={`switch_${index}`}>
        <Switch
          checked={selected}
          onChange={onToggle}
          name={index}
          id={`switch_${index}`}
          size="small"
          sx={{ mr: 0.5, ml: -0.5 }}
        />
        <Typography variant="body2" component="span">
          <FieldTitle label={label} source={source} resource={resource} />
        </Typography>
      </label>
      <DragIndicatorIcon
        className="dragIcon"
        color="disabled"
        fontSize="small"
      />
    </FieldToggleItem>
  );
};

const Membershipheader = () => {
  const {
    selectedTab,
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    watersystemFilters,
    associateFilters,
    isSettingsOpen,
    isGridView,
    setIsGridView,
  } = useMembershipContext();

  const { canOnResource } = useCan();

  const resource = selectedTab === 'summary' ? null : selectedTab;
  const title =
    selectedTab === 'invoices'
      ? 'Transactions'
      : selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1);

  const preferenceKey = `${resource}.datagrid`;

  const [availableColumns] = useStore<ConfigurableDatagridColumn[]>(
    `preferences.${preferenceKey}.availableColumns`,
    []
  );

  const [columnIds] = useStore<string[]>(
    `preferences.${preferenceKey}.columns`,
    []
  );

  const dataProvider = useDataProvider();
  const [exportType, setExportType] = useState<string>('');

  const handleExport = async (exportType: string) => {
    if (!resource) {
      console.error('Resource is null, cannot perform export.');
      return;
    }

    const { data: records } = await dataProvider.getList(resource, {
      pagination: { page: 1, perPage: 1000 }, // Adjust pagination as needed
      sort: { field: 'id', order: 'ASC' }, // Adjust sorting as needed
      filter:
        exportType === 'default'
          ? resource === 'watersystems'
            ? watersystemFilters
            : associateFilters
          : {},
      ...(resource === 'watersystems'
        ? { meta: { raw: true, populate: ['contacts'] } }
        : {}),
    });

    if (exportType === 'default') {
      if (resource === 'watersystems') {
        defaultWatersystemExport(
          records,
          availableColumns,
          columnIds,
          `${title}-${new Date().toLocaleDateString()}`,
          dataProvider
        );
      } else if (resource === 'associates') {
        defaultAssociateExport(
          records,
          availableColumns,
          columnIds,
          `${title}-${new Date().toLocaleDateString()}`,
          dataProvider
        );
      }
    } else if (exportType === 'naylor') {
      if (resource === 'watersystems') {
        NaylorExportWaterSystem(
          records,
          availableColumns,
          columnIds,
          `${title}-${new Date().toLocaleDateString()}`,
          dataProvider
        );
      } else if (resource === 'associates') {
        NaylorExportAssociate(
          records,
          `${title}-${new Date().toLocaleDateString()}`,
          dataProvider
        );
      }
    }

    // Reset the select input after export
    setExportType('');
  };

  const handleViewToggle = () => {
    setIsGridView(!isGridView);
  };

  return (
    <PageHeadingBar
      title={isSettingsOpen ? 'Settings' : title}
      actions={
        resource !== null && !isSettingsOpen ? (
          <ListBase
            disableSyncWithLocation
            exporter={undefined}
            filter={
              resource === 'watersystems'
                ? watersystemFilters
                : resource === 'associates'
                ? associateFilters
                : {}
            }
            resource={resource}
          >
            <RecordCount />
            {canOnResource('create', resource) && (
              <CreateAction label={`Add ${title.slice(0, title.length - 1)}`} />
            )}

            <CustomSelectColumnsButton />

            <HeadingSelect
              emptyLabel="EXPORT"
              value={exportType}
              onChange={(e) => {
                setExportType(e.target.value as string);
                handleExport(e.target.value as string);
              }}
            >
              <MenuItem value="" disabled>
                EXPORT
              </MenuItem>
              <MenuItem value="default">Default Export</MenuItem>
              <MenuItem value="naylor">Naylor Export</MenuItem>
            </HeadingSelect>

            {/* Grid View Toggle Button - Only show for associates */}
            {resource === 'associates' && (
              <HeadingAction
                icon={
                  isGridView ? (
                    <ViewListIcon fontSize="small" />
                  ) : (
                    <GridViewIcon fontSize="small" />
                  )
                }
                label={
                  isGridView ? 'Switch to List View' : 'Switch to Grid View'
                }
                onClick={handleViewToggle}
              />
            )}

            <FilterAction
              active={isFilterSidebarOpen}
              onClick={() => {
                setIsFilterSidebarOpen((prev) => !prev);
                setTimeout(() => {
                  window.scrollTo(document.body.scrollWidth, 0);
                }, 150);
              }}
            />
          </ListBase>
        ) : undefined
      }
    />
  );
};

export default Membershipheader;
