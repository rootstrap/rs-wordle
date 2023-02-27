import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RANKING_VALUES } from 'constants/types';
import { getAllTimeRankingData, getTodaysResults } from 'firebase/ranking';
import { getUsers } from 'firebase/users';
import { getTodaysDate } from 'utils/helpers';

import useAuth from './useAuth';

const useRankingData = () => {
  const {
    user: { email: currentUser },
  } = useAuth();

  const navigate = useNavigate();

  const [dailyResults, setDailyResults] = useState([]);
  const [rankingData, setRankingData] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedRanking, setSelectedRanking] = useState(RANKING_VALUES[0]);

  const today = getTodaysDate();

  useEffect(() => {
    (async function () {
      setLoading(true);
      const { users: usersResults } = await getUsers({ isObject: true });
      setUsers(usersResults);
    })();
  }, []);

  useEffect(() => {
    (async function () {
      const { todaysResults } = await getTodaysResults(today);
      setDailyResults(todaysResults);
    })();
  }, [today]);

  useEffect(() => {
    (async function () {
      const { allTimeRankingData } = await getAllTimeRankingData(users);
      setRankingData(allTimeRankingData);
      setLoading(false);
    })();
  }, [users]);

  const currentUserPlayed = useMemo(
    () => dailyResults.find(item => item.user.email === currentUser),
    [currentUser, dailyResults]
  );

  const goToUsersStatistics = ({ email, name, photo, uid }) =>
    navigate(`/statistics/${uid}`, {
      state: { email, name, photo },
    });

  const onChangeSelectedRanking = newSelectedRanking => {
    if (newSelectedRanking !== selectedRanking) {
      setSelectedRanking(newSelectedRanking);
      let newRankingData = [...rankingData];
      let position = 0;
      let currentValue = Number.MAX_SAFE_INTEGER;
      newRankingData = newRankingData
        .sort((firstValue, secondValue) => {
          const firstRightText = newSelectedRanking.getNumericValue(firstValue);
          const secondRightText = newSelectedRanking.getNumericValue(secondValue);
          if (firstRightText === secondRightText) {
            if (firstValue.user.name < secondValue.user.name) return -1;
            return firstValue.user.name > secondValue.user.name ? 1 : 0;
          }
          return newSelectedRanking.sort(firstRightText, secondRightText);
        })
        .map(item => {
          const numericValue = newSelectedRanking.getNumericValue(item);
          if (numericValue !== currentValue) {
            currentValue = numericValue;
            position += 1;
          }
          return {
            ...item,
            rightText: newSelectedRanking.getRightText({
              ...item,
              isFirst: position === 1,
            }),
            suffix: newSelectedRanking.getSuffix(item),
            position,
          };
        });

      setRankingData(newRankingData);
    }
  };

  const rankingDataLength = useMemo(() => rankingData.length, [rankingData.length]);
  const dailyResultsLength = useMemo(() => dailyResults.length, [dailyResults.length]);

  return {
    currentUser,
    currentUserPlayed,
    rankingData,
    rankingDataLength,
    dailyResults,
    dailyResultsLength,
    loading,
    selectedRanking,
    onChangeSelectedRanking,
    goToUsersStatistics,
  };
};

export default useRankingData;
