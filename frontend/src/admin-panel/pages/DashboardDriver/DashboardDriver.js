import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import $ from 'jquery';
import './DashboardDriver.scss'

import 'react-datepicker/dist/react-datepicker.css';
import CountUp from 'react-countup';
import DriverPerformanceChart from '../../common-components/DriverPerformanceChart/DriverPerformanceChart';


const DashboardDriver = ({ role, userData }) => {

  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    period: 'month',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    date: null,
  });
  const [orderData, setOrderData] = useState({});
  const [restaurantData, setRestaurantData] = useState({});

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  const loadOrderData = () => {
    let apiUrl = `/order/orders/`;
    API.get(apiUrl)
      .then(response => {
        setOrderData(response.data);
      })
      .catch(error => {
      });
  }
  const loadRestaurantData = () => {
    if (userData) {
      let apiUrl = `/delivery_person/driver-restaurant/${userData.id}`;
      API.get(apiUrl)
        .then(response => {
          setRestaurantData(response.data);
        })
        .catch(error => {
        });
    }
  }

  useEffect(() => {
    loadOrderData();
  }, []);
  useEffect(() => {
    loadRestaurantData();
  }, [userData]);


  return (
    <div className='driver-dashboard-page'>
      <div className=" page-body">
        <div className="container-fluid">
          {/* overview cards */}
          <div className="row">
            {/* Delivery Person */}
            {userData &&
              <div className="col-xl-4 col-lg-6 mb-3 ">
                <div className='card overview restaurant' onClick={() => navigate('/admin/driver-settings')}>
                  <div className="card-body">
                    {userData?.profile_image ?
                      <div className='profile-icon'>
                        <img src={userData.profile_image} />
                      </div>
                      :
                      <div className='icon'>
                        <img src='/images/admin-panel/dashboard/icon/delivery-scooter.svg' />
                      </div>
                    }
                    <h2 className='truncate'>
                      Hi, {userData?.first_name ?? 'Unknown'}
                    </h2>
                    <div className='rest-content'>
                      <img src='/images/admin-panel/dashboard/icon/restaurant.svg' className='restaurant-icon' />
                      <h5>
                        {restaurantData?.name}
                      </h5>
                    </div>
                  </div>
                  <div className='bg-icon'>
                    {/* <img src={`${restaurantData.logo}` ?? '/images/no-restaurant-img.jpg'} /> */}
                    <img src={`${restaurantData.logo}` ?? '/images/no-restaurant-img.jpg'} />
                  </div>
                </div>
              </div>
            }
            {/* sale */}
            <div className="col-xl-4 col-lg-6 mb-3 d-none">
              <div className='card overview sale'>
                <div className="card-body">
                  <div className='icon'>
                    <img src='/images/admin-panel/dashboard/icon/money.svg' />
                  </div>
                  <h2 className='truncate'>
                    <CountUp
                      start={0}
                      end={orderData.total_sales}
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
            {/* Order */}
            <div className="col-xl-4 col-lg-6 mb-3">
              <div className='card overview order' onClick={() => navigate('/admin/orders/list')}>
                <div className="card-body">
                  <div className='icon'>
                    <img src='/images/admin-panel/dashboard/icon/order.svg' />
                  </div>
                  <h2>
                    <CountUp
                      start={0}
                      end={orderData.count}
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
            {/* Performance */}
            <div className="col-xl-12">
              <div className="card">
                <div className="card-header mb-0">
                  <h5>Performance</h5>
                </div>
                <div className="card-body graph">
                  <DriverPerformanceChart source={'dashboard'} />
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

export default DashboardDriver