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
import './SalesChartAdmin.scss'

const convertToMonthData = (sales, orders) => {
  const monthNames = [];
  for (let i = 0; i < sales.length; i++) {
    const date = new Date();
    date.setMonth(i);
    monthNames.push(date.toLocaleString('en-US', { month: 'short' }));
  }

  return sales.map((count, index) => ({
    name: monthNames[index],
    sales: count,
    orders: orders[index]
  }));
};

const convertToDayData = (sales, orders) => {
  return sales.map((count, index) => ({
    name: index + 1,
    sales: count,
    orders: orders[index]
  }));
};

const convertToHourlyData = (sales, orders) => {
  return sales.map((count, index) => ({
    name: `${String(index + 1).padStart(2, '0')}:00`,
    sales: count,
    orders: orders[index]
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



const SalesChartAdmin = () => {
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [salesData, setSalesData] = useState([]);
  const [salesFilters, setSalesFilters] = useState({
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
        const { sales, orders, total_customers } = response.data;
        if (salesFilters.period === 'day') {
          setSalesData(convertToHourlyData(sales, orders));
        }
        else if (salesFilters.period === 'month') {
          setSalesData(convertToDayData(sales, orders));
        }
        else {
          setSalesData(convertToMonthData(sales, orders));
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
    <div className="admin-sales-summary">

      <div className="filters">
        <div className="radio-section">
          <label>
            <input
              id='year'
              type="radio"
              name="sales-filter"
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
              name="sales-filter"
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
              name="sales-filter"
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
            <CartesianGrid stroke="#f0f0f0" strokeDasharray="5 5" vertical={false} />
            <XAxis axisLine={false} tickLine={false} dataKey="name" scale="band" tick={{ fontSize: "12px" }} />

            {/* Left Y-axis for sales */}
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: "12px" }}
              tickFormatter={(value) => `₹${value}`}
            />

            {/* Right Y-axis for orders */}
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: "12px" }}
            />

            <Tooltip />

            {/* Line for sales on the left Y-axis */}
            <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#1d9176" strokeWidth={3} dot={false} />

            {/* Line for orders on the right Y-axis */}
            <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#ff7272" strokeWidth={3} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default SalesChartAdmin;
