import { Organization } from '@ci-connect/types';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { useRecordContext } from 'react-admin';

export const ServiceContractsShow = () => {
    const record = useRecordContext<Organization>();

    if (!record) return null;

    const contracts = record.organizationServiceContract || [];

    // Format currency
    const formatCurrency = (amount: number | null | undefined) => {
        if (amount === null || amount === undefined) return '—';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString: string | Date) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Calculate total setup cost for a contract
    const calculateTotalSetupCost = (items: any[]) => {
        return items.reduce((total, item) => {
            const setupCost = item.investmentSetup || 0;
            const quantity = item.quantity || 1;
            return total + setupCost * quantity;
        }, 0);
    };

    // Calculate total recurring cost for a contract
    const calculateTotalRecurringCost = (items: any[]) => {
        return items.reduce((total, item) => {
            const recurringCost = item.investmentRecurring || 0;
            const quantity = item.quantity || 1;
            return total + recurringCost * quantity;
        }, 0);
    };

    // Get chip color based on item type
    const getItemTypeColor = (type: string) => {
        switch (type) {
            case 'PACKAGE':
                return 'primary';
            case 'FEATURE':
                return 'secondary';
            case 'ADDON':
                return 'info';
            default:
                return 'default';
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ReceiptLongIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5">Service Contracts</Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {contracts.length === 0 ? (
                <Typography variant="body1" color="textSecondary">
                    No service contracts have been added for this organization.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {contracts.map((contract, index) => (
                        <Grid item xs={12} key={contract.id || index}>
                            <Card variant="outlined">
                                <CardHeader
                                    title={
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <AssignmentIcon sx={{ mr: 1 }} />
                                            <Typography variant="h6">
                                                Contract #{index + 1}
                                            </Typography>
                                        </Box>
                                    }
                                    subheader={
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: 2,
                                                mt: 1,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <MonetizationOnIcon
                                                    fontSize="small"
                                                    sx={{ mr: 0.5 }}
                                                />
                                                <Typography variant="body2">
                                                    One-Time:{' '}
                                                    {formatCurrency(
                                                        contract.oneTimeInvestment
                                                    )}
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <DateRangeIcon
                                                    fontSize="small"
                                                    sx={{ mr: 0.5 }}
                                                />
                                                <Typography variant="body2">
                                                    End Date:{' '}
                                                    {formatDate(
                                                        contract.endDate || ''
                                                    )}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    }
                                />
                                <Divider />
                                <CardContent>
                                    <Accordion defaultExpanded>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                        >
                                            <Typography>
                                                Contract Items (
                                                {contract.items?.length || 0})
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {contract.items &&
                                            contract.items.length > 0 ? (
                                                <TableContainer>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>
                                                                    Item
                                                                </TableCell>
                                                                <TableCell>
                                                                    Type
                                                                </TableCell>
                                                                <TableCell>
                                                                    Core Service
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    Quantity
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    Setup
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    Recurring
                                                                </TableCell>
                                                                <TableCell>
                                                                    Frequency
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {contract.items.map(
                                                                (
                                                                    item: any,
                                                                    itemIndex: number
                                                                ) => (
                                                                    <TableRow
                                                                        key={
                                                                            item.id ||
                                                                            itemIndex
                                                                        }
                                                                    >
                                                                        <TableCell>
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Chip
                                                                                label={
                                                                                    item.type
                                                                                }
                                                                                size="small"
                                                                                color={getItemTypeColor(
                                                                                    item.type
                                                                                )}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {item.coreServiceName ||
                                                                                '—'}
                                                                        </TableCell>
                                                                        <TableCell align="right">
                                                                            {
                                                                                item.quantity
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell align="right">
                                                                            {formatCurrency(
                                                                                item.investmentSetup
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell align="right">
                                                                            {formatCurrency(
                                                                                item.investmentRecurring
                                                                            )}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {
                                                                                item.frequency
                                                                            }
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            ) : (
                                                <Typography
                                                    variant="body2"
                                                    color="textSecondary"
                                                >
                                                    No items added to this
                                                    contract.
                                                </Typography>
                                            )}
                                        </AccordionDetails>
                                    </Accordion>

                                    <Box
                                        sx={{
                                            mt: 2,
                                            p: 2,
                                            bgcolor: 'background.default',
                                            borderRadius: 1,
                                        }}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Typography
                                                    variant="subtitle2"
                                                    color="textSecondary"
                                                >
                                                    Total Setup
                                                </Typography>
                                                <Typography variant="h6">
                                                    {formatCurrency(
                                                        calculateTotalSetupCost(
                                                            contract.items || []
                                                        )
                                                    )}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Typography
                                                    variant="subtitle2"
                                                    color="textSecondary"
                                                >
                                                    Total Recurring
                                                </Typography>
                                                <Typography variant="h6">
                                                    {formatCurrency(
                                                        calculateTotalRecurringCost(
                                                            contract.items || []
                                                        )
                                                    )}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Typography
                                                    variant="subtitle2"
                                                    color="textSecondary"
                                                >
                                                    Quantity
                                                </Typography>
                                                <Typography variant="h6">
                                                    {contract.qty || 1}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Typography
                                                    variant="subtitle2"
                                                    color="textSecondary"
                                                >
                                                    Items
                                                </Typography>
                                                <Typography variant="h6">
                                                    {contract.items?.length ||
                                                        0}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Paper>
    );
};

export default ServiceContractsShow;
