import React, { ReactNode } from 'react';
import { 
  Box, 
  Theme, 
  Typography, 
  useMediaQuery, 
  useTheme,
  Button,
  Avatar,
  IconButton
} from '@mui/material';
import { SxProps } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';

interface CIWebHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onCreateClick?: () => void;
  createButtonLabel?: string;
  showCreateButton?: boolean;
  children?: ReactNode;
  sx?: SxProps;
}

const CIWebHeader: React.FC<CIWebHeaderProps> = ({ 
  title, 
  subtitle, 
  icon, 
  onCreateClick, 
  createButtonLabel = 'CREATE',
  showCreateButton = true,
  children,
  sx 
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Logo styling
  const logoStyles = {
    backgroundColor: isDarkMode ? '#444' : '#f8f8f8',
    color: isDarkMode ? '#fff' : '#0073aa',
    width: isSmall ? 30 : 40,
    height: isSmall ? 30 : 40,
    marginRight: 1,
    fontWeight: 'bold',
    fontSize: isSmall ? 14 : 18
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      width: '100%', 
      overflow: 'hidden',
      ...sx
    }}>
      {/* Main header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        p: isSmall ? 1.5 : 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {icon ? (
            icon
          ) : (
            <Avatar sx={logoStyles}>CI</Avatar>
          )}
          <Box>
            <Typography
              variant='h6'
              sx={{
                fontSize: isSmall ? '16px' : '20px',
                fontWeight: 'bold',
                lineHeight: 1.2
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant='subtitle2'
                sx={{
                  fontSize: isSmall ? '12px' : '14px',
                  fontWeight: 'normal'
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        
        {showCreateButton && onCreateClick && (
          isSmall ? (
            <IconButton 
              size="small" 
              onClick={onCreateClick}
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              <AddIcon />
            </IconButton>
          ) : (
            <Button
              startIcon={<AddIcon />}
              onClick={onCreateClick}
              variant="contained"
              size="small"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.25)'
                },
                fontWeight: 'bold'
              }}
            >
              {createButtonLabel}
            </Button>
          )
        )}
      </Box>
      
      {/* Children content area */}
      {children && (
        <Box sx={{
          backgroundColor: theme.palette.background.paper,
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
          p: 2
        }}>
          {children}
        </Box>
      )}
    </Box>
  );
};

export default CIWebHeader; 