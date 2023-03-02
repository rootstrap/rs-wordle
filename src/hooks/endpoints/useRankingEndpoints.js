import { useState } from 'react';
import { useDispatch } from 'react-redux';

import useErrorHandling from 'components/common/RSWordleErrorBoundary/useErrorHandling';
import { getAllTimeRankingData, getTodaysResults } from 'firebase/ranking';
import { getUsers } from 'firebase/users';
import useGetRankingData from 'hooks/data/useGetRankingData';
import useConstructor from 'hooks/useConstructor';
import { setAllTimeRanking, setTodaysResults, setUsersObject } from 'state/actions/rankingActions';
import { getTodaysDate } from 'utils/helpers';

const useRankingEndpoints = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const { users } = useGetRankingData();
  const { triggerError } = useErrorHandling();

  const today = getTodaysDate();

  const fetchUsers = async () => {
    setLoading(true);
    const { users } = await getUsers({ isObject: true, triggerError });
    await dispatch(setUsersObject({ users }));
  };

  const fetchTodaysResults = async () => {
    const { todaysResults } = await getTodaysResults(today, triggerError);
    await dispatch(setTodaysResults({ todaysResults }));
    setLoading(false);
  };

  const fetchAllTimeRanking = async () => {
    const { allTimeRankingData } = await getAllTimeRankingData(users, triggerError);
    await dispatch(setAllTimeRanking({ allTimeRankingData }));
  };

  useConstructor(fetchUsers);
  useConstructor(fetchTodaysResults);
  useConstructor(fetchAllTimeRanking);

  return { loading };
};

export default useRankingEndpoints;
