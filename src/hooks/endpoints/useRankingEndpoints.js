import { useState } from 'react';
import { useDispatch } from 'react-redux';

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

  const today = getTodaysDate();

  const fetchUsers = async () => {
    setLoading(true);
    const { users } = await getUsers({ isObject: true });
    await dispatch(setUsersObject({ users }));
  };

  const fetchTodaysResults = async () => {
    const { todaysResults } = await getTodaysResults(today);
    await dispatch(setTodaysResults({ todaysResults }));
    setLoading(false);
  };

  const fetchAllTimeRanking = async () => {
    const { allTimeRankingData } = await getAllTimeRankingData(users);
    await dispatch(setAllTimeRanking({ allTimeRankingData }));
  };

  useConstructor(fetchUsers);
  useConstructor(fetchTodaysResults);
  useConstructor(fetchAllTimeRanking);

  return { loading };
};

export default useRankingEndpoints;
