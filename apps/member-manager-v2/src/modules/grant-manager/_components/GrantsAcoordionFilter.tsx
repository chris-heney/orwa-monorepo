import { Accordion, AccordionDetails, AccordionSummary, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import React from 'react'
import { ListContextProvider, ListControllerResult } from 'react-admin'
import SummaryRangeSelection from './SummaryRangeSelect'
import LegendToggleFilter from './LegendToggleFilter'
import { useGrantContext } from '../GrantContextProvider'

const GrantsAccordionFilter = () => {

  const {
    grants,
    grantIndex,
    setGrantIndex,
    selectedTab,
  } = useGrantContext()

  return (
    <Accordion disableGutters sx={{
      '& root.Mui-expanded': {
        minHeight: 20
      }, mb: -1
    }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
        aria-controls="panel1a-content"
        sx={{
          backgroundColor: '#262626',
          maxHeight: 20,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}>
        <Typography variant="h6" sx={{
          alignItems: 'center',
          textAlign: 'left',
          color: 'white',
          backgroundColor: '#262626',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          flexGrow: 1,
          p: 1,
        }}>Filter</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormControl>
          <FormLabel>Grants</FormLabel>
          <ListContextProvider value={{ resource: 'grant-applications' } as ListControllerResult}>
            <RadioGroup value={grantIndex} onChange={(e) => setGrantIndex(parseInt(e.target.value))}>
              {grants?.map((conference, i) => {
                return (
                  <FormControlLabel
                    key={`conference-${i}`}
                    sx={{ whiteSpace: 'nowrap' }}
                    value={i}
                    control={
                      <Radio checked={i === grantIndex} />
                    }
                    label={conference.name}
                  />
                )
              })}
            </RadioGroup>
          </ListContextProvider>
        </FormControl>
        {selectedTab === 'summary' && <SummaryRangeSelection/>}
        {selectedTab === 'applications' && <LegendToggleFilter/>}
      </AccordionDetails>
    </Accordion>
  )
}

export default GrantsAccordionFilter
