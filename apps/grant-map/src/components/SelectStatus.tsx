import React, { useState, useEffect } from 'react'
import CustomSelectInput from './_components/CustomSelectInput'
import { useGetStatuses } from '../helpers/APIService'
import { ProjectType } from '../types/ProjectType'
import { SxProps } from '@mui/material'
import { Filter } from '../types/Filter'

interface SelectProjectTypeProps {
    handleSelectFilter: (key: string, value: string, filters: Filter[], setFilters: React.Dispatch<React.SetStateAction<Filter[]>>) => void
    sx?: SxProps
    filters: Filter[]
    setFilters: React.Dispatch<React.SetStateAction<Filter[]>>
}

const SelectStatus = ({handleSelectFilter, sx, setFilters, filters}: SelectProjectTypeProps) => {
    const [options, setOptions] = useState([])
    const getStatuses = useGetStatuses()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getStatuses()
                const formattedOptions = data.map((projectType: ProjectType) => ({
                    label: projectType.name,
                    value: projectType.id
                }));
                setOptions(formattedOptions);
                (data)
            } catch (error) {
                console.error('Error fetching project types:', error)
            }
        };

        fetchData();
    }, [])
  
    return !options ? <></> : (
        <CustomSelectInput 
        filters={filters}
        setFilters={setFilters}
        source='status' 
        sx={sx} 
        handleSelectFilter={handleSelectFilter} 
        label="Status" 
        options={options} 
        />
    )
}

export default SelectStatus
