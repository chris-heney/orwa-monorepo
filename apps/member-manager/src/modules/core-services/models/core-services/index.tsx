import GradingIcon from '@mui/icons-material/Grading'
import CoreServiceCreateForm from './CreateCoreService'
import CoreServiceEditForm from './EditCoreService'
import CoreServiceList from './CoreServicesList'
// import CoreServiceShow from './CoreServiceShow'


export default {
  list: CoreServiceList,
  create: CoreServiceCreateForm,
  edit: CoreServiceEditForm,
  // show: CoreServiceShow,
  icon: GradingIcon,
  recordRepresentation: 'title',
}
