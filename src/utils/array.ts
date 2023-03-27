const sortArrayOfObjectsByProperty = (array: object[], property: string) => {
  array.sort((a: any, b: any) => a[property].toString().localeCompare(b[property].toString()));
};

export {
  sortArrayOfObjectsByProperty
};