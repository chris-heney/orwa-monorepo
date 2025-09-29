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

  if (!values.first) {
    errors.first = 'First Name is required'
  }

  if (!values.last) {
    errors.last = 'Last Name is required'
  }

  if (!values.email) {
    errors.email = 'Email is required'
  }

  if (!values.phone) {
    errors.phone = 'Phone is required'
  }

  return errors
}


