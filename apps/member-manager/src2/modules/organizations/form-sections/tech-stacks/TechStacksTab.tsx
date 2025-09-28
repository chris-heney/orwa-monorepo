import React, { useState, useEffect } from 'react';
import {
  useGetList,
} from 'react-admin';
import { useFormContext } from 'react-hook-form';
import {
  Grid2,
  Typography,
  Paper,
  Box,
  Chip,
  FormControlLabel,
  Tooltip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
} from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TechStackItem, TechStackGroup } from '@ci-connect/types';

const TechStacksTab = () => {
  const { setValue, getValues, watch, trigger } = useFormContext();
  
  // State for tech stacks data
  const currentTechStacks = getValues('techStacks') || [];
  const [selectedTechStackIds, setSelectedTechStackIds] = useState<number[]>(
    currentTechStacks.map((ts: any) => ts.id || ts)
  );
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['fsm']); 
  
  // Fetch tech stack groups data
  const { data: techStackGroupsData, isLoading: techStackGroupsLoading } = useGetList<TechStackGroup>(
    'platformGroup',
    {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'title', order: 'ASC' },
      meta: {
        raw: true,
        populate: ['platforms'],
      }
    }
  );

  // Watch for changes in the form values
  const techStacksWatch = watch('platforms');

  useEffect(() => {
    const currentTechStacks = getValues('platforms') || [];
    const techStackIds = currentTechStacks.map((ts: any) => ts.id || ts);
    setSelectedTechStackIds(techStackIds);
  }, [techStacksWatch, getValues]);

  // Initialize selected tech stacks and expanded groups on component mount
  useEffect(() => {
    const currentTechStacks = getValues('platforms') || [];
    const techStackIds = currentTechStacks.map((ts: any) => ts.id || ts);
    setSelectedTechStackIds(techStackIds);
    
    // Auto-expand groups that have selected tech stacks
    if (techStackGroupsData && currentTechStacks.length > 0) {
      const groupsWithSelections = new Set<string>();
      currentTechStacks.forEach((ts: any) => {
        // Find which group this tech stack belongs to
        techStackGroupsData.forEach(group => {
          if (group.techStacks?.some(stack => stack.id === ts.id)) {
            groupsWithSelections.add(group.key);
          }
        });
      });
      setExpandedGroups(Array.from(groupsWithSelections));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [techStackGroupsData]);

  // Handle accordion expansion
  const handleAccordionChange =
    (groupKey: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedGroups((prev) =>
        isExpanded ? [...prev, groupKey] : prev.filter((key) => key !== groupKey)
      );
    };

  // Handle tech stack selection
  const handleTechStackToggle = (techStackId: number, techStackData: TechStackItem) => {
    const currentTechStacks = getValues('platforms') || [];
    const isSelected = selectedTechStackIds.includes(techStackId);
    let newTechStacks: any[];
    
    if (isSelected) {
      // Remove the tech stack
      newTechStacks = currentTechStacks.filter((ts: any) => (ts.id || ts) !== techStackId);
    } else {
      // Add the tech stack
      newTechStacks = [...currentTechStacks, techStackData];
    }
    
    // Update form value and mark as dirty
    setValue('platforms', newTechStacks, { shouldDirty: true, shouldTouch: true });
    setSelectedTechStackIds(newTechStacks.map((ts: any) => ts.id || ts));
    
    // Trigger validation and form state update
    trigger('platforms');
  };

  // Get selected count for a specific group
  const getGroupSelectedCount = (group: TechStackGroup) => {
    if (!(group as any).platforms) return 0;
    return (group as any).platforms.filter((stack: any) => selectedTechStackIds.includes(stack.id)).length;
  };

  const isLoading = techStackGroupsLoading;

  return (
    <Grid2 container spacing={3} sx={{
      width: '100%',
      maxWidth: '100%',
    }}>
      <Grid2 size={12}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LayersIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Platforms</Typography>
            </Box>
            <Tooltip title="Select technology tools and platforms your business currently uses or plans to use">
              <Typography variant="body2" color="text.secondary">
                {selectedTechStackIds?.length || 0} tools selected
              </Typography>
            </Tooltip>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select the platforms your business currently uses or plans to use
          </Typography>

          {/* Display selected count */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Chip
              label={`${selectedTechStackIds?.length || 0} tools selected`}
              color="primary"
              variant="outlined"
              sx={{ fontSize: '0.9rem', py: 1 }}
            />
          </Box>

          {isLoading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography>Loading tech stack options...</Typography>
            </Box>
          ) : techStackGroupsData && techStackGroupsData.length > 0 ? (
            <> 
              <Grid2 container spacing={2}>
              {techStackGroupsData.map((group) => (
                <Grid2 size={12} key={group.id}>
                  <Accordion
                    expanded={expandedGroups.includes(group.key)}
                    onChange={handleAccordionChange(group.key)}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      '&:before': { display: 'none' },
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      backgroundColor: 'background.paper',
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        backgroundColor: 'grey.50',
                        borderRadius: '8px 8px 0 0',
                        '&.Mui-expanded': {
                          borderRadius: '8px 8px 0 0',
                        },
                        '&:hover': {
                          backgroundColor: 'grey.100',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography variant="h6" sx={{ mr: 2 }}>
                          {group.icon} {group.title}
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        {getGroupSelectedCount(group) > 0 && (
                          <Chip
                            size="small"
                            label={`${getGroupSelectedCount(group)} selected`}
                            color="primary"
                            sx={{ mr: 2 }}
                          />
                        )}
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails sx={{ pt: 2 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, fontStyle: 'italic' }}
                      >
                        {group.purpose}
                      </Typography>

                      <Grid2 container spacing={1}>
                        {(group as any).platforms && (group as any).platforms.length > 0 ? (
                          (group as any).platforms.map((stack: any) => (
                            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={stack.id}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={selectedTechStackIds.includes(stack.id)}
                                    onChange={() => handleTechStackToggle(stack.id, stack)}
                                    color="primary"
                                  />
                                }
                                label={
                                  <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                    {stack.name}
                                  </Typography>
                                }
                                sx={{
                                  width: '100%',
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  borderRadius: 1,
                                  margin: 0,
                                  padding: '8px 12px',
                                  backgroundColor: selectedTechStackIds.includes(stack.id)
                                    ? 'action.selected'
                                    : 'transparent',
                                  '&:hover': {
                                    backgroundColor: 'action.hover',
                                    borderColor: 'primary.main',
                                  },
                                  transition: 'all 0.2s ease',
                                }}
                              />
                            </Grid2>
                          ))
                        ) : (
                          <Grid2 size={12}>
                            <Typography variant="body2" color="text.secondary">
                              No platforms available in this category.
                            </Typography>
                          </Grid2>
                        )}
                      </Grid2>
                    </AccordionDetails>
                  </Accordion>
                </Grid2>
              ))}
              </Grid2>
            </>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              No platform groups are available. Please contact support to set up platform options.
            </Alert>
          )}
        </Paper>
      </Grid2>
    </Grid2>
  );
};

export default TechStacksTab; 