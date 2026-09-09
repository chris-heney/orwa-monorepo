import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useResourceContext, useShowContext } from 'react-admin';
import PageHeadingBar from '../../_components/PageHeadingBar';
import { EditAction } from '../../_components/heading/HeadingActions';
import { formatTitle } from '../../../helpers/formatResourceTitle';
import useCurrentUser from '../../_helpers/useCurrentUser';
import { useCan } from '../../rbac-manager/useCan';

/** Contact / Staff show heading: Edit, then Back (right-most). */
const ShowHeader = ({ first, last }: { first: string; last: string }) => {
  const navigate = useNavigate();
  const { record } = useShowContext();
  const resource = useResourceContext();
  const { user } = useCurrentUser();
  const { canOnResource } = useCan();

  const isSelf = record?.email && user?.email && record.email === user.email;

  return (
    <PageHeadingBar
      title={`${first} ${last}`.trim()}
      actions={
        canOnResource('update', resource) && record?.id != null ? (
          <EditAction
            label={`Edit ${formatTitle(resource)}`}
            onClick={() => navigate(`/${resource}/${record.id}/edit`)}
          />
        ) : undefined
      }
      onBack={() =>
        navigate(isSelf ? '/profile' : '/human-resources/dashboard')
      }
      backLabel={isSelf ? 'Profile' : 'Dashboard'}
    />
  );
};

export default ShowHeader;
