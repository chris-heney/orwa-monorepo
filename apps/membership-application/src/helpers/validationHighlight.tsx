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

/**
 * Shared validation-highlight treatment ported from grant-application:
 * failed sections get a bold red rounded outline + light red wash and are
 * scrolled into view, alongside the red toast.
 */
export type ValidationField = "membership_packages" | "directory_contacts";

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
