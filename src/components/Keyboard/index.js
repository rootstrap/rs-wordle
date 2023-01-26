import KeyboardLetter from 'components/common/KeyboardLetter';
import { CHANGE_LINES_VALUES } from 'constants/constants';
import { LETTER_STATUS } from 'constants/types';
import useTranslation from 'hooks/useTranslation';

import './styles.css';

const Keyboard = ({ keyboardLetters, onKeyPress, disabled }) => {
  const t = useTranslation();

  const renderKeyboardLetter = ([letter, statusId]) => {
    const letterStatus = LETTER_STATUS[statusId];

    return (
      <KeyboardLetter
        key={letter}
        value={letter}
        color={letterStatus.color}
        onKeyPress={() => onKeyPress({ key: letter })}
        disabled={disabled}
        ariaLabel={letterStatus.ariaLabel(letter, t)}
      />
    );
  };

  return (
    <div className="keyboard" role="group" aria-label={t('ariaLabels.keyboard')}>
      <div className="keyboard-row">
        {Object.entries(keyboardLetters).slice(0, CHANGE_LINES_VALUES[0]).map(renderKeyboardLetter)}
      </div>
      <div className="keyboard-row">
        {Object.entries(keyboardLetters)
          .slice(CHANGE_LINES_VALUES[0], CHANGE_LINES_VALUES[1])
          .map(renderKeyboardLetter)}
      </div>
      <div className="keyboard-row">
        {Object.entries(keyboardLetters)
          .slice(CHANGE_LINES_VALUES[1], keyboardLetters.length)
          .map(renderKeyboardLetter)}
      </div>
    </div>
  );
};

export default Keyboard;
