import cn from 'classnames';

import { ENTER, BACKSPACE } from 'constants/keyboardKeys';

import './styles.css';

const KeyboardLetter = ({ value, color, onKeyPress, disabled, ariaLabel }) => {
  const isSmall = value !== ENTER && value !== BACKSPACE;

  return (
    <button
      className={cn('keyboard-letter', { isSmall, disabled })}
      style={{ backgroundColor: color }}
      onClick={onKeyPress}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {value}
    </button>
  );
};

KeyboardLetter.propTypes = {};

export default KeyboardLetter;
