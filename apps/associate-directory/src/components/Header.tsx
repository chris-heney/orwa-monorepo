import {
  Typography
} from '@mui/material'
import { containerClass } from '../helpers/utilities'

const Header = () => {
  return (
    <header className="bg-black">
      <div className={`${containerClass} flex justify-between items-baseline`}>
        <img width="130" height="61" src="https://orwa.org/wp-content/uploads/ORWA-white-300-130x61.png"
          className="custom-logo"
          alt="Oklahoma Rural Water Association"
          decoding="async"
          srcSet="https://orwa.org/wp-content/uploads/ORWA-white-300-130x61.png 130w, https://orwa.org/wp-content/uploads/ORWA-white-300-140x66.png 140w, https://orwa.org/wp-content/uploads/ORWA-white-300.png 300w"
          sizes="(max-width: 130px) 100vw, 130px"
        />
        <Typography variant="h1" className="text-white relative uppercase -top-0.5" sx={{ fontWeight: 900, fontSize: ['1rem', '1.635rem', '2rem']}}>Associate Directory</Typography>
        {/* <span className="block text-sm md:text-base lg:text-lg xl:text-xl text-gray-800">
          We are grateful to our Associate Members who provide services and resources that support rural water.
        </span> */}
      </div>
    </header>
  )
}

export default Header
