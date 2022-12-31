export const getRandomInt = max => Math.floor(Math.random() * max);

const formatDate = dateTime => {
  const [date] = dateTime.split('T');

  return date.split('-').join('');
};

export const getTodaysDate = (shouldFormat = true) => {
  const today = new Date().toISOString();

  return shouldFormat ? formatDate(today) : today;
};

export const getTodaysDisplayDate = () => new Date().toLocaleString('en').split(',')[0];

export const getTimeDiff = (startDate, endDate, timeFormat = 'minutes') => {
  const dateTimeEnd = new Date(endDate);
  const dateTimeStart = new Date(startDate);
  const timeDiff = Math.abs(dateTimeEnd.getTime() - dateTimeStart.getTime());
  switch (timeFormat) {
    case 'seconds':
      return Math.round(timeDiff / 1000);
    case 'milliseconds':
      return timeDiff;
    case 'minutes':
    default:
      return Math.round(timeDiff / 1000 / 60);
  }
};
