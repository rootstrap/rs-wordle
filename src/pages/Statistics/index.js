import { useLocation } from 'react-router-dom';

import HorizontalBarChart from 'components/HorizontalBarChart';
import StatBox from 'components/StatBox';
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

  return (
    <div className="statistics">
      <h1 className="section-title">{userName} Statistics</h1>
      <img src={profilePhoto} className="statistics-photo" alt={`user-${userName}`} />
      {!!Object.keys(statistics).length && (
        <>
          <div className="stat-box-container">
            <StatBox label="Played" value={totalGames} />
            <StatBox label="Wins" value={totalWins} />
            <StatBox
              label="Wins (%)"
              value={totalGames ? ((totalWins * 100) / totalGames).toFixed(0) : 0}
            />
            <StatBox label="Current Streak" value={currentStreak} />
            <StatBox label="Max Streak" value={longestStreak} />
          </div>
          <div className="statistics-charts-container">
            <HorizontalBarChart data={totalAttempts} maxValue={maxAttemptsRound} />
            <HorizontalBarChart data={topAttemptedWords} maxValue={maxAttemptedWords} words />
          </div>
        </>
      )}
    </div>
  );
};

export default Statistics;
