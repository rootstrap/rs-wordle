import React from 'react';
import 'fake-indexeddb/auto';

import Home from 'pages/Home';
import { fireEvent, render, screen, waitFor, within } from 'setupTests';

const TODAYS_WORD = 'GENIE';

let emptyStatistics = {
  totalGames: 0,
  totalWins: 0,
  totalAttempts: [0, 0, 0, 0, 0, 0, 0],
  currentStreak: 0,
  lastDatePlayed: '',
  longestStreak: 0,
  longestStreakDate: '',
  attemptedWords: {},
  timeAverage: 0,
  minTime: 0,
  maxTime: 0,
};

jest.mock('components/common/Loading');
jest.mock('react-confetti');

jest.mock('hooks/useSlackApp', () => () => ({
  sendMessageToChannel: jest.fn(),
}));

jest.mock('firebase/words', () => ({
  getTodaysWord: () => ({ todaysWord: TODAYS_WORD }),
}));

jest.mock('firebase/dailyResults', () => ({
  addDailyResults: () => '1234567',
  getDailyResults: () => ({
    docs: [],
    error: false,
  }),
  updateDailyResults: jest.fn(),
}));

jest.mock('firebase/usersStatistics', () => ({
  getUsersStatistics: () => ({
    currentStatistics: emptyStatistics,
  }),
  updateUsersStatistics: () => {},
}));

const getKeyboardLetter = letter => screen.getByRole('button', { name: letter });

beforeEach(async () => {
  render(<Home />, {
    preloadedState: {
      user: {
        user: {
          email: 'janedoe@rootstrap.com',
          name: 'Jane Doe',
          photo: 'https://source.unsplash.com/random/?person',
          uid: 'ABCDEFGHIJK',
        },
        authenticated: true,
      },
    },
  });

  await waitFor(() => {
    const emptyWord = screen.getAllByRole('group', { name: 'empty' });
    expect(emptyWord).toHaveLength(1);

    const emptyLetters = screen.getAllByRole('button', { name: 'empty' });
    expect(emptyLetters).toHaveLength(TODAYS_WORD.length);
  });
});

test('enter all incorrect letters (CLASS)', async () => {
  const CLASS = 'CLASS';

  // get all the keyboard buttons we will use
  const CButton = getKeyboardLetter('C');
  const LButton = getKeyboardLetter('L');
  const AButton = getKeyboardLetter('A');
  const SButton = getKeyboardLetter('S');

  // type CLASS with the keyboard buttons
  fireEvent.click(CButton);
  fireEvent.click(LButton);
  fireEvent.click(AButton);
  fireEvent.click(SButton);
  fireEvent.click(SButton);

  // check there are no more empty spaces and now it has CLASS content
  const emptyWord = screen.queryByRole('group', { name: 'empty' });
  expect(emptyWord).not.toBeInTheDocument();

  const classWord = screen.getByRole('group', { name: CLASS });
  expect(classWord).toBeInTheDocument();

  const emptyLetters = screen.queryByRole('button', { name: 'empty' });
  expect(emptyLetters).not.toBeInTheDocument();

  const CLetter = within(classWord).getByRole('button', { name: 'C' });
  expect(CLetter).toBeInTheDocument();

  const LLetter = within(classWord).getByRole('button', { name: 'L' });
  expect(LLetter).toBeInTheDocument();

  const ALetter = within(classWord).getByRole('button', { name: 'A' });
  expect(ALetter).toBeInTheDocument();

  const SLetters = within(classWord).getAllByRole('button', { name: 'S' });
  expect(SLetters).toHaveLength(2);

  // submit the word
  const enterButton = screen.getByRole('button', { name: /enter/i });
  fireEvent.click(enterButton);

  await waitFor(() => {
    // the CLASS (5) letter's row and CLASS keyboard keys (4) have all absent aria-label
    const absentClassLetters = within(classWord).getAllByRole('button', { name: /absent/i });
    expect(absentClassLetters).toHaveLength(CLASS.length);

    const keyboard = screen.getByRole('group', { name: 'keyboard' });
    expect(within(keyboard).getAllByRole('button', { name: /absent/i })).toHaveLength(4);

    // a new empty row is created
    const newLineEmptyWord = screen.getByRole('group', { name: 'empty' });
    expect(newLineEmptyWord).toBeInTheDocument();

    const newLineEmptyLetters = screen.getAllByRole('button', { name: 'empty' });
    expect(newLineEmptyLetters).toHaveLength(TODAYS_WORD.length);
  });
});

test('enter some misplaced letters (BLEED)', async () => {
  const BLEED = 'BLEED';

  // get all the keyboard buttons we will use
  const BButton = getKeyboardLetter('B');
  const LButton = getKeyboardLetter('L');
  const EButton = getKeyboardLetter('E');
  const DButton = getKeyboardLetter('D');

  // type CLASS with the keyboard buttons
  fireEvent.click(BButton);
  fireEvent.click(LButton);
  fireEvent.click(EButton);
  fireEvent.click(EButton);
  fireEvent.click(DButton);

  // check there are no more empty spaces and now it has BLEED content
  const emptyWord = screen.queryByRole('group', { name: 'empty' });
  expect(emptyWord).not.toBeInTheDocument();

  const bleedWord = screen.getByRole('group', { name: BLEED });
  expect(bleedWord).toBeInTheDocument();

  const emptyLetters = screen.queryByRole('button', { name: 'empty' });
  expect(emptyLetters).not.toBeInTheDocument();

  const BLetter = within(bleedWord).getByRole('button', { name: 'B' });
  expect(BLetter).toBeInTheDocument();

  const LLetter = within(bleedWord).getByRole('button', { name: 'L' });
  expect(LLetter).toBeInTheDocument();

  const ELetters = within(bleedWord).getAllByRole('button', { name: 'E' });
  expect(ELetters).toHaveLength(2);

  const DLetter = within(bleedWord).getByRole('button', { name: 'D' });
  expect(DLetter).toBeInTheDocument();

  // submit the word
  const enterButton = screen.getByRole('button', { name: /enter/i });
  fireEvent.click(enterButton);

  await waitFor(() => {
    // B, L and D letters in row and keyboard should have absent aria-label
    const absentLetterB = screen.getAllByRole('button', { name: /B absent/i });
    expect(absentLetterB).toHaveLength(2);

    const absentLetterL = screen.getAllByRole('button', { name: /L absent/i });
    expect(absentLetterL).toHaveLength(2);

    const absentLetterD = screen.getAllByRole('button', { name: /D absent/i });
    expect(absentLetterD).toHaveLength(2);

    // E letters in row and keyboard should have misplaced aria-label
    const absentLetterE = screen.getAllByRole('button', { name: /E misplaced/i });
    expect(absentLetterE).toHaveLength(3);

    // there is a new row for new empty word
    const newLineEmptyWord = screen.getByRole('group', { name: 'empty' });
    expect(newLineEmptyWord).toBeInTheDocument();

    const newLineEmptyLetters = screen.getAllByRole('button', { name: 'empty' });
    expect(newLineEmptyLetters).toHaveLength(TODAYS_WORD.length);
  });
});

test('enter some correct letters (GLOVE)', async () => {
  const GLOVE = 'GLOVE';

  // get all the keyboard buttons we will use
  const GButton = getKeyboardLetter('G');
  const LButton = getKeyboardLetter('L');
  const OButton = getKeyboardLetter('O');
  const VButton = getKeyboardLetter('V');
  const EButton = getKeyboardLetter('E');

  // type GLOVE with the keyboard buttons
  fireEvent.click(GButton);
  fireEvent.click(LButton);
  fireEvent.click(OButton);
  fireEvent.click(VButton);
  fireEvent.click(EButton);

  // check there are no more empty spaces and now it has GLOVE content
  const emptyWord = screen.queryByRole('group', { name: 'empty' });
  expect(emptyWord).not.toBeInTheDocument();

  const gloveWord = screen.getByRole('group', { name: GLOVE });
  expect(gloveWord).toBeInTheDocument();

  const emptyLetters = screen.queryByRole('button', { name: 'empty' });
  expect(emptyLetters).not.toBeInTheDocument();

  const GLetter = within(gloveWord).getByRole('button', { name: 'G' });
  expect(GLetter).toBeInTheDocument();

  const LLetter = within(gloveWord).getByRole('button', { name: 'L' });
  expect(LLetter).toBeInTheDocument();

  const OLetter = within(gloveWord).getByRole('button', { name: 'O' });
  expect(OLetter).toBeInTheDocument();

  const VLetter = within(gloveWord).getByRole('button', { name: 'V' });
  expect(VLetter).toBeInTheDocument();

  const ELetter = within(gloveWord).getByRole('button', { name: 'E' });
  expect(ELetter).toBeInTheDocument();

  // submit the word
  const enterButton = screen.getByRole('button', { name: /enter/i });
  fireEvent.click(enterButton);

  await waitFor(() => {
    // L, O and V letters in row and keyboard should have absent aria label
    const absentLetterL = screen.getAllByRole('button', { name: /L absent/i });
    expect(absentLetterL).toHaveLength(2);

    const absentLetterO = screen.getAllByRole('button', { name: /O absent/i });
    expect(absentLetterO).toHaveLength(2);

    const absentLetterV = screen.getAllByRole('button', { name: /V absent/i });
    expect(absentLetterV).toHaveLength(2);

    // G and E letters in row and keyboard should have correct aria label
    const absentLetterG = screen.getAllByRole('button', { name: /G correct/i });
    expect(absentLetterG).toHaveLength(2);

    const absentLetterE = screen.getAllByRole('button', { name: /E correct/i });
    expect(absentLetterE).toHaveLength(2);

    // there is a new row for new empty word
    const newLineEmptyWord = screen.getByRole('group', { name: 'empty' });
    expect(newLineEmptyWord).toBeInTheDocument();

    const newLineEmptyLetters = screen.getAllByRole('button', { name: 'empty' });
    expect(newLineEmptyLetters).toHaveLength(TODAYS_WORD.length);
  });
});

test('enter the correct word (GENIE)', async () => {
  // get all the keyboard buttons we will use
  const GButton = getKeyboardLetter('G');
  const EButton = getKeyboardLetter('E');
  const NButton = getKeyboardLetter('N');
  const IButton = getKeyboardLetter('I');

  // type GENIE with the keyboard buttons
  fireEvent.click(GButton);
  fireEvent.click(EButton);
  fireEvent.click(NButton);
  fireEvent.click(IButton);
  fireEvent.click(EButton);

  // check there are no more empty spaces and now it has GENIE content
  const emptyWord = screen.queryByRole('group', { name: 'empty' });
  expect(emptyWord).not.toBeInTheDocument();

  const genieWord = screen.getByRole('group', { name: TODAYS_WORD });
  expect(genieWord).toBeInTheDocument();

  const emptyLetters = screen.queryByRole('button', { name: 'empty' });
  expect(emptyLetters).not.toBeInTheDocument();

  const GLetter = within(genieWord).getByRole('button', { name: 'G' });
  expect(GLetter).toBeInTheDocument();

  const ELetters = within(genieWord).getAllByRole('button', { name: 'E' });
  expect(ELetters).toHaveLength(2);

  const NLetter = within(genieWord).getByRole('button', { name: 'N' });
  expect(NLetter).toBeInTheDocument();

  const ILetter = within(genieWord).getByRole('button', { name: 'I' });
  expect(ILetter).toBeInTheDocument();

  // submit the word
  const enterButton = screen.getByRole('button', { name: /enter/i });
  fireEvent.click(enterButton);

  await waitFor(() => {
    // G, E, N and I letters in row and keyboard should have correct aria-label
    const absentLetterG = screen.getAllByRole('button', { name: /G correct/i });
    expect(absentLetterG).toHaveLength(2);

    const absentLetterE = screen.getAllByRole('button', { name: /E correct/i });
    expect(absentLetterE).toHaveLength(3);

    const absentLetterN = screen.getAllByRole('button', { name: /N correct/i });
    expect(absentLetterN).toHaveLength(2);

    const absentLetterI = screen.getAllByRole('button', { name: /I correct/i });
    expect(absentLetterI).toHaveLength(2);

    // there is not a new row for new empty word since we end the game
    const newLineEmptyWord = screen.queryByRole('group', { name: 'empty' });
    expect(newLineEmptyWord).not.toBeInTheDocument();

    const newLineEmptyLetters = screen.queryAllByRole('button', { name: 'empty' });
    expect(newLineEmptyLetters).toHaveLength(0);

    // it shows the won message
    const wonText = screen.getByText(/won/i);
    expect(wonText).toBeInTheDocument();

    // it shows the confetti
    const confetti = screen.getByText(/confetti/i);
    expect(confetti).toBeInTheDocument();
  });
});
