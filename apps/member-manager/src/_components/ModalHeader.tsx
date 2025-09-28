import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import {
    Confirm,
    useDelete,
    useNotify,
    useRecordContext,
    useResourceContext,
} from 'react-admin';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomHeader from './CustomHeader';

const ModalHeader = ({
    title,
    onClose,
    redirect = false,
    actions,
    backButton = false,
    deleteButton = false,
    editButton = false,
    showButton = false,
}: {
    title: string;
    onClose?: () => void;
    redirect?: string | false;
    actions?: React.ReactNode;
    backButton?: boolean;
    deleteButton?: boolean;
    editButton?: boolean;
    showButton?: boolean;
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const resource = useResourceContext();
    const record = useRecordContext();
    const notify = useNotify();

    // State for delete confirmation dialog
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    const [deleteRecord, { isPending: isDeleting }] = useDelete(
        resource,
        { id: record?.id },
        {
            onSuccess: () => {
                notify('Item deleted successfully', { type: 'success' });
                setDeleteConfirmOpen(false);
                onClose && onClose();
                if (location.pathname.match(/\/\d+/) && redirect) {
                    navigate(redirect);
                }
            },
            onError: error => {
                notify('Error deleting item', { type: 'error' });
                console.error('Delete error:', error);
            },
        }
    );

    const handleDeleteClick = () => setDeleteConfirmOpen(true);
    const handleDeleteClose = () => setDeleteConfirmOpen(false);
    const handleDeleteConfirm = () => {
        if (record?.id) {
            deleteRecord();
        }
    };

    return (
        <>
            <CustomHeader
                title={title}
                Component={() => (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <>{actions}</>
                        {editButton && (
                            <Tooltip title="Edit" placement="top">
                                <IconButton
                                    onClick={() => {
                                        navigate(`/${resource}/${record?.id}`);
                                    }}
                                >
                                    <EditIcon
                                        fontSize="small"
                                        sx={{ color: 'white' }}
                                    />
                                </IconButton>
                            </Tooltip>
                        )}
                        {deleteButton && (
                            <Tooltip title="Delete" placement="top">
                                <IconButton
                                    onClick={handleDeleteClick}
                                    sx={{ color: 'white' }}
                                    disabled={!record?.id}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        {showButton && (
                            <Tooltip title="View" placement="top">
                                <IconButton
                                    onClick={() => {
                                        navigate(
                                            `/${resource}/${record?.id}/show`
                                        );
                                    }}
                                    sx={{ color: 'white' }}
                                >
                                    <VisibilityIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip title="Close" placement="top">
                            <IconButton
                                onClick={() => {
                                    onClose && onClose();
                                    // includes a number
                                    if (
                                        location.pathname.match(/\/\d+/) &&
                                        redirect
                                    ) {
                                        navigate(redirect);
                                    }
                                }}
                            >
                                {backButton ? (
                                    <ArrowBackIcon
                                        fontSize="small"
                                        sx={{ color: 'white' }}
                                    />
                                ) : (
                                    <CloseIcon
                                        fontSize="small"
                                        sx={{ color: 'white' }}
                                    />
                                )}
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
            />

            {/* Delete Confirmation Dialog */}
            <Confirm
                isOpen={deleteConfirmOpen}
                loading={isDeleting}
                title={`Delete ${title}`}
                content="Are you sure you want to delete this item? This action cannot be undone."
                onConfirm={handleDeleteConfirm}
                onClose={handleDeleteClose}
                confirmColor="warning"
            />
        </>
    );
};

export default ModalHeader;
