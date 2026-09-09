import React from 'react';
import { Box, Select, SelectProps, Tooltip } from '@mui/material';
import {
  ExportButton,
  ExportButtonProps,
  SelectColumnsButton,
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

type PresetProps = Omit<HeadingActionProps, 'icon' | 'label'> & {
  label?: string;
};

/** Standard heading-bar actions — identical look across every module. */

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

export const ExportAction = (props: ExportButtonProps) => {
  const [showLabels] = useActionLabels();
  return (
    <ExportButton
      size="small"
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
