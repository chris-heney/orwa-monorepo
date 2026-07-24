import { Badge, Box, Button } from '@mui/material'
import { Poop } from './Poop'
import React from 'react'
import { handleSelectFilter, removeFilter } from '../helpers/FiltersService'
import ProjectTypeButton from './ProjectTypeButton'
import WaterDrop from './WaterDrop'
import { useAppContext } from '../providers/AppContext'
import { T } from '../theme/tokens'

const MobileBar = () => {

    const { filters, setFilters, allApplications } = useAppContext()

    const [poop, setPoop] = React.useState(false)
    const [waterDrop, setWaterDrop] = React.useState(false)

    const wastewater = React.useMemo(
        () => allApplications.filter((a) => a.drinking_or_wastewater === 'Wastewater').length,
        [allApplications]
    )
    const drinkingWater = React.useMemo(
        () => allApplications.filter((a) => a.drinking_or_wastewater === 'Drinking Water').length,
        [allApplications]
    )

    return (
        <Box
            sx={{
                position: 'sticky',
                bottom: 0,
                left: 0,
                width: '100%',
                backgroundColor: T.ink,
                borderTop: `1px solid ${T.line}`,
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}
        >

            <Button size='small' onClick={() => {
                poop
                    ? removeFilter('drinking_or_wastewater', 'Wastewater', filters, setFilters)
                    : handleSelectFilter('drinking_or_wastewater', 'Wastewater', filters, setFilters)
                poop ? setPoop(false) : setPoop(true)
            }}
                sx={{
                    mr: poop ? 2 : null,
                    filter: poop ? null : 'grayscale(100%)',
                    opacity: poop ? 1 : 0.65,
                }}
            >
                <Badge badgeContent={wastewater} color="primary" max={1000}>
                    <Poop />
                </Badge>
            </Button>

            {poop && <ProjectTypeButton classification='Wastewater' setFilters={setFilters} filters={filters} />}

            <Button size='small' onClick={() => {
                waterDrop
                    ? removeFilter('drinking_or_wastewater', 'Drinking Water', filters, setFilters)
                    : handleSelectFilter('drinking_or_wastewater', 'Drinking Water', filters, setFilters)
                waterDrop ? setWaterDrop(false) : setWaterDrop(true)
            }
            }
                sx={{
                    mr: waterDrop ? 2 : null,
                    filter: waterDrop ? null : 'grayscale(100%)',
                    opacity: waterDrop ? 1 : 0.65,
                }}
            >
                <Badge badgeContent={drinkingWater} color='primary' max={1000}>
                    <WaterDrop />
                </Badge>
            </Button>

            {waterDrop && <ProjectTypeButton classification='Drinking Water' setFilters={setFilters} filters={filters} />}
            <Box sx={{ flexGrow: 1 }} />
        </Box>
    )
}

export default MobileBar
