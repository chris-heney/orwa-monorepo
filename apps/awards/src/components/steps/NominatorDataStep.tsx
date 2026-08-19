import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { TextInput } from "../_components/TextInput";
import { SelectInput } from "../_components/SelectInput";
import MaskedPhoneInput from "../_components/MaskedPhoneInput";
import { countryOptions } from "../../data/countryOptions";

const NominatorDataStep: React.FC = () => {
  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Nominator Information
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Please provide information about the person submitting this nomination
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Nominator&apos;s Name{" "}
              <span className="text-red-500">*</span>
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput
              label="First"
              name="nominator_first_name"
              required
              placeholder="First"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput
              label="Last"
              name="nominator_last_name"
              required
              placeholder="Last"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Nominator&apos;s Address{" "}
              <span className="text-red-500">*</span>
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              For award notification.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextInput
              label="Street Address"
              name="nominator_address"
              required
              placeholder="123 Main Street"
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput
              label="Address Line 2"
              name="nominator_address_2"
              placeholder="Apartment, suite, etc."
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput
              label="City"
              name="nominator_city"
              required
              placeholder="Oklahoma City"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput
              label="State / Province / Region"
              name="nominator_state"
              required
              placeholder="Oklahoma"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput
              label="ZIP / Postal Code"
              name="nominator_zip"
              required
              placeholder="73101"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <SelectInput
              label="Country"
              name="nominator_country"
              required
              options={countryOptions}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <MaskedPhoneInput
              label="Nominator's Phone"
              name="nominator_phone"
              required
              helperText="For award notification."
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput
              label="Nominator's Email"
              name="nominator_email"
              type="email"
              required
              placeholder="nominator@example.com"
              helperText="For award notification."
              validation={{
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default NominatorDataStep;
