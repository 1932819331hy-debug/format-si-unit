const SI_PREFIXES = [
  { value: 1e12, symbol: "T" },
  { value: 1e9, symbol: "G" },
  { value: 1e6, symbol: "M" },
  { value: 1e3, symbol: "k" },
  { value: 1, symbol: "" },
  { value: 1e-3, symbol: "m" },
  { value: 1e-6, symbol: "µ" },
  { value: 1e-9, symbol: "n" },
  { value: 1e-12, symbol: "p" },
]

const FALLBACK_PREFIX = SI_PREFIXES[SI_PREFIXES.length - 1]!

export function formatSiUnit(value?: number | null): string {
  if (value == null) return ""
  if (value === 0) return "0"

  const absValue = Math.abs(value)

  let prefixIndex = SI_PREFIXES.findIndex((p) => {
    const scaled = absValue / p.value
    return scaled >= 1 && scaled < 1000
  })
  if (prefixIndex === -1) {
    prefixIndex = SI_PREFIXES.indexOf(FALLBACK_PREFIX)
  }

  let prefix = SI_PREFIXES[prefixIndex]!
  let scaled = value / prefix.value

  // toPrecision(3) can round the magnitude up to 1000 (e.g. 999.5 -> "1.00e+3"),
  // which both loses the "1k" form and emits exponential notation. When that
  // happens, roll over to the next-larger prefix so 999.5 -> "1k", 999999 -> "1M".
  while (prefixIndex > 0 && Math.abs(Number(scaled.toPrecision(3))) >= 1000) {
    prefixIndex -= 1
    prefix = SI_PREFIXES[prefixIndex]!
    scaled = value / prefix.value
  }

  // Trim only the significand: trailing zeros in an exponent affect magnitude.
  let [formatted, exponent] = scaled.toPrecision(3).split("e")

  // Only remove trailing zeros if there's a non-zero digit after the decimal
  if (formatted.includes(".") && !/\.0+$/.test(formatted)) {
    formatted = formatted.replace(/0+$/, "")
  }

  // Remove any pure ".0" or ".00" suffixes
  formatted = formatted.replace(/\.0+$/, "")

  return `${formatted}${exponent === undefined ? "" : `e${exponent}`}${prefix.symbol}`
}

export { formatMm } from "./format-mm"
export { getSiPrefixMultiplier } from "./get-si-prefix-multiplier"
export { parseAndConvertSiUnit } from "./parse-and-convert-si-unit"
export type { BaseTscircuitUnit } from "./parse-and-convert-si-unit"
export { parseSiUnit } from "./parse-si-unit"
