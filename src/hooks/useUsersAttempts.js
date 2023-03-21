import { useCallback, useEffect, useState, useMemo } from 'react';
import wordExists from 'word-exists';

import { ACCEPTED_WORDS, MAX_ATTEMPTS } from 'constants/constants';
import { CUSTOM_CONFETTI_ANNUAL, CUSTOM_CONFETTI } from 'constants/customConfetti';
import { LETTER_STATUS, GAME_STATUS } from 'constants/types';
import useTranslation from 'hooks/useTranslation';
import { getTodaysDate } from 'utils/helpers';

const useUsersAttempts = ({ wordLength, correctWord, letters, attempts, playing, setLoading }) => {
  const t = useTranslation();

  const [letterIndex, setLetterIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [usersAttempts, setUsersAttempts] = useState([Array(wordLength).fill('')]);
  const [roundsResults, setRoundsResults] = useState([Array(wordLength).fill('')]);
  const [error, setError] = useState('');
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.playing);
  const [wordProcessing, setWordProcessing] = useState(false);

  const gameEnded = gameStatus !== GAME_STATUS.playing;

  const today = getTodaysDate();

  const analyzeData = attempts => {
    let roundCount = 0;
    let won = false;
    const newAttempts = [];
    const newRoundResults = [];
    attempts.forEach(word => {
      const wordAttempt = word.split('');
      const currentRoundResult = processWord(wordAttempt);
      newAttempts.push(wordAttempt);
      newRoundResults.push(currentRoundResult);
      won = word.toUpperCase() === correctWord.toUpperCase();
      if (!won) {
        roundCount++;
      }
    });
    setUsersAttempts(newAttempts);
    setRoundsResults(newRoundResults);
    setCurrentRound(roundCount);
    const lost = usersAttempts.length === MAX_ATTEMPTS;
    if (won || lost) {
      setGameStatus(won ? GAME_STATUS.won : GAME_STATUS.lost);
      setLetterIndex(-1);
    }
  };

  const initializeData = useCallback(async () => {
    if (playing && !!correctWord && !!attempts) {
      analyzeData(attempts);
    } else {
      const newAttempts = [Array(5).fill('')];
      setUsersAttempts(newAttempts);
    }
  }, [playing, correctWord, attempts]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const compareWithWord = currentAttempt => {
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

    const won = correctCount === wordLength;
    const lost = usersAttempts.length === MAX_ATTEMPTS && !won;
    const newStatus = won ? GAME_STATUS.won : lost ? GAME_STATUS.lost : GAME_STATUS.playing;
    if (won || lost) {
      setGameStatus(newStatus);
      setLetterIndex(-1);
    } else {
      setCurrentRound(currentRound + 1);
      setLetterIndex(0);
    }
    return currentRoundResult;
  };

  const processWord = currentAttempt => {
    var currentRoundResult = [];
    setWordProcessing(true);
    setError('');
    const attemptedWord = currentAttempt.join('');
    const attemptedWordUpperCase = attemptedWord.toUpperCase();

    if (attemptedWord.length !== wordLength) {
      const errorMessage = t('errors.lettersAmount', {
        attemptedWord: attemptedWordUpperCase,
        wordLength,
      });
      setError(errorMessage);
      setWordProcessing(false);
      return [];
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
      currentRoundResult = compareWithWord(currentAttempt);
    }
    setWordProcessing(false);
    return currentRoundResult;
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
    letterIndex,
    setLetterIndex,
    wordProcessing,
    confettiExtraParams,
    customMessage,
    won: gameStatus === GAME_STATUS.won,
  };
};

export default useUsersAttempts;
