import DashboardBanner from './DashboardBanner';
import RoleBasedDashboard from './RoleBasedDashboard';

const Welcome = () => {
    return (
        <>
            <DashboardBanner />
            <RoleBasedDashboard />
        </>
    );
};

export default Welcome;
