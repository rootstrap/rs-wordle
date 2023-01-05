import Loading from 'components/common/Loading';
import Tabs from 'components/common/Tabs';
import useRankingData from 'hooks/useRankingData';

import AllTime from './AllTime';
import Today from './Today';
import './styles.css';

const Ranking = () => {
  const {
    currentUser,
    currentUserPlayed,
    rankingData,
    dailyResults,
    loading,
    selectedRanking,
    onChangeSelectedRanking,
    goToUsersStatistics,
  } = useRankingData();

  const tabsConfig = [
    {
      label: `Today (${dailyResults.length})`,
      content: (
        <Today
          dailyResults={dailyResults}
          currentUser={currentUser}
          currentUserPlayed={currentUserPlayed}
        />
      ),
    },
    {
      label: `All Time (${rankingData.length})`,
      content: (
        <AllTime
          onChangeSelectedRanking={onChangeSelectedRanking}
          selectedRanking={selectedRanking}
          rankingData={rankingData}
          currentUser={currentUser}
          goToUsersStatistics={goToUsersStatistics}
        />
      ),
    },
  ];

  return (
    <div className="ranking">
      <h1 className="section-title">Ranking</h1>
      {loading ? <Loading /> : <Tabs tabsConfig={tabsConfig} />}
    </div>
  );
};

export default Ranking;
