export default (values: {
  name?: string
  legal_entity_name?: string
  email?: string
  system_type_dirty?: string
  membership_directory_type?: string
  annual_report_type?: string
  phone?: string
  office_hours?: number
  region?: string
  member_type?: string
  wp_uid?: number
  wp_eid?: number
  meters?: number
}): { [key: string]: string } => {
  const errors: { [key: string]: string } = {}

  if (!values.name) {
    errors.name = 'Name is required'
  }

  if (!values.email) {
    errors.email = 'Email is required'
  } 

  if (!values.wp_uid) {
    errors.wp_uid = 'WP UID is required'
  }

  if (!values.wp_eid) {
    errors.wp_eid = 'WP EID is required'
  }

  return errors
}


