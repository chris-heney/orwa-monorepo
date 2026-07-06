import { TextInput } from "mj-react-form-builder";

/** Same digit formatting as `MaskedPhoneInput` (10-digit NANP), labeled for fax. */
const transformFaxInput = (value: string) => {
  let digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  if (digits.length > 10) digits = digits.slice(0, 10);
  return digits.replace(/(\d{3})(\d{3})?(\d{0,4})?/, (_, p1: string, p2?: string, p3?: string) => {
    let result = `(${p1}`;
    if (p2) result += `) ${p2}`;
    if (p3) result += `-${p3}`;
    return result;
  });
};

export const MaskedFaxInput = ({
  source,
  required,
}: {
  source: string;
  required?: boolean;
}) => (
  <TextInput
    label="Fax"
    transformInput={transformFaxInput}
    source={source}
    required={required}
    maxLength={14}
    type="tel"
  />
);
