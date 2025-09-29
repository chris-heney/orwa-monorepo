import React, { useState, useRef, useCallback, useEffect } from "react";
import { Box, Grid, Button, Typography, Paper } from "@mui/material";
import { useFormContext } from "react-hook-form";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from '@mui/material/styles';
import uploadService from "../services/uploadService";
import DisplayFile from "./DisplayFile";
import ContentLibraryDialog from "./AssetLibraryDialog";

interface FileUploadFieldProps {
  source: string;
  label: string;
  multiple?: boolean;
  fullWidth?: boolean;
  accept?: string; // File types to accept (e.g., "image/*", ".pdf,.doc,.docx", etc.)
  bucketName?: string; // Bucket to upload files to (defaults to 'synapse')
  folderPath?: string; // Optional folder path inside the bucket (e.g., "OrgA/logos")
  onChange?: (contentId: number | null) => void; // Optional callback for custom data handling
  assetType?: string; // Asset type for organization assets (e.g., 'logo', 'headshot')
}

const DropZone = styled(Paper)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  cursor: 'pointer',
  transition: 'border-color 0.2s ease-in-out, background-color 0.2s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
  minHeight: 120,
})) as React.ComponentType<any>;

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  source,
  label,
  multiple = false,
  fullWidth = false,
  accept = "*/*", // Default to accept all file types
  bucketName = "synapse", // Default bucket name - user only has access to synapse bucket
  folderPath,
  onChange,
  assetType,
}) => {
  const { setValue, getValues, trigger } = useFormContext();
  
  // Helper function to create asset payload for organization assets
  const createAssetPayload = (assetId: number | null, assetType: string = 'logo') => {
    if (!assetId) return null;
    return { assetId, assetType };
  };

  // Helper function to handle organization asset updates
  const handleOrganizationAssetUpdate = (contentId: number | null) => {
    if (assetType && source.includes('organizationAssets')) {
      // For object-based organization assets like organizationAssets[0]
      if (source.includes('[') && source.includes(']')) {
        // Extract index from source (e.g., 'organizationAssets[0]' -> index 0)
        const match = source.match(/\[(\d+)\]/);
        if (match) {
          const index = parseInt(match[1]);
          const baseField = source.split('[')[0]; // 'organizationAssets'
          const currentObject = getValues(baseField) || {};
          
          // Update the specific index in the object
          currentObject[index] = createAssetPayload(contentId, assetType);
          setValue(baseField, currentObject, { shouldDirty: true });
        }
      } else {
        // For non-array organization assets
        const baseField = source.split('[')[0];
        setValue(baseField, createAssetPayload(contentId, assetType), { shouldDirty: true });
      }
    }
  };
  
  // Ensure proper initialization based on multiple prop
  const getFilesValue = () => {
    const value = getValues(source);
    console.log('value', value);
    
    // Handle organization assets object structure
    if (source.includes('organizationAssets') && source.includes('[') && source.includes(']')) {
      // For organizationAssets[0], get the assetId from the object
      if (value && typeof value === 'object' && 'assetId' in value) {
        return value.assetId;
      }
      return null;
    }
    
    if (multiple) {
      return Array.isArray(value) ? value : [];
    }
    console.log('value', value);
    return value || null;
  };
  
  
  const files = getFilesValue();
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGlobalDragging, setIsGlobalDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Global drag detection
  useEffect(() => {
    let dragCounter = 0;
    
    const handleGlobalDragEnter = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes('Files')) {
        dragCounter++;
        setIsGlobalDragging(true);
      }
    };
    
    const handleGlobalDragLeave = (e: DragEvent) => {
      dragCounter--;
      // Reset when drag counter reaches 0 (no more drag events)
      if (dragCounter === 0) {
        setIsGlobalDragging(false);
        setIsDragging(false);
      }
    };
    
    const handleGlobalDrop = () => {
      dragCounter = 0;
      setIsGlobalDragging(false);
      setIsDragging(false);
    };
    
    const handleGlobalDragEnd = () => {
      dragCounter = 0;
      setIsGlobalDragging(false);
      setIsDragging(false);
    };
    
    window.addEventListener('dragenter', handleGlobalDragEnter);
    window.addEventListener('dragleave', handleGlobalDragLeave);
    window.addEventListener('drop', handleGlobalDrop);
    window.addEventListener('dragend', handleGlobalDragEnd);
    
    return () => {
      window.removeEventListener('dragenter', handleGlobalDragEnter);
      window.removeEventListener('dragleave', handleGlobalDragLeave);
      window.removeEventListener('drop', handleGlobalDrop);
      window.removeEventListener('dragend', handleGlobalDragEnd);
    };
    }, []);
  
  // Reset all drag states
  const resetDragStates = useCallback(() => {
    setIsDragging(false);
    setIsGlobalDragging(false);
  }, []);
 
  // Handle file removal for multiple files
  const handleRemoveFromArray = (id: number | object) => {
    const currentFiles = Array.isArray(files) ? files : [];
    const updatedFiles = currentFiles.filter((file: number | object) => file !== id);
    setValue(source, updatedFiles, {shouldDirty: true});
    trigger(source);
    trigger();
  };

  // Handle file removal for a single file
  const handleRemove = () => {
    // Handle organization assets automatically
    handleOrganizationAssetUpdate(null);
    
    // For organization assets, we don't set the source directly since handleOrganizationAssetUpdate handles it
    if (!source.includes('organizationAssets')) {
      setValue(source, null, {shouldDirty: true});
    }
    
    // Call onChange callback if provided (for custom data handling)
    if (onChange) {
      onChange(null);
    }
    trigger(source);
  };

  // Update form field when a file finishes uploading
  const handleUploadComplete = (newFileId: number) => {
    if (multiple) {
      const currentFiles = Array.isArray(files) ? files : [];
      const updatedFiles = [
        ...currentFiles.filter((file: any) => typeof file === "number"),
        newFileId,
      ];
      setValue(source, updatedFiles, {shouldDirty: true});
    } else {
      // Handle organization assets automatically
      handleOrganizationAssetUpdate(newFileId);
      
      // For non-organization assets, set the source directly
      if (!source.includes('organizationAssets')) {
        setValue(source, newFileId, {shouldDirty: true});
      }
      
      // Call onChange callback if provided (for custom data handling)
      if (onChange) {
        onChange(newFileId);
      }
    }
    trigger(source);
  };

  // Handle selecting an image from the media library
  const handleMediaLibrarySelect = (id: number) => {
    if (multiple) {
      const currentFiles = Array.isArray(files) ? files : [];
      const updatedFiles = [
        ...currentFiles.filter((file: any) => typeof file === "number"),
        id,
      ];
      setValue(source, updatedFiles, {shouldDirty: true});
    } else {
      // Handle organization assets automatically
      handleOrganizationAssetUpdate(id);
      
      // For non-organization assets, set the source directly
      if (!source.includes('organizationAssets')) {
        setValue(source, id, {shouldDirty: true});
      }
      
      // Call onChange callback if provided (for custom data handling)
      if (onChange) {
        onChange(id);
      }
    }
    trigger(source);
  };

  // Handle file input change
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      try {
        setIsUploading(true);
        
        if (multiple) {
          // Handle multiple files
          const fileArray = Array.from(event.target.files);
          const uploadPromises = fileArray.map(file => uploadService.uploadFile(file, bucketName, folderPath));
          const uploadedFiles = await Promise.all(uploadPromises);
          
          // Update the form with the file IDs
          const currentFiles = Array.isArray(files) ? files : [];
          const updatedFiles = [
            ...currentFiles.filter((file: any) => typeof file === "number"),
            ...uploadedFiles,
          ];
          setValue(source, updatedFiles, {shouldDirty: true});
        } else {
          // Handle single file
          const file = event.target.files[0];
          const uploadedFile = await uploadService.uploadFile(file, bucketName, folderPath);
          
          // Handle organization assets automatically
          handleOrganizationAssetUpdate(uploadedFile);
          
          // For non-organization assets, set the source directly
          if (!source.includes('organizationAssets')) {
            setValue(source, uploadedFile, {shouldDirty: true});
          }
          
          // Call onChange callback if provided (for custom data handling)
          if (onChange) {
            onChange(uploadedFile);
          }
        }
        
        trigger(source);
        resetDragStates(); // Reset drag states after successful upload
      } catch (error) {
        console.error('Error uploading file:', error);
        // You might want to show an error message to the user
      } finally {
        setIsUploading(false);
        resetDragStates(); // Reset drag states regardless of success/failure
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if we're actually leaving the drop zone
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);
  
  // Fallback: Reset drag states after a timeout to handle edge cases
  useEffect(() => {
    if (isGlobalDragging || isDragging) {
      const timeout = setTimeout(() => {
        resetDragStates();
      }, 3000); // Reset after 3 seconds if states are still active
      
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGlobalDragging, isDragging]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Immediately reset drag states for instant visual feedback
    resetDragStates();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      try {
        setIsUploading(true);
        
        if (multiple) {
          // Handle multiple files
          const fileArray = Array.from(e.dataTransfer.files);
          const uploadPromises = fileArray.map(file => uploadService.uploadFile(file, bucketName, folderPath));
          const uploadedFiles = await Promise.all(uploadPromises);
          
          // Update the form with the file IDs
          const currentFiles = Array.isArray(files) ? files : [];
          const updatedFiles = [
            ...currentFiles.filter((file: any) => typeof file === "number"),
            ...uploadedFiles,
          ];
          setValue(source, updatedFiles, {shouldDirty: true});
        } else {
          // Handle single file
          const file = e.dataTransfer.files[0];
          const uploadedFile = await uploadService.uploadFile(file, bucketName, folderPath);
          
          // Handle organization assets automatically
          handleOrganizationAssetUpdate(uploadedFile);
          
          // For non-organization assets, set the source directly
          if (!source.includes('organizationAssets')) {
            setValue(source, uploadedFile, {shouldDirty: true});
          }
          
          // Call onChange callback if provided (for custom data handling)
          if (onChange) {
            onChange(uploadedFile);
          }
        }
        
        trigger(source);
        resetDragStates(); // Reset drag states after successful upload
      } catch (error) {
        console.error('Error uploading file via drag and drop:', error);
        // You might want to show an error message to the user
      } finally {
        setIsUploading(false);
        resetDragStates(); // Reset drag states regardless of success/failure
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, multiple, source, bucketName]);

  return (
    <Grid item xs={12} sm={fullWidth ? 12 : 6}>
      <Box display="flex" flexDirection="column" gap={1}>
        {/* Hidden file input for direct file selection */}
        <Box sx={{ display: 'none' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
          />
        </Box>
        
        {/* Custom Drop Zone */}
        <DropZone
          elevation={0}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          sx={{
            borderColor: (isDragging || isGlobalDragging) ? 'primary.main' : undefined,
            backgroundColor: (isDragging || isGlobalDragging) ? 'action.hover' : undefined,
            opacity: isUploading ? 0.7 : 1,
            transform: isGlobalDragging ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.2s ease-in-out',
            borderWidth: isGlobalDragging ? '3px' : '2px',
            borderStyle: 'dashed',
            boxShadow: isGlobalDragging ? '0 4px 20px rgba(0, 0, 0, 0.1)' : undefined,
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Typography variant="body1" color="textSecondary">
              {label}
            </Typography>
            
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : `Upload File${multiple ? 's' : ''}`}
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<PhotoLibraryIcon />}
                onClick={() => setMediaLibraryOpen(true)}
                disabled={isUploading}
              >
                Media Library
              </Button>
            </Box>
            
            <Typography 
              variant="caption" 
              color={isGlobalDragging ? "primary" : "textSecondary"}
              sx={{
                fontWeight: isGlobalDragging ? 'bold' : 'normal',
                fontSize: isGlobalDragging ? '14px' : '12px',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {isUploading 
                ? 'Uploading file...' 
                : isGlobalDragging 
                  ? `Drop your file${multiple ? 's' : ''} here!` 
                  : `Drop file${multiple ? 's' : ''} here or click to upload`
              }
            </Typography>
          </Box>
        </DropZone>

        {/* Display Uploaded Files */}
        <Box mt={2}>
          {multiple && Array.isArray(files) && files.length > 0 ? (
            <Box>
              <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: "block" }}>
                {files.length} file{files.length !== 1 ? 's' : ''} uploaded
              </Typography>
              <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(120px, 1fr))"
                gap={2}
                maxHeight="400px"
                overflow="auto"
                sx={{
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f1f1f1',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#c1c1c1',
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: '#a8a8a8',
                    },
                  },
                }}
              >
                {files.map((file: number | { rawFile: File; src: string; title: string }) => (
                  <DisplayFile
                    key={typeof file === "number" ? file : file.rawFile ? file.rawFile.name : file.src}
                    id={file}
                    onRemove={handleRemoveFromArray}
                    onUploadComplete={handleUploadComplete}
                    compact={true}
                  />
                ))}
              </Box>
            </Box>
          ) : (
            !multiple && files && (
              <DisplayFile
                id={files}
                onRemove={handleRemove}
                onUploadComplete={handleUploadComplete}
                compact={false}
              />
            )
          )}
        </Box>
      </Box>

      {/* Media Library Dialog */}
      <ContentLibraryDialog
        open={mediaLibraryOpen}
        onClose={() => setMediaLibraryOpen(false)}
        onSelectImageById={handleMediaLibrarySelect}
      />
    </Grid>
  );
};

export default FileUploadField;
