import GradingIcon from '@mui/icons-material/Grading'
import AssetCreate from './AssetCreate'
import AssetEdit from './AssetEdit'
import AssetList from './AssetList'
import AssetShow from './AssetShow'


export default {
  list: AssetList,
  create: AssetCreate,
  edit: AssetEdit,
  show: AssetShow,
  icon: GradingIcon,
  recordRepresentation: 'name',
}
