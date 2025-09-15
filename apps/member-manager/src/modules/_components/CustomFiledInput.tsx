import React, { useRef, useState } from 'react'
import { Button, Typography, Box } from '@mui/material'

interface FileInputProps {
  id: string;
  label: string;
  onChange: (file: File) => void;
}

const CustomFileInput: React.FC<FileInputProps> = ({ id, label, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [filePreview, setFilePreview] = useState<string | undefined>()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      onChange(files[0])
      // Display image preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string)
      }
      reader.readAsDataURL(files[0])
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <Box display="flex" alignItems="center">
      <input type="file" id={id} ref={inputRef} style={{ display: 'none' }} onChange={handleFileChange} />
      <label htmlFor={id}>
        <Button variant="contained" component="span" onClick={handleClick}>
          {label}
        </Button>
      </label>
      {filePreview && (
        <img src={filePreview} alt="File Preview" style={{ maxWidth: '100px', maxHeight: '100px', marginLeft: '8px' }} />
        
      )}
      <Typography variant="body1" display="inline" marginLeft={1}>
        {inputRef.current?.files?.[0]?.name || 'No file chosen'}
      </Typography>
    </Box>
  )
}

export default CustomFileInput
