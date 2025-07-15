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
  AreaChart,
  Area,
  Line,
  LineChart,
} from 'recharts';

import API from '../../../../API';
import './ReviewSummaryChart.scss'


const ReviewSummaryChart = () => {
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
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
    let apiUrl = `/grocery/sales_report/`;
    // Loop through the filters object and append selected filters to the apiUrl
    for (let filter in filters) {
      if (filters[filter]) {
        apiUrl += `${apiUrl.includes('?') ? '&' : '?'}${filter}=${filters[filter]}`;
      }
    }
    setIsLoading(true)
    API.get(apiUrl)
      .then(response => {
        const avgReviewData = response.data.avg_reviews || {};
        if (filters.period === 'day') {
          setData(convertToHourlyData(avgReviewData.avg_overall_rating, avgReviewData.avg_delivery_speed_rating, avgReviewData.avg_accuracy_of_items_rating,filters));
        } else if (filters.period === 'month') {
          setData(convertToDayData(avgReviewData.avg_overall_rating, avgReviewData.avg_delivery_speed_rating, avgReviewData.avg_accuracy_of_items_rating,filters));
        } else {
          setData(convertToMonthData(avgReviewData.avg_overall_rating, avgReviewData.avg_delivery_speed_rating, avgReviewData.avg_accuracy_of_items_rating,filters));
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
    <div className="review-summary">
      <div className="filters">
        <div className="radio-section">
          <label>
            <input
              type="radio"
              name="filter-review"
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
              name="filter-review"
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
              name="filter-review"
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
          <AreaChart
            width={600}
            height={400}
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid stroke="#ffe5cc" strokeDasharray="5 5" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: "12px" }} tickLine={false} axisLine={false} stroke="#999999" />
            <YAxis tick={{ fontSize: "12px", opacity: "0" }} tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend
              
            />
            <Area type="monotone" dataKey="DeliverySpeedRating" name='Delivery Speed' stackId="1" stroke="#e6aa29" fill="#e6aa29" />
            <Area type="monotone" dataKey="AccuracyOfItemsRating" name='Accuracy of Items' stackId="1" stroke="#ff7272" fill="#ff7272" />
            <Area type="monotone" dataKey="OverallRating" stackId="1" name='Overall Rating' stroke="#1d9176" fill="#1d9176" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default ReviewSummaryChart;




const convertToMonthData = (avgOverallRatings, avgDeliverySpeedRatings, avgAccuracyRatings, filters) => {
  const monthNames = [];
  for (let i = 0; i < avgOverallRatings.length; i++) {
    const date = new Date();
    date.setMonth(i);
    monthNames.push(date.toLocaleString('en-US', { month: 'short' }));
  }

  const selectedYear = filters.year || new Date().getFullYear();
  const isCurrentYear = selectedYear === new Date().getFullYear();
  const maxMonthIndex = isCurrentYear ? new Date().getMonth() : 11;

  return avgOverallRatings.map((rating, index) => {
    if (index > maxMonthIndex) return null; // Exclude months after the current month if in the current year
    return {
      name: monthNames[index],
      OverallRating: rating.toFixed(2),
      DeliverySpeedRating: avgDeliverySpeedRatings[index].toFixed(2),
      AccuracyOfItemsRating: avgAccuracyRatings[index].toFixed(2),
    };
  }).filter(Boolean);
};

const convertToDayData = (avgOverallRatings, avgDeliverySpeedRatings, avgAccuracyRatings, filters) => {
  const selectedMonth = filters.month - 1; // 0-based index for months
  const selectedYear = filters.year || new Date().getFullYear();
  const isCurrentMonth = selectedYear === new Date().getFullYear() && selectedMonth === new Date().getMonth();
  const maxDay = isCurrentMonth ? new Date().getDate() : new Date(selectedYear, selectedMonth + 1, 0).getDate(); // Last day of the selected month

  return avgOverallRatings.map((rating, index) => {
    if (index + 1 > maxDay) return null; // Exclude days beyond the maxDay
    return {
      name: index + 1, // Day number
      OverallRating: rating.toFixed(2),
      DeliverySpeedRating: avgDeliverySpeedRatings[index].toFixed(2),
      AccuracyOfItemsRating: avgAccuracyRatings[index].toFixed(2),
    };
  }).filter(Boolean);
};

const convertToHourlyData = (avgOverallRatings, avgDeliverySpeedRatings, avgAccuracyRatings, filters) => {
  const selectedDate = new Date(filters.date || Date.now());
  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const maxHour = isToday ? new Date().getHours() : 23; // Limit to current hour if today, else full day

  return avgOverallRatings.map((rating, index) => {
    if (index > maxHour) return null; // Exclude hours beyond the maxHour
    return {
      name: `${String(index).padStart(2, '0')}:00`, // Hour format (e.g., "01:00")
      OverallRating: rating.toFixed(2),
      DeliverySpeedRating: avgDeliverySpeedRatings[index].toFixed(2),
      AccuracyOfItemsRating: avgAccuracyRatings[index].toFixed(2),
    };
  }).filter(Boolean);
};

