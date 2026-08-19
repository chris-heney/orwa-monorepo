import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import type { FieldErrors } from "react-hook-form";

export type ValidationField =
  | "nominee_name"
  | "award_type"
  | "email"
  | "daytime_phone"
  | "address"
  | "city"
  | "state"
  | "zip"
  | "award_year"
  | "system_name"
  | "award_name_printed"
  | "watersystem"
  | "nominator_first_name"
  | "nominator_last_name"
  | "nominator_address"
  | "nominator_address_2"
  | "nominator_city"
  | "nominator_state"
  | "nominator_zip"
  | "nominator_country"
  | "nominator_phone"
  | "nominator_email"
  | "justification"
  | "biography_method"
  | "biography_text"
  | "biography_file"
  | "photographs"
  | "board_list_method"
  | "board_list_file"
  | "board_members"
  | "beginning_members"
  | "current_members"
  | "operation_start_date"
  | "employment_date"
  | "clerical_employees"
  | "operation_maintenance_employees"
  | "management_employees"
  | "supporting_documents";

type ValidationHighlightContextValue = {
  invalidFields: ReadonlySet<ValidationField>;
  showInvalid: (...fields: ValidationField[]) => void;
  clearInvalid: (...fields: ValidationField[]) => void;
  clearAllInvalid: () => void;
  isInvalid: (field: ValidationField) => boolean;
};

const ValidationHighlightContext =
  createContext<ValidationHighlightContextValue | null>(null);

const noopContext: ValidationHighlightContextValue = {
  invalidFields: new Set(),
  showInvalid: () => {},
  clearInvalid: () => {},
  clearAllInvalid: () => {},
  isInvalid: () => false,
};

export const validationHighlightClassName =
  "rounded-md border-[3px] border-red-500 bg-red-50 shadow-[0_0_0_2px_rgba(239,68,68,0.25)]";

export function ValidationHighlightProvider({
  children,
  clearOn,
}: PropsWithChildren<{ clearOn?: unknown }>) {
  const [invalidFields, setInvalidFields] = useState<Set<ValidationField>>(
    () => new Set()
  );

  useEffect(() => {
    setInvalidFields(new Set());
  }, [clearOn]);

  const showInvalid = useCallback((...fields: ValidationField[]) => {
    if (fields.length === 0) return;
    setInvalidFields((prev) => {
      const next = new Set(prev);
      fields.forEach((field) => next.add(field));
      return next;
    });
    requestAnimationFrame(() => {
      const el = document.querySelector(
        `[data-validation-field="${fields[0]}"]`
      );
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, []);

  const clearInvalid = useCallback((...fields: ValidationField[]) => {
    if (fields.length === 0) return;
    setInvalidFields((prev) => {
      const next = new Set(prev);
      let changed = false;
      fields.forEach((field) => {
        if (next.delete(field)) changed = true;
      });
      return changed ? next : prev;
    });
  }, []);

  const clearAllInvalid = useCallback(() => {
    setInvalidFields(new Set());
  }, []);

  const isInvalid = useCallback(
    (field: ValidationField) => invalidFields.has(field),
    [invalidFields]
  );

  const value = useMemo(
    () => ({
      invalidFields,
      showInvalid,
      clearInvalid,
      clearAllInvalid,
      isInvalid,
    }),
    [invalidFields, showInvalid, clearInvalid, clearAllInvalid, isInvalid]
  );

  return (
    <ValidationHighlightContext.Provider value={value}>
      {children}
    </ValidationHighlightContext.Provider>
  );
}

export function useValidationHighlight() {
  return useContext(ValidationHighlightContext) ?? noopContext;
}

export function ValidationHighlight({
  field,
  children,
  className = "",
  clearWhen,
}: {
  field: ValidationField;
  children: ReactNode;
  className?: string;
  clearWhen?: boolean;
}) {
  const { isInvalid, clearInvalid } = useValidationHighlight();
  const invalid = isInvalid(field);

  useEffect(() => {
    if (invalid && clearWhen) {
      clearInvalid(field);
    }
  }, [invalid, clearWhen, field, clearInvalid]);

  return (
    <div
      data-validation-field={field}
      className={[className, invalid ? validationHighlightClassName : ""]
        .filter(Boolean)
        .join(" ")}
      aria-invalid={invalid || undefined}
    >
      {children}
    </div>
  );
}

const KNOWN_FIELDS: ValidationField[] = [
  "nominee_name",
  "award_type",
  "email",
  "daytime_phone",
  "address",
  "city",
  "state",
  "zip",
  "award_year",
  "system_name",
  "award_name_printed",
  "watersystem",
  "nominator_first_name",
  "nominator_last_name",
  "nominator_address",
  "nominator_address_2",
  "nominator_city",
  "nominator_state",
  "nominator_zip",
  "nominator_country",
  "nominator_phone",
  "nominator_email",
  "justification",
  "biography_method",
  "biography_text",
  "biography_file",
  "photographs",
  "board_list_method",
  "board_list_file",
  "board_members",
  "beginning_members",
  "current_members",
  "operation_start_date",
  "employment_date",
  "clerical_employees",
  "operation_maintenance_employees",
  "management_employees",
  "supporting_documents",
];

export function resolveValidationField(name: string): ValidationField | null {
  const root = name.split(".")[0];
  return KNOWN_FIELDS.includes(root as ValidationField)
    ? (root as ValidationField)
    : null;
}

export function HighlightByName({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  const field = resolveValidationField(name);
  if (!field) return children;
  return <ValidationHighlight field={field}>{children}</ValidationHighlight>;
}

export function mapFormErrorsToValidationFields(
  errors: FieldErrors
): ValidationField[] {
  const fields = new Set<ValidationField>();
  const paths = flattenErrorPaths(errors);
  for (const path of paths) {
    const match = KNOWN_FIELDS.find(
      (field) => path === field || path.startsWith(`${field}.`)
    );
    if (match) fields.add(match);
  }
  return [...fields];
}

function flattenErrorPaths(errors: FieldErrors, prefix = ""): string[] {
  const paths: string[] = [];
  for (const [key, value] of Object.entries(errors)) {
    if (!value) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (
      typeof value === "object" &&
      value !== null &&
      "message" in value &&
      (value as { message?: unknown }).message != null
    ) {
      paths.push(path);
    } else if (typeof value === "object") {
      paths.push(...flattenErrorPaths(value as FieldErrors, path));
    }
  }
  return paths;
}
