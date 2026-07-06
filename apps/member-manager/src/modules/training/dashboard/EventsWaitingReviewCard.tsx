import {  Button, Card, Typography, useMediaQuery } from '@mui/material'
import { Theme } from '@mui/material/styles'
import CustomExportFunction from '../../../helpers/custom-export-function'
import React, { useState } from 'react'
import {
  List,
  ConfigurableDatagridColumn,
  useStore,
} from 'react-admin'
import EventListCardGridMobile from '../training-events/components/EventListCardGridMobile' 
import LightbulbIcon from '@mui/icons-material/Lightbulb'

const TrainingEventList = () => {
  const [filterListOpen, setFilterListOpen] = useState(false)
  const preferenceKey = 'training-events.datagrid'
  const [availableColumns] = useStore<
        ConfigurableDatagridColumn[]
    >(`preferences.${preferenceKey}.availableColumns`, [])

  const [columnIds] = useStore<string[]>(
    `preferences.${preferenceKey}.columns`,
    []
  )
  const exporter = (records: ConfigurableDatagridColumn[]) => {
    CustomExportFunction(records, availableColumns, columnIds, 'Training Events')
  }

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))


  // Create an array of promises for record updates

  return (
    <Card sx={{height: '100%', width: '100%', backgroundColor: '#292525'}}>        
      <Typography mt={.5} color={'white'} display={'flex'} alignItems={'center'}  variant="h5"  marginLeft={1} gutterBottom>
        <LightbulbIcon sx={{fontSize: 30, color: 'yellow'}} /> Awaiting Review
      </Typography>
      <List
        sx={{overflowY: 'scroll', height: '100%', width: '100%', backgroundColor: '#292525'}}
        exporter={exporter}
        resource='training-events'
        actions={false}
        filter={{status: 'REVIEW'}}
        title={' '}>
        {isSmall && <Button onClick={() => filterListOpen ? setFilterListOpen(false) : setFilterListOpen(true)}>
          {filterListOpen ? 'Hide Filters' : 'Add Filters'}
        </Button>}
        <EventListCardGridMobile />
      </List>
    </Card>
  )
}

export default TrainingEventList