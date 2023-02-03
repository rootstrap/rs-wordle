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
  const CButton = screen.getByRole('button', { name: 'C' });
  expect(CButton).toBeInTheDocument();

  const LButton = screen.getByRole('button', { name: 'L' });
  expect(LButton).toBeInTheDocument();

  const AButton = screen.getByRole('button', { name: 'A' });
  expect(AButton).toBeInTheDocument();

  const SButton = screen.getByRole('button', { name: 'S' });
  expect(SButton).toBeInTheDocument();

  // type class with the keyboard buttons
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

  const CLetter = screen.getAllByRole('button', { name: 'C' });
  expect(CLetter).toHaveLength(2);

  const LLetter = screen.getAllByRole('button', { name: 'L' });
  expect(LLetter).toHaveLength(2);

  const ALetter = screen.getAllByRole('button', { name: 'A' });
  expect(ALetter).toHaveLength(2);

  const SLetter = screen.getAllByRole('button', { name: 'S' });
  expect(SLetter).toHaveLength(3);

  // submit the word
  const EnterButton = screen.getByRole('button', { name: /enter/i });
  expect(EnterButton).toBeInTheDocument();

  fireEvent.click(EnterButton);

  /*  await waitFor(() => {
    const emptyWordAgain = screen.getByRole('group', { name: 'empty' });
  }); */
});
