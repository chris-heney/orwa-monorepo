import { RaRecord, UserIdentity } from 'react-admin';
import { YearMonthDay } from '../../helpers/Data';

/**
 * Single source of truth for the training event pipeline:
 * stage order/metadata, transitions, capability gates, and review-email config.
 * Consumed by EventPipelineHeader, EventListActionsMenu, dashboard cards,
 * and TrainingStatusChip so the workflow can never diverge between surfaces.
 */

export type TrainingStatus =
  | 'DRAFT'
  | 'REVIEW'
  | 'DEQ'
  | 'RSVP'
  | 'LIVE'
  | 'COMPLETE'
  | 'CANCELLED';

/** Pipeline stages in order. CANCELLED sits outside the pipeline. */
export const STAGE_ORDER: TrainingStatus[] = [
  'DRAFT',
  'REVIEW',
  'DEQ',
  'RSVP',
  'LIVE',
  'COMPLETE',
];

type StageMeta = {
  label: string;
  shortLabel: string;
  description: string;
  /** Theme-safe chip colors: [light bg, light fg, dark bg, dark fg] */
  chip: { bg: string; fg: string; darkBg: string; darkFg: string };
};

export const STAGE_META: Record<TrainingStatus, StageMeta> = {
  DRAFT: {
    label: 'Draft',
    shortLabel: 'Draft',
    description: 'Being put together. Send it for review when ready.',
    chip: {
      bg: '#e0e0e0',
      fg: '#424242',
      darkBg: '#4a4a4a',
      darkFg: '#e0e0e0',
    },
  },
  REVIEW: {
    label: 'In Review',
    shortLabel: 'Review',
    description: 'Waiting on the Training Manager to review and send to DEQ.',
    chip: {
      bg: '#fff3e0',
      fg: '#e65100',
      darkBg: '#5d4037',
      darkFg: '#ffcc80',
    },
  },
  DEQ: {
    label: 'At DEQ',
    shortLabel: 'DEQ',
    description:
      'Submitted to DEQ. Waiting on a class number, then post to the site.',
    chip: {
      bg: '#e3f2fd',
      fg: '#0d47a1',
      darkBg: '#1a3a5c',
      darkFg: '#90caf9',
    },
  },
  RSVP: {
    label: 'Open for RSVP',
    shortLabel: 'RSVP',
    description: 'Posted to the website. Attendees can register.',
    chip: {
      bg: '#e8f5e9',
      fg: '#1b5e20',
      darkBg: '#1b3a1e',
      darkFg: '#a5d6a7',
    },
  },
  LIVE: {
    label: 'Live',
    shortLabel: 'Live',
    description: 'The event is happening right now.',
    chip: {
      bg: '#e8eaf6',
      fg: '#283593',
      darkBg: '#2c3160',
      darkFg: '#b3baf7',
    },
  },
  COMPLETE: {
    label: 'Complete',
    shortLabel: 'Done',
    description: 'The event has ended.',
    chip: {
      bg: '#f1f8e9',
      fg: '#33691e',
      darkBg: '#33411f',
      darkFg: '#c5e1a5',
    },
  },
  CANCELLED: {
    label: 'Cancelled',
    shortLabel: 'Cancelled',
    description: 'The event was cancelled. It can be reinstated to Draft.',
    chip: {
      bg: '#ffebee',
      fg: '#b71c1c',
      darkBg: '#5c2626',
      darkFg: '#ef9a9a',
    },
  },
};

/**
 * Capability tiers replacing the old hard-coded role-name lists
 * (`CRUD_ROLES`/`DEQ_ROLES`). Callers compute them once via `useCan()`:
 *
 * - `canCrud` = `can('update', 'training-event')` — general editing + pipeline
 *   actions up to REVIEW (send for review, cancel, reinstate).
 * - `canDeq` = `can('delete', 'training-event')` — the elevated training
 *   privilege: send to DEQ, post to the website, and delete events.
 *
 * For role admins: granting a role training-event **update** unlocks the
 * CRUD tier; additionally granting training-event **delete** unlocks the
 * DEQ tier (including the Delete Event action).
 */
export type WorkflowCapabilities = {
  canCrud: boolean;
  canDeq: boolean;
};

export type NextAction = {
  /** Button label */
  label: string;
  /** Which UI flow the action triggers */
  kind: 'send-review' | 'send-deq' | 'post-site';
  /** Capability tier required to perform it */
  tier: 'crud' | 'deq';
};

/** The single contextual next action for a stage (null = nothing to do). */
export const nextAction = (status?: string): NextAction | null => {
  switch (status) {
    case 'DRAFT':
      return { label: 'Send for Review', kind: 'send-review', tier: 'crud' };
    case 'REVIEW':
      return { label: 'Send to DEQ', kind: 'send-deq', tier: 'deq' };
    case 'DEQ':
      return { label: 'Post to Site', kind: 'post-site', tier: 'deq' };
    default:
      return null;
  }
};

/** Whether the caller's capability tier allows the given next action. */
export const canRunAction = (
  action: NextAction,
  { canCrud, canDeq }: WorkflowCapabilities
): boolean => (action.tier === 'deq' ? canDeq : canCrud);

/** Stages from which an event can be cancelled. */
export const canCancel = (
  status: string | undefined,
  canCrud: boolean
): boolean =>
  !!status &&
  ['DRAFT', 'REVIEW', 'DEQ', 'RSVP', 'LIVE'].includes(status) &&
  canCrud;

export const canReinstate = (
  status: string | undefined,
  canCrud: boolean
): boolean => status === 'CANCELLED' && canCrud;

/** Review notification config — production recipient. */
export const REVIEW_EMAIL = {
  to: 'dhall@orwa.org',
  templateId: 2,
};

/**
 * Notify the Training Manager that an event is ready for review.
 * Returns true when the mailer accepted the request.
 */
export const sendReviewEmail = async (
  record: RaRecord,
  identity: UserIdentity | undefined
): Promise<boolean> => {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-US', YearMonthDay);
  try {
    const response = await fetch(`${import.meta.env.VITE_MAILER_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${identity?.token}`,
      },
      body: JSON.stringify({
        to: REVIEW_EMAIL.to,
        from: identity?.id,
        subject: `Review Training Event - ${record.training_type ?? ''} ${fmt(
          record.start
        )} - ${fmt(record.end)}`,
        templateId: REVIEW_EMAIL.templateId,
        variables: {
          event_link: `https://orwa.org/member-manager/#/training-events/${record.id}/show`,
        },
      }),
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to send review email', error);
    return false;
  }
};
