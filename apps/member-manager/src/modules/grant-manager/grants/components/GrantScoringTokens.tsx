import React from 'react'
import { Grid } from '@mui/material'
import { Loading, RaRecord, useGetList } from 'react-admin'
import PublicKeyTokenWidget from './PublicKeyTokenWidget'

const GrantScoringPublicKeyTokens = () => {

  const { data: tokens, isLoading: isTokensLoading } = useGetList('grant-scoring-tokens',
    {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: 'order', order: 'ASC' },
      meta: {
        populate: true,
        raw: true
      },
    }
  )

  return isTokensLoading ? <Loading /> : (
    <>
      {tokens && tokens.map((token: RaRecord) => (
        <Grid item xs={12} sm={6} md={4} lg={4} key={token.id} borderRadius={0}>
          <PublicKeyTokenWidget token={token} heading={token.name} subheading={token.public_key} />
        </Grid>
      ))}
    </>
  )
}

export default GrantScoringPublicKeyTokens
