import { useState, useEffect } from 'react';
import { throttle } from 'lodash';

export interface useScrollSpyParams {
    activeSectionDefault?: number;
    offsetPx?: number;
    sectionElements: HTMLElement[];
    throttleMs?: number;
}
export const useScrollSpy = ({
    activeSectionDefault = 0,
    offsetPx = 50,
    sectionElements = [],
    throttleMs = 100,
}: useScrollSpyParams) => {
    const [activeSection, setActiveSection] = useState(activeSectionDefault);

    const handle = throttle(
        () => {
            let currentSectionId = activeSection;
            for (let i = 0; i < sectionElements.length; i++) {
                const section = sectionElements[i];
                // Needs to be a valid DOM Element
                if (!section || !(section instanceof Element)) continue;
                // GetBoundingClientRect returns values relative to viewport
                if (section.getBoundingClientRect().top + offsetPx < 0) {
                    currentSectionId = i;
                    continue;
                }
                // No need to continue loop, if last element has been detected
                break;
            }

            setActiveSection(currentSectionId);
        },
        throttleMs,
        { trailing: false, leading: true }
    );

    useEffect(() => {
        window.addEventListener('scroll', handle);

        // Run initially (but wait for one tick so that the sectionElement refs have registered)
        setTimeout(handle, 0);

        return () => {
            window.removeEventListener('scroll', handle);
        };
    }, [sectionElements, offsetPx, handle]);
    return activeSection;
};
