import { useEffect, useMemo, useState } from 'react';
import Confetti from 'react-confetti';

import Button from 'components/common/Button';
import LetterInput from 'components/common/LetterInput';
import Loading from 'components/common/Loading';
import { LETTER_STATUS, GAME_STATUS } from 'constants/types';
import useTranslation from 'hooks/useTranslation';
import useUsersAttempts from 'hooks/useUsersAttempts';
import useWordDb from 'hooks/useWordDb';
import { useGetAttemptsQuery } from 'services/wordleAI';
import './styles.css';

const Home = () => {
  const [playing, setPlaying] = useState(false);
  const [attempts, setAttempts] = useState([]);

  const { letters, word } = useWordDb(playing);
  const {
    isLoading,
    data,
    error: queryError,
  } = useGetAttemptsQuery(word, { skip: !playing || !word });

  useEffect(() => {
    if (playing && data && !queryError) {
      setAttempts(data.attempts);
    }
  }, [playing, data]);

  const {
    usersAttempts,
    roundsResults,
    gameEnded,
    gameStatus,
    error,
    wordProcessing,
    confettiExtraParams,
    customMessage,
    won,
  } = useUsersAttempts({
    wordLength: word.length,
    correctWord: word,
    letters,
    attempts: attempts,
    playing,
  });

  const t = useTranslation();
  const gameStatusMessage = useMemo(
    () => t('home.gameStatusMessage', { gameStatus: gameStatus.toUpperCase() }),
    [gameStatus, t]
  );
  const correctWordMessage = useMemo(() => t('home.correctWordMessage', { word }), [t, word]);

  if (playing && isLoading) return <Loading />;

  return (
    <div className="home-container">
      <div className="play-button">
        <Button handleClick={() => setPlaying(true)}>Play word</Button>
      </div>
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
                  const completedRow = gameEnded;
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
                      disabled={completedRow}
                      ariaLabel={letterStatus.ariaLabel(letter, t)}
                    />
                  );
                })}
              </>
              {/* handleClick={() => shareResults(false)} */}
            </div>
          );
        })}
      </div>
      {!!error && <p className="error-message">{error}</p>}
      {!!queryError && <p className="error-message">{queryError.data.error}</p>}
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
