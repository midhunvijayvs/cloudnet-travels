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

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import './ReviewChartAdmin.scss'


const ReviewChartAdmin = () => {
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
        const avgReviewData = response.data.avg_reviews || {};
        if (filters.period === 'day') {
          setData(convertToHourlyData(avgReviewData.avg_overall_rating, avgReviewData.avg_delivery_speed_rating, avgReviewData.avg_accuracy_of_items_rating, filters));
        } else if (filters.period === 'month') {
          setData(convertToDayData(avgReviewData.avg_overall_rating, avgReviewData.avg_delivery_speed_rating, avgReviewData.avg_accuracy_of_items_rating, filters));
        } else {
          setData(convertToMonthData(avgReviewData.avg_overall_rating, avgReviewData.avg_delivery_speed_rating, avgReviewData.avg_accuracy_of_items_rating, filters));
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
    <div className="admin-review-summary">
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
        <ResponsiveContainer width="100%" height="100%" className={'d-none'}>
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <defs>
              {/* Define Gradient for Overall Rating */}
              <linearGradient id="overallRatingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="5%" style={{ stopColor: '#8884d8', stopOpacity: 0.8 }} />
                <stop offset="95%" style={{ stopColor: '#8884d8', stopOpacity: 0 }} />
              </linearGradient>

              {/* Define Gradient for Delivery Speed Rating */}
              <linearGradient id="deliverySpeedRatingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="5%" style={{ stopColor: '#82ca9d', stopOpacity: 0.8 }} />
                <stop offset="95%" style={{ stopColor: '#82ca9d', stopOpacity: 0 }} />
              </linearGradient>

              {/* Define Gradient for Accuracy of Items Rating */}
              <linearGradient id="accuracyOfItemsRatingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="5%" style={{ stopColor: '#eb3f67', stopOpacity: 0.8 }} />
                <stop offset="95%" style={{ stopColor: '#eb3f67', stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#ffe5cc" strokeDasharray="5 5" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: "12px" }} tickLine={false} axisLine={false} stroke="#999999" />
            <YAxis tick={{ fontSize: "12px", opacity: "0" }} tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend
              formatter={(value) => {
                switch (value) {
                  case 'OverallRating':
                    return 'Overall Rating';
                  case 'DeliverySpeedRating':
                    return 'Delivery Speed';
                  case 'AccuracyOfItemsRating':
                    return 'Accuracy of Items';
                  default:
                    return value;
                }
              }}
            />
            <Line type="monotone" dataKey="OverallRating" name='Overall' stroke="#82ca9d" activeDot={{ r: 4 }} dot={false} strokeWidth={2} tick={{ fontSize: "12px" }} />
            <Line type="monotone" dataKey="DeliverySpeedRating" name='Delivery Speed' stroke="#edb600" dot={false} strokeWidth={2} tick={{ fontSize: "12px" }} />
            <Line type="monotone" dataKey="AccuracyOfItemsRating" name='Accuracy of Items' stroke="#eb3f67" strokeWidth={2} tick={{ fontSize: "12px" }} dot={false} />
          </LineChart>
        </ResponsiveContainer>
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
            <Area type="monotone" dataKey="DeliverySpeedRating" name='Delivery Speed' stackId="1" stroke="#e6aa29" fill="#e6aa29" />
            <Area type="monotone" dataKey="AccuracyOfItemsRating" name='Accuracy of Items' stackId="1" stroke="#ff7272" fill="#ff7272" />
            <Area type="monotone" dataKey="OverallRating" stackId="1" name='Overall' stroke="#1d9176" fill="#1d9176" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default ReviewChartAdmin;




const convertToMonthData = (avgOverallRatings, avgDeliverySpeedRatings, avgAccuracyRatings, filters) => {
  const monthNames = [];
  for (let i = 0; i < avgOverallRatings.length; i++) {
    const date = new Date();
    date.setMonth(i);
    monthNames.push(date.toLocaleString('en-US', { month: 'short' }));
  }

  const filterYear = filters.year || new Date().getFullYear();
  const isCurrentYear = filterYear === new Date().getFullYear();
  const currentMonthIndex = isCurrentYear ? new Date().getMonth() : 11; // 0-based index

  return avgOverallRatings.map((rating, index) => {
    if (index > currentMonthIndex) return null; // Exclude months after the current month if in the current year
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
  const selectedYear = filters.year;
  const selectedDate = new Date(selectedYear, selectedMonth);
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const currentDay = selectedYear === new Date().getFullYear() && selectedMonth === new Date().getMonth() ? new Date().getDate() : daysInMonth;

  return avgOverallRatings.map((rating, index) => {
    if (index + 1 > currentDay) return null; // Exclude days beyond the current date
    return {
      name: index + 1,
      OverallRating: rating.toFixed(2),
      DeliverySpeedRating: avgDeliverySpeedRatings[index].toFixed(2),
      AccuracyOfItemsRating: avgAccuracyRatings[index].toFixed(2),
    };
  }).filter(Boolean);
};

const convertToHourlyData = (avgOverallRatings, avgDeliverySpeedRatings, avgAccuracyRatings, filters) => {
  const selectedDate = new Date(filters.date);
  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const currentHour = isToday ? new Date().getHours() : 23;

  return avgOverallRatings.map((rating, index) => {
    if (index > currentHour) return null; // Exclude hours beyond the current hour if it's today
    return {
      name: `${String(index).padStart(2, '0')}:00`,
      OverallRating: rating.toFixed(2),
      DeliverySpeedRating: avgDeliverySpeedRatings[index].toFixed(2),
      AccuracyOfItemsRating: avgAccuracyRatings[index].toFixed(2),
    };
  }).filter(Boolean);
};
