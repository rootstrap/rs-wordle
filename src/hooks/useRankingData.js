import { useEffect, useState } from 'react';
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

  const [dailyResults, setDailyResults] = useState([]);
  const [expandedUser, setExpandedUser] = useState();
  const [rankingData, setRankingData] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(false);
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
        where('formattedDate', '==', today),
        orderBy('attempts'),
        orderBy('status', 'desc'),
        orderBy('user.name')
      );
      const docs = await getDocs(q);
      const results = [];
      let position = 0;
      let currentAttempts = 0;
      let currentStatus = GAME_STATUS.won;
      docs.forEach(doc => {
        const { attemptedWords, attempts, formattedDate, status, user } = doc.data();
        if (currentAttempts !== attempts || currentStatus !== status) {
          currentAttempts = attempts;
          currentStatus = status;
          position += 1;
        }
        results.push({
          attemptedWords,
          attempts,
          formattedDate,
          position,
          status,
          user,
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
        const { currentStreak, totalGames, ...restStatistics } = doc.data();
        if (!!totalGames) {
          if (currentStreak !== currentStreakValue) {
            currentStreakValue = currentStreak;
            position += 1;
          }
          results.push({
            ...restStatistics,
            currentStreak,
            displayValue: currentStreak,
            position,
            user: users[userEmail] || { email: userEmail, name: userEmail.split('@')[0] },
          });
        }
      });
      setRankingData(results);
      setLoading(false);
    })();
  }, [users]);

  const currentUserPlayed = dailyResults.find(item => item.user.email === currentUser);

  const onChangeSelectedRanking = newValue => {
    if (newValue !== selectedRanking) {
      setSelectedRanking(newValue);
      var newRankingData = [...rankingData];
      let position = 0;
      let currentValue = Number.MAX_SAFE_INTEGER;
      newRankingData = newRankingData
        .sort((firstValue, secondValue) => {
          const firstDisplayValue = newValue.getDisplayValue(firstValue);
          const secondDisplayValue = newValue.getDisplayValue(secondValue);
          if (firstDisplayValue === secondDisplayValue) {
            if (firstValue.user.name < secondValue.user.name) return -1;
            return firstValue.user.name > secondValue.user.name ? 1 : 0;
          }
          return secondDisplayValue - firstDisplayValue;
        })
        .map(item => {
          const displayValue = newValue.getDisplayValue(item);
          if (displayValue !== currentValue) {
            currentValue = displayValue;
            position += 1;
          }
          return {
            ...item,
            displayValue,
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
    expandedUser,
    setExpandedUser,
    loading,
    selectedRanking,
    onChangeSelectedRanking,
  };
};

export default useRankingData;
