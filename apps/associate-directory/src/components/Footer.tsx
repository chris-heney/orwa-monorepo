import { containerClass } from "../helpers/utilities"

const Footer = () => {
  return (
    <footer className="footer">
      <div className={`${containerClass} py-3 bg-gray-100`}>
        <span className="text-muted">&copy; 2023 Oklahoma Rural Water Association &mdash; All Rights Reserved.</span>
      </div>
    </footer>
  )
}

export default Footer