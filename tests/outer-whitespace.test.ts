import { describe, expect, test } from "bun:test"
import { parseAndConvertSiUnit } from "../index"

describe("parseAndConvertSiUnit outer whitespace", () => {
  test.each([
    [" 10 ", 10],
    ["\t-4.7\n", -4.7],
    ["\r\n0\t", 0],
  ])("parses unitless values: %j", (input, value) => {
    expect(parseAndConvertSiUnit(input)).toEqual({
      parsedUnit: null,
      unitOfValue: null,
      value,
    })
  })

  test("keeps unitless values unitless when a default unit is supplied", () => {
    expect(parseAndConvertSiUnit(" 10 ", "mm")).toEqual({
      parsedUnit: null,
      unitOfValue: null,
      value: 10,
    })
  })

  test("converts units and bare prefixes", () => {
    expect(parseAndConvertSiUnit("\t2.54cm\n")).toEqual({
      parsedUnit: "cm",
      unitOfValue: "mm",
      value: 25.4,
    })
    expect(parseAndConvertSiUnit(" 10k ", "Ω")).toEqual({
      parsedUnit: null,
      unitOfValue: "Ω",
      value: 10_000,
    })
  })

  test("parses point coordinates independently", () => {
    expect(parseAndConvertSiUnit({ x: " 10 ", y: "20" })).toEqual({
      parsedUnit: null,
      unitOfValue: null,
      value: { x: 10, y: 20 },
    })
  })

  test.each(["", " ", "\t\n"])("still rejects empty input: %j", (input) => {
    expect(() => parseAndConvertSiUnit(input)).toThrow()
  })
})
