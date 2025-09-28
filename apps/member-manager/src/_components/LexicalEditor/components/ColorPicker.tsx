import React, { useCallback, useState } from 'react';
import { Box, Popover, TextField, Typography } from '@mui/material';

// Pre-defined colors for the color picker
const COLOR_OPTIONS = [
  '#000000', '#424242', '#636363', '#9C9C94', '#CEC6CE', '#EFEFEF', '#F7F3F7', '#FFFFFF',
  '#FF0000', '#FF9C00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9C00FF', '#FF00FF',
  '#F7C6CE', '#FFE7CE', '#FFEFC6', '#D6EFD6', '#CEDEE7', '#CEE7F7', '#D6D6E7', '#E7D6DE',
  '#E79C9C', '#FFC69C', '#FFE79C', '#B5D6A5', '#A5C6CE', '#9CC6EF', '#B5A5D6', '#D6A5BD',
  '#E76363', '#F7AD6B', '#FFD663', '#94BD7B', '#73A5AD', '#6BADDE', '#8C7BC6', '#C67BA5',
  '#CE0000', '#E79439', '#EFC631', '#6BA54A', '#4A7B8C', '#3984C6', '#634AA5', '#A54A7B',
  '#9C0000', '#B56308', '#BD9400', '#397B21', '#104A5A', '#085294', '#311873', '#731842',
  '#630000', '#7B3900', '#846300', '#295218', '#083139', '#003163', '#21104A', '#4A1031',
];

interface ColorPickerProps {
  onColorSelect: (color: string) => void;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorSelect, anchorEl, open, onClose }) => {
  const [customColor, setCustomColor] = useState('#ad3030');
  const [gradientPosition, setGradientPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);

  const handleGradientInteraction = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setGradientPosition({ x, y });
    
    // Simplified color calculation for better performance
    const hue = (x / 100) * 360;
    const saturation = 100 - (y / 100) * 50;
    const lightness = 100 - (y / 100) * 50;
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    setCustomColor(color);
    
    // Only apply color on click, not drag for better performance
    if (!isDragging) {
      onColorSelect(color);
    }
  }, [isDragging, onColorSelect]);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      slotProps={{
        paper: {
          sx: {
            maxHeight: '80vh',
            overflow: 'visible'
          }
        }
      }}
    >
      <Box sx={{ p: 2, width: 320, maxHeight: '70vh', overflow: 'auto' }}>
        {/* Hex Input */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="body2" sx={{ minWidth: 40 }}>Hex</Typography>
          <TextField
            size="small"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            onBlur={() => {
              // Validate hex and apply
              if (/^#[0-9A-F]{6}$/i.test(customColor)) {
                onColorSelect(customColor);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && /^#[0-9A-F]{6}$/i.test(customColor)) {
                onColorSelect(customColor);
              }
            }}
            sx={{ width: 120 }}
          />
        </Box>

        {/* Preset Colors */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: 1,
            mb: 2,
            maxHeight: 150,
            overflow: 'auto'
          }}
        >
          {COLOR_OPTIONS.map((color) => (
            <Box
              key={color}
              sx={{
                width: 28,
                height: 28,
                backgroundColor: color,
                border: '1px solid #ddd',
                borderRadius: 1,
                cursor: 'pointer',
                transition: 'transform 0.1s ease',
                '&:hover': {
                  borderColor: '#666',
                  transform: 'scale(1.1)',
                },
              }}
              onClick={() => {
                setCustomColor(color);
                onColorSelect(color);
                onClose();
              }}
            />
          ))}
        </Box>

        {/* Color Gradient Area */}
        <Box
          sx={{
            width: '100%',
            height: 150,
            background: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1)), linear-gradient(to right, white, ${customColor})`,
            borderRadius: 1,
            position: 'relative',
            cursor: 'crosshair',
            mb: 2,
            border: '1px solid #ddd',
            overflow: 'hidden'
          }}
          onMouseDown={(e) => {
            setIsDragging(true);
            handleGradientInteraction(e);
          }}
          onMouseMove={(e) => {
            if (isDragging) {
              handleGradientInteraction(e);
            }
          }}
          onMouseUp={() => {
            setIsDragging(false);
            onColorSelect(customColor);
          }}
          onMouseLeave={() => setIsDragging(false)}
          onClick={handleGradientInteraction}
        >
          {/* Color picker circle */}
          <Box
            sx={{
              position: 'absolute',
              left: `${gradientPosition.x}%`,
              top: `${gradientPosition.y}%`,
              width: 12,
              height: 12,
              border: '2px solid white',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
              pointerEvents: 'none'
            }}
          />
        </Box>

        {/* Hue Slider */}
        <Box
          sx={{
            width: '100%',
            height: 16,
            background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
            borderRadius: 1,
            cursor: 'pointer',
            border: '1px solid #ddd'
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const hue = (x / 100) * 360;
            const color = `hsl(${hue}, 100%, 50%)`;
            setCustomColor(color);
            onColorSelect(color);
          }}
        />
      </Box>
    </Popover>
  );
};

export default ColorPicker;
