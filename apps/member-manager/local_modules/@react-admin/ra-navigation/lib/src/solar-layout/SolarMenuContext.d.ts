import { ReactNode } from 'react';
export type SolarMenuContextValue = {
    renderSlot: 'primary' | 'secondary';
    setSecondaryContent(content: ReactNode): void;
};
export declare const SolarMenuContext: import("react").Context<SolarMenuContextValue>;
export declare const useSolarMenuContext: () => SolarMenuContextValue;
export declare const SolarMenuContextProvider: import("react").Provider<SolarMenuContextValue>;
//# sourceMappingURL=SolarMenuContext.d.ts.map