import { useSelector } from 'react-redux';

const useGetRankingData = () => {
  const { dailyResults, rankingData, users } = useSelector(
    ({ ranking: { dailyResults, rankingData, users } }) => ({
      dailyResults,
      rankingData,
      users,
    })
  );

  return {
    dailyResults,
    rankingData,
    users,
  };
};

export default useGetRankingData;
