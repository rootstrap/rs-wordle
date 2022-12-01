import { useCallback, useEffect, useState } from 'react';
import { addDoc, collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import wordExists from 'word-exists';

import { COLOR_ORDER, KEYBOARD_LETTERS, MAX_ATTEMPTS, WORDLE_URL } from 'constants/constants';
import { LETTER_STATUS, LETTER_STATUS_ICON, GAME_STATUS } from 'constants/types';
import { USERS_ATTEMPTS, DAILY_RESULTS } from 'firebase/collections';
import firebaseData from 'firebase/firebase';
import { getTodaysDate, getTodaysDisplayDate } from 'utils/helpers';

import useAuth from './useAuth';
import useUserStatistics from './useUsersStatistics';

const { firebaseDb } = firebaseData;

const useUsersAttempts = ({ wordLength, correctWord, letters, setLoading }) => {
  const {
    user: { email: currentUser, name, photo },
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

  const today = getTodaysDate();
  const {
    statistics: {
      totalGames,
      totalWins,
      totalAttempts,
      currentStreak,
      longestStreak,
      attemptedWords,
    },
    updateStatistics,
  } = useUserStatistics();

  useEffect(() => {
    (async function () {
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
            if (!won) {
              roundCount++;
            }
          });
          setCurrentRound(roundCount);
          const lost = newUsersAttempts.length === MAX_ATTEMPTS;
          if (won || lost) {
            setGameStatus(won ? GAME_STATUS.won : GAME_STATUS.lost);
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
    })();
  }, [correctWord, currentUser, keyboardLetters, setLoading, today, wordDate, wordLength]);

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

      if (correctCount === wordLength || usersAttempts.length === MAX_ATTEMPTS) {
        const newStatus = correctCount === wordLength ? GAME_STATUS.won : GAME_STATUS.lost;
        const won = newStatus === GAME_STATUS.won;
        const currentAttemptedWords = usersAttempts.map((attempt, index) => ({
          word: attempt.join(''),
          results: newRoundsResults[index],
        }));

        await addDoc(collection(firebaseDb, DAILY_RESULTS), {
          attempts: currentRound + 1,
          attemptedWords: currentAttemptedWords,
          date: getTodaysDate(false),
          formattedDate: today,
          status: newStatus,
          user: {
            email: currentUser,
            name,
            photo,
          },
        });

        const newCurrentStreak = won ? currentStreak + 1 : 0;
        const newTotalAttempts = [...totalAttempts];
        newTotalAttempts[won ? currentRound : currentRound + 1] = totalAttempts[currentRound] + 1;
        const newAttemptedWords = { ...attemptedWords };
        currentAttemptedWords.forEach(word => {
          const currentValue = newAttemptedWords[word] ?? 0;
          newAttemptedWords[word] = currentValue + 1;
        });

        const newStatistics = {
          totalGames: totalGames + 1,
          totalWins: won ? totalWins + 1 : totalWins,
          totalAttempts: newTotalAttempts,
          currentStreak: newCurrentStreak,
          longestStreak: newCurrentStreak > longestStreak ? newCurrentStreak : longestStreak,
          attemptedWords: newAttemptedWords,
        };

        updateStatistics(newStatistics);
        setGameStatus(newStatus);
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
      attemptedWords,
      currentRound,
      currentStreak,
      currentUser,
      keyboardLetters,
      letters,
      longestStreak,
      name,
      photo,
      roundsResults,
      today,
      totalAttempts,
      totalGames,
      totalWins,
      updateStatistics,
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

  const shareResults = async () => {
    const resultsDate = getTodaysDisplayDate();
    const resultsRatio = `${roundsResults.length}/${MAX_ATTEMPTS}`;
    let textResult = `RS Wordle ${resultsDate} ${resultsRatio} \n \n`;
    roundsResults.forEach(lineResult => {
      lineResult.forEach(result => {
        textResult += LETTER_STATUS_ICON[result];
      });
      textResult += '\n';
    });
    textResult += `\n${WORDLE_URL}`;
    await navigator.clipboard.writeText(textResult);
    alert('Copied to Clipboard: \n \n' + textResult);
  };

  return {
    currentRound,
    usersAttempts,
    roundsResults,
    gameEnded,
    gameStatus,
    error,
    keyboardLetters,
    letterIndex,
    setLetterIndex,
    onKeyPress,
    wordProcessing,
    shareResults,
  };
};

export default useUsersAttempts;
