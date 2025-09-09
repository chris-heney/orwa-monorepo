import { Box, Card, SvgIconTypeMap, Typography } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'

interface StatWidgetProps {
  heading: string;
  subheading: string;
  WidgetIcon: OverridableComponent<SvgIconTypeMap>
}

const AwardAmountWidget = ({ heading, subheading, WidgetIcon }: StatWidgetProps) => {
  return (
    <Card
      sx={{
        background: 'linear-gradient(to right, #3498db, #6bb9f0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 2,
        borderRadius: '16px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        color: 'white',
      }}
    >
      <Box
        sx={{
          p: 2,
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '50%',
          marginRight: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <WidgetIcon sx={{ color: '#fff', fontSize: 32 }} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant='h6' sx={{ mb: -1 }}>{heading}</Typography>
        <Typography variant='subtitle2'>{subheading}</Typography>
      </Box>
    </Card>
  )
}

export default AwardAmountWidget