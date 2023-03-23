import './styles.css';
import Confetti from 'react-confetti';
import Button from 'components/common/Button';
import GithubIconAnchor from 'components/GithubIconAnchor';
import Input from 'components/common/Input';
import LetterInput from 'components/common/LetterInput';
import Loading from 'components/common/Loading';
import useTranslation from 'hooks/useTranslation';
import useUsersAttempts from 'hooks/useUsersAttempts';
import { useEffect, useMemo, useState } from 'react';
import { LETTER_STATUS } from 'constants/types';
import { useGetAttemptsQuery, useGetWordQuery } from 'services/wordleAI';

const Home = () => {
  const [playing, setPlaying] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const [goalWord, setGoalWord] = useState('');
  const [wordCache, setWordCache] = useState('');
  const githubRepoId = process.env.REACT_APP_RS_REPO_ID;

  const {
    isLoading: wordLoading,
    data: wordData,
    error: wordError,
  } = useGetWordQuery({}, { skip: !playing || goalWord, refetchOnMountOrArgChange: true });

  const {
    isLoading,
    data,
    error: queryError,
  } = useGetAttemptsQuery(goalWord, { skip: !playing || !goalWord });

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
    wordLength: goalWord?.length,
    correctWord: goalWord,
    letters: goalWord?.split(''),
    attempts: attempts,
    playing,
  });

  useEffect(() => {
    if (playing) {
      if (!goalWord && wordData && wordData.word !== wordCache) {
        setGoalWord(wordData.word);
        setWordCache('');
      }
      if (data) {
        setAttempts(data.attempts);
      }
    }
  }, [playing, goalWord, data, wordData, wordCache]);

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
    setWordCache(goalWord);
    setPlaying(false);
    setGoalWord('');
    setAttempts([]);
  };

  if (playing && (wordLoading || isLoading)) return <Loading />;

  return (
    <div className="home-container">
      <div className="repo-icons">
        <GithubIconAnchor repoId={githubRepoId} />
      </div>
      <div className="description">
        <h3>{titleMessage}</h3>
        <p>{descriptionMessage}</p>
        <p>{gameInfoMessage}</p>
      </div>
      <div className="play-button-container">
        <Input
          value={goalWord}
          handleOnChange={newValue => setGoalWord(newValue.toUpperCase())}
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
      {!!wordError && <p className="error-message">{wordError.error}</p>}
      {!!queryError && !!queryError.error && <p className="error-message">{queryError.error}</p>}
      {!!queryError && !!queryError.data && (
        <p className="error-message">{queryError.data.error}</p>
      )}
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
