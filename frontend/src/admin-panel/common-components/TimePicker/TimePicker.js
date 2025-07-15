import React from 'react';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import './TimePicker.scss'
const TimePickerComponent = ({ value, onChange }) => {
    const handleTimeChange = (time) => {
        if (time){
            // Split the time into hours and minutes
        // const [hours, minutes] = time.split(':');
    
        // // Convert hours to 12-hour format
        // let formattedHours = parseInt(hours, 10);
        // const amPm = formattedHours >= 12 ? 'PM' : 'AM';
        // formattedHours = formattedHours % 12 || 12; // Ensure 12 is displayed instead of 0 for 12:XX
    
        // // Combine hours, minutes, and AM/PM indicator
        // const formattedTime = `${formattedHours}:${minutes} ${amPm}`;
    
        // Call the onChange function with the formatted time
        onChange(time);
        }
        
      };
  return (
    <div className='custom-time-picker'>
      <TimePicker
        onChange={handleTimeChange}
        value={value}
        name='working_hours_from'
        amPmAriaLabel="Select AM/PM"
        format='hh:mm a' // Correct format for displaying AM/PM selector
      />
    </div>
  );
};

export default TimePickerComponent;
