import { sprintf } from "sprintf-js";

const safeDivide = (numerator, denominator) =>
  denominator <= 0 ? 0 : numerator / denominator;

export const calculatePercentage = (item, index, array) =>
  index === 0
    ? item.value
    : `${Math.round(safeDivide(item.value, array[index - 1].value) * 100)}%`;

export const calculateRatio = (item, index, array) => {
  if (index === 0) {
    return item.value;
  }
  const number = safeDivide(item.value, array[index - 1].value);
  return Number.isInteger(number)
    ? `${number.toString()} x`
    : sprintf("%.2f x", number);
};
