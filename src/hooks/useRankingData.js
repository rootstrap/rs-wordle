import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';

import { GAME_STATUS } from 'constants/types';
import { DAILY_RESULTS } from 'firebase/collections';
import firebaseData from 'firebase/firebase';
import { getTodaysDate } from 'utils/helpers';

import useAuth from './useAuth';

const { firebaseDb } = firebaseData;

const useRankingData = () => {
  const {
    user: { email: currentUser },
  } = useAuth();

  const [dailyResults, setDailyResults] = useState([]);

  const today = getTodaysDate();

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

  return {
    currentUser,
    dailyResults,
  };
};

export default useRankingData;
