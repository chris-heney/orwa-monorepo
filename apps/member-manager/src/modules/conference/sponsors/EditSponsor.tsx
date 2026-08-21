import React from "react";
import { EditBase, Title, useDataProvider } from "react-admin";
import SponsorFormFields from "./SponsorFormFields";
import CustomFormHeader from "../../_components/CustomFormHeader";
import ConferenceContextProvider, {
  useConferenceContext,
} from "../ConferenceContext";
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

const EditSponsorForm = () => {
  const dataProvider = useDataProvider();
  const { currentFilter } = useConferenceContext();

  const transform = async (
    data: Record<string, unknown>,
    options?: { previousData?: Record<string, unknown> }
  ) => {
    const { data: sponsorships } = await dataProvider.getList(
      "conference-sponsorships",
      {
        pagination: { page: 1, perPage: 100 },
        sort: { field: "name", order: "ASC" },
        filter: { conference: currentFilter.conference },
      }
    );

    return toSponsorWritePayload(data, sponsorships ?? [], {
      previousData: options?.previousData,
      fallbackConference: currentFilter.conference,
      fallbackYear: currentFilter.year,
    });
  };

  return (
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
  );
};

const EditSponsor = () => (
  <ConferenceContextProvider>
    <EditSponsorForm />
  </ConferenceContextProvider>
);

export default EditSponsor;
