import { expect, test } from "bun:test"
import { parseAndConvertSiUnit } from "../index"

test("inherited object names follow unknown-unit passthrough, not Hz conversion", () => {
  for (const unit of ["constructor", "toString", "valueOf", "__proto__"]) {
    const result = parseAndConvertSiUnit(`2${unit}`)
    expect(result.parsedUnit).toBe(unit)
    expect<string | null>(result.unitOfValue).toBe(unit)
    expect(result.value).toBe(2)
  }
})

test("point coordinates do not mistake inherited names for frequency units", () => {
  const result = parseAndConvertSiUnit({ x: "2constructor", y: "3constructor" })
  expect(result.parsedUnit).toBe("constructor")
  expect<string | null>(result.unitOfValue).toBe("constructor")
  expect(result.value).toEqual({ x: 2, y: 3 })
})

test("declared, prefixed and ordinary unknown units retain their conversions", () => {
  expect(parseAndConvertSiUnit("2kHz")).toEqual({
    parsedUnit: "kHz",
    unitOfValue: "Hz",
    value: 2000,
  })
  expect(parseAndConvertSiUnit("2GHz")).toEqual({
    parsedUnit: "GHz",
    unitOfValue: "Hz",
    value: 2000000000,
  })
  const unknown = parseAndConvertSiUnit("2widget")
  expect(unknown.parsedUnit).toBe("widget")
  expect<string | null>(unknown.unitOfValue).toBe("widget")
  expect(unknown.value).toBe(2)
})
