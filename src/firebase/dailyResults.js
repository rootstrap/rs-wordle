import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';

import { DAILY_RESULTS } from 'firebase/collections';
import firebaseData from 'firebase/firebase';

const { firebaseDb } = firebaseData;
const dailyResultsRef = collection(firebaseDb, DAILY_RESULTS);

export const addDailyResults = async newDailyResults => {
  const { id: dailyResultsId } = await addDoc(
    collection(firebaseDb, DAILY_RESULTS),
    newDailyResults
  );
  return dailyResultsId;
};

export const getDailyResults = async (currentUser, today) => {
  try {
    const q = query(
      collection(firebaseDb, DAILY_RESULTS),
      where('user.email', '==', currentUser),
      where('date', '==', today)
    );
    const docs = await getDocs(q);
    return {
      docs,
      error: false,
    };
  } catch (err) {
    console.error(err);
    return {
      error: true,
    };
  }
};

export const updateDailyResults = async (dailyResultsId, newDailyResults) => {
  await updateDoc(doc(dailyResultsRef, dailyResultsId), newDailyResults);
};
