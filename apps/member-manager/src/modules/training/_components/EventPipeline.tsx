import React, { ReactNode, useState } from 'react';
import {
  RaRecord,
  UpdateParams,
  useDataProvider,
  useRecordContext,
  useRefresh,
} from 'react-admin';
import {
  Alert,
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  Theme,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PublicIcon from '@mui/icons-material/Public';
import CancelIcon from '@mui/icons-material/Cancel';
import RestoreIcon from '@mui/icons-material/Restore';
import authProvider from '../../../authProvider';
import type { ActionManifest, PageCtx } from '../../../framework/manifest';
import SuccessNotification from '../../_components/SuccessNotification';
import HeadingAction, {
  HEADING_ACTION_LABELED_CLASS,
} from '../../_components/heading/HeadingAction';
import EmailModal from '../training-events/components/EventModalEmailDeq';
import PostModal from '../training-events/components/EventModalPostWebsite';
import TrainingStatusChip from './TrainingStatusChip';
import {
  STAGE_ORDER,
  STAGE_META,
  TrainingStatus,
  nextAction,
  canRunAction,
  canCancel,
  canReinstate,
  sendReviewEmail,
} from '../workflow';

/**
 * Training-event pipeline pieces for the framework show / edit pages. The
 * heading bar itself is the framework `TitleBar` (manifest `titleBar`); this
 * file only supplies what goes IN it (title, next-step button, ⋮ menu) and
 * what sits directly BELOW it (`EventPipelineStepper`, top of the page body —
 * the framework has no `subBar` slot).
 */

const EVENT_RESOURCE = 'training-events';

/* ---------- title ---------- */

const EventPipelineTitle = ({
  record,
  isSmall,
}: {
  record?: RaRecord;
  isSmall: boolean;
}) => {
  const status = record?.status as TrainingStatus | undefined;
  const deqNumber = record?.deq_class_number;
  return (
    <Box
      component="span"
      sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}
    >
      <Box component="span" sx={{ whiteSpace: 'nowrap' }}>
        {record?.training_type ?? 'Training Event'}
      </Box>
      {!isSmall && deqNumber && (
        <Box
          component="span"
          sx={{
            color: (theme) => theme.palette.headingBar.muted,
            fontSize: '0.85rem',
            fontWeight: 400,
            textTransform: 'none',
            letterSpacing: 0,
            whiteSpace: 'nowrap',
          }}
        >
          DEQ #{deqNumber}
        </Box>
      )}
      {status && <TrainingStatusChip status={status} />}
    </Box>
  );
};

/** `titleBar.title` for the event show / edit pages. */
export const eventPipelineTitle = (ctx: PageCtx): ReactNode => (
  <EventPipelineTitle record={ctx.record} isSmall={ctx.isSmall} />
);

/* ---------- capability helpers (see the tier mapping in workflow.ts) ---------- */

const capabilities = (ctx: PageCtx) => ({
  canCrud: ctx.can('update', EVENT_RESOURCE),
  canDeq: ctx.can('delete', EVENT_RESOURCE),
});

const useUpdateStatus = () => {
  const record = useRecordContext();
  const dataProvider = useDataProvider();
  const refresh = useRefresh();
  return async (newStatus: TrainingStatus) => {
    if (!record) return;
    const params: UpdateParams = {
      id: record.id,
      previousData: record,
      data: { status: newStatus },
    };
    await dataProvider.update(EVENT_RESOURCE, params);
    refresh();
  };
};

/* ---------- next-step button ---------- */

const actionIcons = {
  'send-review': <UploadFileIcon sx={{ height: 18, width: 18 }} />,
  'send-deq': <SendIcon sx={{ height: 18, width: 18 }} />,
  'post-site': <PublicIcon sx={{ height: 18, width: 18 }} />,
};

const NextActionButton = ({ ctx }: { ctx: PageCtx }) => {
  const record = useRecordContext();
  const updateStatus = useUpdateStatus();
  const [deqModalOpen, setDeqModalOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [notification, setNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');

  const action = nextAction(record?.status);
  if (!record || !action || !canRunAction(action, capabilities(ctx))) return null;

  const notify = (text: string) => {
    setNotificationText(text);
    setNotification(true);
  };

  const handleSendForReview = async () => {
    const identity = await authProvider.getIdentity?.();
    await updateStatus('REVIEW');
    const sent = await sendReviewEmail(record, identity);
    notify(
      sent
        ? 'Event sent for review — the Training Manager has been notified.'
        : 'Event sent for review, but the notification email failed.'
    );
  };

  const runAction = () => {
    if (action.kind === 'send-review') handleSendForReview();
    if (action.kind === 'send-deq') setDeqModalOpen(true);
    if (action.kind === 'post-site') setPostModalOpen(true);
  };

  return (
    <>
      <Button
        // Primary "next step" keeps its text even when heading buttons are
        // icon-only (layout CSS opt-out class).
        className={HEADING_ACTION_LABELED_CLASS}
        variant="contained"
        color="success"
        size="small"
        onClick={runAction}
        endIcon={actionIcons[action.kind]}
        sx={{ boxShadow: 'none', whiteSpace: 'nowrap' }}
      >
        {action.label}
      </Button>
      {/* Mount lazily: both modals dereference the record and fan out
          schedule/instructor queries as soon as they render. */}
      {deqModalOpen && (
        <EmailModal modalIsOpen={deqModalOpen} setModalIsOpen={setDeqModalOpen} />
      )}
      {postModalOpen && (
        <PostModal
          postModalIsOpen={postModalOpen}
          setPostModalIsOpen={setPostModalOpen}
        />
      )}
      <SuccessNotification
        duration={5000}
        notification={notification}
        text={notificationText}
        setSendNotification={setNotification}
      />
    </>
  );
};

/** The single contextual next step (Send for Review / Send to DEQ / Post to Site). */
export const nextActionAction: ActionManifest = {
  id: 'pipeline-next',
  label: 'Next step',
  icon: SendIcon,
  scope: 'record',
  order: 5,
  visible: (ctx) => {
    const action = nextAction(ctx.record?.status);
    return action != null && canRunAction(action, capabilities(ctx));
  },
  component: NextActionButton,
};

/* ---------- ⋮ menu: Cancel / Reinstate ---------- */

const PipelineMenuButton = ({ ctx }: { ctx: PageCtx }) => {
  const record = useRecordContext();
  const updateStatus = useUpdateStatus();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [notification, setNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const { canCrud } = capabilities(ctx);
  const status = record?.status as TrainingStatus | undefined;

  const notify = (text: string) => {
    setNotificationText(text);
    setNotification(true);
  };

  const handleCancel = async () => {
    setMenuAnchor(null);
    await updateStatus('CANCELLED');
    notify('Event cancelled.');
  };

  const handleReinstate = async () => {
    setMenuAnchor(null);
    await updateStatus('DRAFT');
    notify('Event reinstated as a draft.');
  };

  return (
    <>
      <HeadingAction
        icon={<MoreVertIcon fontSize="small" />}
        label="More actions"
        onClick={(e) => setMenuAnchor(e.currentTarget)}
        active={Boolean(menuAnchor)}
      />
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        {canCancel(status, canCrud) && (
          <MenuItem onClick={handleCancel}>
            <ListItemIcon>
              <CancelIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Cancel Event</ListItemText>
          </MenuItem>
        )}
        {canReinstate(status, canCrud) && (
          <MenuItem onClick={handleReinstate}>
            <ListItemIcon>
              <RestoreIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Reinstate Event</ListItemText>
          </MenuItem>
        )}
      </Menu>
      <SuccessNotification
        duration={5000}
        notification={notification}
        text={notificationText}
        setSendNotification={setNotification}
      />
    </>
  );
};

export const pipelineMenuAction: ActionManifest = {
  id: 'pipeline-menu',
  label: 'More actions',
  icon: MoreVertIcon,
  scope: 'record',
  order: 20,
  visible: (ctx) => {
    const { canCrud } = capabilities(ctx);
    const status = ctx.record?.status as string | undefined;
    return canCancel(status, canCrud) || canReinstate(status, canCrud);
  },
  component: PipelineMenuButton,
};

/* ---------- stepper (top of the page body, directly under the TitleBar) ---------- */

/**
 * Stage stepper + cancelled banner. Rendered as the first child of the show /
 * edit body so it sits flush under the framework heading bar.
 */
export const EventPipelineStepper = () => {
  const record = useRecordContext();
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const status = record?.status as TrainingStatus | undefined;
  if (!status) return null;

  if (status === 'CANCELLED') {
    return (
      <Alert severity="error" sx={{ borderRadius: 0 }}>
        This event is cancelled. Reinstate it from the menu in the header to
        continue working on it.
      </Alert>
    );
  }

  const activeStep = STAGE_ORDER.includes(status) ? STAGE_ORDER.indexOf(status) : -1;

  return (
    <Box
      sx={{
        px: { xs: 1, sm: 3 },
        py: 1.5,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
      }}
    >
      <Stepper
        activeStep={activeStep}
        alternativeLabel={!isSmall}
        orientation="horizontal"
        sx={{
          '& .MuiStepLabel-label': { fontSize: '0.72rem', mt: 0.5 },
          ...(isSmall && {
            overflowX: 'auto',
            '& .MuiStepLabel-label': { display: 'none' },
          }),
        }}
      >
        {STAGE_ORDER.map((stage) => (
          <Step key={stage} completed={STAGE_ORDER.indexOf(stage) < activeStep}>
            <StepLabel>
              <Tooltip title={STAGE_META[stage].description} arrow>
                <span>{STAGE_META[stage].shortLabel}</span>
              </Tooltip>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default EventPipelineStepper;
