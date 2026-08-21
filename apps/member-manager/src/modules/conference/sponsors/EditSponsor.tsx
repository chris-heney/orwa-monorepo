import React from "react";
import { EditBase, Title, useDataProvider } from "react-admin";
import SponsorFormFields from "./SponsorFormFields";
import CustomFormHeader from "../../_components/CustomFormHeader";
import ConferenceContextProvider from "../ConferenceContext";
import {
  SPONSOR_WRITE_POPULATE,
  toSponsorWritePayload,
} from "./helpers/sponsorWritePayload";

const sponsorMutationMeta = {
  meta: {
    populate: true,
    customFilter: SPONSOR_WRITE_POPULATE,
  },
};

const EditSponsor = () => {
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
    <ConferenceContextProvider>
      <EditBase 
        queryOptions={sponsorMutationMeta}
        mutationOptions={sponsorMutationMeta}
        transform={transform}
        hasShow={false}
        redirect={"/conference/dashboard"}
      >
        <CustomFormHeader
          hasShow={false}
          displayField="email"
          redirectTo="/conference/dashboard"
          sx={{
            mt: 2,
          }}
        />

        <Title title="Edit Sponsor" />
        <SponsorFormFields />
      </EditBase>
    </ConferenceContextProvider>
  );
};

export default EditSponsor;
