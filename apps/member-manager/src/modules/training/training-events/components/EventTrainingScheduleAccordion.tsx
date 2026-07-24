import React from 'react'
import { RaRecord, useRecordContext } from 'react-admin'
import {
  ITrainingInstructor,
  ITrainingTopic,
  ITrainingBlock,
  ITrainingSession,
} from '../../_types'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { LocalizationProvider, TimeField } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import DarkModeIcon from '@mui/icons-material/DarkMode'

interface ISyllabusProps {
  setIsTopicOpen: React.Dispatch<React.SetStateAction<boolean>>
  blocks: ITrainingBlock[]
  setBlocks: React.Dispatch<React.SetStateAction<ITrainingBlock[]>>
  instructorOptions: ITrainingInstructor[]
  topicOptions: ITrainingTopic[]
  updateTrainingSchedule: () => void
}

/** Parse legacy time strings ("09:00:00.000") into a dayjs for the TimeField. */
const parseSessionTime = (value: ITrainingSession['start']) => {
  if (value == null) return null
  if (dayjs(value as string).isValid()) return dayjs(value as string)
  const [hour = '0', minute = '0'] = value.toString().split(':')
  return dayjs().set('hour', parseInt(hour)).set('minute', parseInt(minute))
}

const SESSION_LIMIT_PER_BLOCK = 4

/**
 * Modern schedule builder: one card per half-day block, sessions as inline
 * editable rows. State model and persistence endpoints are unchanged.
 */
const TrainingScheduleBuilder = ({
  blocks,
  setBlocks,
  instructorOptions,
  topicOptions,
  setIsTopicOpen,
}: ISyllabusProps) => {
  const record = useRecordContext<RaRecord>()

  const addBlock = () => {
    if (!record) return
    const eventStartDate = new Date(record.start)
    const blockDate = new Date(eventStartDate)
    blockDate.setDate(eventStartDate.getDate() + Math.floor(blocks.length / 2))
    const data: ITrainingBlock = {
      date: blockDate.toISOString().split('T')[0],
      am_pm: blocks.length % 2 ? 'PM' : 'AM',
      sessions: [],
    }
    setBlocks([...blocks, { ...data }])
  }

  const deleteBlock = (blockIndex: number) => {
    const updatedBlocks = [...blocks]
    updatedBlocks.splice(blockIndex, 1)
    updatedBlocks.forEach((block, index) => {
      block.am_pm = index % 2 === 0 ? 'AM' : 'PM'
    })
    setBlocks(updatedBlocks)
  }

  const addSession = (blockIndex: number) => {
    if (!record) return
    const instructor = instructorOptions.find((i) => i.id === record.instructor)
    const sessionCount = blocks[blockIndex]?.sessions.length ?? 0
    const newSession: ITrainingSession = {
      id: '',
      topic: null,
      training_instructor: instructor ?? null,
      category: '',
      summary: '',
      start:
        blockIndex % 2 === 0
          ? dayjs(record.start).add(sessionCount, 'hour').format('hh:mm:ss.SSS')
          : dayjs()
              .set('hour', 13)
              .set('minute', 0)
              .add(sessionCount, 'hour')
              .format('hh:mm:ss.SSS'),
      end:
        blockIndex % 2 === 0
          ? dayjs(record.start)
              .add(50, 'minutes')
              .add(sessionCount, 'hour')
              .format('hh:mm:ss.SSS')
          : dayjs()
              .set('hour', 13)
              .set('minute', 50)
              .add(sessionCount, 'hour')
              .format('hh:mm:ss.SSS'),
    }
    const updatedBlocks = [...blocks]
    updatedBlocks[blockIndex].sessions.push(newSession)
    setBlocks(updatedBlocks)
  }

  const deleteSession = (blockIndex: number, sessionIndex: number) => {
    const updatedBlocks = [...blocks]
    updatedBlocks[blockIndex].sessions.splice(sessionIndex, 1)
    setBlocks(updatedBlocks)
  }

  const patchSession = (
    blockIndex: number,
    sessionIndex: number,
    patch: Partial<ITrainingSession>
  ) => {
    const updatedBlocks = [...blocks]
    updatedBlocks[blockIndex].sessions[sessionIndex] = {
      ...updatedBlocks[blockIndex].sessions[sessionIndex],
      ...patch,
    }
    setBlocks(updatedBlocks)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {blocks.length === 0 && (
          <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            No schedule yet. Add the first block to start building — blocks
            alternate AM / PM, one pair per event day.
          </Typography>
        )}

        {blocks.map((block: ITrainingBlock, blockIndex: number) => {
          const blockDate = block.date
            ? dayjs(block.date).format('MM/DD/YYYY')
            : dayjs(record?.start)
                .add(Math.floor(blockIndex / 2), 'day')
                .format('MM/DD/YYYY')
          const blockHours = block.sessions.reduce(
            (sum, s) => sum + (s.topic?.hours ?? 0),
            0
          )

          return (
            <Card key={`block-${blockIndex}`} variant="outlined" sx={{ overflow: 'visible' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 1,
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.04)'
                      : 'rgba(0,0,0,0.03)',
                }}
              >
                {block.am_pm === 'AM' ? (
                  <WbSunnyIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                ) : (
                  <DarkModeIcon sx={{ color: 'info.main', fontSize: 20 }} />
                )}
                <Typography variant="subtitle1" fontWeight="bold">
                  Block {blockIndex + 1} — {block.am_pm}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {blockDate}
                </Typography>
                <Chip
                  size="small"
                  label={`${blockHours} hr${blockHours === 1 ? '' : 's'}`}
                  sx={{ ml: 'auto' }}
                />
                <Tooltip title="Delete block">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => deleteBlock(blockIndex)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {block.sessions.map((session: ITrainingSession, sessionIndex) => (
                  <Box key={`session-${blockIndex}-${sessionIndex}`}>
                    {sessionIndex > 0 && <Divider sx={{ mb: 1.5 }} />}
                    <Grid container spacing={1.5} alignItems="center">
                      <Grid item xs={12} sm={6} md={3}>
                        <Autocomplete
                          options={topicOptions || []}
                          size="small"
                          getOptionLabel={(option) => option.name}
                          fullWidth
                          value={(session.topic as ITrainingTopic) ?? null}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          onChange={(e, newValue) =>
                            patchSession(blockIndex, sessionIndex, {
                              topic: newValue,
                              summary: newValue ? newValue.description : '',
                              category: newValue ? newValue.category : '',
                            })
                          }
                          renderInput={(params) => (
                            <TextField {...params} label="Topic" fullWidth />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={2.5}>
                        <Autocomplete
                          options={instructorOptions || []}
                          size="small"
                          getOptionLabel={(option) =>
                            option.instructor
                              ? `${option.instructor.first} ${option.instructor.last}`
                              : String(option.instructor ?? '')
                          }
                          fullWidth
                          value={session.training_instructor ?? null}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          onChange={(e, newValue) =>
                            patchSession(blockIndex, sessionIndex, {
                              training_instructor: newValue,
                            })
                          }
                          renderInput={(params) => (
                            <TextField {...params} label="Instructor" fullWidth />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4} md={2}>
                        <TextField
                          label="Category"
                          size="small"
                          fullWidth
                          value={session.category ?? ''}
                          onChange={(e) =>
                            patchSession(blockIndex, sessionIndex, {
                              category: e.target.value,
                            })
                          }
                        />
                      </Grid>
                      <Grid item xs={5} sm={3} md={1.75}>
                        <TimeField
                          fullWidth
                          size="small"
                          label="Start"
                          value={parseSessionTime(session.start)}
                          onChange={(newValue) =>
                            patchSession(blockIndex, sessionIndex, {
                              start: dayjs(newValue).format('hh:mm:ss.SSS'),
                            })
                          }
                          format="h:mm"
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace') e.preventDefault()
                          }}
                        />
                      </Grid>
                      <Grid item xs={5} sm={3} md={1.75}>
                        <TimeField
                          fullWidth
                          size="small"
                          label="End"
                          value={parseSessionTime(session.end)}
                          onChange={(newValue) =>
                            patchSession(blockIndex, sessionIndex, {
                              end: dayjs(newValue).format('hh:mm:ss.SSS'),
                            })
                          }
                          format="h:mm"
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace') e.preventDefault()
                          }}
                        />
                      </Grid>
                      <Grid item xs={2} sm={2} md={1} sx={{ textAlign: 'right' }}>
                        <Tooltip title="Remove session">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => deleteSession(blockIndex, sessionIndex)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Description"
                          size="small"
                          fullWidth
                          multiline
                          maxRows={3}
                          value={session.summary ?? ''}
                          onChange={(e) =>
                            patchSession(blockIndex, sessionIndex, {
                              summary: e.target.value,
                            })
                          }
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ))}

                {block.sessions.length < SESSION_LIMIT_PER_BLOCK && (
                  <Button
                    startIcon={<AddIcon />}
                    size="small"
                    onClick={() => addSession(blockIndex)}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Add Session
                  </Button>
                )}
              </Box>
            </Card>
          )
        })}

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, pb: 1 }}>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={addBlock}>
            Add {blocks.length % 2 ? 'PM' : 'AM'} Block
          </Button>
          <Button size="small" onClick={() => setIsTopicOpen(true)}>
            New Topic…
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  )
}

export default TrainingScheduleBuilder
