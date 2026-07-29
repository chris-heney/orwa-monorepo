import React from "react";
import {
  ReferenceArrayField,
  ReferenceArrayFieldProps,
  RecordContextProvider,
  useRecordContext,
} from "react-admin";
import { normalizeRecordArrays } from "../helpers/normalizeRecordArrays";

/**
 * Drop-in replacement for react-admin's `ReferenceArrayField` that guards
 * against Strapi 5 returning `null`/`undefined` for empty manyToMany
 * relations instead of `[]`. Without this, `ReferenceArrayField` logs
 * "Value of field '<source>' is not an array." on every render, which for
 * rows on a Datagrid that's rendered alongside an open inline edit form
 * (e.g. Extras/Addons/Tickets) can flood the console and contribute to the
 * form jittering / losing focus.
 */
const SafeReferenceArrayField = ({
  source,
  ...props
}: ReferenceArrayFieldProps) => {
  const record = useRecordContext();
  const normalizedRecord = normalizeRecordArrays(record, [source as string]);

  return (
    <RecordContextProvider value={normalizedRecord}>
      <ReferenceArrayField source={source} {...props} />
    </RecordContextProvider>
  );
};

export default SafeReferenceArrayField;
