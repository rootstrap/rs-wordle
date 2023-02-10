import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
// I prefer this library but generates out of memory errors in netlify
// import { initialize } from '@paunovic/random-words';
import randomWords from 'random-words';

import { ADMITTED_WORDS_SIZES } from 'constants/constants';
import { WORDS_COLLECTION } from 'firebase/collections';
import firebaseData from 'firebase/firebase';
import { getRandomInt } from 'utils/helpers';

const DEFAULT_WORDS = ['GENIE', 'GRACE', 'SPACE', 'CLASS', 'NOTICE', 'WORDS', 'DOGS', 'CATS'];

const { firebaseDb } = firebaseData;
const wordsRef = collection(firebaseDb, WORDS_COLLECTION);

export const getTodaysWord = async today => {
  try {
    const docRef = doc(firebaseDb, WORDS_COLLECTION, today);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { word: todaysWord } = docSnap.data();
      return { todaysWord };
    } else {
      let todaysWord = '';
      const wordsCollection = randomWords({ exactly: 7, maxLength: 6 });
      const correctSizeWords = await wordsCollection.filter(word =>
        ADMITTED_WORDS_SIZES.includes(word.length)
      );
      if (!!correctSizeWords.length) {
        const randomIndex = getRandomInt(correctSizeWords.length);
        todaysWord = correctSizeWords[randomIndex].toUpperCase();
      } else {
        const randomIndex = getRandomInt(DEFAULT_WORDS.length);
        todaysWord = DEFAULT_WORDS[randomIndex];
      }
      await setDoc(doc(wordsRef, today), { word: todaysWord });
      return { todaysWord };
    }
  } catch (err) {
    console.error(err);
    const randomIndex = getRandomInt(DEFAULT_WORDS.length);
    const todaysWord = DEFAULT_WORDS[randomIndex];
    return { todaysWord };
  }
};
