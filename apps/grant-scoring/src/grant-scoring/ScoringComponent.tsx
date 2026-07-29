import React, { useContext } from "react";
import { useEffect } from "react";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import CustomBooleanInput from "./components/CustomBooleanInput";
import SignaturePad from "./components/Signature";
import CustomTextInput from "./components/CustomTextInput";
import Signature_Pad from "signature_pad";
import ApprovalBox from "./components/ApprovalBox";
import {
  submitScore,
  updateApplicationScoring,
  updateApplication,
  useGetApplications,
  useGetScoringCriterias,
  _sendEmail,
} from "../helpers/API";
import { ApplicationScoringContext } from "./AppContextProvider";
import SelectDenialReason from "./components/SelectDenialReason";
import { Identifier } from "./types";
import CustomNumberInput from "./components/CustomNumberInput";

const ScoringComponent = () => {
  const {
    applications,
    applicationIndex,
    token,
    setScore,
    setApplications,
    status,
    notApprovedId,
  } = useContext(ApplicationScoringContext);

  if (!applications) return <Box>No Applications in Queue</Box>;
  if (!token) return <Box>Missing Token</Box>;

  const [signature, setSignature] = React.useState("");
  const [scoring, setScoring] = React.useState([]);
  const [currentScore, setCurrentScore] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [signaturePad, setSignaturePad] = React.useState<Signature_Pad>();
  const [approvedApplication, setApprovedApplication] = React.useState<
    null | boolean
  >(null);
  const [other1, setOther1] = React.useState("");
  const [other2, setOther2] = React.useState("");
  const [projectsApproved, setProjectsApproved] = React.useState<number[]>([]);
  const getScoringCriterias = useGetScoringCriterias();
  const getApplications = useGetApplications();
  const [approvedBy, setApprovedBy] = React.useState(token.default_member_name);
  const [approvalEmail, setApprovalEmail] = React.useState(
    token.default_member_email
  );
  const [denialReason, setDenialReason] = React.useState<Identifier | null>(
    null
  );
  const [projectCost, setProjectCost] = React.useState<number | null>(
    applications[applicationIndex].combined_cost_of_projects ?? null
  );
  const [awardAmount, setAwardAmount] = React.useState<number>(
    Math.round(applications[applicationIndex].combined_cost_of_projects * 0.8) <
      100000
      ? Math.round(
          applications[applicationIndex].combined_cost_of_projects * 0.8
        )
      : 100000
  );
  const [portionMatch, setPortionMatched] = React.useState<number>(
    Math.round(applications[applicationIndex].combined_cost_of_projects * 0.2)
  );
  const [notes, setNotes] = React.useState("");

  useEffect(() => {
    getApplications(status).then((data) => {
      setApplications(data);
    });
  }, [isSubmitting]);

  useEffect(() => {
    getScoringCriterias().then((data) => {
      setScoring(data);
    });
  }, []);

  useEffect(() => {
    if (applications && applications[applicationIndex]) {
      const currentApplication = applications[applicationIndex];
      setProjectCost(currentApplication.combined_cost_of_projects ?? null);
      const calculatedAwardAmount =
        Math.round(currentApplication.combined_cost_of_projects * 0.8) < 100000
          ? Math.round(currentApplication.combined_cost_of_projects * 0.8)
          : 100000;
      setAwardAmount(calculatedAwardAmount);
      const calculatedPortionMatch =
        Math.round(currentApplication.combined_cost_of_projects * 0.8) > 100000
          ? Math.round(currentApplication.combined_cost_of_projects - 100000)
          : Math.round(currentApplication.combined_cost_of_projects * 0.2);
      setPortionMatched(calculatedPortionMatch);
      setCurrentScore(0);
    }
  }, [applicationIndex, applications]);

  const submit = async () => {
    const date = new Date();
    setIsSubmitting(true);

    if (approvedApplication === null) {
      setIsSubmitting(false);
      return alert("Please fill out Approved By field");
    }

    try {
      await submitScore({
        data: {
          score: currentScore,
          grant: 4,
          application: applications[applicationIndex].id,
          date: date,
          grant_application: applications[applicationIndex].id,
          other_describe: other1,
          other_describe_2: other2,
          projects_approved: projectsApproved,
          approved: approvedApplication,
          notes: notes,
        },
      });

      await updateApplication(applications[applicationIndex]?.id, {
        data: {
          committee_date: date,
          status: approvedApplication
            ? token.next_status.id
            : notApprovedId,
          sub_status: denialReason,
          approved_projects: projectsApproved,
          approved_project_cost: projectCost,
          award_amount: awardAmount,
          expected_utility_match: portionMatch,
        },
      });

      //Reset form variables

      setTimeout(async () => {
        await getApplications(status).then((data) => {
          setApplications(data);
        });

        setCurrentScore(0);
        setProjectsApproved([]);
        setOther1("");
        setOther2("");
        setApprovedApplication(null);
        window.scrollTo(0, 0);
        setIsSubmitting(false);
      }, 2000);
    } catch (error) {
      console.log(error);
      setError(true);
      setIsSubmitting(false);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  useEffect(() => {
    setProjectCost(
      applications[applicationIndex].combined_cost_of_projects ?? null
    );
    setAwardAmount(
      Math.round(
        applications[applicationIndex].combined_cost_of_projects * 0.8
      ) < 100000
        ? Math.round(
            applications[applicationIndex].combined_cost_of_projects * 0.8
          )
        : 100000
    );
    setPortionMatched(
      Math.round(applications[applicationIndex].combined_cost_of_projects * 0.2)
    );
  }, [isSubmitting]);

  const updateScore = async () => {
    if (!applications || !token) return;

    if (!approvedBy) return alert("Please fill out Approved By field");
    if (!approvalEmail) return alert("Please fill out Email field");
    if (!signature) return alert("Please sign the document");

    setIsSubmitting(true);

    try {
      await updateApplicationScoring(
        applications[applicationIndex]?.grant_application_score?.id,
        {
          data:
            token.name === "DEQ"
              ? {
                  deq_signature: signature,
                  deq_member_name: approvedBy,
                  deq_member_email: approvalEmail,
                }
              : token.name === "ORWA"
              ? {
                  orwa_signature: signature,
                  orwa_member_name: approvedBy,
                  orwa_member_email: approvalEmail,
                }
              : {},
        }
      );

      await updateApplication(applications[applicationIndex]?.id, {
        data: {
          status: token.next_status.id,
          committee_date: new Date(),
        },
      });
      signaturePad && signaturePad.clear();
      setTimeout(async () => {
        await getApplications(status).then((data) => {
          setApplications(data);
        });

        setSignature(" ");
        window.scrollTo(0, 0);
        setIsSubmitting(false);
      }, 2000);
      if (token.name === "DEQ") {
        await _sendEmail({
          to: "rig@orwa.org",
          from: "Grant Scoring App <rig@orwa.org>",
          html: `${applications[applicationIndex].legal_entity_name} #${applications[applicationIndex].facility_id} has made it through both orwa and deq and ready for award letter`,
          subject: "Grant Application Signed By DEQ & ORWA",
        });
        await _sendEmail({
          to: "Marcosje2005@gmail.com",
          from: "Grant Scoring App <rig@orwa.org>",
          html: `${applications[applicationIndex].legal_entity_name} #${applications[applicationIndex].facility_id} has made it through both orwa and deq and ready for award letter`,
          subject: "Grant Application Signed By DEQ & ORWA",
        });
      }
    } catch (error) {
      console.log(error);
      setError(true);
      setIsSubmitting(false);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  const addProject = (id: number) => {
    if (!id) return;
    setProjectsApproved((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  const sections = [
    { order: "1.1", label: "Drinking Water" },
    { order: "2.1", label: "Wastewater" },
    { order: "3.1", label: "Project Status and Impact" },
    { order: "4.1", label: "Sustainability Commitment" },
  ];

  const setApprovedCost = (e: number) => {
    setProjectCost(e);
    setAwardAmount(Math.round(e * 0.8) < 100000 ? Math.round(e * 0.8) : 100000);
    //  if award is 1000000 portion matched is responsible for the rest of the project cost not just 20%
    const portionMatched =
      Math.round(e * 0.8) > 100000
        ? Math.round(e - 100000)
        : Math.round(e * 0.2);
    setPortionMatched(portionMatched as number);
  };
  // each time order change from 1.1 to 2.1 or 3.1 display a new section with a new label
  return !applications ? (
    <>Loading</>
  ) : (
    <Box
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {(token.name === "ORWA" || token.name === "DEQ") && (
        <Typography variant="h5" textAlign={"left"}>
          Please Sign The Document
        </Typography>
      )}
      {token.name === "Committee" && (
        <>
          <Typography variant="h5" textAlign={"left"}>
            Project Rank Scoring (Circle Applicable Scores)
          </Typography>
          <Box display="flex" flexDirection="column">
            {scoring.map((score: any, index) => (
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
                  <CustomBooleanInput
                      value={false}
                      label=""
                      onChange={(value) => {
                        addProject(
                          score.project_type?.id ?? null
                        );
                        setCurrentScore(() =>
                          value
                            ? currentScore + score.score
                            : currentScore - score.score
                        );
                        setScore(() => {
                          return value
                            ? currentScore + score.score
                            : currentScore - score.score;
                        });
                      }}
                      style={{ flex: 0.5 }}
                    />
                  <Box sx={{ width: 22, mr: 1, textAlign: "right" }}>
                    {score.score}
                  </Box>
                </Box>
                {token.name === "Committee" &&
                  score.label === "Other Describe" &&
                  score.score === 10 &&
                  score.order.startsWith(1) && (
                    <CustomTextInput
                      sx={{ mt: 1 }}
                      label="Other Describe"
                      value={other1}
                      onChange={(e) => setOther1(e)}
                      rows={5}
                      multiline
                    />
                  )}
                {token.name === "Committee" &&
                  score.label === "Other Describe" &&
                  score.score === 10 &&
                  score.order.startsWith(2) && (
                    <Box>
                      <CustomTextInput
                        sx={{ mt: 1 }}
                        label="Other Describe"
                        value={other2}
                        onChange={(e) => setOther2(e)}
                        rows={5}
                        multiline
                      />
                    </Box>
                  )}
              </Box>
            ))}
          </Box>
        </>
      )}
      {token.name === "Committee" && (
        <Typography variant="h5" textAlign={"right"}>
          Current Score: {currentScore}
        </Typography>
      )}

      {(token.name === "ORWA" || token.name === "DEQ") && (
        <Box>
          <CustomTextInput
            sx={{ mt: 2 }}
            label="Approved By"
            value={approvedBy}
            onChange={(e) => setApprovedBy(e)}
          />
          <CustomTextInput
            sx={{ mt: 2 }}
            label="Email"
            value={approvalEmail}
            onChange={(e) => setApprovalEmail(e)}
          />
          <SignaturePad
            setSignaturePad={setSignaturePad}
            signaturePad={signaturePad}
            setSignature={setSignature}
          />

          <Box mt={2} display={"flex"} justifyContent={"flex-end"}>
            {isSubmitting ? (
              <Typography variant="body1" textAlign={"right"} color="green">
                Scoring is Submitting Thank you!
              </Typography>
            ) : error ? (
              <Typography variant="body1" textAlign={"right"} color="red">
                Scoring Submittion Failed!
              </Typography>
            ) : (
              <Button variant="contained" onClick={updateScore}>
                Submit Signature
              </Button>
            )}
          </Box>
        </Box>
      )}
      {token.name === "Committee" && (
        <>
          <Typography mt={5} variant="h5" textAlign={"left"}>
            We Recommend that this project be
          </Typography>
          <Divider />
          <Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-evenly", mt: 2 }}
            >
              <ApprovalBox
                setApprovedApplication={setApprovedApplication}
                approved={approvedApplication}
                type="deny"
              />
              {
                <ApprovalBox
                  setApprovedApplication={setApprovedApplication}
                  approved={approvedApplication}
                  type="approve"
                />
              }
            </Box>
            {approvedApplication === false && <Divider />}
            {approvedApplication === false && (
              <div className="flex justify-between p-3">
                <Typography variant="body1" textAlign={"left"}>
                  Please select an reason for denial
                </Typography>
                <SelectDenialReason
                  denialReason={denialReason}
                  setDenialReason={setDenialReason}
                />
              </div>
            )}
            <Divider />
          </Box>
          {/* text inputs project_cost, award_amount, portion_matched_by_recipient */}
          {approvedApplication && (
            <Grid container spacing={2} p={2}>
              <Grid item md={6} xs={12}>
                <CustomNumberInput
                  label="Approved Project Cost"
                  value={projectCost ?? 0}
                  onChange={(e) => setApprovedCost(e)}
                />
              </Grid>
              {/* 80% of  */}
              <Grid item md={6} xs={12}>
                <CustomNumberInput
                  label="Award Amount"
                  value={awardAmount ?? 0}
                  onChange={(e) => setAwardAmount(e)}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomNumberInput
                  label="Portion Matched by Recipient"
                  value={portionMatch ?? 0}
                  onChange={(e) => setPortionMatched(e)}
                />
              </Grid>
            </Grid>
          )}
          {approvedApplication !== null && (
            <CustomTextInput
              sx={{ mt: 2, mx: 2 }}
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e)}
              multiline
              rows={5}
            />
          )}

          <Box mt={2} display={"flex"} justifyContent={"flex-end"}>
            {isSubmitting ? (
              <Typography variant="body1" textAlign={"right"} color="green">
                Scoring is Submitting Thank you!
              </Typography>
            ) : error ? (
              <Typography variant="body1" textAlign={"right"} color="red">
                Scoring Submittion Failed!
              </Typography>
            ) : (
              <Button variant="contained" onClick={submit}>
                Submit Score
              </Button>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default ScoringComponent;
