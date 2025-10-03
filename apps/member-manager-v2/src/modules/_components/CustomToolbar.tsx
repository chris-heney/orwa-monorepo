import {Card, Grid} from "@mui/material";
import React from "react";
import { DeleteButton, SaveButton } from "react-admin";

interface CustomToolBarProps {
  onEdit?: (data: FormData) => void;
  redirect?: string;
}
const CustomToolBar = ({ onEdit, redirect }: CustomToolBarProps) => {
  return (
      <Card
        sx={{
          backgroundColor: "#f5f5f5",
          padding: 2,
          borderRadius: 0,
          borderTop: null,
        }}
      >
        <Grid container spacing={2}>
          {/* Draft Button */}
          <Grid>
            {onEdit && <SaveButton alwaysEnable onSubmit={() => onEdit} />}
            {!onEdit && <SaveButton alwaysEnable />}
          </Grid>
          {/* Delete Button */}
          <Grid sx={{ marginLeft: "auto" }}>
            <DeleteButton redirect={redirect ?? "list"} />
          </Grid>
        </Grid>
      </Card>
  );
};

export default CustomToolBar;
