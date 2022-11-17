import { useEffect, useState } from 'react';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

import { WORDS_COLLECTION } from 'firebase/collections';
import firebaseData from 'firebase/firebase';

const useWordDb = () => {
  const [word, setWord] = useState('');
  const [wordDate, setWordDate] = useState(null);

  const today = new Date().toLocaleDateString().split('/').join('');
  const { firebaseDb } = firebaseData;
  const wordsRef = collection(firebaseDb, WORDS_COLLECTION);

  useEffect(() => {
    const getWord = async () => {
      if (wordDate !== today) {
        try {
          const docRef = doc(firebaseDb, WORDS_COLLECTION, today);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const { word: todaysWord } = docSnap.data();
            setWord(todaysWord);
          } else {
            await setDoc(doc(wordsRef, today), { word: 'GRACE' });
            setWord('GRACE');
          }
          setWordDate(today);
        } catch (err) {
          console.error(err);
          alert(err.message);
        }
      }
    };
    getWord();
  });

  return {
    word,
  };
};

export default useWordDb;
