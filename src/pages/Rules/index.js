import LetterInput from 'components/common/LetterInput';
import { ADMITTED_WORDS_SIZES, MAX_ATTEMPTS } from 'constants/constants';
import { LETTER_STATUS } from 'constants/types';
import useTranslation from 'hooks/useTranslation';

import './styles.css';
import { useMemo } from 'react';

const printLetterExplanation = (backgroundColor, text) => (
  <div>
    <LetterInput value="A" style={{ backgroundColor }} disabled />
    <span className="rules-letter-explanation">
      <span className="rules-letter-explanation-bold">A</span> {text}
    </span>
  </div>
);

const Rules = () => {
  const minLetters = ADMITTED_WORDS_SIZES[0];
  const maxLetters = ADMITTED_WORDS_SIZES[ADMITTED_WORDS_SIZES.length - 1];

  const t = useTranslation();
  const maxAttemptsMessage = useMemo(
    () => t('rules.maxAttemptsMessage', { maxAttempts: MAX_ATTEMPTS }),
    [t]
  );
  const lettersAmountMessage = useMemo(
    () => t('rules.lettersAmountMessage', { minLetters, maxLetters }),
    [maxLetters, minLetters, t]
  );
  const dailyWordMessage = t('rules.dailyWordMessage');
  const validWordMessage = t('rules.validWordMessage');
  const keyboardMessage = t('rules.keyboardMessage');
  const submitMessage = t('rules.submitMessage');
  const colorExplanation = t('rules.colorExplanation');
  const correctExplanation = t('rules.correctExplanation');
  const misplacedExplanation = t('rules.misplacedExplanation');
  const incorrectExplanation = t('rules.incorrectExplanation');
  const repeatedLettersMessage = t('rules.repeatedLettersMessage');

  return (
    <div className="rules-container">
      <ul className="rules-bullet">
        <li>{maxAttemptsMessage}</li>
        <li>{lettersAmountMessage}</li>
        <li>{dailyWordMessage}</li>
        <li>{validWordMessage}</li>
        <li>{keyboardMessage}</li>
        <li>{submitMessage}</li>
        <li>
          {colorExplanation}
          <div className="rules-letters-container">
            {printLetterExplanation(LETTER_STATUS.correct.color, correctExplanation)}
            {printLetterExplanation(LETTER_STATUS.misplaced.color, misplacedExplanation)}
            {printLetterExplanation(LETTER_STATUS.incorrect.color, incorrectExplanation)}
          </div>
        </li>
        <li>{repeatedLettersMessage}</li>
      </ul>
    </div>
  );
};

export default Rules;
