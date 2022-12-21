import { useState, useEffect } from 'react';
import ReactFlipCard from 'reactjs-flip-card';

import { LETTER_STATUS } from 'constants/types';

import './styles.css';
import LetterInput from '../LetterInput';

const styles = {
  container: { height: '50px', width: '50px' },
  correct: { backgroundColor: LETTER_STATUS.correct },
  incorrect: { backgroundColor: LETTER_STATUS.incorrect },
  misplaced: { backgroundColor: LETTER_STATUS.misplaced },
};

const loadingWords = [
  {
    back: 'L',
    front: 'R',
    backStyle: styles.correct,
    frontStyle: styles.correct,
  },
  {
    back: 'O',
    front: 'S',
    backStyle: styles.incorrect,
    frontStyle: styles.correct,
  },
  {
    back: 'A',
    front: 'W',
    backStyle: styles.misplaced,
    frontStyle: styles.correct,
  },
  {
    back: 'D',
    front: 'O',
    backStyle: styles.correct,
    frontStyle: styles.correct,
  },
  {
    back: 'I',
    front: 'R',
    backStyle: styles.incorrect,
    frontStyle: styles.correct,
  },
  {
    back: 'N',
    front: 'D',
    backStyle: styles.misplaced,
    frontStyle: styles.correct,
  },
  {
    back: 'G',
    front: 'L',
    backStyle: styles.correct,
    frontStyle: styles.correct,
  },
  {
    back: '!',
    front: 'E',
    backStyle: styles.incorrect,
    frontStyle: styles.correct,
  },
];

const Loading = () => {
  const [flipped, setFlipped] = useState(Array(loadingWords.length).fill(false));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeoutRef, setTimeoutRef] = useState(null);

  useEffect(() => {
    if (!timeoutRef) {
      const newTimeoutRef = setTimeout(() => {
        const newFlipped = [...flipped];
        newFlipped[currentIndex] = !newFlipped[currentIndex];
        setFlipped(newFlipped);
        setCurrentIndex(prevValue => (prevValue < loadingWords.length - 1 ? prevValue + 1 : 0));
        setTimeoutRef(null);
      }, 100);
      setTimeoutRef(newTimeoutRef);
    }
    return () => clearTimeout(timeoutRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeoutRef]);

  return (
    <div className="loading-container">
      {loadingWords.map(({ front, back, frontStyle, backStyle }, index) => (
        <ReactFlipCard
          key={`${front}-${back}-${index}`}
          containerStyle={styles.container}
          flipTrigger="disabled"
          flipByProp={flipped[index]}
          frontComponent={<LetterInput value={front} disabled style={frontStyle} />}
          backComponent={<LetterInput value={back} disabled style={backStyle} />}
        />
      ))}
    </div>
  );
};

export default Loading;
