import { LETTER_STATUS } from './types';

export const SUPPORTED_LANGUAGES = ['en'];
export const DEFAULT_LANGUAGE = 'en';

// REGEX
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

// AUTH
export const AUTH_USER_KEY = 'user';

// KEYBOARD
export const CHANGE_LINES_VALUES = [10, 19];
export const COLOR_ORDER = {
  [LETTER_STATUS.nothing]: 0,
  [LETTER_STATUS.incorrect]: 1,
  [LETTER_STATUS.misplaced]: 2,
  [LETTER_STATUS.correct]: 3,
};
export const KEYBOARD_LETTERS = {
  Q: LETTER_STATUS.nothing,
  W: LETTER_STATUS.nothing,
  E: LETTER_STATUS.nothing,
  R: LETTER_STATUS.nothing,
  T: LETTER_STATUS.nothing,
  Y: LETTER_STATUS.nothing,
  U: LETTER_STATUS.nothing,
  I: LETTER_STATUS.nothing,
  O: LETTER_STATUS.nothing,
  P: LETTER_STATUS.nothing,
  A: LETTER_STATUS.nothing,
  S: LETTER_STATUS.nothing,
  D: LETTER_STATUS.nothing,
  F: LETTER_STATUS.nothing,
  G: LETTER_STATUS.nothing,
  H: LETTER_STATUS.nothing,
  J: LETTER_STATUS.nothing,
  K: LETTER_STATUS.nothing,
  L: LETTER_STATUS.nothing,
  Enter: LETTER_STATUS.nothing,
  Z: LETTER_STATUS.nothing,
  X: LETTER_STATUS.nothing,
  C: LETTER_STATUS.nothing,
  V: LETTER_STATUS.nothing,
  B: LETTER_STATUS.nothing,
  N: LETTER_STATUS.nothing,
  M: LETTER_STATUS.nothing,
  Backspace: LETTER_STATUS.nothing,
};

export const MAX_ATTEMPTS = 6;
