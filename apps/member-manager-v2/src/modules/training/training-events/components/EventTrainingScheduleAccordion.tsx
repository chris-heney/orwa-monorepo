import React, { useState } from 'react'
import { RaRecord, useRecordContext } from 'react-admin'
import { ITrainingInstructor, ITrainingTopic, ITrainingBlock, ITrainingSession } from '../../_types'
import {Accordion, AccordionDetails, AccordionSummary, Autocomplete, Box, Divider, Grid, IconButton, TextField, Typography, Button} from "@mui/material"
import { LocalizationProvider, TimeField } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'

interface ISyllabusProps {
  setIsTopicOpen: React.Dispatch<React.SetStateAction<boolean>>
  blocks: ITrainingBlock[]
  setBlocks: React.Dispatch<React.SetStateAction<ITrainingBlock[]>>
  instructorOptions: ITrainingInstructor[]
  topicOptions: ITrainingTopic[]
  updateTrainingSchedule: () => void
}

const TrainingSyllabusAccordion = ({
  blocks,
  setBlocks,
  instructorOptions,
  topicOptions,
  setIsTopicOpen,
  updateTrainingSchedule
}: ISyllabusProps) => {

  const record = useRecordContext<RaRecord>()

  const [expandedBlock, setExpandedBlock] = useState<number | undefined>(undefined)
  const [expandedTopic, setExpandedTopic] = useState<number | undefined>(undefined)

  const addBlock = () => {
    if (typeof record === 'undefined' || !record) return
    const eventStartDate = new Date(record.start)
    const blockDate = new Date(eventStartDate)
    blockDate.setDate(eventStartDate.getDate() +
      + Math.floor(blocks.length / 2))
    const data: ITrainingBlock = {
      date: blockDate.toISOString().split('T')[0],
      am_pm: blocks.length % 2 ? 'PM' : 'AM',
      sessions: [],
    }

    setBlocks([...blocks, { ...data }])
    setExpandedBlock(blocks.length)
  }

  const deleteBlock = (blockIndex: number) => {

    // Clone the blocks array to avoid mutating the state directly
    const updatedBlocks = [...blocks]

    // Check if the specified block index is valid
    if (blockIndex >= 0 && blockIndex < updatedBlocks.length) {

      // Remove the block at the specifiedindex
      updatedBlocks.splice(blockIndex, 1)

      updatedBlocks.forEach((block, index) => {
        block.am_pm = index % 2 === 0 ? 'AM' : 'PM'
      })

      setBlocks(updatedBlocks)
    } else {
      console.error('Invalid block index.')
    }
  }

  const addSession = async (blockIndex: number) => {
    const instructor = instructorOptions.filter(type => type.id === record.instructor)
    if (typeof record === 'undefined' || !record) return
    // Create a new session
  
    const newSession: ITrainingSession = {
      id: '',
      topic: null,
      training_instructor: instructor[0],
      category: '',
      summary: '',
      start: blockIndex % 2 === 0 ? dayjs(record.start).add(blocks[blockIndex]?.sessions.length, 'hour').format('hh:mm:ss.SSS'):  dayjs().set('hour', 13).set('minute', 0).add(blocks[blockIndex]?.sessions.length, 'hour').format('hh:mm:ss.SSS'),
      end: blockIndex % 2 === 0 ?  dayjs(record.start).add(50, 'minutes').add(blocks[blockIndex]?.sessions.length, 'hour').format('hh:mm:ss.SSS') : dayjs().set('hour', 13).set('minute', 50).add(blocks[blockIndex]?.sessions.length, 'hour').format('hh:mm:ss.SSS'), 
    }

    // Clone the blocks array to avoid mutating the state directly
    const updatedBlocks = [...blocks]

    // Check if the specified block index is valid
    if (blockIndex >= 0 && blockIndex < updatedBlocks.length) {

      // Add the new session to the sessions array of the specified block
      updatedBlocks[blockIndex].sessions.push(newSession)
      setBlocks(updatedBlocks)

      //expands the new session
      setExpandedTopic(updatedBlocks[blockIndex].sessions.length - 1)

    } else {
      console.error('Invalid block index.')
    }
  }

  const deleteSession = (blockIndex: number, topicIndex: number) => {
    const updatedBlocks = [...blocks]

    if (blockIndex >= 0 && blockIndex < updatedBlocks.length) {
      updatedBlocks[blockIndex].sessions.splice(topicIndex, 1)
      setBlocks(updatedBlocks)
    } else {
      console.error('Invalid block index.')
    }
  }

  return (
    <>
      {blocks.map((block: ITrainingBlock, blockIndex: number) => {
        const isExpanded = expandedBlock === blockIndex
        const sessionsCount = block.sessions.length

        return (
          <Accordion
            expanded={isExpanded}
            onChange={() => { isExpanded ? setExpandedBlock(undefined) : setExpandedBlock(blockIndex) }}
            key={`block-index-${blockIndex}`} sx={{ my: 1, mx: 2 }} disableGutters>
            <AccordionSummary>
              <Box sx={{
                display: 'flex',
                width: '100%'
              }}>
                <Typography variant='h5' sx={{
                  flexGrow: 1,
                  flexShrink: 1,
                  flexBasis: 'auto',
                  mr: 'auto'
                }}>Block {blockIndex + 1}: {block.am_pm} ({dayjs(record.start).add(Math.floor((blockIndex - 2) / 2) + 1, 'day').format('MM-DD-YYYY')})</Typography>
                <IconButton onClick={() => deleteBlock(blockIndex)} color='error' aria-label="delete" sx={{
                  flexShrink: 1,
                  flexBasis: 'auto',
                  justifyContent: 'flex-end',
                  ml: 'auto'
                }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </AccordionSummary>
            <AccordionDetails>  
              <Divider sx={{ mt: -3, mb: 3 }} />
              <Box sx={{ width: '100%' }}>
                {block.sessions.map((topic: ITrainingSession, topicIndex) => {
                  const isExpanded = expandedTopic === topicIndex

                  const start = dayjs(topic.start).isValid()
                    ? topic.start
                    : dayjs().set('hour', (
                      topic.start !== null ? parseInt(topic.start.toString().split(':')[0] as string) : 0
                    )).set('minute', (
                      topic.start !== null ? parseInt(topic.start.toString().split(':')[1] as string) : 0
                    ))

                  const end = dayjs(topic.end).isValid()
                    ? topic.end
                    : dayjs().set('hour', (
                      topic.end !== null ? parseInt(topic.end.toString().split(':')[0] as string) : 0
                    )).set('minute', (
                      topic.end !== null ? parseInt(topic.end.toString().split(':')[1] as string) : 0
                    ))

                  return (
                    <Accordion
                      expanded={isExpanded}
                      onChange={() => isExpanded ? setExpandedTopic(undefined) : setExpandedTopic(topicIndex)}
                      key={`topic-index-${topicIndex}`} sx={{ my: 1 }} disableGutters>
                      <AccordionSummary sx={{ backgroundColor: '#262626', my: 0, height: 30 }}>
                        <Box sx={{
                          alignItems: 'center',
                          display: 'flex',
                          width: '100%'
                        }}>
                          <Typography sx={{
                            color: 'white',
                            flexGrow: 1,
                            flexShrink: 1,
                            flexBasis: 'auto',
                            mr: 'auto',
                            fontSize: 14
                          }} variant='h6'>Topic {topicIndex + 1} : {topic.topic?.name}</Typography>
                          <IconButton
                            color='error'
                            onClick={() => deleteSession(blockIndex, topicIndex)}
                            aria-label="delete"
                            sx={{
                              flexShrink: 1,
                              flexBasis: 'auto',
                              justifyContent: 'flex-end',
                              ml: 'auto'
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </AccordionSummary>
                      <Button sx={{ ml: 2 }} onClick={() => setIsTopicOpen(true)}>New Topic</Button>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={4} lg={3}>
                            <Autocomplete
                              options={topicOptions || []}
                              getOptionLabel={(option) => option.name}
                              fullWidth
                              value={topic.topic as ITrainingTopic}
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              onChange={(e, newValue) => {
                                const updatedBlocks = [...blocks]
                                updatedBlocks[blockIndex].sessions[topicIndex].topic = newValue
                                updatedBlocks[blockIndex].sessions[topicIndex].summary = newValue ? newValue.description : ''
                                updatedBlocks[blockIndex].sessions[topicIndex].category = newValue ? newValue.category : ''

                                setBlocks(updatedBlocks)
                              }}
                              renderInput={(params) => (
                                <TextField  {...params} label={`Topic ${topicIndex + 1}`} fullWidth />
                              )}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6} md={4} lg={2}>
                            <Autocomplete
                              options={instructorOptions || []}
                              getOptionLabel={(option) => (option.instructor ? option.instructor.first + ' ' + option.instructor.last : option.instructor)}
                              fullWidth
                              value={topic.training_instructor}
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              onChange={(e, newValue) => {
                                const updatedBlocks = [...blocks]
                                updatedBlocks[blockIndex].sessions[topicIndex].training_instructor = newValue
                                setBlocks(updatedBlocks)
                              }}
                              renderInput={(params) => (
                                <TextField {...params} label={'Instructor'} fullWidth />
                              )}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6} md={4} lg={3}>
                            <TextField
                              label={'Category'}
                              fullWidth
                              value={topic.category ?? ''}
                              onChange={(e) => {
                                const updatedBlocks = [...blocks]
                                updatedBlocks[blockIndex].sessions[topicIndex].category = e.target.value
                                setBlocks(updatedBlocks)
                              }}
                            />
                          </Grid>

                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Grid item xs={6} sm={6} md={4} lg={2}>
                              <TimeField
                                fullWidth
                                label="Start"
                                value={topic.start === null ? null : start}
                                onChange={(newValue) => {  
                                  const updatedBlocks = [...blocks]
                                  updatedBlocks[blockIndex].sessions[topicIndex].start = dayjs(newValue).format('hh:mm:ss.SSS')
                                  setBlocks(updatedBlocks)
                                }}
                                format="h:mm"
                                onKeyDown={(e) => { e.key === 'Backspace' && e.preventDefault() }}
                              />
                            </Grid>
                            <Grid item xs={6} sm={6} md={4} lg={2}>
                              <TimeField
                                fullWidth
                                label="End"
                                value={topic.end === null ? null : end}
                                onChange={(newValue) => {
                                  const updatedBlocks = [...blocks]
                                  updatedBlocks[blockIndex].sessions[topicIndex].end = dayjs(newValue).format('hh:mm:ss.SSS')
                                  setBlocks(updatedBlocks)
                                }}
                                format="h:mm"
                                onKeyDown={(e) => { e.key === 'Backspace' && e.preventDefault() }}
                              />
                            </Grid>
                          </LocalizationProvider>

                          <Grid item xs={12}>
                            <TextField
                              label={'Description'}
                              fullWidth
                              multiline
                              rows={2}
                              value={topic.summary ?? ''}
                              onChange={(e) => {
                                const updatedBlocks = [...blocks]
                                updatedBlocks[blockIndex].sessions[topicIndex].summary = e.target.value
                                setBlocks(updatedBlocks)
                              }}
                            />
                          </Grid>
                        </Grid>
                        <Divider sx={{ mt: 2 }} />
                        <Box
                          display="flex"
                          justifyContent="flex-end"
                          mt={2}  // Adjust the margin as needed
                        >
                          <Button
                            onClick={() => {
                              updateTrainingSchedule()
                              setExpandedTopic(undefined)
                            }}
                            variant='contained'
                            color='success'
                            endIcon={<SaveIcon />}
                          >
                            Save
                          </Button>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  )
                })}
                {sessionsCount < 4 && (
                  <Button value={'Add Topic'} onClick={() => addSession(blockIndex)}> Add Session</Button>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        )
      })}
      <Divider sx={{ mt: blocks.length === 0 ? 20 : 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          sx={{ mt: 2, width: 200, backgroundColor: 'black', '&:hover': { backgroundColor: 'gray' } }}
          variant='contained'
          onClick={addBlock}>
          Add Block
        </Button>
      </Box>
      <Divider sx={{ py: 10 }} />
    </>
  )
}

export default TrainingSyllabusAccordion
