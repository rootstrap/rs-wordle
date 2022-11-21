import KeyboardLetter from 'components/common/KeyboardLetter';
import { CHANGE_LINES_VALUES } from 'constants/constants';

import './styles.css';

const Keyboard = ({ keyboardLetters, onKeyPress, disabled }) => {
  const renderKeyboardLetter = ([letter, color]) => (
    <KeyboardLetter
      key={letter}
      value={letter}
      color={color}
      onKeyPress={() => onKeyPress({ key: letter })}
      disabled={disabled}
    />
  );

  return (
    <div className="keyboard">
      <div className="keyboard-row">
        {Object.entries(keyboardLetters).slice(0, CHANGE_LINES_VALUES[0]).map(renderKeyboardLetter)}
      </div>
      <div className="keyboard-row">
        {Object.entries(keyboardLetters)
          .slice(CHANGE_LINES_VALUES[0], CHANGE_LINES_VALUES[1])
          .map(renderKeyboardLetter)}
      </div>
      <div className="keyboard-row">
        {Object.entries(keyboardLetters)
          .slice(CHANGE_LINES_VALUES[1], keyboardLetters.length)
          .map(renderKeyboardLetter)}
      </div>
    </div>
  );
};

export default Keyboard;
