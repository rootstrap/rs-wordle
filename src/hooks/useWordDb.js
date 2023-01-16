import { useEffect, useMemo, useState } from 'react';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
// I prefer this library but generates out of memory errors in netlify
// import { initialize } from '@paunovic/random-words';
import randomWords from 'random-words';

import { ADMITTED_WORDS_SIZES } from 'constants/constants';
import { WORDS_COLLECTION } from 'firebase/collections';
import firebaseData from 'firebase/firebase';
import { getRandomInt, getTodaysDate } from 'utils/helpers';

const DEFAULT_WORDS = ['GENIE', 'GRACE', 'SPACE', 'CLASS', 'NOTICE', 'WORDS', 'DOGS', 'CATS'];

const { firebaseDb } = firebaseData;
const wordsRef = collection(firebaseDb, WORDS_COLLECTION);

const useWordDb = () => {
  const [word, setWord] = useState('');
  const [wordDate, setWordDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = getTodaysDate();

  useEffect(() => {
    (async function () {
      if (wordDate !== today) {
        setLoading(true);
        setWordDate(today);
        try {
          const docRef = doc(firebaseDb, WORDS_COLLECTION, today);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const { word: todaysWord } = docSnap.data();
            setWord(todaysWord);
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
            setWord(todaysWord);
          }
        } catch (err) {
          console.error(err);
          const randomIndex = getRandomInt(DEFAULT_WORDS.length);
          const todaysWord = DEFAULT_WORDS[randomIndex];
          setWord(todaysWord);
        }
      }
    })();
  }, [today, wordDate]);

  const letters = useMemo(() => word?.split(''), [word]);

  return {
    letters,
    word,
    loading,
    setLoading,
  };
};

export default useWordDb;
