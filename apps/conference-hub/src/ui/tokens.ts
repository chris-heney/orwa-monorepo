/** Shared visual language for conference-hub (aligned with conference-registration). */

export const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const ui = {
  page: "min-h-screen bg-slate-50 text-slate-800",
  container: "mx-auto w-full max-w-6xl px-4",
  panel:
    "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm",
  panelBody: "p-4 text-left",
  panelScroll: "overflow-y-auto md:max-h-well",
  titleBar:
    "sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-900 px-4 py-3 text-left text-sm font-semibold tracking-wide text-white",
  rowEven: "bg-white",
  rowOdd: "bg-slate-50",
  row: "border-b border-slate-100 px-4 py-3 last:border-b-0",
  btnPrimary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  btnSecondary:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  btnCta:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
  link: "font-medium text-blue-600 hover:text-blue-700 hover:underline",
  muted: "text-sm text-slate-500",
  heading: "text-lg font-semibold text-slate-900",
  subheading: "text-sm font-medium text-slate-500",
  input:
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30",
  label: "mb-1 block text-left text-sm font-medium text-slate-700",
  navShell:
    "flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm",
  navItem:
    "cursor-pointer rounded-lg px-3.5 py-2 text-sm font-medium transition",
  /** Idle tabs only — do not combine with active/CTA or hover bg fights white text. */
  navItemIdle: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  navItemActive:
    "bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:text-white",
  navItemCta:
    "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 hover:text-white",
  statCard:
    "rounded-xl border border-slate-200 bg-white px-4 py-5 text-left shadow-sm sm:p-6",
  countdownShell:
    "w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm",
  countdownUnit:
    "min-w-[4.25rem] rounded-lg bg-slate-900 px-3 py-2.5 text-white sm:min-w-[4.75rem]",
  empty: "py-8 text-center text-sm font-medium text-slate-500",
} as const;

export const zebraRow = (index: number) =>
  cx(ui.row, index % 2 === 0 ? ui.rowEven : ui.rowOdd);
