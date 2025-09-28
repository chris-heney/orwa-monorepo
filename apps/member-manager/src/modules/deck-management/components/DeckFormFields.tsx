import { FormSection } from '../../../_components/FormSection';
import {
    Add as AddIcon,
    ViewModule as DeckIcon,
    Delete as DeleteIcon,
    DragIndicator as DragIcon,
    Settings as SettingsIcon,
    SmartToy as AIIcon,
} from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Grid2,
    IconButton,
    Paper,
    Typography,
    Tooltip,
    Button,
} from '@mui/material';
import { useCallback, useState, useEffect, useMemo } from 'react';
import {
    TextInput,
    ReferenceInput,
    AutocompleteInput,
    ReferenceArrayInput,
    AutocompleteArrayInput,
    useGetList,
} from 'react-admin';
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from 'react-beautiful-dnd';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { getCategoryColor } from '../helpers';
import { CreateTopicModal } from '../../pubsub/topics/components/CreateTopicModal';
import { StepConditionsModal } from './StepConditionsModal';
import AIFieldPicker from './AIFieldPicker';

export const DeckFormFields = () => {
    const form = useFormContext();
    
    // State for Create Topic Modal
    const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false);
    
    // State for Step Conditions Modal
    const [stepConditionsModal, setStepConditionsModal] = useState<{
        open: boolean;
        stepId: string | null;
        stepLabel: string | null;
    }>({ open: false, stepId: null, stepLabel: null });
    
    // State for AI Field Picker Modal
    const [isAIFieldPickerOpen, setIsAIFieldPickerOpen] = useState(false);
    
    // Get generate fields from form
    const generateFields = useWatch({
        control: form.control,
        name: 'generate',
        defaultValue: [],
    });

    // Use useFieldArray for managing the deckSteps array (junction table entries)
    const { fields } = useFieldArray({
        control: form.control,
        name: 'deckSteps',
    });

    // Watch the actual form values to get the deck steps
    const deckStepsRaw = useWatch({
        control: form.control,
        name: 'deckSteps',
        defaultValue: [],
    });

    // Sort deck steps by orderIndex to ensure proper display order
    const deckSteps = useMemo(() => {
        if (!deckStepsRaw || deckStepsRaw.length === 0) return [];
        const sorted = [...deckStepsRaw].sort((a: any, b: any) => {
            const aIndex = a.orderIndex ?? 0;
            const bIndex = b.orderIndex ?? 0;
            return aIndex - bIndex;
        });
        console.log('Sorted deck steps for display:', sorted.map((s: any) => ({ 
            stepId: s.onboardingStepId, 
            orderIndex: s.orderIndex,
            label: s.onboardingStep?.label 
        })));
        return sorted;
    }, [deckStepsRaw]);

    // Fetch available onboarding steps from the API
    const { data: availableOnboardingSteps = [], isLoading: stepsLoading } = useGetList('onboarding-step', {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: 'stepId', order: 'ASC' },
    });

    // Helper function to update order indices for all deck steps
    const updateOrderIndices = useCallback((steps?: any[]) => {
        const currentSteps = steps || form.getValues('deckSteps') || [];
        const updatedSteps = currentSteps.map((step: any, index: number) => ({
            ...step,
            orderIndex: index
        }));
        console.log('Updating order indices:', updatedSteps.map((s: any) => ({ 
            stepId: s.onboardingStepId, 
            orderIndex: s.orderIndex,
            label: s.onboardingStep?.label 
        })));
        form.setValue('deckSteps', updatedSteps, { shouldDirty: true });
        return updatedSteps;
    }, [form]);

    // Ensure order indices are correct when component mounts or deckSteps change
    useEffect(() => {
        const currentSteps = form.getValues('deckSteps') || [];
        if (currentSteps.length > 0) {
            // Sort the steps by orderIndex to check if indices are correct
            const sortedSteps = [...currentSteps].sort((a: any, b: any) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
            
            // Check if any step has an incorrect orderIndex
            const needsUpdate = sortedSteps.some((step: any, index: number) => 
                step.orderIndex !== index
            );
            
            if (needsUpdate) {
                console.log('Fixing order indices for deck steps');
                updateOrderIndices(sortedSteps);
            }
        }
    }, [deckStepsRaw, updateOrderIndices, form]);

    // Helper function to get step from deck step entry
    const getStepFromDeckStep = useCallback((deckStep: any) => {
        if (!deckStep) return null;
        
        // If deckStep has onboardingStep populated (from API)
        if (deckStep.onboardingStep) {
            return deckStep.onboardingStep;
        }
        
        // If we only have onboardingStepId, find the step in available steps
        if (deckStep.onboardingStepId) {
            return availableOnboardingSteps.find(step => step.id === deckStep.onboardingStepId);
        }
        
        return null;
    }, [availableOnboardingSteps]);

    // Helper to check if a step is already in the deck
    const isStepInDeck = useCallback((stepId: number) => {
        return deckSteps?.some((deckStep: any) => {
            const step = getStepFromDeckStep(deckStep);
            return step?.id === stepId;
        }) || false;
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deckSteps]);

    const handleDragEnd = useCallback(
        (result: DropResult) => {
            if (!result.destination) return;

            const { source, destination } = result;

            // Adding a step from available to selected
            if (source.droppableId === 'available-steps' && destination.droppableId === 'selected-steps') {
                const stepToAdd = availableOnboardingSteps.find(
                    step => step.id.toString() === result.draggableId
                );
                
                if (stepToAdd && !isStepInDeck(stepToAdd.id)) {
                    const currentSteps = form.getValues('deckSteps') || [];
                    const sortedSteps = [...currentSteps].sort((a: any, b: any) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
                    
                    const newDeckStep = {
                        onboardingStepId: stepToAdd.id,
                        onboardingStep: stepToAdd, // Include for immediate display
                        orderIndex: destination.index,
                        isSkippable: stepToAdd.defaultSkippable || false,
                        condition: null,
                        metadata: stepToAdd.defaultMetadata || null
                    };
                    
                    // Insert the new step at the correct position
                    sortedSteps.splice(destination.index, 0, newDeckStep);
                    
                    // Update all order indices
                    const updatedSteps = sortedSteps.map((step: any, index: number) => ({
                        ...step,
                        orderIndex: index
                    }));
                    
                    form.setValue('deckSteps', updatedSteps, { shouldDirty: true });
                }
                return;
            }

            // Reordering steps within selected
            if (source.droppableId === 'selected-steps' && destination.droppableId === 'selected-steps') {
                const currentSteps = form.getValues('deckSteps') || [];
                const sortedSteps = [...currentSteps].sort((a: any, b: any) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
                
                // Move the step in the sorted array
                const [movedStep] = sortedSteps.splice(source.index, 1);
                sortedSteps.splice(destination.index, 0, movedStep);
                
                // Update the form with the reordered steps and correct order indices
                const reorderedSteps = sortedSteps.map((step: any, index: number) => ({
                    ...step,
                    orderIndex: index
                }));
                
                form.setValue('deckSteps', reorderedSteps, { shouldDirty: true });
                return;
            }

            // Removing a step from selected back to available
            if (source.droppableId === 'selected-steps' && destination.droppableId === 'available-steps') {
                const currentSteps = form.getValues('deckSteps') || [];
                const sortedSteps = [...currentSteps].sort((a: any, b: any) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
                
                // Remove the step from the sorted array
                sortedSteps.splice(source.index, 1);
                
                // Update all order indices after removal
                const updatedSteps = sortedSteps.map((step: any, index: number) => ({
                    ...step,
                    orderIndex: index
                }));
                
                form.setValue('deckSteps', updatedSteps, { shouldDirty: true });
                return;
            }
        },
        [availableOnboardingSteps, isStepInDeck, form]
    );

    const handleRemoveStep = useCallback(
        (index: number) => {
            const currentSteps = form.getValues('deckSteps') || [];
            const sortedSteps = [...currentSteps].sort((a: any, b: any) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
            
            // Remove the step from the sorted array
            sortedSteps.splice(index, 1);
            
            // Update all order indices after removal
            const updatedSteps = sortedSteps.map((step: any, index: number) => ({
                ...step,
                orderIndex: index
            }));
            
            form.setValue('deckSteps', updatedSteps, { shouldDirty: true });
        },
        [form]
    );

    const handleAddStep = useCallback(
        (step: any) => {
            if (!isStepInDeck(step.id)) {
                const currentSteps = form.getValues('deckSteps') || [];
                const sortedSteps = [...currentSteps].sort((a: any, b: any) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
                
                const newDeckStep = {
                    onboardingStepId: step.id,
                    onboardingStep: step, // Include for immediate display
                    orderIndex: sortedSteps.length, // Add at the end
                    isSkippable: step.defaultSkippable || false,
                    condition: null,
                    metadata: step.defaultMetadata || null
                };
                
                // Add the new step at the end
                sortedSteps.push(newDeckStep);
                
                // Update all order indices
                const updatedSteps = sortedSteps.map((step: any, index: number) => ({
                    ...step,
                    orderIndex: index
                }));
                
                form.setValue('deckSteps', updatedSteps, { shouldDirty: true });
            }
        },
        [isStepInDeck, form]
    );

    // Handlers for Create Topic Modal
    const handleOpenCreateTopicModal = useCallback(() => {
        setIsCreateTopicModalOpen(true);
    }, []);

    const handleCloseCreateTopicModal = useCallback(() => {
        setIsCreateTopicModalOpen(false);
    }, []);

    const handleTopicCreated = useCallback(() => {
        setIsCreateTopicModalOpen(false);
    }, []);

    // Handlers for Step Conditions Modal
    const handleOpenStepConditions = useCallback((stepId: string, stepLabel: string) => {
        setStepConditionsModal({ open: true, stepId, stepLabel });
    }, []);

    const handleCloseStepConditions = useCallback(() => {
        setStepConditionsModal({ open: false, stepId: null, stepLabel: null });
    }, []);
    
    // Handlers for AI Field Picker
    const handleOpenAIFieldPicker = useCallback(() => {
        setIsAIFieldPickerOpen(true);
    }, []);
    
    const handleCloseAIFieldPicker = useCallback(() => {
        setIsAIFieldPickerOpen(false);
    }, []);
    
    const handleAIFieldsChange = useCallback((fields: string[]) => {
        form.setValue('generate', fields, { shouldDirty: true });
    }, [form]);

    return (
        <Box sx={{ width: '100%' }}>
           

            <FormSection title="Deck Details" icon={<DeckIcon />}>
                <Grid2 container spacing={3}>
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <TextInput
                            source="name"
                            label="Deck Name"
                            fullWidth
                            helperText="Enter a descriptive name for this deck"
                            sx={{ mb: 2 }}
                        />

                        <TextInput
                            source="description"
                            label="Description"
                            multiline
                            rows={3}
                            fullWidth
                            helperText="Brief description of this deck's purpose"
                            sx={{ mb: 2 }}
                        />

                        {/* <ReferenceInput 
                            source="packageId" 
                            reference="package"
                            perPage={1000}
                        >
                            <AutocompleteInput 
                                optionText="name" 
                                fullWidth
                                label="Associated Package (Optional)"
                                helperText="Select a package to associate with this deck"
                                sx={{ mb: 2 }}
                            />
                        </ReferenceInput> */}
                    </Grid2>
                    
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <ReferenceArrayInput 
                            source="coreServices" 
                            reference="core-service"
                            perPage={1000}
                        >
                            <AutocompleteArrayInput 
                                optionText="name" 
                                fullWidth
                                label="Core Services"
                                helperText="Select the core services that this deck covers"
                                sx={{ mb: 2 }}
                            />
                        </ReferenceArrayInput>

                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <ReferenceInput
                                    source="topicId" 
                                    reference="pub-sub-topic"
                                    perPage={1000}
                                >
                                    <AutocompleteInput 
                                        optionText="name" 
                                        fullWidth
                                        label="Associated Topic (Optional)"
                                        helperText="Select a topic to associate with this deck"
                                    />
                                </ReferenceInput>
                            </Box>
                            <Tooltip title="Create New Topic">
                                <IconButton
                                    onClick={handleOpenCreateTopicModal}
                                    sx={{ 
                                        mt: 1,
                                        color: 'primary.main',
                                        '&:hover': {
                                            backgroundColor: 'primary.light',
                                            color: 'primary.contrastText',
                                        }
                                    }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                AI Generate Fields
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<AIIcon />}
                                        onClick={handleOpenAIFieldPicker}
                                        size="small"
                                    >
                                        Select Fields for AI Generation
                                    </Button>
                                    <Typography variant="caption" color="text.secondary">
                                        {generateFields?.length || 0} field(s) selected
                                    </Typography>
                                </Box>
                                
                                {generateFields?.length > 0 && (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {generateFields.map((field: string) => (
                                            <Chip
                                                key={field}
                                                label={field}
                                                size="small"
                                                color="primary"
                                                onDelete={() => {
                                                    const newFields = generateFields.filter((f: string) => f !== field);
                                                    form.setValue('generate', newFields, { shouldDirty: true });
                                                }}
                                            />
                                        ))}
                                    </Box>
                                )}
                                
                                <Typography variant="caption" color="text.secondary">
                                    These fields will be automatically generated using AI when creating organizations with this deck
                                </Typography>
                            </Box>
                        </Box>
                    </Grid2>
                </Grid2>
            </FormSection>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Grid2 container spacing={3}>
                    {/* Available Steps */}
                    <Grid2 size={{ xs: 12, md: 6 }}>
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
                                            {stepsLoading ? (
                                                <Typography>Loading steps...</Typography>
                                            ) : (
                                                availableOnboardingSteps.map(
                                                    (step, index) => (
                                                    <Draggable
                                                        key={step.id}
                                                        draggableId={step.id.toString()}
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
                                                                            : isStepInDeck(step.id)
                                                                            ? 'action.selected'
                                                                            : 'background.paper',
                                                                    opacity:
                                                                        isStepInDeck(step.id)
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
                                                                        {step.label}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="caption"
                                                                        color="text.secondary"
                                                                    >
                                                                        {step.description}
                                                                    </Typography>
                                                                    <Box mt={0.5}>
                                                                        <Chip
                                                                            label={step.category}
                                                                            size="small"
                                                                            color={
                                                                                getCategoryColor(
                                                                                    step.category || ''
                                                                                ) as any
                                                                            }
                                                                            variant="outlined"
                                                                        />
                                                                    </Box>
                                                                </Box>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() =>
                                                                        handleAddStep(
                                                                            step
                                                                        )
                                                                    }
                                                                    disabled={isStepInDeck(step.id)}
                                                                >
                                                                    <AddIcon />
                                                                </IconButton>
                                                            </Paper>
                                                        )}
                                                    </Draggable>
                                                    )
                                                )
                                            )}
                                            {provided.placeholder}
                                        </Box>
                                    )}
                                </Droppable>
                            </CardContent>
                        </Card>
                    </Grid2>

                    {/* Selected Steps */}
                    <Grid2 size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardContent>
                            <Typography variant="h6" gutterBottom>
                                    Deck Steps ({fields.length} total)
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    Drag to reorder steps.
                                </Typography>

                                <Box sx={{ mb: 2 }}>
                                  
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
                                                {fields.map((field, index) => {
                                                        const deckStepData = deckSteps[index];
                                                        const step = getStepFromDeckStep(deckStepData);
                                                        
                                                        return (
                                                            <Draggable
                                                                key={step?.id || `step-${index}`} // Use step ID for stable identification
                                                                draggableId={`selected-${step?.id || index}`}
                                                                index={index}
                                                            >
                                                                {(provided, snapshot) => (
                                                                    <Paper
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        sx={{
                                                                            p: 2,
                                                                            mb: 1,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            backgroundColor: snapshot.isDragging
                                                                                ? 'primary.light'
                                                                                : 'background.paper',
                                                                        }}
                                                                    >
                                                                        <Box {...provided.dragHandleProps}>
                                                                            <DragIcon
                                                                                sx={{
                                                                                    mr: 1,
                                                                                    color: 'text.secondary',
                                                                                }}
                                                                            />
                                                                        </Box>
                                                                        <Box flex={1}>
                                                                            <Typography variant="subtitle2">
                                                                                {index + 1}. {step?.label || `Step ${index + 1}`}
                                                                            </Typography>
                                                                            {step?.description && (
                                                                                <Typography
                                                                                    variant="caption"
                                                                                    color="text.secondary"
                                                                                    display="block"
                                                                                >
                                                                                    {step.description}
                                                                                </Typography>
                                                                            )}
                                                                            {step?.category && (
                                                                                <Box mt={0.5}>
                                                                                    <Chip
                                                                                        label={step.category}
                                                                                        size="small"
                                                                                        color={getCategoryColor(step.category) as any}
                                                                                        variant="outlined"
                                                                                    />
                                                                                </Box>
                                                                            )}
                                                                        </Box>
                                                                        <Box display="flex" gap={0.5}>
                                                                            <Tooltip title="Configure Display Conditions">
                                                                                <IconButton
                                                                                    size="small"
                                                                                    onClick={() =>
                                                                                        handleOpenStepConditions(step?.stepId || '', step?.label || '')
                                                                                    }
                                                                                    color="primary"
                                                                                >
                                                                                    <SettingsIcon />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                            <IconButton
                                                                                size="small"
                                                                                onClick={() => handleRemoveStep(index)}
                                                                                color="error"
                                                                            >
                                                                                <DeleteIcon />
                                                                            </IconButton>
                                                                        </Box>
                                                                    </Paper>
                                                                )}
                                                            </Draggable>
                                                        );
                                                    })}
                                                {provided.placeholder}
                                            </Box>
                                        )}
                                    </Droppable>

                                </Box>
                            </CardContent>
                        </Card>
                    </Grid2>
                </Grid2>
            </DragDropContext>

            {/* Create Topic Modal */}
            <CreateTopicModal
                open={isCreateTopicModalOpen}
                onClose={handleCloseCreateTopicModal}
                onSuccess={handleTopicCreated}
            />

            {/* Step Conditions Modal */}
            <StepConditionsModal
                open={stepConditionsModal.open}
                stepId={stepConditionsModal.stepId}
                stepLabel={stepConditionsModal.stepLabel}
                onClose={handleCloseStepConditions}
            />
            
            {/* AI Field Picker Modal */}
            <AIFieldPicker
                open={isAIFieldPickerOpen}
                onClose={handleCloseAIFieldPicker}
                selectedFields={generateFields || []}
                onFieldsChange={handleAIFieldsChange}
            />
        </Box>
    );
};
