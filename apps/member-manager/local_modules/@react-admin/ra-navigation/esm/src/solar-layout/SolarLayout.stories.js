import * as React from 'react';
import { testDataProvider, Admin, Resource } from 'react-admin';
import { Typography, Skeleton } from '@mui/material';
import { Book, People, ChatBubble } from '@mui/icons-material';
import { MemoryRouter } from 'react-router-dom';
import { SolarLayout } from '.';
import { useDefineAppLocation } from '../app-location';
export default { title: 'ra-navigation/SolarLayout/SolarLayout' };
export var Basic = function () { return (React.createElement(MemoryRouter, { initialEntries: ['/'] },
    React.createElement(Admin, { dataProvider: testDataProvider(), layout: SolarLayout },
        React.createElement(Resource, { name: "posts", list: PostList, icon: Book }),
        React.createElement(Resource, { name: "comments", list: CommentList, icon: ChatBubble }),
        React.createElement(Resource, { name: "users", list: UserList, icon: People })))); };
export var RenderingError = function () { return (React.createElement(MemoryRouter, { initialEntries: ['/'] },
    React.createElement(Admin, { dataProvider: testDataProvider(), layout: SolarLayout },
        React.createElement(Resource, { name: "posts", list: function () {
                throw new Error('A problem has occurred');
            }, icon: Book }),
        React.createElement(Resource, { name: "comments", list: CommentList, icon: ChatBubble }),
        React.createElement(Resource, { name: "users", list: UserList, icon: People })))); };
var Dashboard = React.lazy(
// @ts-ignore to ignore compilation error "Dynamic imports are only supported when the '--module' flag is set to 'es2020', 'es2022', 'esnext', 'commonjs', 'amd', 'system', 'umd', 'node16', or 'nodenext'."
function () { return import('../../stories/solar-layout/Dashboard'); });
export var LazyLoading = function () { return (React.createElement(MemoryRouter, { initialEntries: ['/'] },
    React.createElement(Admin, { dataProvider: testDataProvider(), layout: SolarLayout, dashboard: Dashboard },
        React.createElement(Resource, { name: "posts", list: PostList, icon: Book }),
        React.createElement(Resource, { name: "comments", list: CommentList, icon: ChatBubble }),
        React.createElement(Resource, { name: "users", list: UserList, icon: People })))); };
var Page = function (_a) {
    var title = _a.title;
    useDefineAppLocation(title.toLowerCase() || 'dashboard');
    return (React.createElement(React.Fragment, null,
        React.createElement(Typography, { variant: "h5", mt: 2 }, title),
        React.createElement(Skeleton, { height: 300 })));
};
var PostList = function () { return React.createElement(Page, { title: "Posts" }); };
var CommentList = function () { return React.createElement(Page, { title: "Comments" }); };
var UserList = function () { return React.createElement(Page, { title: "Users" }); };
