import React, { MouseEventHandler, ReactNode } from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { useActionLabels } from '../../../helpers/useActionLabels';
import { HEADING_ACTION_SIZE } from '../../../framework/layoutTokens';
import { HEADING_BAR_PALETTE } from '../../../framework/themeTokens';

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
  /**
   * Toggle state for actions that open a panel (Filters, Activity, …).
   * Renders a subtle highlighted background and sets aria-pressed.
   */
  active?: boolean;
  sx?: SxProps<Theme>;
  'data-testid'?: string;
}

/** Icon-only heading action footprint: 20px glyph + 6px padding = 32px (framework/layoutTokens). */
export { HEADING_ACTION_SIZE };
/**
 * Class that exempts a heading-bar MUI Button from the layout's icon-only
 * collapse (see layouts/Admin.tsx). Use for buttons whose text must stay.
 */
export const HEADING_ACTION_LABELED_CLASS = 'heading-action-labeled';
/** @deprecated read `theme.palette.headingBar.activeBg` */
export const HEADING_ACTION_ACTIVE_BG = HEADING_BAR_PALETTE.activeBg;

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
  active,
  sx,
  ...rest
}: HeadingActionProps) => {
  const [showLabels] = useActionLabels();
  const withLabel = forceLabel || showLabels;

  if (withLabel) {
    return (
      <Button
        size="small"
        className={forceLabel ? HEADING_ACTION_LABELED_CLASS : undefined}
        onClick={onClick}
        disabled={disabled}
        color={color === 'inherit' ? 'inherit' : color}
        variant={emphasis ? 'contained' : 'text'}
        startIcon={icon}
        aria-pressed={active}
        sx={[
          {
            color: emphasis
              ? undefined
              : (theme: Theme) => theme.palette.headingBar.fg,
            minWidth: 0,
            px: 1,
            py: 0.5,
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            backgroundColor: active
              ? (theme: Theme) => theme.palette.headingBar.activeBg
              : undefined,
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
          aria-pressed={active}
          sx={[
            {
              color: (theme: Theme) =>
                color === 'inherit'
                  ? theme.palette.headingBar.fg
                  : theme.palette[color].light,
              p: 0.75,
              width: HEADING_ACTION_SIZE,
              height: HEADING_ACTION_SIZE,
              borderRadius: 1,
              backgroundColor: active
                ? (theme: Theme) => theme.palette.headingBar.activeBg
                : undefined,
              '&:hover': {
                backgroundColor: (theme: Theme) =>
                  theme.palette.headingBar.hoverBg,
              },
              '&.Mui-disabled': { color: 'grey.600' },
              '& .MuiSvgIcon-root': { fontSize: '1.25rem' },
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
