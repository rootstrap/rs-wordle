import { bool, func, object, string } from 'prop-types';
import cn from 'classnames';

import useTranslation from 'hooks/useTranslation';

import './styles.css';

const LetterInput = ({ value, style, isSelected, onClick, disabled, ariaLabel }) => {
  const t = useTranslation();

  return (
    <button
      onClick={onClick}
      className={cn('letter-input', { isSelected, disabled })}
      style={style}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-roledescription={t('ariaLabels.letter')}
    >
      {value}
    </button>
  );
};

LetterInput.propTypes = {
  disabled: bool,
  isSelected: bool,
  onClick: func,
  style: object,
  value: string,
};

export default LetterInput;
