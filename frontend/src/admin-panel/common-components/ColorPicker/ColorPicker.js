import React from 'react';
import InputColor from 'react-input-color';
import './ColorPicker.scss'

const ColorPicker = ({ initialColor, onColorChange }) => {
  return (
    <div className='color-picker-container'>
      <InputColor
        initialValue={initialColor}
        onChange={onColorChange}
        placement="right"
      />
    </div>
  );
};

export default ColorPicker;
