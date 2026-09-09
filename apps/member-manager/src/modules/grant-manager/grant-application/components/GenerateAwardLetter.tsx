import React from "react";
import {
  AwardLetterDataError,
  generateAwardLetter,
} from "../helpers/generateAwardLetterPdf";
import uploadService from "../../../../services/uploadService/uploadService";
import { IGrantApplication } from "../GrantApplicationTypes";
import { Box, Button, Tooltip } from "@mui/material";
import { useNotify, useUpdate } from "react-admin";
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';

interface GenerateAwardLetterProps {
  application: IGrantApplication;
}

export const GenerateAwardLetter: React.FC<GenerateAwardLetterProps> = ({
  application,
}) => {

  const [update] = useUpdate();
  const notify = useNotify();

  const handleDownload = async () => {
    if (application.award_letter) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}${application.award_letter.url}`);
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "grant_application.pdf";
        a.click();
        URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error("Error downloading file:", error);
        notify("Error downloading the award letter", { type: "error" });
      }   
    }
  };

   const handleView = () => {
    if (application.award_letter) {
      window.open(`${import.meta.env.VITE_API_ENDPOINT}${application.award_letter.url}`, "_blank");
    }
  };

  const handleUpload = async () => {
    let pdfBytes: Uint8Array;
    try {
      pdfBytes = await generateAwardLetter({ ...application });
    } catch (error) {
      // Every merge tag in the agreement must resolve; a signed agreement
      // with a blank dollar amount or chairman is worse than no agreement.
      const message =
        error instanceof AwardLetterDataError
          ? `Cannot generate RIG Agreement — fill in: ${error.missing.join(", ")}`
          : "Error generating the RIG Agreement PDF";
      notify(message, { type: "error" });
      return;
    }

    // Copy into a plain ArrayBuffer: TS 5.7 types pdf-lib's output as
    // Uint8Array<ArrayBufferLike>, which is not assignable to BlobPart.
    const pdfBuffer = pdfBytes.buffer.slice(
      pdfBytes.byteOffset,
      pdfBytes.byteOffset + pdfBytes.byteLength
    ) as ArrayBuffer;
    const generatedFile = new File([pdfBuffer], `${application.legal_entity_name}-AwardLetter.pdf`, {
      type: "application/pdf",
    });

    if (generatedFile) {
      try {
        const uploadResponse = await uploadService.uploadFile(generatedFile, true);
        
        update("grant-application-finals", {
          id: application.id,
          data: {
            award_letter: uploadResponse.id,
          },
          previousData: application,
        });

        notify(`Award Letter Generated for ${application.legal_entity_name}`, {
          type: "success",
        });
        
      } catch (error: any) {
        console.error("Error uploading file:", error);
        notify(`Error Generating Letter for ${application.legal_entity_name}`, {
          type: "error",
        });
      }
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
      {(application.award_letter) ? (
        <>
          <Tooltip title="Email Award Letter">
            <Button
              size="small"
              variant="contained"
              color="primary"
              endIcon={<DownloadIcon />}
              onClick={handleDownload}
            >
              Download
            </Button>
          </Tooltip>
          <Tooltip title="View Award Letter">
            <Button
              size="small"
              variant="contained"
              color="secondary"
              endIcon={<VisibilityIcon />}
              onClick={handleView}
            >
              View 
            </Button>
          </Tooltip>
        </>
      ) : (
        <Tooltip title="Generate Award Letter">
          <Button
            size="small"
            variant="contained"
            color="success"
            endIcon={<AddIcon />}
            onClick={handleUpload}
          >
            Generate
          </Button>
        </Tooltip>
      )}
    </Box>
  );
};