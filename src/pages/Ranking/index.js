import { useMemo } from 'react';

import Loading from 'components/common/Loading';
import Tabs from 'components/common/Tabs';
import useRankingEndpoints from 'hooks/endpoints/useRankingEndpoints';
import useRankingData from 'hooks/useRankingData';
import useTranslation from 'hooks/useTranslation';

import AllTime from './AllTime';
import Today from './Today';
import './styles.css';

const Ranking = () => {
  const { loading } = useRankingEndpoints();
  const { rankingDataLength, dailyResultsLength } = useRankingData();

  const t = useTranslation();
  const allTimeLabel = useMemo(
    () => t('ranking.allTime', { total: rankingDataLength }),
    [rankingDataLength, t]
  );
  const todayLabel = useMemo(
    () => t('ranking.today', { total: dailyResultsLength }),
    [dailyResultsLength, t]
  );

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
