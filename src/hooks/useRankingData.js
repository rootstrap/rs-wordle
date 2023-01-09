import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';

import { GAME_STATUS, RANKING_VALUES } from 'constants/types';
import { DAILY_RESULTS, USERS, USERS_STATISTICS } from 'firebase/collections';
import firebaseData from 'firebase/firebase';
import { getTodaysDate } from 'utils/helpers';

import useAuth from './useAuth';

const { firebaseDb } = firebaseData;

const useRankingData = () => {
  const {
    user: { email: currentUser },
  } = useAuth();

  const { push } = useHistory();

  const [dailyResults, setDailyResults] = useState([]);
  const [rankingData, setRankingData] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedRanking, setSelectedRanking] = useState(RANKING_VALUES[0]);

  const today = getTodaysDate();

  useEffect(() => {
    (async function () {
      setLoading(true);
      const q = query(collection(firebaseDb, USERS));
      const docs = await getDocs(q);
      const results = {};
      docs.forEach(doc => {
        const user = doc.data();
        results[user.email] = user;
      });
      setUsers(results);
    })();
  }, []);

  useEffect(() => {
    (async function () {
      const q = query(
        collection(firebaseDb, DAILY_RESULTS),
        where('date', '==', today),
        where('status', '!=', GAME_STATUS.playing),
        orderBy('status', 'desc'),
        orderBy('attempts'),
        orderBy('solveTime'),
        orderBy('user.name')
      );
      const docs = await getDocs(q);

      const results = [];
      let position = 0;
      let currentAttempts = 0;
      let currentStatus = GAME_STATUS.won;
      let currentSolveTime = 0;
      docs.forEach(doc => {
        const { attempts, solveTime, status, ...restDailyResults } = doc.data();
        if (
          currentAttempts !== attempts ||
          solveTime !== currentSolveTime ||
          currentStatus !== status
        ) {
          currentAttempts = attempts;
          currentSolveTime = solveTime;
          currentStatus = status;
          position += 1;
        }
        results.push({
          attempts,
          solveTime,
          status,
          ...restDailyResults,
          position,
        });
      });
      setDailyResults(results);
    })();
  }, [today]);

  useEffect(() => {
    (async function () {
      const q = query(collection(firebaseDb, USERS_STATISTICS), orderBy('currentStreak', 'desc'));
      const docs = await getDocs(q);
      const results = [];
      let position = 0;
      let currentStreakValue = Number.MAX_SAFE_INTEGER;
      docs.forEach(async doc => {
        const { id: userEmail } = doc;
        const { currentStreak, lastDatePlayed, totalGames, ...restStatistics } = doc.data();
        if (!!totalGames) {
          if (currentStreak !== currentStreakValue) {
            currentStreakValue = currentStreak;
            position += 1;
          }
          results.push({
            ...restStatistics,
            currentStreak,
            lastDatePlayed,
            rightText: RANKING_VALUES[0].getRightText({ currentStreak, isFirst: position === 1 }),
            suffix: RANKING_VALUES[0].getSuffix({ lastDatePlayed }),
            totalGames,
            position,
            user: users[userEmail] || { email: userEmail, name: userEmail.split('@')[0] },
          });
        }
      });
      setRankingData(results);
      setLoading(false);
    })();
  }, [users]);

  const currentUserPlayed = useMemo(
    () => dailyResults.find(item => item.user.email === currentUser),
    [currentUser, dailyResults]
  );

  const goToUsersStatistics = ({ email, name, photo, uid }) =>
    push({
      pathname: `/statistics/${uid}`,
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

  return {
    currentUser,
    currentUserPlayed,
    rankingData,
    dailyResults,
    loading,
    selectedRanking,
    onChangeSelectedRanking,
    goToUsersStatistics,
  };
};

export default useRankingData;
