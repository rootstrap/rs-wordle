import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';

import { GAME_STATUS } from 'constants/types';
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
  const [expandedUser, setExpandedUser] = useState();
  const [currentStreakRankingData, setCurrentStreakRankingData] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(false);

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
        const { currentStreak, lastDatePlayed, totalGames } = doc.data();
        if (!!totalGames) {
          if (currentStreak !== currentStreakValue) {
            currentStreakValue = currentStreak;
            position += 1;
          }
          results.push({
            currentStreak,
            lastDatePlayed,
            position,
            user: users[userEmail] || { email: userEmail, name: userEmail.split('@')[0] },
          });
        }
      });
      setCurrentStreakRankingData(results);
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

  return {
    currentUser,
    currentUserPlayed,
    currentStreakRankingData,
    dailyResults,
    expandedUser,
    setExpandedUser,
    loading,
    goToUsersStatistics,
  };
};

export default useRankingData;
