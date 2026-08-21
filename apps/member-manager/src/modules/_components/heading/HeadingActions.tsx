import React from 'react';
import { Box, Select, SelectProps } from '@mui/material';
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
import HeadingAction, { HeadingActionProps } from './HeadingAction';
import { useActionLabels } from '../../../helpers/useActionLabels';

type PresetProps = Omit<HeadingActionProps, 'icon' | 'label'> & {
  label?: string;
};

/** Standard heading-bar actions — identical look across every module. */

export const RefreshAction = (props: PresetProps) => (
  <HeadingAction
    icon={<RefreshIcon fontSize="small" />}
    label={props.label ?? 'Refresh'}
    {...props}
  />
);

export const FilterAction = (props: PresetProps) => (
  <HeadingAction
    icon={<FilterAltIcon fontSize="small" />}
    label={props.label ?? 'Filters'}
    {...props}
  />
);

export const AddAction = ({ label, ...rest }: PresetProps) => (
  <HeadingAction
    icon={<AddIcon fontSize="small" />}
    label={label ?? 'Add'}
    {...rest}
  />
);

export const BackAction = (props: PresetProps) => (
  <HeadingAction
    icon={<ArrowBackIcon fontSize="small" />}
    label={props.label ?? 'Back'}
    {...props}
  />
);

export const ShowAction = (props: PresetProps) => (
  <HeadingAction
    icon={<VisibilityIcon fontSize="small" />}
    label={props.label ?? 'Show'}
    {...props}
  />
);

export const SettingsAction = (props: PresetProps) => (
  <HeadingAction
    icon={<SettingsIcon fontSize="small" />}
    label={props.label ?? 'Settings'}
    {...props}
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
            : { fontSize: 0, '& .MuiButton-startIcon': { mr: 0, ml: 0 } }),
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
      sx={{ color: 'white', minWidth: 0, px: showLabels ? 1 : 0.75 }}
      {...props}
    />
  );
};

/**
 * Borderless dropdown for heading bars (e.g. Watersystems "Select Export") —
 * matches the size/typography of the surrounding actions instead of an
 * outlined form field.
 */
export const HeadingSelect = ({ sx, ...rest }: SelectProps<string>) => (
  <Select<string>
    variant="standard"
    disableUnderline
    size="small"
    sx={[
      {
        color: 'white',
        fontSize: '0.8125rem',
        fontWeight: 500,
        '& .MuiSelect-select': { py: 0.5, pl: 1 },
        '& .MuiSelect-icon': { color: 'white' },
        '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' },
        borderRadius: 1,
      },
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    ]}
    {...rest}
  />
);
