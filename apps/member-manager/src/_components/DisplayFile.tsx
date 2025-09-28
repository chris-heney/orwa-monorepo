import { useCallback, useEffect, useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
// uploadService no longer needed - ciWebServices handles uploads
import { Download, Delete, Visibility } from "@mui/icons-material";
import { useDataProvider } from "react-admin";
import { Content } from "@ci-connect/types";

const DisplayFile = ({
  id,
  onRemove,
  compact = false,
}: {
  id: number | { rawFile: File; src: string; title: string }; // Accept both existing file ID or new file object
  onRemove?: (id: number | object) => void;
  onUploadComplete?: (newFileId: number) => void; // Notify parent component after upload
  compact?: boolean; // New prop for compact display mode
}) => {
  const [file, setFile] = useState<Content | { name: string; url: string; isNew?: boolean } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const dataProvider = useDataProvider();

  console.log('file', id);

  // No longer need API_ENDPOINT since uploadService handles URLs

  // Handle new file objects - no need to upload since ciWebServices handles it
  const processNewFile = useCallback((fileData: { rawFile: File; src: string; title: string }) => {
    setFile({
      name: fileData.title,
      url: fileData.src,
      isNew: true,
    });
    // Note: Actual upload will be handled by ciWebServices when form is submitted
  }, []);

  useEffect(() => {
    const processFile = async () => {
      try {
        if (typeof id === "number") {
          // For existing uploaded files, fetch from the data provider
          const response = await dataProvider.getOne("asset", { id });
          setFile(response.data as Content);
        } else if (typeof id === "object" && id.rawFile) {
          // Newly selected file (before form submission)
          processNewFile(id);
        } else if (typeof id === "object" && (id as any).url) {
          // Existing file object from the server (could be Content type)
          setFile(id as any);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dataProvider]);

  if (loading) return <div>Loading...</div>;
  if (!file) return <div>No file available</div>;

  const handleDownload = async () => {
    try {
      if (!file) return;
      
      const isNewFile = 'isNew' in file && file.isNew;
      const fileUrl = (() => {
        if ('fileUrl' in file) return file.fileUrl;
        return '';
      })();
      const fileName = (() => {
        if ('originalName' in file) return file.originalName;
        return 'file';
      })();
      
      if (isNewFile || fileUrl.startsWith("blob:")) {
        // Download directly from the local URL for new files
        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      } else {
        // Download from the server for existing files
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleView = () => {
    if (!file) return;
    
    const fileUrl = (() => {
      if ('isNew' in file && file.isNew && 'url' in file) return file.url;
      if ('fileUrl' in file) return file.fileUrl;
      if ('url' in file) return file.url;
      return '';
    })();
    
    if (fileUrl) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Helper function to check if file is an image
  const isImageFile = () => {
    const imageExtensions = ["png", "jpg", "jpeg", "gif", "webp", "svg"];
    let filename = "";
    
    // Handle different file object types
    if (file && typeof file === 'object') {
      if ('originalName' in file) {
        // Content type
        filename = file.originalName;
      } 
    }
    
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
      {isImageFile() ? (
        <img
          src={(() => {
            if (!file) return '';
            if ('isNew' in file && file.isNew) return file.url;
            if ('fileUrl' in file) return file.fileUrl;
            if ('url' in file) return file.url;
            return '';
          })()}
          alt={(() => {
            if (!file) return '';
            if ('originalName' in file) return file.originalName;
            if ('name' in file) return file.name;
            return 'File';
          })()}
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
            href={(() => {
              if (!file) return '';
              if ('isNew' in file && file.isNew) return file.url;
              if ('fileUrl' in file) return file.fileUrl;
              if ('url' in file) return file.url;
              return '';
            })()}
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
            {(() => {
              if (!file) return 'File';
              let fileName = '';
              if ('originalName' in file) fileName = file.originalName;
              else if ('name' in file) fileName = file.name;
              else fileName = 'File';
              return compact ? fileName.substring(0, 20) + (fileName.length > 20 ? "..." : "") : fileName;
            })()}
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
        {onRemove && (
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
        )}
      </Box>
    </Box>
  );
};

export default DisplayFile;
