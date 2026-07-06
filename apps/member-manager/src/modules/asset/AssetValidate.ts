export default (values: {
  name?: string
  location?: string
  category?: string
  make?: string
  model?: string
  serial_number?: string
}): { [key: string]: string } => {
  const errors: { [key: string]: string } = {}

  if (!values.name) {
    errors.name = 'Name is required'
  }

  if (!values.location) {
    errors.location = 'Location is required'
  }

  if (!values.category) {
    errors.category = 'Category is required'
  }

  if (!values.make) {
    errors.make = 'Make is required'
  }

  if (!values.model) {
    errors.model = 'Model is required'
  }

  if (!values.serial_number) {
    errors.serial_number = 'Serial Number is required'
  }

  // Example: Check if serial_number contains only digits
  if (values.serial_number && !/^\d+$/.test(values.serial_number)) {
    errors.serial_number = 'Serial Number must contain only digits'
  }

  return errors
}
