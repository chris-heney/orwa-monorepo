import * as React from 'react';
import { AdminContext, useTranslate } from 'react-admin';
import { Typography } from '@mui/material';
import { SolarMenuLocalesItem } from '../../src/solar-layout/SolarMenuLocalesItem';
import { i18nProvider } from './i18nProvider';
export default { title: 'ra-navigation/SolarLayout/SolarMenuLocalesItem' };
export var Basic = function () { return (React.createElement(AdminContext, { i18nProvider: i18nProvider },
    React.createElement(SolarMenuLocalesItem, null),
    React.createElement(Component, null))); };
var Component = function () {
    var translate = useTranslate();
    return React.createElement(Typography, null, translate('ra.page.dashboard'));
};
