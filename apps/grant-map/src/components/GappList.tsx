import {
  Box,
  Divider,
  InputBase,
  Typography,
  alpha,
  styled,
  useMediaQuery,
} from "@mui/material"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { Filter } from "../types/Filter"
import SearchIcon from "@mui/icons-material/Search"
import { useGetGrantApplications } from "../helpers/APIService"
import { useAppContext } from "../providers/AppContext"
import { useMapContext } from "../providers/MapContext"

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: -10,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}))

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",

  width: "70%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}))

const GappList = () => {
  const map = useRef<mapboxgl.Map>()
  const [searchKeyword, setSearchKeyword] = useState<string>("")
  const [total, setTotal] = useState<number>(0)
  const getGrantApplications = useGetGrantApplications()

  const { applications } = useAppContext()
  const { setIsSidebarOpen } = useAppContext()

  const { setCurrentApplication } = useMapContext()

  // Filter applications based on the search keyword
  const filteredApplications = applications.filter((gapp) =>
    gapp.legal_entity_name.toLowerCase().includes(searchKeyword.toLowerCase())
  )

  // Update the applications state with filtered results
  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value)
  }

  const getLength = async (searchFilters: Filter[]): Promise<number> => {
    const data = await getGrantApplications(searchFilters)
    return data.length
  }

  useEffect(() => {
    getLength([]).then((data) => setTotal(data))
  }, [])

  const isSmall = useMediaQuery("(max-width:900px)")

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <Typography variant="h6" textAlign={"left"} ml={1}>
          Grant Applications ({applications.length}/ {total})
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
            value={searchKeyword}
            onChange={handleSearchInputChange}
          />
        </Search>
      </Box>
      <Divider sx={{ mt: 1, mb: 2 }} />
      <Box sx={{}}>
        {filteredApplications.map((gapp) => (
          <Box
            onClick={() => {
              map?.current?.setCenter({
                lat: gapp.location.lat,
                lng: gapp.location.lng,
              })

              setCurrentApplication(gapp)

              isSmall ? setIsSidebarOpen(false) : null

            }}
            key={gapp.id}
            sx={{
              p: 1,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
              maxWidth: 350,
            }}
          >
            <Typography textAlign={"left"}>{gapp.legal_entity_name}</Typography>
          </Box>
        ))}
      </Box>
    </>
  )
}

export default GappList
