import React from 'react';
import { Box, Select, SelectProps, Tooltip } from '@mui/material';
import {
  Exporter,
  ExportButton,
  ExportButtonProps,
  SelectColumnsButton,
  useListContext,
  useNotify,
} from 'react-admin';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import HeadingAction, {
  HeadingActionProps,
  HEADING_ACTION_SIZE,
} from './HeadingAction';
import { useActionLabels } from '../../../helpers/useActionLabels';
import CreateButton, { CreateButtonProps } from '../CustomCreateButton';

type PresetProps = Omit<HeadingActionProps, 'icon' | 'label'> & {
  label?: string;
};

/** Standard heading-bar actions — identical look across every module. */

/**
 * RBAC-gated "create" link for list headings (react-admin CreateButton).
 * Icon-only 32px when labels are off (layout CSS), icon + text when on.
 */
export const CreateAction = ({
  label = 'Add New',
  ...rest
}: Omit<CreateButtonProps, 'label'> & { label?: string }) => (
  <CreateButton
    size="small"
    label={label}
    {...rest}
    sx={{ color: 'white', minWidth: 0, ...(rest.sx as object) }}
  />
);

export const EditAction = ({ label, ...rest }: PresetProps) => (
  <HeadingAction
    icon={<EditIcon fontSize="small" />}
    label={label ?? 'Edit'}
    {...rest}
  />
);

/** Toggles a collapsible search row under the bar (pass `active`). */
export const SearchAction = ({ label, ...rest }: PresetProps) => (
  <HeadingAction
    icon={<SearchIcon fontSize="small" />}
    label={label ?? 'Search'}
    {...rest}
  />
);

/** Opens the Notifications (email templates) right drawer. */
export const NotificationsAction = ({ label, ...rest }: PresetProps) => (
  <HeadingAction
    icon={<EmailIcon fontSize="small" />}
    label={label ?? 'Notifications'}
    {...rest}
  />
);

/** Opens the Activity Feed right drawer. */
export const ActivityAction = ({ label, ...rest }: PresetProps) => (
  <HeadingAction
    icon={<MarkunreadMailboxIcon fontSize="small" />}
    label={label ?? 'Activity Feed'}
    {...rest}
  />
);

export const RefreshAction = ({ label, ...rest }: PresetProps) => (
  <HeadingAction
    icon={<RefreshIcon fontSize="small" />}
    label={label ?? 'Refresh'}
    {...rest}
  />
);

export const FilterAction = ({ label, ...rest }: PresetProps) => (
  <HeadingAction
    icon={<FilterAltIcon fontSize="small" />}
    label={label ?? 'Filters'}
    {...rest}
  />
);

export const AddAction = ({ label, ...rest }: PresetProps) => (
  <HeadingAction
    icon={<AddIcon fontSize="small" />}
    label={label ?? 'Add'}
    {...rest}
  />
);

export const BackAction = ({ label, ...rest }: PresetProps) => (
  <HeadingAction
    icon={<ArrowBackIcon fontSize="small" />}
    label={label ?? 'Back'}
    {...rest}
  />
);

export const ShowAction = ({ label, ...rest }: PresetProps) => (
  <HeadingAction
    icon={<VisibilityIcon fontSize="small" />}
    label={label ?? 'Show'}
    {...rest}
  />
);

export const SettingsAction = ({ label, ...rest }: PresetProps) => (
  <HeadingAction
    icon={<SettingsIcon fontSize="small" />}
    label={label ?? 'Settings'}
    {...rest}
  />
);

/**
 * react-admin's Columns/Export buttons, obeying the labels preference.
 * RA renders just the icon when `label` is empty.
 */
export const ColumnsAction = ({
  style,
}: {
  style?: React.CSSProperties;
}) => {
  const [showLabels] = useActionLabels();
  // SelectColumnsButton hardcodes its "Columns" text (ignores `label`). When
  // icon-only, collapse the button's font-size to 0 to hide the text while the
  // icon keeps its own SvgIcon size.
  return (
    <Box
      sx={{
        display: 'inline-flex',
        '& .MuiButton-root': {
          color: 'white',
          minWidth: 0,
          px: 0.75,
          ...(showLabels
            ? {}
            : {
                fontSize: 0,
                width: HEADING_ACTION_SIZE,
                height: HEADING_ACTION_SIZE,
                '& .MuiButton-startIcon': { mr: 0, ml: 0 },
              }),
        },
        '& .MuiSvgIcon-root': { fontSize: '1.25rem' },
      }}
    >
      <SelectColumnsButton style={{ color: 'white', ...style }} />
    </Box>
  );
};

/**
 * Export with progress feedback.
 *
 * A CSV download is silent between the click and the file landing — on a large
 * list that reads as a dead button. Announce the row count on click and
 * confirm when the file is written, wrapping whichever exporter is in play
 * (explicit prop or the one from the list context).
 */
export const ExportAction = ({
  exporter,
  onClick,
  ...props
}: ExportButtonProps) => {
  const [showLabels] = useActionLabels();
  const notify = useNotify();
  const { exporter: exporterFromContext, total } = useListContext();
  const effectiveExporter = exporter || exporterFromContext;

  const wrappedExporter = React.useMemo<Exporter | undefined>(() => {
    if (!effectiveExporter) return undefined;
    return async (records, fetchRelatedRecords, dataProvider, resource) => {
      try {
        await effectiveExporter(
          records,
          fetchRelatedRecords,
          dataProvider,
          resource
        );
        notify(`Export ready — ${records.length} rows downloaded.`, {
          type: 'success',
          autoHideDuration: 4000,
        });
      } catch (error) {
        // Swallow rather than rethrow: RA's own catch would add a second,
        // vaguer toast on top of this one.
        console.error(error);
        notify('Export failed. Please try again.', { type: 'error' });
      }
    };
  }, [effectiveExporter, notify]);

  // RA types the Button's onClick as the intersection of a DOM and a React
  // handler; take the loose parameter and hand it straight back.
  const handleClick = ((event: Parameters<
    NonNullable<ExportButtonProps['onClick']>
  >[0]) => {
    notify(
      total
        ? `Preparing export of ${total} rows — this may take a moment…`
        : 'Preparing export — this may take a moment…',
      { type: 'info', autoHideDuration: 6000 }
    );
    onClick?.(event);
  }) as ExportButtonProps['onClick'];

  return (
    <ExportButton
      size="small"
      exporter={wrappedExporter}
      onClick={handleClick}
      label={showLabels ? undefined : ' '}
      sx={{
        color: 'white',
        minWidth: 0,
        px: showLabels ? 1 : 0.75,
        ...(showLabels
          ? {}
          : { width: HEADING_ACTION_SIZE, height: HEADING_ACTION_SIZE }),
        '& .MuiSvgIcon-root': { fontSize: '1.25rem' },
      }}
      {...props}
    />
  );
};

/**
 * Borderless dropdown for heading bars (Watersystems export).
 * Icon-only when "Show button labels" is off; otherwise shows `emptyLabel`.
 */
export const HeadingSelect = ({
  sx,
  emptyLabel = 'EXPORT',
  renderValue,
  ...rest
}: SelectProps<string> & { emptyLabel?: string }) => {
  const [showLabels] = useActionLabels();
  return (
    <Tooltip title={emptyLabel} disableHoverListener={showLabels}>
      <Select<string>
        variant="standard"
        disableUnderline
        size="small"
        displayEmpty
        renderValue={
          showLabels
            ? renderValue
            : () => <FileDownloadIcon fontSize="small" />
        }
        sx={[
          {
            color: 'white',
            fontSize: '0.8125rem',
            fontWeight: 500,
            '& .MuiSelect-select': {
              py: 0.5,
              pl: showLabels ? 1 : 0.75,
              display: 'flex',
              alignItems: 'center',
            },
            '& .MuiSelect-icon': { color: 'white' },
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' },
            borderRadius: 1,
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
        {...rest}
      />
    </Tooltip>
  );
};
