import { HexColorPicker } from 'react-colorful'
import React from 'react'
import { Typography } from '@mui/material'
interface ColorPickerProps {
  setColor: React.Dispatch<React.SetStateAction<string>>
  color?: string
}
export interface ColorProps {
  hex: string | undefined
  rgb: {
    r: number
    g: number
    b: number
  }
  hsl: {
    h: number
    s: number
    l: number
  }
}
const ColorWheel = ({ setColor, color }: ColorPickerProps) => {
  return (
    <>
      <Typography variant="h6">Choose a Color</Typography>
      <HexColorPicker style={{
        width: '100%',
      }} color={color} onChange={setColor} />
    </>
  )
}

export default ColorWheel
