import React, { useEffect, useState } from 'react';
import { 
    Typography, 
    Box, 
    Divider, 
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    IconButton
} from '@mui/material';
import { styles } from '../styles';
import SummarizeIcon from '@mui/icons-material/Summarize';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useRecordContext } from 'react-admin';
import { useFormContext } from 'react-hook-form';
import { calculateTotals } from '../priceUtils';
import { OrganizationServiceContract } from '@ci-connect/types';

interface ContractSummaryProps {
    contractIndex: number;
}

const ContractSummary: React.FC<ContractSummaryProps> = ({ contractIndex }) => {
    const record = useRecordContext();
    const { getValues, watch } = useFormContext();
    const [contract, setContract] = useState<OrganizationServiceContract | undefined>(undefined);

    // Load contract data
    useEffect(() => {
        const contracts = record?.organizationServiceContract || getValues('organizationServiceContract') || [];
        if (contracts && contracts[contractIndex]) {
            setContract(contracts[contractIndex]);
        }
    }, [record, getValues, contractIndex]);

    // Watch for changes in the form values
    const contractsWatch = watch('organizationServiceContract');

    useEffect(() => {
        if (contractsWatch && contractsWatch[contractIndex]) {
            setContract(contractsWatch[contractIndex]);
        }
    }, [contractsWatch, contractIndex]);
    
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Calculate totals safely
    const totals = contract ? calculateTotals(contract) : {
        setup: 0,
        monthly: 0,
        annual: 0,
        addonSetup: 0,
        addonMonthly: 0,
        addonAnnual: 0,
        featureSetup: 0,
        featureMonthly: 0,
        featureAnnual: 0,
    };

    // Calculate monthly equivalent (monthly + annual/12)
    const monthlyEquivalent = totals.monthly + (totals.annual / 12);
    
    // Calculate number of items safely
    const itemCount = contract?.items?.length || 0;

    return (
        <Box>
            <Box sx={styles.sectionTitle}>
                <SummarizeIcon sx={styles.icon} />
                <Typography variant="subtitle1">Contract Summary</Typography>
            </Box>
            <Divider sx={styles.divider} />
            
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    Total Setup Investment
                                    <Tooltip title="One-time setup costs for all items">
                                        <IconButton size="small">
                                            <InfoOutlinedIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </TableCell>
                            <TableCell align="right">{formatCurrency(totals.setup)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    Monthly Recurring
                                    <Tooltip title="Total monthly recurring costs">
                                        <IconButton size="small">
                                            <InfoOutlinedIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </TableCell>
                            <TableCell align="right">{formatCurrency(totals.monthly)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    Annual Recurring
                                    <Tooltip title="Total annual recurring costs">
                                        <IconButton size="small">
                                            <InfoOutlinedIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </TableCell>
                            <TableCell align="right">{formatCurrency(totals.annual)}</TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <strong>Monthly Equivalent</strong>
                                    <Tooltip title="Monthly cost + Annual cost divided by 12">
                                        <IconButton size="small">
                                            <InfoOutlinedIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </TableCell>
                            <TableCell align="right"><strong>{formatCurrency(monthlyEquivalent)}</strong></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    Add-on Setup
                                    <Tooltip title="One-time setup costs for add-ons">
                                        <IconButton size="small">
                                            <InfoOutlinedIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </TableCell>
                            <TableCell align="right">{formatCurrency(totals.addonSetup)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    Add-on Monthly
                                    <Tooltip title="Monthly recurring costs for add-ons + per unit cost * quantity">
                                        <IconButton size="small">
                                            <InfoOutlinedIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </TableCell>
                            <TableCell align="right">{formatCurrency(totals.addonMonthly)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Number of Items</TableCell>
                            <TableCell align="right">{itemCount}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ContractSummary; 