import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import FlagIcon from '@mui/icons-material/Flag';
import GetAppIcon from '@mui/icons-material/GetApp';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import PeopleIcon from '@mui/icons-material/People';
import SellIcon from '@mui/icons-material/Sell';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import StoreIcon from '@mui/icons-material/Store';
import TrafficIcon from '@mui/icons-material/Traffic';
import { Box, Chip, Grid2, Paper, TextField, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { TextInput, useRecordContext } from 'react-admin';
import { useFormContext } from 'react-hook-form';
import { styles } from '../styles';

// Common advertising goals with icons
const adGoals = [
    {
        id: 'brand_awareness',
        name: 'Brand Awareness',
        icon: <BrandingWatermarkIcon sx={{ fontSize: 18, mr: 0.5 }} />,
    },
    {
        id: 'lead_generation',
        name: 'Lead Generation',
        icon: <LeaderboardIcon sx={{ fontSize: 18, mr: 0.5 }} />,
    },
    {
        id: 'website_traffic',
        name: 'Website Traffic',
        icon: <TrafficIcon sx={{ fontSize: 18, mr: 0.5 }} />,
    },
    {
        id: 'sales_conversions',
        name: 'Sales/Conversions',
        icon: <SellIcon sx={{ fontSize: 18, mr: 0.5 }} />,
    },
    {
        id: 'app_downloads',
        name: 'App Downloads',
        icon: <GetAppIcon sx={{ fontSize: 18, mr: 0.5 }} />,
    },
    {
        id: 'customer_engagement',
        name: 'Customer Engagement',
        icon: <PeopleIcon sx={{ fontSize: 18, mr: 0.5 }} />,
    },
    {
        id: 'local_store_visits',
        name: 'Local Store Visits',
        icon: <StoreIcon sx={{ fontSize: 18, mr: 0.5 }} />,
    },
    {
        id: 'product_consideration',
        name: 'Product Consideration',
        icon: <ShoppingBasketIcon sx={{ fontSize: 18, mr: 0.5 }} />,
    },
];

const AdvertisingGoals = () => {
    const record = useRecordContext();
    const { setValue } = useFormContext();
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [formattedGoals, setFormattedGoals] = useState<string>('');

    // Initialize with existing values if present
    useEffect(() => {
        if (record?.paidAdvertising?.adPrimaryGoals) {
            const goals = record.paidAdvertising.adPrimaryGoals;
            if (typeof goals === 'string') {
                const goalsList = goals.split(',').map(g => g.trim());
                const validGoalIds = goalsList
                    .map(goalName => {
                        const goal = adGoals.find(g => g.name === goalName);
                        return goal ? goal.id : null;
                    })
                    .filter(id => id !== null) as string[];

                setSelectedGoals(validGoalIds);
                setFormattedGoals(goals);
                setValue('paidAdvertising.adPrimaryGoals', goals);
            }
        }
    }, [record?.paidAdvertising?.adPrimaryGoals, setValue]);

    // Handle goal selection
    const handleGoalToggle = useCallback(
        (goalId: string) => {
            setSelectedGoals(prev => {
                const goal = adGoals.find(g => g.id === goalId);
                if (!goal) return prev;

                const newGoalIds = prev.includes(goalId)
                    ? prev.filter(id => id !== goalId)
                    : [...prev, goalId];

                // Convert to goal names
                const goalNames = newGoalIds
                    .map(id => {
                        const g = adGoals.find(g => g.id === id);
                        return g ? g.name : '';
                    })
                    .filter(name => name !== '');

                const newFormattedGoals = goalNames.join(', ');
                setFormattedGoals(newFormattedGoals);
                setValue('paidAdvertising.adPrimaryGoals', newFormattedGoals, {
                    shouldDirty: true,
                    shouldValidate: true,
                });

                return newGoalIds;
            });
        },
        [setValue]
    );

    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <FlagIcon sx={styles.icon} />
                <Typography variant="h6">Advertising Goals</Typography>
            </Box>

            <Typography variant="body2" paragraph color="text.secondary">
                What are your main advertising goals? This helps determine the
                best strategies and campaign types.
            </Typography>

            <Grid2 container spacing={1} sx={{ mb: 3 }}>
                {adGoals.map(goal => (
                    <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={goal.id}>
                        <Chip
                            icon={goal.icon}
                            label={goal.name}
                            onClick={() => handleGoalToggle(goal.id)}
                            sx={{
                                ...styles.goalChip,
                                ...(selectedGoals.includes(goal.id)
                                    ? styles.selectedGoalChip
                                    : {}),
                            }}
                        />
                    </Grid2>
                ))}
            </Grid2>

            {/* Hidden input that gets updated automatically */}
            <TextInput
                source="paidAdvertising.adPrimaryGoals"
                defaultValue={formattedGoals}
                sx={{ display: 'none' }}
            />

            {/* Visible but non-editable field to show the selected goals */}
            <TextField
                label="Selected Advertising Goals"
                value={formattedGoals || 'None selected'}
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                disabled
                helperText="Click on the chips above to select your goals"
            />
        </Paper>
    );
};

export default React.memo(AdvertisingGoals);
