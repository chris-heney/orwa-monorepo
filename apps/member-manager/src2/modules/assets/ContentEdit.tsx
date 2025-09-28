import React from 'react';
import {
    Edit,
    SimpleForm,
    TextInput,
    ArrayInput,
    SimpleFormIterator,
    required,
    useRecordContext,
} from 'react-admin';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    Chip,
} from '@mui/material';
import { InsertDriveFile as FileIcon } from '@mui/icons-material';

const FilePreviewEdit = () => {
    const record = useRecordContext();
    if (!record) return null;

    const isImage = record.mimeType?.startsWith('image/');
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                    {isImage ? (
                        <Avatar
                            src={record.fileUrl}
                            sx={{ width: 80, height: 80 }}
                            variant="rounded"
                        >
                            <FileIcon />
                        </Avatar>
                    ) : (
                        <Avatar 
                            sx={{ width: 80, height: 80 }} 
                            variant="rounded"
                        >
                            <FileIcon sx={{ fontSize: 40 }} />
                        </Avatar>
                    )}
                    <Box flex={1}>
                        <Typography variant="h6">
                            {record.originalName}
                        </Typography>
                        <Box display="flex" gap={1} mt={1}>
                            <Chip 
                                label={record.bucketName} 
                                size="small" 
                                variant="outlined" 
                            />
                            <Chip 
                                label={record.mimeType} 
                                size="small" 
                                variant="outlined" 
                            />
                            <Chip 
                                label={formatFileSize(record.fileSize)} 
                                size="small" 
                                variant="outlined" 
                            />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            File URL: <a href={record.fileUrl} target="_blank" rel="noopener noreferrer">
                                {record.fileUrl}
                            </a>
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

const ContentEdit = () => {
    return (
        <Edit title="Edit File Details">
            <SimpleForm>
                <FilePreviewEdit />
                
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    File Information
                </Typography>
                
                <TextInput 
                    source="originalName" 
                    label="Original Name"
                    validate={required()}
                    fullWidth
                />
                
                <TextInput 
                    source="description" 
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                />
                
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Tags
                </Typography>
                
                <ArrayInput source="tags" label="">
                    <SimpleFormIterator inline>
                        <TextInput 
                            source="" 
                            label="Tag"
                            helperText="Add tags to help organize and find your files"
                        />
                    </SimpleFormIterator>
                </ArrayInput>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    System Information (Read Only)
                </Typography>
                
                <TextInput 
                    source="fileName" 
                    label="System File Name"
                    disabled
                    fullWidth
                />
                
                <TextInput 
                    source="bucketName" 
                    label="Bucket"
                    disabled
                    fullWidth
                />
                
                <TextInput 
                    source="mimeType" 
                    label="MIME Type"
                    disabled
                    fullWidth
                />
                
                <TextInput 
                    source="fileSize" 
                    label="File Size (bytes)"
                    disabled
                    fullWidth
                />
            </SimpleForm>
        </Edit>
    );
};

export default ContentEdit;