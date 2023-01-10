import Loading from 'components/common/Loading';
import Tabs from 'components/common/Tabs';
import useRankingData from 'hooks/useRankingData';

import AllTime from './AllTime';
import Today from './Today';
import './styles.css';

const Ranking = () => {
  const { rankingData, dailyResults, loading } = useRankingData();

  const tabsConfig = [
    {
      label: `Today (${dailyResults.length})`,
      content: <Today />,
    },
    {
      label: `All Time (${rankingData.length})`,
      content: <AllTime />,
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
