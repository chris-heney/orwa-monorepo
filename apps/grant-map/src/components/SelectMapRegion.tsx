import React, { useState } from "react";
import { Button, Menu, MenuItem, Checkbox } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAppContext } from "../providers/AppContext";
import { SpatialRegion } from "../types/SpatialRegion";

interface MapLayersButtonProps {}

const SelectMapRegion: React.FC<MapLayersButtonProps> = () => {
  const {
    activeLayer,
    selectedRegions,
    setSelectedRegions,
  } = useAppContext(); // Get the filters and setFilters from the app context
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(false);


  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleMenuClick = (region: SpatialRegion) => {
    const updatedSelectedRegions = selectedRegions.includes(region.name)
      ? selectedRegions.filter((selected) => selected !== region.name)
      : [...selectedRegions, region.name];

    setSelectedRegions(updatedSelectedRegions);
  };

  const isRegionSelected = (region: SpatialRegion) => {
    return selectedRegions.includes(region.name);
  };

  if (!activeLayer?.regions) {
    return <p>Loading map layers...</p>; // Show a loading state while fetching
  }

  return (
    <>
      <Button
        size="medium"
        sx={{
          color: 'black',
          backgroundColor: 'white',
          textTransform: 'none',
          '&:hover': {
            transform: 'scale(1.02)',
            
          }
        }}
        aria-label="open map layers menu"
        aria-controls="map-layers-menu"
        aria-haspopup="true"
        onClick={handleMenuOpen}
      >
        {activeLayer.title}
        <ExpandMoreIcon
          sx={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.3s ease-in-out",
          }}
        />
      </Button>
      <Menu
        id="map-layers-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          maxHeight: 400,
        }}
      >
        {activeLayer?.regions.map((region: SpatialRegion, index) => (
          <MenuItem key={index} onClick={() => handleMenuClick(region)}>
            <Checkbox size="small" checked={isRegionSelected(region)} />
            {region.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default SelectMapRegion;
