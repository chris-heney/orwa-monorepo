import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@mui/material/styles";
import { IGrantApplication } from "../../../../../grant-application/GrantApplicationTypes";
import { IGrantPayout } from "../../../GrantTypes";
import { APPROVED_STATUSES } from "../../../../helpers/previousFyRollover";
import { useSummaryTokens, display, money, SummaryTokens } from "../../tokens";
import {
  isCountableTowardAward,
  sumPayoutAmounts,
} from "../../../../../payouts/helpers/payoutAmounts";

export const variantMeta = {
  title: "Cascade Rows",
  blurb:
    "Commit a tile and its children cascade into a new row below, with a connector threading the chosen path from tier to tier.",
};

interface Props {
  applications: IGrantApplication[];
  payouts: IGrantPayout[];
  fundsAvailable?: number;
  adminAllocation?: number;
  adminDisbursed?: number;
}

/* ------------------------------------------------------------------ */
/* Tree model                                                          */
/* ------------------------------------------------------------------ */

interface PathNode {
  key: string;
  label: string;
  caption: string;
  color: string;
  /** null = dollar-only node (no application count applies) */
  count: number | null;
  amount: number;
  children: PathNode[];
  /** Dimension name shown beside the row of this node's children. */
  childDimension?: string;
}

const isEmptyNode = (n: PathNode) => (n.count ?? 0) === 0 && n.amount === 0;

/** requested_grant_amount arrives as a string with junk characters. */
const cleanMoney = (raw: unknown): number => {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : 0;
  if (raw == null) return 0;
  const n = parseFloat(String(raw).replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const paidOf = (app: IGrantApplication): number =>
  sumPayoutAmounts(app.payouts, isCountableTowardAward);

type LeafBucket =
  | "denied"
  | "withdrawn"
  | "onHold"
  | "paidFull"
  | "paidPartial"
  | "needingSignature"
  | "awaitingPaymentRequest"
  | "awaitingCommittee"
  | "awaitingApproval";

const classify = (app: IGrantApplication): LeafBucket | null => {
  const name = app.status?.name ?? "";
  if (!name || name.includes("PFY")) return null;

  if (
    name === "Not Approved" ||
    name.startsWith("Denial:") ||
    name === "Inelegible" ||
    name === "Ineligible"
  )
    return "denied";
  if (name === "Withdrawn" || name === "Tabled Application") return "withdrawn";
  if (name === "On Hold") return "onHold";

  if (APPROVED_STATUSES.includes(name)) {
    const paid = paidOf(app);
    const award = app.award_amount || 0;
    if (name === "Paid in Full" || (award > 0 && paid >= award))
      return "paidFull";
    if (paid > 0) return "paidPartial";
    return name === "Grant Agreement Signed/Sealed/Returned"
      ? "awaitingPaymentRequest"
      : "needingSignature";
  }

  // Undecided, non-terminal statuses are all "under review".
  return name === "New Application" ? "awaitingCommittee" : "awaitingApproval";
};

const buildTree = (
  T: SummaryTokens,
  applications: IGrantApplication[],
  payouts: IGrantPayout[],
  fundsAvailable?: number,
  adminAllocation?: number,
  adminDisbursed?: number
): PathNode => {
  const buckets = new Map<LeafBucket, IGrantApplication[]>();
  for (const app of applications ?? []) {
    const bucket = classify(app);
    if (!bucket) continue;
    const list = buckets.get(bucket) ?? [];
    list.push(app);
    buckets.set(bucket, list);
  }

  const apps = (b: LeafBucket) => buckets.get(b) ?? [];
  const requestedOf = (b: LeafBucket) =>
    apps(b).reduce((s, a) => s + cleanMoney(a.requested_grant_amount), 0);
  const awardOf = (b: LeafBucket) =>
    apps(b).reduce((s, a) => s + (a.award_amount || 0), 0);
  const paidSumOf = (b: LeafBucket) =>
    apps(b).reduce((s, a) => s + paidOf(a), 0);

  const node = (
    key: string,
    label: string,
    caption: string,
    color: string,
    amount: number,
    count: number | null,
    children: PathNode[] = [],
    childDimension?: string
  ): PathNode => ({
    key,
    label,
    caption,
    color,
    amount,
    count,
    children,
    childDimension,
  });

  const leaf = (
    key: string,
    label: string,
    caption: string,
    color: string,
    bucket: LeafBucket,
    amount: number
  ): PathNode =>
    node(key, label, caption, color, amount, apps(bucket).length);

  /* ---- Grant branch ---- */

  const denied = leaf(
    "denied",
    "Denied",
    "declined and released",
    T.stage.declined,
    "denied",
    requestedOf("denied")
  );
  const withdrawn = leaf(
    "withdrawn",
    "Withdrawn",
    "returned to the pool",
    T.deepWater,
    "withdrawn",
    requestedOf("withdrawn")
  );
  const unapproved = node(
    "unapproved",
    "Unapproved",
    "requests that exited review",
    T.exit,
    denied.amount + withdrawn.amount,
    (denied.count ?? 0) + (withdrawn.count ?? 0),
    [denied, withdrawn],
    "Completeness"
  );

  const liveRequested =
    requestedOf("paidFull") +
    requestedOf("paidPartial") +
    requestedOf("needingSignature") +
    requestedOf("awaitingPaymentRequest") +
    requestedOf("awaitingCommittee") +
    requestedOf("awaitingApproval") +
    requestedOf("onHold");
  const reserved = Math.min(liveRequested, fundsAvailable ?? Infinity);
  const unclaimedAmount = Math.max((fundsAvailable ?? 0) - reserved, 0);

  const unclaimed = node(
    "unclaimed",
    "Unclaimed",
    "still open to new requests",
    T.inflow,
    unclaimedAmount,
    null
  );

  const grantAvailable = node(
    "grant-available",
    "Available",
    "not committed to an award",
    T.inflow,
    unapproved.amount + unclaimed.amount,
    unapproved.count,
    [unapproved, unclaimed],
    "Approval"
  );

  const paidFull = leaf(
    "paid-full",
    "Paid in Full",
    "fully disbursed",
    T.stage.paid,
    "paidFull",
    paidSumOf("paidFull")
  );
  const paidPartial = leaf(
    "paid-partial",
    "Paid in Partial",
    "partially disbursed",
    T.stage.disbursed,
    "paidPartial",
    paidSumOf("paidPartial")
  );
  const disbursed = node(
    "disbursed",
    "Disbursed",
    "money has moved",
    T.inflow,
    paidFull.amount + paidPartial.amount,
    (paidFull.count ?? 0) + (paidPartial.count ?? 0),
    [paidFull, paidPartial],
    "Completeness"
  );

  const needingSignature = leaf(
    "needing-signature",
    "Needing Signature",
    "agreements out for signing",
    T.stage.signed,
    "needingSignature",
    awardOf("needingSignature")
  );
  const awaitingPaymentRequest = leaf(
    "awaiting-payment-request",
    "Awaiting Payment Request",
    "signed, no request yet",
    T.stage.awaiting,
    "awaitingPaymentRequest",
    awardOf("awaitingPaymentRequest")
  );
  const undisbursed = node(
    "undisbursed",
    "Undisbursed",
    "committed, not yet moved",
    T.committed,
    needingSignature.amount + awaitingPaymentRequest.amount,
    (needingSignature.count ?? 0) + (awaitingPaymentRequest.count ?? 0),
    [needingSignature, awaitingPaymentRequest],
    "Completeness"
  );

  const approved = node(
    "approved",
    "Approved",
    "committee-committed awards",
    T.stage.approved,
    disbursed.amount + undisbursed.amount,
    (disbursed.count ?? 0) + (undisbursed.count ?? 0),
    [disbursed, undisbursed],
    "Distribution"
  );

  const awaitingApproval = leaf(
    "awaiting-approval",
    "Awaiting Approval",
    "pending a decision",
    T.stage.review,
    "awaitingApproval",
    requestedOf("awaitingApproval")
  );
  const awaitingCommittee = leaf(
    "awaiting-committee",
    "Awaiting Committee",
    "queued for committee",
    T.water,
    "awaitingCommittee",
    requestedOf("awaitingCommittee")
  );
  const underReview = node(
    "under-review",
    "Under Review",
    "requests in evaluation",
    T.stage.review,
    awaitingApproval.amount + awaitingCommittee.amount,
    (awaitingApproval.count ?? 0) + (awaitingCommittee.count ?? 0),
    [awaitingApproval, awaitingCommittee],
    "Completeness"
  );

  const onHold = leaf(
    "on-hold",
    "On Hold",
    "paused, funds still reserved",
    T.violet,
    "onHold",
    requestedOf("onHold")
  );

  const grantUnavailable = node(
    "grant-unavailable",
    "Unavailable",
    "reserved by live applications",
    T.committed,
    reserved,
    (approved.count ?? 0) + (underReview.count ?? 0) + (onHold.count ?? 0),
    [approved, underReview, onHold],
    "Approval"
  );

  const grant = node(
    "grant",
    "Grant",
    "project funding pool",
    T.water,
    grantAvailable.amount + grantUnavailable.amount,
    (grantAvailable.count ?? 0) + (grantUnavailable.count ?? 0),
    [grantAvailable, grantUnavailable],
    "Availability"
  );

  /* ---- Administration branch (dollar-only) ---- */

  const adminAlloc = adminAllocation ?? 0;
  const adminPaid =
    adminDisbursed ??
    (payouts ?? [])
      .filter((p) => p?.type === "Administrative")
      .reduce((s, p) => s + (p.amount || 0), 0);

  const adminUnapproved = node(
    "admin-unapproved",
    "Unapproved",
    "nothing pending approval",
    T.violet,
    0,
    null
  );
  const adminAvailable = node(
    "admin-available",
    "Available",
    "not committed to operations",
    T.violet,
    0,
    null,
    [adminUnapproved],
    "Approval"
  );

  const adminPaidFull = node(
    "admin-paid-full",
    "In Full",
    "disbursed to administration",
    T.stage.paid,
    adminPaid,
    null
  );
  const adminPaidPartial = node(
    "admin-paid-partial",
    "In Partial",
    "no partial admin payouts",
    T.stage.disbursed,
    0,
    null
  );
  const adminPaidNode = node(
    "admin-paid",
    "Paid",
    "administrative disbursements",
    T.inflow,
    adminPaid,
    null,
    [adminPaidFull, adminPaidPartial],
    "Completeness"
  );
  const adminInvoiced = node(
    "admin-invoiced",
    "Invoiced",
    "no open invoices",
    T.stage.awaiting,
    0,
    null
  );
  const adminApproved = node(
    "admin-approved",
    "Approved",
    "annual operating allocation",
    T.committed,
    adminAlloc,
    null,
    [adminPaidNode, adminInvoiced],
    "Distribution"
  );
  const adminUnavailable = node(
    "admin-unavailable",
    "Unavailable",
    "reserved for operations",
    T.committed,
    adminAlloc,
    null,
    [adminApproved],
    "Approval"
  );
  const admin = node(
    "admin",
    "Administration",
    "operating allocation",
    T.violet,
    adminAvailable.amount + adminUnavailable.amount,
    null,
    [adminAvailable, adminUnavailable],
    "Availability"
  );

  return node(
    "root",
    "Total Funding",
    "every dollar in the program",
    T.deepWater,
    admin.amount + grant.amount,
    grant.count,
    [admin, grant],
    "Funding Source"
  );
};

/* ------------------------------------------------------------------ */
/* Tile                                                                */
/* ------------------------------------------------------------------ */

type TileState = "idle" | "selected" | "dimmed" | "disabled";

const PathTile: React.FC<{
  node: PathNode;
  state: TileState;
  dense: boolean;
  onClick: () => void;
  registerRef: (el: HTMLDivElement | null) => void;
}> = ({ node, state, dense, onClick, registerRef }) => {
  const T = useSummaryTokens();
  const clickable = state !== "disabled";
  const selected = state === "selected";
  const dollarOnly = node.count === null;

  return (
    <Box
      ref={registerRef}
      role="button"
      tabIndex={clickable ? 0 : -1}
      aria-pressed={selected}
      aria-disabled={!clickable}
      onClick={clickable ? onClick : undefined}
      onKeyDown={
        clickable
          ? (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      sx={{
        position: "relative",
        minWidth: dense ? 148 : 168,
        flex: "1 1 0",
        borderRadius: "14px",
        overflow: "hidden",
        backgroundColor: T.panel,
        border: `1px solid ${selected ? `${node.color}88` : T.line}`,
        boxShadow: selected
          ? `0 0 0 2px ${node.color}66, ${T.hoverShadow}`
          : "none",
        cursor: clickable ? "pointer" : "default",
        opacity: state === "disabled" ? 0.35 : state === "dimmed" ? 0.5 : 1,
        outline: "none",
        transition:
          "transform 180ms ease, box-shadow 180ms ease, opacity 220ms ease",
        // Selected tiles are "locked in": they anchor the connector, so no lift.
        "&:hover": clickable
          ? selected
            ? { opacity: 1 }
            : {
                transform: "translateY(-3px)",
                boxShadow: `${T.hoverShadow}, 0 0 0 1px ${node.color}55`,
                opacity: 1,
              }
          : undefined,
        "&:focus-visible": {
          boxShadow: `0 0 0 2px ${node.color}`,
        },
        "@media (prefers-reduced-motion: reduce)": {
          transition: "opacity 220ms ease",
          "&:hover": { transform: "none" },
        },
      }}
    >
      {/* Duotone top half */}
      <Box
        sx={{
          px: 2,
          pt: 1.5,
          pb: 1,
          background: `linear-gradient(135deg, ${node.color}${
            selected ? "3d" : "26"
          } 0%, transparent 65%)`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              ...display,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: node.color,
              lineHeight: 1.2,
            }}
          >
            {node.label}
          </Typography>
          {selected && (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: node.color,
                boxShadow: `0 0 0 3px ${node.color}33`,
                flexShrink: 0,
              }}
            />
          )}
        </Box>
        {dollarOnly ? (
          <Typography
            sx={{
              ...display,
              fontSize: dense ? 22 : 26,
              fontWeight: 700,
              color: T.textHi,
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1.3,
            }}
          >
            {money(node.amount)}
          </Typography>
        ) : (
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
            <Typography
              sx={{
                ...display,
                fontSize: dense ? 26 : 32,
                fontWeight: 700,
                color: T.textHi,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1.15,
              }}
            >
              {node.count?.toLocaleString()}
            </Typography>
            <Typography sx={{ fontSize: 11, color: T.textLo }}>
              {node.count === 1 ? "application" : "applications"}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Divider carrying the node color */}
      <Box
        sx={{
          height: 2,
          backgroundColor: node.color,
          opacity: selected ? 1 : 0.85,
        }}
      />

      {/* Bottom half */}
      <Box sx={{ px: 2, py: 1.25 }}>
        {!dollarOnly && (
          <Typography
            sx={{
              ...display,
              fontSize: dense ? 17 : 19,
              fontWeight: 600,
              color: node.amount < 0 ? T.exit : T.textHi,
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1.2,
            }}
          >
            {money(node.amount)}
          </Typography>
        )}
        <Typography sx={{ fontSize: 11, color: T.textFaint }}>
          {node.caption}
        </Typography>
      </Box>
    </Box>
  );
};

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

const cascadeIn = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export default function CascadeRows({
  applications,
  payouts,
  fundsAvailable,
  adminAllocation,
  adminDisbursed,
}: Props) {
  const T = useSummaryTokens();
  const [path, setPath] = useState<string[]>([]);

  const tree = useMemo(
    () =>
      buildTree(
        T,
        applications ?? [],
        payouts ?? [],
        fundsAvailable,
        adminAllocation,
        adminDisbursed
      ),
    [T, applications, payouts, fundsAvailable, adminAllocation, adminDisbursed]
  );

  // Resolve the committed chain against the current tree (drops stale keys).
  const committed = useMemo(() => {
    const chain: PathNode[] = [];
    let cursor = tree;
    for (const key of path) {
      const next = cursor.children.find((c) => c.key === key);
      if (!next) break;
      chain.push(next);
      cursor = next;
    }
    return chain;
  }, [tree, path]);

  // Rows: index 0 = root's children; row i+1 = children of committed[i].
  const rows = useMemo(() => {
    const out: { parent: PathNode; nodes: PathNode[]; selected?: string }[] =
      [];
    const parents = [tree, ...committed];
    for (let i = 0; i < parents.length; i++) {
      const parent = parents[i];
      if (parent.children.length === 0) break;
      const all = parent.children;
      const anyLive = all.some((n) => !isEmptyNode(n));
      // Hide empty tiles in wide rows; keep binary pairs intact so the
      // dichotomy (e.g. In Full / In Partial) stays legible as disabled tiles.
      const nodes =
        anyLive && all.length > 2 ? all.filter((n) => !isEmptyNode(n)) : all;
      out.push({ parent, nodes, selected: committed[i]?.key });
    }
    return out;
  }, [tree, committed]);

  const handleTileClick = useCallback(
    (rowIndex: number, node: PathNode) => {
      setPath((prev) => {
        const base = prev.slice(0, rowIndex);
        // Clicking the committed tile again releases it (prunes below).
        if (prev[rowIndex] === node.key) return base;
        return [...base, node.key];
      });
    },
    []
  );

  /* ---- Connector line measurement ---- */

  const containerRef = useRef<HTMLDivElement | null>(null);
  const tileRefs = useRef(new Map<string, HTMLDivElement>());
  const rowRefs = useRef(new Map<number, HTMLDivElement>());
  const [segments, setSegments] = useState<{ d: string; color: string }[]>([]);

  const committedKeys = committed.map((n) => n.key).join("/");

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    const segs: { d: string; color: string }[] = [];

    committed.forEach((node, i) => {
      const fromEl = tileRefs.current.get(node.key);
      if (!fromEl) return;
      const fr = fromEl.getBoundingClientRect();
      const fx = fr.left + fr.width / 2 - cRect.left;
      const fy = fr.bottom - cRect.top;

      let tx: number;
      let ty: number;
      const childSelected = committed[i + 1]
        ? tileRefs.current.get(committed[i + 1].key)
        : undefined;
      if (childSelected) {
        const tr = childSelected.getBoundingClientRect();
        tx = tr.left + tr.width / 2 - cRect.left;
        ty = tr.top - cRect.top;
      } else {
        const rowEl = rowRefs.current.get(i + 1);
        if (!rowEl || node.children.length === 0) return;
        const rr = rowEl.getBoundingClientRect();
        tx = fx;
        ty = rr.top - cRect.top;
      }
      const midY = (fy + ty) / 2;
      segs.push({
        d: `M ${fx} ${fy} L ${fx} ${midY} L ${tx} ${midY} L ${tx} ${ty}`,
        color: node.color,
      });
    });

    setSegments((prev) => {
      if (
        prev.length === segs.length &&
        prev.every((s, i) => s.d === segs[i].d && s.color === segs[i].color)
      )
        return prev;
      return segs;
    });
  }, [committed]);

  useLayoutEffect(() => {
    measure();
  }, [measure, committedKeys, rows]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(container);
    return () => ro.disconnect();
  }, [measure]);

  /* ---- Derived UI state ---- */

  const tail = committed[committed.length - 1];
  const rowForTail = rows.find((r) => r.parent.key === tail?.key);
  const tailIsTerminal =
    !!tail &&
    (tail.children.length === 0 ||
      (rowForTail !== undefined && rowForTail.nodes.every(isEmptyNode)) ||
      tail.children.every(isEmptyNode));

  return (
    <Box
      sx={{
        borderRadius: "16px",
        border: `1px solid ${T.line}`,
        backgroundColor: T.ink,
        p: { xs: 2, md: 2.5 },
      }}
    >
      {/* Breadcrumb + reset */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 0.75,
          mb: 2,
        }}
      >
        <Crumb
          label="Total Funding"
          color={T.deepWater}
          active={committed.length === 0}
          onClick={() => setPath([])}
        />
        {committed.map((node, i) => (
          <React.Fragment key={node.key}>
            <Typography sx={{ fontSize: 11, color: T.textFaint, px: 0.25 }}>
              ›
            </Typography>
            <Crumb
              label={node.label}
              color={node.color}
              active={i === committed.length - 1}
              onClick={() =>
                setPath(committed.slice(0, i + 1).map((n) => n.key))
              }
            />
          </React.Fragment>
        ))}
        <Box sx={{ flex: 1 }} />
        {committed.length > 0 && (
          <Box
            role="button"
            tabIndex={0}
            onClick={() => setPath([])}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setPath([]);
              }
            }}
            sx={{
              px: 1.25,
              py: 0.4,
              borderRadius: "8px",
              border: `1px solid ${T.line}`,
              color: T.textLo,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              userSelect: "none",
              "&:hover": { color: T.textHi, borderColor: T.textLo },
            }}
          >
            Reset
          </Box>
        )}
      </Box>

      {/* Cascade */}
      <Box ref={containerRef} sx={{ position: "relative" }}>
        {/* Connector overlay threading the committed path */}
        <Box
          component="svg"
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            overflow: "visible",
            zIndex: 0,
          }}
        >
          {segments.map((seg, i) => (
            <g key={i}>
              <path
                d={seg.d}
                fill="none"
                stroke={seg.color}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity={0.65}
              />
              <circle
                cx={parseFloat(seg.d.split(" ")[1])}
                cy={parseFloat(seg.d.split(" ")[2])}
                r={3}
                fill={seg.color}
                opacity={0.9}
              />
            </g>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            position: "relative",
            zIndex: 1,
          }}
        >
          {rows.map((row, rowIndex) => (
            <Box
              key={row.parent.key}
              ref={(el: HTMLDivElement | null) => {
                if (el) rowRefs.current.set(rowIndex, el);
                else rowRefs.current.delete(rowIndex);
              }}
              sx={{
                display: "flex",
                alignItems: "stretch",
                gap: 1.5,
                animation:
                  rowIndex === 0 ? "none" : `${cascadeIn} 240ms ease both`,
                "@media (prefers-reduced-motion: reduce)": {
                  animation: "none",
                },
              }}
            >
              {/* Rotated dimension label on the left edge */}
              <Box
                sx={{
                  width: 24,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    ...display,
                    fontSize: 9.5,
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: T.textFaint,
                    whiteSpace: "nowrap",
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  {row.parent.childDimension ?? ""}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.5,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {row.nodes.map((node) => {
                  const state: TileState = isEmptyNode(node)
                    ? "disabled"
                    : row.selected === node.key
                    ? "selected"
                    : row.selected
                    ? "dimmed"
                    : "idle";
                  return (
                    <PathTile
                      key={node.key}
                      node={node}
                      state={state}
                      dense={rowIndex > 0}
                      onClick={() => handleTileClick(rowIndex, node)}
                      registerRef={(el) => {
                        if (el) tileRefs.current.set(node.key, el);
                        else tileRefs.current.delete(node.key);
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          ))}

          {/* Leaf summary strip */}
          {tailIsTerminal && tail && (
            <Box
              sx={{
                ml: "36px",
                px: 2,
                py: 1.25,
                borderRadius: "10px",
                backgroundColor: T.panelSoft,
                borderLeft: `3px solid ${tail.color}`,
                animation: `${cascadeIn} 240ms ease both`,
                "@media (prefers-reduced-motion: reduce)": {
                  animation: "none",
                },
              }}
            >
              <Typography
                sx={{ fontSize: 12.5, color: T.textLo, lineHeight: 1.5 }}
              >
                {tail.count !== null && (
                  <>
                    <Box component="span" sx={{ color: T.textHi, fontWeight: 600 }}>
                      {tail.count.toLocaleString()}{" "}
                      {tail.count === 1 ? "application" : "applications"}
                    </Box>
                    {" · "}
                  </>
                )}
                <Box component="span" sx={{ color: T.textHi, fontWeight: 600 }}>
                  {money(tail.amount)}
                </Box>{" "}
                {tail.caption}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Breadcrumb chip                                                     */
/* ------------------------------------------------------------------ */

const Crumb: React.FC<{
  label: string;
  color: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, color, active, onClick }) => {
  const T = useSummaryTokens();
  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.25,
        py: 0.4,
        borderRadius: "999px",
        backgroundColor: active ? T.panelSoft : "transparent",
        border: `1px solid ${active ? `${color}66` : T.line}`,
        cursor: "pointer",
        userSelect: "none",
        transition: "border-color 150ms ease, background-color 150ms ease",
        "&:hover": { backgroundColor: T.panelSoft, borderColor: `${color}88` },
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: color,
          flexShrink: 0,
        }}
      />
      <Typography
        sx={{
          ...display,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.06em",
          color: active ? T.textHi : T.textLo,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};
