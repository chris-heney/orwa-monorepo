"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormDialogContext = void 0;
var react_1 = require("react");
/**
 * A context holding open/close state and callbacks for managing a child form dialog.
 *
 * @param value.open The open/close state. `true` if the dialog is open.
 * @param value.open The callback that gets called to open the dialog.
 * @param value.close The callback that gets called to close the dialog.
 */
exports.FormDialogContext = (0, react_1.createContext)(null);
