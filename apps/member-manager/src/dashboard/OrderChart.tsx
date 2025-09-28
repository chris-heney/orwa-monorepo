import * as React from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    useTheme,
    SimplePaletteColorOptions,
    Box,
    Typography,
} from '@mui/material';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import { useTranslate } from 'react-admin';
import { format, subDays, addDays } from 'date-fns';

import { formatNumberAsUSD } from '../formatUtils';

const lastDay = new Date();
const lastMonthDays = Array.from({ length: 30 }, (_, i) => subDays(lastDay, i));
const aMonthAgo = subDays(new Date(), 30);

const dateFormatter = (date: number): string =>
    new Date(date).toLocaleDateString();

const aggregateOrdersByDay = (orders: any[]): { [key: string]: number } =>
    orders
        .filter((order: any) => order.status !== 'cancelled')
        .reduce((acc, curr) => {
            const day = format(curr.date, 'yyyy-MM-dd');
            if (!acc[day]) {
                acc[day] = 0;
            }
            acc[day] += curr.total;
            return acc;
        }, {} as { [key: string]: number });

const getRevenuePerDay = (orders: any[]): TotalByDay[] => {
    const daysWithRevenue = aggregateOrdersByDay(orders);
    return lastMonthDays.map(date => ({
        date: date.getTime(),
        total: daysWithRevenue[format(date, 'yyyy-MM-dd')] || 0,
    }));
};

const OrderChart = (props: { orders?: any[] }) => {
    const { orders } = props;
    const translate = useTranslate();
    const theme = useTheme();

    if (!orders || !theme) return null;

    const primaryColor = theme?.palette?.primary as SimplePaletteColorOptions;
    const secondaryColor = theme?.palette
        ?.secondary as SimplePaletteColorOptions;

    return (
        <Box sx={{ height: '100%', width: '100%' }}>
            <div style={{ width: '100%', height: '100%' }}>
                <ResponsiveContainer>
                    <AreaChart
                        data={getRevenuePerDay(orders)}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient
                                id="colorUv"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor={primaryColor.main}
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={primaryColor.main}
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            name="Date"
                            type="number"
                            scale="time"
                            domain={[
                                addDays(aMonthAgo, 1).getTime(),
                                new Date().getTime(),
                            ]}
                            tickFormatter={dateFormatter}
                            stroke={theme.palette.text.secondary}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            dataKey="total"
                            name="Revenue"
                            tickFormatter={(value: number) =>
                                formatNumberAsUSD(value, 0)
                            }
                            stroke={theme.palette.text.secondary}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dx={-10}
                        />
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke={theme.palette.divider}
                        />
                        <Tooltip
                            cursor={{
                                stroke: theme.palette.primary.main,
                                strokeWidth: 1,
                                strokeDasharray: '3 3',
                            }}
                            formatter={(value: any) =>
                                formatNumberAsUSD(Number(value), 2)
                            }
                            labelFormatter={dateFormatter}
                            contentStyle={{
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: theme.shape?.borderRadius,
                                background: theme.palette.background.paper,
                                boxShadow: theme.shadows[3],
                                padding: '8px 12px',
                            }}
                            itemStyle={{
                                color: theme.palette.text.primary,
                                fontSize: 14,
                                fontWeight: 500,
                            }}
                            labelStyle={{
                                color: theme.palette.text.secondary,
                                fontSize: 12,
                                fontWeight: 400,
                                marginBottom: 4,
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke={primaryColor.main}
                            strokeWidth={3}
                            fill="url(#colorUv)"
                            activeDot={{
                                r: 6,
                                stroke: theme.palette.background.paper,
                                strokeWidth: 2,
                                fill: primaryColor.main,
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Box>
    );
};

interface TotalByDay {
    date: number;
    total: number;
}

export default OrderChart;
