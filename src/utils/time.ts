const getHoursOfDay = () => {
  const hours = [];

  for (let i = 0; i <= 23; i++) {
    const prefix = (i.toString().length === 1) ? '0' : '';
    hours.push(`${prefix}${i}:00`);
  }

  return hours;
};

export {
  getHoursOfDay
};