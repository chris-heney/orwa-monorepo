import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PermissionAction, PermissionMatrix } from './api';

const CRUD_ACTIONS = ['find', 'findOne', 'create', 'update', 'delete'];
const READ_ACTIONS = ['find', 'findOne'];

type RowPreset = 'read' | 'all' | 'none';

const stripPrefix = (type: string) => type.replace(/^(api|plugin)::/, '');

const withAction = (
  matrix: PermissionMatrix,
  type: string,
  controller: string,
  action: string,
  enabled: boolean
): PermissionMatrix => ({
  ...matrix,
  [type]: {
    ...matrix[type],
    controllers: {
      ...matrix[type].controllers,
      [controller]: {
        ...matrix[type].controllers[controller],
        [action]: { ...matrix[type].controllers[controller][action], enabled },
      },
    },
  },
});

const withPreset = (
  matrix: PermissionMatrix,
  type: string,
  controller: string,
  preset: RowPreset
): PermissionMatrix => {
  const actions = matrix[type].controllers[controller];
  const next: Record<string, PermissionAction> = {};

  for (const [action, value] of Object.entries(actions)) {
    const enabled =
      preset === 'all'
        ? true
        : preset === 'none'
        ? false
        : READ_ACTIONS.includes(action);
    next[action] = { ...value, enabled };
  }

  return {
    ...matrix,
    [type]: {
      ...matrix[type],
      controllers: { ...matrix[type].controllers, [controller]: next },
    },
  };
};

/**
 * Keeps the endpoint-name column visible during horizontal scroll. The base
 * must be opaque (`background.paper`) — the zebra rows use a translucent
 * `action.hover`, and scrolled cells would show through a transparent sticky
 * cell. The zebra tint is re-applied on top via `backgroundImage` so the
 * sticky cell still matches its row in both light and dark mode.
 */
const stickyNameCellSx = (isZebra: boolean) => (theme: Theme) => ({
  position: 'sticky',
  left: 0,
  zIndex: 2,
  backgroundColor: theme.palette.background.paper,
  backgroundImage: isZebra
    ? `linear-gradient(${theme.palette.action.hover}, ${theme.palette.action.hover})`
    : 'none',
});

const matrixTableSx = (theme: Theme) => ({
  borderCollapse: 'collapse',
  'tr th': {
    py: 0.75,
    border: `1px solid ${theme.palette.divider}`,
    color: 'text.primary',
    whiteSpace: 'nowrap',
    fontWeight: 'bold',
  },
  'tr td': {
    py: 0.25,
    border: `1px solid ${theme.palette.divider}`,
    color: 'text.primary',
  },
});

interface MatrixSectionProps {
  types: string[];
  matrix: PermissionMatrix;
  onChange: (next: PermissionMatrix) => void;
}

const MatrixSection = ({ types, matrix, onChange }: MatrixSectionProps) => {
  const rows = types.flatMap((type) =>
    Object.keys(matrix[type].controllers)
      .sort()
      .map((controller) => ({ type, controller }))
  );

  return (
    // width: 0 + minWidth: '100%' zeroes the table's intrinsic width so the
    // layout's `minWidth: fit-content` root never grows past the viewport —
    // the table scrolls inside this box, never the page.
    <Box
      sx={{ width: 0, minWidth: '100%', maxWidth: '100%', overflowX: 'auto' }}
    >
      <Table size="small" sx={matrixTableSx}>
        <TableHead>
          <TableRow>
            <TableCell sx={stickyNameCellSx(false)}>Endpoint</TableCell>
            {CRUD_ACTIONS.map((action) => (
              <TableCell key={action} align="center">
                {action}
              </TableCell>
            ))}
            <TableCell>Other actions</TableCell>
            <TableCell align="center">Shortcuts</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(({ type, controller }, i) => {
            const actions = matrix[type].controllers[controller];
            const typeName = stripPrefix(type);
            const label =
              controller === typeName
                ? typeName
                : `${typeName} › ${controller}`;
            const otherActions = Object.keys(actions)
              .filter((action) => !CRUD_ACTIONS.includes(action))
              .sort();

            return (
              <TableRow
                key={`${type}.${controller}`}
                sx={{ bgcolor: i % 2 === 0 ? 'action.hover' : 'transparent' }}
              >
                <TableCell
                  sx={[{ whiteSpace: 'nowrap' }, stickyNameCellSx(i % 2 === 0)]}
                >
                  {label}
                </TableCell>
                {CRUD_ACTIONS.map((action) => (
                  <TableCell key={action} align="center" padding="checkbox">
                    {actions[action] ? (
                      <Checkbox
                        size="small"
                        checked={actions[action].enabled}
                        onChange={(event) =>
                          onChange(
                            withAction(
                              matrix,
                              type,
                              controller,
                              action,
                              event.target.checked
                            )
                          )
                        }
                        inputProps={{ 'aria-label': `${label} ${action}` }}
                      />
                    ) : null}
                  </TableCell>
                ))}
                <TableCell>
                  {otherActions.length === 0
                    ? '—'
                    : otherActions.map((action) => (
                        <FormControlLabel
                          key={action}
                          sx={{ mr: 1.5 }}
                          control={
                            <Checkbox
                              size="small"
                              checked={actions[action].enabled}
                              onChange={(event) =>
                                onChange(
                                  withAction(
                                    matrix,
                                    type,
                                    controller,
                                    action,
                                    event.target.checked
                                  )
                                )
                              }
                            />
                          }
                          label={
                            <Typography variant="caption">{action}</Typography>
                          }
                        />
                      ))}
                </TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                  <ButtonGroup size="small" variant="text">
                    <Button
                      onClick={() =>
                        onChange(withPreset(matrix, type, controller, 'read'))
                      }
                    >
                      Read
                    </Button>
                    <Button
                      onClick={() =>
                        onChange(withPreset(matrix, type, controller, 'all'))
                      }
                    >
                      All
                    </Button>
                    <Button
                      onClick={() =>
                        onChange(withPreset(matrix, type, controller, 'none'))
                      }
                    >
                      None
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
};

interface PermissionMatrixTableProps {
  matrix: PermissionMatrix;
  onChange: (next: PermissionMatrix) => void;
}

/**
 * Editable permission matrix. `api::*` types render as the main table;
 * `plugin::*` types are tucked under a collapsed "Advanced" accordion so an
 * admin does not casually grant plugin (especially users-permissions / RBAC)
 * control.
 */
const PermissionMatrixTable = ({
  matrix,
  onChange,
}: PermissionMatrixTableProps) => {
  const apiTypes = Object.keys(matrix)
    .filter((type) => type.startsWith('api::'))
    .sort();
  const pluginTypes = Object.keys(matrix)
    .filter((type) => !type.startsWith('api::'))
    .sort();

  return (
    <Box>
      {apiTypes.length === 0 ? (
        <Typography color="text.secondary">No API endpoints found.</Typography>
      ) : (
        <MatrixSection types={apiTypes} matrix={matrix} onChange={onChange} />
      )}
      {pluginTypes.length > 0 && (
        <Accordion disableGutters sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Advanced (plugin permissions)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Alert severity="warning" sx={{ mb: 2 }}>
              These actions control Strapi plugin internals. In particular, the
              users-permissions role and permissions actions give a role full
              control over RBAC itself — leave them disabled unless you are
              certain.
            </Alert>
            <MatrixSection
              types={pluginTypes}
              matrix={matrix}
              onChange={onChange}
            />
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

export default PermissionMatrixTable;
