import React, { useState } from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useDataProvider } from 'react-admin'

interface CustomSelectInputProps {
  items: { value: string | number; label: React.ReactNode }[]
  setFilter: React.Dispatch<React.SetStateAction<object>>
  type: string
  label: string
}

const CustomSelectInputActivityFeed: React.FC<CustomSelectInputProps> = ({ items, setFilter, type, label }) => {
  const [selectedItem, setSelectedItem] = useState<string | number>()
  const dataProvider = useDataProvider()
  const handleChange = async (event: SelectChangeEvent) => {
    const value = event.target.value
    setSelectedItem(value)
  
    try {
      const { data } = await dataProvider.getList('activity-relations', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'id', order: 'ASC' },
        filter: {[type]: value},
      })
      
      const hasActivities = Array.isArray(data) && data.length > 0
  
      // console.log('Has Activities?', hasActivities)
  
      if (hasActivities) {setFilter((prevFilter) => ({
        ...prevFilter,
        [type]: value ,
      }))
      } else {
        if (value !== ' ') {
          alert('No Activities Found')
        }
        setFilter(undefined)
      }

    } catch (error) {
      console.error('Error fetching activity data:', error)
    }
  }


  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl sx={{ backgroundColor: 'black'}} fullWidth>
        <InputLabel id="custom-select-label">{label}</InputLabel>
        <Select
          labelId="custom-select-label"
          id="custom-select"
          value={selectedItem?.toString()}
          label={label}
          onChange={handleChange}
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
            PaperProps: {
              style: {
                maxHeight: 200, // Adjust the maxHeight to limit the number of items displayed
              },
            },
          }}
        >
          {items.map((item, index) => (
            <MenuItem key={index} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default CustomSelectInputActivityFeed
