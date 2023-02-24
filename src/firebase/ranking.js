import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';

import { GAME_STATUS, RANKING_VALUES } from 'constants/types';
import { DAILY_RESULTS, USERS_STATISTICS } from 'firebase/collections';
import firebaseData from 'firebase/firebase';

const { firebaseDb } = firebaseData;

export const getTodaysResults = async today => {
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

  const todaysResults = [];
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
    todaysResults.push({
      attempts,
      solveTime,
      status,
      ...restDailyResults,
      position,
    });
  });

  return { todaysResults };
};

export const getAllTimeRankingData = async users => {
  const q = query(collection(firebaseDb, USERS_STATISTICS), orderBy('currentStreak', 'desc'));

  const docs = await getDocs(q);

  const allTimeRankingData = [];
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
      allTimeRankingData.push({
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

  return { allTimeRankingData };
};
