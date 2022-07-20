export default (array = []) => {
  if (
    array.length < 1 ||
    array.some((item) => typeof item !== "object") ||
    !array.every((item) => item.hasOwnProperty("value")) ||
    array.some(({ value }) => typeof value !== "number")
  ) {
    return [];
  }
  if (array.length === 1) {
    return array;
  }
  return array.map((item, index) => ({
    ...item,
    value: item.value + array.slice(index + 1).reduce((p, c) => p + c.value, 0),
  }));
};
