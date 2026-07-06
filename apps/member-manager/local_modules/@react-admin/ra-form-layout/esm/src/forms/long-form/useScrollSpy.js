import { useState, useEffect } from 'react';
import { throttle } from 'lodash';
export var useScrollSpy = function (_a) {
    var _b = _a.activeSectionDefault, activeSectionDefault = _b === void 0 ? 0 : _b, _c = _a.offsetPx, offsetPx = _c === void 0 ? 50 : _c, _d = _a.sectionElements, sectionElements = _d === void 0 ? [] : _d, _e = _a.throttleMs, throttleMs = _e === void 0 ? 100 : _e;
    var _f = useState(activeSectionDefault), activeSection = _f[0], setActiveSection = _f[1];
    var handle = throttle(function () {
        var currentSectionId = activeSection;
        for (var i = 0; i < sectionElements.length; i++) {
            var section = sectionElements[i];
            // Needs to be a valid DOM Element
            if (!section || !(section instanceof Element))
                continue;
            // GetBoundingClientRect returns values relative to viewport
            if (section.getBoundingClientRect().top + offsetPx < 0) {
                currentSectionId = i;
                continue;
            }
            // No need to continue loop, if last element has been detected
            break;
        }
        setActiveSection(currentSectionId);
    }, throttleMs, { trailing: false, leading: true });
    useEffect(function () {
        window.addEventListener('scroll', handle);
        // Run initially (but wait for one tick so that the sectionElement refs have registered)
        setTimeout(handle, 0);
        return function () {
            window.removeEventListener('scroll', handle);
        };
    }, [sectionElements, offsetPx, handle]);
    return activeSection;
};
