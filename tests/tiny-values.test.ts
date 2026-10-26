import { expect, test } from "bun:test"
import { formatSiUnit, parseSiUnit } from "../index"

test.each([
  [1.23e-22, "1.23e-10p"],
  [-1.23e-22, "-1.23e-10p"],
  [1.2e-32, "1.2e-20p"],
  [1e-22, "1e-10p"],
  [1.23e-112, "1.23e-100p"],
  [1.23e-21, "1.23e-9p"],
  [1.2e-18, "0.0000012p"],
  [1e-12, "1p"],
])("formatSiUnit preserves the magnitude of %s", (value, expected) => {
  const formatted = formatSiUnit(value)
  expect(formatted).toBe(expected)
  expect(parseSiUnit(formatted)! / value).toBeCloseTo(1, 12)
})
