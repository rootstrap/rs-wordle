import Button from 'components/common/Button';
import LetterInput from 'components/common/LetterInput';
import Keyboard from 'components/Keyboard';
import { LETTER_STATUS } from 'constants/types';
import useUsersAttempts from 'hooks/useUsersAttempts';
import useWordDb from 'hooks/useWordDb';

import './styles.css';

const Word = () => {
  const { letters, word, loading, setLoading } = useWordDb();

  const {
    currentRound,
    usersAttempts,
    roundsResults,
    gameEnded,
    gameStatus,
    error,
    keyboardLetters,
    letterIndex,
    onKeyPress,
    wordProcessing,
    setLetterIndex,
    shareResults,
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
                  onClick={() => setLetterIndex(index)}
                  disabled={round !== currentRound || gameEnded}
                />
              ))}
            </>
          </div>
        ))}
        {!!error && <p className="error-message">{error}</p>}
      </div>
      {gameEnded && <p className="game-status">You {gameStatus.toUpperCase()}</p>}
      <div className="share-results-button">
        <Button handleClick={shareResults}>Share Results</Button>
      </div>
      <Keyboard
        keyboardLetters={keyboardLetters}
        onKeyPress={onKeyPress}
        disabled={wordProcessing || gameEnded}
      />
    </div>
  );
};

export default Word;
