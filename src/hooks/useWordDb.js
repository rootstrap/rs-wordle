import { useEffect, useMemo, useState } from 'react';

import useErrorHandling from 'components/common/RSWordleErrorBoundary/useErrorHandling';
import { getTodaysWord } from 'firebase/words';
import { getTodaysDate } from 'utils/helpers';

const useWordDb = () => {
  const [word, setWord] = useState('');
  const [wordDate, setWordDate] = useState(null);
  const [loading, setLoading] = useState(true);

  const today = getTodaysDate();
  const { triggerError } = useErrorHandling();

  useEffect(() => {
    (async function () {
      if (wordDate !== today) {
        setLoading(true);
        setWordDate(today);
        const { todaysWord } = await getTodaysWord(today, triggerError);
        setWord(todaysWord);
      }
    })();
  }, [today, triggerError, wordDate]);

  const letters = useMemo(() => word?.split(''), [word]);

  return {
    letters,
    word,
    loading,
    setLoading,
  };
};

export default useWordDb;
