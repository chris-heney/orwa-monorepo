import React from 'react';
import { Box, Theme, Typography, useMediaQuery } from '@mui/material';
import {
  Button,
  ExportButton,
  Loading,
  SelectColumnsButton,
  useListContext,
  useRedirect,
} from 'react-admin';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddIcon from '@mui/icons-material/Add';
import RecordCount from '../_components/RecordCount';
import { useCan } from '../rbac-manager/useCan';
import { useConferenceContext } from './ConferenceContext';
import VendorAttendeeExportButton from './components/VendorAttendeeExportButton';
import {
  getConferenceFilterId,
  getPrimaryConferenceId,
} from './helpers/mergeConferenceAcrossTabFilters';

const ConferenceHeader = () => {
  const {
    selectedTab,
    setIsFilterSidebarOpen,
    conferences,
    resource,
    setIsCreating,
  } = useConferenceContext();

  const { filterValues } = useListContext();
  const titleConferenceId = getPrimaryConferenceId(filterValues);

  const redirect = useRedirect();
  const { canOnResource } = useCan();
  const canCreate = canOnResource('create', resource ?? '');

  const title = selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1);

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

  return conferences.length === 0 ? (
    <Loading />
  ) : (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#262626',
        px: 1.5,
        py: 0.75,
        minHeight: 48,
      }}
    >
      <Typography
        variant={isSmall ? 'subtitle2' : 'h6'}
        sx={{
          color: 'white',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          textAlign: 'left',
          lineHeight: 1.2,
          m: 0,
        }}
      >
        {titleConferenceId != null
          ? conferences.find(
              (conference) =>
                getConferenceFilterId(conference) === titleConferenceId
            )?.name
          : 'All Conferences'}{' '}
        : {title}
      </Typography>
      {!isSmall && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1.5,
            minHeight: 0,
            '& .MuiButton-root': {
              minHeight: 0,
              py: 0.5,
              lineHeight: 1.2,
            },
            '& .MuiTypography-root': {
              lineHeight: 1.2,
              display: 'flex',
              alignItems: 'center',
            },
          }}
        >
          {resource !== '' && (
            <>
              <RecordCount />
              {canCreate && (
                <Button
                  onClick={() => {
                    if (selectedTab === 'sponsors') {
                      redirect('/conference-sponsors/create');
                    } else {
                      setIsCreating((prev) => !prev);
                    }
                  }}
                  sx={{
                    color: 'white',
                  }}
                  label={`Add ${
                    title.endsWith('s')
                      ? title.slice(0, -1).split('-').join(' ')
                      : title.split('-').join(' ')
                  }`}
                >
                  <AddIcon />
                </Button>
              )}

              <SelectColumnsButton
                style={{
                  color: 'white',
                }}
              />

              <ExportButton
                sx={{
                  color: 'white',
                }}
              />
              <VendorAttendeeExportButton />
            </>
          )}

          <Button
            label="Filter"
            sx={{
              color: 'white',
            }}
            onClick={() => {
              setIsFilterSidebarOpen((prev) => !prev);
              setTimeout(() => {
                window.scrollTo(document.body.scrollWidth, 0);
              }, 150);
            }}
          >
            <FilterAltIcon />
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ConferenceHeader;
