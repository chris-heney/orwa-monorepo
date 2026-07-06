"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItemCategoryResources = void 0;
var prop_types_1 = __importDefault(require("prop-types"));
var IconMenuResources_1 = require("./IconMenuResources");
// re-exported for backwards compatibility
exports.MenuItemCategoryResources = IconMenuResources_1.IconMenuResources;
exports.MenuItemCategoryResources.propTypes = {
    hasDashboard: prop_types_1.default.bool,
};
