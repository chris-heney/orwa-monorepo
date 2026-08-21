import React from "react";
import { CreateBase, Title, useDataProvider } from "react-admin";
import SponsorFormFields from "./SponsorFormFields";
import CustomEditHeader from "../../_components/CustomFormHeader";
import ConferenceContextProvider from "../ConferenceContext";
import {
  SPONSOR_WRITE_POPULATE,
  toSponsorWritePayload,
} from "./helpers/sponsorWritePayload";

const CreateSponsor = () => {
  const dataProvider = useDataProvider();

  const transform = async (data: Record<string, unknown>) => {
    const { data: sponsorships } = await dataProvider.getList(
      "conference-sponsorships",
      {
        pagination: { page: 1, perPage: 100 },
        sort: { field: "name", order: "ASC" },
        filter: {},
      }
    );

    return toSponsorWritePayload(data, sponsorships ?? []);
  };

  return (
    <CreateBase
      redirect={"/conference/dashboard"}
      transform={transform}
      mutationOptions={{
        meta: {
          populate: true,
          customFilter: SPONSOR_WRITE_POPULATE,
        },
      }}
      hasShow={false}
    >
      <ConferenceContextProvider>
        <CustomEditHeader
          displayField="email"
          redirectTo="/conference/dashboard"
          sx={{
            mt: 2,
          }}
        />

        <Title title="Create Sponsor" />
        <SponsorFormFields />
      </ConferenceContextProvider>
    </CreateBase>
  );
};

export default CreateSponsor;
