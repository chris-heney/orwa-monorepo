export default (values: {
  name?: string
  email?: string
  phone?: string
  address_street?: string
  address_city?: string
  address_state?: string
  address_zip?: string
}): { [key: string]: string } => {
  const errors: { [key: string]: string } = {}

  if (!values.name) {
    errors.name = 'Associate Name is required'
  }

  if (!values.email || !values.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
    errors.email = 'A valid email is required'
  }

  if (!values.phone || !values.phone.match(/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/)) {
    errors.phone = 'A valid phone number is required'
  }

  if (!values.address_street) {
    errors.address_street = 'Street is required'
  }

  if (!values.address_city) {
    errors.address_city = 'City is required'
  }

  if (!values.address_state) {
    errors.address_state = 'State is required'
  }

  if (!values.address_zip) {
    errors.address_zip = 'Zip is required'
  }
  return errors
}
