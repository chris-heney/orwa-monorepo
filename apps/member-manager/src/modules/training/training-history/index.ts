import GradingIcon from '@mui/icons-material/Grading'
import TrainingHistoryCreate from './TrainingHistoryCreate'
import TrainingHistoryEdit from './TrainingHistoryEdit'
import TrainingHistoryShow from './TrainingHistoryShow'

/** `training-event-logs` resource props; the list is a framework page (`../manifest.tsx`). */
export default {
  create: TrainingHistoryCreate,
  edit: TrainingHistoryEdit,
  show: TrainingHistoryShow,
  icon: GradingIcon,
}
