import dayjs from 'dayjs'

const getExpiryBackground = (expirationDate: string | dayjs.Dayjs): string => {
  
  const daysTillExpiration: number = typeof expirationDate !== 'string'
    ? expirationDate.diff(dayjs(), 'days')
    : dayjs(expirationDate).diff(dayjs(), 'days')

  const backgroundColor = daysTillExpiration <= 0
    // Red:
    ? '#ff5555'
    : daysTillExpiration < 30
      // Lighter Red (Almost Pink):
      ? '#ffb3b3'
      : daysTillExpiration < 60
        // Light Yellow:
        ? '#ffffcc'
        // Light Green:
        : '#90ee90'

  return backgroundColor
}


export default getExpiryBackground
