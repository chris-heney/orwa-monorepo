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

  return (
    <SimpleForm
      record={normalizeRecordArrays(record, [
        "conferences",
        "included",
        "excluded",
      ])}
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
