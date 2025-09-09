import { Dispatch, SetStateAction } from 'react'
import SystemAndContactStep from './SystemAndContactStep'
import SignatureStep from './SignatureStep'
import FundingRequestStep from './FundingRequestStep'
import ProjectStep from './ProjectsStep'
import StatusImpactStep from './StatusImpactStep'
import OtherNeedsStep from './OtherNeedsStep'

export interface IFormStep {
  label: string
  key: string
  component: JSX.Element
  active: boolean
}

export interface IFormStepContext {
  stepIndex: number
  steps: IFormStep[]
  setFormSteps: Dispatch<SetStateAction<IFormStep[]>>
  setStepIndex: Dispatch<SetStateAction<number>>
}

const DefualtFormSteps = () => {
  // System / Contact -> Funding Request -> Project Information -> Status/Impact -> Signature.
  const DefualtFormSteps = [
   {
    label: "System",
    key: "system-contact",
    component: <SystemAndContactStep />,
    active: true
   },
    {
      label: "Funding",
      key: "funding-request",
      component: <FundingRequestStep/>,
      active: true
    },
    {
      label: "Projects",
      key: "projects",
      component: <ProjectStep/>,
      active: true
    },
    {
      label: "Status",
      key: "status-impact",
      component: <StatusImpactStep/>,
      active: true
    },
    {
      label: "Other",
      key: "other-needs",
      component: <OtherNeedsStep />,
      active: true
    },
    {
      label: "Signature",
      key: "signature",
      component: <SignatureStep />,
      active: true
    }
  ]

  return DefualtFormSteps
}

export default DefualtFormSteps