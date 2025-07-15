import React, { useState, useRef, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Main style file
import 'react-date-range/dist/theme/default.css'; // Theme CSS file
import './DateRangePicker.scss'

const DateRangePicker = ({
  filters,
  setFilters,
  className = 'date-input',
  rangeColors = ['#004938'],
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const pickerRef = useRef(null);

  const handleDateChange = (ranges) => {
    const { selection } = ranges;
    // setFilters((prevFilters) => ({
    //   ...prevFilters,
    //   start_date: selection.startDate.toISOString().split('T')[0],
    //   end_date: selection.endDate.toISOString().split('T')[0],
    // }));
    const formatDate = (date) =>
      date.toLocaleDateString('en-CA'); // Returns YYYY-MM-DD in local time
  
    setFilters((prevFilters) => ({
      ...prevFilters,
      start_date: formatDate(selection.startDate),
      end_date: formatDate(selection.endDate),
    }));
  };
  const clearDates = () => {
    setFilters({ start_date: null, end_date: null });
    setShowDatePicker(false);
  };

  const handleClickOutside = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      setShowDatePicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="date-range-picker">
      <input
        type="text"
        id="dateRange"
        readOnly
        value={
          filters.start_date && filters.end_date
            ? `${filters.start_date} to ${filters.end_date}`
            : 'Select Date Range'
        }
        onClick={() => setShowDatePicker((prev) => !prev)} // Toggle visibility
        className={className}
      />
      {showDatePicker && (
        <div className="date-picker-overlay" ref={pickerRef}>
          <DateRange
            editableDateInputs
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            ranges={[
              {
                startDate: filters.start_date ? new Date(filters.start_date) : new Date(),
                endDate: filters.end_date ? new Date(filters.end_date) : new Date(),
                key: 'selection',
              },
            ]}
            rangeColors={rangeColors}
            showDateDisplay={false}
          />
          <div className='btn-container'>
            <button onClick={clearDates} className='clear-btn'>
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
