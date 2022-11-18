import { useForm } from 'react-hook-form';

import LetterInput from 'components/common/LetterInput';
import Keyboard from 'components/Keyboard';
import useUsersAttempts from 'hooks/useUsersAttempts';
import useWordDb from 'hooks/useWordDb';

import './styles.css';
import { LETTER_STATUS } from 'constants/types';

const Word = () => {
  const { letters, word, loading, setLoading } = useWordDb();
  const { handleSubmit } = useForm();

  const {
    currentRound,
    usersAttempts,
    roundsResults,
    setUsersAttempts,
    gameEnded,
    error,
    setError,
    onSubmitWord,
    keyboardLetters,
  } = useUsersAttempts({
    wordLength: letters.length,
    correctWord: word,
    letters,
    setLoading,
  });

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
    const isLetter = key.match(/[a-zA-Z]/g);

    if (isLetter || isDelete) {
      const newAttempt = [...usersAttempts];
      newAttempt[currentRound][fieldIndex] = isDelete ? '' : key;
      setUsersAttempts(newAttempt);
      isDelete ? focusBefore(fieldIndex) : focusNext(fieldIndex);
    }
  };

  const commonProps = {
    onKeyPress,
  };

  if (loading) {
    return (
      <div>
        <p>LOADING DATA...</p>
      </div>
    );
  }

  return (
    <div>
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
                  style={{
                    backgroundColor:
                      round !== currentRound || gameEnded
                        ? roundsResults[round][index]
                        : LETTER_STATUS.nothing,
                    fontWeight: 800,
                  }}
                />
              ))}
            </>
          </div>
        ))}
        {!!error && <p className="error-message">{error}</p>}
        <br />
        {!gameEnded && <input type="submit" />}
      </form>
      <Keyboard keyboardLetters={keyboardLetters} />
    </div>
  );
};

export default Word;
