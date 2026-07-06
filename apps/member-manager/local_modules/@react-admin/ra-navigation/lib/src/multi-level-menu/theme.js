"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.theme = void 0;
var react_admin_1 = require("react-admin");
var merge_1 = __importDefault(require("lodash/merge"));
exports.theme = (0, merge_1.default)({}, react_admin_1.defaultTheme, {
    sidebar: {
        width: 96,
        closedWidth: 48,
    },
    components: {
        // @ts-ignore
        RaSidebar: {
            styleOverrides: {
                fixed: {
                    zIndex: 1200,
                },
            },
        },
    },
});
