export default (timeString: string): string => {
  // Split the time string into hours, minutes, and AM/PM
  const [hours, minutes, ampm] = timeString.split(':')

  // Convert hours from 12-hour format to 24-hour format
  const hoursIn24 = ampm === 'PM' ? parseInt(hours) + 12 : parseInt(hours)

  // Create a new Date object for the current date and set the time
  const now = new Date()
  now.setHours(hoursIn24, parseInt(minutes), 0, 0) // Set hours, minutes, seconds, and milliseconds

  // Return the date in ISO string format
  return now.toISOString()
}