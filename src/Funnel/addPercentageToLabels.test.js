import addPercentageToLabels from "./addPercentageToLabels";

describe("addPercentageToLabels()", () => {
  test("when the input is empty", () =>
    expect(addPercentageToLabels([])).toStrictEqual([]));
  test("when the input contains something other than an object", () =>
    expect(addPercentageToLabels([1])).toStrictEqual([]));
  test("when the input contains an empty object", () =>
    expect(addPercentageToLabels([{}])).toStrictEqual([]));
  test("when the value is not a number", () =>
    expect(addPercentageToLabels([{ value: "value" }])).toStrictEqual([]));
  test("when the value is not a number", () =>
    expect(
      addPercentageToLabels([{ name: "name", value: "value" }])
    ).toStrictEqual([]));
  test("when there is a value with zero", () =>
    expect(addPercentageToLabels([{ name: "name", value: 0 }])).toStrictEqual([
      { name: "name", value: 0 },
    ]));
  test("when there is 1 object", () =>
    expect(addPercentageToLabels([{ name: "name", value: 1 }])).toStrictEqual([
      { name: "name", value: 1 },
    ]));
  test("when there are 2 objects with the same value", () =>
    expect(
      addPercentageToLabels([
        { name: "name", value: 1, id: 1 },
        { name: "name", value: 1, id: 2 },
      ])
    ).toStrictEqual([
      { name: "name", value: 1, id: 1 },
      { name: "name (100%)", value: 1, id: 2 },
    ]));
  test("when in item is ??", () =>
    expect(
      addPercentageToLabels([
        { name: "name", value: 1 },
        { name: "name", value: 0 },
      ])
    ).toStrictEqual([
      { name: "name", value: 1 },
      { name: "name (0%)", value: 0 },
    ]));
});
