import EmailIcon from '@mui/icons-material/Email'
import { ScheduledTasksStandaloneList } from './ScheduledTaskList'
import ShowEmailTask from './ShowEmailTask'
import CreateEmailTask from './CreateEmailTask'
import EditEmailTask from './EditEmailTask'

export default {
  list: ScheduledTasksStandaloneList,
  create: CreateEmailTask,
  show: ShowEmailTask,
  edit: EditEmailTask,
  icon: EmailIcon,
  recordRepresentation: 'name',
}
