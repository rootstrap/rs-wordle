import { useEffect, useMemo, useState } from 'react';

import { getTodaysDate } from 'utils/helpers';
import randomWords from 'random-words';
import { ADMITTED_WORDS_SIZES } from 'constants/constants';
import { getRandomInt } from 'utils/helpers';

const DEFAULT_WORDS = ['GENIE', 'GRACE', 'SPACE', 'CLASS', 'NOTICE', 'WORDS'];

export const getTodaysWord = async today => {
  try {
    let todaysWord = '';
    const wordsCollection = randomWords({ exactly: 5, maxLength: 5 });
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
    return { todaysWord };
  } catch (err) {
    console.error(err);
    const randomIndex = getRandomInt(DEFAULT_WORDS.length);
    const todaysWord = DEFAULT_WORDS[randomIndex];
    return { todaysWord };
  }
};

const useWordDb = playing => {
  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(true);

  const today = getTodaysDate();

  useEffect(() => {
    (async function () {
      setLoading(true);
      const { todaysWord } = await getTodaysWord(today);
      setWord(todaysWord);
    })();
  }, []);

  const letters = useMemo(() => word?.split(''), [word]);

  return {
    letters,
    word,
    loading,
    setLoading,
  };
};

export default useWordDb;
