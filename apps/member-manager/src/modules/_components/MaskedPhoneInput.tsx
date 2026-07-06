import React from 'react'
import {TextInput, TextInputProps} from 'react-admin'

const CustomPhoneInput =  (props : TextInputProps ) => {
  const transformInput = (value : string) => {
    if (value === null || value === undefined) {
      return ''
    }
    value = value.slice(0, 14)
    value = value.replace(/[^\d]/g, '')
    const formattedValue = value.replace(/(\d{3})(\d{3})?(\d{0,4})?/, (_, p1, p2, p3) => {
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
  return (
    <TextInput {...props} format={transformInput} />
  )
}

export default CustomPhoneInput
