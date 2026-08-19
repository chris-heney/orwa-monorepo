import type { SxProps, Theme } from "@mui/material/styles";

export const reviewFormSx: SxProps<Theme> = {
  p: 0,
  width: "100%",
  maxWidth: "none",
  "& .MuiStack-root": {
    alignItems: "stretch",
    width: "100%",
    maxWidth: "none",
  },
};

export const reviewResourceSx: SxProps<Theme> = {
  width: "100%",
  maxWidth: "none",
  "& .RaEdit-main, & .RaShow-main": {
    width: "100%",
    maxWidth: "none",
  },
  "& .RaEdit-card, & .RaShow-card": {
    width: "100%",
    maxWidth: "none",
    boxShadow: "none",
    backgroundColor: "transparent",
  },
};

export const fullFieldSx: SxProps<Theme> = {
  width: "100%",
  "& .MuiFormControl-root": { width: "100%" },
  "& .MuiInputBase-root": { width: "100%" },
  "& .MuiInputBase-input": {
    overflow: "visible",
    textOverflow: "clip",
  },
};

export const emailFieldSx: SxProps<Theme> = {
  ...fullFieldSx,
  "& .MuiInputBase-input": {
    overflow: "visible",
    textOverflow: "unset",
    whiteSpace: "nowrap",
  },
};

export const sectionCardSx: SxProps<Theme> = {
  p: 2,
  height: "100%",
  bgcolor: "background.paper",
  color: "text.primary",
  boxShadow: (theme) => (theme.palette.mode === "dark" ? "none" : undefined),
  border: 1,
  borderColor: "divider",
};

export const toolbarSx: SxProps<Theme> = {
  bgcolor: "background.paper",
  color: "text.primary",
  borderTop: 1,
  borderColor: "divider",
  justifyContent: "space-between",
};
