import React, { useState, useEffect } from 'react';
import { Button, Menu, MenuItem, Checkbox } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useGetMapLayers } from '../helpers/APIService'; // Assuming this is your API helper
import { MapLayer } from '../types/MapLayer';
import { useAppContext } from '../providers/AppContext';

const SelectMapLayer: React.FC = () => {
  const { activeLayer, setActiveLayer, setSelectedRegions } = useAppContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [mapLayers, setMapLayers] = useState<MapLayer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMapLayers = async () => {
      try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const layers = await useGetMapLayers();
        setMapLayers(layers);
      } catch (error) {
        console.error("Failed to fetch map layers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMapLayers();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleMenuClick = (layer: MapLayer) => {
    if (activeLayer?.file === layer.file) {
      setActiveLayer(null);
      setSelectedRegions([]); // Reset selected map regions when unselecting the layer
    } else {
      setActiveLayer(layer);
    }
    handleMenuClose();
  };

  const isLayerSelected = (layer: MapLayer) => activeLayer?.file === layer.file;

  if (loading) return <p>Loading map layers...</p>;

  return (
    <>
      <Button
        size="small"
        aria-label="open map layers menu"
        aria-controls="map-layers-menu"
        aria-haspopup="true"
        onClick={handleMenuOpen}
        sx={{
          color: 'black',
          backgroundColor: 'white',
          textTransform: 'none',
        }}
      >
        Map Layers
        <ExpandMoreIcon
          sx={{
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.3s ease-in-out',
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
        {mapLayers.map((layer, index) => (
          <MenuItem key={index} onClick={() => handleMenuClick(layer)}>
            <Checkbox size="small" checked={isLayerSelected(layer)} />
            {layer.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default SelectMapLayer;