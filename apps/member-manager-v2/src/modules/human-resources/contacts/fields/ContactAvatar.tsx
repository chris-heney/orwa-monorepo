import React from "react";
import { Avatar, SxProps } from "@mui/material";
import {
  FunctionField,
  Identifier,
  Link,
  RaRecord,
  ReferenceArrayField,
  SingleFieldList,
  useRecordContext,
  useShowContext,
} from "react-admin";

interface ContactAvatarProps {
  personId?: Identifier;
  sx?: SxProps;
  link?: boolean;
  instructorLink?: boolean;
  contactLink?: boolean;
}

const ContactAvatar = ({
  sx = {},
  personId = 0,
  link = false,
  instructorLink = false,
  contactLink = false,
}: ContactAvatarProps) => {
  sx = { width: "200px", height: "200px", mx: "auto", ...sx };

  const avatarLink = link
    ? `/staff/${personId}/show`
    : instructorLink
    ? `/training-instructors/${personId}/show`
    : contactLink
    ? `/contacts/${personId}/edit`
    : "#";

  const record = useRecordContext();

  if (record === undefined) return null;

  return (
    <Link to={avatarLink}>
      {Array.isArray(record.avatar) ? (
        <ReferenceArrayField
          reference="upload/files"
          source="avatar"
          queryOptions={{ meta: { image: true } }}
        >
          <SingleFieldList linkType={false}>
            <FunctionField
              render={(record: RaRecord) => {
                return <Avatar src={record.url} sx={sx} alt={"?"} />;
              }}
            />
          </SingleFieldList>
        </ReferenceArrayField>
      ) : (
        <Avatar sx={sx} />
      )}
    </Link>
  );
};

export default ContactAvatar;
