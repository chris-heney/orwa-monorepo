import {
  Box,
  InputBase,
  Typography,
  useMediaQuery,
} from "@mui/material"
import { ChangeEvent, useState } from "react"
import SearchIcon from "@mui/icons-material/Search"
import { useAppContext } from "../providers/AppContext"
import { useMapContext } from "../providers/MapContext"
import { T, display, money } from "../theme/tokens"
import { stageColorForApplication } from "../helpers/stages"

const GappList = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>("")

  const { applications, allApplications } = useAppContext()
  const { setIsSidebarOpen } = useAppContext()

  const { mapRef, setCurrentApplication } = useMapContext()

  // Filter applications based on the search keyword
  const filteredApplications = applications.filter((gapp) =>
    gapp.legal_entity_name.toLowerCase().includes(searchKeyword.toLowerCase())
  )

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value)
  }

  const isSmall = useMediaQuery("(max-width:900px)")

  return (
    <Box sx={{ p: 1.5 }}>
      <Typography
        sx={{
          ...display,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: T.textLo,
          textAlign: "left",
          mb: 1,
        }}
      >
        Applications{" "}
        <Box component="span" sx={{ color: T.textFaint }}>
          {applications.length} / {allApplications.length}
        </Box>
      </Typography>

      {/* Search */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.25,
          py: 0.5,
          borderRadius: "10px",
          backgroundColor: T.panel,
          border: `1px solid ${T.line}`,
          mb: 1.5,
          "&:focus-within": { borderColor: T.water },
        }}
      >
        <SearchIcon sx={{ fontSize: 18, color: T.textLo }} />
        <InputBase
          placeholder="Search systems…"
          inputProps={{ "aria-label": "search" }}
          value={searchKeyword}
          onChange={handleSearchInputChange}
          sx={{ color: T.textHi, fontSize: 14, width: "100%" }}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {filteredApplications.map((gapp) => (
          <Box
            onClick={() => {
              if (gapp.location != null) {
                mapRef.current?.getMap().flyTo({
                  center: { lat: gapp.location.lat, lng: gapp.location.lng },
                  zoom: 10,
                })
              }
              setCurrentApplication(gapp)
              if (isSmall) setIsSidebarOpen(false)
            }}
            key={gapp.id}
            sx={{
              px: 1.25,
              py: 1,
              cursor: "pointer",
              borderRadius: "10px",
              border: `1px solid transparent`,
              "&:hover": {
                backgroundColor: T.panelSoft,
                borderColor: T.line,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.9, minWidth: 0 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: stageColorForApplication(gapp),
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: 13.5,
                    color: T.textHi,
                    textAlign: "left",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {gapp.legal_entity_name}
                </Typography>
              </Box>
              {(gapp.award_amount || 0) > 0 && (
                <Typography
                  sx={{
                    ...display,
                    fontSize: 13,
                    fontWeight: 700,
                    color: T.committed,
                    fontVariantNumeric: "tabular-nums",
                    whiteSpace: "nowrap",
                  }}
                >
                  {money(gapp.award_amount, true)}
                </Typography>
              )}
            </Box>
            <Typography
              sx={{
                fontSize: 11,
                color: T.textFaint,
                textAlign: "left",
                ml: 2.1,
              }}
            >
              {gapp.county ? `${gapp.county} County` : "—"}
              {gapp.drinking_or_wastewater
                ? ` · ${gapp.drinking_or_wastewater}`
                : ""}
            </Typography>
          </Box>
        ))}

        {filteredApplications.length === 0 && (
          <Typography sx={{ fontSize: 12.5, color: T.textFaint, py: 2 }}>
            No applications match the current filters.
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default GappList
