import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { useFieldArray, useFormContext } from "react-hook-form";
import { countyOptions } from "../../data/countyOptions";
import { TextInput } from "../_components/TextInput";
import { SelectInput } from "../_components/SelectInput";
import { RadioGroupInput } from "../_components/RadioGroupInput";
import FileInput from "../_components/FileInput";

const boardListMethodOptions = [
  { value: "File You Upload", label: "File You Upload" },
  { value: "Keyed In List", label: "Keyed In List" },
];

const DOCUMENT_ACCEPT = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".csv",
];

const isSystemOfTheYear = (awardType: string | undefined) =>
  awardType === "System of the Year" ||
  awardType === "Water/Wastewater System of the Year";

const NomineeDataStep: React.FC = () => {
  const { watch, control } = useFormContext();
  const awardType = watch("award_type");
  const boardListMethod = watch("board_list_method");
  const showBoardList = isSystemOfTheYear(awardType);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "board_members",
  });

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Nominee Information
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Please provide information about the nominee
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextInput
              label="Nominee Full Name"
              name="nominee_name"
              required
              placeholder="Enter nominee's full name"
              helperText="Name must be spelled exactly the way you would like it to appear on the award (if awarded)"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextInput
              label="Award Year"
              name="award_year"
              type="number"
              placeholder={new Date().getFullYear().toString()}
            />
          </Grid>

          {showBoardList && (
            <>
              <Grid item xs={12}>
                <RadioGroupInput
                  name="board_list_method"
                  label="Provide Board Members & Employee List via"
                  options={boardListMethodOptions}
                  required
                />
              </Grid>

              {boardListMethod === "File You Upload" && (
                <Grid item xs={12}>
                  <FileInput
                    label="Upload Board Member & Employee List"
                    name="board_list_file"
                    required
                    multiple={false}
                    maxSizeMB={10}
                    acceptedTypes={DOCUMENT_ACCEPT}
                    helperText="Please include a document or spreadsheet with a list of employees and their positions."
                  />
                </Grid>
              )}

              {boardListMethod === "Keyed In List" && (
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    Board Members & Employees{" "}
                    <span className="text-red-500">*</span>
                  </Typography>
                  {fields.map((field, index) => (
                    <Grid container spacing={2} key={field.id} sx={{ mb: 1 }}>
                      <Grid item xs={12} md={3}>
                        <TextInput
                          name={`board_members.${index}.first`}
                          label="First Name"
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextInput
                          name={`board_members.${index}.last`}
                          label="Last Name"
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextInput
                          name={`board_members.${index}.title`}
                          label="Title / Position"
                          required
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={2}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Button
                          type="button"
                          color="error"
                          onClick={() => remove(index)}
                          disabled={fields.length <= 1}
                        >
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => append({ first: "", last: "", title: "" })}
                  >
                    Add Person
                  </Button>
                </Grid>
              )}
            </>
          )}

          <Grid item xs={12} md={6}>
            <TextInput
              label="Email Address"
              name="email"
              type="email"
              required
              placeholder="nominee@example.com"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextInput
              label="Daytime Phone"
              name="daytime_phone"
              required
              placeholder="(555) 123-4567"
            />
          </Grid>

          <Grid item xs={12}>
            <TextInput
              label="Street Address"
              name="address"
              required
              placeholder="123 Main Street"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextInput
              label="City"
              name="city"
              required
              placeholder="Oklahoma City"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextInput label="State" name="state" required />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextInput
              label="ZIP Code"
              name="zip"
              required
              placeholder="73101"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <SelectInput
              label="County"
              name="county"
              required
              options={countyOptions}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default NomineeDataStep;
