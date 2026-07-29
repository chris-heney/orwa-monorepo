import { Typography } from '@mui/material'
import { containerClass } from '../../helpers/utilities'
import { useContext } from 'react'
import { DirectoryContext } from '../helpers/AppContextProvider'

const StickyHeader = () => {
    const {score, applications} = useContext(DirectoryContext)

    return (applications?.length === 0) ? <></>  : (
        <header className="bg-black" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
            <div className={`${containerClass} flex justify-center items-baseline`}>
                <div
                className='flex items-center justify-center gap-4 border px-2 bg-white rounded-lg'
                >
                <Typography 
                    variant="h1"
                    className={`${score.approved ? 'text-green-500' : 'text-red-700'} relative uppercase `}
                    sx={{ fontWeight: 900, fontSize: ['1rem', '1.635rem', '1.8rem'] }}
                >  
                {score.approved ? 'Approved' : 'Not Approved'} 
                </Typography>
                <Typography
                    variant="h1"
                    className="relative uppercase"
                    sx={{ fontWeight: 900, fontSize: ['1rem', '1.635rem', '1.8rem'] }}
                > - Score: {score.score > 0 ? score.score : ' Awaiting'} </Typography>
                </div>
            </div>
        </header>
    )
}

export default StickyHeader
