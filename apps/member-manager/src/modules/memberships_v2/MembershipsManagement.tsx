import React from 'react';
import MembershipsContextProvider from './MembershipsContextProvider';
import MembershipDashboard from './MembershipDashboard';

const MembershipsDashboard = () => {
  return (
    <MembershipsContextProvider>
      <MembershipDashboard />
    </MembershipsContextProvider>
  );
};

export default MembershipsDashboard;
