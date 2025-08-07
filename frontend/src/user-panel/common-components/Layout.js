import React from 'react'
import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Header from './Header';
import Footer from './Footer'
import './Layout.css'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import API from "../../API"
import { UserContext } from '../../authentication/pages/UserContext';
import useWebSocket from 'react-use-websocket';

import Home from '../pages/Home/Home';

import Shop from '../pages/Shop/Shop';
import TicketBooking from '../pages/TicketBooking/TicketBooking';

import CheckoutCart from '../pages/CheckoutCart/CheckoutCart';
import CheckoutAddress from '../pages/CheckoutAddress/CheckoutAddress';
import CheckoutPayment from '../pages/CheckoutPayment/CheckoutPayment';
import CheckoutConfirm from '../pages/CheckoutConfirm/CheckoutConfirm';
import CheckoutOptions from '../pages/CheckoutOptions/CheckoutOptions';

import MyOrders from '../pages/MyOrders/MyOrders';


import Profile from '../pages/Profile/Profile';
import Story from '../pages/Story/Story';
import About from '../pages/About/About';
import ContactUs from '../pages/ContactUs/ContactUs';
import NoPage from '../pages/NoPage/NoPage';

import SavedAddress from '../pages/SavedAddress/SavedAddress';


import TermsAndConditions from '../pages/PolicyPages/TermsAndConditions';
import CookiePolicy from '../pages/PolicyPages/CookiePolicy';
import DeliveryPolicy from '../pages/PolicyPages/DeliveryPolicy';
import FAQ from '../pages/PolicyPages/FAQ';
import PrivacyPolicy from '../pages/PolicyPages/PrivacyPolicy';
import RefundAndCancellationPolicy from '../pages/PolicyPages/RefundAndCancellationPolicy';

import { Navigate, useNavigate } from 'react-router-dom';
import { fetchBrowserCurrentLocation, getAddressFromLatLng, playNotificationSound } from '../../GeneralFunctions';

import FloatingMobileNavbar from '../common-components/FloatingMobileNavBar'
const Layout = () => {
  const navigate = useNavigate()

  const [showCookieBar, setShowCookieBar] = useState(true)
  const [notificationData, setNotificationData] = useState(null);
  const [navSelected, setNavSelected] = useState(null)

  const [isNotificatioShown, setNotificationShown] = useState(false)

  const [isNotificationSettingsShow, setNotificationSettingsShow] = useState(false)
  const [isSecurityModalShow, setSecurityModalShow] = useState(false)

  const [navOpen, setnavOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const { isLoggedIn, login, logout } = useContext(UserContext);

    const [ticketSearchFormData, setTicketSearchFormData] = useState( 
      {
         origin: "DEL",
    destination: "DEX",
    departure_date: "2025-08-20",
    adult:1,
    child: 0,
    infant: 0
  });

  const [activePage, setActivePage] = useState([0, "home"]);
  // Location
 const [cartItems, setCartItems] = useState([]);

  const [isNewOrderUpdateShow, setNewOrderUpdateShow] = useState(false);
  


  const locationPath = useLocation().pathname;

  // Scroll to top for all pages,  when route changes 
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [locationPath]);


  // webSocket
  const WEBSOCKET_BASE_URL = process.env.REACT_APP_WEBSOCKET_BASE_URL
  const token = localStorage.getItem("accessToken");
  const socketUrl = `${WEBSOCKET_BASE_URL}/notifications/?token=${token}`

 


 

  const loadNotificationData = () => {
    if (isLoggedIn) {
      API.get(`/communication/notifications/?page_size=20`)
        .then(response => {
          setNotificationData(response.data)
        }
        )
        .catch(error => {
          console.error(error);
        })
    }
  }




  useEffect(() => {
    loadNotificationData()
  }, [isLoggedIn, isNewOrderUpdateShow])





  return (

    <>

      <Header isLoggedIn={isLoggedIn} cartItems={cartItems} activePage={activePage} setActivePage={setActivePage} notificationData={notificationData} loadNotificationData={loadNotificationData} ></Header>
      <svg className='scroll-to-top' width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <circle cx="16.2847" cy="16.2846" r="15.7847" transform="rotate(-90 16.2847 16.2846)" stroke="#d11b4b" />
        <path d="M16.5 10V22M16.5 10L10 15.4M16.5 10L23 15.4" stroke="#d11b4b" stroke-width="1.46001" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <div className='app-content'>
        <Routes>
          <Route index element={<Navigate to="/home" />} />
          <Route path="home" element={
            <Home
              ticketSearchFormData={ticketSearchFormData}
          setTicketSearchFormData={setTicketSearchFormData}
              cartItems={cartItems}
              activePage={activePage} />} />

          <Route path="shop" element={
            <Shop 
          ticketSearchFormData={ticketSearchFormData}
          setTicketSearchFormData={setTicketSearchFormData}
            cartItems={cartItems}
            />} />


<Route path="/book-ticket" element={<TicketBooking ticketSearchFormData={ticketSearchFormData} />} />

          <Route path="checkout-cart" element={<CheckoutCart />} />
          <Route path="checkout-empty-cart" element={<CheckoutCart />} />
          <Route path="checkout-address" element={<CheckoutAddress />} />
          <Route path="checkout-options" element={<CheckoutOptions />} />
          <Route path="checkout-payment" element={<CheckoutPayment  />} />
          <Route path="checkout-confirm" element={<CheckoutConfirm  orderUpdate={isNewOrderUpdateShow} />} />


          <Route path="story" element={<Story />} />
          <Route path="about" element={<About />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="profile" element={<Profile />} />

          <Route path="orders" element={<MyOrders  orderUpdate={isNewOrderUpdateShow} />} />
          <Route path="saved-address" element={<SavedAddress  />} />

          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="cookie-policy" element={<CookiePolicy />} />
          <Route path="delivery-policy" element={<DeliveryPolicy />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="refund-and-cancellation-policy" element={<RefundAndCancellationPolicy />} />

          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
      <Footer activePage={activePage} setActivePage={setActivePage}></Footer>
      {window.innerWidth < 768 && isLoggedIn &&
        <FloatingMobileNavbar></FloatingMobileNavbar>
      }


    </>
  )
}


export default Layout