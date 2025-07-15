import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import React,{ useState,useEffect} from 'react'

import './CustomDatePicker.scss'

const CustomDatePicker = ({selected, onChange,dateFormat ,placeholder,minDate ,showMonthYearPicker,showYearPicker }) => {
  const [date, setDate] = useState(null); 
    const handleDateChange = (date) => {
      if (date){
        setDate(date);
      onChange(date);
      }
      
      };
  return (
    <div className="custom-date">
    <img className='calendar-icon' src='/images/admin-panel/dashboard/calendar.svg'></img>
    <DatePicker dateFormat={dateFormat}  placeholderText={placeholder}
        selected={selected}
        onChange={handleDateChange}
        minDate={minDate}
        showMonthYearPicker={showMonthYearPicker}
        showYearPicker={showYearPicker}
        />
    </div>
  )
}

export default CustomDatePicker