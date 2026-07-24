import { Box, Button, Grid } from '@mui/material'
import React from 'react'
import { SaveButton, useGetRecordId, useNotify, useRefresh, useResetStore } from 'react-admin'
import authProvider from '../../../authProvider'

interface CustomToolBarProps {
    onEdit?: (data: FormData) => void
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
}
const CustomToolBar = ({ onEdit, setIsEditing }: CustomToolBarProps) => {

  const id = useGetRecordId()
  const notify = useNotify()

  const reset = useResetStore()
  const refresh = useRefresh()

  const removeRegistration = async () => {
    const identity = await authProvider.getIdentity?.()

    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/remove-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${identity?.token}`,
        },
        body: JSON.stringify({
          registrationId: id,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()

      if (responseData.result === 'success') {
        notify('Registration Removed!', { type: 'success' })
        setIsEditing(false)
        reset()
        refresh()
      } else {
        notify('Error Removing Registration', { type: 'error' })
        setIsEditing(false)
      }

    } catch (error) {
      console.error('Error:', error)
      notify('Error Removing Registration', { type: 'error' })
      setIsEditing(false)
    }
  }

  return (
    <>
      <Box display="flex" alignContent={'center'} sx={{ backgroundColor: 'background.default', padding: 2 }}>
        <Grid container spacing={2}>
          {/* Draft Button */}
          <Grid item>
            {onEdit && <SaveButton alwaysEnable onSubmit={() => onEdit} />}
            {!onEdit && <SaveButton alwaysEnable />}
          </Grid>
          {/* Delete Button */}
          <Grid item sx={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Button color='error' onClick={() => removeRegistration()}>Remove Registration</Button>
            <span>This will remove all data attached to the registration</span>
          </Grid>
        </Grid>
      </Box>
    </>

  )
}


export default CustomToolBar
