import {
  ReferenceInput,
  AutocompleteInput,
  TextInput,
  SelectInput,
  DateInput,
  NumberInput,
} from "react-admin";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Modal,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import TypeModal from "./TypeModal";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import { formSectionCardSx } from "../../../../css/formLayout";

const options = [
  { id: "Lump Sum", name: "Lump Sum" },
  { id: "Reimbursement", name: "Reimbursement" },
];
const status = [
  { id: "Open", name: "Open" },
  { id: "Closed", name: "Closed" },
  { id: "Suggested", name: "Suggested" },
];
const GrantForm = () => {
  const [isTopicOpen, setIsTopicOpen] = useState(false);
  const defaultGridItemProps = {
    xs: 12,
    sm: 12,
    md: 12,
    lg: 12,
  };
  return (
    <>
      <Box>
        <Grid
          container
          spacing={0}
          gap={0}
          alignItems={"stretch"}
          justifyItems={"stretch"}
          alignSelf={"stretch"}
        >
          <Grid
            item
            {...defaultGridItemProps}
            alignItems={"stretch"}
            justifyItems={"stretch"}
            alignSelf={"stretch"}
          >
            {/* Information */}
            <Card sx={formSectionCardSx}>
              <Typography variant="h5">Grant Information</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container columnSpacing={2} rowSpacing={1}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Button
                    startIcon={<RequestPageIcon />}
                    onClick={() => setIsTopicOpen(true)}
                  >
                    Create New Grant Type
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <TextInput source="name" label="Name" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <ReferenceInput source="type" reference="grant-types">
                    <AutocompleteInput optionText={"name"} fullWidth />
                  </ReferenceInput>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <SelectInput source="status" choices={status} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <DateInput source="opens" label="Opens" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <DateInput source="closes" label="Closes" fullWidth />
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid
            item
            {...defaultGridItemProps}
            alignItems={"stretch"}
            justifyItems={"stretch"}
            alignSelf={"stretch"}
          >
            {/* Avatar */}
            <Card sx={formSectionCardSx}>
              <Typography variant="h5">Financial</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container columnSpacing={2} rowSpacing={1}>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <NumberInput
                    source="grant_amount"
                    label="Grant Amount"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <NumberInput
                    source="admin_amount"
                    label="Admin Amount"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <NumberInput
                    source="funds_provided"
                    label="Funds Provided"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <NumberInput source="max_award" label="Max Award" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <SelectInput
                    source="reimbursement_type"
                    choices={options}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Modal
        open={isTopicOpen}
        onClose={() => setIsTopicOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <>
          <TypeModal setIsTopicOpen={setIsTopicOpen} />
        </>
      </Modal>
    </>
  );
};

export default GrantForm;
