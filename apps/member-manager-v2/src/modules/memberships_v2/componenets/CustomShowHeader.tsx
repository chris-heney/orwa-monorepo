import React, { ReactNode } from 'react';
import CustomHeader from '../../_components/CustomHeader';
import { Button, EditButton, RaRecord, useRecordContext, useRedirect, useResourceContext } from 'react-admin';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useCurrentUser from '../../_helpers/useCurrentUser';

interface CustomShowHeaderProps {
  redirectTo?: string;
  displayField?: string;
  display?: (record: RaRecord) => string;  // Function to generate display text from record
  hasEdit?: boolean;
  customActions?: ReactNode;  // Allow custom buttons to be injected
}

const CustomShowHeader: React.FC<CustomShowHeaderProps> = ({
  redirectTo = '/membership-management',
  displayField = 'name',
  display,
  hasEdit = true,
  customActions,
}) => {
  const redirect = useRedirect();
  const resource = useResourceContext();
  const record = useRecordContext();
  
  // Use display function if provided, otherwise fall back to displayField
  const title = record 
    ? (display ? display(record) : `${record[displayField]}`)
    : `View ${resource.charAt(0).toUpperCase() + resource.slice(1)}`;
    
  const {role} = useCurrentUser();

  return (
    <CustomHeader
      title={title}
      
      Component={() => (
        <div>
          <Button
            onClick={() => redirect(redirectTo)}
            sx={{
              color: 'white',
              mr: 2,
            }}
            label='Back'
          >
            <ArrowBackIcon />
          </Button>
          {(hasEdit && role === "Admin") && (
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