import React, { useEffect, useState } from 'react'

import './GeneralSidebar.scss'
import { useNavigate } from 'react-router-dom';
import LogoutPopup from "../../../authentication/common-components/LogoutPopup/LogoutPopup";

const GeneralSidebar = ({ currentActiveIndex,userData }) => {
  const navigate = useNavigate();



  const [isLogoutModalShow, setLogoutModalShow] = useState(false)
const menuItems = [
  { icon: "ri-user-3-line", label: "Change Profile", path: "/profile" },
  { icon: "ri-shopping-bag-3-line", label: "My Order", path: "/orders" },
  { icon: "ri-map-pin-line", label: "Saved Address", path: "/saved-address" },
  // { icon: "ri-bank-card-line", label: "Payment Methods", path: "/saved-payment-methods" },
  // { icon: "ri-wallet-line", label: "My Wallet", path: "/my-wallet" },
  // { icon: "ri-star-line", label: "Dashboard", path: "/my-subscription" },
  // { icon: "ri-gift-line", label: "Purchased Gift Cards", path: "/my-gift-cards" },
  // { icon: "ri-medicine-bottle-line", label: "Food Preferences", path: "/food-preferences" },
  // { icon: "ri-notification-line", label: "Notification Preference", path: "/notification-preferences" },
  // { icon: "ri-wallet-line", label: "Session History", path: "/session-history" },
  { icon: "ri-question-line", label: "Help", path: "/faq" },
  // { icon: "ri-settings-3-line", label: "Settings", path: "/profile-settings" },
  { icon: "ri-logout-box-r-line", label: "Log Out", action: () => setLogoutModalShow(true) },
];


  return (
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

      {isLogoutModalShow && <LogoutPopup setterFunction={setLogoutModalShow}></LogoutPopup>}
    </div>
  )
}
export default GeneralSidebar