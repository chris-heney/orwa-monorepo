"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RowContext = void 0;
var react_1 = require("react");
/**
 * We need this context to communicate the callback to enable edit mode on a
 * row between the <EditableDatagridRow> and the <EditRowButton> and through
 * <DatagridRow> (which does not expect this prop).
 */
exports.RowContext = (0, react_1.createContext)(null);
