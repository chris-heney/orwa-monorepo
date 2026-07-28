import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import {
  useGetList,
  useGetMany,
  useRedirect,
  RaRecord,
} from "react-admin";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import DirectoryRow from "./DirectoryRow";
import DashboardCard from "./DashboardCard";
import { mediaUrl } from "./mediaUrl";
import {
  display,
  useSummaryTokens,
} from "../../memberships_v2/summary/tokens";

const sortByName = (a: RaRecord, b: RaRecord) => {
  const al = `${a?.last ?? ""} ${a?.first ?? ""}`.trim().toLowerCase();
  const bl = `${b?.last ?? ""} ${b?.first ?? ""}`.trim().toLowerCase();
  return al.localeCompare(bl);
};

type SectionProps = {
  label: string;
  count: number;
  children: React.ReactNode;
};

const SectionHeader: React.FC<SectionProps> = ({ label, count, children }) => {
  const T = useSummaryTokens();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 0.5,
          pt: 0.5,
        }}
      >
        <Typography
          sx={{
            ...display,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: T.textFaint,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </Typography>
        <Box sx={{ flex: 1, height: "1px", backgroundColor: T.line }} />
        <Typography
          sx={{
            ...display,
            fontSize: 11,
            fontWeight: 700,
            color: T.textLo,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {count}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.15 }}>
        {children}
      </Box>
    </Box>
  );
};

/** Staff + Training Instructors directory. */
const PeopleCard = () => {
  const T = useSummaryTokens();
  const redirect = useRedirect();

  const { data: staffs, isLoading: loadingStaff } = useGetList("staff", {
    meta: { populate: true, raw: true },
    pagination: { page: 1, perPage: 1000 },
  });

  const staffIds =
    staffs?.map((s) => s.contact?.id).filter(Boolean) ?? ([] as number[]);

  const { data: staffContacts, isLoading: loadingStaffContacts } = useGetMany(
    "contacts",
    { ids: staffIds, meta: { raw: true } }
  );

  const { data: instructors, isLoading: loadingInstructors } = useGetList(
    "training-instructors",
    {
      meta: { raw: true },
      pagination: { page: 1, perPage: 1000 },
    }
  );

  const instructorIds =
    instructors?.map((i) => i.instructor?.id).filter(Boolean) ??
    ([] as number[]);

  const { data: instructorContacts, isLoading: loadingInstructorContacts } =
    useGetMany("contacts", {
      ids: instructorIds,
      meta: { raw: true },
    });

  const sortedStaff = useMemo(
    () => [...(staffContacts ?? [])].sort(sortByName),
    [staffContacts]
  );
  const sortedInstructors = useMemo(
    () => [...(instructorContacts ?? [])].sort(sortByName),
    [instructorContacts]
  );

  const isLoading =
    loadingStaff ||
    loadingInstructors ||
    loadingStaffContacts ||
    loadingInstructorContacts;

  return (
    <DashboardCard
      icon={<GroupsOutlinedIcon />}
      title="People"
      count={
        isLoading
          ? undefined
          : (sortedStaff.length || 0) + (sortedInstructors.length || 0)
      }
      loading={isLoading}
      bodySx={{ px: 1, py: 1.25, gap: 1.75 }}
    >
      <SectionHeader label="Staff" count={sortedStaff.length}>
        {sortedStaff.map((person) => (
          <DirectoryRow
            key={person.id}
            primary={
              `${person?.first ?? ""} ${person?.last ?? ""}`.trim() || "—"
            }
            secondary={person?.title || "Staff"}
            imageUrl={mediaUrl(person?.avatar)}
            onClick={() => redirect(`/contacts/${person.id}/show`)}
          />
        ))}
      </SectionHeader>

      <SectionHeader
        label="Training Instructors"
        count={sortedInstructors.length}
      >
        {sortedInstructors.length === 0 ? (
          <Typography sx={{ px: 1, py: 0.75, fontSize: 12, color: T.textFaint }}>
            None on file
          </Typography>
        ) : (
          sortedInstructors.map((person) => (
            <DirectoryRow
              key={person.id}
              primary={
                `${person?.first ?? ""} ${person?.last ?? ""}`.trim() || "—"
              }
              secondary={person?.title || "Training Instructor"}
              imageUrl={mediaUrl(person?.avatar)}
              onClick={() => redirect(`/contacts/${person.id}/show`)}
            />
          ))
        )}
      </SectionHeader>
    </DashboardCard>
  );
};

export default PeopleCard;
