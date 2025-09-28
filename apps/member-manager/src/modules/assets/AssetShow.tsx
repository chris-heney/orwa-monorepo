import React, { useState, useCallback } from 'react';
import {
    Show,
    useRecordContext,
    TopToolbar,
    DeleteButton,
} from 'react-admin';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Button,
    Grid,
    Paper,
    IconButton,
    Tooltip,
    Alert,
    CircularProgress,
    Stack,
    useTheme,
    alpha,
} from '@mui/material';
import {
    CloudDownload as DownloadIcon,
    OpenInNew as OpenIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
    ContentCopy as CopyIcon,
} from '@mui/icons-material';

const ShowActions = () => (
    <TopToolbar>
        <DeleteButton />
    </TopToolbar>
);

const FilePreviewShow = () => {
    const record = useRecordContext();
    const theme = useTheme();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [textContent, setTextContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    // Enhanced file type detection
    const getFileType = () => {
        if (!record) return 'other';
        const mimeType = record.mimeType?.toLowerCase() || '';
        const extension = record.originalName?.split('.').pop()?.toLowerCase() || '';

        if (mimeType.startsWith('image/')) return 'image';
        if (mimeType.startsWith('video/')) return 'video';
        if (mimeType.startsWith('audio/')) return 'audio';
        if (mimeType === 'application/pdf') return 'pdf';
        
        // Text-based files
        if (mimeType.startsWith('text/') || 
            ['txt', 'md', 'json', 'xml', 'csv', 'log', 'yaml', 'yml'].includes(extension)) {
            return 'text';
        }
        
        // Code files
        if (['js', 'ts', 'tsx', 'jsx', 'html', 'css', 'scss', 'less', 'php', 'py', 'rb', 'java', 'c', 'cpp', 'cs', 'go', 'rs', 'sql'].includes(extension)) {
            return 'code';
        }
        
        // Office documents
        if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension) || 
            mimeType.includes('openxmlformats') || 
            mimeType.includes('officedocument')) {
            return 'office';
        }
        
        // Archives
        if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
            return 'archive';
        }

        return 'other';
    };

    const fileType = getFileType();

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const loadTextContent = useCallback(async () => {
        if (!record || (fileType !== 'text' && fileType !== 'code')) return;
        
        setIsLoading(true);
        setError('');
        
        try {
            const response = await fetch(record.fileUrl);
            if (!response.ok) throw new Error('Failed to load file content');
            
            const text = await response.text();
            setTextContent(text);
        } catch (err) {
            setError('Failed to load file content');
            console.error('Error loading text content:', err);
        } finally {
            setIsLoading(false);
        }
    }, [fileType, record]);

    const handleDownload = () => {
        if (!record) return;
        const link = document.createElement('a');
        link.href = record.fileUrl;
        link.download = record.originalName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleOpen = () => {
        if (!record) return;
        window.open(record.fileUrl, '_blank');
    };

    const handleCopyUrl = async () => {
        if (!record) return;
        try {
            await navigator.clipboard.writeText(record.fileUrl);
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    React.useEffect(() => {
        loadTextContent();
    }, [loadTextContent]);

    if (!record) return null;

    const renderFilePreview = () => {
        const previewStyle = {
            width: '100%',
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative' as const,
            backgroundColor: alpha(theme.palette.grey[100], 0.5),
        };

        const fullscreenStyle = isFullscreen ? {
            position: 'fixed' as const,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: theme.zIndex.modal,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 2,
        } : {};

        switch (fileType) {
            case 'image':
    return (
                    <Box sx={{ ...previewStyle, ...fullscreenStyle }}>
                                <Box
                                    component="img"
                                    src={record.fileUrl}
                                    alt={record.originalName}
                                    sx={{
                                        maxWidth: '100%',
                                maxHeight: isFullscreen ? '90vh' : 400,
                                        objectFit: 'contain',
                                borderRadius: isFullscreen ? 0 : 2,
                                cursor: isFullscreen ? 'zoom-out' : 'zoom-in',
                            }}
                            onClick={toggleFullscreen}
                        />
                        <IconButton
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                                }
                            }}
                            onClick={toggleFullscreen}
                            size="small"
                        >
                            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                        </IconButton>
                    </Box>
                );

            case 'video':
                return (
                    <Box sx={previewStyle}>
                                <Box
                                    component="video"
                                    controls
                                    sx={{
                                width: '100%',
                                maxHeight: 400,
                                backgroundColor: '#000',
                                    }}
                                >
                                    <source src={record.fileUrl} type={record.mimeType} />
                                    Your browser does not support the video tag.
                                </Box>
                    </Box>
                );

            case 'audio':
                return (
                    <Box sx={previewStyle}>
                        <Paper
                            elevation={2}
                                        sx={{ 
                                p: 3,
                                textAlign: 'center',
                                background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                                color: 'white',
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                {record.originalName}
                            </Typography>
                                    <Box
                                        component="audio"
                                        controls
                                sx={{ 
                                    width: '100%',
                                    mt: 2,
                                    '& audio': {
                                        width: '100%',
                                    }
                                }}
                                    >
                                        <source src={record.fileUrl} type={record.mimeType} />
                                        Your browser does not support the audio tag.
                                    </Box>
                        </Paper>
                                </Box>
                );

            case 'pdf':
                return (
                    <Box sx={previewStyle}>
                                    <iframe
                                        src={record.fileUrl}
                                        width="100%"
                            height="500"
                            style={{ 
                                border: 'none', 
                                borderRadius: theme.spacing(1),
                            }}
                                        title={record.originalName}
                                    />
                    </Box>
                );

            case 'text':
            case 'code':
                return (
                    <Box sx={previewStyle}>
                        <Paper
                            variant="outlined"
                            sx={{
                                height: 400,
                                overflow: 'auto',
                                p: 2,
                                fontFamily: fileType === 'code' ? 'monospace' : 'inherit',
                                fontSize: '0.875rem',
                                lineHeight: 1.5,
                                backgroundColor: fileType === 'code' ? '#f5f5f5' : 'inherit',
                            }}
                        >
                            {isLoading ? (
                                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                    <CircularProgress />
                                </Box>
                            ) : error ? (
                                <Alert severity="error" sx={{ height: 'fit-content' }}>
                                    {error}
                                    <Button onClick={loadTextContent} size="small" sx={{ ml: 1 }}>
                                        Retry
                                    </Button>
                                </Alert>
                            ) : (
                                <pre style={{ 
                                    margin: 0, 
                                    whiteSpace: 'pre-wrap', 
                                    wordBreak: 'break-word',
                                    fontFamily: 'inherit',
                                }}>
                                    {textContent}
                                </pre>
                            )}
                        </Paper>
                    </Box>
                );

            case 'office':
                return (
                    <Box sx={previewStyle}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                height: 300,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                           
                            <Typography variant="h6" gutterBottom>
                                Office Document
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={2}>
                                {record.originalName}
                            </Typography>
                            <Alert severity="info">
                                Office documents can be viewed by downloading or opening in a new tab
                            </Alert>
                        </Paper>
                    </Box>
                );

            default:
                return (
                    <Box sx={previewStyle}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                height: 300,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                           
                            <Typography variant="h6" gutterBottom>
                                {record.originalName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Preview not available for this file type
                            </Typography>
                        </Paper>
                    </Box>
                );
        }
    };

    return (
        <>
            <Card 
                elevation={3}
                sx={{ 
                    mb: 3,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.secondary.main, 0.02)})`,
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={7}>
                            <Box>
                                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                                
                                    <Box>
                                        <Typography variant="h5" component="h1" fontWeight="bold">
                                            {record.originalName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {record.mimeType} • {formatFileSize(record.fileSize)}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Stack direction="row" spacing={1} mb={3} flexWrap="wrap" gap={1}>
                                <Button
                                    variant="contained"
                                    startIcon={<DownloadIcon />}
                                    onClick={handleDownload}
                                    size="small"
                                >
                                    Download
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<OpenIcon />}
                                    onClick={handleOpen}
                                    size="small"
                                >
                                        Open in New Tab
                                </Button>
                                    <Tooltip title="Copy URL">
                                        <IconButton onClick={handleCopyUrl} size="small">
                                            <CopyIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>

                                {renderFilePreview()}
                        </Box>
                    </Grid>
                        
                        <Grid item xs={12} lg={5}>
                            <Stack spacing={3}>
                                <Box>
                                    <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" gap={1}>
                            <Chip 
                                label={`Bucket: ${record.bucketName}`}
                                color="primary"
                                variant="outlined"
                                            size="small"
                            />
                            <Chip 
                                            label={fileType.toUpperCase()}
                                color="secondary"
                                            variant="filled"
                                            size="small"
                            />
                                    </Stack>
                        </Box>
                        
                        {record.description && (
                                    <Paper variant="outlined" sx={{ p: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                                    Description
                                </Typography>
                                        <Typography variant="body2">
                                    {record.description}
                                </Typography>
                                    </Paper>
                        )}
                        
                        {record.tags && record.tags.length > 0 && (
                                    <Paper variant="outlined" sx={{ p: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                                    Tags
                                </Typography>
                                        <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                                    {record.tags.map((tag: string, index: number) => (
                                        <Chip 
                                            key={index}
                                            label={tag}
                                            size="small"
                                                    variant="outlined"
                                        />
                                    ))}
                                        </Stack>
                                    </Paper>
                                )}
                                
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                                        File Information
                                    </Typography>
                        <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                <Typography variant="caption" color="text.secondary">
                                    System File Name
                                </Typography>
                                            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                                    {record.fileName}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">
                                    Uploaded By
                                </Typography>
                                <Typography variant="body2">
                                    {record.uploadedBy || 'Unknown'}
                                </Typography>
                            </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                File Size
                                            </Typography>
                                            <Typography variant="body2">
                                                {formatFileSize(record.fileSize)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">
                                    Created At
                                </Typography>
                                <Typography variant="body2">
                                                {new Date(record.createdAt).toLocaleDateString()}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">
                                    Last Updated
                                </Typography>
                                <Typography variant="body2">
                                                {new Date(record.updatedAt).toLocaleDateString()}
                                </Typography>
                            </Grid>
                        </Grid>
                                </Paper>
                        
                                <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                File URL
                            </Typography>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    wordBreak: 'break-all',
                                            backgroundColor: alpha(theme.palette.grey[500], 0.1),
                                    p: 1,
                                    borderRadius: 1,
                                            mt: 0.5,
                                            fontFamily: 'monospace',
                                            fontSize: '0.75rem',
                                }}
                            >
                                {record.fileUrl}
                            </Typography>
                                </Paper>
                            </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
            
            {isFullscreen && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: theme.zIndex.modal,
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 2,
                    }}
                    onClick={toggleFullscreen}
                >
                    {renderFilePreview()}
                </Box>
            )}
        </>
    );
};

const AssetShow = () => {
    return (
        <Show component={"div"} actions={<ShowActions />} title="File Details">
            <FilePreviewShow />
        </Show>
    );
};

export default AssetShow;
