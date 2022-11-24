export const getRandomInt = max => Math.floor(Math.random() * max);

const formatDate = dateTime => {
  const [date] = dateTime.split('T');

  return date.split('-').join('');
};

export const getTodaysDate = (shouldFormat = true) => {
  const today = new Date().toISOString();

  return shouldFormat ? formatDate(today) : today;
};
