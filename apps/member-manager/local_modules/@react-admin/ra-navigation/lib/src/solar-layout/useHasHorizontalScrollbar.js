"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHasHorizontalScrollbar = void 0;
var react_1 = require("react");
var debounce_1 = __importDefault(require("lodash/debounce"));
var useHasHorizontalScrollbar = function (ref) {
    var _a = (0, react_1.useState)(false), hasScrollbar = _a[0], setHasScrollbar = _a[1];
    (0, react_1.useEffect)(function () {
        var refresh = (0, debounce_1.default)(function () {
            if (ref.current) {
                var newHasScrollbar = ref.current.scrollHeight > ref.current.clientHeight;
                setHasScrollbar(newHasScrollbar);
            }
        }, 200, { leading: true, trailing: true });
        window.addEventListener('resize', refresh);
        refresh();
        return function () {
            window.removeEventListener('resize', refresh);
        };
    }, [ref]);
    return hasScrollbar;
};
exports.useHasHorizontalScrollbar = useHasHorizontalScrollbar;
