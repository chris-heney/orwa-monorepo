import React, { useEffect, useState } from 'react'
import { Button, Menu, MenuItem, Checkbox } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Filter } from '../types/Filter'
import { handleSelectFilter } from '../helpers/FiltersService'
import { useGetProjectTypes } from '../helpers/APIService'
import { ProjectType } from '../types/ProjectType'
import { useMediaQuery } from '@uidotdev/usehooks'

interface ProjectTypeButtonProps {
    setFilters: React.Dispatch<React.SetStateAction<Filter[]>>
    filters: Filter[]
    classification: 'Wastewater' | 'Drinking Water'
}

const ProjectTypeButton: React.FC<ProjectTypeButtonProps> = ({ setFilters, filters, classification }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([])
    const [open, setOpen] = useState<boolean>(false)
    const [options, setOptions] = useState<{ label: string, value: string }[]>([])
    const getProjectTypes = useGetProjectTypes()

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
        setOpen(true)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        setOpen(false)
    }

    const handleMenuClick = (county: string) => {
        const newSelected = selectedProjectTypes.includes(county)
            ? selectedProjectTypes.filter(selected => selected !== county)
            : [...selectedProjectTypes, county]
        setSelectedProjectTypes(newSelected)
        handleSelectFilter('approved_projects', newSelected, filters, setFilters)
    }

    const isProjectTypeSelected = (county: string) => {
        return selectedProjectTypes.includes(county)
    }

    useEffect(() => {
        if (filters.length === 0) {
            return setSelectedProjectTypes([])
        }
    }, [filters])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProjectTypes(classification)
                const formattedOptions = data.map((projectType: ProjectType) => ({
                    label: projectType.name,
                    value: projectType.id.toString()
                }));
                setOptions(formattedOptions)
            } catch (error) {
                console.error('Error fetching project types:', error)
            }
        };

        fetchData();
    }, [])

    const isSmall = useMediaQuery('(max-width:900px)')


    return (
        <>
            <Button
                size={isSmall ? 'small' : 'medium'}
                color="inherit"
                aria-label="open drawer"
                aria-controls="counties-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                sx={{
                    mr: isSmall ? 0 : 2,
                    fontSize: isSmall ? '0.6rem' : null
                }}
            >
                 Project Types <ExpandMoreIcon
                    sx={{
                        transform: isSmall ? (open ? 'rotate(0deg)' : 'rotate(180deg)') : (open ? 'rotate(180deg)' : 'none'),
                        transition: 'transform 0.3s ease-in-out',
                    }}
                />
            </Button>
            <Menu
                id="counties-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                marginThreshold={50}
                sx={{
                    maxHeight: 400,
                }}
            >
                {options.map((projectType, index: number) => (
                    <MenuItem sx={{p: 0}} key={index} onClick={() => handleMenuClick(projectType.value)}>
                        <Checkbox size='small' checked={isProjectTypeSelected(projectType.value)} />
                        {projectType.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

export default ProjectTypeButton
