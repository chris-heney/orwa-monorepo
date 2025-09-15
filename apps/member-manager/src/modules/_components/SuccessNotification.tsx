import React, { useEffect } from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

interface CustomizedSnackbarsProps {
  notification: boolean
  text: string
  setSendNotification: React.Dispatch<React.SetStateAction<boolean>>
  duration?: number
  severity?: 'success' | 'info' | 'warning' | 'error' | undefined
}


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})
const SuccessNotification: React.FC<CustomizedSnackbarsProps> = ({ notification = false, text, setSendNotification, duration = 3000, severity = 'success', }) => {
  const [open, setOpen] = React.useState(notification)
  const onClose = () => {
    setSendNotification(false)
    setOpen(false)
  }
  useEffect(() => {
    setOpen(notification)
  }, [notification])
  return (
    <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={open} autoHideDuration={duration} onClose={() => onClose()}>
      <Alert onClose={() => onClose()} severity={severity} sx={{ width: '100%' }}>
        {text}
      </Alert>
    </Snackbar>
  )
}

export default SuccessNotification
