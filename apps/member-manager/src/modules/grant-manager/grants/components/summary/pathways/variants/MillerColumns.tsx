import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import { IGrantApplication } from "../../../../../grant-application/GrantApplicationTypes";
import { IGrantPayout } from "../../../GrantTypes";
import { APPROVED_STATUSES } from "../../../../helpers/previousFyRollover";
import { useSummaryTokens, display, money, SummaryTokens } from "../../tokens";

export const variantMeta = {
  title: "Miller Columns",
  blurb:
    "Finder-style column drill-down: lock a tile to spawn its children in the next column, with a breadcrumb path bar to jump back.",
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
  color: string;
  amount: number;
  /** null → dollar-only node (rendered without a count, chip-style top). */
  count: number | null;
  children: PathNode[];
}

const cleanMoney = (raw: unknown): number => {
  const n = parseFloat(String(raw ?? "").replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

type Bucket =
  | "denied"
  | "withdrawn"
  | "onHold"
  | "paidFull"
  | "paidPartial"
  | "awaitingPaymentRequest"
  | "needingSignature"
  | "awaitingCommittee"
  | "awaitingApproval";

interface AppFacts {
  bucket: Bucket;
  requested: number;
  award: number;
  paid: number;
}

const gatherFacts = (
  applications: IGrantApplication[],
  payouts: IGrantPayout[]
): AppFacts[] => {
  const facts: AppFacts[] = [];
  for (const app of applications ?? []) {
    const status = app?.status?.name ?? "";
    if (status.includes("PFY")) continue;

    const ownPayouts =
      app.payouts ??
      (payouts ?? []).filter(
        (p) =>
          p?.type !== "Administrative" &&
          p?.application != null &&
          (p.application as IGrantApplication).id === app.id
      );
    const paid = (ownPayouts ?? []).reduce(
      (sum, p) => sum + (p?.amount || 0),
      0
    );
    const requested = cleanMoney(app.requested_grant_amount);
    const award = app.award_amount || 0;

    let bucket: Bucket;
    if (
      status === "Not Approved" ||
      status.startsWith("Denial:") ||
      status === "Inelegible"
    ) {
      bucket = "denied";
    } else if (status === "Withdrawn" || status === "Tabled Application") {
      bucket = "withdrawn";
    } else if (status === "On Hold") {
      bucket = "onHold";
    } else if (APPROVED_STATUSES.includes(status)) {
      if (status === "Paid in Full" || (award > 0 && paid >= award)) {
        bucket = "paidFull";
      } else if (paid > 0) {
        bucket = "paidPartial";
      } else if (status === "Grant Agreement Signed/Sealed/Returned") {
        bucket = "awaitingPaymentRequest";
      } else {
        bucket = "needingSignature";
      }
    } else if (status === "New Application") {
      bucket = "awaitingCommittee";
    } else {
      bucket = "awaitingApproval";
    }
    facts.push({ bucket, requested, award, paid });
  }
  return facts;
};

const sumBy = (
  facts: AppFacts[],
  buckets: Bucket[],
  field: keyof Omit<AppFacts, "bucket">
) =>
  facts
    .filter((f) => buckets.includes(f.bucket))
    .reduce((sum, f) => sum + f[field], 0);

const countBy = (facts: AppFacts[], buckets: Bucket[]) =>
  facts.filter((f) => buckets.includes(f.bucket)).length;

const buildTree = (
  T: SummaryTokens,
  applications: IGrantApplication[],
  payouts: IGrantPayout[],
  fundsAvailable?: number,
  adminAllocation?: number,
  adminDisbursed?: number
): PathNode => {
  const facts = gatherFacts(applications, payouts);

  const leaf = (
    id: string,
    label: string,
    caption: string,
    color: string,
    amount: number,
    count: number | null
  ): PathNode => ({ id, label, caption, color, amount, count, children: [] });

  const branch = (
    id: string,
    label: string,
    caption: string,
    color: string,
    children: PathNode[],
    amountOverride?: number
  ): PathNode => {
    const counted = children.filter((c) => c.count != null);
    return {
      id,
      label,
      caption,
      color,
      amount:
        amountOverride ?? children.reduce((sum, c) => sum + c.amount, 0),
      count:
        counted.length > 0
          ? counted.reduce((sum, c) => sum + (c.count ?? 0), 0)
          : null,
      children,
    };
  };

  /* ---- Administration branch (dollar-only, no application counts) --- */
  const adminAlloc = adminAllocation ?? 0;
  const adminPaid = adminDisbursed ?? 0;

  const adminNode = branch(
    "admin",
    "Administration",
    "program administration pool",
    T.violet,
    [
      branch(
        "admin-available",
        "Available",
        "admin funds not yet committed",
        T.inflow,
        [
          leaf(
            "admin-unapproved",
            "Unapproved",
            "no pending admin requests",
            T.stage.review,
            0,
            null
          ),
        ],
        0
      ),
      branch(
        "admin-unavailable",
        "Unavailable",
        "committed to administration",
        T.committed,
        [
          branch(
            "admin-approved",
            "Approved",
            "approved admin allocation",
            T.stage.approved,
            [
              branch(
                "admin-paid",
                "Paid",
                "admin dollars disbursed",
                T.stage.disbursed,
                [
                  leaf(
                    "admin-paid-full",
                    "In Full",
                    "fully paid admin draws",
                    T.stage.paid,
                    adminPaid,
                    null
                  ),
                  leaf(
                    "admin-paid-partial",
                    "In Partial",
                    "partially paid admin draws",
                    T.stage.disbursed,
                    0,
                    null
                  ),
                ]
              ),
              leaf(
                "admin-invoiced",
                "Invoiced",
                "invoiced, not yet paid",
                T.water,
                0,
                null
              ),
            ],
            adminAlloc
          ),
        ],
        adminAlloc
      ),
    ],
    adminAlloc
  );

  /* ---- Grant branch --------------------------------------------------- */

  // Reserved = requests still holding a claim on the pool (not denied/withdrawn),
  // capped at the pool itself.
  const activeBuckets: Bucket[] = [
    "onHold",
    "paidFull",
    "paidPartial",
    "awaitingPaymentRequest",
    "needingSignature",
    "awaitingCommittee",
    "awaitingApproval",
  ];
  const reserved = Math.min(
    sumBy(facts, activeBuckets, "requested"),
    fundsAvailable ?? Infinity
  );
  const unclaimed = Math.max((fundsAvailable ?? 0) - reserved, 0);

  const denied = leaf(
    "denied",
    "Denied",
    "not approved by committee",
    T.stage.declined,
    sumBy(facts, ["denied"], "requested"),
    countBy(facts, ["denied"])
  );
  const withdrawn = leaf(
    "withdrawn",
    "Withdrawn",
    "withdrawn or tabled",
    T.deepWater,
    sumBy(facts, ["withdrawn"], "requested"),
    countBy(facts, ["withdrawn"])
  );

  const availableNode = branch(
    "available",
    "Available",
    "funds released back to the pool",
    T.inflow,
    [
      branch(
        "unapproved",
        "Unapproved",
        "requests that exited the pipeline",
        T.exit,
        [denied, withdrawn]
      ),
      leaf(
        "unclaimed",
        "Unclaimed",
        "pool dollars nobody has requested",
        T.inflow,
        unclaimed,
        null
      ),
    ]
  );

  const paidInFull = leaf(
    "paid-full",
    "Paid in Full",
    "award fully disbursed",
    T.stage.paid,
    sumBy(facts, ["paidFull"], "paid"),
    countBy(facts, ["paidFull"])
  );
  const paidInPartial = leaf(
    "paid-partial",
    "Paid in Partial",
    "award partially disbursed",
    T.stage.disbursed,
    sumBy(facts, ["paidPartial"], "paid"),
    countBy(facts, ["paidPartial"])
  );
  const disbursedNode = branch(
    "disbursed",
    "Disbursed",
    "money has moved",
    T.stage.disbursed,
    [paidInFull, paidInPartial]
  );

  const needingSignature = leaf(
    "needing-signature",
    "Needing Signature",
    "agreement not yet signed",
    T.stage.signed,
    sumBy(facts, ["needingSignature"], "award"),
    countBy(facts, ["needingSignature"])
  );
  const awaitingPaymentRequest = leaf(
    "awaiting-payment-request",
    "Awaiting Payment Request",
    "signed, no draw requested",
    T.stage.awaiting,
    sumBy(facts, ["awaitingPaymentRequest"], "award"),
    countBy(facts, ["awaitingPaymentRequest"])
  );
  const undisbursedNode = branch(
    "undisbursed",
    "Undisbursed",
    "committed, not yet moved",
    T.committed,
    [needingSignature, awaitingPaymentRequest]
  );

  const approvedBuckets: Bucket[] = [
    "paidFull",
    "paidPartial",
    "awaitingPaymentRequest",
    "needingSignature",
  ];
  const approvedNode = branch(
    "approved",
    "Approved",
    "committee-committed awards",
    T.stage.approved,
    [disbursedNode, undisbursedNode],
    sumBy(facts, approvedBuckets, "award")
  );

  const underReviewNode = branch(
    "under-review",
    "Under Review",
    "requests in the pipeline",
    T.stage.review,
    [
      leaf(
        "awaiting-approval",
        "Awaiting Approval",
        "reviewed, decision pending",
        T.stage.review,
        sumBy(facts, ["awaitingApproval"], "requested"),
        countBy(facts, ["awaitingApproval"])
      ),
      leaf(
        "awaiting-committee",
        "Awaiting Committee",
        "new, not yet reviewed",
        T.stage.received,
        sumBy(facts, ["awaitingCommittee"], "requested"),
        countBy(facts, ["awaitingCommittee"])
      ),
    ]
  );

  const onHoldNode = leaf(
    "on-hold",
    "On Hold",
    "paused by committee",
    T.violet,
    sumBy(facts, ["onHold"], "requested"),
    countBy(facts, ["onHold"])
  );

  const reservedNode = branch(
    "reserved",
    "Unavailable (Reserved)",
    "pool dollars spoken for",
    T.committed,
    [approvedNode, underReviewNode, onHoldNode],
    reserved
  );

  const grantNode = branch(
    "grant",
    "Grant",
    "the grant funding pool",
    T.water,
    [availableNode, reservedNode]
  );

  return branch(
    "root",
    "Total Funding",
    "every program dollar",
    T.deepWater,
    [adminNode, grantNode]
  );
};

/* ------------------------------------------------------------------ */
/* Tiles                                                               */
/* ------------------------------------------------------------------ */

const isZeroNode = (node: PathNode) =>
  (node.count ?? 0) === 0 && node.amount === 0;

/** Children that would actually render as a column (empty ⇒ leaf). */
const drillableChildren = (node: PathNode): PathNode[] =>
  node.children.some((c) => !isZeroNode(c)) ? node.children : [];

const ColumnTile: React.FC<{
  node: PathNode;
  selected: boolean;
  dimmed: boolean;
  disabled: boolean;
  hasChildren: boolean;
  onClick: () => void;
  registerEl: (el: HTMLElement | null) => void;
}> = ({ node, selected, dimmed, disabled, hasChildren, onClick, registerEl }) => {
  const T = useSummaryTokens();
  const count = node.count;

  return (
    <Tooltip title={`${node.label} — ${node.caption}`} arrow placement="right">
      <Box
        component="button"
        type="button"
        ref={registerEl}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        aria-pressed={selected}
        sx={{
          all: "unset",
          boxSizing: "border-box",
          display: "block",
          width: "100%",
          cursor: disabled ? "default" : "pointer",
          position: "relative",
          borderRadius: "14px",
          overflow: "hidden",
          backgroundColor: selected ? T.panelSoft : T.panel,
          border: `1px solid ${selected ? `${node.color}88` : T.line}`,
          boxShadow: selected ? `0 0 0 1px ${node.color}66` : "none",
          opacity: disabled ? 0.38 : dimmed ? 0.5 : 1,
          transition:
            "transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease, border-color 180ms ease",
          "&:hover": disabled
            ? {}
            : {
                transform: "translateY(-3px)",
                boxShadow: `${T.hoverShadow}, 0 0 0 1px ${node.color}55`,
                opacity: 1,
              },
          "&:focus-visible": {
            boxShadow: `0 0 0 2px ${node.color}`,
          },
          "@media (prefers-reduced-motion: reduce)": {
            transition: "opacity 180ms ease",
            "&:hover": { transform: "none" },
          },
        }}
      >
        {/* Top half — duotone wash, label + count (or dollar figure) */}
        <Box
          sx={{
            px: 2,
            pt: 1.5,
            pb: 1,
            background: `linear-gradient(135deg, ${node.color}26 0%, transparent 65%)`,
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
            {hasChildren ? (
              <Typography
                aria-hidden
                sx={{
                  fontSize: 14,
                  lineHeight: 1,
                  color: selected ? node.color : T.textFaint,
                  transition: "color 180ms ease",
                }}
              >
                ›
              </Typography>
            ) : (
              /* End-of-path terminus dot */
              <Box
                aria-hidden
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  flexShrink: 0,
                  backgroundColor: selected ? node.color : "transparent",
                  border: `1.5px solid ${selected ? node.color : T.textFaint}`,
                  transition:
                    "background-color 180ms ease, border-color 180ms ease",
                }}
              />
            )}
          </Box>

          {count == null ? (
            <Typography
              sx={{
                ...display,
                fontSize: 22,
                fontWeight: 700,
                color: node.amount < 0 ? T.exit : T.textHi,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1.3,
                pt: 0.25,
              }}
            >
              {money(node.amount)}
            </Typography>
          ) : (
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
              <Typography
                sx={{
                  ...display,
                  fontSize: 26,
                  fontWeight: 700,
                  color: T.textHi,
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: 1.15,
                }}
              >
                {count.toLocaleString()}
              </Typography>
              <Typography sx={{ fontSize: 11, color: T.textLo }}>
                {count === 1 ? "app" : "apps"}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Stage-colored divider */}
        <Box
          sx={{
            height: 2,
            backgroundColor: node.color,
            opacity: selected ? 1 : 0.85,
          }}
        />

        {/* Bottom half — dollars + caption (caption only for dollar-only) */}
        <Box sx={{ px: 2, py: 1.25 }}>
          {count != null && (
            <Typography
              sx={{
                ...display,
                fontSize: 17,
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
            {!hasChildren && selected ? "end of path" : node.caption}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
};

/* ------------------------------------------------------------------ */
/* Breadcrumb path bar                                                 */
/* ------------------------------------------------------------------ */

const PathBar: React.FC<{
  root: PathNode;
  pathNodes: PathNode[];
  onJump: (depth: number) => void;
}> = ({ root, pathNodes, onJump }) => {
  const T = useSummaryTokens();
  const crumbs = [root, ...pathNodes];
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 0.75,
        px: 1.5,
        py: 1,
        borderRadius: "12px",
        backgroundColor: T.panel,
        border: `1px solid ${T.line}`,
      }}
    >
      {crumbs.map((node, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <React.Fragment key={node.id}>
            {i > 0 && (
              <Typography
                aria-hidden
                sx={{ fontSize: 12, color: T.textFaint, userSelect: "none" }}
              >
                ›
              </Typography>
            )}
            <Box
              component="button"
              type="button"
              onClick={() => onJump(i)}
              sx={{
                all: "unset",
                cursor: "pointer",
                px: 1,
                py: 0.4,
                borderRadius: "8px",
                backgroundColor: isLast ? `${node.color}22` : "transparent",
                border: `1px solid ${isLast ? `${node.color}66` : "transparent"}`,
                transition:
                  "background-color 160ms ease, border-color 160ms ease",
                "&:hover": {
                  backgroundColor: `${node.color}1a`,
                  border: `1px solid ${node.color}44`,
                },
                "&:focus-visible": { boxShadow: `0 0 0 2px ${node.color}` },
              }}
            >
              <Typography
                sx={{
                  ...display,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: isLast ? node.color : T.textLo,
                  whiteSpace: "nowrap",
                }}
              >
                {node.label}
              </Typography>
            </Box>
          </React.Fragment>
        );
      })}
      {pathNodes.length === 0 && (
        <Typography sx={{ fontSize: 11, color: T.textFaint, pl: 0.5 }}>
          — pick a tile to drill down
        </Typography>
      )}
    </Box>
  );
};

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function MillerColumns({
  applications,
  payouts,
  fundsAvailable,
  adminAllocation,
  adminDisbursed,
}: Props) {
  const T = useSummaryTokens();

  const root = useMemo(
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

  // Selection stored as node-id path so the tree can rebuild freely.
  // Auto-open the Grant branch — it's where the interesting story lives.
  const [path, setPath] = useState<string[]>(["grant"]);

  // Resolve ids → nodes, dropping any suffix that no longer exists.
  const pathNodes = useMemo(() => {
    const nodes: PathNode[] = [];
    let cursor = root;
    for (const id of path) {
      const next = drillableChildren(cursor).find((c) => c.id === id);
      if (!next) break;
      nodes.push(next);
      cursor = next;
    }
    return nodes;
  }, [root, path]);

  // Column i shows the children of the node selected at depth i-1
  // (column 0 shows the root's children).
  const columns = useMemo(() => {
    const cols: { parent: PathNode; nodes: PathNode[] }[] = [
      { parent: root, nodes: drillableChildren(root) },
    ];
    for (const node of pathNodes) {
      const kids = drillableChildren(node);
      if (kids.length > 0) cols.push({ parent: node, nodes: kids });
    }
    return cols;
  }, [root, pathNodes]);

  // FLIP reorder: tiles register their DOM node here; after each render we
  // compare every tile's top edge to its previous position and glide it into
  // the new slot (selected tiles float to the top of their column).
  const tileEls = useRef(new Map<string, HTMLElement>());
  const tileTops = useRef(new Map<string, number>());
  const registerTile = (id: string) => (el: HTMLElement | null) => {
    if (el) tileEls.current.set(id, el);
    else tileEls.current.delete(id);
  };
  useLayoutEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const nextTops = new Map<string, number>();
    tileEls.current.forEach((el, id) => {
      const top = el.getBoundingClientRect().top;
      nextTops.set(id, top);
      const prev = tileTops.current.get(id);
      if (
        !reduced &&
        prev != null &&
        Math.abs(prev - top) > 1 &&
        typeof el.animate === "function"
      ) {
        el.animate(
          [
            { transform: `translateY(${prev - top}px)` },
            { transform: "translateY(0)" },
          ],
          { duration: 260, easing: "cubic-bezier(0.2, 0, 0, 1)" }
        );
      }
    });
    tileTops.current = nextTops;
  });

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({
      left: el.scrollWidth,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [columns.length]);

  const select = (depth: number, node: PathNode) =>
    setPath((prev) => {
      const next = pathNodes.slice(0, depth).map((n) => n.id);
      // Re-clicking the selected tile toggles it (and its subtree) off.
      if (pathNodes[depth]?.id !== node.id) next.push(node.id);
      return next.length === 0 && prev.length === 0 ? prev : next;
    });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <PathBar
        root={root}
        pathNodes={pathNodes}
        onJump={(depth) =>
          setPath(pathNodes.slice(0, depth).map((n) => n.id))
        }
      />

      <Box
        ref={scrollerRef}
        sx={{
          display: "flex",
          alignItems: "stretch",
          gap: 1.5,
          overflowX: "auto",
          pb: 1,
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { height: 8 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: T.line,
            borderRadius: 4,
          },
        }}
      >
        {columns.map((col, depth) => {
          const selectedId = pathNodes[depth]?.id;
          const decided = selectedId != null;
          // Once decided, float the locked-in tile to the top so the selected
          // path reads straight across the top row of every column.
          const orderedNodes = decided
            ? [
                ...col.nodes.filter((n) => n.id === selectedId),
                ...col.nodes.filter((n) => n.id !== selectedId),
              ]
            : col.nodes;
          return (
            <Box
              key={col.parent.id}
              sx={{
                flex: "0 0 auto",
                width: 224,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                pr: 1.5,
                borderRight:
                  depth < columns.length - 1
                    ? `1px solid ${T.line}`
                    : "1px solid transparent",
                "@keyframes millerColIn": {
                  from: { opacity: 0, transform: "translateX(-14px)" },
                  to: { opacity: 1, transform: "translateX(0)" },
                },
                animation: "millerColIn 240ms ease both",
                "@media (prefers-reduced-motion: reduce)": {
                  animation: "none",
                },
              }}
            >
              <Typography
                sx={{
                  ...display,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: T.textFaint,
                  px: 0.5,
                }}
              >
                {depth === 0 ? "Total Funding" : `Inside ${col.parent.label}`}
              </Typography>
              {orderedNodes.map((node) => (
                <ColumnTile
                  key={node.id}
                  node={node}
                  selected={selectedId === node.id}
                  dimmed={decided && selectedId !== node.id}
                  disabled={isZeroNode(node)}
                  hasChildren={drillableChildren(node).length > 0}
                  onClick={() => select(depth, node)}
                  registerEl={registerTile(node.id)}
                />
              ))}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
