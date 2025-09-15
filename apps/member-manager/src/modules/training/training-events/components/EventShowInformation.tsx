import React, { ReactNode, useState } from 'react'
import {
  useShowController,
  TextField,
  ReferenceField,
} from 'react-admin'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
  useMediaQuery,
  Theme,
  ListItem,
} from '@mui/material'
import { YearMonthDayMinute } from '../../../../helpers/Data'

const labelStyle = {
  fontWeight: 'bold',
  marginRight: '5px',
}

const ResponsiveListItem = ({ label, value, divider }: Record<'label' | 'value' | 'divider', string | ReactNode | boolean>) => {

  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const isMedium = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  const listStyle = isSmall
    ? { justifyContent: 'space-between', fontSize: '12px' }
    : isMedium
      ? { justifyContent: '', fontSize: '14px' }
      : { justifyContent: 'space-between', fontSize: '16px' }
  const fieldStyle = isSmall ? { justifyContent: 'space-between' } : undefined

  return (
    <ListItem divider={divider as boolean} style={listStyle as React.CSSProperties}>
      <label style={labelStyle}>{label as string}</label>
      {typeof value === 'string' ? (
        <span style={fieldStyle}>{value as string}</span>
      ) : typeof value === 'object' ? (
        value as ReactNode) : null}
    </ListItem>
  )
}



const EventShowInformation = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const isMedium = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
  const { record } = useShowController()

  const [showNotes, setShowNotes] = useState(false)
  const toggleNotes = () => {
    setShowNotes(!showNotes)
  }
  const examDate = new Date(record.exam_datetime)
  const startDate = new Date(record.start)
  const endDate = new Date(record.end)
  const formatedExamDate = examDate.toLocaleString('en-US', YearMonthDayMinute)
  const formatedStartDate = startDate.toLocaleString('en-US', YearMonthDayMinute)
  const formatedEndDate = endDate.toLocaleString('en-US', YearMonthDayMinute)

  if (typeof record === 'undefined' || !record) return null

  return (
    <Box>
      {record.deq_class_number && <ResponsiveListItem label="Deq Class Number: " value={record.deq_class_number} divider={true} />}
      <ResponsiveListItem
        label="Instructor: "
        value={
          <ReferenceField
            reference="training-instructors"
            source="instructor"
            label="Instructor"
            link={false}
          >
            <ReferenceField
              reference="contacts"
              source="instructor"
              link={false}
            >
              <Box>
                <TextField source="first" noWrap fontSize={isSmall ? 12 : isMedium ? 14 : 16} />
                {' '}
                <TextField source="last" noWrap fontSize={isSmall ? 12 : isMedium ? 14 : 16} />
              </Box>
            </ReferenceField>
          </ReferenceField>
        }
        divider={true}
      />
      <ResponsiveListItem
        label="Training: "
        value={record.training_type}
        divider={true}
      />
      <ResponsiveListItem
        label="Program: "
        value={<ReferenceField
          reference='programs'
          source='program_billed'
        >
          <TextField source="name" noWrap fontSize={isSmall ? 12 : isMedium ? 14 : 16} />
        </ReferenceField>}
        divider={true}
      />
      <ResponsiveListItem label="Location Code: " value={record.location} divider={true} />
      <ResponsiveListItem label="Start Date: " value={formatedStartDate} divider={true} />
      <ResponsiveListItem label="End Date: " value={formatedEndDate} divider={true} />
      {record.hours !== null && <ResponsiveListItem label="Credit hours: " value={record.hours.toString()} divider={true} />}
      <ResponsiveListItem label="Audience: " value={record.audience} divider={true} />
      {record.phone && <ResponsiveListItem label="Phone Number:" value={(<a href={`tel:+1${record.phone.replace(/-/g, '')}`}>{record.phone}</a>) as ReactNode} divider={true} />}
      <ResponsiveListItem label="Address: " value={record.address.city + ', ' + record.address.state + ' ' + record.address.street + ', ' + record.address.zip} divider={true} />
      <ResponsiveListItem label="Has DEQ Exam: " value={record.deq_exam ? 'Yes' : 'No'} divider={true} />
      {record.exam_datetime && <ResponsiveListItem label="Exam Date: " value={formatedExamDate} divider={false} />}

      <Accordion expanded={showNotes}>
        <AccordionSummary onClick={toggleNotes}>
          <Typography variant="h5"><Button>View Class Notes</Button></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{record.private_notes}</Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

export default EventShowInformation
