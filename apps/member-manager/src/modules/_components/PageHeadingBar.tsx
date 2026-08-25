import React, { ReactNode } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TopToolbar from './CustomToptoolBar';

type PageHeadingBarProps = {
  title: ReactNode;
  /** Shown on the info (i) tooltip next to the title */
  info?: string;
  /** Optional right-side actions (filters, buttons, etc.) */
  actions?: ReactNode;
  /** Extra styles merged onto the bar, e.g. a sticky `top` offset. */
  sx?: SxProps<Theme>;
};

/** Sticky dark heading bar — flush on the content, square corners. */
const PageHeadingBar = ({ title, info, actions, sx }: PageHeadingBarProps) => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

  return (
    <Box
      sx={[
        {
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
          backgroundColor: '#262626',
          px: 1.5,
          py: 0.75,
          minHeight: 48,
          m: 0,
          borderRadius: 0,
          width: '100%',
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        // Callers must not re-introduce a gutter under the bar.
        { mt: 0, mb: 0, mx: 0, borderRadius: 0 },
      ]}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: 0.25, minWidth: 0 }}
      >
        <Typography
          variant="h6"
          component="h1"
          sx={{
            fontSize: isSmall ? '0.75rem' : undefined,
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
          }}
        >
          {title}
        </Typography>
        {info ? (
          <Tooltip title={info} placement="bottom-start" arrow>
            <IconButton
              size="small"
              aria-label="About this page"
              sx={{
                color: 'grey.400',
                p: 0.5,
                '&:hover': { color: 'common.white' },
              }}
            >
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : null}
      </Box>
      {actions ? (
        <TopToolbar>
          <Box
            className="heading-actions"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            {actions}
          </Box>
        </TopToolbar>
      ) : null}
    </Box>
  );
};

export default PageHeadingBar;
