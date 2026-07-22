import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type UIEvent,
} from 'react';
import { fetchTerms } from './fetchTerms';
import { filterAndSortTerms, neededIdentifiers } from './match';
import { isAcceptedForVersion, writeAcceptance } from './storage';
import type { TermDocument, TermsGateProps } from './types';
import './TermsGate.css';

function nearBottom(el: HTMLElement): boolean {
  return el.scrollHeight - el.scrollTop - el.clientHeight <= 8;
}

export function TermsGate({
  terms = [],
  global = true,
  apiEndpoint,
  apiKey,
  children,
}: TermsGateProps) {
  const termsKey = JSON.stringify(terms ?? []);
  const needed = useMemo(
    () => neededIdentifiers(JSON.parse(termsKey) as string[], global),
    [termsKey, global]
  );

  const [loading, setLoading] = useState(needed.length > 0);
  const [error, setError] = useState<string | null>(null);
  const [queue, setQueue] = useState<TermDocument[]>([]);
  const [index, setIndex] = useState(0);
  const [canAgree, setCanAgree] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (needed.length === 0) {
      setLoading(false);
      setQueue([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchTerms(apiEndpoint, apiKey)
      .then((all) => {
        if (cancelled) return;
        const pending = filterAndSortTerms(all, needed).filter(
          (t) => !isAcceptedForVersion(t.slug, t.updatedAt)
        );
        setQueue(pending);
        setIndex(0);
        setCanAgree(false);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message || 'Unable to load terms');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [apiEndpoint, apiKey, needed, termsKey, global]);

  const current = queue[index];
  const locked = loading || !!error || !!current;

  useEffect(() => {
    setCanAgree(false);
    const el = bodyRef.current;
    if (!el) return;
    // Short content that doesn't scroll still requires a "reached bottom" pass
    requestAnimationFrame(() => {
      if (el && nearBottom(el)) setCanAgree(true);
    });
  }, [current?.slug, current?.updatedAt]);

  const onScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    if (nearBottom(e.currentTarget)) setCanAgree(true);
  }, []);

  const onAgree = useCallback(() => {
    if (!current || !canAgree) return;
    writeAcceptance({
      slug: current.slug,
      title: current.title,
      updatedAt: current.updatedAt,
      agreedAt: new Date().toISOString(),
    });
    setIndex((i) => i + 1);
    setCanAgree(false);
  }, [canAgree, current]);

  const showModal = locked;

  return (
    <div className="orwa-terms-gate-root">
      <div className={locked ? 'orwa-terms-gate-children--locked' : undefined}>
        {children}
      </div>

      {showModal && (
        <div className="orwa-terms-overlay" role="dialog" aria-modal="true">
          <div className="orwa-terms-modal">
            {loading && (
              <div className="orwa-terms-status">Loading terms…</div>
            )}
            {!loading && error && (
              <div className="orwa-terms-status orwa-terms-status--error">
                {error}
              </div>
            )}
            {!loading && !error && current && (
              <>
                <header className="orwa-terms-header">
                  <h2 className="orwa-terms-title">{current.title}</h2>
                  <span className="orwa-terms-progress">
                    {index + 1} of {queue.length}
                  </span>
                </header>
                <div
                  ref={bodyRef}
                  className="orwa-terms-body"
                  onScroll={onScroll}
                  dangerouslySetInnerHTML={{ __html: current.content }}
                />
                <footer className="orwa-terms-footer">
                  <button
                    type="button"
                    className="orwa-terms-agree"
                    disabled={!canAgree}
                    onClick={onAgree}
                  >
                    Agree and Continue
                  </button>
                </footer>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TermsGate;
