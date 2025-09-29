import React, { useEffect } from "react";
import { Card, CardContent } from "@mui/material";
import {
  FilterList,
  FilterListItem,
  FilterLiveSearch,
  Loading,
  useGetList,
  useListFilterContext,
} from "react-admin";
import { useEmailManagementContext } from "../EmailManagementContextProvider";
import { Email } from "@mui/icons-material";
import SavedFilters from "../../_components/SavedFilters";

const EmailLogFilters = () => {
  const { setEmailLogFilters, selectedTab, savingQuery, setSavingQuery } =
    useEmailManagementContext();
  const { filterValues } = useListFilterContext();

  const { data: emailTemplates = [], isLoading } = useGetList(
    "email-templates",
    {
      pagination: { page: 1, perPage: 100 },
      sort: { field: "email_name", order: "ASC" },
    }
  );

  useEffect(() => {
    if (filterValues) setEmailLogFilters(filterValues);
  }, [filterValues]);

  return !filterValues || isLoading ? (
    <Loading />
  ) : (
    <Card
      component={"div"}
      sx={{
        minWidth: 200,
        maxHeight: "70vh",
        overflow: "auto",
        position: "sticky",
      }}
    >
      <CardContent>
        <SavedFilters
          resource={selectedTab}
          savingQuery={savingQuery}
          setSavingQuery={setSavingQuery}
        />
        <FilterLiveSearch />
        <FilterList label="Email Template" icon={<Email />}>
          {emailTemplates.map((template: any) => {
            return (
              <FilterListItem
                key={`${template.id}`}
                label={template.email_name ?? "No Name"}
                value={{ template: template.id }}
              />
            );
          })}
        </FilterList>
      </CardContent>
    </Card>
  );
};
export default EmailLogFilters;
