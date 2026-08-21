import React, { MouseEventHandler, ReactNode } from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { useActionLabels } from '../../../helpers/useActionLabels';

export interface HeadingActionProps {
  /** Icon element, e.g. <FilterAltIcon fontSize="small" /> */
  icon: ReactNode;
  /** Action name — always the tooltip; visible text when labels are enabled */
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  /** Always render the visible label (e.g. Save / Cancel pairs) */
  forceLabel?: boolean;
  /** MUI palette color for emphasis actions (Save = primary, etc.) */
  color?: 'inherit' | 'primary' | 'secondary' | 'warning' | 'error';
  /** Contained variant for primary emphasis when the label is visible */
  emphasis?: boolean;
  sx?: SxProps<Theme>;
  'data-testid'?: string;
}

/**
 * THE standard action button for black page heading bars.
 *
 * Icon-only with a tooltip by default; the "Show button labels" preference
 * (Profile page) switches every heading action to icon + text. Keeps hover
 * states tight to the visible glyph — no wide MUI min-width padding.
 */
const HeadingAction = ({
  icon,
  label,
  onClick,
  disabled,
  forceLabel,
  color = 'inherit',
  emphasis,
  sx,
  ...rest
}: HeadingActionProps) => {
  const [showLabels] = useActionLabels();
  const withLabel = forceLabel || showLabels;

  if (withLabel) {
    return (
      <Button
        size="small"
        onClick={onClick}
        disabled={disabled}
        color={color === 'inherit' ? 'inherit' : color}
        variant={emphasis ? 'contained' : 'text'}
        startIcon={icon}
        sx={[
          {
            color: emphasis ? undefined : 'white',
            minWidth: 0,
            px: 1,
            py: 0.5,
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            '&.Mui-disabled': { color: 'grey.500' },
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
        {...rest}
      >
        {label}
      </Button>
    );
  }

  return (
    <Tooltip title={label}>
      {/* span keeps the tooltip working when the button is disabled */}
      <span style={{ display: 'inline-flex' }}>
        <IconButton
          size="small"
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
          sx={[
            {
              color:
                color === 'inherit'
                  ? 'white'
                  : (theme: Theme) => theme.palette[color].light,
              p: 0.75,
              borderRadius: 1,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.12)' },
              '&.Mui-disabled': { color: 'grey.600' },
            },
            ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
          ]}
          {...rest}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default HeadingAction;
