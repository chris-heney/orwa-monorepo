import React from "react";
import { EditBase, Title, useDataProvider } from "react-admin";
import SponsorFormFields from "./SponsorFormFields";
import CustomFormHeader from "../../_components/CustomFormHeader";
import ConferenceContextProvider from "../ConferenceContext";

const EditSponsor = () => {
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
    <ConferenceContextProvider>
      <EditBase 
        queryOptions={{
          meta: {
            populate: true,
            customFilter:
              "populate=sponsorship_items.sponsorship&populate=logo&populate=registration&populate=sponsorships",
          },
        }}
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
