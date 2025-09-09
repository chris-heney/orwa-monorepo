import { ChangeEvent } from 'react'
import { TextField, TextFieldProps } from '@mui/material'



interface TextInputProps extends Omit<TextFieldProps, 'onChange'> {
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const MaskedCardInput = ({ label, value, onChange, ...rest }: TextInputProps) => {
    const transformInput = (value: string) => {
        if (value === null || value === undefined) {
            return ''
        }
        value = value.slice(0, 14)
        value = value.replace(/[^\d]/g, '')
        const formattedValue = value.replace(/(\d{4})(\d{4})(\d{4})?/, (_, p1, p2, p3) => {
            let result = `(${p1}`
            if (p2) {
                result += `) ${p2}`
            }
            if (p3) {
                result += `-${p3}`
            }
            return result
        })

        return formattedValue
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const transformedValue = transformInput(event.target.value);
        const newEvent = {
            ...event,
            target: {
                ...event.target,
                value: transformedValue
            }
        }
        onChange(newEvent)
      }

    return (
        <TextField
            value={value}
            label={label}
            fullWidth
            onChange={handleChange}
            {...rest}
        />
    )
}

export default MaskedCardInput
