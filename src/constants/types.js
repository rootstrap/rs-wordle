export const LETTER_STATUS = {
  correct: '#538d4e',
  misplaced: '#b59f3b',
  nothing: '#818384',
  incorrect: '#3a3a3c',
};

export const LETTER_STATUS_ICON = {
  [LETTER_STATUS.correct]: '🟩',
  [LETTER_STATUS.misplaced]: '🟨',
  [LETTER_STATUS.incorrect]: '⬜',
};

export const GAME_STATUS = {
  lost: 'lost',
  playing: 'playing',
  won: 'won',
};

const FIRST_EMOJI = '🥳';

const getAttemptsAverageValue = ({ totalAttempts, totalGames }) => {
  const initialValue = 0;
  const attemptsSum = totalAttempts.reduce((attemptsAverageAcc, attemptCount, index) => {
    const currentAttemptValue = index + 1;
    return attemptsAverageAcc + currentAttemptValue * attemptCount;
  }, initialValue);
  return Math.round((attemptsSum / totalGames) * 100) / 100;
};

const getBestAttempt = ({ totalAttempts }) => {
  const bestAttemptIndex = totalAttempts.findIndex(value => value > 0);
  return bestAttemptIndex + 1;
};

const getCommonAttempt = ({ totalAttempts }) => {
  let commonAttemptValue = 0;
  let commonAttempt = 0;
  totalAttempts.forEach((value, index) => {
    if (value > commonAttemptValue) {
      commonAttemptValue = value;
      commonAttempt = index + 1;
    }
  });
  return { commonAttempt, commonAttemptValue };
};

export const RANKING_VALUES = [
  {
    value: 'currentStreak',
    label: 'Current Streak',
    getNumericValue: ({ currentStreak }) => currentStreak,
    getRightText: ({ currentStreak, isFirst }) =>
      `${currentStreak} ${isFirst ? FIRST_EMOJI : '🔥'}`,
    getSuffix: ({ lastDatePlayed }) => `(${lastDatePlayed})`,
    sort: (firstValue, secondValue) => secondValue - firstValue,
  },
  {
    value: 'longestStreak',
    label: 'Longest Streak',
    getNumericValue: ({ longestStreak }) => longestStreak,
    getRightText: ({ isFirst, longestStreak }) =>
      `${longestStreak} ${isFirst ? FIRST_EMOJI : '🔥'}`,
    getSuffix: ({ longestStreakDate }) => `(${longestStreakDate})`,
    sort: (firstValue, secondValue) => secondValue - firstValue,
  },
  {
    value: 'attemptsAverage',
    label: 'Attempts Average',
    getNumericValue: getAttemptsAverageValue,
    getRightText: ({ isFirst, totalAttempts, totalGames }) => {
      const attemptsAverageValue = getAttemptsAverageValue({ totalAttempts, totalGames });
      return `${attemptsAverageValue} ${isFirst ? FIRST_EMOJI : '🎉'}`;
    },
    getSuffix: () => '',
    sort: (firstValue, secondValue) => firstValue - secondValue,
  },
  {
    value: 'bestAttempt',
    label: 'Best Attempt',
    getNumericValue: getBestAttempt,
    getRightText: ({ isFirst, totalAttempts }) => {
      const bestAttempt = getBestAttempt({ totalAttempts });
      return `${bestAttempt} ${isFirst ? FIRST_EMOJI : '🎉'}`;
    },
    getSuffix: () => '',
    sort: (firstValue, secondValue) => firstValue - secondValue,
  },
  {
    value: 'commonAttempt',
    label: 'Common Attempt',
    getNumericValue: ({ totalAttempts }) => {
      const { commonAttempt } = getCommonAttempt({ totalAttempts });
      return commonAttempt;
    },
    getRightText: ({ isFirst, totalAttempts }) => {
      const { commonAttempt } = getCommonAttempt({ totalAttempts });
      return `${commonAttempt} ${isFirst ? FIRST_EMOJI : '🎉'}`;
    },
    getSuffix: ({ totalAttempts }) => {
      const { commonAttemptValue } = getCommonAttempt({ totalAttempts });
      const timesText = commonAttemptValue > 1 ? 'times' : 'time';
      return `(${commonAttemptValue} ${timesText})`;
    },
    sort: (firstValue, secondValue) => firstValue - secondValue,
  },
  {
    value: 'numberOfGames',
    label: 'Number of Games',
    getNumericValue: ({ totalGames }) => totalGames,
    getRightText: ({ isFirst, totalGames }) => `${totalGames} ${isFirst ? FIRST_EMOJI : '🎉'}`,
    getSuffix: () => '',
    sort: (firstValue, secondValue) => secondValue - firstValue,
  },
  {
    value: 'totalLosses',
    label: 'Total Losses',
    getNumericValue: ({ totalGames, totalWins }) => totalGames - totalWins,
    getRightText: ({ isFirst, totalGames, totalWins }) =>
      `${totalGames - totalWins} ${isFirst ? FIRST_EMOJI : '😢'}`,
    getSuffix: () => '',
    sort: (firstValue, secondValue) => firstValue - secondValue,
  },
  {
    value: 'totalWins',
    label: 'Total Wins',
    getNumericValue: ({ totalWins }) => totalWins,
    getRightText: ({ isFirst, totalWins }) => `${totalWins} ${isFirst ? FIRST_EMOJI : '🎉'}`,
    getSuffix: () => '',
    sort: (firstValue, secondValue) => secondValue - firstValue,
  },
  {
    value: 'winsPercentage',
    label: 'Wins (%)',
    getNumericValue: ({ totalGames, totalWins }) =>
      totalGames ? ((totalWins * 100) / totalGames).toFixed(0) : 0,
    getRightText: ({ isFirst, totalGames, totalWins }) =>
      `${totalGames ? ((totalWins * 100) / totalGames).toFixed(0) : 0} %  ${
        isFirst ? FIRST_EMOJI : '🎉'
      }`,
    getSuffix: () => '',
    sort: (firstValue, secondValue) => secondValue - firstValue,
  },
];
