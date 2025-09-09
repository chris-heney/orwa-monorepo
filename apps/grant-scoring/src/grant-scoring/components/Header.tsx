import { containerClass } from '../../helpers/utilities'

const Header = () => {
  return (
    <header className="bg-black">
    <div className={`${containerClass} flex justify-between items-center`}>
      <img
        src="https://orwa.org/wp-content/uploads/ORWA-white-300-130x61.png"
        className='w-24 max-w-full h-auto'
        alt="Oklahoma Rural Water Association"
        decoding="async"
        srcSet="https://orwa.org/wp-content/uploads/ORWA-white-300-130x61.png 130w, https://orwa.org/wp-content/uploads/ORWA-white-300-140x66.png 140w, https://orwa.org/wp-content/uploads/ORWA-white-300.png 300w"
      />
        <div className="text-white font-bold text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
        ORWA Grant Scoring Directory
      </div>
    </div>
  </header>
  )
}

export default Header
