import React from 'react'
import { Box, Card, Skeleton, Typography } from '@mui/material'
import { useGetList } from 'react-admin'
import { Link } from 'react-router-dom'
import RateReviewIcon from '@mui/icons-material/RateReview'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import PodcastsIcon from '@mui/icons-material/Podcasts'

type StatCardProps = {
  label: string
  status: string
  icon: React.ReactNode
  color: string
}

const StatCard = ({ label, status, icon, color }: StatCardProps) => {
  const { total, isLoading } = useGetList('training-events', {
    pagination: { page: 1, perPage: 1 },
    sort: { field: 'start', order: 'ASC' },
    filter: { status },
  })

  return (
    <Card
      component={Link}
      to={`/training-events?filter=${encodeURIComponent(JSON.stringify({ status }))}`}
      sx={{
        flex: 1,
        minWidth: 150,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.5,
        textDecoration: 'none',
        color: 'text.primary',
        bgcolor: 'background.paper',
        transition: 'transform 120ms ease',
        '&:hover': { transform: 'translateY(-2px)' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: '10px',
          color: 'white',
          backgroundColor: color,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        {isLoading ? (
          <Skeleton width={32} height={32} />
        ) : (
          <Typography variant="h5" fontWeight="bold" lineHeight={1.1}>
            {total ?? 0}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary" noWrap>
          {label}
        </Typography>
      </Box>
    </Card>
  )
}

/** Pipeline counts at a glance; each card links to the filtered event list. */
const StatsStrip = () => (
  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
    <StatCard
      label="Needs Review"
      status="REVIEW"
      icon={<RateReviewIcon fontSize="small" />}
      color="#ef6c00"
    />
    <StatCard
      label="At DEQ"
      status="DEQ"
      icon={<AccountBalanceIcon fontSize="small" />}
      color="#1565c0"
    />
    <StatCard
      label="Open for RSVP"
      status="RSVP"
      icon={<HowToRegIcon fontSize="small" />}
      color="#2e7d32"
    />
    <StatCard
      label="Live Now"
      status="LIVE"
      icon={<PodcastsIcon fontSize="small" />}
      color="#5e35b1"
    />
  </Box>
)

export default StatsStrip
