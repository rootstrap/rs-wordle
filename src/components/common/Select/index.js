import React from 'react';
import SelectReact from 'react-select';

const activeColor = '#1f1f1f';
const backgroundColor = '#538d4e';
const color = 'white';
const focusedColor = '#1f1f1f';
const hoverColor = '#c6d4c5';
const selectedColor = '#3d6b39';

const colorStyles = {
  container: styles => ({
    ...styles,
    marginBottom: 10,
  }),
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: backgroundColor,
    borderColor: isFocused ? color : backgroundColor,
    borderWidth: 2,
    boxShadow: 'none',

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

const Select = ({ ...props }) => <SelectReact {...props} styles={colorStyles} />;

export default Select;
