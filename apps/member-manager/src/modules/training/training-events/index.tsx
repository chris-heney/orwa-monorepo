import TrainingClassCreate from './TrainingEventCreate'
import TrainingClassEdit from './TrainingEventEdit'
import TrainingEventList from './TrainingEventList'
import TrainingEventShow from './TrainingEventShow'

export default {
  list: TrainingEventList,
  create: TrainingClassCreate,
  edit: TrainingClassEdit,
  show: TrainingEventShow,
  recordRepresentation: 'training_type',
}