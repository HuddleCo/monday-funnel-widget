import cumulate from "./cumulate";

describe("cumulate()", () => {
  test("when the input is empty", () => expect(cumulate([])).toStrictEqual([]));
  test("when the input contains something other than an object", () =>
    expect(cumulate([1])).toStrictEqual([]));
  test("when the input contains an empty object", () =>
    expect(cumulate([{}])).toStrictEqual([]));
  test("when the value is not a number", () =>
    expect(cumulate([{ value: "value" }])).toStrictEqual([]));
  test("when there is a value with zero", () =>
    expect(cumulate([{ value: 0 }])).toStrictEqual([{ value: 0 }]));
  test("when there is 1 object", () =>
    expect(cumulate([{ value: 1 }])).toStrictEqual([{ value: 1 }]));
  test("when there are 2 objects with the same value", () =>
    expect(cumulate([{ value: 1 }, { value: 1 }])).toStrictEqual([
      { value: 2 },
      { value: 1 },
    ]));
  test("when there are 2 objects with ascending values", () =>
    expect(cumulate([{ value: 1 }, { value: 2 }])).toStrictEqual([
      { value: 3 },
      { value: 2 },
    ]));

  test("when there are other attributes in the object", () =>
    expect(
      cumulate([
        { value: 1, id: 1 },
        { value: 2, id: 2 },
      ])
    ).toStrictEqual([
      { value: 3, id: 1 },
      { value: 2, id: 2 },
    ]));
});
