import { Filter } from "../types/Filter";

export const handleSelectFilter = (key: string, value: string | string[], filters: Filter[], setFilters: React.Dispatch<React.SetStateAction<Filter[]>>) => {
    
    const newFilters = [...filters]
    
    const filterIndex = Array.isArray(value) ? newFilters.findIndex(f => f.key === key) : newFilters.findIndex(f => f.key === key && f.value === value)

     if  (filterIndex >= 0) {
        newFilters[filterIndex] = {
            key,
            value
        }
    } else {
        newFilters.push({
            key,
            value
        })
    }
    setFilters(newFilters)
}

export const removeFilter = (key: string, value: string, filters: Filter[], setFilters: React.Dispatch<React.SetStateAction<Filter[]>>) => {
    const newFilters = filters.filter(filter => !(filter.key === key && filter.value === value))
    setFilters(newFilters)
}


export const findFilter = (key: string, filters: Filter[]) => {
    return filters.find(f => f.key === key)
}