import React, { useState, useEffect, useRef } from "react";
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../authentication/pages/UserContext';
import API from '../../API';
import ErrorModal from '../../ErrorModal';
import FixedOverlayLoadingSpinner from "../../FixedOverlayLoadingSpinner"
import PositiveModal from '../../PositiveModal';

import './ProfileMenu.scss';
const View = ({ userData, loadUserData, setNotificationSettingsShow, setSecurityModalShow, setLogoutModalShow, setterFunction }) => {

  let navigate = useNavigate();
  const popupRef = useRef(null);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const { isLoggedIn, login, logout } = useContext(UserContext);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('Accepting Orders');
  const [restaurantData, setRestaurantData] = useState({});

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
      setCurrentStatus('Paused New Orders');
    } else if (data.is_busy) {
      setCurrentStatus('Busy');
    } else if (data.is_open) {
      setCurrentStatus('Accepting Orders');
    } else {
      setCurrentStatus('Closed');
    }
  };
  // Dynamically generate the button class name based on currentStatus
  const getStatusClassName = () => {
    let className = 'btn btn-secondary status-change ';
    if (currentStatus === 'Paused New Orders') className += 'status-paused';
    else if (currentStatus === 'Busy') className += 'status-busy';
    else if (currentStatus === 'Accepting Orders') className += 'status-available';
    else className += 'status-closed';
    return className;
  };

  useEffect(() => {
    loadRestaurantData();
  }, [])

  const handleStatusChange = (status) => {
    setIsStatusOpen(false);
    let payLoad;
    if (status === 'available') {
      payLoad = { is_busy: false, is_paused: false, is_closed: false }
    } else if (status === 'is_busy') {
      payLoad = { is_busy: true, is_paused: false, is_closed: false }
    } else if (status === 'is_paused') {
      payLoad = { is_busy: false, is_paused: true, is_closed: false }
    } else if (status === 'is_closed') {
      payLoad = { is_busy: false, is_paused: false, is_closed: true }
    } else {

      return;
    }

    let apiUrl = `/restaurants/${restaurantData.id}/`
    if (userData?.user_type === 'grocery_store') {
      apiUrl = `/grocery/${restaurantData.id}/`
    }

    API.put(apiUrl, payLoad)
      .then(response => {
        // setIsLoading(false);
        loadRestaurantData();
        loadUserData()
      })
      .catch(error => {
        // setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });
  };


  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setterFunction(false);
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div className="admin-profile " ref={popupRef}>
      <div className="profile-menu">
        {isLoggedIn && userData ?
          <div className="profile-header">
            <div className="img-circle">
              <img src={userData.profile_image ? `${userData.profile_image}` : "/images/profile/avatar-no-profile-image.png"}></img>
            </div>
            <div className="text-box">
              <h4>{userData.first_name} {userData.last_name}</h4>
              <p>{userData.email}</p>
            </div>
          </div>
          :
          <div className="profile-header">
            <div className="img-circle">
              <img src="/images/profile/avatar-no-profile-image.png"></img>
            </div>
            <div className="text-box">
              <h4>Hello There</h4>
              <p>Please login or SignUp</p>
            </div>
          </div>}
        <div className="body">
          <div className="status-dropdown">
            {(userData?.user_type === 'restaurant' || userData?.user_type === 'grocery_store') && (
              <div className="dropdown">
                <button className={getStatusClassName()}
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsStatusOpen(!isStatusOpen);
                  }} >
                  {currentStatus === 'Accepting Orders' ?
                    <img src="/images/admin-panel/profile/icon/available.svg" />
                    : currentStatus === 'Paused New Orders' ?
                      <img src="/images/admin-panel/profile/icon/paused.svg" />
                      : currentStatus === 'Busy' ?
                        <img src="/images/admin-panel/profile/icon/busy.svg" />
                        :
                        <img src="/images/admin-panel/profile/icon/closed.svg" />
                  }
                  {currentStatus}
                  <img className="down-arrow" src="/images/admin-panel/header/down-arrow.svg"></img>
                </button>
                {isStatusOpen && (
                  <div className="dropdown-menu">
                    <button key={"available"}
                      className="dropdown-item"
                      onClick={(event) => { event.stopPropagation(); handleStatusChange("available") }} >
                      <img src="/images/admin-panel/profile/icon/available.svg" />
                      Accepting Orders
                    </button>
                    <button key={"is_busy"}
                      className="dropdown-item"
                      onClick={(event) => { event.stopPropagation(); handleStatusChange("is_busy") }} >
                      <img src="/images/admin-panel/profile/icon/busy.svg" />
                      Busy
                    </button>
                    <button key={"is_paused"}
                      className="dropdown-item"
                      onClick={(event) => { event.stopPropagation(); handleStatusChange("is_paused") }} >
                      <img src="/images/admin-panel/profile/icon/paused.svg" />
                      Pause New Orders
                    </button>
                    <button key={"is_closed"}
                      className="dropdown-item"
                      onClick={(event) => { event.stopPropagation(); handleStatusChange("is_closed") }} >
                      <img src="/images/admin-panel/profile/icon/closed.svg" />
                      Closed
                    </button>

                  </div>
                )}
              </div>
            )}
          </div>
          <button className="btn btn-secondary" onClick={() => navigate("/admin/profile")}>
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.2207 22.9355C4.2207 20.8138 5.06356 18.779 6.56385 17.2787C8.06414 15.7784 10.099 14.9355 12.2207 14.9355C14.3424 14.9355 16.3773 15.7784 17.8776 17.2787C19.3778 18.779 20.2207 20.8138 20.2207 22.9355H4.2207ZM12.2207 13.9355C8.9057 13.9355 6.2207 11.2505 6.2207 7.93555C6.2207 4.62055 8.9057 1.93555 12.2207 1.93555C15.5357 1.93555 18.2207 4.62055 18.2207 7.93555C18.2207 11.2505 15.5357 13.9355 12.2207 13.9355Z" fill="#325A3E" />
            </svg>
            Edit Profile
          </button>


        </div>

        <div className="footer">
          <button className="btn theme-outline" onClick={() => setLogoutModalShow(true)}><svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3078 17.9634C13.5364 18.1635 13.7935 18.2492 14.0506 18.2492C14.3649 18.2492 14.6792 18.1063 14.9079 17.8492L18.5079 13.6775C18.8794 13.249 18.8794 12.6204 18.5079 12.1917L14.9079 8.02021C14.5079 7.5345 13.7651 7.47728 13.3079 7.906C12.8222 8.30601 12.7649 9.0488 13.1937 9.50601L15.1652 11.7919L7.93637 11.7917C7.30778 11.7917 6.79358 12.3059 6.79358 12.9345C6.79358 13.563 7.30778 14.0772 7.93637 14.0772H15.1652L13.1937 16.3631C12.7651 16.849 12.8224 17.5633 13.3081 17.9633L13.3078 17.9634Z" fill="#d11b4b" />
            <path d="M21.6225 9.25018C21.8511 9.82158 22.5369 10.1074 23.1083 9.87877C23.6797 9.65017 23.9656 8.96435 23.7369 8.39295C21.8798 3.84999 17.5081 0.935547 12.6223 0.935547C5.99345 0.935547 0.621826 6.30717 0.621826 12.936C0.621826 19.5648 5.99345 24.9364 12.6223 24.9364C17.5082 24.9364 21.8797 22.022 23.7369 17.479C23.9655 16.9076 23.7084 16.2218 23.1083 15.9932C22.5369 15.7646 21.8511 16.0217 21.6225 16.6218C20.1082 20.2792 16.5938 22.6506 12.6222 22.6506C7.27915 22.6506 2.90757 18.279 2.90757 12.9359C2.90757 7.59287 7.27915 3.22129 12.6222 3.22129C16.5938 3.22109 20.1082 5.59265 21.6225 9.25008V9.25018Z" fill="#d11b4b" />
          </svg>
            Logout</button>
        </div>
      </div>

      {isLoading && <FixedOverlayLoadingSpinner />}
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen}
        okClickedFunction={() => { setIsMessageModalOpen(false) }} />}
    </div>
  )
}

export default View;