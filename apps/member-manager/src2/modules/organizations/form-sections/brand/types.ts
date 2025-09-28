import { SxProps, Theme } from '@mui/material';

export interface StyleProps {
    styles: {
        section?: SxProps<Theme>;
        sectionTitle: SxProps<Theme>;
        icon: SxProps<Theme>;
        inputWrapper: SxProps<Theme>;
        highlight?: SxProps<Theme>;
        colorPalette?: SxProps<Theme>;
        colorBlock?: SxProps<Theme>;
        paletteCard?: SxProps<Theme>;
        selectedPalette?: SxProps<Theme>;
        selectedFont?: SxProps<Theme>;
    };
}

export interface ColorPaletteProps extends StyleProps {
    selectedPaletteIndex: number | null;
    handlePaletteSelect: (index: number) => void;
    setSelectedPaletteIndex: (index: number) => void;
}

export interface FontSelectionProps extends StyleProps {
    selectedFontName: string | null;
    handleFontSelect: (font: { name: string; value: string }) => void;
} 