/**
 * Contact form validation. Only the name is required: ~21% of contacts have no
 * phone and ~7% no email (neither is required in the Strapi schema), and
 * requiring them blocked every edit to those records — staff could not even
 * add a city without inventing a phone number.
 */
export default (values: {
  first?: string;
  last?: string;
  email?: string;
  phone?: string;
  address_city?: string;
  title?: string;
  contact_type?: string;
}): { [key: string]: string } => {
  const errors: { [key: string]: string } = {}

  if (!values.first?.trim()) {
    errors.first = 'First Name is required'
  }

  if (!values.last?.trim()) {
    errors.last = 'Last Name is required'
  }

  const email = values.email?.trim()
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address'
  }

  return errors
}
