import React, { useState } from 'react';
import { Button, Menu, MenuItem, Checkbox } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useMediaQuery } from '@uidotdev/usehooks';
import { useAppContext } from '@/providers/AppContext';
import { MapLayer } from '@/types/MapLayer';


const LayersButton = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const { activeLayer, setActiveLayer } = useAppContext(); // Use context for active layer
  const isSmall = useMediaQuery('(max-width:900px)');

  // const layers = ['District Layer', 'County Layer', 'Tribal Layer']; // Layer options

  const layers = ['District Layer']; 

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleLayerClick = (layer: MapLayer) => {
    setActiveLayer(layer); // Set active layer in context
    setOpen(false);
  };

  return (
    <>
      <Button
        size={isSmall ? 'small' : 'medium'}
        color="inherit"
        aria-label="open drawer"
        aria-controls="layers-menu"
        aria-haspopup="true"
        onClick={handleMenuOpen}
        sx={{ 
            mr: 2,
            p: isSmall ? 0 : null,
            fontSize: isSmall ? '0.6rem' : null
         }}
      >
        Layers
        <ExpandMoreIcon
          sx={{
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.3s ease-in-out',
          }}
        />
      </Button>
      <Menu
        id="layers-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ maxHeight: 400 }}
      >
        {layers.map((layer: any, index: number) => (
          <MenuItem
            sx={{ px: 1 }}
            key={index}
            onClick={() => handleLayerClick(layer)}
          >
            <Checkbox size="small" checked={activeLayer === layer} />
            {layer}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LayersButton;