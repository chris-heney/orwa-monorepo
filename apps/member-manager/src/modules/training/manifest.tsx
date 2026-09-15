import TrainingIcon from '@mui/icons-material/ModelTraining';
import type {
  ActionManifest,
  ModuleManifest,
  PageCtx,
} from '../../framework/manifest';
import { pageView } from '../../framework/registry';
import {
  columnsAction,
  createAction,
  editRecordAction,
  exportAction,
  recordId,
  showRecordAction,
} from '../../framework/actions';
import TrainingEvent from './training-events';
import TrainingHistory from './training-history';
import Topics from './training-topics';
import TrainingSettings from './settings';
import EventRegistration from '../event-registration';
import Instructors from '../human-resources/instructors';
import TrainingInstructorCertification from '../human-resources/certification';
import TrainingDashboard, {
  TRAINING_DASHBOARD_INFO,
} from './dashboard/TrainingDashboard';
import TrainingEventList, {
  TRAINING_EVENTS_PREFERENCE_KEY,
} from './training-events/TrainingEventList';
import EventListFilter from './training-events/components/EventListFilter';
import TrainingEventShow from './training-events/TrainingEventShow';
import TrainingEventEdit from './training-events/TrainingEventEdit';
import TrainingEventCreate from './training-events/TrainingEventCreate';
import TrainingHistoryList, {
  TRAINING_HISTORY_PREFERENCE_KEY,
} from './training-history/TrainingHistoryList';
import TopicsList, {
  TRAINING_TOPICS_PREFERENCE_KEY,
} from './training-topics/TopicsList';
import TrainingRegistrationsList, {
  TRAINING_REGISTRATIONS_PREFERENCE_KEY,
} from './training-registrations/TrainingRegistrationsList';
import {
  eventPipelineTitle,
  nextActionAction,
  pipelineMenuAction,
} from './_components/EventPipeline';
import { datagridExporter } from './_components/datagridExporter';

const EVENTS = 'training-events';

/** Column picker only acts on the already-fetched grid; the mobile grids are cards. */
const columnsDesktop: ActionManifest = {
  ...columnsAction,
  visible: (ctx: PageCtx) => !ctx.isSmall,
};

/** Edit → back to the record's show page (list until the record has loaded). */
const backToEventShow = (ctx: PageCtx) => {
  const id = recordId(ctx);
  return id ? `/${EVENTS}/${id}/show` : `/${EVENTS}`;
};

/**
 * Training Manager — dashboard + four tab-less `kind: 'list'` pages mounted as
 * the resources' list views, and the training-event create / show / edit
 * pages whose pipeline heading (title chip, next step, ⋮ menu, Back) is the
 * framework TitleBar with the stage stepper as the top of the body.
 *
 * `list.storeKey` keeps react-admin's legacy `<resource>.listParams` keys so
 * saved sort / per-page / filter prefs survive the migration.
 */
export const trainingModule: ModuleManifest = {
  id: 'training',
  title: 'Training Manager',
  icon: TrainingIcon,
  menu: {
    label: 'Training Manager',
    to: '/training/dashboard',
    children: [
      { name: 'training-dashboard', label: 'Training Dashboard', to: '/training/dashboard' },
      { name: 'training-events', label: 'Training Events', to: '/training-events' },
      { name: 'training-event-logs', label: 'Training History', to: '/training-event-logs' },
      { name: 'training-settings', label: 'Settings', to: '/training-settings/1/edit' },
    ],
  },
  permissions: {
    pathPrefixes: [
      '/training/dashboard',
      '/training-events',
      '/training-event-logs',
      '/training-settings',
      '/training-event-registrations',
      '/training-schedule-blocks',
      '/training-instructors',
      '/training-topics',
      '/training-instructor-certifications',
    ],
    resources: [
      'training-events',
      'training-event-logs',
      'training-event-registrations',
      'training-schedule-blocks',
      'training-instructors',
      'training-topics',
      'training-settings',
      'training-instructor-certifications',
    ],
  },
  resources: {
    'training-events': {
      ...TrainingEvent,
      list: pageView('training.events'),
      create: pageView('training.eventCreate'),
      edit: pageView('training.eventEdit'),
      show: pageView('training.eventShow'),
    },
    'training-event-logs': {
      ...TrainingHistory,
      list: pageView('training.history'),
    },
    'training-event-registrations': {
      ...EventRegistration,
      list: pageView('training.registrations'),
    },
    'training-schedule-blocks': {},
    'training-instructors': Instructors,
    'training-topics': {
      ...Topics,
      list: pageView('training.topics'),
    },
    'training-settings': TrainingSettings,
    'training-instructor-certifications': TrainingInstructorCertification,
  },
  pages: [
    {
      id: 'training.dashboard',
      route: 'training/dashboard',
      kind: 'dashboard',
      titleBar: {
        title: 'Training Dashboard',
        infoTooltip: TRAINING_DASHBOARD_INFO,
      },
      body: TrainingDashboard,
    },
    {
      id: 'training.events',
      kind: 'list',
      titleBar: {
        title: 'Training Events',
        infoTooltip:
          'Create training events and move them through the pipeline: Draft → Review → DEQ → RSVP → Live → Complete.',
        showCount: true,
      },
      list: {
        resource: EVENTS,
        storeKey: EVENTS,
        sort: { field: 'start', order: 'DESC' },
        perPage: 10,
        exporter: datagridExporter(TRAINING_EVENTS_PREFERENCE_KEY, 'Training Events'),
        filterBody: EventListFilter,
      },
      actions: [
        createAction(EVENTS, { label: 'New Event' }),
        exportAction,
        columnsDesktop,
      ],
      body: TrainingEventList,
    },
    {
      id: 'training.history',
      kind: 'list',
      titleBar: {
        title: 'Training History',
        infoTooltip: 'Attendance and credit-hour records from event check-ins.',
        showCount: true,
      },
      list: {
        resource: 'training-event-logs',
        storeKey: 'training-event-logs',
        sort: { field: 'createdAt', order: 'DESC' },
        perPage: 10,
        exporter: datagridExporter(TRAINING_HISTORY_PREFERENCE_KEY, 'Training History'),
        filtersDrawer: false,
      },
      actions: [
        createAction('training-event-logs', { label: 'New Record' }),
        exportAction,
        columnsDesktop,
      ],
      body: TrainingHistoryList,
    },
    {
      id: 'training.registrations',
      kind: 'list',
      titleBar: {
        title: 'Class Rosters',
        infoTooltip: 'Attendees registered for DEQ-numbered training events.',
        showCount: true,
      },
      list: {
        resource: 'training-event-registrations',
        sort: { field: 'id', order: 'ASC' },
        perPage: 10,
        exporter: datagridExporter(TRAINING_REGISTRATIONS_PREFERENCE_KEY, 'Class Roster'),
        filtersDrawer: false,
      },
      actions: [
        createAction('training-event-registrations', { label: 'Register Attendee' }),
        exportAction,
        columnsDesktop,
      ],
      body: TrainingRegistrationsList,
    },
    {
      id: 'training.topics',
      kind: 'list',
      titleBar: {
        title: 'Training Topics',
        showCount: true,
      },
      list: {
        resource: 'training-topics',
        storeKey: 'training-topics',
        sort: { field: 'id', order: 'ASC' },
        perPage: 10,
        exporter: datagridExporter(TRAINING_TOPICS_PREFERENCE_KEY, 'TopicsList'),
        filtersDrawer: false,
      },
      actions: [
        createAction('training-topics', { label: 'New Topics' }),
        exportAction,
        columnsDesktop,
      ],
      body: TopicsList,
    },
    {
      id: 'training.eventCreate',
      kind: 'create',
      titleBar: {
        title: 'New Training Event',
        appBarTitle: 'Training Events',
        back: `/${EVENTS}`,
      },
      body: TrainingEventCreate,
    },
    {
      id: 'training.eventShow',
      kind: 'show',
      record: { resource: EVENTS },
      titleBar: {
        title: eventPipelineTitle,
        appBarTitle: 'Training Events',
        back: `/${EVENTS}`,
      },
      actions: [nextActionAction, editRecordAction(EVENTS), pipelineMenuAction],
      body: TrainingEventShow,
    },
    {
      id: 'training.eventEdit',
      kind: 'edit',
      record: { resource: EVENTS, mutationMode: 'pessimistic' },
      titleBar: {
        title: eventPipelineTitle,
        appBarTitle: 'Training Events',
        back: backToEventShow,
      },
      actions: [nextActionAction, showRecordAction(EVENTS), pipelineMenuAction],
      body: TrainingEventEdit,
    },
  ],
};

export default trainingModule;
