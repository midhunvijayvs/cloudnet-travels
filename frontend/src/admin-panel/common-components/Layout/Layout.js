import React, { Component } from 'react'
import { useState, useEffect, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import './Layout.scss';
import LeftNavbar from '../LeftNavbar/LeftNavbar'
import Header from '../Header/Header';

import { UserContext } from '../../../authentication/pages/UserContext';
import { useNavigate } from 'react-router-dom';

import API from '../../../API';
import { Navigate } from 'react-router-dom';

// import Profile from '../pages/Profile/Profile'

import '..//css/vendors/font-awesome.css'
import '..//css/vendors/themify.css'
import '..//css/ratio.css'
import '..//css/remixicon.css'
import '..//css/datatables.css'

import '..//css/vendors/scrollbar.css'
import '..//css/vendors/animate.css'
// import '..//css/vendors/bootstrap.css'
import '..//css/vector-map.css'
import '..//css/vendors/dropzone.css'
// import '..//css/vendors/slick.css'

import Dashboard from '../../pages/Dashboard/Dashboard';
import AgencyAdd from '../../pages/AgencyAdd/AgencyAdd';
import AgencyList from '../../pages/AgencyList/AgencyList';
import AgencyDetails from '../../pages/AgencyDetails/AgencyDetails';

import GeneralSettings from '../../pages/GeneralSettings/GeneralSettings';


import NoPage from '../../pages/NoPage';



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
      API.get("/api/user/details/")
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
    <div className='admin-layout'>

      <LeftNavbar isLoggedIn={isLoggedIn}></LeftNavbar>

      <div className='rhs'>

        <Header userData={userData} loadUserData={loadUserData} isLoggedIn={isLoggedIn} ></Header>

        {isLoggedIn && (['admin', 'staff',].includes(window.localStorage.getItem("userRole"))) ?

          <div className='app-content'>
            <Routes>

              <Route index element={<Dashboard role={'restaurant'}/>} />
              <Route path="agency/list" element={<AgencyList/>} />
              <Route path="agency/create" element={<AgencyAdd/>} />
              <Route path="agency/details" element={<AgencyDetails/>} />
              <Route path="settings/general-settings" element={<GeneralSettings/>} />


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