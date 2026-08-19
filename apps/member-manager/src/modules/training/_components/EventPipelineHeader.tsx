import React, { useState } from 'react';
import {
  UpdateParams,
  useDataProvider,
  useRecordContext,
  useRefresh,
} from 'react-admin';
import {
  Alert,
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PublicIcon from '@mui/icons-material/Public';
import CancelIcon from '@mui/icons-material/Cancel';
import RestoreIcon from '@mui/icons-material/Restore';
import authProvider from '../../../authProvider';
import SuccessNotification from '../../_components/SuccessNotification';
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
import { useCan } from '../../rbac-manager/useCan';

interface EventPipelineHeaderProps {
  context: 'edit' | 'create' | 'show';
}

const actionIcons = {
  'send-review': <UploadFileIcon sx={{ height: 18, width: 18 }} />,
  'send-deq': <SendIcon sx={{ height: 18, width: 18 }} />,
  'post-site': <PublicIcon sx={{ height: 18, width: 18 }} />,
};

/**
 * Sticky pipeline header for training event pages: title + status chip in a
 * dark bar, a stage stepper, and the single contextual next action.
 * Cancel/Reinstate live in the overflow menu.
 */
const EventPipelineHeader = ({ context }: EventPipelineHeaderProps) => {
  const record = useRecordContext();
  const dataProvider = useDataProvider();
  const refresh = useRefresh();
  const { can } = useCan();
  // Workflow capability tiers — see the tier mapping doc in workflow.ts.
  const canCrud = can('update', 'training-event');
  const canDeq = can('delete', 'training-event');
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [deqModalOpen, setDeqModalOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [notification, setNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');

  const status = record?.status as TrainingStatus | undefined;
  const action = context === 'create' ? null : nextAction(status);
  const showAction =
    action != null && canRunAction(action, { canCrud, canDeq });

  const notify = (text: string) => {
    setNotificationText(text);
    setNotification(true);
  };

  const updateStatus = async (newStatus: TrainingStatus) => {
    if (!record) return;
    const params: UpdateParams = {
      id: record.id,
      previousData: record,
      data: { status: newStatus },
    };
    await dataProvider.update('training-events', params);
    refresh();
  };

  const handleSendForReview = async () => {
    if (!record) return;
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
    if (!action) return;
    if (action.kind === 'send-review') handleSendForReview();
    if (action.kind === 'send-deq') setDeqModalOpen(true);
    if (action.kind === 'post-site') setPostModalOpen(true);
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

  const title =
    context === 'create'
      ? 'New Training Event'
      : record?.training_type ?? 'Training Event';

  const deqNumber = record?.deq_class_number;

  const activeStep =
    status && STAGE_ORDER.includes(status) ? STAGE_ORDER.indexOf(status) : -1;

  return (
    <>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: '#262626',
          px: 1.5,
          py: 0.75,
          minHeight: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}
        >
          <Typography
            variant="h6"
            component="h1"
            noWrap
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              fontSize: isSmall ? '0.8rem' : undefined,
            }}
          >
            {title}
          </Typography>
          {!isSmall && deqNumber && (
            <Typography sx={{ color: 'grey.400', fontSize: '0.85rem' }} noWrap>
              DEQ #{deqNumber}
            </Typography>
          )}
          {status && <TrainingStatusChip status={status} />}
        </Box>
        {context !== 'create' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showAction && (
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={runAction}
                endIcon={actionIcons[action.kind]}
                sx={{ boxShadow: 'none', whiteSpace: 'nowrap' }}
              >
                {action.label}
              </Button>
            )}
            {(canCancel(status, canCrud) || canReinstate(status, canCrud)) && (
              <Tooltip title="More actions">
                <IconButton
                  size="small"
                  onClick={(e) => setMenuAnchor(e.currentTarget)}
                  sx={{ color: 'grey.400', '&:hover': { color: 'white' } }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
      </Box>

      {context !== 'create' && status === 'CANCELLED' && (
        <Alert severity="error" sx={{ borderRadius: 0 }}>
          This event is cancelled. Reinstate it from the menu in the header to
          continue working on it.
        </Alert>
      )}

      {context !== 'create' && status && status !== 'CANCELLED' && (
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
              <Step
                key={stage}
                completed={STAGE_ORDER.indexOf(stage) < activeStep}
              >
                <StepLabel>
                  <Tooltip title={STAGE_META[stage].description} arrow>
                    <span>{STAGE_META[stage].shortLabel}</span>
                  </Tooltip>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}

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

      {/* Mount lazily: both modals dereference the record and fan out
          schedule/instructor queries as soon as they render. */}
      {record && deqModalOpen && (
        <EmailModal
          modalIsOpen={deqModalOpen}
          setModalIsOpen={setDeqModalOpen}
        />
      )}
      {record && postModalOpen && (
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

export default EventPipelineHeader;
