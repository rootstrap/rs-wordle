import KeyboardLetter from 'components/common/KeyboardLetter';
import { CHANGE_LINES_VALUES } from 'constants/constants';

import './styles.css';

const Keyboard = ({ keyboardLetters, onKeyPress, disabled }) => {
  return (
    <div className="keyboard">
      <div className="keyboard-row">
        {Object.entries(keyboardLetters)
          .slice(0, CHANGE_LINES_VALUES[0])
          .map(([letter, color]) => {
            const handleOnKeyPress = () => {
              onKeyPress({ key: letter });
            };
            return (
              <KeyboardLetter
                key={letter}
                value={letter}
                color={color}
                onKeyPress={handleOnKeyPress}
                disabled={disabled}
              />
            );
          })}
      </div>
      <div className="keyboard-row">
        {Object.entries(keyboardLetters)
          .slice(CHANGE_LINES_VALUES[0], CHANGE_LINES_VALUES[1])
          .map(([letter, color]) => {
            const handleOnKeyPress = () => {
              onKeyPress({ key: letter });
            };
            return (
              <KeyboardLetter
                key={letter}
                value={letter}
                color={color}
                onKeyPress={handleOnKeyPress}
                disabled={disabled}
              />
            );
          })}
      </div>
      <div className="keyboard-row">
        {Object.entries(keyboardLetters)
          .slice(CHANGE_LINES_VALUES[1], keyboardLetters.length)
          .map(([letter, color]) => (
            <KeyboardLetter
              key={letter}
              value={letter}
              color={color}
              onKeyPress={() => onKeyPress({ key: letter })}
              disabled={disabled}
            />
          ))}
      </div>
    </div>
  );
};

export default Keyboard;
