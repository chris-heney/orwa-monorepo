import { Box, Paper } from "@mui/material"
import { useMediaQuery } from "@uidotdev/usehooks"
import GappBar from "../components/AppBar"
import GappList from "../components/GappList"
import GappMap from "../components/GappMap"
import MobileBar from "../components/MobileBar"
import Statistics from "../components/Statistics"
import { useRef } from "react"
import { useAppContext } from "../providers/AppContext"
import LayoutContextProvider from "../providers/LayoutContext"



const InnerLayout = () => {

  const {isSidebarOpen } = useAppContext()

  const paperRef = useRef<HTMLDivElement>(null)
  const isSmall = useMediaQuery("(max-width:900px)")

  return (
    /* Main Layout: Header / Content Wrapper */
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <Box>
        <GappBar />
      </Box>

      {/* Content Wrapper: Sidebar (collapsable) / Main Content */}
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          overflow: "hidden", // Ensures the content doesn't overflow the container
        }}
      >
        {/* Sidebar */}
        <Paper
          component="aside"
          ref={paperRef}
          sx={{
            position: "relative",
            borderRadius: 0,
            width: isSidebarOpen ? 350 : 0, // Fixed width for the sidebar
            transition: "width 0.5s ease-in-out", // Smooth transition when collapsing
            overflowY: "auto", // Enables scrolling if the content exceeds the sidebar height
            boxShadow: isSmall ? "" : "1px 1px 5px rgba(0, 0, 0, 0.25)",
            zIndex: 1,
          }}
        >
          <GappList />
        </Paper>

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden", // Ensures the map stretches and fills the space
          }}
        >
          <GappMap />
        </Box>
      </Box>

      <Statistics />

      {isSmall && <MobileBar />}
    </Box>
  )
}

const DefaultLayout = () => (
    <LayoutContextProvider>
        <InnerLayout />
    </LayoutContextProvider>
)

export default DefaultLayout