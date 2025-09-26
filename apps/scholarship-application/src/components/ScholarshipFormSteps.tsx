import { Dispatch, SetStateAction } from 'react'
import PersonalDataStep from './steps/PersonalDataStep'
import EligibilityStep from './steps/EligibilityStep'
import HighSchoolDataStep from './steps/HighSchoolDataStep'
import CollegeDataStep from './steps/CollegeDataStep'
import AwardsStep from './steps/AwardsStep'
import RecommendationsStep from './steps/RecommendationsStep'
import FinancialDataStep from './steps/FinancialDataStep'
import EssayStep from './steps/EssayStep'
import BiographyStep from './steps/BiographyStep'
import PhotoStep from './steps/PhotoStep'
import CertificationStep from './steps/CertificationStep'

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

const DefaultScholarshipFormSteps = () => {
  const steps = [
    {
      label: "Personal Data",
      key: "personal-data",
      component: <PersonalDataStep />,
      active: true
    },
    {
      label: "Eligibility",
      key: "eligibility",
      component: <EligibilityStep />,
      active: true
    },
    {
      label: "High School",
      key: "high-school",
      component: <HighSchoolDataStep />,
      active: true
    },
    {
      label: "College/University",
      key: "college-data",
      component: <CollegeDataStep />,
      active: true
    },
    {
      label: "Awards",
      key: "awards",
      component: <AwardsStep />,
      active: true
    },
    {
      label: "Recommendations",
      key: "recommendations",
      component: <RecommendationsStep />,
      active: true
    },
    {
      label: "Financial Data",
      key: "financial-data",
      component: <FinancialDataStep />,
      active: true
    },
    {
      label: "Essay",
      key: "essay",
      component: <EssayStep />,
      active: true
    },
    {
      label: "Biography",
      key: "biography",
      component: <BiographyStep />,
      active: true
    },
    {
      label: "Photo",
      key: "photo",
      component: <PhotoStep />,
      active: true
    },
    {
      label: "Certification",
      key: "certification",
      component: <CertificationStep />,
      active: true
    }
  ]

  return steps
}

export default DefaultScholarshipFormSteps
