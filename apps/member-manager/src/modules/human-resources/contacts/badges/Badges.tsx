import {Chip, Grid, Tooltip} from "@mui/material"
import React from 'react'
import { useGetList, useRecordContext } from 'react-admin'
const Badges = () => {
  const record = useRecordContext()
  if (typeof record === 'undefined') { return null }
  const badgeIds = record.badges.flat()
  const {
    data: badges = [],
  } = useGetList('contact-badges', {
    meta: {
      raw: true,
    },
    filter: { id: badgeIds },
    pagination: { page: 1, perPage: 100 },
  })
  return (  
    <Grid container mt={-3} spacing={1} justifyContent="flex-start">
      {record.badges.length > 0 && badges.map((badge, index: number) => (
      
        <Grid key={`${badge.title}-${index}`}>

          {badge.icon && badge.icon.url !== undefined && <Tooltip key={index} title={badge.title} arrow>
            <Chip label={
              <img 
                src={`${import.meta.env.VITE_API_ENDPOINT}` + badge.icon.url} 
                style={{height: 24, filter: badge.invert === true ? 'invert(1)' : ''}} 
              />} 
            sx={{ 
              padding: '0px', 
              backgroundColor: badge.color_code 
            }}
            ></Chip>
          </Tooltip>}
        </Grid>
      ))}
    </Grid>
  )
}
export default Badges
