import { useForm } from 'react-hook-form';

import LetterInput from 'components/common/LetterInput';

import './styles.css';
import { useMemo, useState } from 'react';

const Word = ({ word = '' }) => {
  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  const letters = useMemo(() => word?.split(''), [word]);
  const [currentRound, setCurrentRound] = useState(0);
  const [usersAttempts, setUsersAttempts] = useState([Array(letters.length).fill('')]);

  const focusBefore = fieldIndex => {
    let fieldIntIndex = parseInt(fieldIndex, 10);

    if (fieldIntIndex > 0) {
      const nextfield = document.querySelector(`input[name=letter-${fieldIntIndex - 1}]`);
      if (nextfield !== null) {
        nextfield.focus();
      }
    }
  };

  const focusNext = fieldIndex => {
    let fieldIntIndex = parseInt(fieldIndex, 10);

    if (fieldIntIndex < letters.length) {
      const nextfield = document.querySelector(`input[name=letter-${fieldIntIndex + 1}]`);
      if (nextfield !== null) {
        nextfield.focus();
      }
    }
  };

  const onKeyPress = (name, { key }) => {
    if (key === 'Enter' || key.match(/Arrow/g)) {
      return;
    }
    const [_, fieldIndex] = name.split('-');
    const currentValue = usersAttempts[currentRound][fieldIndex];
    const isLetter = key.match(/[a-zA-Z]/g);
    const isDelete = key === 'Backspace';

    console.log('key: ', key);

    if ((!!currentValue && isLetter) || isDelete) {
      const newAttempt = [...usersAttempts];
      newAttempt[currentRound][fieldIndex] = isDelete ? '' : key;
      setUsersAttempts(newAttempt);
      isDelete ? focusBefore(fieldIndex) : focusNext(fieldIndex);
    }
  };

  const handleOnChange = ({ target: { value, name } }) => {
    const [_, fieldIndex] = name.split('-');

    if (!!value) {
      const isLetter = value.match(/[a-zA-Z]/g);
      if (isLetter) {
        const newAttempt = [...usersAttempts];
        newAttempt[currentRound][fieldIndex] = value;
        setUsersAttempts(newAttempt);
        focusNext(fieldIndex);
      }
    }
  };

  const commonProps = {
    handleOnChange,
    onKeyPress,
  };

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <div className="word">
        {letters?.map((c, index) => (
          <LetterInput
            key={`${c}-${index}`}
            {...commonProps}
            name={`letter-${index}`}
            value={usersAttempts[currentRound][index]}
          />
        ))}
      </div>
      <input type="submit" />
    </form>
  );
};

export default Word;
