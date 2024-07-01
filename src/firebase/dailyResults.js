import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

import { DAILY_RESULTS } from 'firebase/collections';
import firebaseData from 'firebase/firebase';

const { firebaseDb } = firebaseData;
const dailyResultsRef = collection(firebaseDb, DAILY_RESULTS);

export const addDailyResults = async (newDailyResults, triggerError) => {
  try {
    const { id: dailyResultsId } = await addDoc(
      collection(firebaseDb, DAILY_RESULTS),
      newDailyResults
    );
    return dailyResultsId;
  } catch (error) {
    console.error(error);
    triggerError({ error });
  }
};

export const getAllUsersDailyResults = async (currentUser, triggerError) => {
  try {
    const q = query(
      collection(firebaseDb, DAILY_RESULTS),
      where('user.email', '==', currentUser),
      orderBy('date')
    );
    const docs = await getDocs(q);
    return {
      docs,
    };
  } catch (error) {
    console.error(error);
    triggerError({ error });
    return { docs: [] };
  }
};

export const getDailyResults = async (currentUser, today, triggerError) => {
  try {
    const q = query(
      collection(firebaseDb, DAILY_RESULTS),
      where('user.email', '==', currentUser),
      where('date', '==', today)
    );
    const docs = await getDocs(q);
    return {
      docs,
    };
  } catch (error) {
    console.error(error);
    triggerError({ error });
    return { docs: [] };
  }
};

export const updateDailyResults = async (dailyResultsId, newDailyResults, triggerError) => {
  try {
    await updateDoc(doc(dailyResultsRef, dailyResultsId), newDailyResults);
  } catch (error) {
    triggerError({ error });
  }
};
