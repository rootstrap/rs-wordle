import LetterInput from 'components/common/LetterInput';
import Keyboard from 'components/Keyboard';
import useUsersAttempts from 'hooks/useUsersAttempts';
import useWordDb from 'hooks/useWordDb';

import './styles.css';
import { LETTER_STATUS } from 'constants/types';

const Word = () => {
  const { letters, word, loading, setLoading } = useWordDb();

  const {
    currentRound,
    usersAttempts,
    roundsResults,
    gameEnded,
    error,
    keyboardLetters,
    letterIndex,
    onKeyPress,
  } = useUsersAttempts({
    wordLength: letters.length,
    correctWord: word,
    letters,
    setLoading,
  });

  if (loading) {
    return (
      <div>
        <p style={{ color: 'white', paddingTop: 20 }}>LOADING DATA...</p>
      </div>
    );
  }

  return (
    <div className="word-container">
      <div>
        {usersAttempts.map((attempt, round) => (
          <div className="word" key={`word-attempt-${round}`}>
            <>
              {attempt.map((c, index) => (
                <LetterInput
                  key={`${c}-${round}-${index}`}
                  value={usersAttempts[round][index]}
                  style={{
                    backgroundColor:
                      round !== currentRound || gameEnded
                        ? roundsResults[round][index]
                        : LETTER_STATUS.nothing,
                  }}
                  isSelected={index === letterIndex && round === currentRound}
                />
              ))}
            </>
          </div>
        ))}
        {!!error && <p className="error-message">{error}</p>}
      </div>
      <br />
      <Keyboard keyboardLetters={keyboardLetters} onKeyPress={onKeyPress} />
    </div>
  );
};

export default Word;
