import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import { useContext } from 'react'
import { ApplicationScoringContext } from '../AppContextProvider'

const StepperComponent = () => {
     
  const {
    steps,
    status
  } = useContext(ApplicationScoringContext)

    return (
        <div className="min-w-96">
        <Stepper style={{ color: 'white' }} nonLinear activeStep={steps.findIndex( step => step.statusId === status)}>
                {steps.map((step, index) => (
                    <Step key={`step-index-${index}`}>
                        <StepButton
                            sx={{
                                '& .MuiStepLabel-root': {
                                    flexDirection: 'column',
                                    color: 'white',
                                    '& .MuiStepLabel-iconContainer': {
                                        p: 0,
                                    },
                                    '& svg': {
                                        fontSize: '3.5rem'
                                    },
                                    '& .MuiStepLabel-labelContainer': {
                                        fontWeight: 800,
                                        letterSpacing: 4,
                                    },
                                    '& .MuiStepLabel-label': {
                                        fontWeight: 800,
                                        letterSpacing: 4,
                                        color: 'white',
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
    )
}

export default StepperComponent
