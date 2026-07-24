import React from "react";
import {
  Box,
  ButtonBase,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { IGrantApplication } from "../../../../../grant-application/GrantApplicationTypes";
import { IGrantPayout } from "../../../GrantTypes";
import { APPROVED_STATUSES } from "../../../../helpers/previousFyRollover";
import { useSummaryTokens, display, money, SummaryTokens } from "../../tokens";

export const variantMeta = {
  title: "Reel Builder",
  blurb:
    "Lock the funding path in one tier at a time — each pick snaps into the combination on the left while the next tier's candidates roll in like a slot reel.",
};

interface Props {
  applications: IGrantApplication[];
  payouts: IGrantPayout[];
  fundsAvailable?: number;
  adminAllocation?: number;
  adminDisbursed?: number;
}

/* ------------------------------------------------------------------ */
/* Dimension tree                                                      */
/* ------------------------------------------------------------------ */

interface PathNode {
  id: string;
  label: string;
  caption: string;
  tone: string;
  /** null = dollar-only node (no application count applies) */
  count: number | null;
  amount: number;
  children: PathNode[];
}

const cleanMoney = (value: string | number | null | undefined): number => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const n = parseFloat(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

interface Bucket {
  count: number;
  amount: number;
}
const emptyBucket = (): Bucket => ({ count: 0, amount: 0 });

/** Sum children; count stays null when no child carries a count. */
const branch = (
  id: string,
  label: string,
  caption: string,
  tone: string,
  children: PathNode[],
  explicitAmount?: number
): PathNode => {
  const hasCounts = children.some((c) => c.count != null);
  return {
    id,
    label,
    caption,
    tone,
    count: hasCounts
      ? children.reduce((s, c) => s + (c.count ?? 0), 0)
      : null,
    amount:
      explicitAmount ?? children.reduce((s, c) => s + c.amount, 0),
    children,
  };
};

const leaf = (
  id: string,
  label: string,
  caption: string,
  tone: string,
  bucket: Bucket | null,
  amountOverride?: number
): PathNode => ({
  id,
  label,
  caption,
  tone,
  count: bucket ? bucket.count : null,
  amount: amountOverride ?? bucket?.amount ?? 0,
  children: [],
});

const DENIED_STATUSES = ["Not Approved", "Inelegible"];
const WITHDRAWN_STATUSES = ["Withdrawn", "Tabled Application"];

const buildTree = (props: Props, T: SummaryTokens): PathNode => {
  const applications = props.applications ?? [];
  const payouts = props.payouts ?? [];
  const adminAllocation = props.adminAllocation ?? 0;
  const adminDisbursed = props.adminDisbursed ?? 0;

  const paidOf = (app: IGrantApplication): number => {
    if (app.payouts && app.payouts.length) {
      return app.payouts.reduce((s, p) => s + (p?.amount || 0), 0);
    }
    if (app.id == null) return 0;
    return payouts
      .filter(
        (p) => p?.type !== "Administrative" && p?.application?.id === app.id
      )
      .reduce((s, p) => s + (p.amount || 0), 0);
  };

  const buckets = {
    paidFull: emptyBucket(),
    paidPartial: emptyBucket(),
    needingSignature: emptyBucket(),
    awaitingPayment: emptyBucket(),
    awaitingApproval: emptyBucket(),
    awaitingCommittee: emptyBucket(),
    onHold: emptyBucket(),
    denied: emptyBucket(),
    withdrawn: emptyBucket(),
  };
  const add = (b: Bucket, amount: number) => {
    b.count += 1;
    b.amount += amount;
  };

  let reservedRequested = 0;

  for (const app of applications) {
    const name = app?.status?.name ?? "";
    if (!name || name.includes("PFY")) continue;

    const requested = cleanMoney(app.requested_grant_amount);
    const award = app.award_amount || 0;

    if (DENIED_STATUSES.includes(name) || name.startsWith("Denial:")) {
      add(buckets.denied, requested);
      continue;
    }
    if (WITHDRAWN_STATUSES.includes(name)) {
      add(buckets.withdrawn, requested);
      continue;
    }

    // Everything still alive holds a claim on the pool.
    reservedRequested += requested;

    if (name === "On Hold") {
      add(buckets.onHold, requested);
      continue;
    }

    if (APPROVED_STATUSES.includes(name)) {
      const paid = paidOf(app);
      if (name === "Paid in Full" || (award > 0 && paid >= award)) {
        add(buckets.paidFull, paid);
      } else if (paid > 0) {
        add(buckets.paidPartial, paid);
      } else if (name === "Grant Agreement Signed/Sealed/Returned") {
        add(buckets.awaitingPayment, award);
      } else {
        add(buckets.needingSignature, award);
      }
      continue;
    }

    if (name === "New Application") {
      add(buckets.awaitingCommittee, requested);
    } else {
      add(buckets.awaitingApproval, requested);
    }
  }

  const reserved = Math.min(
    reservedRequested,
    props.fundsAvailable ?? Infinity
  );
  const unclaimed = Math.max((props.fundsAvailable ?? 0) - reserved, 0);

  /* ----- Grant branch ----- */
  const grant = branch(
    "grant",
    "Grant",
    "Grant-side program funds",
    T.water,
    [
      branch(
        "grant-available",
        "Available",
        "Funds not committed to a live application",
        T.inflow,
        [
          branch(
            "grant-unapproved",
            "Unapproved",
            "Requests that exited without an award",
            T.exit,
            [
              leaf(
                "grant-denied",
                "Denied",
                "Not approved, denied, or ineligible",
                T.stage.declined,
                buckets.denied
              ),
              leaf(
                "grant-withdrawn",
                "Withdrawn",
                "Withdrawn or tabled by the applicant",
                T.stage.cor,
                buckets.withdrawn
              ),
            ]
          ),
          leaf(
            "grant-unclaimed",
            "Unclaimed",
            "Pool dollars no application has claimed",
            T.inflow,
            null,
            unclaimed
          ),
        ]
      ),
      branch(
        "grant-reserved",
        "Reserved",
        "Pool dollars spoken for by live applications",
        T.committed,
        [
          branch(
            "grant-approved",
            "Approved",
            "Committee-approved awards",
            T.stage.approved,
            [
              branch(
                "grant-disbursed",
                "Disbursed",
                "Award money already paid out",
                T.stage.disbursed,
                [
                  leaf(
                    "grant-paid-full",
                    "Paid in Full",
                    "Payouts have met the full award",
                    T.stage.paid,
                    buckets.paidFull
                  ),
                  leaf(
                    "grant-paid-partial",
                    "Paid in Partial",
                    "Payouts started, award not exhausted",
                    T.stage.disbursed,
                    buckets.paidPartial
                  ),
                ]
              ),
              branch(
                "grant-undisbursed",
                "Undisbursed",
                "Awarded, no money moved yet",
                T.stage.signed,
                [
                  leaf(
                    "grant-needing-signature",
                    "Needing Signature",
                    "Approved, agreement not yet signed",
                    T.stage.signed,
                    buckets.needingSignature
                  ),
                  leaf(
                    "grant-awaiting-payment",
                    "Awaiting Payment Request",
                    "Signed and waiting on a payment request",
                    T.stage.awaiting,
                    buckets.awaitingPayment
                  ),
                ]
              ),
            ]
          ),
          branch(
            "grant-under-review",
            "Under Review",
            "Requests still moving toward a decision",
            T.stage.review,
            [
              leaf(
                "grant-awaiting-approval",
                "Awaiting Approval",
                "In committee review, undecided",
                T.stage.review,
                buckets.awaitingApproval
              ),
              leaf(
                "grant-awaiting-committee",
                "Awaiting Committee",
                "New applications queued for committee",
                T.stage.received,
                buckets.awaitingCommittee
              ),
            ]
          ),
          leaf(
            "grant-on-hold",
            "On Hold",
            "Paused pending outside action",
            T.violet,
            buckets.onHold
          ),
        ],
        reserved
      ),
    ]
  );

  /* ----- Administration branch (dollar-only) ----- */
  const administration = branch(
    "admin",
    "Administration",
    "ORWA administrative allocation",
    T.violet,
    [
      branch(
        "admin-available",
        "Available",
        "Admin dollars not yet approved",
        T.inflow,
        [
          leaf(
            "admin-unapproved",
            "Unapproved",
            "No unapproved admin dollars exist",
            T.stage.review,
            null,
            0
          ),
        ]
      ),
      branch(
        "admin-reserved",
        "Unavailable",
        "Admin dollars committed",
        T.committed,
        [
          branch(
            "admin-approved",
            "Approved",
            "Approved administrative allocation",
            T.stage.approved,
            [
              branch(
                "admin-paid",
                "Paid",
                "Admin dollars disbursed to date",
                T.stage.paid,
                [
                  leaf(
                    "admin-paid-full",
                    "In Full",
                    "Admin disbursements to date",
                    T.stage.paid,
                    null,
                    adminDisbursed
                  ),
                  leaf(
                    "admin-paid-partial",
                    "In Partial",
                    "No partial admin payments",
                    T.stage.disbursed,
                    null,
                    0
                  ),
                ]
              ),
              leaf(
                "admin-invoiced",
                "Invoiced",
                "No outstanding admin invoices",
                T.stage.signed,
                null,
                0
              ),
            ],
            adminAllocation
          ),
        ]
      ),
    ]
  );

  return branch(
    "total",
    "Total Funding",
    "Every dollar the program touches",
    T.deepWater,
    [administration, grant]
  );
};

/* ------------------------------------------------------------------ */
/* Visibility: hide dead-zero leaves, dim dead-zero branches           */
/* ------------------------------------------------------------------ */

const isZero = (n: PathNode): boolean => n.amount === 0 && !(n.count ?? 0);

interface Candidate {
  node: PathNode;
  disabled: boolean;
}

const candidatesOf = (node: PathNode, depth: number): Candidate[] =>
  node.children
    .map((child): Candidate | null => {
      if (!isZero(child)) return { node: child, disabled: false };
      // Structural branches (and the top Administration/Grant split) stay
      // visible-but-disabled so the drill-down shape never surprises anyone;
      // zero leaves simply hide.
      if (child.children.length > 0 || depth === 0) {
        return { node: child, disabled: true };
      }
      return null;
    })
    .filter((c): c is Candidate => c !== null);

/* ------------------------------------------------------------------ */
/* Tiles                                                               */
/* ------------------------------------------------------------------ */

const REEL_EASE = "cubic-bezier(0.22, 0.9, 0.32, 1.15)";

/** Full-size candidate tile in the StageCard duotone style. */
const CandidateTile: React.FC<{
  node: PathNode;
  disabled: boolean;
  focused: boolean;
  state: "idle" | "chosen" | "passed";
  reduced: boolean;
  index: number;
  onSelect: () => void;
}> = ({ node, disabled, focused, state, reduced, index, onSelect }) => {
  const T = useSummaryTokens();
  const dollarOnly = node.count == null;

  const transitionSx = reduced
    ? { transition: "opacity 220ms ease" }
    : { transition: `transform 300ms ${REEL_EASE}, opacity 300ms ease, box-shadow 300ms ease` };

  const stateSx =
    state === "chosen"
      ? {
          opacity: 1,
          transform: reduced ? "none" : "translateX(-18px) scale(1.02)",
          boxShadow: `0 0 0 2px ${node.tone}, ${T.hoverShadow}`,
        }
      : state === "passed"
      ? {
          opacity: 0.5,
          transform: reduced ? "none" : "translateX(10px) scale(0.97)",
        }
      : {
          opacity: disabled ? 0.4 : 1,
          boxShadow: focused && !disabled ? `0 0 0 2px ${node.tone}66` : "none",
        };

  return (
    <Tooltip
      title={disabled ? `${node.label} — nothing here yet` : node.caption}
      arrow
      placement="right"
    >
      <ButtonBase
        onClick={disabled ? undefined : onSelect}
        disabled={disabled}
        sx={{
          display: "block",
          textAlign: "left",
          width: "100%",
          borderRadius: "14px",
          overflow: "hidden",
          backgroundColor: T.panel,
          border: `1px solid ${T.line}`,
          cursor: disabled ? "default" : "pointer",
          "@keyframes pathwayReelIn": {
            from: { opacity: 0, transform: "translateY(30px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
          "@keyframes pathwayFadeIn": {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
          animation: `${
            reduced ? "pathwayFadeIn" : "pathwayReelIn"
          } 320ms ${REEL_EASE} both`,
          animationDelay: `${index * 55}ms`,
          ...transitionSx,
          ...stateSx,
          "&:hover": disabled
            ? {}
            : {
                transform:
                  state === "idle" && !reduced ? "translateY(-3px)" : undefined,
                boxShadow: `${T.hoverShadow}, 0 0 0 1px ${node.tone}55`,
              },
        }}
      >
        {dollarOnly ? (
          /* AmountChip-flavored: quieter, left accent, no count row */
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderLeft: `3px solid ${node.tone}`,
            }}
          >
            <Typography
              sx={{
                ...display,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: node.tone,
              }}
            >
              {node.label}
            </Typography>
            <Typography
              sx={{
                ...display,
                fontSize: 22,
                fontWeight: 700,
                color: node.amount < 0 ? T.exit : T.textHi,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1.25,
              }}
            >
              {money(node.amount)}
            </Typography>
            <Typography sx={{ fontSize: 11, color: T.textFaint }}>
              {node.caption}
            </Typography>
          </Box>
        ) : (
          /* StageCard-flavored duotone */
          <>
            <Box
              sx={{
                px: 2,
                pt: 1.5,
                pb: 1,
                background: `linear-gradient(135deg, ${node.tone}26 0%, transparent 65%)`,
              }}
            >
              <Typography
                sx={{
                  ...display,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: node.tone,
                  lineHeight: 1.2,
                }}
              >
                {node.label}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
                <Typography
                  sx={{
                    ...display,
                    fontSize: 28,
                    fontWeight: 700,
                    color: T.textHi,
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1.15,
                  }}
                >
                  {(node.count ?? 0).toLocaleString()}
                </Typography>
                <Typography sx={{ fontSize: 11, color: T.textLo }}>
                  {node.count === 1 ? "app" : "apps"}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ height: 2, backgroundColor: node.tone, opacity: 0.85 }} />
            <Box sx={{ px: 2, py: 1.25 }}>
              <Typography
                sx={{
                  ...display,
                  fontSize: 18,
                  fontWeight: 600,
                  color: node.amount < 0 ? T.exit : T.textHi,
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: 1.2,
                }}
              >
                {money(node.amount)}
              </Typography>
              <Typography sx={{ fontSize: 11, color: T.textFaint }}>
                {node.caption}
              </Typography>
            </Box>
          </>
        )}
      </ButtonBase>
    </Tooltip>
  );
};

/** Compact locked tile — a dial already set on the bike lock. */
const LockedTile: React.FC<{
  node: PathNode;
  isHead: boolean;
  reduced: boolean;
  onJump: () => void;
}> = ({ node, isHead, reduced, onJump }) => {
  const T = useSummaryTokens();
  return (
    <Tooltip
      title={isHead ? node.caption : `Jump back to ${node.label}`}
      arrow
    >
      <ButtonBase
        onClick={onJump}
        sx={{
          display: "block",
          textAlign: "left",
          flexShrink: 0,
          minWidth: 118,
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: T.panel,
          border: `1px solid ${T.line}`,
          borderLeft: `3px solid ${node.tone}`,
          boxShadow: isHead ? `0 0 0 1px ${node.tone}88` : "none",
          "@keyframes pathwayLockIn": {
            from: { opacity: 0, transform: "translateX(26px) scale(0.9)" },
            to: { opacity: 1, transform: "translateX(0) scale(1)" },
          },
          "@keyframes pathwayFadeIn2": {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
          animation: `${
            reduced ? "pathwayFadeIn2" : "pathwayLockIn"
          } 280ms ${REEL_EASE} both`,
          transition: "transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease",
          "&:hover": {
            backgroundColor: T.panelSoft,
            transform: reduced ? "none" : "translateY(-2px)",
            boxShadow: `${T.hoverShadow}, 0 0 0 1px ${node.tone}66`,
          },
        }}
      >
        <Box sx={{ px: 1.5, py: 1 }}>
          <Typography
            sx={{
              ...display,
              fontSize: 9.5,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: node.tone,
              whiteSpace: "nowrap",
            }}
          >
            {node.label}
          </Typography>
          <Typography
            sx={{
              ...display,
              fontSize: 15,
              fontWeight: 700,
              color: T.textHi,
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1.25,
              whiteSpace: "nowrap",
            }}
          >
            {money(node.amount, true)}
          </Typography>
          {node.count != null && (
            <Typography sx={{ fontSize: 10, color: T.textLo, whiteSpace: "nowrap" }}>
              {node.count.toLocaleString()} {node.count === 1 ? "app" : "apps"}
            </Typography>
          )}
        </Box>
      </ButtonBase>
    </Tooltip>
  );
};

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function ReelBuilder(props: Props) {
  const T = useSummaryTokens();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  const tree = React.useMemo(() => buildTree(props, T), [props, T]);

  // Path of node ids, root always locked first.
  const [path, setPath] = React.useState<string[]>(["total"]);
  const [focusIdx, setFocusIdx] = React.useState(0);
  const [pendingId, setPendingId] = React.useState<string | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelRef = React.useRef(0);

  React.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  // Resolve the id path against the (possibly rebuilt) tree, stopping at the
  // first id that no longer exists so a data refresh can never strand us.
  const lockedNodes = React.useMemo(() => {
    const nodes: PathNode[] = [];
    let cursor: PathNode | undefined = tree.id === path[0] ? tree : undefined;
    if (!cursor) return [tree];
    nodes.push(cursor);
    for (const id of path.slice(1)) {
      const next: PathNode | undefined = cursor.children.find(
        (c) => c.id === id
      );
      if (!next) break;
      nodes.push(next);
      cursor = next;
    }
    return nodes;
  }, [tree, path]);

  const head = lockedNodes[lockedNodes.length - 1];
  const candidates = React.useMemo(
    () => candidatesOf(head, lockedNodes.length - 1),
    [head, lockedNodes]
  );

  const commit = (id: string) => {
    setPath((prev) => [...prev, id]);
    setFocusIdx(0);
    setPendingId(null);
  };

  const select = (candidate: Candidate, idx: number) => {
    if (candidate.disabled || pendingId) return;
    setFocusIdx(idx);
    if (reduced) {
      commit(candidate.node.id);
      return;
    }
    setPendingId(candidate.node.id);
    timerRef.current = setTimeout(() => commit(candidate.node.id), 320);
  };

  const jumpTo = (idx: number) => {
    if (pendingId) return;
    setPath((prev) => prev.slice(0, idx + 1));
    setFocusIdx(0);
  };

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPendingId(null);
    setPath(["total"]);
    setFocusIdx(0);
  };

  const spin = (dir: 1 | -1) => {
    if (!candidates.length || pendingId) return;
    setFocusIdx((prev) => {
      const enabled = candidates
        .map((c, i) => (c.disabled ? -1 : i))
        .filter((i) => i >= 0);
      if (!enabled.length) return prev;
      const at = enabled.indexOf(prev);
      const next =
        enabled[(at < 0 ? 0 : at + dir + enabled.length) % enabled.length];
      return next;
    });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      spin(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      spin(-1);
    } else if (e.key === "Enter" && candidates[focusIdx]) {
      e.preventDefault();
      select(candidates[focusIdx], focusIdx);
    } else if (e.key === "Backspace" && lockedNodes.length > 1) {
      e.preventDefault();
      jumpTo(lockedNodes.length - 2);
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    wheelRef.current += e.deltaY;
    if (Math.abs(wheelRef.current) >= 60) {
      spin(wheelRef.current > 0 ? 1 : -1);
      wheelRef.current = 0;
    }
  };

  const atLeaf = candidates.length === 0;

  return (
    <Box>
      {/* Path readout + reset */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 1.5,
          flexWrap: "wrap",
        }}
      >
        <Typography
          sx={{
            ...display,
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: T.textFaint,
          }}
        >
          Path
        </Typography>
        <Typography
          sx={{
            ...display,
            fontSize: 13,
            fontWeight: 600,
            color: T.textLo,
            "& b": { color: T.textHi, fontWeight: 700 },
          }}
        >
          {lockedNodes.map((n, i) => (
            <React.Fragment key={n.id}>
              {i > 0 && <span style={{ opacity: 0.5 }}> ▸ </span>}
              {i === lockedNodes.length - 1 ? <b>{n.label}</b> : n.label}
            </React.Fragment>
          ))}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <ButtonBase
          onClick={reset}
          disabled={lockedNodes.length === 1}
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: "8px",
            border: `1px solid ${T.line}`,
            color: lockedNodes.length === 1 ? T.textFaint : T.textLo,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.04em",
            opacity: lockedNodes.length === 1 ? 0.5 : 1,
            transition: "background-color 150ms ease, color 150ms ease",
            "&:hover": {
              backgroundColor: T.panelSoft,
              color: T.textHi,
            },
          }}
        >
          ↺ Reset
        </ButtonBase>
      </Box>

      {/* The rail — columns center on the vertical midpoint so the locked
          dials sit level with the reel however tall it grows */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          borderRadius: "16px",
          backgroundColor: T.panelSoft,
          border: `1px solid ${T.line}`,
          overflow: "hidden",
        }}
      >
        {/* Locked combination (left) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexShrink: 1,
            minWidth: 0,
            overflowX: "auto",
            pb: 0.5,
            pt: 0.5,
            "&::-webkit-scrollbar": { height: 4 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: T.line,
              borderRadius: 2,
            },
          }}
        >
          {lockedNodes.map((node, i) => (
            <LockedTile
              key={node.id}
              node={node}
              isHead={i === lockedNodes.length - 1}
              reduced={reduced}
              onJump={() => jumpTo(i)}
            />
          ))}
        </Box>

        {/* Lock point */}
        <Box
          sx={{
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            flexShrink: 0,
          }}
        >
          <Box sx={{ width: "1px", flex: 1, backgroundColor: T.line }} />
          <Box
            sx={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: `1px solid ${T.line}`,
              backgroundColor: T.panel,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: head.tone,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            ▸
          </Box>
          <Box sx={{ width: "1px", flex: 1, backgroundColor: T.line }} />
        </Box>

        {/* Candidate reel (right) */}
        <Box
          tabIndex={0}
          onKeyDown={onKeyDown}
          onWheel={onWheel}
          role="listbox"
          aria-label={`Choose the next tier under ${head.label}`}
          sx={{
            flex: "0 1 300px",
            minWidth: 240,
            display: "flex",
            flexDirection: "column",
            gap: 1.25,
            outline: "none",
            "&:focus-visible": {
              borderRadius: "16px",
              boxShadow: `0 0 0 2px ${T.water}55`,
            },
          }}
          // Re-key so a new tier re-runs the reel-in entrance.
          key={lockedNodes.map((n) => n.id).join("/")}
        >
          {atLeaf ? (
            <Box
              sx={{
                p: 2,
                borderRadius: "14px",
                backgroundColor: T.panel,
                border: `1px dashed ${T.line}`,
                "@keyframes pathwayFadeIn3": {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                },
                animation: "pathwayFadeIn3 300ms ease both",
              }}
            >
              <Typography
                sx={{
                  ...display,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: head.tone,
                }}
              >
                Path complete
              </Typography>
              <Typography
                sx={{
                  ...display,
                  fontSize: 22,
                  fontWeight: 700,
                  color: T.textHi,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {money(head.amount)}
              </Typography>
              <Typography sx={{ fontSize: 12, color: T.textLo, mt: 0.25 }}>
                {head.caption}
                {head.count != null &&
                  ` — ${head.count.toLocaleString()} ${
                    head.count === 1 ? "application" : "applications"
                  }`}
              </Typography>
              <Typography sx={{ fontSize: 11, color: T.textFaint, mt: 1 }}>
                Click a locked tile to unwind, or reset to start over.
              </Typography>
            </Box>
          ) : (
            <>
              <Typography
                sx={{
                  ...display,
                  fontSize: 10.5,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: T.textFaint,
                  px: 0.5,
                }}
              >
                Spin the next dial · {head.label}
              </Typography>
              {candidates.map((c, i) => (
                <CandidateTile
                  key={c.node.id}
                  node={c.node}
                  disabled={c.disabled}
                  focused={i === focusIdx}
                  state={
                    pendingId
                      ? pendingId === c.node.id
                        ? "chosen"
                        : "passed"
                      : "idle"
                  }
                  reduced={reduced}
                  index={i}
                  onSelect={() => select(c, i)}
                />
              ))}
              <Typography
                sx={{ fontSize: 10.5, color: T.textFaint, px: 0.5 }}
              >
                Click to lock in · scroll or ↑↓ to spin · Enter to select
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
