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
exports.EditableDatagridRowEditBase = void 0;
var React = __importStar(require("react"));
var react_admin_1 = require("react-admin");
var useEditableDatagridEditController_1 = require("./useEditableDatagridEditController");
/**
 * `EditableDatagridRowEditBase` is a base component for editable rows in a EditableDatagrid.
 * It provides basic functionality for editing a row
 *
 * @param {Object} props The properties passed to the component
 *
 * @returns {React.Component} Returns a React component.
 */
var EditableDatagridRowEditBase = function (props) {
    var children = props.children;
    var controllerProps = (0, useEditableDatagridEditController_1.useEditableDatagridEditController)(props);
    return (React.createElement(react_admin_1.SaveContextProvider, { value: controllerProps }, children));
};
exports.EditableDatagridRowEditBase = EditableDatagridRowEditBase;
