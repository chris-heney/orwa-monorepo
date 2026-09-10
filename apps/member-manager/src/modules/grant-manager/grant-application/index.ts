import GradingIcon from '@mui/icons-material/Grading'
import GrantApplicationCreateForm from './CreateGrantApplication'
import GrantApplicationEditForm from './EditGrantApplication'

/**
 * `list` (→ dashboard Applications tab) and `show` (`grants.applicationShow`
 * PageManifest) are attached by `../manifest.tsx`.
 */
export default {
  create: GrantApplicationCreateForm,
  edit: GrantApplicationEditForm,
  icon: GradingIcon,
  recordRepresentation: 'title',
}
