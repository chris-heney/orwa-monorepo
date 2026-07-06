import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import { Dispatch, SetStateAction } from 'react'
import { IFormStep } from './FormSteps'
import { useFormStepsContext } from '../providers/StepProvider'


interface FormStepperProps {
    stepIndex: number
    setStepIndex: Dispatch<SetStateAction<number>>
}

const FormStepper = ({ stepIndex, setStepIndex }: FormStepperProps) => {

    const {steps} = useFormStepsContext()

    //  If the step is completed set the previous to green

    return (
        <section className="bg-slate-100">
            <div className="max-w-3xl mx-auto px-3 py-6 overflow-x-hidden">
                <Stepper style={{ color: 'white' }} nonLinear activeStep={stepIndex}>
                    {steps.filter(step => step.active).map((step: IFormStep, index: number) => (
                        <Step key={`step-index-${index}`}>
                            <StepButton
                                id={`step-index-${index}`}
                                onAbort={() => setStepIndex(index)}
                                sx={{
                                    p: 2,
                                    pt: 2,
                                    '& .MuiStepLabel-root': {
                                        flexDirection: 'column',
                                        color: 'black',
                                        '& .MuiStepLabel-iconContainer': {
                                            p: 0,
                                        },
                                        '& svg': {
                                            fontSize: ['2.5rem', '3.5rem']
                                        },
                                        '& .MuiStepLabel-labelContainer': {
                                            fontWeight: 800,
                                            letterSpacing: 4,
                                        },
                                        '& .MuiStepLabel-label': {
                                            fontWeight: 800,
                                            letterSpacing: [0, 1, 2, 3],
                                            color: 'black',
                                        }
                                    },
                                }}
                            >
                                {step.label}
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>
            </div>
        </section>
    )
}

export default FormStepper
