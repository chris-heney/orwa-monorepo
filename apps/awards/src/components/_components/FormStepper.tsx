import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Tooltip from '@mui/material/Tooltip'
import { Dispatch, SetStateAction, useContext } from 'react'
import { IStep as IFormStep } from '../../types/types'
import { FormSteps } from '../../providers/AppContextProvider'

interface FormStepperProps {
    stepIndex: number
    setStepIndex: Dispatch<SetStateAction<number>>
}

const FormStepper = ({ stepIndex, setStepIndex }: FormStepperProps) => {

    const {steps} = useContext(FormSteps)

    return (
        <section className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Mobile: Current Step Display */}
                <div className="md:hidden mb-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {steps.filter(step => step.active)[stepIndex]?.label}
                        </h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {stepIndex + 1} of {steps.filter(step => step.active).length}
                        </span>
                    </div>
                </div>

                {/* Desktop: Full Stepper */}
                <div className="hidden md:block overflow-x-auto px-4 py-2">
                    <Stepper 
                        nonLinear 
                        activeStep={stepIndex}
                        sx={{
                            py: 1,
                            '& .MuiStepConnector-root': {
                                top: 18,
                                left: 'calc(-50% + 16px)',
                                right: 'calc(50% + 16px)',
                                '& .MuiStepConnector-line': {
                                    borderTopWidth: 2,
                                    borderColor: '#e5e7eb',
                                }
                            },
                            '& .MuiStepConnector-active .MuiStepConnector-line': {
                                borderColor: '#3b82f6',
                            },
                            '& .MuiStepConnector-completed .MuiStepConnector-line': {
                                borderColor: '#10b981',
                            }
                        }}
                    >
                        {steps.filter(step => step.active).map((step: IFormStep, index) => (
                            <Step key={`step-index-${index}`}>
                                <Tooltip title={`Go to ${step.label}`} placement="top" arrow>
                                    <StepButton
                                        id={`step-index-${index}`}
                                        onClick={() => setStepIndex(index)}
                                        sx={{
                                            p: 2,
                                            py: 2,
                                            minWidth: 'auto',
                                            '& .MuiStepLabel-root': {
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                '& .MuiStepLabel-iconContainer': {
                                                    p: 0,
                                                    mb: 0,
                                                    alignSelf: 'center',
                                                    '& .MuiStepIcon-root': {
                                                        fontSize: '1.75rem',
                                                        color: index <= stepIndex ? '#3b82f6' : '#d1d5db',
                                                        '&.Mui-completed': {
                                                            color: '#10b981',
                                                        },
                                                        '&.Mui-active': {
                                                            color: '#3b82f6',
                                                        }
                                                    }
                                                },
                                                '& .MuiStepLabel-labelContainer': {
                                                    display: 'none', // Hide labels as requested
                                                }
                                            },
                                            '&:hover': {
                                                backgroundColor: 'rgba(59, 130, 246, 0.04)',
                                                borderRadius: '8px',
                                            }
                                        }}
                                    >
                                        {/* Empty children - label is now in tooltip only */}
                                    </StepButton>
                                </Tooltip>
                            </Step>
                        ))}
                    </Stepper>
                </div>
            </div>
        </section>
    )
}

export default FormStepper
