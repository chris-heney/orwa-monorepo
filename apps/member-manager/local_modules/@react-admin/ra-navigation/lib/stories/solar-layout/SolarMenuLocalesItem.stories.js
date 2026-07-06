"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Basic = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var material_1 = require("@mui/material");
var SolarMenuLocalesItem_1 = require("../../src/solar-layout/SolarMenuLocalesItem");
var i18nProvider_1 = require("./i18nProvider");
exports.default = { title: 'ra-navigation/SolarLayout/SolarMenuLocalesItem' };
var Basic = function () { return (React.createElement(react_admin_1.AdminContext, { i18nProvider: i18nProvider_1.i18nProvider },
    React.createElement(SolarMenuLocalesItem_1.SolarMenuLocalesItem, null),
    React.createElement(Component, null))); };
exports.Basic = Basic;
var Component = function () {
    var translate = (0, react_admin_1.useTranslate)();
    return React.createElement(material_1.Typography, null, translate('ra.page.dashboard'));
};
