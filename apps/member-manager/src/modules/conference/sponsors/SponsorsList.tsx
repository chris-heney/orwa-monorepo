import React, { JSX } from "react";
import {
  ChipField,
  DatagridConfigurable,
  DateField,
  FunctionField,
  NumberField,
  RaRecord,
  ReferenceArrayField,
  ReferenceField,
  SingleFieldList,
  TextField,
} from "react-admin";
import { customDatagridStyle } from "../../../css";
import CustomPagination from "../../_components/CustomPagination";

const SponsorsList = () => {

  return (
    <>
      <DatagridConfigurable
        sx={customDatagridStyle}
        bulkActionButtons={false}
        rowClick="edit"
      >
        <FunctionField
          label="Organization"
          render={(record) => {
            return typeof record.registration === "number" ? (
              <ReferenceField
                source="registration"
                reference="conference-registrations"
                label="Organization"
                link={false}
                sortBy="registration.organization"
              >
                <TextField source="organization" label="Organization" noWrap />
              </ReferenceField>
            ) : (
              <TextField source="organization" />
            );
          }}
        />
        <ReferenceField
          source="registration"
          reference="conference-registrations"
          label="Date Registered"
          link={false}
          sortBy="registration.registration_date"
        >
          <DateField
            source="registration_date"
            label="Date Registered"
            noWrap
          />
        </ReferenceField>

        <TextField source="phone" label="Phone" noWrap />
        <TextField source="email" label="Email" noWrap />
        {/* sponsorships */}
        <FunctionField
          sx={{ display: "flex", gap: "5px", flexWrap: "wrap" }}
          label="Items"
          sortBy="items.label"
          render={(record: RaRecord) => {
            if (!record)
              return <span style={{ color: "gray" }}>No record data</span>;

            const itemsToRender: JSX.Element[] = [];

            // Case 1: Render sponsorship_items if available
            if (
              record.sponsorship_items &&
              Array.isArray(record.sponsorship_items)
            ) {
              record.sponsorship_items.forEach(
                (
                  item: {
                    id: number;
                    key: string;
                    label: string;
                    value: number;
                  },
                  index: number
                ) => {
                  itemsToRender.push(
                    <ChipField
                      key={`item-${record.id}-${item.key}-${index}`}
                      record={item}
                      source="label"
                      label={item.label}
                    />
                  );
                }
              );
            }

            // Case 2: Render sponsorships if available
            if (
              record?.sponsorships &&
              Array.isArray(record.sponsorships)
            ) {
              itemsToRender.push(
                <ReferenceArrayField
                  key={`sponsorship-${record.id}`}
                  source="sponsorships"
                  reference="conference-sponsorships"
                >
                  <SingleFieldList linkType={false}>
                    <ChipField source="name" />
                  </SingleFieldList>
                </ReferenceArrayField>
              );
            }

            // If no items to render, display fallback message
            if (itemsToRender.length === 0) {
              return (
                <span style={{ color: "gray", fontStyle: "italic" }}>
                  No items or sponsorships available
                </span>
              );
            }

            // Render collected items
            return (
              <div style={{ display: "flex", gap: "5px" }}>
                {itemsToRender}
              </div>
            );
          }}
        />

        <NumberField
          source="amount"
          label="Amount"
          options={{ style: "currency", currency: "USD" }}
        />
      </DatagridConfigurable>
      <CustomPagination />
    </>
  );
};

export default SponsorsList;
