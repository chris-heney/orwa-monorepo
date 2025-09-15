import ContactList from './ContactList'
import ContactCreate from './ContactsCreate'
import ContactEdit from './ContactEdit'
import ShowContact from './ContactShow'
export default {
  list: ContactList,
  create: ContactCreate,
  edit: ContactEdit,
  show: ShowContact,
  recordRepresentation: 'title',
}