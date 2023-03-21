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
import Input from 'components/common/Input';

const Home = () => {
  const [playing, setPlaying] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const [goalWord, setGoalWord] = useState('');

  const { letters } = useWordDb(playing, goalWord, setGoalWord);
  const {
    isLoading,
    data,
    error: queryError,
  } = useGetAttemptsQuery(goalWord, { skip: !playing || !goalWord });

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
    wordLength: goalWord.length,
    correctWord: goalWord,
    letters,
    attempts: attempts,
    playing,
  });

  const t = useTranslation();

  const descriptionMessage = t('home.descriptionMessage');
  const gameInfoMessage = t('home.gameInfoMessage');
  const playMessage = t('home.playMessage');
  const resetMessage = t('home.resetMessage');
  const titleMessage = t('home.titleMessage');
  const gameStatusMessage = useMemo(
    () => t('home.gameStatusMessage', { gameStatus: gameStatus.toUpperCase() }),
    [gameStatus, t]
  );
  const correctWordMessage = useMemo(
    () => t('home.correctWordMessage', { word: goalWord.toUpperCase() }),
    [t, goalWord]
  );

  const resetState = () => {
    setPlaying(false);
    setGoalWord('');
    setAttempts([]);
  };

  if (playing && isLoading) return <Loading />;

  return (
    <div className="home-container">
      <div className="description">
        <h3>{titleMessage}</h3>
        <p>{descriptionMessage}</p>
        <p>{gameInfoMessage}</p>
      </div>
      <div className="play-button-container">
        <Input
          value={goalWord.toUpperCase()}
          handleOnChange={newValue => setGoalWord(newValue)}
          placeholder="Enter a 5-letter word"
          disabled={playing}
          maxLength={5}
        />
        {playing ? (
          <Button handleClick={() => resetState()}>{resetMessage}</Button>
        ) : (
          <Button handleClick={() => setPlaying(true)}>{playMessage}</Button>
        )}
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
