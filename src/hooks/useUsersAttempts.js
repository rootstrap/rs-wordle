import { useCallback, useEffect, useState, useMemo } from 'react';
import wordExists from 'word-exists';

import { IGNORE_KEYBOARD_COMPONENTS_IDS } from 'constants/componentsIds';
import { ACCEPTED_WORDS, KEYBOARD_LETTERS, MAX_ATTEMPTS, WORDLE_URL } from 'constants/constants';
import { CUSTOM_CONFETTI_ANNUAL, CUSTOM_CONFETTI } from 'constants/customConfetti';
import { ARROW_LEFT, ARROW_RIGHT, BACKSPACE, ENTER } from 'constants/keyboardKeys';
import { LETTER_STATUS, GAME_STATUS } from 'constants/types';
import { addDailyResults, getDailyResults, updateDailyResults } from 'firebase/dailyResults';
import useActiveElement from 'hooks/useActiveElement';
import useSlackApp from 'hooks/useSlackApp';
import useTranslation from 'hooks/useTranslation';
import {
  getCurrentStreakIcon,
  getTodaysDate,
  getTodaysDisplayDate,
  getTimeDiff,
} from 'utils/helpers';

import useAuth from './useAuth';
import useUserStatistics from './useUsersStatistics';

const useUsersAttempts = ({ wordLength, correctWord, letters, setLoading }) => {
  const {
    user: { email: currentUser, name, photo, uid },
  } = useAuth();

  const t = useTranslation();

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
  const focusedElement = useActiveElement();
  const { sendMessageToChannel } = useSlackApp();

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

  const analyzeData = useCallback(
    docs => {
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
    },
    [correctWord, keyboardLetters, wordLength]
  );

  const initializeData = useCallback(async () => {
    if (wordDate !== today && !!correctWord) {
      setWordDate(today);
      setUsersAttempts([Array(wordLength).fill('')]);
      setRoundsResults([Array(wordLength).fill('')]);
      const { docs, error } = await getDailyResults(currentUser, today);
      if (!error) {
        analyzeData(docs);
      }
      setLoading(false);
    }
  }, [analyzeData, correctWord, currentUser, setLoading, today, wordDate, wordLength]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const shareResults = useCallback(
    async (
      sendToSlack,
      {
        newGameStatus = gameStatus,
        newRoundsResults = roundsResults,
        newCurrentStreak = currentStreak,
      } = {}
    ) => {
      const resultsDate = getTodaysDisplayDate();
      const resultsRatio = `${
        newGameStatus === GAME_STATUS.won ? newRoundsResults.length : 'X'
      }/${MAX_ATTEMPTS}`;
      let textResult = `${t('global.pageTitle')} ${resultsDate} ${resultsRatio} \n \n`;
      newRoundsResults.forEach(lineResult => {
        lineResult.forEach(result => {
          textResult += LETTER_STATUS[result].icon;
        });
        textResult += '\n';
      });
      textResult += `\n${t('statistics.currentStreak')}: ${newCurrentStreak} ${getCurrentStreakIcon(
        newCurrentStreak
      )}\n`;
      textResult += `\n${process.env.REACT_APP_WORDLE_URL}`;

      if (sendToSlack) {
        await sendMessageToChannel(`${name}${t('home.slackResult')}${textResult}`);
      } else {
        await navigator.clipboard.writeText(textResult);
        alert(`${t('home.copiedToClipboard')}: \n \n` + textResult);
      }
    },
    [currentStreak, gameStatus, name, roundsResults, sendMessageToChannel, t]
  );

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

        const dailyResultsId = await addDailyResults(newDailyResults);

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

        await updateDailyResults(dailyResultsId, newDailyResults);

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
        shareResults(true, {
          newGameStatus: newStatus,
          newRoundsResults,
          newCurrentStreak,
        });
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
      shareResults,
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
    const attemptedWordUpperCase = attemptedWord.toUpperCase();

    if (attemptedWord.length !== wordLength) {
      const errorMessage = t('errors.lettersAmount', {
        attemptedWord: attemptedWordUpperCase,
        wordLength,
      });
      setError(errorMessage);
      setWordProcessing(false);
      return;
    }

    const alreadyAttemptedWord = usersAttempts.some(
      (word, wordIndex) =>
        wordIndex !== currentRound &&
        word.every((value, itemIndex) => value === currentAttempt[itemIndex])
    );

    if (alreadyAttemptedWord) {
      const errorMessage = t('errors.alreadyAttemptedWord', {
        attemptedWord: attemptedWordUpperCase,
      });
      setError(errorMessage);
      setWordProcessing(false);
      return;
    }

    const isAcceptedWord = ACCEPTED_WORDS.includes(attemptedWord);
    const isTodaysWords = attemptedWord === correctWord;
    const existsWord = isTodaysWords || isAcceptedWord || wordExists(attemptedWord);
    if (!existsWord) {
      const errorMessage = t('errors.doesntExist', {
        attemptedWord: attemptedWordUpperCase,
      });
      setError(errorMessage);
    } else {
      await compareWithWord(currentAttempt, attemptedWord);
    }
    setWordProcessing(false);
  }, [compareWithWord, correctWord, currentRound, t, usersAttempts, wordLength]);

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
      const isArrowLeft = key === ARROW_LEFT;
      const isArrowRight = key === ARROW_RIGHT;
      const isDelete = key === BACKSPACE;
      const isEnter = key === ENTER;

      const ignoreEnter = isEnter && IGNORE_KEYBOARD_COMPONENTS_IDS.includes(focusedElement?.id);

      if (gameEnded || wordProcessing || ignoreEnter) return;

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
    [
      currentRound,
      focusNext,
      focusedElement?.id,
      gameEnded,
      letterIndex,
      onSubmitWord,
      usersAttempts,
      wordProcessing,
    ]
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyPress);

    return () => {
      document.removeEventListener('keydown', onKeyPress);
    };
  }, [onKeyPress]);

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
