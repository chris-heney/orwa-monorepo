import React, { useEffect, useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import uploadService from "src/services/uploadService";
import { Download, Delete, CloudUpload, Visibility } from "@mui/icons-material";

const DisplayFile = ({
  id,
  onRemove,
  onUploadComplete,
  compact = false,
}: {
  id: number | { rawFile: File; src: string; title: string }; // Accept both existing file ID or new file object
  onRemove?: (id: number | object) => void;
  onUploadComplete?: (newFileId: number) => void; // Notify parent component after upload
  compact?: boolean; // New prop for compact display mode
}) => {
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

  useEffect(() => {
    const processFile = async () => {
      try {
        if (typeof id === "number") {
          // Existing uploaded file
          const response = await uploadService.getFile(id);
          setFile(response);
        } else if (typeof id === "object" && id.rawFile) {
          // Newly uploaded file (before it's sent to the server)
          setFile({
            name: id.title || id.rawFile.name,
            url: id.src,
            isNew: true,
          });

          // Upload the new file
          await uploadNewFile(id.rawFile);
        } else if (typeof id === "object" && (id as any).url) {
          // Existing file from the server
          setFile(id);
        }
      } catch (error) {
        console.error("Error processing file:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      processFile();
    }
  }, [id]);

  // Upload new files to the server automatically
  const uploadNewFile = async (fileToUpload: File) => {
    try {
      setUploading(true);
      const uploadedFile = await uploadService.uploadFile(fileToUpload, true);
      if (uploadedFile) {
        setFile(uploadedFile);
        onUploadComplete?.(uploadedFile.id); // Notify parent that the file has been uploaded
      }
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!file) return <div>No file available</div>;

  const handleDownload = async () => {
    try {
      if (file.isNew || file.url.startsWith("blob:")) {
        // Download directly from the local URL for new files
        const link = document.createElement("a");
        link.href = file.url;
        link.setAttribute("download", file.name);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      } else {
        // Download from the server for existing files
        const response = await fetch(`${API_ENDPOINT}${file.url}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file.name);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleView = () => {
    const fileUrl = file.isNew ? file.url : `${API_ENDPOINT}${file.url}`;
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  // Helper function to check if file is an image
  const isImageFile = (filename: string) => {
    const imageExtensions = ["png", "jpg", "jpeg", "gif", "webp", "svg"];
    const extension = filename.split(".").pop()?.toLowerCase();
    return imageExtensions.includes(extension || "");
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        marginBottom: compact ? "8px" : "10px",
        border: compact ? "1px solid #e0e0e0" : "none",
        borderRadius: compact ? "8px" : "0",
        padding: compact ? "8px" : "0",
        backgroundColor: compact ? "#fafafa" : "transparent",
      }}
    >
      {/* File Display */}
      {isImageFile(file.name) ? (
        <img
          src={file.isNew ? file.url : `${API_ENDPOINT}${file.url}`}
          alt={file.name}
          style={{
            width: "100%",
            maxWidth: compact ? "100px" : "300px",
            height: compact ? "80px" : "auto",
            objectFit: compact ? "cover" : "contain",
            borderRadius: "4px",
            marginBottom: compact ? "4px" : "10px",
          }}
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: compact ? "80px" : "auto",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
            marginBottom: compact ? "4px" : "10px",
            padding: compact ? "8px" : "16px",
          }}
        >
          <a
            href={file.isNew ? file.url : `${API_ENDPOINT}${file.url}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textAlign: "center",
              color: "blue",
              textDecoration: "underline",
              fontSize: compact ? "12px" : "14px",
              wordBreak: "break-word",
            }}
          >
            {compact ? file.name.substring(0, 20) + (file.name.length > 20 ? "..." : "") : file.name}
          </a>
        </Box>
      )}

      {/* Actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: compact ? "space-between" : "flex-end",
          width: "100%",
          marginTop: compact ? "4px" : "10px",
        }}
      >
        <Tooltip title="Download File" placement="top">
          <IconButton 
            color="primary" 
            size={compact ? "small" : "small"} 
            onClick={handleDownload}
            sx={{ 
              padding: compact ? "4px" : "8px",
              "& .MuiSvgIcon-root": { fontSize: compact ? "16px" : "20px" }
            }}
          >
            <Download />
          </IconButton>
        </Tooltip>
        <Tooltip title="View File" placement="top">
          <IconButton 
            color="primary" 
            size={compact ? "small" : "small"} 
            onClick={handleView}
            sx={{ 
              padding: compact ? "4px" : "8px",
              "& .MuiSvgIcon-root": { fontSize: compact ? "16px" : "20px" }
            }}
          >
            <Visibility />
          </IconButton>
        </Tooltip>
        {uploading ? (
          <IconButton 
            color="primary" 
            disabled
            sx={{ 
              padding: compact ? "4px" : "8px",
              "& .MuiSvgIcon-root": { fontSize: compact ? "16px" : "20px" }
            }}
          >
            <CloudUpload />
          </IconButton>
        ) : (
          onRemove && (
            <Tooltip title="Remove File" placement="top">
              <IconButton
                color="error"
                size={compact ? "small" : "small"}
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to remove this file?")
                  ) {
                    onRemove?.(id);
                  }
                }}
                sx={{ 
                  padding: compact ? "4px" : "8px",
                  "& .MuiSvgIcon-root": { fontSize: compact ? "16px" : "20px" }
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          )
        )}
      </Box>
    </Box>
  );
};

export default DisplayFile;
