import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { Box, Paper, Slider, Typography } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { styles } from '../styles';

const DEFAULT_BUDGET = 5000;
const SLIDER_MARKS = [
    { value: 1000, label: '$1000' },
    { value: 5000, label: '$5000' },
    { value: 10000, label: '$10000' },
    { value: 20000, label: '$20000' },
];

const MonthlyBudget = () => {
    const { setValue, watch } = useFormContext();

    // Only watch this specific field to prevent unnecessary rerenders
    const budget = watch('budgetPaidAdvertising');

    const displayBudget = budget || DEFAULT_BUDGET;

    // Memoize the formatted budget string to prevent recalculation on every render
    const formattedBudget = useMemo(() => {
        return `$${displayBudget.toLocaleString()}`;
    }, [displayBudget]);

    // Memoize the handler to prevent recreation on each render
    const handleBudgetChange = useCallback(
        (_event: Event, newValue: number | number[]) => {
            setValue('budgetPaidAdvertising', newValue as number, {
                shouldDirty: true,
                shouldValidate: true,
            });
        },
        [setValue]
    );

    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <MonetizationOnIcon sx={styles.icon} />
                <Typography variant="h6">Monthly Ad Budget</Typography>
            </Box>

            <Typography variant="body2" paragraph color="text.secondary">
                Set your estimated monthly advertising budget. This helps with
                planning and optimization.
            </Typography>

            <Box sx={{ px: 3, pt: 3, pb: 1 }}>
                <Typography variant="h6" gutterBottom>
                    Desired Starting Budget
                </Typography>

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
        </Paper>
    );
};

export default React.memo(MonthlyBudget);
