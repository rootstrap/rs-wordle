import { useCallback, useEffect, useState, useMemo } from 'react';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import wordExists from 'word-exists';

import { ACCEPTED_WORDS, KEYBOARD_LETTERS, MAX_ATTEMPTS, WORDLE_URL } from 'constants/constants';
import { CUSTOM_CONFETTI_ANNUAL, CUSTOM_CONFETTI } from 'constants/customConfetti';
import { ARROW_LEFT, ARROW_RIGHT, BACKSPACE, ENTER } from 'constants/keyboardKeys';
import { LETTER_STATUS, GAME_STATUS } from 'constants/types';
import { DAILY_RESULTS } from 'firebase/collections';
import firebaseData from 'firebase/firebase';
import {
  getCurrentStreakIcon,
  getTodaysDate,
  getTodaysDisplayDate,
  getTimeDiff,
} from 'utils/helpers';

import useAuth from './useAuth';
import useUserStatistics from './useUsersStatistics';

const { firebaseDb } = firebaseData;
const dailyResultsRef = collection(firebaseDb, DAILY_RESULTS);

const useUsersAttempts = ({ wordLength, correctWord, letters, setLoading }) => {
  const {
    user: { email: currentUser, name, photo, uid },
  } = useAuth();

  const [wordDate, setWordDate] = useState(null);
  const [letterIndex, setLetterIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [usersAttempts, setUsersAttempts] = useState([Array(wordLength).fill('')]);
  const [roundsResults, setRoundsResults] = useState([Array(wordLength).fill('')]);
  const [dailyResults, setDailyResults] = useState({});
  const [dailyResultsId, setDailyResultsId] = useState();
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
      longestStreakDate,
      timeAverage,
      minTime,
      maxTime,
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
            collection(firebaseDb, DAILY_RESULTS),
            where('user.email', '==', currentUser),
            where('date', '==', today)
          );
          const docs = await getDocs(q);
          const newUsersAttempts = [];
          const newRoundsResults = [];
          const newKeyboardLetters = { ...keyboardLetters };
          let roundCount = 0;
          let won = false;

          docs.forEach(doc => {
            const { attemptedWords, ...restDailyResults } = doc.data();

            attemptedWords.forEach(({ results, word }) => {
              const wordAttempt = word.split('');
              newUsersAttempts.push(wordAttempt);
              newRoundsResults.push(results);
              results.forEach((statusId, index) => {
                const letter = wordAttempt[index];
                const currentStatusOrder = LETTER_STATUS[newKeyboardLetters[letter]].colorOrder;
                const newStatusOrder = LETTER_STATUS[statusId].colorOrder;

                if (newStatusOrder > currentStatusOrder) {
                  newKeyboardLetters[letter] = statusId;
                }
              });
              won = word.toUpperCase() === correctWord.toUpperCase();
              if (!won) {
                roundCount++;
              }
            });

            setDailyResults({
              attemptedWords,
              ...restDailyResults,
            });
            setDailyResultsId(doc.id);
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
          currentRoundResult.push(LETTER_STATUS.correct.id);
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
            currentRoundResult.push(LETTER_STATUS.misplaced.id);
          } else {
            currentRoundResult.push(LETTER_STATUS.incorrect.id);
          }
        } else {
          currentRoundResult.push(LETTER_STATUS.incorrect.id);
        }
      });

      const newKeyboardLetters = { ...keyboardLetters };
      currentRoundResult.forEach((statusId, index) => {
        const letter = currentAttempt[index].toUpperCase();
        const currentStatusOrder = LETTER_STATUS[newKeyboardLetters[letter]].colorOrder;
        const newStatusOrder = LETTER_STATUS[statusId].colorOrder;

        if (newStatusOrder > currentStatusOrder) {
          newKeyboardLetters[letter] = statusId;
        }
      });

      const won = correctCount === wordLength;
      const lost = usersAttempts.length === MAX_ATTEMPTS && !won;
      const newStatus = won ? GAME_STATUS.won : lost ? GAME_STATUS.lost : GAME_STATUS.playing;
      const currentTime = getTodaysDate(false);
      const solveTime = getTimeDiff(dailyResults.startTime, currentTime) || 0;

      if (!currentRound) {
        const newDailyResults = {
          attemptedWords: [
            {
              results: currentRoundResult,
              word: attemptedWord.toUpperCase(),
            },
          ],
          attempts: 1,
          startTime: currentTime,
          endTime: currentTime,
          solveTime,
          date: today,
          status: won ? GAME_STATUS.won : GAME_STATUS.playing,
          user: {
            uid,
            name,
            email: currentUser,
            photo,
          },
        };
        const { id: dailyResultsId } = await addDoc(
          collection(firebaseDb, DAILY_RESULTS),
          newDailyResults
        );

        setDailyResultsId(dailyResultsId);
        setDailyResults(newDailyResults);
      } else {
        const newAttemptedWords = [
          ...dailyResults.attemptedWords,
          {
            results: currentRoundResult,
            word: attemptedWord.toUpperCase(),
          },
        ];
        const newDailyResults = {
          ...dailyResults,
          attemptedWords: newAttemptedWords,
          attempts: currentRound + 1,
          endTime: currentTime,
          solveTime,
          status: newStatus,
        };

        await updateDoc(doc(dailyResultsRef, dailyResultsId), newDailyResults);

        setDailyResults(newDailyResults);
      }

      newRoundsResults.push(currentRoundResult);
      setKeyboardLetters(newKeyboardLetters);
      setRoundsResults(newRoundsResults);

      if (won || lost) {
        const totalAttemptsIndex = won ? currentRound : currentRound + 1;
        const newCurrentStreak = won ? currentStreak + 1 : 0;
        const newTotalAttempts = [...totalAttempts];
        newTotalAttempts[totalAttemptsIndex] = totalAttempts[totalAttemptsIndex] + 1;
        const newAttemptedWords = { ...attemptedWords };
        usersAttempts.forEach(attempt => {
          const word = attempt.join('');
          const currentValue = newAttemptedWords[word] ?? 0;
          newAttemptedWords[word] = currentValue + 1;
        });
        const todaysDisplayDate = getTodaysDisplayDate();

        const newStatistics = {
          totalGames: totalGames + 1,
          totalWins: won ? totalWins + 1 : totalWins,
          totalAttempts: newTotalAttempts,
          currentStreak: newCurrentStreak,
          longestStreak: newCurrentStreak > longestStreak ? newCurrentStreak : longestStreak,
          attemptedWords: newAttemptedWords,
          lastDatePlayed: todaysDisplayDate,
          longestStreakDate:
            newCurrentStreak >= longestStreak ? todaysDisplayDate : longestStreakDate,
          timeAverage: Math.round((timeAverage * totalGames + solveTime) / (totalGames + 1)),
          minTime: solveTime < minTime ? solveTime : minTime,
          maxTime: solveTime > maxTime ? solveTime : maxTime,
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
      dailyResults,
      dailyResultsId,
      keyboardLetters,
      letters,
      longestStreak,
      longestStreakDate,
      maxTime,
      minTime,
      name,
      photo,
      roundsResults,
      timeAverage,
      today,
      totalAttempts,
      totalGames,
      totalWins,
      uid,
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

    const isAcceptedWord = ACCEPTED_WORDS.includes(attemptedWord);
    const existsWord = wordExists(attemptedWord) || isAcceptedWord;
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
      if (gameEnded || wordProcessing) return;
      const isArrowLeft = key === ARROW_LEFT;
      const isArrowRight = key === ARROW_RIGHT;
      const isDelete = key === BACKSPACE;
      const isEnter = key === ENTER;

      if (key.length > 1 && !isDelete) {
        isEnter && onSubmitWord();
        isArrowLeft && focusBefore(letterIndex);
        isArrowRight && focusNext(letterIndex);
        return;
      }
      const isLetter = key.match(/[a-zA-Z]/g);

      if (isLetter || isDelete) {
        const newAttempt = [...usersAttempts];
        const wasEmpty = !newAttempt[currentRound][letterIndex];
        newAttempt[currentRound][letterIndex] = isDelete ? '' : key.toUpperCase();
        if (isDelete) {
          if (wasEmpty && letterIndex > 0) {
            focusBefore(letterIndex);
            newAttempt[currentRound][letterIndex - 1] = '';
          }
        } else {
          focusNext(letterIndex);
        }
        setUsersAttempts(newAttempt);
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
    const resultsRatio = `${
      gameStatus === GAME_STATUS.won ? roundsResults.length : 'X'
    }/${MAX_ATTEMPTS}`;
    let textResult = `RS Wordle ${resultsDate} ${resultsRatio} \n \n`;
    roundsResults.forEach(lineResult => {
      lineResult.forEach(result => {
        textResult += LETTER_STATUS[result].icon;
      });
      textResult += '\n';
    });
    textResult += `\nCurrent Streak: ${currentStreak} ${getCurrentStreakIcon(currentStreak)}\n`;
    textResult += `\n${WORDLE_URL}`;
    await navigator.clipboard.writeText(textResult);
    alert('Copied to Clipboard: \n \n' + textResult);
  };

  const customMessage = useMemo(() => {
    const todaysDate = today.slice(4);
    const { customMessage } = CUSTOM_CONFETTI_ANNUAL[todaysDate] || CUSTOM_CONFETTI[today] || {};
    return customMessage || '';
  }, [today]);

  const confettiExtraParams = useMemo(() => {
    const todaysDate = today.slice(4);
    return (
      CUSTOM_CONFETTI_ANNUAL[todaysDate]?.confettiExtraParams ||
      CUSTOM_CONFETTI[today]?.confettiExtraParams ||
      {}
    );
  }, [today]);

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
    confettiExtraParams,
    customMessage,
    won: gameStatus === GAME_STATUS.won,
  };
};

export default useUsersAttempts;
