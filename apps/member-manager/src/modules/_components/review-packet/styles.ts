export const reviewFormSx = {
  p: 0,
  width: "100%",
  maxWidth: "none",
  "& .MuiStack-root": {
    alignItems: "stretch",
    width: "100%",
    maxWidth: "none",
  },
};

export const reviewResourceSx = {
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

export const fullFieldSx = {
  width: "100%",
  "& .MuiFormControl-root": { width: "100%" },
  "& .MuiInputBase-root": { width: "100%" },
  "& .MuiInputBase-input": {
    overflow: "visible",
    textOverflow: "clip",
  },
};

export const emailFieldSx = {
  ...fullFieldSx,
  "& .MuiInputBase-input": {
    overflow: "visible",
    textOverflow: "unset",
    whiteSpace: "nowrap",
  },
};

export const sectionCardSx = {
  p: 2,
  m: 0,
  height: "100%",
  borderRadius: 0,
  bgcolor: "background.paper",
  color: "text.primary",
  boxShadow: "none",
  border: 1,
  borderColor: "divider",
};

export const toolbarSx = {
  bgcolor: "background.paper",
  color: "text.primary",
  borderTop: 1,
  borderColor: "divider",
  justifyContent: "space-between",
};
