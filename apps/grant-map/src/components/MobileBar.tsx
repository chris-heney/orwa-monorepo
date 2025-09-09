import { Badge, Box, Button, Typography } from '@mui/material'
import { Filter } from '../types/Filter'
import { Poop } from './Poop'
import React from 'react'
import { useGetGrantApplications } from '../helpers/APIService'
import { handleSelectFilter, removeFilter } from '../helpers/FiltersService'
import ProjectTypeButton from './ProjectTypeButton'
import WaterDrop from './WaterDrop'
import { useAppContext } from '../providers/AppContext'

const MobileBar = () => {


    const { filters, setFilters } = useAppContext()

    const [wastewater, setWastewater] = React.useState(0)
    const [drinkingWater, setDrinkingWater] = React.useState(0)
    const getGrantApplications = useGetGrantApplications()
    const [poop, setPoop] = React.useState(false)
    const [waterDrop, setWaterDrop] = React.useState(false)
    const getLength = async (searchFilters: Filter[]): Promise<number> => {
        const data = await getGrantApplications(searchFilters);
        return data.length;
    }

    React.useEffect(() => {
        getLength([{ key: 'drinking_or_wastewater', value: 'Wastewater' }]).then((data) => setWastewater(data))
        getLength([{ key: 'drinking_or_wastewater', value: 'Drinking Water' }]).then((data) => setDrinkingWater(data))
    }, [])

    return (
        <Box
            sx={{
                position: 'sticky',
                bottom: 0,
                left: 0,
                width: '100%',
                backgroundColor: 'black',
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
                }}
            >
                <Badge badgeContent={drinkingWater} color='primary' max={1000}>
                    <WaterDrop />
                </Badge>
            </Button>

            {waterDrop && <ProjectTypeButton classification='Drinking Water' setFilters={setFilters} filters={filters} />}
            <Box sx={{ flexGrow: 1 }} />
            <Typography sx={{ color: 'white', fontSize: '0.4rem' }}>Developer : Marcos Jimenez</Typography>
        </Box>
    )
}

export default MobileBar
