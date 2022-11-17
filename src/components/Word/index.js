import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import wordExists from 'word-exists';

import LetterInput from 'components/common/LetterInput';
import useWordDb from 'hooks/useWordDb';

import './styles.css';

const STATUS = {
  correct: 'green',
  misplaced: 'yellow',
  incorrect: 'grey',
};

const GAME_STATUS = {
  lose: 'lose',
  playing: 'playing',
  won: 'won',
};

const Word = (/* { word = '' } */) => {
  const { word } = useWordDb();
  console.log('word: ', word);
  const { handleSubmit } = useForm();

  const letters = useMemo(() => word?.split(''), [word]);
  const [currentRound, setCurrentRound] = useState(0);
  const [usersAttempts, setUsersAttempts] = useState([Array(letters.length).fill('')]);
  const [roundsResults, setRoundsResults] = useState([]);
  const [error, setError] = useState('');
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.playing);

  const gameEnded = gameStatus !== GAME_STATUS.playing;

  useEffect(() => {
    setUsersAttempts([Array(letters.length).fill('')]);
  }, [letters]);

  const focusBefore = fieldIndex => {
    let fieldIntIndex = parseInt(fieldIndex, 10);

    if (fieldIntIndex > 0) {
      const nextfield = document.querySelector(
        `input[name=letter${currentRound}-${fieldIntIndex - 1}]`
      );
      if (nextfield !== null) {
        nextfield.focus();
      }
    }
  };

  const focusNext = fieldIndex => {
    let fieldIntIndex = parseInt(fieldIndex, 10);

    if (fieldIntIndex < letters.length) {
      const nextfield = document.querySelector(
        `input[name=letter${currentRound}-${fieldIntIndex + 1}]`
      );
      if (nextfield !== null) {
        nextfield.focus();
      }
    }
  };

  const onKeyPress = (name, { key }) => {
    setError('');
    const isDelete = key === 'Backspace';

    if (key.length > 1 && !isDelete) {
      return;
    }
    const [_, fieldIndex] = name.split('-');
    const currentValue = usersAttempts[currentRound][fieldIndex];
    const isLetter = key.match(/[a-zA-Z]/g);

    if ((!!currentValue && isLetter) || isDelete) {
      const newAttempt = [...usersAttempts];
      newAttempt[currentRound][fieldIndex] = isDelete ? '' : key;
      setUsersAttempts(newAttempt);
      isDelete ? focusBefore(fieldIndex) : focusNext(fieldIndex);
    }
  };

  const handleOnChange = ({ target: { value, name } }) => {
    const [_, fieldIndex] = name.split('-');

    if (!!value) {
      const isLetter = value.match(/[a-zA-Z]/g);
      if (isLetter) {
        const newAttempt = [...usersAttempts];
        newAttempt[currentRound][fieldIndex] = value;
        setUsersAttempts(newAttempt);
        focusNext(fieldIndex);
      }
    }
  };

  const commonProps = {
    handleOnChange,
    onKeyPress,
  };

  const compareWithWord = currentAttempt => {
    const newRoundsResults = [...roundsResults];
    const currentRoundResult = [];
    let correctCount = 0;
    currentAttempt.forEach((letter, index) => {
      const indexes = [];
      for (let i = 0; i < letters.length; i++) {
        if (letters[i].toUpperCase() === letter.toUpperCase()) {
          indexes.push(i);
        }
      }

      if (indexes.includes(index)) {
        currentRoundResult.push(STATUS.correct);
        correctCount++;
      } else if (indexes.length > 0) {
        currentRoundResult.push(STATUS.misplaced);
      } else {
        currentRoundResult.push(STATUS.incorrect);
      }
    });

    newRoundsResults.push(currentRoundResult);

    setRoundsResults(newRoundsResults);
    if (correctCount === word.length) {
      setGameStatus(GAME_STATUS.won);
    } else {
      const attempts = [...usersAttempts];
      attempts.push(Array(letters.length).fill(''));
      setCurrentRound(currentRound + 1);
      setUsersAttempts(attempts);
    }
  };

  const onSubmitWord = () => {
    setError('');
    const currentAttempt = usersAttempts[currentRound];
    const attemptedWord = currentAttempt.join('');
    if (attemptedWord.length !== word.length) return;
    const existsWord = wordExists(attemptedWord);
    if (!existsWord) {
      setError(`${attemptedWord.toUpperCase()} doesn't exist in English`);
    } else {
      compareWithWord(currentAttempt);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitWord)}>
      {usersAttempts.map((attempt, round) => (
        <div className="word" key={`word-attempt-${round}`}>
          <>
            {attempt.map((c, index) => (
              <LetterInput
                key={`${c}-${round}-${index}`}
                {...commonProps}
                name={`letter${round}-${index}`}
                value={usersAttempts[round][index]}
                style={
                  round !== currentRound || gameEnded
                    ? {
                        backgroundColor: roundsResults[round][index],
                        fontWeight: 800,
                      }
                    : { fontWeight: 800 }
                }
              />
            ))}
          </>
        </div>
      ))}

      {!!error && <p className="error-message">{error}</p>}
      <br />
      {!gameEnded && <input type="submit" style={{ marginBottom: 200 }} />}
    </form>
  );
};

export default Word;
