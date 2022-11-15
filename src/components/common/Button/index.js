import { func, bool, string } from 'prop-types';

import './styles.css';

const Button = ({ children, type = 'button', disabled, handleClick }) => (
  <button className="button" onClick={handleClick} type={type} disabled={disabled}>
    {children}
  </button>
);

Button.propTypes = {
  handleClick: func,
  disabled: bool,
  type: string,
};

export default Button;
