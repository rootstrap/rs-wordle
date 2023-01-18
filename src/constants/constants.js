import { LETTER_STATUS } from './types';

export const SUPPORTED_LANGUAGES = ['en'];
export const DEFAULT_LANGUAGE = 'en';

export const WORDLE_URL = 'https://rs-wordle.netlify.app/';

// REGEX
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

// AUTH
export const AUTH_USER_KEY = 'user';

// KEYBOARD
export const CHANGE_LINES_VALUES = [10, 19];

export const KEYBOARD_LETTERS = {
  Q: LETTER_STATUS.nothing.id,
  W: LETTER_STATUS.nothing.id,
  E: LETTER_STATUS.nothing.id,
  R: LETTER_STATUS.nothing.id,
  T: LETTER_STATUS.nothing.id,
  Y: LETTER_STATUS.nothing.id,
  U: LETTER_STATUS.nothing.id,
  I: LETTER_STATUS.nothing.id,
  O: LETTER_STATUS.nothing.id,
  P: LETTER_STATUS.nothing.id,
  A: LETTER_STATUS.nothing.id,
  S: LETTER_STATUS.nothing.id,
  D: LETTER_STATUS.nothing.id,
  F: LETTER_STATUS.nothing.id,
  G: LETTER_STATUS.nothing.id,
  H: LETTER_STATUS.nothing.id,
  J: LETTER_STATUS.nothing.id,
  K: LETTER_STATUS.nothing.id,
  L: LETTER_STATUS.nothing.id,
  Enter: LETTER_STATUS.nothing.id,
  Z: LETTER_STATUS.nothing.id,
  X: LETTER_STATUS.nothing.id,
  C: LETTER_STATUS.nothing.id,
  V: LETTER_STATUS.nothing.id,
  B: LETTER_STATUS.nothing.id,
  N: LETTER_STATUS.nothing.id,
  M: LETTER_STATUS.nothing.id,
  Backspace: LETTER_STATUS.nothing.id,
};

export const MAX_ATTEMPTS = 6;
export const ADMITTED_WORDS_SIZES = [4, 5, 6];
export const ACCEPTED_WORDS = ['MONDAY', 'TUESDAY', 'FRIDAY', 'SUNDAY', 'ROOTSTRAP'];

export const VOTED_COLOR = 'action';
