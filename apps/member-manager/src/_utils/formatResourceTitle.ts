export const formatResourceTitle = (resource: string) => {
    let formatted = resource
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalizes the first letter of each word
  
    if (formatted.endsWith("s") && !formatted.endsWith("ses")) {
      formatted = formatted.slice(0, -1);
    }
    
  
    return formatted;
  };
  