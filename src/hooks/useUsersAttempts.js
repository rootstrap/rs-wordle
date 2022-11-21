import { useCallback, useEffect, useState } from 'react';
import { addDoc, collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import wordExists from 'word-exists';

import { COLOR_ORDER, KEYBOARD_LETTERS } from 'constants/constants';
import { LETTER_STATUS, GAME_STATUS } from 'constants/types';
import { USERS_ATTEMPTS } from 'firebase/collections';
import firebaseData from 'firebase/firebase';
import { getTodaysDate } from 'utils/helpers';

import useAuth from './useAuth';

const useUsersAttempts = ({ wordLength, correctWord, letters, setLoading }) => {
  const {
    user: { email: currentUser },
  } = useAuth();

  const [wordDate, setWordDate] = useState(null);
  const [letterIndex, setLetterIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [usersAttempts, setUsersAttempts] = useState([Array(wordLength).fill('')]);
  const [roundsResults, setRoundsResults] = useState([Array(wordLength).fill('')]);
  const [error, setError] = useState('');
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.playing);
  const [keyboardLetters, setKeyboardLetters] = useState(KEYBOARD_LETTERS);
  const [wordProcessing, setWordProcessing] = useState(false);

  const gameEnded = gameStatus !== GAME_STATUS.playing;

  const { firebaseDb } = firebaseData;
  const today = getTodaysDate();

  useEffect(() => {
    const getUserAttempts = async () => {
      if (wordDate !== today && !!correctWord) {
        setWordDate(today);
        setUsersAttempts([Array(wordLength).fill('')]);
        setRoundsResults([Array(wordLength).fill('')]);
        try {
          const q = query(
            collection(firebaseDb, USERS_ATTEMPTS),
            where('user', '==', currentUser),
            where('date', '==', today),
            orderBy('round')
          );
          const docs = await getDocs(q);
          const newUsersAttempts = [];
          const newRoundsResults = [];
          const newKeyboardLetters = { ...keyboardLetters };
          let roundCount = 0;
          let won = false;
          docs.forEach(doc => {
            const { result, word } = doc.data();
            const wordAttempt = word.split('');
            newUsersAttempts.push(wordAttempt);
            newRoundsResults.push(result);
            result.forEach((color, index) => {
              const letter = wordAttempt[index];
              const currentColorOrder = COLOR_ORDER[newKeyboardLetters[letter]];
              const newColorOrder = COLOR_ORDER[color];
              if (newColorOrder > currentColorOrder) {
                newKeyboardLetters[letter] = color;
              }
            });
            won = word.toUpperCase() === correctWord.toUpperCase();
            roundCount++;
          });
          setCurrentRound(won ? roundCount - 1 : roundCount);
          if (won) {
            setGameStatus(GAME_STATUS.won);
            setLetterIndex(-1);
          } else {
            newUsersAttempts.push(Array(wordLength).fill(''));
          }
          setUsersAttempts(newUsersAttempts);
          setRoundsResults(newRoundsResults);
          setKeyboardLetters(newKeyboardLetters);
          setLoading(false);
        } catch (err) {
          console.log('err: ', err);
          setLoading(false);
        }
      }
    };
    getUserAttempts();
  }, [
    correctWord,
    currentUser,
    firebaseDb,
    keyboardLetters,
    setLoading,
    today,
    wordDate,
    wordLength,
  ]);

  const compareWithWord = useCallback(
    async (currentAttempt, attemptedWord) => {
      const newRoundsResults = [...roundsResults];
      const currentRoundResult = [];
      let correctCount = 0;
      currentAttempt.forEach((letter, index) => {
        let indexes = [];
        for (let i = 0; i < wordLength; i++) {
          if (letters[i].toUpperCase() === letter.toUpperCase()) {
            indexes.push(i);
          }
        }

        if (indexes.includes(index)) {
          currentRoundResult.push(LETTER_STATUS.correct);
          correctCount++;
        } else if (indexes.length > 0) {
          const allCurrentAttemptIndexes = [];
          for (let j = 0; j < wordLength; j++) {
            if (currentAttempt[j].toUpperCase() === letter.toUpperCase()) {
              if (indexes.includes(j)) {
                indexes = indexes.filter(ind => ind !== j);
              } else {
                allCurrentAttemptIndexes.push(j);
              }
            }
          }
          const occurrenceIndex = allCurrentAttemptIndexes.indexOf(index);
          if (occurrenceIndex < indexes.length) {
            currentRoundResult.push(LETTER_STATUS.misplaced);
          } else {
            currentRoundResult.push(LETTER_STATUS.incorrect);
          }
        } else {
          currentRoundResult.push(LETTER_STATUS.incorrect);
        }
      });

      const newKeyboardLetters = { ...keyboardLetters };
      currentRoundResult.forEach((color, index) => {
        const letter = currentAttempt[index].toUpperCase();
        const currentColorOrder = COLOR_ORDER[newKeyboardLetters[letter]];
        const newColorOrder = COLOR_ORDER[color];
        if (newColorOrder > currentColorOrder) {
          newKeyboardLetters[letter] = color;
        }
      });

      await addDoc(collection(firebaseDb, USERS_ATTEMPTS), {
        date: today,
        result: currentRoundResult,
        round: currentRound,
        user: currentUser,
        word: attemptedWord.toUpperCase(),
      });

      newRoundsResults.push(currentRoundResult);
      setKeyboardLetters(newKeyboardLetters);
      setRoundsResults(newRoundsResults);

      if (correctCount === wordLength) {
        setGameStatus(GAME_STATUS.won);
        setLetterIndex(-1);
      } else {
        const attempts = [...usersAttempts];
        attempts.push(Array(wordLength).fill(''));
        setCurrentRound(currentRound + 1);
        setUsersAttempts(attempts);
        setLetterIndex(0);
      }
    },
    [
      currentRound,
      currentUser,
      firebaseDb,
      keyboardLetters,
      letters,
      roundsResults,
      today,
      usersAttempts,
      wordLength,
    ]
  );

  const onSubmitWord = useCallback(async () => {
    setWordProcessing(true);
    setError('');
    const currentAttempt = usersAttempts[currentRound];
    const attemptedWord = currentAttempt.join('');

    if (attemptedWord.length !== wordLength) {
      setError(`${attemptedWord.toUpperCase()} doesn't have ${wordLength} letters`);
      setWordProcessing(false);
      return;
    }

    const alreadyAttemptedWord = usersAttempts.some(
      (word, wordIndex) =>
        wordIndex !== currentRound &&
        word.every((value, itemIndex) => value === currentAttempt[itemIndex])
    );

    if (alreadyAttemptedWord) {
      setError(`You already tried with ${attemptedWord.toUpperCase()}`);
      setWordProcessing(false);
      return;
    }

    const existsWord = wordExists(attemptedWord);
    if (!existsWord) {
      setError(`${attemptedWord.toUpperCase()} doesn't exist in English`);
    } else {
      await compareWithWord(currentAttempt, attemptedWord);
    }
    setWordProcessing(false);
  }, [compareWithWord, currentRound, usersAttempts, wordLength]);

  const focusBefore = letterIndex => {
    if (letterIndex > 0) {
      setLetterIndex(letterIndex - 1);
    }
  };

  const focusNext = useCallback(
    letterIndex => {
      if (letterIndex < letters.length - 1) {
        setLetterIndex(letterIndex + 1);
      }
    },
    [letters.length]
  );

  const onKeyPress = useCallback(
    ({ key }) => {
      setError('');
      if (gameEnded) return;
      const isDelete = key === 'Backspace';
      const isEnter = key === 'Enter';

      if (key.length > 1 && !isDelete) {
        isEnter && onSubmitWord();
        return;
      }
      const isLetter = key.match(/[a-zA-Z]/g);

      if (isLetter || isDelete) {
        const newAttempt = [...usersAttempts];
        newAttempt[currentRound][letterIndex] = isDelete ? '' : key.toUpperCase();
        setUsersAttempts(newAttempt);
        isDelete ? focusBefore(letterIndex) : focusNext(letterIndex);
      }
    },
    [currentRound, focusNext, gameEnded, letterIndex, onSubmitWord, usersAttempts]
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyPress);

    return () => {
      document.removeEventListener('keydown', onKeyPress);
    };
  }, [onKeyPress]);

  return {
    currentRound,
    usersAttempts,
    roundsResults,
    gameEnded,
    error,
    keyboardLetters,
    letterIndex,
    setLetterIndex,
    onKeyPress,
    wordProcessing,
  };
};

export default useUsersAttempts;
