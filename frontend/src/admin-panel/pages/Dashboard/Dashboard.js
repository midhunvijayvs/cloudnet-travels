import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import $ from 'jquery';
import './Dashboard.scss'
import ReviewSummaryChart from '../../common-components/ReviewSummaryChart/ReviewSummaryChart';
import CustomersSummary2 from '../../common-components/CustomersChart2/CustomersChart2';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/navigation'; // Import Navigation styles
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import SalesChartRestaurant from '../../common-components/SalesChartRestaurant/SalesChartRestaurant';
import RestaurantPerformanceChart from '../../common-components/RestaurantPerformanceChart/RestaurantPerformanceChart';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const DashboardRestaurant = ({ role }) => {

  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState(false);
  const [orders, setOrders] = useState(false);
  const [filters, setFilters] = useState({
    period: 'year',
    year: new Date().getFullYear(),
    month: null,
    // month: new Date().getMonth() + 1,
    date: null,
  });


  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  useEffect(() => {
    loadCategories();
  }, []);
  useEffect(() => {
    loadOrders();
  }, [filters]);

  const loadCategories = () => {
    setIsMessageModalOpen(false);
    let apiUrl = `/restaurants/menu-categories/?page=${1}&page_size=${25}`;
    API.get(apiUrl)
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
      });
  }

  const CategorySwiperBreakpoints = {
    320: {
      slidesPerView: 2, // 1 slide per view on small screens
    },
    420: {
      slidesPerView: 3, // 2 slides per view on small screens
    },
    768: {
      slidesPerView: 4, // 4 slides per view on medium screens
    },
    1024: {
      slidesPerView: 4, // 6 slides per view on large screens
    },
    1200: {
      slidesPerView: 3, // 6 slides per view on large screens
    },
    1440: {
      slidesPerView: 4, // 8 slides per view on extra-large screens
    },
  };

  const loadOrders = () => {
    let apiUrl = `/order/orders/`;
    // Loop through the filters object and append selected filters to the apiUrl
    for (let filter in filters) {
      if (filters[filter]) {
        apiUrl += `${apiUrl.includes('?') ? '&' : '?'}${filter}=${filters[filter]}`;
      }
    }
    API.get(apiUrl)
      .then(response => {
        setOrders(response.data.results);
      })
      .catch(error => {
      });
  }

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


  return (
    <div className='restaurant-dashboard-page'>
      <div className=" page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="  col-12">
              <div className="card p-0 welcome-box">
                <div className="card-body">
                  <div className="welcome-card">
                    <div className='row mt-5'>
                      {/* <h5> Exclusive weekend discounts</h5> */}
                      <h3>Welcome To Admin Panel</h3>
                      <a onClick={() => navigate('/admin/booking/list')} className="btn btn-primary w-50 mx-auto">See Bookings</a>
                      <img className="icon1" src="/images/admin-panel/dashboard/food1.png" alt="" />
                    </div>
                  
                  </div>
                </div>
              </div>
            </div>

          
        

          </div>
        </div>
      </div>




      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}

      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>

  )
}

export default DashboardRestaurant