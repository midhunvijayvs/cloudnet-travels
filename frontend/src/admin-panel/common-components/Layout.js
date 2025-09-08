import React, { Component } from 'react'
import { useState, useEffect, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import './Layout.scss';
import LeftNavbar from './LeftNavbar'
import Header from './Header';

import { UserContext } from '../../authentication/pages/UserContext';
import { useNavigate } from 'react-router-dom';

import API from '../../API';
import { Navigate } from 'react-router-dom';

// import Profile from '../pages/Profile/Profile'

import '../common-components/css/vendors/font-awesome.css'
import '../common-components/css/vendors/themify.css'
import '../common-components/css/ratio.css'
import '../common-components/css/remixicon.css'
import '../common-components/css/datatables.css'

import '../common-components/css/vendors/scrollbar.css'
import '../common-components/css/vendors/animate.css'
// import '../common-components/css/vendors/bootstrap.css'
import '../common-components/css/vector-map.css'
import '../common-components/css/vendors/dropzone.css'
// import '../common-components/css/vendors/slick.css'
import '../common-components/css/style.scss'

import Dashboard from '../pages/Dashboard/Dashboard';
import MenuItemList from '../pages/MenuItemList/MenuItemList';
import AgencyAdd from '../pages/AgencyAdd/AgencyAdd';
import AgencyList from '../pages/AgencyList/AgencyList';
import AgencyDetails from '../pages/AgencyDetails/AgencyDetails';
import NoPage from '../pages/NoPage';



const Layout = () => {


  let navigate = useNavigate();


  const [userData, setUserData] = useState(null);


  // instant popups
  const [notificationData, setNotificationData] = useState(null);
  const [lastNotificationId, setLastNotificationId] = useState(null);
  const [isNewOrderModalShow, setNewOrderModalShow] = useState(false);
  const [isScheduledOrderModalShow, setScheduledOrderModalShow] = useState(false);
  const [isDriverOrderModalShow, setDriverOrderModalShow] = useState(false);
  const [newOrderItem, setNewOrderItem] = useState(null);



  const [navOpen, setnavOpen] = useState(false);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const { isLoggedIn, login, logout } = useContext(UserContext);



  const loadUserData = () => {
    if (window.localStorage.getItem('userID')) {
      API.get(`/api/user/${window.localStorage.getItem('userID')}/`)
        .then(response => {

          setUserData(response.data)
          // console.log("userdata from adminlayout", userData)
        })

        .catch(error => {
          console.error(error);
        });
    }
  }

  useEffect(() => {
   
    loadUserData();
  }, [isLoggedIn])




  return (
    <div className='admin-layout compact-wrapper'>


      <Header userData={userData} loadUserData={loadUserData} isLoggedIn={isLoggedIn} ></Header>
      {/* Location Tracker */}
   

      <div className='page-body-wrapper'>
        <LeftNavbar isLoggedIn={isLoggedIn}></LeftNavbar>

        {isLoggedIn && (['admin', 'restaurant', 'staff', 'driver', 'grocery_store'].includes(window.localStorage.getItem("userRole"))) ?

          <div className='app-content'>
            <Routes>

              <Route index element={<Dashboard role={'restaurant'} />} />


           
              <Route path="menu-item/list" element={<MenuItemList />} />
              <Route path="agency/list" element={<AgencyList />} />
              <Route path="agency/create" element={<AgencyAdd />} />
              <Route path="agency/details" element={<AgencyDetails />} />
              

              <Route path="*" element={<NoPage />} />
            </Routes>
      
          </div>
          :
          <div className="auth-mask">
            <p>Please login as Admin to continue</p>
          </div>
        }

      </div>
    </div>
  )

}

export default Layout