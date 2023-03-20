import { useMemo } from 'react';
import Confetti from 'react-confetti';

import LetterInput from 'components/common/LetterInput';
import Loading from 'components/common/Loading';
import { LETTER_STATUS } from 'constants/types';
import useTranslation from 'hooks/useTranslation';
import useUsersAttempts from 'hooks/useUsersAttempts';
import useWordDb from 'hooks/useWordDb';
import { useGetAttemptsQuery } from 'services/wordleAI';
import './styles.css';

const Home = () => {
  const { letters, word, loading, setLoading } = useWordDb();
  const { isLoading, isError, data } = useGetAttemptsQuery(word);
  const attempts = data ? data.attempts : [];
  //const attempts = [];
  const {
    currentRound,
    usersAttempts,
    roundsResults,
    gameEnded,
    gameStatus,
    error,
    letterIndex,
    wordProcessing,
    setLetterIndex,
    confettiExtraParams,
    customMessage,
    won,
  } = useUsersAttempts({
    wordLength: word.length,
    correctWord: word,
    letters,
    attempts: attempts,
    setLoading,
  });

  const t = useTranslation();
  const gameStatusMessage = useMemo(
    () => t('home.gameStatusMessage', { gameStatus: gameStatus.toUpperCase() }),
    [gameStatus, t]
  );
  const correctWordMessage = useMemo(() => t('home.correctWordMessage', { word }), [t, word]);

  // if (loading || isLoading) return <Loading />;

  // if (isError) {
  //   return <div>Error: there was an error</div>;
  // }

  console.log(usersAttempts);

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
                  console.log(roundsResults);
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
    </div>
  );
};

export default Home;
