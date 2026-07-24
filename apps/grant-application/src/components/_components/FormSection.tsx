import type { ReactNode } from "react";

const FormSection = ({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <section
      className={`mb-6 rounded-lg border border-slate-200 bg-white p-5 text-left ${className}`}
    >
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      {description && (
        <p className="mb-4 text-xs leading-relaxed text-slate-500">
          {description}
        </p>
      )}
      {!description && <div className="mb-4" />}
      {children}
    </section>
  );
};

export default FormSection;
