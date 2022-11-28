import StatBox from 'components/StatBox';
import useUserStatistics from 'hooks/useUsersStatistics';

import './styles.css';

const Statistics = () => {
  const {
    statistics: {
      totalGames,
      totalWins,
      totalAttempts,
      currentStreak,
      longestStreak,
      // attemptedWords, // TODO: show common words used as attempts
    },
    maxAttemptsRound,
  } = useUserStatistics();

  return (
    <div className="statistics">
      <h1 className="section-title">Statistics</h1>
      <div className="stat-box-container">
        <StatBox label="Played" value={totalGames} />
        <StatBox label="Wins" value={totalWins} />
        <StatBox label="Wins (%)" value={totalGames ? (totalWins * 100) / totalGames : 0} />
        <StatBox label="Current Streak" value={currentStreak} />
        <StatBox label="Max Streak" value={longestStreak} />
      </div>
      <div className="statistics-round-container">
        <h2 className="statistics-round-attempts-title">Guess Distribution</h2>
        {totalAttempts.map((roundAttempts, index) => {
          const widthPercentage = (roundAttempts * 100) / maxAttemptsRound ?? 10;

          return (
            <div className="statistics-round-attempts">
              <span className="font-frijole statistics-round">{index + 1}</span>
              <span
                className="font-caveat-brush statistics-round-value"
                style={{ width: !!widthPercentage ? `${widthPercentage}%` : 'auto' }}
              >
                {roundAttempts}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Statistics;
