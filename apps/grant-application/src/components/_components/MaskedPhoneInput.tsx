import React from 'react';
import { TextInput } from './TextInput';

interface MaskedPhoneInputProps {
  source: string;
}

const MaskedPhoneInput: React.FC<MaskedPhoneInputProps> = ({ source }) => {
  const transformPhoneInput = (value: string) => {
    value = value.replace(/[^\d]/g, ''); // Remove non-digit characters
    const formattedValue = value.replace(
      /(\d{3})(\d{3})?(\d{0,4})?/,
      (_, p1, p2, p3) => {
        let result = `(${p1}`;
        if (p2) {
          result += `) ${p2}`;
        }
        if (p3) {
          result += `-${p3}`;
        }
        return result;
      }
    );
    return formattedValue;
  };

  return (
    <TextInput
      label="Phone"
      transformInput={transformPhoneInput}
      name={source}
      required
      maxLength={14}
    />
  );
};

export default MaskedPhoneInput;