import { DASHBOARD, useDefineAppLocation } from '../../src';
import React from 'react';
import { CardContentInner, Title } from 'react-admin';
export var Dashboard = function () {
    useDefineAppLocation(DASHBOARD);
    return (React.createElement(React.Fragment, null,
        React.createElement(Title, { title: "ra.page.dashboard" }),
        React.createElement(CardContentInner, null, "Welcome to the react-admin solar layout demo")));
};
export default Dashboard;
