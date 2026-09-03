import { useEffect, useMemo, useState } from "react";
import { useGetAwardTypes, useGetAwardWinners } from "../data/API";
import { nominatableAwardTypes } from "../helpers/awardTypeOptions";
import { isSystemOfTheYearAward } from "../helpers/awardType";
import { useNotify } from "../NotificationProvider";
import {
  AWARD_CATEGORIES,
  CONTACT,
  NOMINATION_DEADLINE,
  READINESS_CHECKLIST,
  groupWinnersByYear,
  type AwardWinner,
  type AwardWinnerRecord,
  type AwardYear,
} from "../data/awardWinners";
import {
  AwardIcon,
  FileAltIcon,
  InfoCircleIcon,
  ListUlIcon,
  MousePointerIcon,
  PortraitIcon,
  UserIcon,
  UsersIcon,
} from "./AwardIcons";

type LandingViewProps = {
  onStartNomination: () => void;
};

/** orwa.org's dual-colour header: uppercase, stacked, brand blue, icon beneath. */
const DualHeader = ({
  lead,
  rest,
  icon,
}: {
  lead: string;
  rest: string;
  icon: "award" | "info";
}) => {
  const Icon = icon === "award" ? AwardIcon : InfoCircleIcon;
  return (
    <div className="text-center">
      <h2 className="m-0 text-4xl font-extrabold uppercase leading-[1.1] tracking-tight text-orwa md:text-5xl">
        <span className="block">{lead}</span>
        <span className="block">{rest}</span>
      </h2>
      <Icon className="mx-auto mt-5 h-16 w-16 text-orwa" />
    </div>
  );
};

const SectionHeading = ({ children }: { children: string }) => (
  <h3 className="m-0 mt-10 text-center text-2xl font-extrabold tracking-tight text-slate-900">
    {children}
  </h3>
);

const IconBox = ({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof UserIcon;
  title: string;
  children?: React.ReactNode;
}) => (
  <div className="text-center">
    <Icon className="mx-auto h-12 w-12 text-orwa" />
    <h4 className="m-0 mt-3 text-2xl font-bold text-slate-900">{title}</h4>
    {children ? (
      <div className="mt-3 text-base leading-relaxed text-slate-700">
        {children}
      </div>
    ) : null}
  </div>
);

const Lightbox = ({
  winner,
  onClose,
}: {
  winner: AwardWinner;
  onClose: () => void;
}) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={winner.title}
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/85 p-4"
    >
      <img
        src={winner.full}
        alt={`${winner.title}${winner.recipient ? ` — ${winner.recipient}` : ""}`}
        className="max-h-[75vh] max-w-full rounded object-contain shadow-2xl"
      />
      <div className="text-center text-white">
        <p className="m-0 text-lg font-semibold">{winner.title}</p>
        {winner.recipient && (
          <p className="m-0 mt-1 text-sm text-blue-200">{winner.recipient}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        Close
      </button>
    </div>
  );
};

/**
 * Matches the Elementor gallery: 3:2 tiles whose caption overlay fades in on
 * hover. Touch devices get no hover, so the caption stays visible below md.
 */
const GalleryItem = ({
  winner,
  onSelect,
}: {
  winner: AwardWinner;
  onSelect: () => void;
}) => (
  <button
    type="button"
    onClick={onSelect}
    className="group relative block aspect-[3/2] w-full overflow-hidden bg-slate-900 text-left focus:outline-none focus:ring-2 focus:ring-orwa focus:ring-offset-2"
  >
    <img
      src={winner.thumbnail}
      alt={`${winner.title}${winner.recipient ? ` — ${winner.recipient}` : ""}`}
      loading="lazy"
      className="h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-black/55 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100" />
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-4 text-center transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
      <p className="m-0 text-base font-semibold text-white drop-shadow">
        {winner.title}
      </p>
      {winner.recipient && (
        <p className="m-0 text-sm leading-snug text-white/85 drop-shadow">
          {winner.recipient}
        </p>
      )}
    </div>
  </button>
);

const Gallery = ({
  year,
  onSelect,
}: {
  year: AwardYear;
  onSelect: (winner: AwardWinner) => void;
}) => (
  <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
    {year.winners.map((winner) => (
      <GalleryItem
        key={`${winner.title}-${winner.recipient ?? winner.full}`}
        winner={winner}
        onSelect={() => onSelect(winner)}
      />
    ))}
  </div>
);

const LandingView = ({ onStartNomination }: LandingViewProps) => {
  const [lightbox, setLightbox] = useState<AwardWinner | null>(null);
  const { notify } = useNotify();
  const { data: winnerRecords, isLoading: winnersLoading } = useGetAwardWinners();
  const {
    data: awardTypeRows,
    isError: awardTypesError,
    isFetched: awardTypesFetched,
  } = useGetAwardTypes();
  const categories = useMemo(() => {
    const nominatable = nominatableAwardTypes(awardTypeRows);
    if (!nominatable.length) return AWARD_CATEGORIES;
    return nominatable.map((row) => ({
      name: String(row.name),
      audience: isSystemOfTheYearAward(row.name) ? "System" : "Individual",
      description: row.description || "",
    }));
  }, [awardTypeRows]);

  useEffect(() => {
    if (!awardTypesFetched) return;
    if (awardTypesError || !nominatableAwardTypes(awardTypeRows).length) {
      notify(
        "Could not load award types. Showing the previous category list.",
        "error"
      );
    }
  }, [awardTypeRows, awardTypesError, awardTypesFetched, notify]);

  const years = useMemo(
    () =>
      groupWinnersByYear(
        (winnerRecords ?? []) as AwardWinnerRecord[],
        import.meta.env.VITE_API_ENDPOINT ?? ""
      ),
    [winnerRecords]
  );

  const [current, ...previous] = years;

  return (
    <main className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:gap-10 lg:px-8">
        {/* Winners rail */}
        <div className="lg:col-span-2">
          {winnersLoading && (
            <p className="py-10 text-center text-sm text-slate-500">
              Loading award winners…
            </p>
          )}

          {!winnersLoading && years.length === 0 && (
            <p className="py-10 text-center text-sm text-slate-500">
              Award winners will appear here once they are published.
            </p>
          )}

          {current && (
            <section id={current.id} className="scroll-mt-8">
              <DualHeader
                lead={String(current.year)}
                rest="Award Winners"
                icon="award"
              />

              {previous.length > 0 && (
                <div className="mt-8 flex flex-col items-center gap-3 bg-orwa px-5 py-3 sm:flex-row sm:justify-between">
                  <h5 className="m-0 text-lg font-bold text-white">
                    Previous Award Years
                  </h5>
                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                    {previous.map((entry) => (
                      <a
                        key={entry.year}
                        href={`#${entry.id}`}
                        className="text-base font-semibold text-white underline-offset-4 hover:underline"
                      >
                        {entry.year} Awards
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <Gallery year={current} onSelect={setLightbox} />
            </section>
          )}

          {previous.map((entry) => (
            <section key={entry.year} id={entry.id} className="mt-16 scroll-mt-8">
              <h2 className="m-0 mb-6 text-center text-2xl font-extrabold tracking-tight text-slate-900">
                Previous Award Winners
              </h2>
              <DualHeader
                lead={String(entry.year)}
                rest="Award Winners"
                icon="award"
              />
              <Gallery year={entry} onSelect={setLightbox} />
            </section>
          ))}
        </div>

        {/* Award details rail */}
        <aside className="lg:col-span-1">
          <DualHeader lead="Award" rest="Details" icon="info" />

          <div className="mt-10">
            <IconBox icon={UserIcon} title="Individual 🙂">
              <p className="m-0">
                Must be employed by a member system and displays individual
                achievement in the category nominated.
              </p>
              <p className="mt-4 mb-0">
                <strong>*NOTE:</strong> Individual nominee&rsquo;s eligibility
                includes any system employee that has worked in their respective
                position for at least 18 months.
              </p>
            </IconBox>
          </div>

          <button
            type="button"
            onClick={onStartNomination}
            className="mt-8 inline-flex w-full items-center justify-center gap-3 bg-orwa px-6 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-orwa-dark focus:outline-none focus:ring-2 focus:ring-orwa focus:ring-offset-2"
          >
            <MousePointerIcon className="h-5 w-5" />
            Awards Nomination Form
          </button>

          <SectionHeading>Eligibility Requirements</SectionHeading>
          <div className="mt-6">
            <IconBox icon={UsersIcon} title="System Award">
              <p className="m-0">
                Any member system that has displayed outstanding achievement in
                all areas of operating a water/wastewater system.
              </p>
            </IconBox>
          </div>

          <SectionHeading>Application &amp; Awards Ceremony</SectionHeading>
          <p className="mt-4 text-center text-base leading-relaxed text-slate-700">
            The application will be used to gather information needed for
            presentation of your award, if chosen, at the ORWA Annual Conference
            Awards Ceremony each year.
          </p>

          <SectionHeading>Award Categories</SectionHeading>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
            {categories.map((category) => (
              <IconBox
                key={category.name}
                icon={category.audience === "System" ? UsersIcon : UserIcon}
                title={category.name}
              />
            ))}
          </div>

          <SectionHeading>Deadline</SectionHeading>
          <p className="mt-4 text-base leading-relaxed text-slate-700">
            All submissions must be in by{" "}
            <strong>{NOMINATION_DEADLINE}</strong>. Any submissions after the
            deadline{" "}
            <span className="underline">
              will <strong>not</strong> be considered
            </span>
            .
          </p>

          <SectionHeading>Readiness Checklist</SectionHeading>
          <ul className="mt-4 mb-0 list-none space-y-3 p-0">
            {READINESS_CHECKLIST.map((item, index) => {
              const Icon = [ListUlIcon, FileAltIcon, PortraitIcon][index % 3];
              return (
                <li
                  key={item}
                  className="flex items-start gap-3 text-base leading-relaxed text-slate-700"
                >
                  <Icon className="mt-1 h-5 w-5 shrink-0 text-orwa" />
                  {item}
                </li>
              );
            })}
          </ul>
          <p className="mt-4 mb-0 text-sm italic text-slate-500">
            *Additional information may be requested if needed.
          </p>

          <p className="mt-8 mb-0 text-base leading-relaxed text-slate-700">
            All winners will be notified by email. For questions or additional
            information please contact the office at{" "}
            <a
              href={CONTACT.phoneHref}
              className="font-semibold text-orwa hover:text-orwa-dark"
            >
              {CONTACT.phone}
            </a>{" "}
            or email us at{" "}
            <a
              href={`mailto:${CONTACT.email}`}
              className="font-semibold text-orwa hover:text-orwa-dark"
            >
              {CONTACT.email}
            </a>
          </p>
        </aside>
      </div>

      {lightbox && (
        <Lightbox winner={lightbox} onClose={() => setLightbox(null)} />
      )}
    </main>
  );
};

export default LandingView;
