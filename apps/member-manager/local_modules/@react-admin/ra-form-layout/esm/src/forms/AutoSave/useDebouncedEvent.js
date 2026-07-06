import { useCallback, useRef, useEffect } from 'react';
import debounce from 'lodash/debounce';
// Hook somewhat equivalent to react-admin's useEvent, but with a debounce
// Returns a debounced callback which will not change across re-renders unless the
// callback or delay changes
export var useDebouncedEvent = function (callback, delay) {
    // Create a ref that stores the debounced callback
    var debouncedCallbackRef = useRef(debounce(callback, delay));
    // Whenever callback or delay changes, we need to update the debounced callback
    useEffect(function () {
        debouncedCallbackRef.current = debounce(callback, delay);
    }, [callback, delay]);
    // The function returned by useCallback will invoke the debounced callback
    // Its dependencies array is empty, so it never changes across re-renders
    return useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return debouncedCallbackRef.current.apply(debouncedCallbackRef, args);
    }, []);
};
