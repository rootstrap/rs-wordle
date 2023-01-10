import FullPageLoading from 'components/common/FullPageLoading';
import PageWrapper from 'components/common/PageWrapper';
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

  if (loading) return <FullPageLoading />;

  return (
    <PageWrapper title="Ranking">
      <div className="ranking-container">
        <Tabs tabsConfig={tabsConfig} />
      </div>
    </PageWrapper>
  );
};

export default Ranking;
