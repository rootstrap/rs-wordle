import { bool, func, object, string } from 'prop-types';
import cn from 'classnames';
import './styles.css';

const LetterInput = ({ value, style, isSelected, onClick, disabled }) => (
  <button
    onClick={onClick}
    className={cn('letter-input', { isSelected, disabled })}
    style={style}
    disabled={disabled}
  >
    {value}
  </button>
);

LetterInput.propTypes = {
  disabled: bool,
  isSelected: bool,
  onClick: func,
  style: object,
  value: string,
};

export default LetterInput;
