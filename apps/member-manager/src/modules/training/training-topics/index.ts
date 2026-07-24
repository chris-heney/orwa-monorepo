import GradingIcon from '@mui/icons-material/Grading'
import TopicsCreateForm from './CreateTopics'
import TopicsEditList from './EditTopic'
import TopicsList from './TopicsList'

export default {
  list: TopicsList,
  create: TopicsCreateForm,
  edit: TopicsEditList,
  icon: GradingIcon,
  recordRepresentation: 'name',
}
