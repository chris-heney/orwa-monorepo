import { Box } from "@mui/material";
import React from "react";
import { ImageField, ReferenceArrayField, SingleFieldList } from "react-admin";

const AssociateLogo = () => {
  return (
    <Box>
      <ReferenceArrayField
        reference="upload/files"
        source="logo"
        queryOptions={{ meta: { image: true } }}
      >
        <SingleFieldList linkType={false}>
          <ImageField
            source="url"
            title="title"
            sx={{
              display: "block",
              mx: "auto",
              objectFit: "cover",
            }}
          />
        </SingleFieldList>
      </ReferenceArrayField>
    </Box>
  );
};

export default AssociateLogo;