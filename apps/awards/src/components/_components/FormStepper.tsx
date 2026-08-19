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
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
                {/* Mobile: Current Step Display */}
                <div className="md:hidden">
                    <div className="flex items-center justify-between gap-3 min-h-10">
                        <h3 className="m-0 text-lg font-semibold leading-tight text-gray-900">
                            {steps.filter(step => step.active)[stepIndex]?.label}
                        </h3>
                        <span className="inline-flex items-center justify-center shrink-0 text-sm leading-none text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full whitespace-nowrap">
                            {stepIndex + 1} of {steps.filter(step => step.active).length}
                        </span>
                    </div>
                </div>

                {/* Desktop: Full Stepper — overflow-y hidden avoids a vertical scrollbar when
                    overflow-x is auto; py-3 keeps 1.75rem step icons fully inside the clip box. */}
                <div className="hidden md:block overflow-x-auto overflow-y-hidden px-4 py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <Stepper 
                        nonLinear 
                        activeStep={stepIndex}
                        sx={{
                            py: 0.5,
                            minHeight: 40,
                            alignItems: 'center',
                            '& .MuiStep-root': {
                                minHeight: 40,
                            },
                            '& .MuiStepConnector-root': {
                                top: 20,
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
                                            p: 1,
                                            py: 0.5,
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
                                                        overflow: 'visible',
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
