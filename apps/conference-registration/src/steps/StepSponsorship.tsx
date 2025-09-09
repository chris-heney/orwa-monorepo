import { ChangeEvent } from "react";
import {
  FormControlLabel,
  Checkbox,
  Divider,
  Typography,
  Box,
  Grid,
  TextField,
} from "@mui/material";
import { useFormContext, useFieldArray } from "react-hook-form";
import currencyFormatter from "../helpers/currencyFormat";
import { ISponsorshipOption } from "../types/types";
import { useRegistrationOptions } from "../AppContextProvider";
import { FileInput, FormSection, TextInput } from "mj-react-form-builder";
import SelectOrganization from "../components/_components/SelectOrganization";

const StepSponsorship = () => {
  const { SponsorshipOptions } = useRegistrationOptions();
  const { watch, setValue, control } = useFormContext();
  const { append, replace } = useFieldArray({
    control,
    name: "sponsors",
  });

  const sponsors = watch("sponsors") || [];

  const handleSponsorshipChange =
    (sponsorship: ISponsorshipOption) => (e: ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;

      if (isChecked) {
        append({ ...sponsorship });
      } else {
        const updatedSponsors = sponsors.filter(
          (s: ISponsorshipOption) => s.id !== sponsorship.id
        );
        setValue("sponsors", updatedSponsors);
      }
    };

  const handleQuantityChange =
    (sponsorship: ISponsorshipOption) => (e: ChangeEvent<HTMLInputElement>) => {
      const quantity = Math.max(
        1,
        Math.min(sponsorship.available, parseInt(e.target.value || "1"))
      );

      const updatedSponsors = sponsors.filter(
        (s: ISponsorshipOption) => s.id !== sponsorship.id
      );
      const newSponsors = Array(quantity).fill({ ...sponsorship });
      replace([...updatedSponsors, ...newSponsors]);
    };

  const calculateSubtotal = () => {
    return sponsors.reduce((total: number, sponsor: ISponsorshipOption) => {
      return total + sponsor.amount;
    }, 0);
  };

  const sponsorshipAvailable = SponsorshipOptions.filter(
    (sponsorship) => sponsorship.available > 0
  );

  const validateImageFile = (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return "Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed.";
    }
    return true;
  };

  return (
    <Box className="container mx-auto max-w-3xl px-4 py-8">
      {sponsorshipAvailable.length === 0 ? (
        <Typography
          variant="h5"
          className="font-bold mb-6 text-gray-500 text-center py-48 md:py-56"
        >
          No Sponsorship Packages Available at this Time
        </Typography>
      ) : (
        <FormSection title="Sponsorships Available">
          <Grid container spacing={2}>
            {sponsorshipAvailable.map((sponsorship) => (
              <Grid
                item
                xs={12}
                key={sponsorship.id}
                className="border-b border-gray-300 pb-4"
              >
                <Box className="flex items-center justify-between">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          !!sponsors.find(
                            (s: ISponsorshipOption) => s.id === sponsorship.id
                          )
                        }
                        onChange={handleSponsorshipChange(sponsorship)}
                      />
                    }
                    label={
                      <Box className="text-left">
                        <Typography
                          variant="body1"
                          className="font-semibold text-gray-800"
                        >
                          {sponsorship.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="text-gray-600 mt-1"
                        >
                          {sponsorship.description}
                        </Typography>
                      </Box>
                    }
                  />
                  <Box className="flex items-center justify-end space-x-4">
                    <Typography variant="body1" className="font-semibold">
                      {currencyFormatter.format(sponsorship.amount)}
                    </Typography>
                    {sponsorship.max_purchasable > 1 && (
                      <Box className="flex items-center space-x-2">
                        <Typography variant="body2" className="text-gray-600">
                          Quantity:
                        </Typography>
                        <TextField
                          type="number"
                          size="small"
                          value={
                            sponsors.filter(
                              (s: ISponsorshipOption) => s.id === sponsorship.id
                            ).length || 1
                          }
                          onChange={handleQuantityChange(sponsorship)}
                          inputProps={{
                            min: 1,
                            max: sponsorship.max_purchasable,
                          }}
                          className="w-20"
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </FormSection>
      )}

      {sponsorshipAvailable.length > 0 && (
        <div className="mb-6">
          {/* Organization and Logo Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* Left Column: Organization Inputs */}
            <div className="flex flex-col gap-4">
              <SelectOrganization updateLogo required={false}/>
              <div className="relative flex items-center justify-center">
                <span className="text-gray-500 italic">or</span>
              </div>
              <div className="px-4">
                <TextInput
                  source="organization"
                  label="Enter Organization Name"
                  required
                />
              </div>
            </div>

            {/* Right Column: Logo Upload */}
            <div className="flex flex-col justify-center">
            <FileInput
                required
                source="logo"
                label="Logo"
                helperText="Upload the logo to represent your organization at the conference (Images only)"
                validate={validateImageFile}
              />
            </div>
          </div>
        </div>
      )}

      <Divider className="my-6" />

      <Box className="text-right">
        <Typography variant="h6">
          Subtotal:{" "}
          <span className="font-bold">
            {currencyFormatter.format(calculateSubtotal())}
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default StepSponsorship;
