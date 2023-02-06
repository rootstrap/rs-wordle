import { useEffect, useMemo, useState } from 'react';

import { getTodaysWord } from 'firebase/words';
import { getTodaysDate } from 'utils/helpers';

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
        const { todaysWord } = await getTodaysWord(today);
        setWord(todaysWord);
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
