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
  Area,
  Line,
} from 'recharts';

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import './CustomersSummaryChart.scss'

const convertToMonthData = (customerCounts, orders) => {
  const monthNames = [];
  for (let i = 0; i < customerCounts.length; i++) {
    const date = new Date();
    date.setMonth(i);
    monthNames.push(date.toLocaleString('en-US', { month: 'short' }));
  }

  return customerCounts.map((count, index) => ({
    name: monthNames[index],
    customers: count,
    orders: orders[index]
  }));
};

const convertToDayData = (customerCounts, orders) => {
  return customerCounts.map((count, index) => ({
    name: index + 1,
    customers: count,
    orders: orders[index]
  }));
};

const convertToHourlyData = (customerCounts, orders) => {
  return customerCounts.map((count, index) => ({
    name: `${String(index + 1).padStart(2, '0')}:00`,
    customers: count,
    orders: orders[index]
  }));
};

const CustomDot = (props) => {
  const { cx, cy, payload } = props;  // Access the payload to get the actual data
  const value = payload.orders;  // Use payload to get the value for 'orders'

  if (value <= 3) {
    return null;
  }

  return (
    <circle cx={cx} cy={cy} r={6} fill="#F2A93E" stroke="none" />
  );
};

const CustomAnimatedDot = (props) => {
  const { cx, cy, payload } = props;
  const value = payload.orders; 

  if (value <= 3) {
    return null;
  }

  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <defs>
        <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" style={{ stopColor: "#F2A93E", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#caa782", stopOpacity: 0.8 }} />
        </radialGradient>
      </defs>
      <circle r={5} fill="url(#dotGradient)">
        <animate
          attributeName="r"
          from="5"
          to="10"
          dur="1.3s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          from="1"
          to="0"
          dur="1.3s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
};


const CustomersSummary = () => {
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    period: 'year',
    year: new Date().getFullYear(),
    month: null,
    // month: new Date().getMonth() + 1,
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
      setFilters(prevFilters => {
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

    setFilters(prevFilters => ({
      ...prevFilters,
      period: value,
      date: value === 'day' ? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}` : null,
      month: value === 'month' ? now.getMonth() + 1 : null,
      year: value === 'year' || value === 'month' ? now.getFullYear() : null
    }));
    setSelectedDate(newDate); // Update the date picker
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = () => {
    setIsMessageModalOpen(false);
    let apiUrl = `/order/sales_report/`;
    // Loop through the filters object and append selected filters to the apiUrl
    for (let filter in filters) {
      if (filters[filter]) {
        apiUrl += `${apiUrl.includes('?') ? '&' : '?'}${filter}=${filters[filter]}`;
      }
    }
    setIsLoading(true)
    API.get(apiUrl)
      .then(response => {
        const { customer_count, orders } = response.data;
        if (filters.period === 'day') {
          setData(convertToHourlyData(customer_count, orders));
        } else if (filters.period === 'month') {
          setData(convertToDayData(customer_count, orders));
        } else {
          setData(convertToMonthData(customer_count, orders));
        }
        setIsLoading(false);
        setIsLoading(false)
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
        setIsLoading(false)
      });
  }

  return (
    <div className="customer-summary">
      <div className="filters">
        <div className="radio-section">
          <label>
            <input
              type="radio"
              name="filter2"
              value="year"
              checked={filters.period === 'year'}
              onChange={handleFilterChange}
            />
            <i></i>
            <span>Year</span>
          </label>
          <label>
            <input
              type="radio"
              name="filter2"
              value="month"
              checked={filters.period === 'month'}
              onChange={handleFilterChange}
            />
            <i></i>
            <span>Month</span>
          </label>
          <label>
            <input
              type="radio"
              name="filter2"
              value="day"
              checked={filters.period === 'day'}
              onChange={handleFilterChange}
            />
            <i></i>
            <span>Day</span>
          </label>
        </div>

        <div className="date-picker">
          {filters.period === 'day' && (
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className="date-picker-input"
            />
          )}
          {filters.period === 'month' && (
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM"
              showMonthYearPicker
              className="date-picker-input"
            />
          )}
          {filters.period === 'year' && (
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

      <div className="chart">

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 0,
            }}>
            <defs>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F2A93E" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#F2A93E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#f5f5f5" strokeDasharray="5 5" />
            <XAxis dataKey="name" tick={{ fontSize: "12px" }} tickLine={false}  axisLine={false} stroke="#999999"  />
            <YAxis tick={{ fontSize: "12px" }} tickLine={false} axisLine={{stroke: '#f5f5f5', strokeWidth:2}} />
            <Tooltip />
            {/* <Legend /> */}
            <Area type="monotone" dataKey="orders" stroke="#F2A93E" fillOpacity={1} strokeWidth={1} fill="url(#colorOrders)" dot={<CustomAnimatedDot />} />
            {/* <Line type="monotone" dataKey="customers" stroke="#eb3f67" strokeDasharray="3 3" strokeWidth={2} tick={{ fontSize: "12px" }} dot={false} /> */}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default CustomersSummary;
