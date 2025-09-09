import { Box, Divider, InputBase, Paper, Typography, alpha, styled, useMediaQuery } from '@mui/material'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import IGrantApplication from '../types/IGrantApplication'
import { useMap } from '@vis.gl/react-google-maps'
import { Filter } from '../types/Filter'
import SearchIcon from '@mui/icons-material/Search'
import { useGetGrantApplications } from '../helpers/APIService'

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: -10,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',

    width: '70%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        transition: theme.transitions.create('width'),
        width: '100%',
    },
}))

interface GappListProps {
    applications: IGrantApplication[]
    setApplication: React.Dispatch<React.SetStateAction<IGrantApplication | null>>
    filters: Filter[]
    setFilters: React.Dispatch<React.SetStateAction<Filter[]>>
    totalApplications: number
    isSideBarOpen: boolean
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}


const GappList = ({
    applications,
    setApplication,
    totalApplications,
    isSideBarOpen,
    setIsSidebarOpen,
}: GappListProps) => {
    const map = useMap()
    const paperRef = useRef<HTMLDivElement>(null)
    const [searchKeyword, setSearchKeyword] = useState<string>('')
    const [total, setTotal] = useState<number>(0)
    const getGrantApplications = useGetGrantApplications()

    // Filter applications based on the search keyword
    const filteredApplications = applications.filter((gapp) =>
        gapp.legal_entity_name.toLowerCase().includes(searchKeyword.toLowerCase())
    )

    // Update the applications state with filtered results
    const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value)
    }

    const getLength = async (searchFilters: Filter[]): Promise<number> => {
        const data = await getGrantApplications(searchFilters);
        return data.length;
    }
    
    useEffect(() => {
        getLength([]).then((data) => setTotal(data))

    }, [])

    const isSmall = useMediaQuery('(max-width:900px)')

    const translate = isSmall ? '-100vw' : '-50vw'

    return (
        <Box  sx={{
            position: 'relative',
        }}>
            <Box
                style={{
                    transition: 'transform 1s ease-in-out',
                    transform: isSideBarOpen ? 'translateX(0)' : `translateX(${translate})`,
                }}
                ref={paperRef}
            >
                <Paper component={'aside'} sx={{ pb: 2, position: 'absolute', zIndex: 1000 }}>
                    <Box sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                            <Typography variant='h6' textAlign={'left'} ml={1}>
                                Grant Applications ({totalApplications}/ {total})
                            </Typography>
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                    value={searchKeyword}
                                    onChange={handleSearchInputChange}
                                />
                            </Search>
                        </Box>
                        <Divider sx={{ mt: 1, mb: 2 }} />
                        <Box sx={{ maxHeight: '100vh', overflowY: 'auto' }}>
                            {filteredApplications.map((gapp) => (
                                <Box
                                    onClick={() => {
                                        map?.setCenter({ lat: gapp.location.lat, lng: gapp.location.lng })
                                        setApplication(gapp)
                                        isSmall ? setIsSidebarOpen(false) : null
                                    }}
                                    key={gapp.id}
                                    sx={{
                                        p: 1,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: '#f0f0f0',
                                        },
                                        maxWidth: 350,
                                    }}
                                >
                                    <Typography textAlign={'left'}>{gapp.legal_entity_name}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}

export default GappList