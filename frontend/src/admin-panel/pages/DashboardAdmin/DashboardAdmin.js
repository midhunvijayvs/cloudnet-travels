import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import $ from 'jquery';
import './DashboardAdmin.scss'
import CountUp from 'react-countup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SalesChartAdmin from '../../common-components/SalesChartAdmin/SalesChartAdmin';
import ReviewChartAdmin from '../../common-components/ReviewChartAdmin/ReviewChartAdmin';

const DashboardAdmin = ({ role }) => {

  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(false);
  const [topRestaurants, setTopRestaurants] = useState(false);
  const [filters, setFilters] = useState({
    period: 'month',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    date: null,
  });

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    loadTopSellingData();
  }, [filters]);

  const loadData = () => {
    let apiUrl = `/order/overall-dashboard-statistics/`;
    API.get(apiUrl)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
      });
  }

  const loadTopSellingData = () => {
    let apiUrl = `/order/top-restaurants-dashboard/`;
    // Loop through the filters object and append selected filters to the apiUrl
    for (let filter in filters) {
      if (filters[filter]) {
        apiUrl += `${apiUrl.includes('?') ? '&' : '?'}${filter}=${filters[filter]}`;
      }
    }
    API.get(apiUrl)
      .then(response => {
        setTopRestaurants(response.data);
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
    <div className='admin-dashboard-page'>
      <div className="page-body">
        <div className="container-fluid">
          {/* overview cards */}
          <div className="row">
            <div className="col-xl-3 col-lg-6 mb-3">
              <div className='card overview sale'>
                <div className="card-body">
                  <div className='icon'>
                    <img src='/images/admin-panel/dashboard/icon/money.svg' />
                  </div>
                  <h2 className='truncate'>
                    <CountUp
                      start={0}
                      end={data.total_sales}
                      duration={2}
                      separator=","
                      decimal="."
                      decimals={2}
                      prefix="£"
                    />
                  </h2>
                  <h5>Total Revenue</h5>
                </div>
                <div className='bg-icon'>
                  <img src='/images/admin-panel/dashboard/icon/money.svg' />
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 mb-3">
              <div className='card overview order' onClick={() => navigate('/admin/orders/list')}>
                <div className="card-body">
                  <div className='icon'>
                    <img src='/images/admin-panel/dashboard/icon/order.svg' />
                  </div>
                  <h2>
                    <CountUp
                      start={0}
                      end={data.total_orders}
                      duration={1}
                      separator=","
                    />
                  </h2>
                  <h5>Total Order</h5>
                </div>
                <div className='bg-icon'>
                  <img src='/images/admin-panel/dashboard/icon/order.svg' />
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 mb-3" >
              <div className='card overview restaurant' onClick={() => navigate('/admin/restaurant/list')}>
                <div className="card-body">
                  <div className='icon'>
                    <img src='/images/admin-panel/dashboard/icon/restaurant.svg' />
                  </div>
                  <h2>
                    <CountUp
                      start={0}
                      end={data.total_restaurant}
                      duration={1}
                      separator=","
                    />
                  </h2>
                  <h5>Restaurants</h5>
                </div>
                <div className='bg-icon'>
                  <img src='/images/admin-panel/dashboard/icon/restaurant.svg' />
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6">
              <div className='card overview customer' onClick={() => navigate('/admin/users/list')}>
                <div className="card-body">
                  <div className='icon'>
                    <img src='/images/admin-panel/dashboard/icon/customer.svg' />
                  </div>
                  <h2>
                    <CountUp
                      start={0}
                      end={data.total_customers}
                      duration={1.5}
                      separator=","
                    />
                  </h2>
                  <h5>Customers</h5>
                </div>
                <div className='bg-icon'>
                  <img src='/images/admin-panel/dashboard/icon/customer.svg' />
                </div>
              </div>
            </div>
          </div>
          {/* graphs */}
          <div className='row graph mt-3'>
            <div className="col-xl-6">
              <div className="card sales">
                <div className="card-header mb-0">
                  <h5>Sales Overview</h5>
                </div>
                <div className="card-body graph">
                  <SalesChartAdmin />
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="card review">
                <div className="card-header mb-0">
                  <h5>Reviews</h5>
                </div>
                <div className="card-body graph">
                  <ReviewChartAdmin />
                </div>
              </div>
            </div>
          </div>
          {/* Top Selling-Restaurants */}
          {topRestaurants?.length > 0 &&
            <div className='row'>
              <div className="col-12">
                <div className="card top-selling mt-2">
                  <div className="card-header">
                    <h5>Top Selling Restaurants</h5>
                    <div className="filters">
                      <div className="radio-section">
                        <label>
                          <input
                            type="radio"
                            name="filter-table1"
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
                            name="filter-table1"
                            value="month"
                            checked={filters.period === 'month'}
                            onChange={handleFilterChange}
                          />
                          <i></i>
                          <span>Month</span>
                        </label>
                      </div>

                      <div className="date-picker">
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
                  </div>
                  <div className="card-body">
                    <div className="table-responsive theme-scrollbar">
                      <div>
                        <table className="table user-table" id="table_id">
                          <thead>
                            <tr>
                              <th>Restaurant</th>
                              <th>Address</th>
                              <th>Orders</th>
                              <th>Sale</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topRestaurants && topRestaurants.slice(0, 5).map((item, index) => (
                              <tr key={index}>
                                <td>
                                  <div className="table-image short">
                                    <img src={`${item?.restaurant?.logo}`} className="img-fluid"
                                      alt="" />
                                    <h5 className='short'>{item?.restaurant?.name}</h5>
                                  </div>
                                </td>
                                <td className='address short'>
                                  {[
                                    // // // item.restaurant?.primary_address?.room_number,
                                    // // // item.restaurant?.primary_address?.address_line1,
                                    // // // item.restaurant?.primary_address?.organisation,
                                    // // item.restaurant?.primary_address?.premise,
                                    // item.restaurant?.primary_address?.street,
                                    item.restaurant?.primary_address?.posttown,
                                    item.restaurant?.primary_address?.postcode,
                                    item.restaurant?.primary_address?.county,
                                    item.restaurant?.primary_address?.country,
                                  ].filter(part => part).join(', ')}
                                </td>
                                <td> {item.order_count} </td>
                                <td>£{item.total_sales && item.total_sales.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>




      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}

      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>

  )
}

export default DashboardAdmin