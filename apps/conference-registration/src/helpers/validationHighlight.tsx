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

/** Stable keys for step sections that can be highlighted on validation failure. */
export type ValidationField =
  | "registration_type"
  | "booths"
  | "member_status"
  | "agency"
  | "vendor_acknowledgement"
  | "attendees"
  | "vendors"
  | "contestants"
  | "contestant_already_registered"
  | "previous_registration_id"
  | "organization"
  | "sponsor_details"
  | "billing"
  | "contact";

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

/** Light red fill + thick red rectangle (small radius) around invalid areas. */
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
  /** When true, clears this field's highlight (user fixed the issue). */
  clearWhen?: boolean;
};

/**
 * Wraps a field/section and applies the shared invalid highlight styles when
 * StepNavigation (or another caller) marks `field` as invalid.
 */
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

/** Map react-hook-form error paths to highlight field keys. */
export function mapFormErrorsToValidationFields(
  errors: FieldErrors
): ValidationField[] {
  const fields = new Set<ValidationField>();
  const paths = flattenErrorPaths(errors);

  for (const path of paths) {
    if (path === "registration_type" || path.startsWith("registration_type.")) {
      fields.add("registration_type");
    } else if (path === "member_status") {
      fields.add("member_status");
    } else if (path === "agency") {
      fields.add("agency");
    } else if (path === "vendor_participation_acknowledgement") {
      fields.add("vendor_acknowledgement");
    } else if (path === "previous_registration_id") {
      fields.add("previous_registration_id");
    } else if (path === "organization" || path.startsWith("organization.")) {
      fields.add("organization");
    } else if (path === "logo" || path.startsWith("logo.")) {
      fields.add("sponsor_details");
    } else if (path.startsWith("registrant.")) {
      fields.add("contact");
    } else if (
      path.startsWith("paymentData.") ||
      path === "paymentType" ||
      path === "billing_address" ||
      path.startsWith("billing")
    ) {
      fields.add("billing");
    } else if (path === "booths" || path.startsWith("booths.")) {
      fields.add("booths");
    } else if (path === "tickets" || path.startsWith("tickets.")) {
      fields.add("attendees");
    } else if (
      path === "registrationAddonIds" ||
      path.startsWith("registrationAddonIds.")
    ) {
      fields.add("contestants");
    }
  }

  return [...fields];
}

export function collectFormErrorMessages(errors: FieldErrors): string[] {
  const messages: string[] = [];
  const walk = (node: FieldErrors | FieldErrors[string]) => {
    if (!node || typeof node !== "object") return;
    if (
      "message" in node &&
      typeof (node as { message?: unknown }).message === "string"
    ) {
      messages.push((node as { message: string }).message);
      return;
    }
    Object.values(node as FieldErrors).forEach((child) => {
      if (child) walk(child as FieldErrors);
    });
  };
  walk(errors);
  return messages;
}

function flattenErrorPaths(
  errors: FieldErrors,
  prefix = ""
): string[] {
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
