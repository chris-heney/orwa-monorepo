import React from "react";
import { EditBase, SimpleForm, useRecordContext } from "react-admin";
import { positionStickyComponent } from "../../../css";
import CustomToolBar from "../../_components/CustomToolbar";
import ConferenceExtraForm from "./ConferenceExtraForm";
import ConferenceContextProvider from "../ConferenceContext";
import CustomFormHeader from "../../_components/CustomFormHeader";
import { Box, Card } from "@mui/material";
import { normalizeRecordArrays } from "../helpers/normalizeRecordArrays";

// Strapi 5 can return `null`/`undefined` for the `included`/`excluded`/
// `conferences` manyToMany relations when they have no linked entries
// instead of `[]`. Normalize before handing the record to the form so
// `ReferenceArrayInput` always sees an array (see normalizeRecordArrays).
const NormalizedExtraForm = () => {
  const record = useRecordContext();

  const normalized = normalizeRecordArrays(record, [
    "conferences",
    "included",
    "excluded",
  ]);

  // Legacy extras predate the explicit toggles: quantity selection was implied
  // by max_qty_each > 1, and the selection fields didn't exist. Default them
  // so the form reflects (and persists) the equivalent explicit state.
  const withSelectionDefaults = normalized
    ? {
        ...normalized,
        quantity_selection:
          normalized.quantity_selection ?? (normalized.max_qty_each ?? 0) > 1,
        requires_selection: normalized.requires_selection ?? false,
        counted_by_selection: normalized.counted_by_selection ?? false,
        selection_options: Array.isArray(normalized.selection_options)
          ? normalized.selection_options
          : [],
      }
    : normalized;

  return (
    <SimpleForm
      record={withSelectionDefaults}
      sx={{
        p: 0,
      }}
      toolbar={<CustomToolBar />}
    >
      <Card>
        <ConferenceExtraForm />
      </Card>
    </SimpleForm>
  );
};

const EditExtra = () => {
  return (
    <ConferenceContextProvider>
        <Box sx={{
            py: 2,
        }}>
      <EditBase
        sx={positionStickyComponent}
        title={" "}
        resource="conference-extras"
        redirect={false}
      >
        <CustomFormHeader
          hasShow={false}
          displayField="name"
          redirectTo="/conference/dashboard"
        />
        <NormalizedExtraForm />
      </EditBase>
      </Box>
    </ConferenceContextProvider>
  );
};

export default EditExtra;
