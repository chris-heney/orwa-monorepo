export default (time: string) => {
  const timeparts: number[] = time.split(':').map((part: string): number => parseInt(part))


  const ampm = timeparts[0] >= 12 ? 'PM' : 'AM'
  const hours = timeparts[0] % 12 === 0 ? 12 : timeparts[0] % 12 // Corrected line
  const minutes = timeparts[1] < 10 ? '0' + timeparts[1] : timeparts[1]

  return `${hours}:${minutes} ${ampm}`
}