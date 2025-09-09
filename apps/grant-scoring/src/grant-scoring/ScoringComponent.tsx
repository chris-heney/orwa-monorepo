import { useContext } from "react";
import { useEffect } from "react";
import { Box, Divider, Typography } from "@mui/material";
import { useGetScore } from "../helpers/API";
import { DirectoryContext, useScoringCriterias } from "./helpers/AppContextProvider";
import ResponsiveListItem from "./components/ResponsiveListItem";
import { YearMonthDayMinute } from "./types";

const ScoringComponent = () => {
  const { applications, applicationIndex, setScore, score } =
    useContext(DirectoryContext);

  const {scoringCriterias} = useScoringCriterias()
  const getScore = useGetScore();

  // const [hasToken, setToken] = React.useState(false)
  useEffect(() => {
    // if ORWA and DEQ fetch current score

    getScore(applications[applicationIndex].id as number).then((score) => {
      setScore(score);
    });
  }, []);

 
  const sections = [
    { order: "1.1", label: "Drinking Water" },
    { order: "2.1", label: "Wastewater" },
    { order: "3.1", label: "Project Status and Impact" },
    { order: "4.1", label: "Sustainability Commitment" },
  ];

  console.log(applications[applicationIndex].approved_projects);

  const approvedProjectIds = applications[
    applicationIndex
  ].approved_projects.data.map((project: any) => project.id) as number[];
  // each time order change from 1.1 to 2.1 or 3.1 display a new section with a new label
  return !applications || !score ? (
    <>Loading</>
  ) : (
    <Box
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {scoringCriterias
        .filter((criteria: any) => {
          return approvedProjectIds.includes(
            criteria.project_type.data ? criteria.project_type.data.id : null
          );
        })
        .filter((criteria: any) => {
          return !criteria.order.includes("3");
        }).length > 0 && (
        <>
          <Typography variant="h5" textAlign={"left"} mb={2}>
            Projects Approved
          </Typography>
          <Box display="flex" flexDirection="column">
            {scoringCriterias
              .filter((criteria: any) => {
                return approvedProjectIds.includes(
                  criteria.project_type.data
                    ? criteria.project_type.data.id
                    : null
                );
              })
              .filter((criteria: any) => {
                console.log(criteria);
                return !criteria.order.includes("3");
              })
              .map((score: any, index) => (
                <Box key={score + index}>
                  {sections.map(
                    (section) =>
                      score.order === section.order && (
                        <Box mt={3} key={`section-${section.order}-${index}`}>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            textAlign="left"
                          >
                            {section.label}
                          </Typography>
                          <Divider />
                        </Box>
                      )
                  )}
                  {/* ROW */}
                  <Box
                    key={`scoring-${score.lable}-${score.score}-${index}`}
                    display="flex"
                    flexDirection="row"
                    justifyContent={"space-between"}
                    borderBottom={"1px solid #777"}
                    alignItems={"center"}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#f0f0f0" : "white",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ textAlign: "left", ml: 1, flex: 3, p: 1 }}
                    >
                      {" "}
                      {score.order} {score.label}{" "}
                    </Typography>
                    <Box sx={{ width: 22, mr: 1, textAlign: "right" }}>
                      {score.score}
                    </Box>
                  </Box>
                </Box>
              ))}
          </Box>
        </>
      )}

      {/* Status Impact order 3... */}

      {scoringCriterias
        .filter((criteria: any) => {
          return approvedProjectIds.includes(
            criteria.project_type.data ? criteria.project_type.data.id : null
          );
        })
        .filter((criteria: any) => {
          return criteria.order.includes("3");
        }).length > 0 && (
        <>
          <Typography variant="h5" textAlign={"left"} my={2}>
            Status Impact
          </Typography>
          <Box display="flex" flexDirection="column">
            {scoringCriterias
              .filter((criteria: any) => {
                return approvedProjectIds.includes(
                  criteria.project_type.data
                    ? criteria.project_type.data.id
                    : null
                );
              })
              .filter((criteria: any) => {
                return criteria.order.includes("3");
              })
              .map((score: any, index) => (
                <Box key={score + index}>
                  {sections.map(
                    (section) =>
                      score.order === section.order && (
                        <Box mt={3} key={`section-${section.order}-${index}`}>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            textAlign="left"
                          >
                            {section.label}
                          </Typography>
                          <Divider />
                        </Box>
                      )
                  )}
                  {/* ROW */}
                  <Box
                    key={`scoring-${score.lable}-${score.score}-${index}`}
                    display="flex"
                    flexDirection="row"
                    justifyContent={"space-between"}
                    borderBottom={"1px solid #777"}
                    alignItems={"center"}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#f0f0f0" : "white",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ textAlign: "left", ml: 1, flex: 3, p: 1 }}
                    >
                      {" "}
                      {score.order} {score.label}{" "}
                    </Typography>
                    <Box sx={{ width: 22, mr: 1, textAlign: "right" }}>
                      {score.score}
                    </Box>
                  </Box>
                </Box>
              ))}
          </Box>
        </>
      )}

      {/* Comments */}
      <div className="p-3" />
      {applications[applicationIndex].grant_application_score.data && (
        <div>
          <Typography variant="h5" textAlign={"left"}>
            Comments
          </Typography>
          <Divider />
          {applications[applicationIndex].grant_application_score.data
            .other_describe && (
            <ResponsiveListItem
              label=""
              sx={{ textAlign: "left" }}
              value={
                applications[applicationIndex].grant_application_score.data
                  .other_describe
              }
              divider
            />
          )}
          {applications[applicationIndex].grant_application_score.data
            .other_describe_2 && (
            <ResponsiveListItem
              label=""
              sx={{ textAlign: "left" }}
              value={
                applications[applicationIndex].grant_application_score.data
                  .other_describe_2
              }
              divider
            />
          )}
        </div>
      )}
      {/* section that displays orwa and deq signature, name, date signed */}
      {applications[applicationIndex].grant_application_score.data && (
        <div className="flex flex-row justify-between mt-3 mx-auto space-y-4 md:space-y-0 md:space-x-4 items-center">
          <div className="flex flex-col">
            <p className="text-base md:text-lg underline">ORWA Approval</p>
            <img
              src={`${applications[applicationIndex].grant_application_score.data.orwa_signature}`}
              alt="ORWA Signature"
              className="w-48 sm:w-32 md:w-40 lg:w-48 xl:w-96 max-w-full h-auto"
            />
            <p className="text-base md:text-lg mt-5">
              {
                applications[applicationIndex].grant_application_score.data
                  .orwa_member_name
              }
            </p>
            <p className="text-base md:text-lg">
              {new Date(
                applications[
                  applicationIndex
                ].grant_application_score.data.createdAt
              ).toLocaleString("en-US", YearMonthDayMinute)}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-base md:text-lg underline">DEQ Approval</p>
            <img
              src={`${applications[applicationIndex].grant_application_score.data.deq_signature}`}
              alt="DEQ Signature"
              className="w-48 sm:w-32 md:w-40 lg:w-48 xl:w-96 max-w-full h-auto"
            />
            <p className="text-base md:text-lg mt-5">
              {
                applications[applicationIndex].grant_application_score.data
                  .deq_member_name
              }
            </p>
            <p className="text-base md:text-lg">
              {new Date(
                applications[
                  applicationIndex
                ].grant_application_score.data.createdAt
              ).toLocaleString("en-US", YearMonthDayMinute)}
            </p>
          </div>
        </div>
      )}
      <Divider />
    </Box>
  );
};

export default ScoringComponent;
