"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDebouncedEvent = void 0;
var react_1 = require("react");
var debounce_1 = __importDefault(require("lodash/debounce"));
// Hook somewhat equivalent to react-admin's useEvent, but with a debounce
// Returns a debounced callback which will not change across re-renders unless the
// callback or delay changes
var useDebouncedEvent = function (callback, delay) {
    // Create a ref that stores the debounced callback
    var debouncedCallbackRef = (0, react_1.useRef)((0, debounce_1.default)(callback, delay));
    // Whenever callback or delay changes, we need to update the debounced callback
    (0, react_1.useEffect)(function () {
        debouncedCallbackRef.current = (0, debounce_1.default)(callback, delay);
    }, [callback, delay]);
    // The function returned by useCallback will invoke the debounced callback
    // Its dependencies array is empty, so it never changes across re-renders
    return (0, react_1.useCallback)(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return debouncedCallbackRef.current.apply(debouncedCallbackRef, args);
    }, []);
};
exports.useDebouncedEvent = useDebouncedEvent;
