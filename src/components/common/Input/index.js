import cn from 'classnames';

import './styles.css';

const Input = ({ value, handleOnChange, type = 'text', rows = 1, extraClassNames = [] }) => (
  <>
    {rows > 1 ? (
      <textarea
        className={cn('input', extraClassNames)}
        value={value}
        onChange={({ target: { value: newValue } }) => handleOnChange(newValue)}
        rows={rows}
      />
    ) : (
      <input
        className="input small"
        type={type}
        value={value}
        onChange={({ target: { value: newValue } }) => handleOnChange(newValue)}
      />
    )}
  </>
);

export default Input;
