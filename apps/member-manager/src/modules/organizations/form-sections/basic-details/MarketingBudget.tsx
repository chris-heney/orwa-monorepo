import React, { useCallback, useMemo } from 'react';
import { Typography, Box, Slider } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { styles } from '../advertising/styles';

const DEFAULT_BUDGET = 5000;
const SLIDER_MARKS = [
    { value: 1000, label: '$1000' },
    { value: 5000, label: '$5000' },
    { value: 10000, label: '$10000' },
    { value: 20000, label: '$20000' },
];

const MarketingBudget = () => {
    const { setValue, watch } = useFormContext();

    // Only watch this specific field to prevent unnecessary rerenders
    const budget = watch('marketingBudget');

    const displayBudget = budget || DEFAULT_BUDGET;

    // Memoize the formatted budget string to prevent recalculation on every render
    const formattedBudget = useMemo(() => {
        return `$${displayBudget.toLocaleString()}`;
    }, [displayBudget]);

    // Memoize the handler to prevent recreation on each render
    const handleBudgetChange = useCallback(
        (_event: Event, newValue: number | number[]) => {
            setValue('marketingBudget', newValue as number, {
                shouldDirty: true,
                shouldValidate: true,
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    return (
        <>
            <Box sx={styles.sectionTitle}>
                <Typography variant="h6">Marketing Budget</Typography>
            </Box>

            <Typography variant="body2" paragraph color="text.secondary">
                Set your estimated marketing budget. This helps with planning
                and optimization.
            </Typography>

            <Box sx={{ px: 3}}>
               

                <Box sx={styles.budgetDisplay}>{formattedBudget}</Box>

                <Box sx={{ px: 3, pb: 3 }}>
                    <Slider
                        value={displayBudget}
                        onChange={handleBudgetChange}
                        aria-labelledby="monthly-budget-slider"
                        valueLabelDisplay="auto"
                        valueLabelFormat={value => `$${value.toLocaleString()}`}
                        step={100}
                        marks={SLIDER_MARKS}
                        min={1000}
                        max={20000}
                        sx={styles.slider}
                    />
                </Box>
            </Box>
        </>
    );
};

export default React.memo(MarketingBudget);
