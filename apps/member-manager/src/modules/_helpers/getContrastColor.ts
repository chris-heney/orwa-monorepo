
type HEX = `#${string}`


const getContrastColor = (backgroundColor: HEX, variance = 0.05): string => {
  const hexToRgb = (hex: string) => ({
    r: parseInt(hex.substring(1, 3), 16),
    g: parseInt(hex.substring(3, 5), 16),
    b: parseInt(hex.substring(5, 7), 16)
  })
  
  const calculateRelativeLuminance = (rgb: { r: number, g: number, b: number }) => {
    const transform = (value: number) => {
      value /= 255
      return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)
    }
    const r = transform(rgb.r)
    const g = transform(rgb.g)
    const b = transform(rgb.b)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  
  const contrastRatio = (foregroundLuminance: number, backgroundLuminance: number) =>
    (Math.max(foregroundLuminance, backgroundLuminance) + variance) /
    (Math.min(foregroundLuminance, backgroundLuminance) + variance)
  
  const getForegroundColor = (backgroundRgb: { r: number, g: number, b: number, }) => {
    const whiteLuminance = calculateRelativeLuminance(hexToRgb('#ffffff'))
    const blackLuminance = calculateRelativeLuminance(hexToRgb('#000000'))
    const backgroundLuminance = calculateRelativeLuminance(backgroundRgb)
  
    const contrastWithWhite = contrastRatio(whiteLuminance, backgroundLuminance)
    const contrastWithBlack = contrastRatio(blackLuminance, backgroundLuminance)
  
    return contrastWithWhite > contrastWithBlack ? '#ffffff' : '#000000'
  }
  
  const backgroundRgb = hexToRgb(backgroundColor)
  return getForegroundColor(backgroundRgb)
}

export default getContrastColor