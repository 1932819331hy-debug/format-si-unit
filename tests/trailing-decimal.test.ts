import { expect, test } from "bun:test"
import { parseAndConvertSiUnit } from "../index"

test.each([
  ["1.cm", 10],
  ["-2.cm", -20],
  ["+3.cm", 30],
  ["0.cm", 0],
])(
  "converts a trailing-decimal mantissa before a length unit: %s",
  (input, value) => {
    expect(parseAndConvertSiUnit(input)).toEqual({
      parsedUnit: "cm",
      unitOfValue: "mm",
      value,
    })
  },
)

test("recognizes bare SI prefixes after a trailing-decimal mantissa", () => {
  expect(parseAndConvertSiUnit("2.k")).toEqual({
    parsedUnit: null,
    unitOfValue: null,
    value: 2000,
  })
  expect(parseAndConvertSiUnit("2.k", "Ω")).toEqual({
    parsedUnit: null,
    unitOfValue: "Ω",
    value: 2000,
  })
})

test("converts trailing-decimal point coordinates independently", () => {
  expect(parseAndConvertSiUnit({ x: "1.cm", y: "-2.mm" })).toEqual({
    parsedUnit: "cm",
    unitOfValue: "mm",
    value: { x: 10, y: -2 },
  })
})

test("preserves fractional, exponential, and unitless decimal values", () => {
  expect(parseAndConvertSiUnit("1.5cm").value).toBe(15)
  expect(parseAndConvertSiUnit(".5cm").value).toBe(5)
  expect(parseAndConvertSiUnit("1.e2cm").value).toBe(1000)
  expect(parseAndConvertSiUnit("1.")).toEqual({
    parsedUnit: null,
    unitOfValue: null,
    value: 1,
  })
})

test("preserves periods within unknown unit names", () => {
  const result = parseAndConvertSiUnit("2widget.unit")
  expect(result.parsedUnit).toBe("widget.unit")
  expect<string | null>(result.unitOfValue).toBe("widget.unit")
  expect(result.value).toBe(2)
})

test.each([
  ["1.5.cm", ".cm", 1.5],
  ["1e2.cm", ".cm", 100],
  ["1 .cm", ".cm", 1],
  ["1..cm", "..cm", 1],
  ["1.cm2.cm", ".cm", 1],
  ["1\t.cm", ".cm", 1],
  ["1 .k", ".k", 1],
])(
  "preserves the unknown-unit fallback for non-mantissa dots: %s",
  (input, unit, value) => {
    const result = parseAndConvertSiUnit(input)
    expect(result.parsedUnit).toBe(unit)
    expect<string | null>(result.unitOfValue).toBe(unit)
    expect(result.value).toBe(value)
  },
)

test("allows outer whitespace without allowing a gap before the decimal point", () => {
  expect(parseAndConvertSiUnit("\t-2.cm\n")).toEqual({
    parsedUnit: "cm",
    unitOfValue: "mm",
    value: -20,
  })
})
