import LetterInput from 'components/common/LetterInput';
import { LETTER_STATUS } from 'constants/types';

import './styles.css';

const printLetterExplanation = (backgroundColor, text) => (
  <div>
    <LetterInput value="A" style={{ backgroundColor }} disabled />
    <span className="rules-letter-explanation">
      <span className="rules-letter-explanation-bold">A</span> {text}
    </span>
  </div>
);

const Rules = () => (
  <div className="rules">
    <h1 className="section-title">RULES</h1>
    <h3>Can you guess the word before other Rootstrappers do?</h3>
    <div className="rules-container">
      <ul className="rules-bullet">
        <li>Guess a word in 6 attempts or less</li>
        <li>The word could have between 4 and 6 letters</li>
        <li>
          Every day you will have a different word to guess and it will be the same for everyone
        </li>
        <li>Each guess must be a valid English word</li>
        <li>To write the word you can use either your keyboard or the virtual keyboard provided</li>
        <li>To submit the word use the Enter key (of either keyboard)</li>
        <li>
          The color of the letters will change to show you if the letter is or not in the word and
          in the correct position.
          <div className="rules-letters-container">
            {printLetterExplanation(
              LETTER_STATUS.correct,
              ' is in the word and in the correct position'
            )}
            {printLetterExplanation(
              LETTER_STATUS.misplaced,
              ' is in the word but in the wrong position'
            )}
            {printLetterExplanation(LETTER_STATUS.incorrect, ' is not in the word in any position')}
          </div>
        </li>
        <li>
          Take into account that the word could have repeated letters, meaning you could have the
          same letter in different positions both painted in their corresponding color
        </li>
      </ul>
    </div>
  </div>
);

export default Rules;
