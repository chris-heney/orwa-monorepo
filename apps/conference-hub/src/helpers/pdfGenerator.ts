import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import dayjs from 'dayjs';
import { ScheduleItem } from '../types/IScheduleItem';

// Function to check if any records have speaker, company, or description content
export const checkForContentColumns = (dateRecords: ScheduleItem[]) => {
  const hasSpeakerContent = dateRecords.some(
    (record) => record.speaker && record.speaker.trim() !== ""
  );
  const hasCompanyContent = dateRecords.some(
    (record) => record.company && record.company.trim() !== ""
  );
  const hasDescriptionContent = dateRecords.some(
    (record) => record.description && record.description.trim() !== ""
  );
  return { hasSpeakerContent, hasCompanyContent, hasDescriptionContent };
};

// Group records by date for rendering
export const groupRecordsByDate = (records: ScheduleItem[]) => {
  const grouped: Record<string, ScheduleItem[]> = {};
  
  // Filter out duplicates first
  const uniqueRecords = removeDuplicateRecords(records);
  
  uniqueRecords
    .sort((a: ScheduleItem, b: ScheduleItem) => {
      const dateA = new Date(`${a.date}T${a.start}`);
      const dateB = new Date(`${b.date}T${b.start}`);
      return dateA.getTime() - dateB.getTime();
    })
    .forEach((record) => {
      if (!grouped[record.date]) {
        grouped[record.date] = [];
      }
      grouped[record.date].push(record);
    });
  return grouped;
};

// Helper function to remove duplicate records
const removeDuplicateRecords = (records: ScheduleItem[]): ScheduleItem[] => {
  const uniqueMap = new Map<string, ScheduleItem>();
  
  records.forEach(record => {
    // Create a unique key based on date, time, event
    const key = `${record.date}-${record.start}-${record.end}-${record.event}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, record);
    }
  });
  
  return Array.from(uniqueMap.values());
};

// Get column widths based on visible columns - matches the schedule.tsx logic
const getColumnWidths = (
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
      : "0%",
    speaker: showSpeaker 
      ? (visibleColumns === 1 ? "40%" : visibleColumns === 2 ? "25%" : "15%") 
      : "0%",
    company: showCompany 
      ? (visibleColumns === 1 ? "40%" : visibleColumns === 2 ? "25%" : "15%") 
      : "0%"
  };

  // If no content columns are visible, expand event column
  if (visibleColumns === 0) {
    baseWidths.event = "65%";
  }

  return baseWidths;
};

// HTML-based PDF generation
export const generateSchedulePDF = async (schedule: ScheduleItem[], conferenceName: string) => {
  if (!schedule || schedule.length === 0) {
    console.error("No schedule data provided for PDF generation");
    return;
  }

  // Create a temporary container for the HTML
  const pdfContainer = document.createElement('div');
  pdfContainer.style.position = 'absolute';
  pdfContainer.style.top = '-9999px';
  pdfContainer.style.width = '1000px'; // Increased width for better resolution
  pdfContainer.className = 'pdf-container';
  document.body.appendChild(pdfContainer);

  // Define CSS styles for the PDF - improved styling to match screenshot
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .pdf-container {
      font-family: Arial, sans-serif;
      color: #000;
      background: white;
      padding: 20px;
    }
    .pdf-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      width: 100%;
      position: relative;
    }
    .pdf-logo {
      height: 50px;
      width: auto;
      position: absolute;
      left: 0;
    }
    .pdf-title {
      font-size: 16px;
      text-align: center;
      font-weight: bold;
      width: 100%;
    }
    .date-header {
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      margin: 15px 0 10px;
      padding: 5px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
      table-layout: fixed;
    }
    th {
      background-color: #262626;
      color: white;
      text-align: left;
      padding: 6px 8px;
      font-size: 11px;
      font-weight: 700;
      border: 1px solid #262626;
      height: 24px;
      vertical-align: middle;
    }
    td {
      padding: 6px 8px;
      border: 1px solid #ddd;
      font-size: 11px;
      line-height: 1.2;
      vertical-align: middle;
      height: 24px;
    }
    tr {
      height: 30px;
    }
    tr:nth-child(even) {
      background-color: white;
    }
    tr:nth-child(odd) {
      background-color: #F3F2F2;
    }
    .training-badge {
      display: inline-block;
      background-color: #007AFF;
      color: white;
      border-radius: 12px;
      padding: 6px 6px;
      font-size: 10px;
      margin-top: 4px;
      max-width: 120px;
      font-weight: bold;
    }
    .time-container {
      display: flex;
      flex-direction: column;
    }
    .time-cell {
      vertical-align: middle;
      position: relative;
    }
    .time-display {
      display: block;
      margin-bottom: 4px;
    }
    .multi-row {
      background-color: inherit;
    }
  `;
  pdfContainer.appendChild(styleElement);

  // Create header container
  const headerContainer = document.createElement('div');
  headerContainer.className = 'pdf-header';

  // Add logo
  const logoElement = document.createElement('img');
  logoElement.src = './orwa-black.png';
  logoElement.className = 'pdf-logo';
  headerContainer.appendChild(logoElement);

  // Add title
  const titleElement = document.createElement('div');
  titleElement.className = 'pdf-title';
  const currentYear = new Date().getFullYear();
  titleElement.textContent = `ORWA ${conferenceName || 'Annual Conference'} ${currentYear}`;
  headerContainer.appendChild(titleElement);

  pdfContainer.appendChild(headerContainer);

  // Group records by date
  const groupedRecords = groupRecordsByDate(schedule);

  // Process each day
  for (const date of Object.keys(groupedRecords)) {
    // Add date header
    const dateHeader = document.createElement('div');
    dateHeader.className = 'date-header';
    dateHeader.textContent = dayjs(date).format('dddd, MMMM D');
    pdfContainer.appendChild(dateHeader);

    // Check content columns
    const { hasSpeakerContent, hasCompanyContent, hasDescriptionContent } = 
      checkForContentColumns(groupedRecords[date]);

    // Get column widths based on content
    const columnWidths = getColumnWidths(
      hasDescriptionContent, 
      hasSpeakerContent, 
      hasCompanyContent
    );

    // Create table
    const table = document.createElement('table');
    
    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Add header cells with correct widths
    const headers = [
      { name: 'Time', className: 'time-cell', width: columnWidths.time },
      { name: 'Location', className: 'location-cell', width: columnWidths.location },
      { name: 'Event', className: 'event-cell', width: columnWidths.event }
    ];
    
    if (hasDescriptionContent) {
      headers.push({ name: 'Description', className: 'description-cell', width: columnWidths.description });
    }
    if (hasSpeakerContent) {
      headers.push({ name: 'Speaker', className: 'speaker-cell', width: columnWidths.speaker });
    }
    if (hasCompanyContent) {
      headers.push({ name: 'Company', className: 'company-cell', width: columnWidths.company });
    }
    
    headers.forEach(header => {
      const th = document.createElement('th');
      th.className = header.className;
      th.textContent = header.name;
      th.style.width = header.width;
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    // Process each record in this date
    groupedRecords[date].forEach((record, index) => {
      // Handle multi-line entries by splitting content
      const splitContent = (content: string) => {
        return content ? content.split('\n').filter(item => item.trim() !== '') : [];
      };
      
      const speakers = splitContent(record.speaker);
      const companies = splitContent(record.company);
      const events = splitContent(record.event);
      const locations = splitContent(record.location);
      const descriptions = splitContent(record.description);
      
      // Format times
      const formatTime = (timeString: string) => {
        if (!timeString || timeString.trim() === '') return 'N/A';
        try {
          const date = new Date(`${record.date}T${timeString}`);
          if (isNaN(date.getTime())) return 'N/A';
          return date.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit'
          });
        } catch (e) {
          return 'N/A';
        }
      };
      
      const startTime = formatTime(record.start);
      const endTime = formatTime(record.end);
      const timeDisplay = `${startTime} - ${endTime}`;
      
      // Determine if we need multi-line entries
      const hasMultipleEntries =
        speakers.length > 1 ||
        companies.length > 1 ||
        events.length > 1 ||
        locations.length > 1 ||
        descriptions.length > 1;
      
      // Calculate maximum entries for rowspan
      const maxEntries = Math.max(
        locations.length || 1,
        events.length || 1,
        (hasDescriptionContent && descriptions.length > 0) ? descriptions.length : 1,
        (hasSpeakerContent && speakers.length > 0) ? speakers.length : 1,
        (hasCompanyContent && companies.length > 0) ? companies.length : 1
      );
      
      // Determine row background color
      const isOdd = index % 2 === 1;
      const rowColor = isOdd ? '#F3F2F2' : 'white';
      
      // Generate a unique class name for this time slot
      const timeSlotClass = `time-slot-${record.id || index}`;
      
      // If multiple entries, use rowspan for the time cell
      if (hasMultipleEntries && maxEntries > 1) {
        // Create first row with time cell and rowspan
        const firstRow = document.createElement('tr');
        firstRow.className = timeSlotClass;
        firstRow.style.backgroundColor = rowColor;
        firstRow.setAttribute('data-row-index', index.toString());
        
        // Time cell with rowspan
        const timeCell = document.createElement('td');
        timeCell.className = 'time-cell';
        timeCell.rowSpan = maxEntries;
        timeCell.style.verticalAlign = 'middle';
        timeCell.style.padding = '6px 8px';
        
        // Create time container
        const timeContainer = document.createElement('div');
        timeContainer.className = 'time-container';
        
        // Add time display
        const timeText = document.createElement('span');
        timeText.className = 'time-display';
        timeText.textContent = timeDisplay;
        timeContainer.appendChild(timeText);
        
        // Add training badge if needed
        if (record.training_hours) {
          const badge = document.createElement('div');
          badge.className = 'training-badge';
          badge.textContent = `Training Hours: ${record.training_hours}`;
          timeContainer.appendChild(badge);
        }
        
        timeCell.appendChild(timeContainer);
        firstRow.appendChild(timeCell);
        
        // Add other cells for the first row
        const addCellToRow = (row: HTMLTableRowElement, content: string, className: string) => {
          const cell = document.createElement('td');
          cell.className = className;
          cell.textContent = content || '';
          row.appendChild(cell);
          return cell;
        };
        
        addCellToRow(firstRow, locations[0] || '', 'location-cell');
        addCellToRow(firstRow, events[0] || '', 'event-cell');
        
        if (hasDescriptionContent) {
          addCellToRow(firstRow, descriptions[0] || '', 'description-cell');
        }
        
        if (hasSpeakerContent) {
          addCellToRow(firstRow, speakers[0] || '', 'speaker-cell');
        }
        
        if (hasCompanyContent) {
          addCellToRow(firstRow, companies[0] || '', 'company-cell');
        }
        
        tbody.appendChild(firstRow);
        
        // Add subsequent rows (without time cell)
        for (let i = 1; i < maxEntries; i++) {
          const row = document.createElement('tr');
          row.className = `${timeSlotClass} multi-row`;
          row.style.backgroundColor = rowColor;
          row.setAttribute('data-row-index', index.toString());
          
          addCellToRow(row, i < locations.length ? locations[i] : '', 'location-cell');
          addCellToRow(row, i < events.length ? events[i] : '', 'event-cell');
          
          if (hasDescriptionContent) {
            addCellToRow(row, i < descriptions.length ? descriptions[i] : '', 'description-cell');
          }
          
          if (hasSpeakerContent) {
            addCellToRow(row, i < speakers.length ? speakers[i] : '', 'speaker-cell');
          }
          
          if (hasCompanyContent) {
            addCellToRow(row, i < companies.length ? companies[i] : '', 'company-cell');
          }
          
          tbody.appendChild(row);
        }
      } else {
        // Regular single row
        const row = document.createElement('tr');
        row.className = timeSlotClass;
        row.style.backgroundColor = rowColor;
        row.setAttribute('data-row-index', index.toString());
        
        // Time cell
        const timeCell = document.createElement('td');
        timeCell.className = 'time-cell';
        timeCell.style.verticalAlign = 'middle';
        timeCell.style.padding = '6px 8px';
        
        // Create a container for time content
        const timeContainer = document.createElement('div');
        timeContainer.className = 'time-container';
        
        // Add time display
        const timeText = document.createElement('span');
        timeText.className = 'time-display';
        timeText.textContent = timeDisplay;
        timeContainer.appendChild(timeText);
        
        // Add training badge if needed
        if (record.training_hours) {
          const badge = document.createElement('div');
          badge.className = 'training-badge';
          badge.textContent = `Training Hours: ${record.training_hours}`;
          timeContainer.appendChild(badge);
        }
        
        timeCell.appendChild(timeContainer);
        row.appendChild(timeCell);
        
        // Add other cells
        const addCellToRow = (content: string, className: string) => {
          const cell = document.createElement('td');
          cell.className = className;
          cell.textContent = content || '';
          row.appendChild(cell);
        };
        
        addCellToRow(record.location || '', 'location-cell');
        addCellToRow(record.event || '', 'event-cell');
        
        if (hasDescriptionContent) {
          addCellToRow(record.description || '', 'description-cell');
        }
        
        if (hasSpeakerContent) {
          addCellToRow(record.speaker || '', 'speaker-cell');
        }
        
        if (hasCompanyContent) {
          addCellToRow(record.company || '', 'company-cell');
        }
        
        tbody.appendChild(row);
      }
    });
    
    table.appendChild(tbody);
    pdfContainer.appendChild(table);
  }

  try {
    // Generate PDF
    const pdf = new jsPDF('p', 'pt', 'letter');
    
    // Render HTML to PDF with higher resolution
    const canvas = await html2canvas(pdfContainer, {
      scale: 2, // Higher scale for better resolution
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    // Get image dimensions
    const imgData = canvas.toDataURL('image/png', 1.0); // Higher quality
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate image height based on width
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth - 20; // Slight margin
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    
    // Handle multi-page content properly
    if (imgHeight > pdfHeight) {
      // Calculate number of pages needed
      const pageCount = Math.ceil(imgHeight / pdfHeight);
      
      // Add each page with appropriate clipping
      for (let i = 0; i < pageCount; i++) {
        // For pages after the first, add a new page
        if (i > 0) {
          pdf.addPage();
        }
        
        // Calculate positioning to properly show the right portion
        const position = -i * pdfHeight;
        
        // Add the image with positioning to show the correct portion
        pdf.addImage(
          imgData,
          'PNG',
          10, // x position with margin
          position + 10, // y position, adjusted to show correct part
          imgWidth,
          imgHeight
        );
      }
    } else {
      // Image fits on a single page
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    }
    
    // Save PDF with cleaned filename
    const safeConferenceName = (conferenceName || 'Annual-Conference').replace(/[^a-z0-9]/gi, '-');
    pdf.save(`${safeConferenceName}-Schedule-${new Date().getFullYear()}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    // Clean up
    document.body.removeChild(pdfContainer);
  }
};