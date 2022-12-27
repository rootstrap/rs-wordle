import React from 'react';
import SelectReact from 'react-select';

import './styles.css';

const activeColor = '#3d6b39';
const backgroundColor = '#538d4e';
const color = 'white';
const focusedColor = '#3d6b39';
const hoverColor = '#c6d4c5';
const selectedColor = '#1f1f1f';

const Select = ({ ...props }) => {
  const colorStyles = {
    control: (styles, { isFocused }) => ({
      ...styles,
      backgroundColor: backgroundColor,
      borderColor: isFocused ? color : backgroundColor,
      borderWidth: 2,

      ':hover': {
        ...styles[':hover'],
        borderColor: color,
      },
    }),
    dropdownIndicator: styles => ({
      ...styles,
      color,

      ':hover': {
        ...styles[':hover'],
        color: hoverColor,
      },
    }),
    menu: styles => ({ ...styles, backgroundColor }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected ? selectedColor : isFocused ? focusedColor : backgroundColor,
      color,

      ':active': {
        ...styles[':active'],
        backgroundColor: activeColor,
      },
    }),
    singleValue: styles => ({ ...styles, color }),
  };
  return <SelectReact {...props} styles={colorStyles} />;
};

export default Select;
