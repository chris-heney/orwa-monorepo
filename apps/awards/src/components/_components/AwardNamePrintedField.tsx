import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { TextInput } from "./TextInput";
import {
  AWARD_NAME_PRINTED_HELPER,
  awardNamePrintedLabel,
  isSystemOfTheYearAward,
} from "../../helpers/awardType";

const PRINTED_DIRTY_KEY = "_award_name_printed_dirty";

/**
 * Single RHF field `award_name_printed`. Visible on System (SOTY) or Nominee
 * (other types). Auto-fills from system_name / nominee_name until the user edits it.
 */
const AwardNamePrintedField: React.FC<{ visible: boolean }> = ({ visible }) => {
  const { watch, setValue, getValues } = useFormContext();
  const awardType = watch("award_type");
  const systemName = watch("system_name");
  const nomineeName = watch("nominee_name");
  const isSoty = isSystemOfTheYearAward(awardType);
  const source = isSoty ? systemName : nomineeName;
  const prevSourceRef = useRef<string | undefined>(undefined);
  const prevTypeRef = useRef(awardType);

  useEffect(() => {
    const typeChanged = prevTypeRef.current !== awardType;
    prevTypeRef.current = awardType;
    if (typeChanged) {
      setValue(PRINTED_DIRTY_KEY, false, { shouldDirty: false });
    }

    const dirty = Boolean(getValues(PRINTED_DIRTY_KEY));
    const printed = String(getValues("award_name_printed") || "");
    const next = String(source || "");
    const prevSource = prevSourceRef.current;
    prevSourceRef.current = next;

    if (typeChanged || !dirty || printed === "" || printed === prevSource) {
      if (printed !== next) {
        setValue("award_name_printed", next, {
          shouldDirty: false,
          shouldValidate: false,
        });
      }
    }
  }, [awardType, source, getValues, setValue]);

  const markDirty = (value: string) => {
    const next = String(source || "");
    setValue(PRINTED_DIRTY_KEY, value !== next, { shouldDirty: false });
  };

  if (!visible) {
    return (
      <input
        type="hidden"
        name="award_name_printed"
        value={String(watch("award_name_printed") || "")}
        readOnly
      />
    );
  }

  return (
    <TextInput
      label={awardNamePrintedLabel(awardType)}
      name="award_name_printed"
      required
      placeholder={
        isSoty ? "Enter system name as it should appear" : "Enter nominee's full name"
      }
      helperText={AWARD_NAME_PRINTED_HELPER}
      onValueChange={markDirty}
    />
  );
};

export default AwardNamePrintedField;
