// Objective : Format the date into 7/31/2024 format
// A lot of our dates in strapi are stored in format 2024-07-31
// When we display them in the frontend since there is no timezone aaociated with the date
// when formatted it shows the date as 7/30/2024
// This function will take the date and convert it to the correct format
export const formatDate = (date: string, format?: Intl.DateTimeFormatOptions) => {
  // convert to date object T00:00:00 to handle timezone
  const UtcDate = new Date(date + "T00:00:00");
  const formattedDate = UtcDate?.toLocaleString("en-US", format ? format : {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });

  return formattedDate;
};
