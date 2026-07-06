import IInstructor from './ITrainingInstructor'
import ITrainingSchedule from './ITrainingSchedule'

export default interface ITrainingEvent {
  id?: number
  instructor?: IInstructor
  start?: string
  end?: string
  exam_datetime?: string
  hours?: number
  program_billed?: string
  audience?: string 
  location?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zip?: string
  }
  training_schedule?: ITrainingSchedule
  deq_class_number?: string
  training_type?: string
  deq_exam?: boolean
  status?: string
  private_notes?: string
}