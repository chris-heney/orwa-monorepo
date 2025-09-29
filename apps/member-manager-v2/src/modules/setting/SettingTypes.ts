export default interface Setting {
  id?: string
  label: string
  name: string
  description: string
  module: string
  field_type: string
  props: unknown
}