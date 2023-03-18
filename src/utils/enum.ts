const getEnumMinMax = (e: object) => {
  const values = Object.keys(e).map(k => k === '' ? NaN : +k).filter(k => !isNaN(k)).sort((k1, k2) => k1 - k2);
  return [values[0], values[values.length - 1]];
};

const getEnumNumericValues = (e: object) => {
  return Object.keys(e).filter(key => !isNaN(+key)) as Array<keyof typeof e>;
};

export {
  getEnumMinMax,
  getEnumNumericValues
};