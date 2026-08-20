import React from 'react';
import CustomHeader from '../../_components/CustomHeader';
import { Box, IconButton, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { Edit } from '@mui/icons-material';
import { useResourceContext, useShowContext } from 'react-admin';
import { formatTitle } from '../../../helpers/formatResourceTitle';
import useCurrentUser from '../../_helpers/useCurrentUser';
import { useCan } from '../../rbac-manager/useCan';

const ShowHeader = ({ first, last }: { first: string; last: string }) => {
  const navigate = useNavigate();
  const { record } = useShowContext();
  const resource = useResourceContext();
  const { user } = useCurrentUser();
  const { canOnResource } = useCan();

  return (
    <CustomHeader
      title={first + ' ' + last}
      Component={() => (
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, gap: 1 }}>
          {canOnResource('update', resource) && (
            <Tooltip title={`Edit ${formatTitle(resource)}`}>
              <IconButton
                onClick={() => navigate(`/${resource}/${record.id}/edit`)}
                sx={{ color: 'white' }}
              >
                <Edit sx={{ color: 'white' }} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip
            title={`${record.email === user.email ? 'Profile' : 'Dashboard'}`}
          >
            <IconButton
              sx={{ mr: 1 }}
              onClick={() =>
                navigate(
                  record.email === user.email
                    ? '/admin/settings'
                    : '/human-resources/dashboard'
                )
              }
            >
              <ArrowBackIcon sx={{ color: 'white' }} />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    />
  );
};

export default ShowHeader;
