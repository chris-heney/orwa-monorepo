import React from "react";
import { Typography, type SxProps, type Theme } from "@mui/material";
import { useRecordContext, type FieldProps } from "react-admin";
import { getDisplayEntityId } from "../helpers/strapiIds";

export type EntityIdFieldProps = FieldProps & {
  noWrap?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
};

/**
 * List/show display of the Strapi numeric PK (`entityId`).
 * Keep `source="id"` so Datagrid sort, column prefs, and row identity stay
 * on documentId (`record.id`). Do not use this field for routing.
 */
const EntityIdField = (props: EntityIdFieldProps) => {
  const { emptyText, className, sx, noWrap, textAlign } = props;
  const record = useRecordContext(props);
  const value = getDisplayEntityId(record);

  return (
    <Typography
      component="span"
      variant="body2"
      className={className}
      noWrap={noWrap}
      align={textAlign}
      sx={sx}
    >
      {value != null ? value : emptyText ?? ""}
    </Typography>
  );
};

export default EntityIdField;
