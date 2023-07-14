export const getCurrentStreakIcon = currentStreak => {
  let icon = '';
  if (currentStreak < 1) icon = '💔';
  else if (currentStreak < 10) icon = '🤍';
  else if (currentStreak < 20) icon = '💛';
  else if (currentStreak < 30) icon = '🧡';
  else if (currentStreak < 40) icon = '💚';
  else if (currentStreak < 50) icon = '💙';
  else if (currentStreak < 60) icon = '💜';
  else if (currentStreak < 70) icon = '🤎';
  else if (currentStreak < 80) icon = '🖤';
  else if (currentStreak < 90) icon = '❤️';
  else if (currentStreak < 100) icon = '💖';
  else if (currentStreak < 110) icon = '❤️‍🔥';
  else if (currentStreak < 120) icon = '🔥';
  else if (currentStreak < 130) icon = '🔅';
  else if (currentStreak < 140) icon = '🔆';
  else if (currentStreak < 150) icon = '☀️';
  else if (currentStreak < 160) icon = '✨';
  else if (currentStreak < 170) icon = '⭐️';
  else if (currentStreak < 180) icon = '🌟';
  else if (currentStreak < 190) icon = '💫';
  else icon = '🧞';

  return icon;
};

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

export const getDisplayDate = date => date.toLocaleString('en').split(',')[0];

export const getTodaysDisplayDate = () => getDisplayDate(new Date());

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
