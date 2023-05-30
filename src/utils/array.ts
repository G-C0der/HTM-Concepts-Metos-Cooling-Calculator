const sortArrayOfObjectsByProperty = (array: object[], property: string) => {
  array.sort((a: any, b: any) => {
    if (typeof a[property] === 'number' && typeof b[property] === 'number') return a[property] - b[property];
    else return a[property].toString().localeCompare(b[property].toString());
  });
};

export {
  sortArrayOfObjectsByProperty
};