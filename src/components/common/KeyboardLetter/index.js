import cn from 'classnames';

import './styles.css';

const KeyboardLetter = ({ value, color, onKeyPress }) => {
  const isSmall = value !== 'Enter' && value !== 'Backspace';

  return (
    <button className={cn({ isSmall })} style={{ backgroundColor: color }} onClick={onKeyPress}>
      {value}
    </button>
  );
};

KeyboardLetter.propTypes = {};

export default KeyboardLetter;
