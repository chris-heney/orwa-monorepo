import EmailIcon from '@mui/icons-material/Email'
import EmailList from './EmailInterface'
import EmailShow from './ShowEmail'
import EmailEdit from './EditEmail'
import EmailCreate from './CreateEmail'

export default {
  list: EmailList,
  create: EmailCreate,
  show: EmailShow,
  edit: EmailEdit,
  icon: EmailIcon,
  recordRepresentation: 'title',
}
