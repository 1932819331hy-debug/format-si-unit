import { expect, test } from "bun:test"
import { parseAndConvertSiUnit } from "../index"

test("inherited object names follow unknown-unit passthrough, not Hz conversion", () => {
  for (const unit of ["constructor", "toString", "valueOf", "__proto__"]) {
    expect(parseAndConvertSiUnit(`2${unit}`)).toEqual({
      parsedUnit: unit,
      unitOfValue: unit,
      value: 2,
    })
  }
})

test("point coordinates do not mistake inherited names for frequency units", () => {
  expect(parseAndConvertSiUnit({ x: "2constructor", y: "3constructor" })).toEqual({
    parsedUnit: "constructor",
    unitOfValue: "constructor",
    value: { x: 2, y: 3 },
  })
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
  expect(parseAndConvertSiUnit("2widget")).toEqual({
    parsedUnit: "widget",
    unitOfValue: "widget",
    value: 2,
  })
})
