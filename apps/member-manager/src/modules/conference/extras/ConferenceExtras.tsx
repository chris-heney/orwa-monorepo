import React, { useContext } from "react";
import {
  ChipField,
  Create,
  DatagridConfigurable,
  NumberField,
  SimpleForm,
  SingleFieldList,
  TextField,
  useCreate,
  useNotify,
} from "react-admin";
import { CurrencyOptions } from "../../../config/Settings";
import { Button } from "@mui/material";
import CustomSecondaryHeader from "../../_components/CustomSecondaryHeader";
import { ConferenceContext } from "../ConferenceContext";
import { createRecord } from "../../_helpers/createRecord";
import { customDatagridStyle } from "../../../css";
import CustomPagination from "../../_components/CustomPagination";
import ConferenceExtraForm from "./ConferenceExtraForm";
import SafeReferenceArrayField from "../components/SafeReferenceArrayField";

// @TODO: Implement ConferenceExtraForm a inline edit
const ConferenceExtras = () => {
  const {
    isCreating,
    setIsCreating,
  } = useContext(ConferenceContext);
  const [create] = useCreate();
  const notify = useNotify();

  return isCreating ? (
    <Create
      sx={{ mt: -2 }}
      title={" "}
      redirect={false}
      resource="conference-extras"
    >
      <CustomSecondaryHeader title="Add New Extra" />
      <Button
        onClick={() =>
          isCreating ? setIsCreating(false) : setIsCreating(true)
        }
      >
        {" "}
        Back
      </Button>
      <SimpleForm
        onSubmit={(formData) =>
          createRecord(
            formData,
            create,
            notify,
            setIsCreating,
            "conference-extras"
          )
        }
      >
        <ConferenceExtraForm />
      </SimpleForm>
    </Create>
  ) : (
    <>
      <DatagridConfigurable
        bulkActionButtons={false}
        rowClick="edit"
        sx={customDatagridStyle}
      >
        <SafeReferenceArrayField
          source="conferences"
          reference="conferences"
          label="Conference"
        >
          <SingleFieldList linkType={false}>
            <ChipField source="name" />
          </SingleFieldList>
        </SafeReferenceArrayField>

        <TextField source="name" label="Name" />
        <TextField source="description" label="Description" />
        <NumberField
          source="price_online"
          label="Price Online"
          options={CurrencyOptions}
        />
        <NumberField
          source="price_event"
          label="Price at Event"
          options={CurrencyOptions}
        />

        <SafeReferenceArrayField
          source="included"
          label="Included"
          reference="conference-tickets"
        >
          <SingleFieldList
            sx={{
              flexWrap: "nowrap",
            }}
            linkType={false}
          >
            <ChipField source="name" />
          </SingleFieldList>
        </SafeReferenceArrayField>

        <SafeReferenceArrayField
          source="excluded"
          label="Excluded"
          reference="conference-tickets"
        >
          <SingleFieldList
            sx={{
              flexWrap: "nowrap",
            }}
            linkType={false}
          >
            <ChipField source="name" />
          </SingleFieldList>
        </SafeReferenceArrayField>

        <NumberField source="order" label="Order" />
      </DatagridConfigurable>
      <CustomPagination />
    </>
  );
};

export default ConferenceExtras;
