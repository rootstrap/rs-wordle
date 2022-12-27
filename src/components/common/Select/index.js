import React from 'react';
import SelectReact from 'react-select';

const activeColor = '#1f1f1f';
const backgroundColor = '#538d4e';
const color = 'white';
const focusedColor = '#1f1f1f';
const hoverColor = '#c6d4c5';
const selectedColor = '#3d6b39';

const Select = ({ ...props }) => {
  const colorStyles = {
    container: styles => ({
      ...styles,
      marginBottom: 35,
    }),
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
