import ContactCreate from './ContactsCreate'
import ContactEdit from './ContactEdit'

/**
 * `list` / `show` are framework pages (`contacts.list`, `contacts.contactShow`)
 * mounted by the contacts manifest via `pageView`.
 */
export default {
  create: ContactCreate,
  edit: ContactEdit,
  recordRepresentation: 'title',
}
