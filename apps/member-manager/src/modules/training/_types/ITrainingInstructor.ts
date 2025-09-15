import { Identifier } from 'react-admin'
import IContact from './IContact'


export default  interface IInstructor {
  id: Identifier
  instructor: IContact
  training_instructor_certification: {
    id: Identifier
    certification: {
      id: Identifier
      name: string
    }
  }
}

