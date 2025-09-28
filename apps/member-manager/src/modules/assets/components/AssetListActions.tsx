import {
    CloudUpload as UploadIcon,
    Menu as MenuIcon,
    CreateNewFolder as CreateNewFolderIcon,
    ViewModule as GridViewIcon,
    ViewList as ListViewIcon,
} from '@mui/icons-material';
import {
    IconButton,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
} from '@mui/material';
import {
    ExportButton,
    TopToolbar,
} from 'react-admin';
import { useAssetProvider } from '../context/AssetProvider';

interface AssetListActionsProps {
    onUploadClick: () => void;
    onCreateFolderClick: () => void;
    onToggleSidebar: () => void;
}

export const AssetListActions = ({ 
    onUploadClick, 
    onCreateFolderClick,
    onToggleSidebar 
}: AssetListActionsProps) => {
    const { viewMode, setViewMode, sidebarOpen } = useAssetProvider();
    return (
        <TopToolbar sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
        }}>
            {!sidebarOpen && (
                <IconButton 
                    onClick={onToggleSidebar}
                    title="Show Sidebar"
                    size="small"
                >
                    <MenuIcon />
                </IconButton>
            )}
            <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                size="small"
            >
                <Tooltip title="List view">
                    <ToggleButton value="list" aria-label="list view">
                        <ListViewIcon fontSize="small"/>
                    </ToggleButton>
                </Tooltip>
                <Tooltip title="Grid view">
                    <ToggleButton value="grid" aria-label="grid view">
                        <GridViewIcon fontSize="small" />
                    </ToggleButton>
                </Tooltip>
            </ToggleButtonGroup>
            <Tooltip title="New Folder">
                <IconButton 
                    onClick={onCreateFolderClick}
                    color="primary"
                >
                    <CreateNewFolderIcon fontSize="small" />
                </IconButton>
            </Tooltip>
                <Tooltip title="Upload Files">
                <IconButton 
                    onClick={onUploadClick}
                    color="primary"
                >
                    <UploadIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <ExportButton size="small" />
        </TopToolbar>
    );
};
