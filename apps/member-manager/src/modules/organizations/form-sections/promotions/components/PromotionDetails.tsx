import React from 'react';
import { SelectInput, TextInput, NumberInput, BooleanInput, DateInput } from 'react-admin';
import { Typography, Box, Paper, Grid2 } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import EventIcon from '@mui/icons-material/Event';
import { styles } from '../styles';

const PromotionDetails = () => {
    return (
        <Paper sx={styles.section}>
            <Box sx={styles.sectionTitle}>
                <CampaignIcon sx={styles.icon} />
                <Typography variant="h6">Promotion Details</Typography>
            </Box>
            
            <Typography variant="body2" paragraph color="text.secondary">
                Configure the basic details of your promotion or seasonal offer.
            </Typography>
            
            <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CampaignIcon sx={{ color: '#2196F3', mr: 1 }} />
                            <Typography variant="subtitle1">Promotion Type</Typography>
                        </Box>
                        <SelectInput
                            source="promotions[0].promotionType"
                            label="Promotion Type"
                            choices={[
                                { id: 'SEASONAL_OFFER', name: 'Seasonal Offer' },
                                { id: 'MAINTENANCE_SPECIAL', name: 'Maintenance Special' },
                                { id: 'FINANCING_OFFER', name: 'Financing Offer' },
                                { id: 'EQUIPMENT_UPGRADE_INCENTIVE', name: 'Equipment Upgrade Incentive' },
                                { id: 'BOGO_ADD_ON_FREEBIE', name: 'BOGO / Add-On Freebie' },
                                { id: 'OTHER', name: 'Other' }
                            ]}
                            fullWidth
                            helperText="Type of promotion or offer"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <TextInput
                            source="promotions[0].promotionTitle"
                            label="Promotion Title"
                            fullWidth
                            helperText="Title of the promotion"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <TextInput
                            source="promotions[0].promotionDescription"
                            label="Promotion Description"
                            fullWidth
                            multiline
                            rows={3}
                            helperText="Detailed description of the promotion"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <NumberInput
                            source="promotions[0].discountAmount"
                            label="Discount Amount"
                            fullWidth
                            helperText="Discount amount or percentage"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <SelectInput
                            source="promotions[0].discountType"
                            label="Discount Type"
                            choices={[
                                { id: 'PERCENTAGE', name: 'Percentage' },
                                { id: 'FIXED_AMOUNT', name: 'Fixed Amount' }
                            ]}
                            fullWidth
                            helperText="Type of discount"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12 }}>
                    <Box sx={styles.inputWrapper}>
                        <BooleanInput
                            source="promotions[0].isYearRoundOffer"
                            label="Year-Round Offer"
                            helperText="Is this a year-round promotion?"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EventIcon sx={{ color: '#4CAF50', mr: 1 }} />
                            <Typography variant="subtitle1">Start Date</Typography>
                        </Box>
                        <DateInput
                            source="promotions[0].startDate"
                            label="Start Date"
                            fullWidth
                            helperText="Promotion start date (if not year-round)"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box sx={styles.inputWrapper}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EventIcon sx={{ color: '#FF9800', mr: 1 }} />
                            <Typography variant="subtitle1">End Date</Typography>
                        </Box>
                        <DateInput
                            source="promotions[0].endDate"
                            label="End Date"
                            fullWidth
                            helperText="Promotion end date (if not year-round)"
                            variant="outlined"
                        />
                    </Box>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default React.memo(PromotionDetails);
