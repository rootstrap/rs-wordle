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

export const RANKING_VALUES = [
  {
    value: 'currentStreak',
    label: 'Current Streak',
    getValueToShow: currentStreak => currentStreak,
  },
  {
    value: 'longestStreak',
    label: 'Longest Streak',
    getValueToShow: longestStreak => longestStreak,
  },
];
