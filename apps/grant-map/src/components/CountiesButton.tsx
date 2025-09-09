import React, { useEffect, useState } from 'react'
import { Button, Menu, MenuItem, Checkbox } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { oklahomaCounties } from '../helpers/Counties'
import { Filter } from '../types/Filter'
import { handleSelectFilter } from '../helpers/FiltersService'
import { useMediaQuery } from '@uidotdev/usehooks'

interface CountiesButtonProps {
    setFilters: React.Dispatch<React.SetStateAction<Filter[]>>
    filters: Filter[]
}

const CountiesButton: React.FC<CountiesButtonProps> = ({ setFilters, filters }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [selectedCounties, setSelectedCounties] = useState<string[]>([])
    const [open, setOpen] = useState<boolean>(false)

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
        setOpen(true)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        setOpen(false)
    }

    const handleMenuClick = (county: string) => {
        const newSelected = selectedCounties.includes(county)
            ? selectedCounties.filter(selected => selected !== county)
            : [...selectedCounties, county]
        setSelectedCounties(newSelected)
        handleSelectFilter('county', newSelected, filters, setFilters)
    }

    const isCountySelected = (county: string) => {
        return selectedCounties.includes(county)
    }

    useEffect(() => {
        if (filters.length === 0) {
            return setSelectedCounties([])
        }
    }, [filters])

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
                    mr: 2,
                    p: isSmall ? 0 : null,
                    fontSize: isSmall ? '0.6rem' : null
                 }}
            >
                 Counties
                <ExpandMoreIcon
                    sx={{
                        transform: open ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.3s ease-in-out',
                    }}
                />
            </Button>
            <Menu
                id="counties-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{
                    maxHeight: 400
                }}
            >
                {oklahomaCounties.map((county: string, index: number) => (
                    <MenuItem sx={{ p: 0 }} key={index} onClick={() => handleMenuClick(county)}>
                        <Checkbox size='small' checked={isCountySelected(county)} />
                        {county}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

export default CountiesButton
