export const customDatagridStyle = {
  '& .RaDatagrid-rowOdd': {
    backgroundColor: 'action.hover',
  },
  '& .css-19tabqp-RaBulkActionsToolbar-root .RaBulkActionsToolbar-toolbar': {
    justifyContent: 'flex-start',
    alignContent: 'center'
  },
  '& .css-uw9l4c .RaBulkActionsToolbar-toolbar': {
    justifyContent: 'flex-start',
    alignContent: 'center'
  },
  '& .RaDatagrid-thead': {
    whiteSpace: 'nowrap'
  },
  "tr th": {
    py: 1,
    border: "1px solid",
    borderColor: 'divider',
  },
  "tr td": {
    py: .5,
    border: "1px solid",
    borderColor: 'divider',
  }
}

export const positionStickyComponent = {
  maxWidth: '75vw',
  display: 'block',
  position: 'sticky',
  left: 0,
  pl: 4,
}
