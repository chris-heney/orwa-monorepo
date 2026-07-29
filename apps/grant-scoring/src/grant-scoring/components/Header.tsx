import { Typography, useMediaQuery } from '@mui/material'
import { containerClass } from '../../helpers/utilities'
import StepperComponent from './StepperComponent'
import { useContext } from 'react'
import { ApplicationScoringContext } from '../AppContextProvider'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  
  const {status} = useContext(ApplicationScoringContext)
  const navigate = useNavigate()
  const isSmall = useMediaQuery('(max-width: 600px)')

  return (
    <header className="bg-black items-center justify-center">
      <div className={`${containerClass} flex justify-between items-center`}>
        {!isSmall && <img 
          onClick={() => navigate('/')}
          width="130" src="https://orwa.org/wp-content/uploads/ORWA-white-300-130x61.png"
          className=" hover:cursor-pointer"
          alt="Oklahoma Rural Water Association"
          decoding="async"
          srcSet="https://orwa.org/wp-content/uploads/ORWA-white-300-130x61.png 130w, https://orwa.org/wp-content/uploads/ORWA-white-300-140x66.png 140w, https://orwa.org/wp-content/uploads/ORWA-white-300.png 300w"
          sizes="(max-width: 130px) 100vw, 130px"
        />}

        {status > 0 && <StepperComponent/>}
        {status === 0 && <Typography variant="h4" fontWeight={'bold'}  className="text-white"> ORWA GApp Eval</Typography>}
      </div>
    </header>
  )
}

export default Header
