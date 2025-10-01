import {Box, Card, Grid, SvgIconTypeMap, Typography, useTheme} from "@mui/material"
import { OverridableComponent } from '@mui/material/OverridableComponent'
import React from 'react'

interface StatWidgetProps {
    heading: string
    subheading: string
    WidgetIcon: OverridableComponent<SvgIconTypeMap>
}


const StatWidget = ({ heading, subheading, WidgetIcon }: StatWidgetProps) => {
  const theme = useTheme();
  
  return (
    <Grid item xs={12} sm={6}>
      <Card sx={{
        height: 100,
        background: `linear-gradient(-39deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'left',
        borderTopLeftRadius: '75px',
        borderBottomRightRadius: '75px',
      }}>
        <Box sx={{
          px: 2,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRight: `2px solid ${theme.palette.common.white}`,
          borderTopRightRadius: '75px',
          borderBottomRightRadius: '75px'
        }}>
          <WidgetIcon sx={{ color: theme.palette.common.white, fontSize: 32, opacity: 0.8 }} />
        </Box>
        <Box sx={{ px: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: -1, justifyContent: 'center' }}>
          <Typography sx={{ color: theme.palette.common.white }} variant='h5'>{heading} </Typography>
          <Typography sx={{ color: theme.palette.common.white, mt: -0.5 }} variant='subtitle2'> {subheading} </Typography>
        </Box>
      </Card>
    </Grid>
  )
}

export default StatWidget