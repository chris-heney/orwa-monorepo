import { RefObject, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';

export const useHasHorizontalScrollbar = (ref: RefObject<HTMLDivElement>) => {
    const [hasScrollbar, setHasScrollbar] = useState(false);

    useEffect(() => {
        const refresh = debounce(
            () => {
                if (ref.current) {
                    const newHasScrollbar =
                        ref.current.scrollHeight > ref.current.clientHeight;

                    setHasScrollbar(newHasScrollbar);
                }
            },
            200,
            { leading: true, trailing: true }
        );

        window.addEventListener('resize', refresh);

        refresh();

        return () => {
            window.removeEventListener('resize', refresh);
        };
    }, [ref]);

    return hasScrollbar;
};
