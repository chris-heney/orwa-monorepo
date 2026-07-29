export default function TrainingForm() {

  return (
    <form className="text-left" action="https://orwa.org/wp-json/strapi/v1/training-logs" method="get" onSubmit={
      (e) => {
        e.preventDefault()

        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())

        console.log("Posting Data", data)

        fetch(e.currentTarget.action, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }).then(() => {
          alert('*************\r\nDigital Training Portal Coming Soon!\r\n*************')
          form.reset()
        })
      }
    }>
      <div className="mb-3">
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input type="text" name="email" id="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline" />
      </div>
      <div className="mb-3">
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">License Number</label>
        <input type="text" name="license_number" id="license_number" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-blue-500 focus:shadow-outline" />
      </div>
      <div className="flex items-center justify-between">
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  focus:outline-blue-500 focus:shadow-outline w-full">Submit</button>
      </div>
    </form>
  )
}