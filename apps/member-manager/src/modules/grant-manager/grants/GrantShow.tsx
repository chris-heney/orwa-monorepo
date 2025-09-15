import React from 'react'
import {
  Box,
  Card,
  Divider,
  Grid,
  Theme,
  Typography,
  useMediaQuery
} from '@mui/material'
import { Loading, useGetList, useRecordContext } from 'react-admin'

const GrantShow = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const grant = useRecordContext()

  const { data: types } = useGetList('grant-types', {
    meta: {
      populate: true,
      raw: true
    },
    pagination: { page: 1, perPage: 1000 },
  })

  const formatNumberAbbreviation = (number: number | undefined): string => {
    if (number === undefined) {
      return ''
    }

    const abbreviations: string[] = ['', 'K', 'M', 'B', 'T']

    let formattedNumber: string | number = number

    for (let i = abbreviations.length - 1; i >= 0; i--) {
      const divisor = 10 ** (i * 3)
      if (number >= divisor) {
        formattedNumber = (number / divisor) + '' + abbreviations[i]
        break
      }
    }

    return formattedNumber as string
  }

  if (!types || !grant) {
    return <Loading />
  }

  const type = types.find((type) => type.id === grant.type)

  const start = grant.opens ? new Date(grant.opens) : undefined
  const end = grant.closes ? new Date(grant.closes) : undefined

  const openDate = start?.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })
  const closeDate = end?.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })

  const formattedGrantAmount = formatNumberAbbreviation(grant.grant_amount)
  const formattedFundsProvided = formatNumberAbbreviation(grant.funds_provided)
  const maxAward = formatNumberAbbreviation(grant.max_award)

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <Box style={{ display: 'flex', flexDirection: isSmall ? 'column' : 'row' }}>
          <Box style={{ marginBottom: '1rem' }}>
            <Typography style={{ textAlign: 'left', fontWeight: 'bold' }} variant="h5">
              {grant.name}
            </Typography>
            <Typography style={{ textAlign: 'left', color: 'textSecondary', marginBottom: 4 }} gutterBottom>
              {type ? type.description : ''}
            </Typography>
            <Typography style={{ textAlign: 'left', fontWeight: 'bold' }}>
              Eligibility Criteria
            </Typography>
            <Typography style={{ textAlign: 'left', color: 'textSecondary' }} gutterBottom>
              {type ? type.eligibility : ''}
            </Typography>
            <Box style={{ display: 'flex', marginTop: '1.5rem' }}>
              <Box style={{ marginRight: '1rem' }}>
                <Typography style={{ textAlign: 'left', fontWeight: 'bold', fontSize: '1rem' }} variant="subtitle2"  >Open Date: </Typography>
                <Typography variant="subtitle2" color="textSecondary">{openDate}</Typography>
              </Box>
              <Box>
                <Typography style={{ textAlign: 'left', fontWeight: 'bold', fontSize: '1rem' }} variant="subtitle2"  >Close Date: </Typography>
                <Typography variant="subtitle2" color="textSecondary" >{closeDate}</Typography>
              </Box>
            </Box>
          </Box>
          <Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <Card>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Typography style={{ fontSize: 14, width: '100%' }} variant='h6'> Funds</Typography>
            <Typography style={{ fontSize: 14, width: '100%' }} variant='h6'> Status: {grant.status} </Typography>
          </Box>
          <Divider />
          <Grid container gap={1}>
            <Grid item xs={12} sm={6} md={6} lg={3.85}>
              <Card sx={{ borderRadius: 0, height: 100 }}>
                <Typography variant='h6'> Avaialable </Typography>
                ${formattedGrantAmount}
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3.85}>
              <Card sx={{ borderRadius: 0, height: 100 }}>
                <Typography variant='h6'> Awarded </Typography>
                ${formattedFundsProvided}
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3.85}>
              <Card sx={{ borderRadius: 0, height: 100 }}>
                <Typography variant='h6'>  Award </Typography>
                ${maxAward}
              </Card>
            </Grid>
            {/* Add a chart here with applicationd recived approved and total applications approved green and not approved redxw */}
          </Grid>
        </Card>
      </Grid>
    </Grid>
  )
}

export default GrantShow
