import { useLocation } from 'react-router-dom';

import HorizontalBarChart from 'components/HorizontalBarChart';
import StatBox from 'components/StatBox';
import useTranslation from 'hooks/useTranslation';
import useUserStatistics from 'hooks/useUsersStatistics';

import './styles.css';

const Statistics = () => {
  const location = useLocation();

  const {
    statistics,
    statistics: { totalGames, totalWins, totalAttempts, currentStreak, longestStreak },
    maxAttemptsRound,
    maxAttemptedWords,
    topAttemptedWords,
    profilePhoto,
    userName,
  } = useUserStatistics(location?.state ?? {});

  const t = useTranslation();

  const currentStreakLabel = t('statistics.currentStreak');
  const longestStreakLabel = t('statistics.longestStreak');
  const playedLabel = t('statistics.played');
  const topAttemptedWordsLabel = t('statistics.topAttemptedWordsLabel');
  const totalAttemptsLabel = t('statistics.totalAttemptsLabel');
  const winsLabel = t('statistics.wins');
  const winsPercentageLabel = t('statistics.winsPercentage');

  return (
    <div className="statistics-container">
      <h1 className="page-title">{`${userName} Statistics`}</h1>
      <img src={profilePhoto} className="statistics-photo" alt={`user-${userName}`} />
      {!!Object.keys(statistics).length && (
        <>
          <div className="stat-box-container">
            <StatBox label={playedLabel} value={totalGames} />
            <StatBox label={winsLabel} value={totalWins} />
            <StatBox
              label={winsPercentageLabel}
              value={totalGames ? ((totalWins * 100) / totalGames).toFixed(0) : 0}
            />
            <StatBox label={currentStreakLabel} value={currentStreak} />
            <StatBox label={longestStreakLabel} value={longestStreak} />
          </div>
          <div className="statistics-charts-container">
            <HorizontalBarChart
              data={totalAttempts}
              maxValue={maxAttemptsRound}
              title={totalAttemptsLabel}
            />
            <HorizontalBarChart
              data={topAttemptedWords}
              maxValue={maxAttemptedWords}
              title={topAttemptedWordsLabel}
              isWords
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Statistics;
