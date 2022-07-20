import { sprintf } from "sprintf-js";

const safeDivide = (numerator, denominator) =>
  denominator <= 0 ? 0 : numerator / denominator;

const nnnn = (number = 0) => {
  if (Number.isInteger(number)) {
    return number.toString();
  } else {
    return sprintf("%.2f", number);
  }
};

export default (array = []) => {
  if (
    array.length < 1 ||
    array.some((item) => typeof item !== "object") ||
    !array.every((item) => item.hasOwnProperty("name")) ||
    !array.every((item) => item.hasOwnProperty("value")) ||
    array.some(({ value }) => typeof value !== "number")
  ) {
    return [];
  }
  if (array.length === 1) {
    return array;
  }

  return [array[0]].concat(
    array.slice(1).map((item, index) => ({
      ...item,
      name: `${item.name} (${nnnn(
        safeDivide(item.value, array[index].value)
      )} x)`,
    }))
  );
};
