import type { ReactNode } from "react";

/** Consistent page chrome for grant wizard steps. */
const StepShell = ({
  title,
  description,
  children,
  aside,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
}) => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 text-left">
      <header className="mb-6 border-b border-slate-200 pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h2>
            {description && (
              <div className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                {description}
              </div>
            )}
          </div>
          {aside}
        </div>
      </header>
      {children}
    </div>
  );
};

export default StepShell;
