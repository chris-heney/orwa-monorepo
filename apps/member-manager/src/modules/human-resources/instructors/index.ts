import GradingIcon from '@mui/icons-material/Grading'
import TrainerCreateForm from './CreateInstructor'
import TrainerListForm from './InstructorList'
import TrainerShow from './InstructorShow'
import InstructorEdit from './InstructorEdit'

export default {
  list: TrainerListForm,
  create: TrainerCreateForm,
  edit: InstructorEdit,
  show: TrainerShow,
  icon: GradingIcon,
  recordRepresentation: 'title',
}
