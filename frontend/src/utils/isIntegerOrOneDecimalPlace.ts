const isIntegerOrOneDecimalPlace = (number: number) => {
  const numberString = number.toString();
  const dotIndex = numberString.indexOf(".");

  if (dotIndex === -1) {
    return true;
  }

  const decimalPart = numberString.slice(dotIndex + 1);

  return decimalPart.length === 1;
};

export default isIntegerOrOneDecimalPlace;
