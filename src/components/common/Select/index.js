import React from 'react';
import SelectReact from 'react-select';

import './styles.css';

const backgroundColor = 'rgba(83, 141, 78, 0.85)';

const Select = ({ ...props }) => {
  const colorStyles = {
    control: styles => ({
      ...styles,
      backgroundColor: backgroundColor,
      borderColor: backgroundColor,
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected ? '#1f1f1f' : backgroundColor,
      opacity: isFocused && !isSelected ? 0.7 : 1,
      color: 'white',

      ':active': {
        ...styles[':active'],
        backgroundColor: 'red',
      },
    }),
    singleValue: styles => ({ ...styles, color: 'white' }),
  };
  return <SelectReact {...props} styles={colorStyles} />;
};

export default Select;
