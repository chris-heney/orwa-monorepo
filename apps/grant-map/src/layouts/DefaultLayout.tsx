import { Box } from "@mui/material"
import { useMediaQuery } from "@uidotdev/usehooks"
import GappBar from "../components/AppBar"
import GappList from "../components/GappList"
import GappMap from "../components/GappMap"
import MobileBar from "../components/MobileBar"
import InsightsPanel from "../components/insights/InsightsPanel"
import { useRef } from "react"
import { useAppContext } from "../providers/AppContext"
import LayoutContextProvider from "../providers/LayoutContext"
import { T } from "../theme/tokens"



const InnerLayout = () => {

  const { isSidebarOpen } = useAppContext()

  const asideRef = useRef<HTMLDivElement>(null)
  const isSmall = useMediaQuery("(max-width:900px)")

  return (
    /* Main Layout: Header / Content Wrapper */
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: T.ink,
      }}
    >
      {/* Header */}
      <Box>
        <GappBar />
      </Box>

      {/* Content Wrapper: Sidebar (collapsable) / Map / Insights */}
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          overflow: "hidden", // Ensures the content doesn't overflow the container
        }}
      >
        {/* Sidebar */}
        <Box
          component="aside"
          ref={asideRef}
          sx={{
            position: "relative",
            width: isSidebarOpen ? 340 : 0, // Fixed width for the sidebar
            flexShrink: 0,
            transition: "width 0.4s ease-in-out", // Smooth transition when collapsing
            overflowY: "auto", // Enables scrolling if the content exceeds the sidebar height
            overflowX: "hidden",
            backgroundColor: T.ink,
            borderRight: isSidebarOpen ? `1px solid ${T.line}` : "none",
            zIndex: 1,
            "&::-webkit-scrollbar": { width: 8 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: T.panelSoft,
              borderRadius: 4,
            },
          }}
        >
          <GappList />
        </Box>

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

        {/* Financial insights sidecar */}
        <InsightsPanel />
      </Box>

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
