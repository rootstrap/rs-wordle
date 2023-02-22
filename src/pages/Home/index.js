import { useMemo } from 'react';
import Confetti from 'react-confetti';

import Button from 'components/common/Button';
import LetterInput from 'components/common/LetterInput';
import Loading from 'components/common/Loading';
import Keyboard from 'components/Keyboard';
import { LETTER_STATUS } from 'constants/types';
import useCurrentUser from 'hooks/useCurrentUser';
import useUsersAttempts from 'hooks/useUsersAttempts';
import useTranslation from 'hooks/useTranslation';

import useWordDb from 'hooks/useWordDb';

import './styles.css';

const Home = () => {
  const { letters, word, loading, setLoading } = useWordDb();

  const { bannedDays, bannedStartDate, isBanned, timeRemaining } = useCurrentUser();

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
    confettiExtraParams,
    customMessage,
    won,
  } = useUsersAttempts({
    wordLength: word.length,
    correctWord: word,
    letters,
    setLoading,
  });

  const t = useTranslation();
  const gameStatusMessage = useMemo(
    () => t('home.gameStatusMessage', { gameStatus: gameStatus.toUpperCase() }),
    [gameStatus, t]
  );
  const correctWordMessage = useMemo(() => t('home.correctWordMessage', { word }), [t, word]);
  const shareResultsMessage = t('home.shareResults');

  if (loading) return <Loading />;

  if (isBanned)
    return (
      <div className="word-container">
        <span>ups estoy banneado que pena</span>
        <span> y todavia me quedan {timeRemaining} dias</span>
      </div>
    );

  return (
    <div className="home-container">
      <div className="word-container">
        {usersAttempts.map((attempt, round) => {
          const attemptedWord = attempt.join('');
          const wordAriaLabel = attemptedWord || t('ariaLabels.empty');

          return (
            <div
              className="word"
              key={`word-attempt-${round}`}
              role="group"
              aria-label={wordAriaLabel}
              aria-roledescription={t('ariaLabels.word')}
            >
              <>
                {attempt.map((c, index) => {
                  const completedRow = round !== currentRound || gameEnded;
                  const letter = usersAttempts[round][index];
                  const letterStatus = completedRow
                    ? LETTER_STATUS[roundsResults[round][index]]
                    : LETTER_STATUS.nothing;

                  return (
                    <LetterInput
                      key={`${c}-${round}-${index}`}
                      value={letter}
                      style={{
                        backgroundColor: letterStatus.color,
                      }}
                      isSelected={index === letterIndex && round === currentRound}
                      onClick={() => setLetterIndex(index)}
                      disabled={completedRow}
                      ariaLabel={letterStatus.ariaLabel(letter, t)}
                    />
                  );
                })}
              </>
            </div>
          );
        })}
        {!!error && <p className="error-message">{error}</p>}
      </div>
      {wordProcessing && <Loading />}
      {gameEnded && (
        <>
          <p className="game-status">{gameStatusMessage}</p>
          <p className="game-status">{correctWordMessage} </p>
          <p className="game-status">{customMessage}</p>
          <div className="share-results-button">
            <Button handleClick={() => shareResults(false)}>{shareResultsMessage}</Button>
          </div>
          {won && (
            <Confetti
              recycle={false}
              numberOfPieces={1000}
              tweenDuration={7000}
              {...confettiExtraParams}
            />
          )}
        </>
      )}
      <Keyboard
        keyboardLetters={keyboardLetters}
        onKeyPress={onKeyPress}
        disabled={wordProcessing || gameEnded}
      />
    </div>
  );
};

export default Home;
