export const LETTER_STATUS = {
  correct: {
    id: 'correct',
    color: '#538d4e',
    colorOrder: 3,
    icon: '🟩',
    ariaLabel: (letter, t) => `${letter} ${t('ariaLabels.correct')}`,
  },
  misplaced: {
    id: 'misplaced',
    color: '#b59f3b',
    colorOrder: 2,
    icon: '🟨',
    ariaLabel: (letter, t) => `${letter} ${t('ariaLabels.misplaced')}`,
  },
  nothing: {
    id: 'nothing',
    color: '#818384',
    colorOrder: 0,
    icon: '⬛️',
    ariaLabel: (letter, t) => letter || t('ariaLabels.empty'),
  },
  incorrect: {
    id: 'incorrect',
    color: '#3a3a3c',
    colorOrder: 1,
    icon: '⬜',
    ariaLabel: (letter, t) => `${letter} ${t('ariaLabels.absent')}`,
  },
};

export const GAME_STATUS = {
  lost: 'lost',
  playing: 'playing',
  won: 'won',
};

export const SUGGESTIONS_STATUS = [
  {
    value: 'All',
    label: 'All',
    color: 'purple',
    isDefault: true,
  },
  {
    value: 'Pending',
    label: 'Pending',
    color: 'black',
  },
  {
    value: 'In Progress',
    label: 'In Progress',
    color: '#af5706',
  },
  {
    value: 'Done',
    label: 'Done',
    color: '#034e03',
  },
];

export const MODAL_TYPE = {
  add: 'add',
  edit: 'edit',
};
