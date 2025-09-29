import React from "react";
import { CreateBase, Title, useDataProvider } from "react-admin";
import SponsorFormFields from "./SponsorFormFields";
import CustomEditHeader from "../../_components/CustomFormHeader";
import ConferenceContextProvider from "../ConferenceContext";

const CreateSponsor = () => {
  const dataProvider = useDataProvider();

  const transform = async (data: any) => {
    const { data: sponsorships } = await dataProvider.getList(
      "conference-sponsorships",
      {
        pagination: { page: 1, perPage: 100 },
        sort: { field: "name", order: "ASC" },
        filter: {},
      }
    );

    return {
      ...data,
      sponsorship_items: data.sponsorship_items.map(
        (item: any, index: number) => {
          const sponsorship = sponsorships.find(
            (s: any) => s.id === item.sponsorship
          );
          return {
            sponsorship: item.sponsorship,
            label: sponsorship?.name,
            value: sponsorship?.amount,
            key: sponsorship?.name + "-" + index,
          };
        }
      ),
    };
  };

  return (
    <CreateBase
      redirect={"/conference/dashboard"}
      transform={transform}
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
