import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import $ from 'jquery';
import './DashboardRestaurant.scss'
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
            <div className="col-xl-5  col-12">
              <div className="card p-0 welcome-box">
                <div className="card-body">
                  <div className="welcome-card">
                    <div className='row mt-5'>
                      {/* <h5> Exclusive weekend discounts</h5> */}
                      <h3>Welcome To Cloudnet Travels</h3>
                      <a onClick={() => navigate('/admin/menu-item/list')} className="btn btn-primary w-50 mx-auto">Check Menu</a>
                      <img className="icon1" src="/images/admin-panel/dashboard/food1.png" alt="" />
                    </div>
                    {/* menu-category */}
                    <div className='row w-100 categories'>
                      <div className="card">
                        <div className="card-header">
                          <h5>Top Menu Categories</h5>
                        </div>
                        <div className="card-body">
                          <div className="categories-section">
                            <div className="theme-arrow">
                              <Swiper
                                spaceBetween={20}
                                slidesPerView={7}
                                loop={true}
                                modules={[Navigation, Autoplay]} // Include Navigation module
                                navigation={{
                                  nextEl: '.categories-next',
                                  prevEl: '.categories-prev',
                                }} // Configure navigation buttons
                                breakpoints={CategorySwiperBreakpoints}
                                className="swiper categories-slider categories-style"
                                autoplay={{
                                  delay: 0,
                                  disableOnInteraction: false,
                                }}
                                speed={2000}
                              >
                                {categories?.results?.length > 0 && categories.results.map((item) => (
                                  <SwiperSlide key={item.id}>
                                    <a className="food-categories"
                                    //  onClick={() => navigate('/admin/menu-category/list')}
                                    >
                                      <img
                                        className="img-fluid categories-img"
                                        src={item.image_url}
                                        alt={item.name}
                                      />
                                      <h4 className="">{item.name}</h4>
                                    </a>
                                  </SwiperSlide>
                                ))}

                              </Swiper>

                              {/* <div className="swiper-button-next categories-next"></div>
                              <div className="swiper-button-prev categories-prev"></div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-7 col-12">
              <div className="row">
                {/* total sale */}
                <div className="col-12">
                  <div className="card widgets-card">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="colp-0">
                          <div className='graph'>
                            <SalesChartRestaurant source={'dashboard'} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* customer count */}
                <div className="col-12">
                  <div className="card widgets-card">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col p-0">
                          <div className='graph'>
                            <CustomersSummary2 source={'dashboard'} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Review summary */}
            {/* <div className="col-xl-6">
              <div className="card">
                <div className="card-header mb-0">
                  <h5>Reviews</h5>
                </div>
                <div className="card-body graph">
                  <ReviewSummaryChart />
                </div>
              </div>
            </div> */}
            {/* Performance */}
            {/* <div className="col-xl-6">
              <div className="card">
                <div className="card-header mb-0">
                  <h5>Performance</h5>
                </div>
                <div className="card-body graph">
                  <RestaurantPerformanceChart source={'dashboard'} />
                </div>
              </div>
            </div> */}

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