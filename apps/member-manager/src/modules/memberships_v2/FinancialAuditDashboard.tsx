import React, { useEffect } from 'react'
import { Grid, Paper, Typography } from '@mui/material'
import { Loading } from 'react-admin'
import { CurrencyOptions } from '../../config/Settings'
import httpClient from '../../helpers/ra-strapi-data-provider/src/httpClient'
import DateStatusWidget from '../grant-manager/_components/DateStatusWidget'
import AssociateIcon from '@mui/icons-material/StoreMallDirectory'
import WatersystemIcon from '@mui/icons-material/WaterDrop'
import TotalIcon from '@mui/icons-material/DoneAll'
import { DateField } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import CustomSecondaryHeader from '../_components/CustomSecondaryHeader'


interface IFinancialAudit {
  unearnedTotal: number
  unearnedDailyAverage: number
  collectedDailyAverage: number
  collectedTotal: number
}

interface IFinancialAuditTotals {
  watersystems: IFinancialAudit
  associates: IFinancialAudit
  total: IFinancialAudit
}

const USDollar = new Intl.NumberFormat('en-US', CurrencyOptions)

const title = 'Financial Audits'

const FinancialAuditDashboard = () => {

  const [ financialAuditTotals, setFinancialAuditTotals ] = React.useState<undefined|IFinancialAuditTotals>(undefined)
  const [ fromDate, setFromDate ] = React.useState<Dayjs>(dayjs())

  useEffect(() => {
    httpClient(
      `${import.meta.env.VITE_API_ENDPOINT}/api/financial-audit/get-unearned-dues?fromDate=${fromDate.format('YYYY-MM-DD')}`
    ).then((response) => {
      setFinancialAuditTotals( JSON.parse(response.body) as IFinancialAuditTotals )
    })
  }, [ fromDate ])

  const DateRange = () => (
    <Typography variant="h6">{fromDate.subtract(1, 'year').format('M/D/YYYY')} &mdash; {fromDate.format('M/D/YYYY')}</Typography>
  )

  return ( typeof financialAuditTotals === 'undefined' ) ? <Loading /> : (
    <Paper component="main" sx={{ p: 3, flexGrow: 1, mt: -3}}>
      <CustomSecondaryHeader title={title} />

      <Grid container rowSpacing={1} columnSpacing={3}>
        <Grid item xs={12} md={9} lg={10}>
          <Grid container rowSpacing={1} columnSpacing={3}>
            <Grid item xs={12} sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6"><strong>Unearned</strong> Membership Dues</Typography>
              <DateRange />
            </Grid>
            <Grid item xs={12} md={4}>
              <DateStatusWidget WidgetIcon={WatersystemIcon} heading={USDollar.format(financialAuditTotals.watersystems.unearnedTotal)} subheading="Watersystems" />
            </Grid>
            <Grid item xs={12} md={4}>
              <DateStatusWidget WidgetIcon={AssociateIcon} heading={USDollar.format(financialAuditTotals.associates.unearnedTotal)} subheading="Associates" />
            </Grid>
            <Grid item xs={12} md={4}>
              <DateStatusWidget WidgetIcon={TotalIcon} heading={USDollar.format(financialAuditTotals.total.unearnedTotal)} subheading="Total" />
            </Grid>
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Typography variant="h6"><strong>Collected</strong> Membership Dues</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <DateStatusWidget WidgetIcon={WatersystemIcon} heading={USDollar.format(financialAuditTotals.watersystems.collectedTotal)} subheading="Watersystems" />
            </Grid>
            <Grid item xs={12} md={4}>
              <DateStatusWidget WidgetIcon={AssociateIcon} heading={USDollar.format(financialAuditTotals.associates.collectedTotal)} subheading="Associates" />
            </Grid>
            <Grid item xs={12} md={4}>
              <DateStatusWidget WidgetIcon={TotalIcon} heading={USDollar.format(financialAuditTotals.total.collectedTotal)} subheading="Total" />
            </Grid>
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Typography variant="h6"><strong>Average Daily Unearned</strong> Membership Dues</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <DateStatusWidget WidgetIcon={WatersystemIcon} heading={USDollar.format(financialAuditTotals.watersystems.unearnedDailyAverage)} subheading="Watersystems" />
            </Grid>
            <Grid item xs={12} md={4}>
              <DateStatusWidget WidgetIcon={AssociateIcon} heading={USDollar.format(financialAuditTotals.associates.unearnedDailyAverage)} subheading="Associates" />
            </Grid>
            <Grid item xs={12} md={4}>
              <DateStatusWidget WidgetIcon={TotalIcon} heading={USDollar.format(financialAuditTotals.total.unearnedDailyAverage)} subheading="Total" />
            </Grid>
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Typography variant="h6"><strong>Average Daily Collected</strong> Membership Dues</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <DateStatusWidget WidgetIcon={WatersystemIcon} heading={USDollar.format(financialAuditTotals.watersystems.collectedDailyAverage)} subheading="Watersystems" />
            </Grid>
            <Grid item xs={12} md={4}>
              <DateStatusWidget WidgetIcon={AssociateIcon} heading={USDollar.format(financialAuditTotals.associates.collectedDailyAverage)} subheading="Associates" />
            </Grid>
            <Grid item xs={12} md={4}>
              <DateStatusWidget WidgetIcon={TotalIcon} heading={USDollar.format(financialAuditTotals.total.collectedDailyAverage)} subheading="Total" />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3} lg={2} sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>Date Filter</Typography>
          <DateField label="Attribution Date" value={fromDate} onChange={(d) => setFromDate(d as Dayjs)} fullWidth />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default FinancialAuditDashboard