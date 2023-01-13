import Loading from 'components/common/Loading';
import Tabs from 'components/common/Tabs';
import useRankingData from 'hooks/useRankingData';
import useTranslation from 'hooks/useTranslation';

import AllTime from './AllTime';
import Today from './Today';
import './styles.css';

const Ranking = () => {
  const { rankingData, dailyResults, loading } = useRankingData();

  const t = useTranslation();
  const allTimeLabel = t('ranking.allTime', { total: rankingData.length });
  const todayLabel = t('ranking.today', { total: dailyResults.length });

  const tabsConfig = [
    {
      label: todayLabel,
      content: <Today />,
    },
    {
      label: allTimeLabel,
      content: <AllTime />,
    },
  ];

  if (loading) return <Loading />;

  return (
    <div className="ranking-container">
      <Tabs tabsConfig={tabsConfig} />
    </div>
  );
};

export default Ranking;
