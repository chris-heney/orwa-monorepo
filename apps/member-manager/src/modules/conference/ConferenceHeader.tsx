import React from 'react';
import { Theme, useMediaQuery } from '@mui/material';
import { Loading, useListContext, useRedirect } from 'react-admin';
import RecordCount from '../_components/RecordCount';
import PageHeadingBar from '../_components/PageHeadingBar';
import {
  AddAction,
  ColumnsAction,
  ExportAction,
  FilterAction,
} from '../_components/heading/HeadingActions';
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
    isFilterSidebarOpen,
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

  const conferenceName =
    titleConferenceId != null
      ? conferences.find(
          (conference) =>
            getConferenceFilterId(conference) === titleConferenceId
        )?.name
      : 'All Conferences';

  const addLabel = `Add ${
    title.endsWith('s')
      ? title.slice(0, -1).split('-').join(' ')
      : title.split('-').join(' ')
  }`;

  return conferences.length === 0 ? (
    <Loading />
  ) : (
    <PageHeadingBar
      title={`${conferenceName} : ${title}`}
      actions={
        !isSmall ? (
          <>
            {resource !== '' && (
              <>
                <RecordCount />
                {canCreate && (
                  <AddAction
                    label={addLabel}
                    onClick={() => {
                      if (selectedTab === 'sponsors') {
                        redirect('/conference-sponsors/create');
                      } else {
                        setIsCreating((prev) => !prev);
                      }
                    }}
                  />
                )}

                <ColumnsAction />

                <ExportAction />
                <VendorAttendeeExportButton />
              </>
            )}

            <FilterAction
              active={isFilterSidebarOpen}
              onClick={() => {
                setIsFilterSidebarOpen((prev) => !prev);
                setTimeout(() => {
                  window.scrollTo(document.body.scrollWidth, 0);
                }, 150);
              }}
            />
          </>
        ) : undefined
      }
    />
  );
};

export default ConferenceHeader;
