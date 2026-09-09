import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useRecordContext,
  useRedirect,
  useResourceContext,
} from 'react-admin';
import PageHeadingBar from '../../_components/PageHeadingBar';
import { EditAction } from '../../_components/heading/HeadingActions';
import { useCan } from '../../rbac-manager/useCan';

interface CustomShowHeaderProps {
  redirectTo?: string;
  displayField?: string;
  hasEdit?: boolean;
  /** Extra heading actions, rendered between Edit and Back. */
  customActions?: ReactNode;
}

/**
 * Show-page heading bar: title from `displayField`, Edit (RBAC-gated),
 * module actions, and Back as the right-most icon (PageHeadingBar `onBack`).
 */
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
    <PageHeadingBar
      title={title}
      onBack={handleBack}
      actions={
        <>
          {hasEdit && record?.id != null && canOnResource('update', resource) && (
            <EditAction onClick={() => redirect('edit', resource, record.id)} />
          )}
          {customActions}
        </>
      }
    />
  );
};

export default CustomShowHeader;
