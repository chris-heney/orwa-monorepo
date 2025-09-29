import React from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material'
import { Loading, useGetList, useListContext } from 'react-admin'

const GrantListCardGrid = () => {
  const { data, isLoading } = useListContext()
  const { data: types } = useGetList('grant-types', {
    meta: {
      populate: true,
      raw: true
    },
    pagination :{ page: 1, perPage: 1000},
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

  return isLoading ? <Loading /> : (
    <Grid container spacing={2}>
      {data.map((grant, index) => {

        const type = types?.filter((type) => type.id === grant.type)
        const start = grant.opens ? new Date(grant.opens) : undefined
        const end = grant.closes ? new Date(grant.closes) : undefined

        const openDate = start?.toLocaleDateString('en-US', { 'year': 'numeric', 'month': 'numeric', 'day': 'numeric' })
        const closeDate = end?.toLocaleDateString('en-US', { 'year': 'numeric', 'month': 'numeric', 'day': 'numeric' })

        const formattedGrantAmount = formatNumberAbbreviation(grant.grant_amount)
        const formattedFundsProvided = formatNumberAbbreviation(grant.funds_provided)
        const maxAward = formatNumberAbbreviation(grant.max_award)

        return (
          <Grid item xs={12} sm={12} md={6} lg={6} key={index}>
            <Card key={index} style={{ marginBottom: '1.5rem' }}>
              <CardContent>
                <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box style={{ width: '75%', marginBottom: '1rem' }}>
                    <Typography style={{ textAlign: 'left', fontWeight: 'bold' }} variant="h5">
                      {grant.name}
                    </Typography>
                    <Typography style={{ textAlign: 'left', color: 'textSecondary' }} gutterBottom>
                      {type ? type[0].description : 0}
                    </Typography>
                    <Typography style={{ textAlign: 'left', fontWeight: 'bold' }}>
                                            Elegibility Criteria
                    </Typography>
                    <Typography style={{ textAlign: 'left', color: 'textSecondary' }} gutterBottom>
                      {type ? type[0].eligibility : 0}
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
                    <Box style={{ display: 'flex', marginTop: '2rem' }}>
                      <Button variant="contained" color="primary">
                                                Apply Now
                      </Button>
                      <Button style={{ marginLeft: '1rem' }} variant="contained" color="primary">
                                                View Applicants
                      </Button>
                    </Box>
                  </Box>
                  <Box>
                    <TableContainer component={CardContent}>
                      <Typography style={{ textAlign: 'right', fontSize: '1rem' }} variant="subtitle1">
                                                Status: {grant.status}
                      </Typography>
                      <Table size="small">
                        <TableBody>
                          <TableRow style={{ border: '2px solid black' }}>
                            <TableCell style={{ border: '2px solid black', textAlign: 'center' }}>
                              <Typography style={{ fontWeight: 'bold' }} variant='h5'> 120 </Typography>
                              <Typography style={{ fontSize: '0.7rem', fontWeight: 'bold' }} noWrap>  APPLICATIONS RECEIVED </Typography>
                            </TableCell>
                            <TableCell style={{ border: '2px solid black', textAlign: 'center' }}>
                              <Typography style={{ fontWeight: 'bold' }} variant='h5'> ${formattedGrantAmount} </Typography>
                              <Typography style={{ fontSize: '0.7rem', fontWeight: 'bold' }} noWrap >  FUNDS AVAILABLE </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow style={{ border: '2px solid black' }}>
                            <TableCell style={{ border: '2px solid black', textAlign: 'center' }}>
                              <Typography style={{ fontWeight: 'bold', color: 'green' }} variant='h5'> 60 </Typography>
                              <Typography style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'green' }} noWrap>  APPLICATIONS APPROVED </Typography>
                            </TableCell>
                            <TableCell style={{ border: '2px solid black', textAlign: 'center' }}>
                              <Typography style={{ fontWeight: 'bold' }} variant='h5'> ${formattedFundsProvided}  </Typography>
                              <Typography style={{ fontSize: '0.7rem', fontWeight: 'bold' }} noWrap>  AWARDED  </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ border: '2px solid black', textAlign: 'center' }}>
                              <Typography style={{ fontWeight: 'bold', color: 'red' }} variant='h5'> 60 </Typography>
                              <Typography style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'red' }} noWrap >  APPLICATIONS REJECTED </Typography>
                            </TableCell>
                            <TableCell style={{ border: '2px solid black', textAlign: 'center' }}>
                              <Typography style={{ fontWeight: 'bold' }} variant='h5'> ${maxAward} </Typography>
                              <Typography style={{ fontSize: '0.7rem', fontWeight: 'bold' }} noWrap>  MAX AWARD </Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default GrantListCardGrid
