export default function Footer() {

    const year = new Date().getFullYear()

    return (
        <div className="flex flex-col items-center md:flex-row text-sm sm:text-base">
            <span className="copyright md:mr-auto">
                &copy; {year} Oklahoma Rural Water Association
            </span> 
            <span className="byline md:ml-auto">
                Powered by <a href="https://www.ruralwaterimpact.com/" target="_blank" className="text-blue-500 cursor-pointer hover:underline">RWI</a>
            </span>
        </div>
    )
}