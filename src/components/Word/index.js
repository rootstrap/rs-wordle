import { useForm } from 'react-hook-form';

import LetterInput from 'components/common/LetterInput';
import useUsersAttempts from 'hooks/useUsersAttempts';
import useWordDb from 'hooks/useWordDb';

import './styles.css';

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

  if (loading) {
    return (
      <div>
        <p>LOADING DATA...</p>
      </div>
    );
  }

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
