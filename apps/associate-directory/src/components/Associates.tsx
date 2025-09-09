import React, { useEffect, useState } from "react"
import { IAssociates } from "./AssociatesInterface"
import AssociateShow from "./AssociateShow"

interface FilterProps {
  setAssociates: (associates: IAssociates[]) => void
  categoryFilter: string
  letterFilter: string
  associates: IAssociates[]
}

const Associates: React.FC<FilterProps> = ({ categoryFilter, letterFilter, setAssociates, associates }) => {

  const [selectedAssociate, setSelectedAssociate] = useState<IAssociates | null>(null)
  const [loading, setLoading] = useState<boolean>(false) // Add loading state
  const [index, setIndex] = useState(0)


  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const oneYearAgoFormatted = formatDate(oneYearAgo);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
  
        // let apiUrl = "https://orwa.org/wp-json/strapi/v1/associates"

        let apiUrl = `${import.meta.env.VITE_API_ENDPOINT}/api/associates`
  
        // Check if filters are provided
        const filters = [`filters[payment_last_date][$gte]=${oneYearAgoFormatted}`]
  
        if (letterFilter) {
          filters.push(`filters[name][$startsWith]=${letterFilter}`)
        }
  
        if (categoryFilter) {
          filters.push(`filters[category][$eq]=${categoryFilter}`)
        }
  
        // Append filters to the URL if they exist
        if (filters.length > 0) {
          apiUrl += `?${filters.join("&")}`
        }
  
        // Check if there are already query parameters
        // return all results possible
        apiUrl += apiUrl.includes("?") ? "&populate=*&pagination[limit]=1000" : "?populate=*&pagination[limit]=1000"
  
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`,
          },
        })
        const data = await response.json()
        setAssociates(data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 300)
      }
    }
  
    fetchData()
  }, [letterFilter, categoryFilter, setAssociates])

  const handleAssociateClick = (associate: IAssociates, index: number) => {
    setSelectedAssociate(associate)
    setIndex(index)
  }

  const closeCard = () => {
    setSelectedAssociate(null)
  }

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {associates.map((associate, index) => (
              <div
                key={`${associate.wp_uid}-${index}`}
                className="flex flex-col items-center justify-center relative rounded p-10 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-md hover:border hover:border-gray-200 text-base md:text-lg lg:text-xl xl:text-2xl"
                onClick={() => handleAssociateClick(associate, index)}
              >
                {associate.logo && associate.logo.data != null && associate.logo.data[0].url != null && associate.logo.data.length > 0 ? (
                  <img
                    src={`${import.meta.env.VITE_API_ENDPOINT}${associate.logo.data[0].url}`}
                    className="mx-auto mb-4 w-full rounded"
                    alt="Associate"
                  />
                ) : (
                  <img
                    src="https://placehold.co/240x160"
                    className="mx-auto mb-4 w-full h-48 object-cover rounded"
                    alt="Associate"
                  />
                )}
                <h2 className="text-base font-bold absolute bottom-0 left-0 w-full text-center -ml-1">{associate.name}</h2>
              </div>
            ))}
          </div>

          {selectedAssociate && (
            <AssociateShow associates={associates} startingIndex={index} associate={selectedAssociate} closeCard={closeCard} />
          )}
        </div>
      )}
    </div>
  )
}

export default Associates
