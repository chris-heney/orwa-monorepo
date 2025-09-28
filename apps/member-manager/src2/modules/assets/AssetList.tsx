import { Box, Button } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import {
    Datagrid,
    FilterLiveSearch,
    FunctionField,
    List,
    TextField as RaTextField,
    SelectInput,
    useNotify,
    useRefresh,
} from 'react-admin';

import { 
    BucketSidebar, 
    AssetListActions,
    FilePreview,
    FileSizeField,
    FileActions,
    AssetBulkActions,
    GridView,
    EmptyDropzone,
    UploadDialog,
    CreateFolderDialog
} from './components';
import { config } from '../../config';
import { clearResourceCache } from '../../dataProvider/ciWebServices';
import { AssetProvider, useAssetProvider } from './context/AssetProvider';
import { PathBreadcrumbs } from './components/PathBreadcrumbs';
import SyncIcon from '@mui/icons-material/Sync';

// Stable render functions for FunctionField components
const renderFilePreview = () => <FilePreview />;
const renderFileSizeField = () => <FileSizeField />;
const renderFileActions = () => <FileActions />;

const AssetListInner = () => {
    const { viewMode } = useAssetProvider();
    const [buckets, setBuckets] = useState([]);
    const { selectedBucket, currentPath, setCurrentPath, sidebarOpen, setSidebarOpen, sidebarWidth, setSidebarWidth, setSelectedBucket } = useAssetProvider();
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const notify = useNotify();
    const refresh = useRefresh();
    const [isSyncing, setIsSyncing] = useState(false);

    // Create Folder dialog state
    const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);

    const getBuckets = async () => {
        try {
            // Since user only has access to 'synapse' bucket, return a fixed bucket list
            return [{
                id: 'synapse',
                name: 'synapse',
            }];
        } catch (error) {
            console.error('Failed to fetch buckets:', error);
            return [];
        }
    };

    useEffect(() => {
        getBuckets().then(setBuckets);
    }, []);

    // Resize handlers
    const handleMouseDown = useCallback((e: any) => {
        setIsResizing(true);
        e.preventDefault();
    }, []);

    const handleMouseMove = useCallback((e: any) => {
        if (!isResizing) return;
        if (e.clientX < 10) {
            setSidebarOpen(false);
            setSidebarWidth(280);
            return;
        }
        
        const newWidth = e.clientX;
        if (newWidth >= 0 && newWidth <= 400) {
            setSidebarWidth(newWidth);
        }
    }, [isResizing, setSidebarOpen, setSidebarWidth]);

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
    }, []);

    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isResizing]);

    const handleUploadClick = () => {
        // Set the upload bucket to the selected bucket if one is selected
        setSelectedBucket(selectedBucket);
        setUploadDialogOpen(true);
    };

    const handleCreateFolderClick = () => setCreateFolderDialogOpen(true);

    const handleUploadComplete = () => {
        setUploadDialogOpen(false);
        setSelectedBucket('');
        notify('Files uploaded successfully', { type: 'success' });
        
        // Clear React Admin cache first, then refresh
        clearResourceCache("asset");
        refresh();
        
        // Also refresh buckets in case new ones were created
        getBuckets().then(setBuckets);
    };

    const handleSyncWithMinio = async () => {
        try {
            setIsSyncing(true);
            const res = await fetch(`${config.VITE_ASSET_API_URL}/sync`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ bucketName: selectedBucket || undefined }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Sync failed');
            }

            clearResourceCache('asset');
            refresh();
            notify('Synced with MinIO successfully', { type: 'success' });
            // Buckets counts might change
            getBuckets().then(setBuckets);
        } catch (e: any) {
            notify(e?.message || 'Failed to sync with MinIO', { type: 'error' });
        } finally {
            setIsSyncing(false);
        }
    };

    const createBucket = async (bucketName: string) => {
        // User only has access to 'synapse' bucket, cannot create new buckets
        notify('You do not have permission to create new buckets. You only have access to the "synapse" bucket.', { type: 'error' });
    };

    // Build filters based on selected bucket
    const buildFilters = () => {
        const filters = [
            <FilterLiveSearch
                key="search"
                source="originalName[$contains]"
                placeholder="Search files..."
                alwaysOn
                sx={{
                    '& .MuiInputBase-input': {
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                    },
                }}
            />,
        ];

        // If no specific bucket is selected, show bucket filter
        if (!selectedBucket) {
            filters.push(
                <SelectInput
                    key="bucket"
                    source="bucketName[$contains]"
                    choices={buckets}
                    label="Bucket"
                    emptyText="All Buckets"
                    sx={{
                        minWidth: { xs: '120px', sm: '160px' },
                    }}
                />
            );
        }

        return filters;
    };

    const renderContent = () => {
        const listProps = {
            actions: (
                <AssetListActions
                    onUploadClick={handleUploadClick}
                    onCreateFolderClick={handleCreateFolderClick}
                    onToggleSidebar={() => setSidebarOpen(true)}
                />
            ),
            disableSyncWithLocation: true,
            filters: buildFilters(),
            filter: {
                ...(selectedBucket ? { bucketName: { $eq: selectedBucket } } : {}),
                ...(currentPath
                    ? { folderPath: { $eq: currentPath.replace(/^\/+|\/+$/g, '') } }
                    : { folderPath: { $null: true } }
                ),
            },
            sort: { field: 'createdAt', order: 'DESC' as const },
            empty: <EmptyDropzone onUploadClick={handleUploadClick} />,
            sx: {
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '& .RaList-main': {
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                },
                '& .RaList-content': {
                    flex: 1,
                    overflow: 'auto',
                },
            },
        };

        if (viewMode === 'grid') {
            return (
                <List {...listProps} perPage={20}>
                    <GridView />
                </List>
            );
        }

        return (
            <List {...listProps}>
                <Datagrid
                    bulkActionButtons={<AssetBulkActions />}
                    rowClick={(id, resource, record) => {
                        if (record?.mimeType === 'application/x-directory' || /\/$/.test(record?.fileName || '')) {
                            const normalized = (record.fileName || '').replace(/\/+$/, '')
                            setCurrentPath(normalized)
                            return false
                        }
                        return false
                    }}
                    sx={{
                        '& .MuiTableContainer-root': {
                            maxHeight: 'none',
                        },
                    }}
                >
                    <FunctionField
                        label="File"
                        render={renderFilePreview}
                        sortable={false}
                    />
                    {!selectedBucket && (
                        <RaTextField source="bucketName" label="Bucket" />
                    )}
                    <FunctionField
                        label="Size"
                        render={renderFileSizeField}
                        sortable={false}
                    />
                    <FunctionField
                        label="Actions"
                        render={renderFileActions}
                        sortable={false}
                    />
                </Datagrid>
            </List>
        );
    };

    return (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            {/* Sidebar */}
            {sidebarOpen && (
                <Box
                    sx={{
                        width: sidebarWidth,
                        flexShrink: 0,
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    <BucketSidebar/>
                    
                    {/* Resize Handle */}
                    <Box
                        onMouseDown={handleMouseDown}
                        sx={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: 4,
                            cursor: 'col-resize',
                            backgroundColor: 'transparent',
                            zIndex: 1,
                            '&:hover': {
                                backgroundColor: 'primary.main',
                                opacity: 0.5,
                            },
                            ...(isResizing && {
                                backgroundColor: 'primary.main',
                                opacity: 0.7,
                            }),
                        }}
                    >
                    </Box>
                </Box>
            )}

            {/* Main Content */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    height: '100%',
                    ml: sidebarOpen ? 1 : 0,
                }}
            >
                {/* Breadcrumbs below the search bar with Sync button on the right */}
                <Box sx={{ px: 2, pt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <PathBreadcrumbs />
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<SyncIcon />}
                        onClick={handleSyncWithMinio}
                        disabled={isSyncing}
                    >
                        {isSyncing ? 'Syncing…' : 'Sync with MinIO'}
                    </Button>
                </Box>
                {renderContent()}
            </Box>

            <UploadDialog
                open={uploadDialogOpen}
                onClose={() => setUploadDialogOpen(false)}
                buckets={buckets}
                refreshBuckets={() => getBuckets().then(setBuckets)}
                onCreateBucket={createBucket}
                onUploadComplete={handleUploadComplete}
            />

            <CreateFolderDialog
                open={createFolderDialogOpen}
                onClose={() => setCreateFolderDialogOpen(false)}
                buckets={buckets}
                onRefreshBuckets={() => getBuckets().then(setBuckets)}
                onCreateBucket={createBucket}
            />
        </Box>
    );
};

const AssetList = () => (
    <AssetProvider>
        <AssetListInner />
    </AssetProvider>
);

export default AssetList;
