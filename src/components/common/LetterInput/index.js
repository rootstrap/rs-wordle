import { string, func, object } from 'prop-types';
import cn from 'classnames';
import './styles.css';

const LetterInput = ({ value, style, isSelected }) => (
  <div className="Input">
    <p className={cn({ isSelected })} style={style}>
      {value}
    </p>
  </div>
);

LetterInput.propTypes = {
  error: object,
  name: string,
  type: string,
  handleOnChange: func,
  onKeyPress: func,
  value: string,
  style: object,
};

export default LetterInput;
