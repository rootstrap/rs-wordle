import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';

import { GAME_STATUS, RANKING_VALUES } from 'constants/types';
import { DAILY_RESULTS, USERS_STATISTICS } from 'firebase/collections';
import { USERS_STATISTICS_FIELDS } from 'firebase/fields';
import firebaseData from 'firebase/firebase';

const { firebaseDb } = firebaseData;
const {
  date: dateField,
  status: statusField,
  attempts: attemptsField,
  solveTime: solveTimeField,
  username: usernameField,
} = USERS_STATISTICS_FIELDS;

export const getTodaysResults = async (today, triggerError) => {
  const todaysResults = [];

  try {
    const q = query(
      collection(firebaseDb, DAILY_RESULTS),
      where(dateField, '==', today),
      where(statusField, '!=', GAME_STATUS.playing),
      orderBy(statusField, 'desc'),
      orderBy(attemptsField),
      orderBy(solveTimeField),
      orderBy(usernameField)
    );
    const docs = await getDocs(q);

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
  } catch (error) {
    console.error(error);
    triggerError({ error });
  }
  return { todaysResults };
};

export const getAllTimeRankingData = async (users, triggerError) => {
  const allTimeRankingData = [];
  try {
    const q = query(collection(firebaseDb, USERS_STATISTICS), orderBy('currentStreak', 'desc'));
    const docs = await getDocs(q);

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
  } catch (error) {
    console.error(error);
    triggerError({ error });
  }

  return { allTimeRankingData };
};
