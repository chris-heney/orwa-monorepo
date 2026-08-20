import { Card, Grid } from '@mui/material';
import React from 'react';
import { DeleteButton, SaveButton, useResourceContext } from 'react-admin';
import { useCan } from '../rbac-manager/useCan';

interface CustomToolBarProps {
  onEdit?: (data: FormData) => void;
  redirect?: string;
}
const CustomToolBar = ({ onEdit, redirect }: CustomToolBarProps) => {
  const resource = useResourceContext();
  const { canOnResource } = useCan();
  const canUpdate = canOnResource('update', resource ?? '');
  const canDelete = canOnResource('delete', resource ?? '');

  // Capability gating is cosmetic UX only — the server enforces permissions.
  if (!canUpdate && !canDelete) {
    return null;
  }

  return (
    <>
      <Card
        sx={{
          backgroundColor: 'action.hover',
          padding: 2,
          borderRadius: 0,
          borderTop: null,
        }}
      >
        <Grid container spacing={2}>
          {/* Draft Button */}
          {canUpdate && (
            <Grid item>
              {onEdit && <SaveButton alwaysEnable onSubmit={() => onEdit} />}
              {!onEdit && <SaveButton alwaysEnable />}
            </Grid>
          )}
          {/* Delete Button */}
          {canDelete && (
            <Grid item sx={{ marginLeft: 'auto' }}>
              <DeleteButton redirect={redirect ?? 'list'} />
            </Grid>
          )}
        </Grid>
      </Card>
    </>
  );
};

export default CustomToolBar;
