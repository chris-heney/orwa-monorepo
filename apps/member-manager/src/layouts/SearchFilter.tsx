import React from 'react'

import { useForm, FormProvider } from 'react-hook-form'
import { Box, Button, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { TextInput, useListContext } from 'react-admin'

const SearchFilter = () => {
  const { displayedFilters, filterValues, setFilters, hideFilter } = useListContext()

  const form = useForm({
    defaultValues: filterValues,
  })

  if (!displayedFilters.q) return null

  const onSubmit = (values: string) => {
    if (Object.keys(values).length > 0) {
      setFilters(values, displayedFilters)
    } else {
      hideFilter('q')
    }
  }

  const resetFilter = () => {
    setFilters({}, [])
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Box display="flex" alignItems="flex-end" mb={1}>
          <Box component="span" mr={2}>
            {/* Full-text search filter. We don't use <SearchFilter> to force a large form input */}
            <TextInput
              resettable
              helperText={false}
              source="q"
              label="Search"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="disabled" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box component="span" mr={2} mb={1.5}>
            <Button variant="outlined" color="primary" type="submit">
							Filter
            </Button>
          </Box>
          <Box component="span" mb={1.5}>
            <Button variant="outlined" onClick={resetFilter}>
							Close
            </Button>
          </Box>
        </Box>
      </form>
    </FormProvider>
  )
}

export default SearchFilter