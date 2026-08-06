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
  | "system"
  | "physical_address"
  | "mailing_address"
  | "contacts"
  | "additional_contacts"
  | "funding"
  | "projects"
  | "status"
  | "other"
  | "signature";

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

type ValidationHighlightProps = {
  field: ValidationField;
  children: ReactNode;
  className?: string;
  clearWhen?: boolean;
};

export function ValidationHighlight({
  field,
  children,
  className = "",
  clearWhen,
}: ValidationHighlightProps) {
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

export function mapFormErrorsToValidationFields(
  errors: FieldErrors
): ValidationField[] {
  const fields = new Set<ValidationField>();
  const paths = flattenErrorPaths(errors);

  for (const path of paths) {
    if (
      path.startsWith("legal_entity") ||
      path.startsWith("facility_id") ||
      path.startsWith("population") ||
      path === "county"
    ) {
      fields.add("system");
    } else if (path.startsWith("physical_address")) {
      fields.add("physical_address");
    } else if (path.startsWith("mailing_address")) {
      fields.add("mailing_address");
    } else if (
      path.startsWith("point_of_contact") ||
      path.startsWith("chairman") ||
      path.startsWith("engineer") ||
      path === "has_engineer"
    ) {
      fields.add("contacts");
    } else if (path.startsWith("additional_contacts")) {
      fields.add("additional_contacts");
    } else if (
      path.startsWith("drinking_or_wastewater") ||
      path.startsWith("selected_projects") ||
      path.startsWith("other_project")
    ) {
      fields.add("funding");
    } else if (
      path.startsWith("project_") ||
      path.startsWith("total_project") ||
      path.startsWith("additional_funding") ||
      path.startsWith("proposals") ||
      path.startsWith("bid") ||
      path.startsWith("description_justification") ||
      path.startsWith("combined_cost") ||
      path.startsWith("requested_grant") ||
      path.startsWith("minimum_utility")
    ) {
      fields.add("projects");
    } else if (
      path.startsWith("engineering") ||
      path.startsWith("violation") ||
      path.startsWith("consent") ||
      path.startsWith("compliance") ||
      path.startsWith("status")
    ) {
      fields.add("status");
    } else if (path.startsWith("other_") || path.startsWith("extra_")) {
      fields.add("other");
    } else if (
      path === "certify" ||
      path.startsWith("signatory") ||
      path.startsWith("signature")
    ) {
      fields.add("signature");
    }
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
