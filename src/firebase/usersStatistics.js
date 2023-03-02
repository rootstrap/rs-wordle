import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import { MAX_ATTEMPTS } from 'constants/constants';
import { USERS_STATISTICS } from 'firebase/collections';
import firebaseData from 'firebase/firebase';

const { firebaseDb } = firebaseData;
const statisticsRef = collection(firebaseDb, USERS_STATISTICS);

export const getUsersStatistics = async (selectedUser, triggerError) => {
  let currentStatistics = {
    totalGames: 0,
    totalWins: 0,
    totalAttempts: Array(MAX_ATTEMPTS + 1).fill(0),
    currentStreak: 0,
    lastDatePlayed: '',
    longestStreak: 0,
    longestStreakDate: '',
    attemptedWords: {},
    timeAverage: 0,
    minTime: 0,
    maxTime: 0,
  };
  try {
    const docRef = doc(firebaseDb, USERS_STATISTICS, selectedUser);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      currentStatistics = docSnap.data();
    } else {
      await setDoc(doc(statisticsRef, selectedUser), currentStatistics);
    }
  } catch (error) {
    console.error(error);
    triggerError({ error });
  }
  return { currentStatistics };
};

export const updateUsersStatistics = (newStatistics, selectedUser, triggerError) => {
  try {
    updateDoc(doc(statisticsRef, selectedUser), newStatistics);
  } catch (error) {
    console.error(error);
    triggerError({ error });
  }
};
