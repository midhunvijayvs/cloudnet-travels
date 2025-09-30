import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import API from '../../../API.js';
import '../../common-components/MultipleImageUploader.css'
import './SupportPagesLayout.scss'
import ErrorModal from "../../../ErrorModal.js";
import PositiveModal from "../../../PositiveModal.js";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner.js"
import PhoneInputField from '../../../authentication/pages/CustomPhone/CustomPhoneInput.js';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { UserContext } from '../../../authentication/pages/UserContext.js';
import ChangePasswordPopup from '../ChangePasswordPopup/ChangePasswordPopup.js';

const Profile = ({userData,loadUserData, currentActiveIndex, title, breadcrumb, children }) => {

  const navigate = useNavigate()

  const [previewImage, setPreviewImage] = useState(null);

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [isLogoutModalShow, setLogoutModalShow] = useState(false)
  const menuItems = [
    { icon: "ri-user-3-line", label: "My Profile", path: "/profile" },
    { icon: "ri-shopping-bag-3-line", label: "My Bookings", path: "/bookings" },
    // { icon: "ri-map-pin-line", label: "Saved Address", path: "/saved-address" },
    // { icon: "ri-bank-card-line", label: "Payment Methods", path: "/saved-payment-methods" },
    { icon: "ri-wallet-line", label: "My Wallet", path: "/wallet" },
    // { icon: "ri-star-line", label: "Dashboard", path: "/my-subscription" },
    // { icon: "ri-gift-line", label: "Purchased Gift Cards", path: "/my-gift-cards" },
    // { icon: "ri-medicine-bottle-line", label: "Food Preferences", path: "/food-preferences" },
    // { icon: "ri-notification-line", label: "Notification Preference", path: "/notification-preferences" },
    { icon: "ri-wallet-line", label: "Session History", path: "/session-history" },
    { icon: "ri-question-line", label: "Help", path: "/faq" },
    // { icon: "ri-settings-3-line", label: "Settings", path: "/profile-settings" },
    { icon: "ri-logout-box-r-line", label: "Log Out", action: () => setLogoutModalShow(true) },
  ];






  


  return (
    <div className='support-pages-layout'>
      <section className="mini-banner">
        <div className="inner">
          <h2>{title}</h2>
          <ol className='breadcrumb' aria-label="breadcrumb">
            <li className="breadcrumb-item">
              <a onClick={() => navigate(breadcrumb[0].link)}><i className="ri-home-line"></i>{breadcrumb[0].name}</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              <a onClick={() => navigate(breadcrumb[1].link)}><i className="ri-home-line"></i>{breadcrumb[1].name}</a>

            </li>
          </ol>
        </div>
      </section>

      <section className="sec-2">
        <div className="lhs">
          <div className="general-sidebar">
            <div className="profile-cover">
              <img className="img-fluid profile-pic" src={`${userData && userData.profile_image ? userData.profile_image : '/images/no-profile-image.png'}`} alt="profile" />
            </div>
            <div className="profile-name">
              <h5 className="user-name">
                {userData && userData.first_name} &nbsp;
                {userData && userData.last_name}
              </h5>
              <h6>{userData && userData.email}</h6>
            </div>

            <ul className="profile-list">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className={currentActiveIndex == index ? "active" : ""}
                >
                  <i className={item.icon}></i>
                  {item.path ? (
                    <a onClick={() => navigate(item.path)}>{item.label}</a>
                  ) : (
                    <a onClick={item.action}>{item.label}</a>
                  )}
                </li>
              ))}
            </ul>

          </div>
        </div>


        <div className="rhs">{children}</div>
      </section>

    </div>
  )

}

export default Profile 