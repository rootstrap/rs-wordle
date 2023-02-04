import React from 'react';
import 'fake-indexeddb/auto';

import Home from 'pages/Home';
import { fireEvent, render, screen, waitFor } from 'setupTests';

jest.mock('components/common/Loading');

jest.mock('hooks/useSlackApp', () => () => ({
  sendMessageToChannel: jest.fn(),
}));

jest.mock('hooks/useWordDb', () => () => ({
  letters: ['G', 'E', 'N', 'I', 'E'],
  word: 'GENIE',
  loading: false,
  setLoading: jest.fn(),
}));

jest.mock('firebase/dailyResults', () => ({
  addDailyResults: () => '1234567',
  getDailyResults: () => ({
    docs: [],
    error: false,
  }),
  updateDailyResults: jest.fn(),
}));

const getKeyboardLetter = letter => screen.getByRole('button', { name: letter });

const getLetters = buttons =>
  buttons.filter(item => {
    const ariaRoleDescription = item.getAttribute('aria-roledescription');
    return ariaRoleDescription === 'letter';
  });

beforeEach(() => {
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
});

test('renders empty row with empty letters', () => {
  const emptyWord = screen.getAllByRole('group', { name: 'empty' });
  expect(emptyWord).toHaveLength(1);

  const emptyLetters = screen.getAllByRole('button', { name: 'empty' });
  expect(emptyLetters).toHaveLength(5);
});

test('enter all incorrect letters (CLASS)', async () => {
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

  const classWord = screen.queryByRole('group', { name: 'CLASS' });
  expect(classWord).toBeInTheDocument();

  const emptyLetters = screen.queryByRole('button', { name: 'empty' });
  expect(emptyLetters).not.toBeInTheDocument();

  const CLetters = screen.getAllByRole('button', { name: 'C' });
  expect(getLetters(CLetters)).toHaveLength(1);

  const LLetters = screen.getAllByRole('button', { name: 'L' });
  expect(getLetters(LLetters)).toHaveLength(1);

  const ALetters = screen.getAllByRole('button', { name: 'A' });
  expect(getLetters(ALetters)).toHaveLength(1);

  const SLetters = screen.getAllByRole('button', { name: 'S' });
  expect(getLetters(SLetters)).toHaveLength(2);

  // submit the word
  const enterButton = screen.getByRole('button', { name: /enter/i });
  fireEvent.click(enterButton);

  await waitFor(() => {
    // the CLASS letter's row and CLAS keys has all absent aria label (9 in total)
    const absentLetters = screen.getAllByRole('button', { name: /absent/i });
    expect(absentLetters).toHaveLength(9);

    // there is a new row for new empty word
    const newLineEmptyWord = screen.getByRole('group', { name: 'empty' });
    expect(newLineEmptyWord).toBeInTheDocument();

    const newLineEmptyLetters = screen.getAllByRole('button', { name: 'empty' });
    expect(newLineEmptyLetters).toHaveLength(5);
  });
});

test('enter some misplaced letters (BLEED)', async () => {
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

  const bleedWord = screen.queryByRole('group', { name: 'BLEED' });
  expect(bleedWord).toBeInTheDocument();

  const emptyLetters = screen.queryByRole('button', { name: 'empty' });
  expect(emptyLetters).not.toBeInTheDocument();

  const BLetters = screen.getAllByRole('button', { name: 'B' });
  expect(getLetters(BLetters)).toHaveLength(1);

  const LLetters = screen.getAllByRole('button', { name: 'L' });
  expect(getLetters(LLetters)).toHaveLength(1);

  const ELetters = screen.getAllByRole('button', { name: 'E' });
  expect(getLetters(ELetters)).toHaveLength(2);

  const DLetters = screen.getAllByRole('button', { name: 'D' });
  expect(getLetters(DLetters)).toHaveLength(1);

  // submit the word
  const enterButton = screen.getByRole('button', { name: /enter/i });
  fireEvent.click(enterButton);

  await waitFor(() => {
    // B, L and D letters in row and keyboard should have absent aria label
    const absentLetterB = screen.getAllByRole('button', { name: /B absent/i });
    expect(absentLetterB).toHaveLength(2);

    const absentLetterL = screen.getAllByRole('button', { name: /L absent/i });
    expect(absentLetterL).toHaveLength(2);

    const absentLetterD = screen.getAllByRole('button', { name: /D absent/i });
    expect(absentLetterD).toHaveLength(2);

    // E letters in row and keyboard should have misplaced aria label
    const absentLetterE = screen.getAllByRole('button', { name: /E misplaced/i });
    expect(absentLetterE).toHaveLength(3);

    // there is a new row for new empty word
    const newLineEmptyWord = screen.getByRole('group', { name: 'empty' });
    expect(newLineEmptyWord).toBeInTheDocument();

    const newLineEmptyLetters = screen.getAllByRole('button', { name: 'empty' });
    expect(newLineEmptyLetters).toHaveLength(5);
  });
});

test('enter some correct letters (GLOVE)', async () => {
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

  const gloveWord = screen.queryByRole('group', { name: 'GLOVE' });
  expect(gloveWord).toBeInTheDocument();

  const emptyLetters = screen.queryByRole('button', { name: 'empty' });
  expect(emptyLetters).not.toBeInTheDocument();

  const GLetters = screen.getAllByRole('button', { name: 'G' });
  expect(getLetters(GLetters)).toHaveLength(1);

  const LLetters = screen.getAllByRole('button', { name: 'L' });
  expect(getLetters(LLetters)).toHaveLength(1);

  const OLetters = screen.getAllByRole('button', { name: 'O' });
  expect(getLetters(OLetters)).toHaveLength(1);

  const VLetters = screen.getAllByRole('button', { name: 'V' });
  expect(getLetters(VLetters)).toHaveLength(1);

  const ELetters = screen.getAllByRole('button', { name: 'E' });
  expect(getLetters(ELetters)).toHaveLength(1);

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
    expect(newLineEmptyLetters).toHaveLength(5);
  });
});
