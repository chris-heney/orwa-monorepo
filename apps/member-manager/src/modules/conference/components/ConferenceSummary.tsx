import React, { useEffect } from "react";
import DateStatusWidget from "../../grant-manager/_components/DateStatusWidget";
import { Box, Grid, Typography } from "@mui/material";
import BreakfastIcon from "@mui/icons-material/EggAlt";
import LunchIcon from "@mui/icons-material/LunchDining";
import DinnerIcon from "@mui/icons-material/Restaurant";
import BoothIcon from "@mui/icons-material/StoreMallDirectory";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import httpClient from "../../../helpers/ra-strapi-data-provider/src/httpClient";
import { Loading, RaRecord, useListContext } from "react-admin";
import ucwords from "../../_helpers/ucwords";
import ResponsiveListItem from "../../_components/ResponsiveListItem";
import { getFilterYear, getPrimaryConferenceId } from "../helpers/mergeConferenceAcrossTabFilters";

interface IHeadCount {
  type: string;
  count: number;
}

interface IMetric {
  name: string;
  count: number;
  key: string;
  icon: string;
}

// conference,
// boothCount: boothCountSummary,
// itemCounts: itemCountsSummary,
// headCountsAttendees: headCountsSummary,
// headCountsContestants: confestantCountSummary

interface IConferenceSummary {
  conference?: RaRecord;
  boothCount: number;
  headCountAttendees: IHeadCount[];
  headCountContestants: IHeadCount[];
  itemCounts: Array<[number, IMetric]>; // Updated interface
}

const ConferenceSummary = () => {
  const { filterValues } = useListContext();

  const [conferenceSummary, setConferenceSummary] =
    React.useState<IConferenceSummary>({
      boothCount: 0,
      headCountAttendees: [],
      headCountContestants: [],
      itemCounts: [],
      conference: undefined,
    });

  const [totalHeadCount, setTotalHeadCount] = React.useState(0);
  useEffect(() => {
    setTotalHeadCount(0);

    const confId = getPrimaryConferenceId(filterValues);
    const y = getFilterYear(filterValues);

    // Determine the API endpoint based on available filters
    let apiUrl = `${import.meta.env.VITE_API_ENDPOINT}/api/conference-summary`;
    
    if (confId != null && y != null) {
      // Both conference and year are provided
      apiUrl += `/${confId}/${y}`;
    } else if (confId != null) {
      // Only conference is provided
      apiUrl += `/${confId}/-1`;
    } else if (y != null) {
      // Only year is provided
      apiUrl += `/-1/${y}`;
    }
    // else - use the base endpoint with no parameters for unfiltered data

    httpClient(apiUrl).then((response) => {
      const responseData = JSON.parse(response.body);
      let newTotal = 0;
      
      // Calculate total from all non-voter attendees
      if (responseData.headCountAttendees) {
        responseData.headCountAttendees
          .filter((item: any) => item.type !== "Voter Only")
          .forEach((item: IMetric) => {
            newTotal += parseInt(item.count.toString());
          });
      }

      setTotalHeadCount(newTotal);
      setConferenceSummary({
        ...(responseData as IConferenceSummary),
      });
    });
  }, [filterValues]);

  const mealIcons = [LunchIcon, DinnerIcon, BuildCircleIcon];

  const getItemCount = (metric: IMetric) => metric?.count.toString() || "0";
  return (
    <Box sx={{ p: 2 }}>
      {!conferenceSummary.conference ? (
        <Loading />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography
              component="h3"
              sx={{ fontSize: 18, fontWeight: 900, ml: 1 }}
            >
              Attendee Summary
            </Typography>
            {conferenceSummary.headCountAttendees
              .filter((headCount) => {
                return headCount.type !== "Voter Only";
              })
              .map((metric, index) => (
                <ResponsiveListItem
                  key={index}
                  label={ucwords(metric.type)}
                  value={`${metric.count}`}
                  sx={{ borderBottom: "1px solid #eee" }}
                />
              ))}
            <ResponsiveListItem
              key="last"
              label="Total"
              value={`${totalHeadCount}`}
              sx={{ borderBottom: "1px solid #eee" }}
            />

            {conferenceSummary.headCountAttendees.filter((headCount: any) => {
              return headCount.type === "Voter Only";
            }).length > 0 && (
              <Typography
                component="h3"
                sx={{ fontSize: 18, fontWeight: 900, ml: 1, mt: 1 }}
              >
                Voters Summary
              </Typography>
            )}
            {conferenceSummary.headCountAttendees
              .filter((headCount: any) => {
                return headCount.type === "Voter Only";
              })
              .map((metric, index) => (
                <ResponsiveListItem
                  key={index}
                  label={ucwords(metric.type)}
                  value={`${metric.count}`}
                  sx={{ borderBottom: "1px solid #eee" }}
                />
              ))}
            {conferenceSummary.headCountContestants.length > 0 && (
              <Typography
                component="h3"
                sx={{ fontSize: 18, fontWeight: 900, ml: 1, mt: 1 }}
              >
                Contestant Summary
              </Typography>
            )}
            {conferenceSummary.headCountContestants.map((metric, index) => (
              <ResponsiveListItem
                key={index}
                label={ucwords(metric.type)}
                value={`${metric.count}`}
                sx={{ borderBottom: "1px solid #eee" }}
              />
            ))}
          </Grid>

          <Grid item xs={12} md={5}>
            {" "}
            {/* Updated grid sizing */}
            <Typography
              component="h3"
              sx={{ fontSize: 18, fontWeight: 900, ml: 1 }}
            >
              Head Counts
            </Typography>
            <Grid container spacing={2}>
              {filterValues?.conference === 1 && filterValues?.year === 2024 && (
                <Grid item xs={12} sm={6}>
                  {" "}
                  {/* Grid item for each widget */}
                  <DateStatusWidget
                    WidgetIcon={BreakfastIcon}
                    heading={totalHeadCount.toString()}
                    subheading="Breakfast"
                    key="widget-00"
                  />
                </Grid>
              )}

              {conferenceSummary.itemCounts.map(([index, metric]) => (
                <Grid item xs={12} sm={6} key={`grid-${index}-${metric.key}`}>
                  {" "}
                  {/* Responsive grid items */}
                  <DateStatusWidget
                    WidgetIcon={
                      metric.icon
                        ? () => (
                            <img
                              height={31}
                              src={metric.icon}
                              alt={metric.name}
                              // Uploaded meal icons are black SVGs/PNGs; invert to match white MUI icons
                              style={{
                                height: 31,
                                width: 31,
                                objectFit: "contain",
                                filter: "brightness(0) invert(1)",
                              }}
                            />
                          )
                        : mealIcons[index % mealIcons.length]
                    }
                    heading={getItemCount(metric)}
                    subheading={metric.name}
                  />
                </Grid>
              ))}

              {filterValues?.conference === 1 && filterValues?.year === 2024 && (
                <Grid item xs={12} sm={6}>
                  <DateStatusWidget
                    WidgetIcon={BreakfastIcon}
                    heading={totalHeadCount.toString()}
                    subheading="Vendor Social"
                    key="widget-99"
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography
              component="h3"
              sx={{ fontSize: 18, fontWeight: 900, ml: 1 }}
            >
              Booth Summary
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <DateStatusWidget
                WidgetIcon={BoothIcon}
                heading={conferenceSummary.boothCount.toString()}
                subheading="Booths Purchased"
              />
              {conferenceSummary.conference.booths_available < 5000 && (
                <DateStatusWidget
                  WidgetIcon={BoothIcon}
                  heading={`${conferenceSummary.conference.booths_available}`}
                  subheading="Booths Remaining"
                />
              )}
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ConferenceSummary;
