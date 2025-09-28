import * as React from 'react';
import { LoadingIndicator } from 'react-admin';
import { SolarAppBar } from '@react-admin/ra-navigation';
import { Alert } from '@mui/material';
import { useUserPermissions } from '../rbac2';

import Search from './Search';

const CustomAppBar = () => {
    const { isTestingRole, activeTestRole, isOriginalSuperAdmin } = useUserPermissions();

    return (
        <>
            {/* Test Mode Indicator */}
            {isTestingRole && isOriginalSuperAdmin() && (
                <Alert 
                    severity="warning" 
                    sx={{ 
                        borderRadius: 0,
                        justifyContent: 'center',
                        '& .MuiAlert-message': {
                            fontSize: '0.8rem',
                            fontWeight: 'bold'
                        }
                    }}
                >
                    🧪 TESTING MODE: Viewing as "{activeTestRole}" role
                </Alert>
            )}
            <SolarAppBar>
                <Search />
                <LoadingIndicator />
            </SolarAppBar>
        </>
    );
};

export default CustomAppBar;
