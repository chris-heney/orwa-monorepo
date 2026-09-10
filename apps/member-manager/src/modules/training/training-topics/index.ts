import GradingIcon from '@mui/icons-material/Grading'
import TopicsCreateForm from './CreateTopics'
import TopicsEditList from './EditTopic'

/** `training-topics` resource props; the list is a framework page (`../manifest.tsx`). */
export default {
  create: TopicsCreateForm,
  edit: TopicsEditList,
  icon: GradingIcon,
  recordRepresentation: 'name',
}
