import { Typography } from '@mui/material'
import { containerClass } from '../../helpers/utilities'
import { ApplicationScoringContext } from '../AppContextProvider'
import { useContext } from 'react'

const StickyHeader = () => {

    const {
        applications,
        status,
        applicationIndex,
        score
      } = useContext(ApplicationScoringContext)

      
    return (!status || applications?.length === 0) ? <></>  : (
        <header className="bg-black p-0.5 items-center" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
            <div className={`${containerClass} flex justify-between items-baseline`}>
                <Typography
                    variant="h1"
                    className="text-white relative -top-0.5"         
                    sx={{ fontWeight: 500, fontStyle: 'italic', fontSize: ['1rem', '1.635rem', '2rem'] }}   
                > {applications?.length > 0 ? applicationIndex + 1 : 0} of {applications?.length} </Typography>
                <Typography
                    variant="h1"
                    className="text-white relative uppercase -top-0.5"
                    sx={{ fontWeight: 900, fontSize: ['1rem', '1.635rem', '2rem'] }}
                > Score: {`${score > 0 ? score : 0}`} </Typography>
            </div>
        </header>
    )
}

export default StickyHeader
