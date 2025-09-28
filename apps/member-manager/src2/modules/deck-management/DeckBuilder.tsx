import {
    Add as AddIcon,
    ArrowBack as ArrowBackIcon,
    Delete as DeleteIcon,
    DragIndicator as DragIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    IconButton,
    Paper,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from 'react-beautiful-dnd';
import { getCurrentUser } from '../../../../../libs/utils/src';
import { availableSteps, getCategoryColor, type AvailableStep } from './helpers';

interface Deck {
    id?: number;
    name: string;
    description?: string;
    steps: string[];
    isDefault: boolean;
    metadata?: any;
}

interface DeckBuilderProps {
    deck?: Deck | null;
    onSave: () => void;
    onCancel: () => void;
}

const DeckBuilder: React.FC<DeckBuilderProps> = ({
    deck,
    onSave,
    onCancel,
}) => {
    const [deckName, setDeckName] = useState(deck?.name || '');
    const [deckDescription, setDeckDescription] = useState(
        deck?.description || ''
    );
    const [selectedSteps, setSelectedSteps] = useState<string[]>(
        deck?.steps
            ? deck.steps.filter(step => step !== 'Welcome' && step !== 'Terms')
            : []
    );
    const [isDefault, setIsDefault] = useState(deck?.isDefault || false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [infoDialogOpen, setInfoDialogOpen] = useState(false);
    const [selectedStepInfo, setSelectedStepInfo] =
        useState<AvailableStep | null>(null);

    const isEditing = Boolean(deck?.id);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (
            source.droppableId === 'available-steps' &&
            destination.droppableId === 'selected-steps'
        ) {
            // Adding a step from available to selected
            const stepToAdd = availableSteps.find(
                step => step.id === result.draggableId
            );
            if (stepToAdd && !selectedSteps.includes(stepToAdd.label)) {
                const newSteps = [...selectedSteps];
                newSteps.splice(destination.index, 0, stepToAdd.label);
                setSelectedSteps(newSteps);
            }
        } else if (
            source.droppableId === 'selected-steps' &&
            destination.droppableId === 'selected-steps'
        ) {
            // Reordering steps within selected
            const newSteps = [...selectedSteps];
            const [removed] = newSteps.splice(source.index, 1);
            newSteps.splice(destination.index, 0, removed);
            setSelectedSteps(newSteps);
        } else if (
            source.droppableId === 'selected-steps' &&
            destination.droppableId === 'available-steps'
        ) {
            // Removing a step from selected back to available
            const newSteps = [...selectedSteps];
            newSteps.splice(source.index, 1);
            setSelectedSteps(newSteps);
        }
    };

    const handleRemoveStep = (index: number) => {
        const newSteps = [...selectedSteps];
        newSteps.splice(index, 1);
        setSelectedSteps(newSteps);
    };

    const handleAddStep = (step: AvailableStep) => {
        if (!selectedSteps.includes(step.label)) {
            setSelectedSteps([...selectedSteps, step.label]);
        }
    };

    const handleShowInfo = (step: AvailableStep) => {
        setSelectedStepInfo(step);
        setInfoDialogOpen(true);
    };

    const handleSave = async () => {
        if (!deckName.trim()) {
            setError('Deck name is required');
            return;
        }

        if (selectedSteps.length === 0) {
            setError('At least one step is required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const user = getCurrentUser();
            if (!user) {
                throw new Error('Authentication required');
            }

            const token = localStorage.getItem('token');
            const deckData = {
                name: deckName.trim(),
                description: deckDescription.trim() || null,
                steps: selectedSteps, // API will automatically add Welcome and Terms
                metadata: {
                    totalSteps: selectedSteps.length + 2, // +2 for Welcome and Terms
                    createdBy: user.preferred_username || user.email,
                },
                isDefault,
            };
            const url = isEditing
                ? `${import.meta.env.VITE_API_URL}/deck/${deck!.id}`
                : `${import.meta.env.VITE_API_URL}/deck`;
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(deckData),
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to ${isEditing ? 'update' : 'create'} deck`
                );
            }

            onSave();
        } catch (err: any) {
            setError(
                err.message ||
                    `Failed to ${isEditing ? 'update' : 'create'} deck`
            );
        } finally {
            setLoading(false);
        }
    };

    const getFullStepsList = () => {
        return ['Welcome', ...selectedSteps, 'Terms'];
    };

    return (
        <Box>
            {/* Header */}
            <Box display="flex" alignItems="center" mb={3}>
                <IconButton onClick={onCancel} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {isEditing ? 'Edit Deck' : 'Create New Deck'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Drag steps from the available options to build your
                        custom onboarding workflow
                    </Typography>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Deck Details Form */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Deck Details
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Deck Name"
                                value={deckName}
                                onChange={e => setDeckName(e.target.value)}
                                placeholder="e.g., Standard Onboarding"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={isDefault}
                                        onChange={e =>
                                            setIsDefault(e.target.checked)
                                        }
                                    />
                                }
                                label="Set as default deck"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                value={deckDescription}
                                onChange={e =>
                                    setDeckDescription(e.target.value)
                                }
                                placeholder="Brief description of this deck's purpose"
                                multiline
                                rows={2}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Grid container spacing={3}>
                    {/* Available Steps */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Available Steps
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    Drag steps to the right to add them to your
                                    deck
                                </Typography>

                                <Droppable
                                    droppableId="available-steps"
                                    type="step"
                                >
                                    {(provided, snapshot) => (
                                        <Box
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            sx={{
                                                minHeight: 400,
                                                maxHeight: 600,
                                                overflowY: 'auto',
                                                backgroundColor:
                                                    snapshot.isDraggingOver
                                                        ? 'action.hover'
                                                        : 'inherit',
                                                borderRadius: 1,
                                                p: 1,
                                            }}
                                        >
                                            {availableSteps.map(
                                                (step, index) => (
                                                    <Draggable
                                                        key={step.id}
                                                        draggableId={step.id}
                                                        index={index}
                                                    >
                                                        {(
                                                            provided,
                                                            snapshot
                                                        ) => (
                                                            <Paper
                                                                ref={
                                                                    provided.innerRef
                                                                }
                                                                {...provided.draggableProps}
                                                                sx={{
                                                                    p: 2,
                                                                    mb: 1,
                                                                    display:
                                                                        'flex',
                                                                    alignItems:
                                                                        'center',
                                                                    backgroundColor:
                                                                        snapshot.isDragging
                                                                            ? 'primary.light'
                                                                            : selectedSteps.includes(
                                                                                  step.label
                                                                              )
                                                                            ? 'action.selected'
                                                                            : 'background.paper',
                                                                    opacity:
                                                                        selectedSteps.includes(
                                                                            step.label
                                                                        )
                                                                            ? 0.5
                                                                            : 1,
                                                                }}
                                                            >
                                                                <Box
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    <DragIcon
                                                                        sx={{
                                                                            mr: 1,
                                                                            color: 'text.secondary',
                                                                        }}
                                                                    />
                                                                </Box>
                                                                <Box flex={1}>
                                                                    <Typography variant="subtitle2">
                                                                        {
                                                                            step.label
                                                                        }
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="caption"
                                                                        color="text.secondary"
                                                                    >
                                                                        {
                                                                            step.description
                                                                        }
                                                                    </Typography>
                                                                    <Box
                                                                        mt={0.5}
                                                                    >
                                                                        <Chip
                                                                            label={
                                                                                step.category
                                                                            }
                                                                            size="small"
                                                                            color={
                                                                                getCategoryColor(
                                                                                    step.category
                                                                                ) as any
                                                                            }
                                                                            variant="outlined"
                                                                        />
                                                                    </Box>
                                                                </Box>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() =>
                                                                        handleShowInfo(
                                                                            step
                                                                        )
                                                                    }
                                                                >
                                                                    <InfoIcon />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() =>
                                                                        handleAddStep(
                                                                            step
                                                                        )
                                                                    }
                                                                    disabled={selectedSteps.includes(
                                                                        step.label
                                                                    )}
                                                                >
                                                                    <AddIcon />
                                                                </IconButton>
                                                            </Paper>
                                                        )}
                                                    </Draggable>
                                                )
                                            )}
                                            {provided.placeholder}
                                        </Box>
                                    )}
                                </Droppable>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Selected Steps */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Deck Steps ({getFullStepsList().length}{' '}
                                    total)
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    Drag to reorder steps. Welcome and Terms are
                                    automatically added.
                                </Typography>

                                <Box sx={{ mb: 2 }}>
                                    {/* Fixed Welcome step */}
                                    <Paper
                                        sx={{
                                            p: 2,
                                            mb: 1,
                                            backgroundColor: 'success.light',
                                            color: 'success.contrastText',
                                        }}
                                    >
                                        <Typography variant="subtitle2">
                                            1. Welcome (Fixed - Always First)
                                        </Typography>
                                    </Paper>

                                    <Droppable
                                        droppableId="selected-steps"
                                        type="step"
                                    >
                                        {(provided, snapshot) => (
                                            <Box
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                sx={{
                                                    minHeight: 300,
                                                    maxHeight: 450,
                                                    overflowY: 'auto',
                                                    backgroundColor:
                                                        snapshot.isDraggingOver
                                                            ? 'action.hover'
                                                            : 'inherit',
                                                    borderRadius: 1,
                                                    p: 1,
                                                }}
                                            >
                                                {selectedSteps.map(
                                                    (stepLabel, index) => (
                                                        <Draggable
                                                            key={stepLabel}
                                                            draggableId={
                                                                stepLabel
                                                            }
                                                            index={index}
                                                        >
                                                            {(
                                                                provided,
                                                                snapshot
                                                            ) => (
                                                                <Paper
                                                                    ref={
                                                                        provided.innerRef
                                                                    }
                                                                    {...provided.draggableProps}
                                                                    sx={{
                                                                        p: 2,
                                                                        mb: 1,
                                                                        display:
                                                                            'flex',
                                                                        alignItems:
                                                                            'center',
                                                                        backgroundColor:
                                                                            snapshot.isDragging
                                                                                ? 'primary.light'
                                                                                : 'background.paper',
                                                                    }}
                                                                >
                                                                    <Box
                                                                        {...provided.dragHandleProps}
                                                                    >
                                                                        <DragIcon
                                                                            sx={{
                                                                                mr: 1,
                                                                                color: 'text.secondary',
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                    <Typography
                                                                        variant="subtitle2"
                                                                        flex={1}
                                                                    >
                                                                        {index +
                                                                            2}
                                                                        .{' '}
                                                                        {
                                                                            stepLabel
                                                                        }
                                                                    </Typography>
                                                                    <IconButton
                                                                        size="small"
                                                                        onClick={() =>
                                                                            handleRemoveStep(
                                                                                index
                                                                            )
                                                                        }
                                                                        color="error"
                                                                    >
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </Paper>
                                                            )}
                                                        </Draggable>
                                                    )
                                                )}
                                                {provided.placeholder}
                                            </Box>
                                        )}
                                    </Droppable>

                                    {/* Fixed Terms step */}
                                    <Paper
                                        sx={{
                                            p: 2,
                                            backgroundColor: 'success.light',
                                            color: 'success.contrastText',
                                        }}
                                    >
                                        <Typography variant="subtitle2">
                                            {getFullStepsList().length}. Terms
                                            (Fixed - Always Last)
                                        </Typography>
                                    </Paper>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </DragDropContext>

            {/* Actions */}
            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                <Button onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={
                        loading ||
                        !deckName.trim() ||
                        selectedSteps.length === 0
                    }
                >
                    {loading
                        ? 'Saving...'
                        : isEditing
                        ? 'Update Deck'
                        : 'Create Deck'}
                </Button>
            </Box>

            {/* Step Info Dialog */}
            <Dialog
                open={infoDialogOpen}
                onClose={() => setInfoDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>{selectedStepInfo?.label}</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        {selectedStepInfo?.description}
                    </Typography>
                    <Box mt={2}>
                        <Chip
                            label={selectedStepInfo?.category}
                            color={
                                getCategoryColor(
                                    selectedStepInfo?.category || ''
                                ) as any
                            }
                            variant="outlined"
                        />
                        {selectedStepInfo?.condition && (
                            <Chip
                                label={`Condition: ${selectedStepInfo.condition}`}
                                sx={{ ml: 1 }}
                                variant="outlined"
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setInfoDialogOpen(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DeckBuilder;
