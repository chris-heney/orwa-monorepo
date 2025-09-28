import GradingIcon from '@mui/icons-material/Grading'
import CoreServiceCreateForm from './CreateAddonGroup'
import CoreServiceEditForm from './EditAddonGroup'
import CoreServiceList from './AddonGroupList'
// import CoreServiceShow from './CoreServiceShow'


export default {
  list: CoreServiceList,
  create: CoreServiceCreateForm,
  edit: CoreServiceEditForm,
  // show: CoreServiceShow,
  icon: GradingIcon,
  recordRepresentation: 'title',
}
