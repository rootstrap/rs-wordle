import KeyboardLetter from 'components/common/KeyboardLetter';
import { CHANGE_LINES_VALUES } from 'constants/constants';

import './styles.css';

const Keyboard = ({ keyboardLetters }) => {
  return (
    <div className="keyboard">
      <div className="keyboard-row">
        {Object.entries(keyboardLetters)
          .slice(0, CHANGE_LINES_VALUES[0])
          .map(([letter, color]) => (
            <KeyboardLetter key={letter} value={letter} color={color} />
          ))}
      </div>
      <div className="keyboard-row">
        {Object.entries(keyboardLetters)
          .slice(CHANGE_LINES_VALUES[0], CHANGE_LINES_VALUES[1])
          .map(([letter, color]) => (
            <KeyboardLetter key={letter} value={letter} color={color} />
          ))}
      </div>
      <div className="keyboard-row">
        {Object.entries(keyboardLetters)
          .slice(CHANGE_LINES_VALUES[1], keyboardLetters.length)
          .map(([letter, color]) => (
            <KeyboardLetter key={letter} value={letter} color={color} />
          ))}
      </div>
    </div>
  );
};

export default Keyboard;
