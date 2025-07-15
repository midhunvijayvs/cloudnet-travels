import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
} from 'recharts';

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import './SalesChartRestaurant.scss'

const convertToMonthData = (inputValues) => {
  // Generate month names dynamically based on the length of inputValues
  const monthNames = [];
  for (let i = 0; i < inputValues.length; i++) {
    const date = new Date();
    date.setMonth(i);
    monthNames.push(date.toLocaleString('en-US', { month: 'short' }));
  }

  // if (inputValues.length !== monthNames.length) {
  //   throw new Error('Sales data and month names length mismatch.');
  // }

  return inputValues.map((sales, index) => ({
    name: monthNames[index],
    sales
  }));
};
const convertToDayData = (inputValues) => {
  const days = inputValues.length;

  // Create an array with day numbers corresponding to the length of inputValues
  return inputValues.map((sales, index) => ({
    name: index + 1,
    sales
  }));
};
const convertToHourlyData = (inputValues) => {
  const hoursInDay = 24; // Number of hours in a day

  return inputValues.map((sales, index) => ({
    name: `${String(index + 1).padStart(2, '0')}:00`,
    sales
  }));
};

const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  const value = payload.sales;

  if (value <= 3) {
    return null;
  }

  return (
    <circle cx={cx} cy={cy} r={5} fill="#ff7272" stroke="none" />
  );
};



const SalesChartRestaurant = ({ source }) => {
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [totalSale, setTotalSale] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [salesFilters, setSalesFilters] = useState({
    period: 'year',
    year: new Date().getFullYear(),
    // month: new Date().getMonth() + 1,
    month: null,
    date: null,
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    if (date) {
      const newDate = {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // Months are 0-based
        day: date.getDate(),
      };

      setSelectedDate(date);
      setSalesFilters(prevFilters => {
        let updatedFilters = { ...prevFilters };

        if (prevFilters.period === 'day') {
          updatedFilters = { ...updatedFilters, date: `${newDate.year}-${String(newDate.month).padStart(2, '0')}-${String(newDate.day).padStart(2, '0')}`, month: null, year: null };
        } else if (prevFilters.period === 'month') {
          updatedFilters = { ...updatedFilters, month: newDate.month, year: newDate.year, date: null };
        } else if (prevFilters.period === 'year') {
          updatedFilters = { ...updatedFilters, year: newDate.year, month: null, date: null };
        }

        return updatedFilters;
      });
    }
  };

  const handleFilterChange = (event) => {
    const { value } = event.target;
    const now = new Date();

    let newDate;

    if (value === 'year') {
      newDate = new Date();
      newDate.setMonth(0); // January
      newDate.setDate(1);  // First day of the year
    } else if (value === 'month') {
      newDate = new Date();
      newDate.setDate(1);  // First day of the current month
    } else if (value === 'day') {
      newDate = now; // Current date
    }

    setSalesFilters(prevFilters => ({
      ...prevFilters,
      period: value,
      date: value === 'day' ? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}` : null,
      month: value === 'month' ? now.getMonth() + 1 : null,
      year: value === 'year' || value === 'month' ? now.getFullYear() : null
    }));
    setSelectedDate(newDate); // Update the date picker
  };

  useEffect(() => {
    loadSalesData();
    // console.log(salesFilters);
    // console.log(salesData);
  }, [salesFilters]);

  const loadSalesData = () => {
    setIsMessageModalOpen(false);
    let apiUrl = `/order/sales_report/`;

    // Loop through the filters object and append selected filters to the apiUrl
    for (let filter in salesFilters) {
      if (salesFilters[filter]) {
        apiUrl += `${apiUrl.includes('?') ? '&' : '?'}${filter}=${salesFilters[filter]}`;
      }
    }
    setIsLoading(true)
    API.get(apiUrl)
      .then(response => {
        setTotalSale(response.data.total_sales)
        if (salesFilters.period === 'day') {
          setSalesData(convertToHourlyData(response.data.sales));
        }
        else if (salesFilters.period === 'month') {
          setSalesData(convertToDayData(response.data.sales));
        }
        else {
          setSalesData(convertToMonthData(response.data.sales));
        }
        setIsLoading(false)
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
        setIsLoading(false)

      });
  }

  return (
    <div className="sales-summary-2">
      <div className="filters">
        {source === 'dashboard' &&
          <div className="summary-value">
            <h5>Total Sales: </h5>
            <h2>£{totalSale}</h2>
          </div>
        }
        <div className='options'>
          <div className="radio-section">
            <label>
              <input
                id='year'
                type="radio"
                name="filter"
                value="year"
                checked={salesFilters.period === 'year'}
                onChange={handleFilterChange}
              />
              <i></i>
              <span>Year</span>
            </label>
            <label>
              <input
                type="radio"
                name="filter"
                value="month"
                checked={salesFilters.period === 'month'}
                onChange={handleFilterChange}
              />
              <i></i>
              <span>Month</span>
            </label>
            <label>
              <input
                type="radio"
                name="filter"
                value="day"
                checked={salesFilters.period === 'day'}
                onChange={handleFilterChange}
              />
              <i></i>
              <span>Day</span>
            </label>
          </div>

          <div className="date-picker">
            {salesFilters.period === 'day' && (
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                className="date-picker-input"
              />
            )}
            {salesFilters.period === 'month' && (
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM"
                showMonthYearPicker
                className="date-picker-input"
              />
            )}
            {salesFilters.period === 'year' && (
              <DatePicker
                inputProps={{ readOnly: true, style: { cursor: 'pointer' } }}
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy"
                showYearPicker
                className="date-picker-input"
              />
            )}
          </div>
        </div>
      </div>

      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            width={500}
            height={350}
            data={salesData}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 10,
            }}
          >
            <CartesianGrid stroke="#ffe5cc" strokeDasharray="5 5" vertical={false} />
            <XAxis axisLine={false} tickLine={false} dataKey="name" scale="band" tick={{ fontSize: "12px" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: "12px" }} tickFormatter={(value) => `£${value}`} />
            <Tooltip />
            {/* <Legend /> */}
            <Bar dataKey="sales" barSize={20} fill="#F2A93E" radius={[10, 0, 10, 0]} />
            {/* <Line type="monotone" dataKey="sales" stroke="#ff7272" strokeWidth={2} dot={<CustomDot />} /> */}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default SalesChartRestaurant;
