import Slider from 'react-slider';
import React, {useState} from 'react';
import './RangeSlider.scss'

const RangeSlider = ({ values, onChange, min_range, max_range,step }) => {
  
  return (
    <div className='custom-range-slider'>
        <Slider className='slider'
          value={values} min={min_range} max={max_range}
          onChange={onChange}
          step={step}
         />
    </div>
  )
}

export default RangeSlider