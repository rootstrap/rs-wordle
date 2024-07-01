import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { RANKING_VALUES } from 'constants/types';
import { setAllTimeRanking } from 'state/actions/rankingActions';

import useAuth from './useAuth';
import useGetRankingData from './data/useGetRankingData';

const useRankingData = () => {
  const {
    user: { email: currentUser },
  } = useAuth();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { dailyResults, rankingData } = useGetRankingData();

  const [selectedRanking, setSelectedRanking] = useState(RANKING_VALUES[0]);

  const currentUserPlayed = useMemo(
    () => dailyResults.find(item => item.user.email === currentUser),
    [currentUser, dailyResults]
  );

  const goToUsersStatistics = ({ email, name, photo, uid }) =>
    navigate(`/statistics/${uid}`, {
      state: { email, name, photo },
    });

  const onChangeSelectedRanking = async newSelectedRanking => {
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

      await dispatch(setAllTimeRanking({ allTimeRankingData: newRankingData }));
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
    selectedRanking,
    onChangeSelectedRanking,
    goToUsersStatistics,
  };
};

export default useRankingData;
