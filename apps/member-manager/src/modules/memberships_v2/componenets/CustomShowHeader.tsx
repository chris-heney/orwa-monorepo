import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomHeader from '../../_components/CustomHeader';
import {
  EditButton,
  useRecordContext,
  useRedirect,
  useResourceContext,
} from 'react-admin';
import { useCan } from '../../rbac-manager/useCan';
import { BackAction } from '../../_components/heading/HeadingActions';

interface CustomShowHeaderProps {
  redirectTo?: string;
  displayField?: string;
  hasEdit?: boolean;
  customActions?: ReactNode; // Allow custom buttons to be injected
}

const CustomShowHeader: React.FC<CustomShowHeaderProps> = ({
  redirectTo = '/membership-management',
  displayField = 'name',
  hasEdit = true,
  customActions,
}) => {
  const redirect = useRedirect();
  const navigate = useNavigate();
  const resource = useResourceContext();
  const record = useRecordContext();
  const title = record
    ? `${record[displayField]}`
    : `View ${resource.charAt(0).toUpperCase() + resource.slice(1)}`;
  const { canOnResource } = useCan();

  const handleBack = () => {
    // Prefer history so list→show→back restores prior location; fall back for deep links.
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    redirect(redirectTo);
  };

  return (
    <CustomHeader
      title={title}
      Component={() => (
        <div>
          <BackAction onClick={handleBack} />
          {hasEdit && canOnResource('update', resource) && (
            <EditButton
              sx={{
                color: 'white',
                mr: 2,
              }}
              resource={resource}
            />
          )}
          {customActions}
        </div>
      )}
    />
  );
};

export default CustomShowHeader;
