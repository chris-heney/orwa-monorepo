import React from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Chip from '@mui/material/Chip'
import { useInput, InputProps } from 'react-admin'

const SUGGESTIONS = [
  'Global',
  'All Conferences',
  'ORWA Conference ID #1',
  'ORWA Conference ID #2',
  'ORWA Conference ID #3',
]

type Props = Omit<InputProps, 'source'> & {
  source?: string
}

/** Chip-style free-text identifier tags (Enter / Tab / blur to add). */
const IdentifiersInput = ({
  source = 'identifiers',
  label = 'Identifiers',
  helperText = 'Press Enter or Tab to add a tag (e.g. Global, All Conferences, ORWA Conference ID #1)',
  ...rest
}: Props) => {
  const { field, fieldState } = useInput({ source, defaultValue: [], ...rest })

  const value: string[] = Array.isArray(field.value) ? field.value.map(String) : []

  return (
    <Autocomplete
      multiple
      freeSolo
      options={SUGGESTIONS}
      value={value}
      onChange={(_e, next) => {
        field.onChange(next.map(String).filter(Boolean))
      }}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            key={`${option}-${index}`}
            label={option}
            size="small"
            sx={{
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.12)'
                  : undefined,
              color: 'text.primary',
            }}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          helperText={fieldState.error?.message || helperText}
          error={!!fieldState.error}
          fullWidth
          margin="dense"
          onKeyDown={(e) => {
            if (e.key === 'Tab' && (e.target as HTMLInputElement).value) {
              e.preventDefault()
              const next = (e.target as HTMLInputElement).value.trim()
              if (next && !value.includes(next)) {
                field.onChange([...value, next])
              }
              ;(e.target as HTMLInputElement).value = ''
            }
          }}
        />
      )}
    />
  )
}

export default IdentifiersInput
