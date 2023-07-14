/**
 * Get hours of day, starting at 06:00 AM ending at 05:00 AM
 */
const getHoursOfDay = (startingHour: number = 0) => {
  if (startingHour < 0 || startingHour > 23) throw new Error('Starting hour must be between 0 and 23.');

  const hours = [];

  startingHour--;
  if (startingHour < 0) startingHour = 23;

  let i = startingHour;
  do {
    i++;
    if (i === 24) i = 0;

    const prefix = (i.toString().length === 1) ? '0' : '';
    hours.push(`${prefix}${i}:00`);
  } while (i !== startingHour)

  return hours;
};

const hasDatePassed = (timestamp: string | null) => {
  const expiry = JSON.parse(timestamp || '0');
  return Date.now() >= expiry;
};

export {
  getHoursOfDay,
  hasDatePassed
};