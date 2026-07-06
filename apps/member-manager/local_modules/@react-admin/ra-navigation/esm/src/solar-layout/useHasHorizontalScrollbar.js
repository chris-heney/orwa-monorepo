import { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
export var useHasHorizontalScrollbar = function (ref) {
    var _a = useState(false), hasScrollbar = _a[0], setHasScrollbar = _a[1];
    useEffect(function () {
        var refresh = debounce(function () {
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
