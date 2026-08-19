import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomHeader from '../../_components/CustomHeader';
import {
  Button,
  EditButton,
  useRecordContext,
  useRedirect,
  useResourceContext,
} from 'react-admin';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCan, resourceToApiName } from '../../rbac-manager/useCan';

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
  const { can } = useCan();

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
          <Button
            onClick={handleBack}
            sx={{
              color: 'white',
              mr: 2,
            }}
            label="Back"
          >
            <ArrowBackIcon />
          </Button>
          {hasEdit && can('update', resourceToApiName(resource)) && (
            <EditButton
              sx={{
                color: 'white',
                mr: 2,
              }}
              resource={resource}
            />
          )}
          {customActions} {/* Inject custom action buttons */}
        </div>
      )}
    />
  );
};

export default CustomShowHeader;
