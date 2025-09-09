import React, { useState, useEffect } from 'react'
import CustomSelectInput from './_components/CustomSelectInput'
import { useGetProjectTypes } from '../helpers/APIService'
import { ProjectType } from '../types/ProjectType'
import { Filter } from '../types/Filter'
import { SxProps } from '@mui/material'

interface SelectProjectTypeProps {
    setFilters: React.Dispatch<React.SetStateAction<Filter[]>>
    filters: Filter[]
    handleSelectFilter: (key: string, value: string, filters: Filter[], setFilters: React.Dispatch<React.SetStateAction<Filter[]>>) => void
    sx?: SxProps
    classification: 'Wastewater' | 'Drinking Water'
}

const SelectProjectType = ({
    handleSelectFilter, 
    setFilters, 
    filters,
    sx,
    classification
}: SelectProjectTypeProps) => {
    const [options, setOptions] = useState([])
    const getProjectTypes = useGetProjectTypes()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProjectTypes(classification)
                const formattedOptions = data.map((projectType: ProjectType) => ({
                    label: projectType.name,
                    value: projectType.id
                }));
                setOptions(formattedOptions)
            } catch (error) {
                console.error('Error fetching project types:', error)
            }
        };

        fetchData();
    }, [])

    return !options ? <></> : (
        <CustomSelectInput 
        sx={sx}
        setFilters={setFilters} 
        filters={filters} 
        source='approved_projects' 
        handleSelectFilter={handleSelectFilter} 
        label="Project Type" 
        options={options} 
        />
    )
}

export default SelectProjectType
