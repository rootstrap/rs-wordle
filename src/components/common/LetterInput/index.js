import { string, func, object } from 'prop-types';
import cn from 'classnames';
import './styles.css';

const LetterInput = ({ type = 'text', name, handleOnChange, error, onKeyPress, value, style }) => (
  <div className="Input">
    <input
      maxLength={1}
      className={cn({ error })}
      type={type}
      name={name}
      onChange={handleOnChange}
      onKeyDown={(...params) => onKeyPress(name, ...params)}
      value={value}
      style={style}
    />
  </div>
);

LetterInput.propTypes = {
  error: object,
  name: string,
  type: string,
  onKeyPress: func,
  value: string,
};

export default LetterInput;
