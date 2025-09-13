import React, { Component, useState, useEffect } from 'react'
import './Header.scss'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import ProfileMenu from '../ProfileMenu';

import LogoutPopup from "../../../authentication/common-components/LogoutPopup/LogoutPopup";

import NotificationPopup from '../NotificationPopup/NotificationPopup';
import API from '../../../API';
import ErrorModal from '../../../ErrorModal';
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import PositiveModal from '../../../PositiveModal';


const Header = ({ userData, loadUserData, isLoggedIn, notificationData, loadNotificationData }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage for the user's dark mode preference
    const savedMode = localStorage.getItem('dark-mode');
    if (savedMode === 'true') {
      document.body.classList.add('dark-only');
      setIsDarkMode(true);
    }
  }, [])
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        document.body.classList.add('dark-only');
        localStorage.setItem('dark-mode', 'true');
      } else {
        document.body.classList.remove('dark-only');
        localStorage.setItem('dark-mode', 'false');
      }
      return newMode;
    });
  };


  const [isSecurityModalShow, setSecurityModalShow] = useState(false)
  const [isNotificationSettingsShow, setNotificationSettingsShow] = useState(false)

  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false)

  const [isLogoutModalShow, setLogoutModalShow] = useState(false)
  let navigate = useNavigate();


  const myFunction = () => {
    var x = document.getElementById("profile-logout-popup");
    if (x.style.display === "none") {
      x.style.display = "block";
    }
    else {
      x.style.display = "none";
    }

  }
  const [currentStatus, setCurrentStatus] = useState(null);
  const [restaurantData, setRestaurantData] = useState(null);

  // load Restaurant Data
  const loadRestaurantData = () => {
    if (userData?.user_type === 'restaurant') {
      API.get(`/restaurants/user-restaurant/${userData.id}/`)
        .then(response => {
          setRestaurantData(response.data);
          determineInitialStatus(response.data);
        }
        )
        .catch(error => {
          console.error(error);
        })
    } else if (userData?.user_type === 'grocery_store') {
      API.get(`/grocery/user-grocerystore/${userData.id}/`)
        .then(response => {
          setRestaurantData(response.data);
          determineInitialStatus(response.data);
        }
        )
        .catch(error => {
          console.error(error);
        })
    }
  }
  // Determine initial status based on restaurantData keys
  const determineInitialStatus = (data) => {
    if (data.is_paused) {
      setCurrentStatus('paused');
    } else if (data.is_busy) {
      setCurrentStatus('busy');
    } else if (data.is_open) {
      setCurrentStatus('available');
    } else {
      setCurrentStatus('closed');
    }
  };
  useEffect(() => {
    loadRestaurantData();
  }, [userData])


  // Initialize WebSocket connection using react-use-websocket
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const currentUserId = localStorage.getItem('userID')
  const [roomID, setRoomID] = useState('general');
  const WEBSOCKET_BASE_URL = process.env.REACT_APP_WEBSOCKET_BASE_URL
  const token = localStorage.getItem("accessToken");
  

  const loadConversationList = () => {
    if (isLoggedIn) {
      API.get(`/communication/conversations/`)
        .then(response => {
          const chatData = response.data
          const unreadCount = chatData?.filter(chat => chat.unread_messages > 0).length;
          setUnreadChatCount(unreadCount)
        })
        .catch(error => {
        });
    }

  }
  useEffect(() => {
    loadConversationList()
  }, [])

  // for hamburger
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 992);  // Track if sidebar is collapsed
  useEffect(() => {
    const bodyWrapper = document.querySelector('.admin-layout');
    const sidebarWrapper = document.querySelector('.left-navbar.sidebar-wrapper');

    if (bodyWrapper) {
      if (isCollapsed) {
        bodyWrapper.classList.add('collapsed-sidebar');
      } else {
        bodyWrapper.classList.remove('collapsed-sidebar');
      }
    }

    if (sidebarWrapper) {
      if (isCollapsed) {
        sidebarWrapper.classList.add('collapsed');
      } else {
        sidebarWrapper.classList.remove('collapsed');
      }
    }
  }, [isCollapsed]);



  return (
    <div className="admin-header">
      <div className="left" onClick={() => setIsCollapsed(!isCollapsed)} >
       
      </div>
      <div className="right" >
        {isLoggedIn && (['admin','staff'].includes(window.localStorage.getItem("userRole"))) &&
          <div className="btn-box">
            <button className="btn btn-borderless">
            <div className="mode" onClick={toggleDarkMode}>
              {isDarkMode ?
                <i className="ri-lightbulb-line"></i> :
                <i className="ri-moon-line"></i>
              }
            </div>
          </button>
            {
              // localStorage.getItem('userRole') !== 'user' &&
              ['admin', 'restaurant', 'driver'].includes(window.localStorage.getItem("userRole")) &&
              <button className="btn btn-borderless" onClick={() => { navigate('/admin/chat') }}>
                <img src='/images/admin-panel/header/message.svg' className='msg-cion'></img>
                {unreadChatCount > 0 &&
                  <span className='message-badge rounded-pill badge-theme'>{unreadChatCount}</span>
                }
              </button>
            }

            <button className="btn btn-borderless" onClick={() => { setNotificationMenuOpen(!notificationMenuOpen) }}>
              <img src='/images/admin-panel/header/notification.svg'></img>
              {notificationData?.results?.unviewed_count > 0 &&
                <span className='notification-badge rounded-pill badge-theme'>{notificationData?.results?.unviewed_count}</span>
              }
            </button>

          </div>
        }
        {notificationMenuOpen && <NotificationPopup notificationData={notificationData} loadNotificationData={loadNotificationData} setterFunction={setNotificationMenuOpen} />}



        {isLoggedIn && (['admin', 'restaurant', 'staff', 'driver', 'grocery_store'].includes(window.localStorage.getItem("userRole"))) ?
          <div className="user-box" tabIndex="0" onClick={() => setProfileMenuOpen(!profileMenuOpen)} >
            <div className="img-box">
              <img
                src={
                  userData && userData.profile_image
                    ? `${userData.profile_image}`
                    // : userData && userData.user_type === 'driver'
                    //   ? '/images/admin-panel/header/driver-default-avatar.png'
                    : '/images/admin-panel/header/avatar-no-profile-image.png'
                }
                className="rounded"
              />
            </div>
            <img src="/images/admin-panel/header/down-arrow.svg"></img>
            {currentStatus && (
              <>
                <img className='status-img'
                  src={
                    currentStatus === 'available'
                      ? '/images/admin-panel/profile/icon/available.svg'
                      : currentStatus === 'paused'
                        ? '/images/admin-panel/profile/icon/paused.svg'
                        : currentStatus === 'busy'
                          ? '/images/admin-panel/profile/icon/busy.svg'
                          : '/images/admin-panel/profile/icon/closed.svg'
                  }
                  alt={currentStatus}
                />
              </>
            )}
            {profileMenuOpen && <ProfileMenu userData={userData} loadUserData={loadUserData}
              setNotificationSettingsShow={setNotificationSettingsShow} setSecurityModalShow={setSecurityModalShow}
              setLogoutModalShow={setLogoutModalShow} setterFunction={setProfileMenuOpen}>
            </ProfileMenu>}
          </div>
          :
          <div className="login-btn-box">

            <button className="btn btn-primary login-btn " onClick={() => {localStorage.setItem('userRoleRequest', 'admin');localStorage.setItem('LoginRedirectURL', '/admin'); navigate('/admin-login') }}>Log In</button>
            <button className="btn btn-primary signup-btn">Sign Up</button>
          </div>}

      </div>










      {isLogoutModalShow && <LogoutPopup setterFunction={setLogoutModalShow}></LogoutPopup>}
    </div>
  )

}

export default Header