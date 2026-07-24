type HEX = `#${string}`

const normalizeHex = (color: string): HEX | null => {
  if (!color) return null
  const trimmed = color.trim()
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
  if (/^#[0-9a-fA-F]{6}$/.test(withHash)) return withHash as HEX
  if (/^#[0-9a-fA-F]{3}$/.test(withHash)) {
    const [, r, g, b] = withHash
    return `#${r}${r}${g}${g}${b}${b}` as HEX
  }
  return null
}

const getContrastColor = (
  backgroundColor: string | null | undefined,
  variance = 0.05
): string => {
  const hex = normalizeHex(backgroundColor ?? '')
  // Fall back to dark ink — neon status fills are usually light
  if (!hex) return '#000000'

  const hexToRgb = (value: string) => ({
    r: parseInt(value.substring(1, 3), 16),
    g: parseInt(value.substring(3, 5), 16),
    b: parseInt(value.substring(5, 7), 16),
  })

  const calculateRelativeLuminance = (rgb: { r: number; g: number; b: number }) => {
    const transform = (value: number) => {
      value /= 255
      return value <= 0.03928
        ? value / 12.92
        : Math.pow((value + 0.055) / 1.055, 2.4)
    }
    const r = transform(rgb.r)
    const g = transform(rgb.g)
    const b = transform(rgb.b)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const contrastRatio = (
    foregroundLuminance: number,
    backgroundLuminance: number
  ) =>
    (Math.max(foregroundLuminance, backgroundLuminance) + variance) /
    (Math.min(foregroundLuminance, backgroundLuminance) + variance)

  const backgroundRgb = hexToRgb(hex)
  const whiteLuminance = calculateRelativeLuminance(hexToRgb('#ffffff'))
  const blackLuminance = calculateRelativeLuminance(hexToRgb('#000000'))
  const backgroundLuminance = calculateRelativeLuminance(backgroundRgb)

  const contrastWithWhite = contrastRatio(whiteLuminance, backgroundLuminance)
  const contrastWithBlack = contrastRatio(blackLuminance, backgroundLuminance)

  return contrastWithWhite > contrastWithBlack ? '#ffffff' : '#000000'
}

export default getContrastColor