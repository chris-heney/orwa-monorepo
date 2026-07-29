// Print styles for schedule component
export const printStyles = `
  @media print {
    @page {
      size: auto;
      margin: 5mm;
    }
    body {
      font-size: 8pt !important;
      line-height: 1.2 !important;
    }
    table {
      border-collapse: collapse !important;
    }
    th, td {
      padding: 6px 8px !important;
      font-size: 11px !important;
      vertical-align: middle !important;
      border: 1px solid #ddd !important;
    }
    th {
      background-color: #262626 !important;
      color: white !important;
      font-weight: 700 !important;
      border: 1px solid #262626 !important;
    }
    tr {
      page-break-inside: avoid !important;
      height: 30px !important;
    }
    tr:nth-child(even) {
      background-color: white !important;
    }
    tr:nth-child(odd) {
      background-color: #F3F2F2 !important;
    }
    /* Override alternating row colors for merged cells */
    tr[class^="time-slot-"] {
      background-color: inherit !important;
    }
    /* Ensure entire time slot groups have consistent coloring */
    tr[data-row-index="0"],
    tr[data-row-index="2"],
    tr[data-row-index="4"],
    tr[data-row-index="6"],
    tr[data-row-index="8"],
    tr[data-row-index="10"],
    tr[data-row-index="12"],
    tr[data-row-index="14"],
    tr[data-row-index="16"],
    tr[data-row-index="18"] {
      background-color: white !important;
    }
    tr[data-row-index="0"] td,
    tr[data-row-index="2"] td,
    tr[data-row-index="4"] td,
    tr[data-row-index="6"] td,
    tr[data-row-index="8"] td,
    tr[data-row-index="10"] td,
    tr[data-row-index="12"] td,
    tr[data-row-index="14"] td,
    tr[data-row-index="16"] td,
    tr[data-row-index="18"] td {
      background-color: white !important;
    }
    tr[data-row-index="1"],
    tr[data-row-index="3"],
    tr[data-row-index="5"],
    tr[data-row-index="7"],
    tr[data-row-index="9"],
    tr[data-row-index="11"],
    tr[data-row-index="13"],
    tr[data-row-index="15"],
    tr[data-row-index="17"],
    tr[data-row-index="19"] {
      background-color: #F3F2F2 !important;
    }
    tr[data-row-index="1"] td,
    tr[data-row-index="3"] td,
    tr[data-row-index="5"] td,
    tr[data-row-index="7"] td,
    tr[data-row-index="9"] td,
    tr[data-row-index="11"] td,
    tr[data-row-index="13"] td,
    tr[data-row-index="15"] td,
    tr[data-row-index="17"] td,
    tr[data-row-index="19"] td {
      background-color: #F3F2F2 !important;
    }
    h6, .MuiTypography-subtitle1 {
      margin: 15px 0 10px !important;
      font-size: 14px !important;
      font-weight: bold !important;
      text-align: center !important;
    }
    .MuiBox-root {
      margin-bottom: 15px !important;
    }
    .MuiTypography-root {
      font-size: 11px !important;
      line-height: 1.2 !important;
    }
    .MuiDivider-root {
      margin: 1px 0 !important;
    }
    .MuiChip-root {
      height: auto !important;
      font-size: 10px !important;
      background-color: #007AFF !important;
      color: white !important;
      border-radius: 12px !important;
      padding: 2px 0 !important;
      margin-top: 4px !important;
    }
    .MuiChip-label {
      padding: 0 6px !important;
      font-weight: bold !important;
    }
  }
`;

// Common table header style
export const headerStyle = {
  "& th": {
    backgroundColor: "#262626",
    color: "white",
    fontWeight: 700,
    border: "1px solid #262626",
    padding: "6px 8px",
    fontSize: "11px",
    height: "24px",
    verticalAlign: "middle"
  },
};

// Common table cell style
export const cellStyle = {
  padding: "6px 8px",
  verticalAlign: "middle",
  border: "1px solid #ddd",
  fontSize: "11px",
  lineHeight: 1.2
};

// Get column widths based on visible columns
export const getColumnWidths = (
  showDescription: boolean,
  showSpeaker: boolean,
  showCompany: boolean
) => {
  // Calculate how many content columns are visible
  const visibleColumns =
    (showDescription ? 1 : 0) + (showSpeaker ? 1 : 0) + (showCompany ? 1 : 0);

  // Base widths that will be adjusted based on visible columns
  const baseWidths = {
    time: "15%",
    location: "15%",
    event: "25%",
    description: showDescription 
      ? (visibleColumns === 1 ? "40%" : visibleColumns === 2 ? "25%" : "15%") 
      : undefined,
    speaker: showSpeaker 
      ? (visibleColumns === 1 ? "40%" : visibleColumns === 2 ? "25%" : "15%") 
      : undefined,
    company: showCompany 
      ? (visibleColumns === 1 ? "40%" : visibleColumns === 2 ? "25%" : "15%") 
      : undefined
  };

  // If no content columns are visible, expand event column
  if (visibleColumns === 0) {
    baseWidths.event = "65%";
  }

  return baseWidths;
}; 