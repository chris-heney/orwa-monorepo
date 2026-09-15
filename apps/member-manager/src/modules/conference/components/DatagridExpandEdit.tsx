import React, { ReactNode } from "react";
import {
  EditBase,
  Identifier,
  RaRecord,
  SimpleForm,
  useEditContext,
  useNotify,
  useRemoveFromStore,
  useUpdate,
} from "react-admin";
import { Box, Card, LinearProgress } from "@mui/material";
import { positionStickyComponent } from "../../../css";
import CustomToolBar from "../../_components/CustomToolbar";
import { updateRecord } from "../../_helpers/updateRecord";
import { normalizeRecordArrays } from "../helpers/normalizeRecordArrays";

/**
 * Props react-admin's DatagridRow passes to a component `expand`. Note that
 * `expand={(record) => …}` receives THIS object, not the row record — handing
 * it to `<SimpleForm record>` rendered every input empty and would have sent
 * `record` / `resource` keys back to Strapi on save.
 */
export type DatagridExpandProps = {
  id: Identifier;
  record?: RaRecord;
  resource?: string;
};

type ExpandEditFormProps = {
  resource: string;
  arrayFields: string[];
  children: ReactNode;
};

const ExpandEditForm = ({
  resource,
  arrayFields,
  children,
}: ExpandEditFormProps) => {
  const { record, isLoading } = useEditContext();
  const [update] = useUpdate();
  const notify = useNotify();
  const remove = useRemoveFromStore();

  if (isLoading || !record) {
    return (
      <Box sx={{ p: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <SimpleForm
      // Strapi 5 returns null for empty relations; array inputs need [].
      record={normalizeRecordArrays(record, arrayFields)}
      onSubmit={(formData) =>
        updateRecord(formData, record, update, notify, remove, resource)
      }
      toolbar={<CustomToolBar />}
    >
      {children}
    </SimpleForm>
  );
};

/**
 * Inline edit form for a Datagrid expand panel. Only the expanded row is
 * fetched (one getOne, when it opens); a progress bar shows until that record
 * arrives, then the form hydrates from it and saves through `updateRecord`.
 */
const DatagridExpandEdit = ({
  id,
  resource,
  arrayFields = [],
  children,
}: {
  id: Identifier;
  resource: string;
  arrayFields?: string[];
  children: ReactNode;
}) => (
  <EditBase id={id} resource={resource} redirect={false}>
    <Box sx={positionStickyComponent}>
      <Card>
        <ExpandEditForm resource={resource} arrayFields={arrayFields}>
          {children}
        </ExpandEditForm>
      </Card>
    </Box>
  </EditBase>
);

export default DatagridExpandEdit;
