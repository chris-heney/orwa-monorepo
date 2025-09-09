import React, { useEffect, useState } from 'react'
import { Button, Menu, MenuItem, Checkbox } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Filter } from '../types/Filter'
import { handleSelectFilter } from '../helpers/FiltersService'
import { useGetStatuses } from '../helpers/APIService'
import { IStatus } from '../types/IGrantApplicationStatus'
import Loading from './Loading'
import { useMediaQuery } from '@uidotdev/usehooks'

interface StatusButtonProps {
    setFilters: React.Dispatch<React.SetStateAction<Filter[]>>
    filters: Filter[]
}

const StatusButton: React.FC<StatusButtonProps> = ({ setFilters, filters }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['12', '13', '6', '3'])
    const [options, setOptions] = useState<{ label: string, value: string, color: string }[]>([])
    const [open, setOpen] = useState<boolean>(false)
    const getStatuses = useGetStatuses()

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
        setOpen(true)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        setOpen(false)
    }

    const handleMenuClick = (status: string) => {
        const newSelected = selectedStatuses.includes(status)
            ? selectedStatuses.filter(selected => selected !== status)
            : [...selectedStatuses, status]
        setSelectedStatuses(newSelected)
        handleSelectFilter('status', newSelected, filters, setFilters)
    }

    const isStatusSelected = (status: string) => {
        return selectedStatuses.includes(status)
    }

    useEffect(() => {
        if (filters.length === 0) {
            return setSelectedStatuses([])
        }
    }, [filters])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getStatuses()
                const formattedOptions = data.map((status: IStatus) => ({
                    label: status.name,
                    value: status.id.toString(),
                    color: status.color
                }));
                setOptions(formattedOptions)
            } catch (error) {
                console.error('Error fetching project types:', error)
            }
        }

        fetchData()
    }, [])

    const isSmall = useMediaQuery('(max-width:900px)')


    return !options ? <Loading /> : (
        <>
            <Button
                size={isSmall ? 'small' : 'medium'}
                color="inherit"
                aria-label="open drawer"
                aria-controls="status-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                sx={{ 
                    mr: 0,
                    p: isSmall ? 0 : null,
                    fontSize: isSmall ? '0.6rem' : null
                 }}
            >
                 Statuses
                <ExpandMoreIcon
                    sx={{
                        transform: open ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.3s ease-in-out',
                    }}
                />
            </Button>
            <Menu
                id="status-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                MenuListProps={{
                    disablePadding: true,
                }}
            >
                {options.map((status, index: number) => {
                    return (
                        <MenuItem
                            sx={{
                                fontWeight: 'bold',
                                color: status.color === '#FFFFFF' ? 'black ': 'white',
                                p: 0,
                                pr: 1,
                                backgroundColor: status.color,
                                ':hover': {
                                    backgroundColor: status.color,
                                    opacity: 0.8,
                                }
                            }}
                            key={index}
                            onClick={() => handleMenuClick(status.value)}
                        >
                            <Checkbox size='small' checked={isStatusSelected(status.value)} />
                            {status.label}
                        </MenuItem>
                    )
                })}
            </Menu>
        </>
    )
}

export default StatusButton
