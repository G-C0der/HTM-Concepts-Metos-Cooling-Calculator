/**
 * Get hours of day, starting at 06:00 AM ending at 05:00 AM
 */
const getHoursOfDay = () => {
  const hours = [];

  let i = 5;
  do {
    i++;
    if (i === 24) i = 0;

    const prefix = (i.toString().length === 1) ? '0' : '';
    hours.push(`${prefix}${i}:00`);
  } while (i !== 5)

  return hours;
};

export {
  getHoursOfDay
};