export const getRandomInt = max => Math.floor(Math.random() * max);

const formatDate = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
};

export const getTodaysDate = (shouldFormat = true) => {
  const today = new Date();

  return shouldFormat ? formatDate(today) : today.toString();
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

export const pluralize = (count, noun, suffix = 's') =>
  `${count} ${noun}${count !== 1 ? suffix : ''}`;

export const handleOnChangeState = (setState, key, value) =>
  setState(oldState => ({
    ...oldState,
    [key]: value,
  }));
