import React from 'react'
import {
  Show,
  SimpleShowLayout,
  useShowController,
  ReferenceField,
  RaRecord,
  TextField,
  ReferenceArrayField,
  SingleFieldList,
  Loading,
  ImageField,
  ChipField,
} from 'react-admin'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import {Box, Card, Grid} from "@mui/material"
import { ReactNode } from 'react'
import { SxProps } from '@mui/material/styles'
import ActivityFeed from '../activity/ActivityFeed'
import StaffAssignList from './components/StaffAssignList'
import SubAssetAssignList from './components/SubAssetAssignList'
import CustomSecondaryHeader from '../_components/CustomSecondaryHeader'


const labelStyle = {
  fontWeight: 'bold',
  marginRight: '5px',
  whiteSpace: 'nowrap',
}

interface ResponsiveListItemProps {
  label: string
  value: string | ReactNode
  sx?: SxProps
  divider?: boolean
}

const ResponsiveListItem = ({ label, value, sx = {}, divider = false }: ResponsiveListItemProps) => {

  const listStyle = { ...sx, justifyContent: 'space-between' }

  const fieldStyle = {}

  return (
    <ListItem divider={divider as boolean} sx={listStyle}>
      <Box component='label' sx={labelStyle}>{label}</Box>
      {typeof value === 'string' ? (
        <span style={fieldStyle}>{value}</span>
      ) : typeof value === 'object' ? (
        value as ReactNode
      ) : null}
    </ListItem>
  )
}
const AssetShow = () => {

  const { record, isLoading } = useShowController()

  if (typeof record === 'undefined' || !record) return null
  return isLoading ? <Loading /> : (
    <Show component="div" title={'Assets'} sx={{ p: 0 }}>
      <SimpleShowLayout sx={{ p: 0 }}>
        <Grid container spacing={1} sx={{ alignItems: 'stretch' }} justifyItems={'stretch'} alignSelf={'stretch'}>
          <Grid xs={12} md={6} lg={6} sm={12} sx={{maxHeight:65, alignItems: 'stretch' }} justifyItems={'stretch'} alignSelf={'stretch'}>
            <CustomSecondaryHeader title={record.name} />
            <Card >
              <List sx={{ pb: 0 }}>
                <ResponsiveListItem label="Category:" value={record.category} divider={true} />
                <ResponsiveListItem label="Make:" value={record.make} divider={true} />
                <ResponsiveListItem label="Model:" value={record.model} divider={true} />
                <ResponsiveListItem label="Tangible:" value={record.tangible ? 'Yes' : 'No'} divider={true} />
                <ResponsiveListItem label="Organization:" value={record.organization} divider={true} />
                <ResponsiveListItem label="Location:" value={record.location} divider={true} />
                <ResponsiveListItem label="Serial Number:" value={record.serial_number} divider={true} />
                {record.fair_market_value && <ResponsiveListItem label="Market Value:" value={'$' + record.fair_market_value.toLocaleString()} divider={true} />}
                {record.description > 0 && <ResponsiveListItem label="Meters:" value={record.description} divider={false} />}
                <ResponsiveListItem label="Assigned To:" value={
                  <ReferenceField reference="staff" source="assigned_to" link={(record: RaRecord) => `/staff/${record.id}/show`}>
                    <ReferenceField reference="contacts" source="contact" link={false}>
                      <><TextField source="first" /> <TextField source="last" /></>
                    </ReferenceField>
                  </ReferenceField>
                } divider={true} />
                <ResponsiveListItem label="Sub Assets:" value={<ReferenceArrayField
                  source="sub_assets"
                  label="Assets"
                  reference="Assets"
                >
                  <SingleFieldList linkType={false}>
                    <ReferenceField
                      source="id"
                      link={(record: RaRecord) => `/assets/${record.id}/show`}
                      reference="Assets"
                    >
                      <ChipField source="name" />
                    </ReferenceField>
                  </SingleFieldList>
                </ReferenceArrayField>} divider={true} />
                <Box display={'flex'} justifyContent={'flex-end'}>
                  <ReferenceArrayField reference="upload/files" source="images" queryOptions={{meta: { image: true}}}>
                    <SingleFieldList linkType={false}>
                      <ImageField source="url" title="title" sx={{ '& img.RaImageField-image': { width: 'auto', height: 150, m: 2  } }} />
                    </SingleFieldList>
                  </ReferenceArrayField>
                </Box>
              </List>
            </Card>
          </Grid>
          <Grid xs={12} md={6} lg={6} sm={12} sx={{maxHeight:65, alignItems: 'stretch' }} justifyItems={'stretch'} alignSelf={'stretch'}>
            <ActivityFeed 
              headerSx={{
                padding: .5,
                marginLeft: -1,
                flexGrow: 1,
              }} 
              title=' ' 
              variant='h6' 
              sx={{ width: '100%' }} 
              entity="asset" 
              entity_id={record.id} 
            />
          </Grid>
          <Grid mt={2} xs={12} md={6} lg={6} sm={12} sx={{ alignItems: 'stretch' }} justifyItems={'stretch'} alignSelf={'stretch'}>
            <StaffAssignList />
          </Grid>
          <Grid mt={2} xs={12} md={6} lg={6} sm={12} sx={{ alignItems: 'stretch' }} justifyItems={'stretch'} alignSelf={'stretch'}>
            <SubAssetAssignList />
          </Grid>
        </Grid>
      </SimpleShowLayout>
    </Show>
  )
}

export default AssetShow