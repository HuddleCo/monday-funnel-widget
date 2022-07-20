import addMuliplierToLabels from "./addMultiplierToLabels";

describe("addMuliplierToLabels()", () => {
  test("when the input is empty", () =>
    expect(addMuliplierToLabels([])).toStrictEqual([]));
  test("when the input contains something other than an object", () =>
    expect(addMuliplierToLabels([1])).toStrictEqual([]));
  test("when the input contains an empty object", () =>
    expect(addMuliplierToLabels([{}])).toStrictEqual([]));
  test("when the value is not a number", () =>
    expect(addMuliplierToLabels([{ value: "value" }])).toStrictEqual([]));
  test("when the value is not a number", () =>
    expect(
      addMuliplierToLabels([{ name: "name", value: "value" }])
    ).toStrictEqual([]));
  test("when there is a value with zero", () =>
    expect(addMuliplierToLabels([{ name: "name", value: 0 }])).toStrictEqual([
      { name: "name", value: 0 },
    ]));
  test("when there is 1 object", () =>
    expect(addMuliplierToLabels([{ name: "name", value: 1 }])).toStrictEqual([
      { name: "name", value: 1 },
    ]));
  test("when there are 2 objects with the same value", () =>
    expect(
      addMuliplierToLabels([
        { name: "name", value: 1, id: 1 },
        { name: "name", value: 1, id: 2 },
      ])
    ).toStrictEqual([
      { name: "name", value: 1, id: 1 },
      { name: "name (1 x)", value: 1, id: 2 },
    ]));
  test("when in item is attempting to divide by zero", () =>
    expect(
      addMuliplierToLabels([
        { name: "name", value: 1 },
        { name: "name", value: 0 },
      ])
    ).toStrictEqual([
      { name: "name", value: 1 },
      { name: "name (0 x)", value: 0 },
    ]));
  test("when the ratio is a fraction with recurring digits after the decimal place", () =>
    expect(
      addMuliplierToLabels([
        { name: "name", value: 3 },
        { name: "name", value: 1 },
      ])
    ).toStrictEqual([
      { name: "name", value: 3 },
      { name: "name (0.33 x)", value: 1 },
    ]));
  test("when the ratio is a fraction with a single digit after the decimal", () =>
    expect(
      addMuliplierToLabels([
        { name: "name", value: 2 },
        { name: "name", value: 3 },
      ])
    ).toStrictEqual([
      { name: "name", value: 2 },
      { name: "name (1.50 x)", value: 3 },
    ]));
});
