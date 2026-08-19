const SectionHeading = ({title}: {
    title: string;
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
    </div>
  )
}

export default SectionHeading
