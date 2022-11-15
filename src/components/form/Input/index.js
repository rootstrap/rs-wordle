import { string, func, object } from 'prop-types';
import cn from 'classnames';
import './styles.css';

const Input = ({ register, type = 'text', name, error, handleFocus }) => (
  <div className="Input">
    <input className={cn({ error })} type={type} {...register(name)} onFocus={handleFocus} />
    <small className="error-message">{error?.message}</small>
  </div>
);

Input.propTypes = {
  register: func.isRequired,
  error: object,
  name: string,
  type: string,
};

export default Input;
