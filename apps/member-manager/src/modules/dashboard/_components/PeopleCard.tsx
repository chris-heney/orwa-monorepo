import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import {
  Loading,
  useGetList,
  useGetMany,
  useRedirect,
  RaRecord,
} from "react-admin";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import DirectoryRow from "./DirectoryRow";
import {
  display,
  useSummaryTokens,
} from "../../memberships_v2/summary/tokens";

const mediaUrl = (media: unknown): string | undefined => {
  if (media == null) return undefined;
  const file = Array.isArray(media) ? media[0] : media;
  const url = (file as { url?: string } | null)?.url;
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${import.meta.env.VITE_API_ENDPOINT}${url}`;
};

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
        <Box
          sx={{
            flex: 1,
            height: "1px",
            backgroundColor: T.line,
          }}
        />
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

/**
 * Tall directory column: Staff + Training Instructors as contact-list rows.
 */
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
    {
      ids: staffIds,
      meta: { raw: true },
    }
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

  const {
    data: instructorContacts,
    isLoading: loadingInstructorContacts,
  } = useGetMany("contacts", {
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

  if (isLoading) {
    return (
      <Box
        sx={{
          height: "100%",
          borderRadius: "14px",
          border: `1px solid ${T.line}`,
          backgroundColor: T.ink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loading />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        borderRadius: "14px",
        border: `1px solid ${T.line}`,
        backgroundColor: T.ink,
        color: T.textHi,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.75,
          pt: 1.5,
          pb: 1,
          borderBottom: `1px solid ${T.line}`,
          flexShrink: 0,
        }}
      >
        <GroupsOutlinedIcon sx={{ fontSize: 22, color: T.water }} />
        <Typography
          sx={{
            ...display,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: T.textHi,
            flex: 1,
          }}
        >
          People
        </Typography>
        <Box
          sx={{
            minWidth: 28,
            height: 28,
            px: 0.75,
            borderRadius: "999px",
            backgroundColor: T.panelSoft,
            border: `1px solid ${T.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...display,
            fontSize: 12,
            fontWeight: 700,
            color: T.textLo,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {(sortedStaff.length || 0) + (sortedInstructors.length || 0)}
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          px: 1,
          py: 1.25,
          display: "flex",
          flexDirection: "column",
          gap: 1.75,
          // Keep scrollbar quiet
          scrollbarWidth: "thin",
          scrollbarColor: `${T.line} transparent`,
        }}
      >
        <SectionHeader label="Staff" count={sortedStaff.length}>
          {sortedStaff.map((person) => (
            <DirectoryRow
              key={person.id}
              primary={`${person?.first ?? ""} ${person?.last ?? ""}`.trim() || "—"}
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
            <Typography
              sx={{ px: 1, py: 0.75, fontSize: 12, color: T.textFaint }}
            >
              None on file
            </Typography>
          ) : (
            sortedInstructors.map((person) => (
              <DirectoryRow
                key={person.id}
                primary={`${person?.first ?? ""} ${person?.last ?? ""}`.trim() || "—"}
                secondary={person?.title || "Training Instructor"}
                imageUrl={mediaUrl(person?.avatar)}
                onClick={() => redirect(`/contacts/${person.id}/show`)}
              />
            ))
          )}
        </SectionHeader>
      </Box>
    </Box>
  );
};

export default PeopleCard;
