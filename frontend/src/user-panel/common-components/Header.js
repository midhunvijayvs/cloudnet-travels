import React, { useContext, useEffect, useState, useRef } from 'react'
import './Header.scss'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import LogoutPopup from "../../authentication/common-components/LogoutPopup/LogoutPopup";
import $ from 'jquery';
import NavPane from './NavPane/NavPane';
import { UserContext } from '../../authentication/pages/UserContext';
import NotificationPopup from './NotificationPopup/NotificationPopup.js';

import { DollarSign } from "react-feather";


const Header = ({ userData, loadUserData, cartItems, setActivePage, activePage, notificationData, loadNotificationData }) => {

  const navigate = useNavigate();

  const isHomePage = window.location.pathname.endsWith('/home');
  const isContactUsPage = window.location.pathname.endsWith('/contact-us');

  const [isLogoutModalShow, setLogoutModalShow] = useState(false)


  const [isNavpaneOpen, setNavPaneOpen] = useState(false);

  const { isLoggedIn } = useContext(UserContext);

  useEffect(() => {
    console.log("isLoggedIn frm header:", isLoggedIn)
  }, [isLoggedIn]);

  // For Security popup, not implemented, but the states are just to make the switch UI work

  useEffect(() => {

    setActivePage(localStorage.getItem("activePage[0]"))
  }, [])

  useEffect(() => {
    if (isNavpaneOpen) {
      $(".menu-box").addClass('active')

    }
    else {
      $(".menu-box").removeClass('active')
    }
  }, [isNavpaneOpen])


  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [navClass, setNavClass] = useState("");






  useEffect(() => {
    console.log("isLoggedIn  frm header", isLoggedIn)
    console.log("userData  frm header", userData)
  }, [isLoggedIn, userData]
  )
  useEffect(() => {
    const handleScroll = () => {

      const scrollPosition = window.scrollY;

      // Check if scroll position is at 100vh
      if (scrollPosition > lastScrollTop) {
        $(".header").addClass("shrinked");
      } else {
        $(".header").removeClass("shrinked");


      }
      setLastScrollTop(scrollPosition <= 0 ? 0 : scrollPosition);


    }
    window.addEventListener('scroll', handleScroll);

    // Clean up event listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);


  // Set activePage[0] based on the current URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path.endsWith('/features')) {
      setActivePage(1);
    } else if (path.endsWith('/solutions')) {
      setActivePage(2);
    } else if (path.endsWith('/pricing')) {
      setActivePage(3);
    } else if (path.endsWith('/about-us')) {
      setActivePage(4);
    } else if (path.endsWith('/contact-us')) {
      setActivePage(5);
    } else {
      setActivePage(0);
    }
  }, [window.location.pathname]); // Run this effect whenever the path changes

  const calculateCartSum = () => {
    let sum = 0;

    cartItems?.forEach((item) => {
      // Ensure base price is a valid number and multiply by count
      let itemBasePrice = (parseFloat(item.variant?.offer_price || item.menu_item.offer_price) || 0) * (item.count || 1);

      // Calculate toppings total safely, avoiding NaN issues
      let toppingsTotal = item.toppings?.reduce(
        (acc, t) => acc + ((parseFloat(t.topping?.price) || 0) * (t.count || 1)),
        0
      ) || 0;

      // Add menu item total and toppings total separately
      sum += itemBasePrice + toppingsTotal;
    });

    return Number(sum.toFixed(2)); // Ensure return type is a number
  };

  const subTotal = calculateCartSum();

  const [openDropDown, setOpenDropDown] = useState(false);
  const profileRef = useRef(null);
  const walletRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileRef.current && !profileRef.current.contains(e.target) &&
        walletRef.current && !walletRef.current.contains(e.target)
      ) {
        setOpenDropDown(null); // close all
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={isHomePage ? 'header home-page-header' : "header"} id='header'  >
      <div>
        <img className='app-logo' onClick={() => { navigate('/'); }} role='button' src="/images/header/app-logo.png" alt=''></img>
        <h5 className='logo-description'> Booking Portal</h5>

      </div>



      <div className='menu-box montserrat-bold'>

        <svg className='back-btn' width="32"
          height="32"
          viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setNavPaneOpen(false)}>
          <path d="M6 0C4.81331 0 3.65328 0.351894 2.66658 1.01118C1.67989 1.67047 0.910851 2.60754 0.456725 3.7039C0.00259971 4.80025 -0.11622 6.00666 0.115291 7.17054C0.346802 8.33443 0.918247 9.40352 1.75736 10.2426C2.59648 11.0818 3.66557 11.6532 4.82946 11.8847C5.99335 12.1162 7.19974 11.9974 8.2961 11.5433C9.39246 11.0891 10.3295 10.3201 10.9888 9.33342C11.6481 8.34672 12 7.18669 12 6C11.9983 4.40922 11.3656 2.88407 10.2408 1.75921C9.11593 0.63436 7.59078 0.0016799 6 0ZM8.63423 6.32654L6.78808 8.17269C6.70148 8.25929 6.58402 8.30795 6.46154 8.30795C6.33906 8.30795 6.2216 8.25929 6.135 8.17269C6.0484 8.08609 5.99974 7.96863 5.99974 7.84615C5.99974 7.72368 6.0484 7.60622 6.135 7.51961L7.19366 6.46154H3.69231C3.5699 6.46154 3.45251 6.41291 3.36595 6.32636C3.2794 6.2398 3.23077 6.12241 3.23077 6C3.23077 5.87759 3.2794 5.7602 3.36595 5.67364C3.45251 5.58709 3.5699 5.53846 3.69231 5.53846H7.19366L6.135 4.48038C6.0484 4.39378 5.99974 4.27632 5.99974 4.15385C5.99974 4.03137 6.0484 3.91391 6.135 3.82731C6.2216 3.7407 6.33906 3.69205 6.46154 3.69205C6.58402 3.69205 6.70148 3.7407 6.78808 3.82731L8.63423 5.67346C8.67714 5.71632 8.71119 5.76723 8.73441 5.82326C8.75764 5.87929 8.76959 5.93935 8.76959 6C8.76959 6.06065 8.75764 6.12071 8.73441 6.17674C8.71119 6.23277 8.67714 6.28367 8.63423 6.32654Z" fill="white" />
        </svg>





        <span onClick={() => { setActivePage([1, "contact-us"]); navigate('/contact-us'); setNavPaneOpen(false) }} className={`main-menu-item ${(activePage[0] === 3) && 'active'}`}>
          <div className='text'>
            Contact
          </div>
        </span>


        <span onClick={() => { setActivePage([2, "about"]); navigate('/about'); setNavPaneOpen(false) }} className={`main-menu-item ${(activePage[0] === 4) && 'active'}`}>
          <div className='text'>
            About Us
          </div>
        </span>






        <span onClick={() => { setActivePage([3, "payment"]); navigate('/payment'); setNavPaneOpen(false) }} className={`main-menu-item ${(activePage[0] === 7) && 'active'}`}>
          <div className='text'>
            Payment
          </div>
        </span>


        <span onClick={() => { setActivePage([10, "logout"]); setLogoutModalShow(true); setNavPaneOpen(false) }} className={`main-menu-item ${(activePage[0] === 10) && 'active'} tab-and-mob-only ${!isLoggedIn && 'd-none'} `}>


          <div className='text'>
            Logout
          </div>
        </span>


        {isLoggedIn && userData ?
          <div className="loged-in-buttons-container">

            {userData.user_type == "agency" &&
              <div className={`dropdown-button wallet-part ${openDropDown === 0 ? 'active' : ''}`}
                onClick={() => setOpenDropDown(prev => (prev === 0 ? null : 0))}
                ref={walletRef}
              >
            

                <div className='wallet-menu'> 
                <img className="icon" src={ '/images/header/wallet.png'} alt="icon"></img>
                 <div className='text-box'>
                    <div className='label' >Wallet Balance:</div>
                  <div className='value'>₹ {`${userData.agency.wallet_balance}`}</div>
                </div>
                </div>


                <div className="onhover-box ">
                  <ul className="menu-list">
                    <li>
                      <div className="btn-primary" onClick={() => navigate('/wallet')}><DollarSign/>
                      Recharge Now!</div>
                    </li>
                    <li>
                      <div className="dropdown-item" onClick={() => navigate('/wallet')}>My Wallet</div>
                    </li>


                  </ul>

             

                </div>
              </div>
            }

            <div className={`dropdown-button profile-part ${openDropDown === 1 ? 'active' : ''}`}
              onClick={() => setOpenDropDown(prev => (prev === 1 ? null : 1))}
              ref={profileRef}
            >
              <img className="img-fluid profile-pic" src={`${userData && userData.profile_image ? userData.profile_image : '/images/no-profile-image.png'}`} alt="profile"></img>

              <div>
                <h6 className="fw-normal">Hi, {`${userData.first_name} ${userData.last_name} `}</h6>
                {userData.user_type == "agency" ?
                  <h5 className="fw-medium">{userData.agency.agency_name}</h5>
                  : <h5 className="fw-medium text-danger">You are and admin or staff. Please login as an Agency to use this user panel</h5>

                }
                {userData.user_type == "agency" && <h6>ID:CLDNTAGNT0{userData.agency.id}</h6>}
              </div>
              <div className="onhover-box ">
                <ul className="menu-list">
                  <li>
                    <div className="dropdown-item" onClick={() => navigate('/profile')}>Profile</div>
                  </li>
                  <li>
                    <div className="dropdown-item" onClick={() => navigate('/orders')}>My Bookings</div>
                  </li>


                </ul>

                <div className="logout-btn-container">
                  <button onClick={() => setLogoutModalShow(true)} className="logout-btn">
                    <i className="ri-login-box-line me-2"></i>
                    Logout
                  </button>
                </div>

              </div>
            </div>
          </div>
          :
          <div className='auth-buttons-container'>
            <button onClick={() => navigate('/sign-up')} className='signup-btn'>SIGNUP</button>
            <button onClick={() => { localStorage.setItem('userRoleRequest', 'user'); localStorage.setItem('LoginRedirectURL', '/home'); navigate('/login'); }} className='login-btn'>LOGIN</button>
          </div>
        }


        <p className="social-heading">Follow Us</p>
        
        <div className="social-box">
          <img src="/images/twitter.svg" alt="Twitter" />
          <img src="/images/linkedin.svg" alt="Linkedin" />
          <img src="/images/instagram.svg" alt="Instagram" />
          <img src="/images/facebook.svg" alt="Facebook" />
          <img src="/images/youtube.svg" alt="Youtube" />
        </div>
      </div>



      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className='hamburger' onClick={() => setNavPaneOpen(true)}>
        <rect width="30" height="30" rx="4" fill="#081028" />
        <path d="M24 15.4214C24 15.6447 23.9199 15.8589 23.7774 16.0168C23.6349 16.1747 23.4416 16.2634 23.24 16.2634H13.3603C13.1588 16.2634 12.9655 16.1747 12.823 16.0168C12.6804 15.8589 12.6004 15.6447 12.6004 15.4214C12.6004 15.198 12.6804 14.9839 12.823 14.8259C12.9655 14.668 13.1588 14.5793 13.3603 14.5793H23.24C23.4416 14.5793 23.6349 14.668 23.7774 14.8259C23.9199 14.9839 24 15.198 24 15.4214ZM13.3603 9.52687H23.24C23.4416 9.52687 23.6349 9.43816 23.7774 9.28024C23.9199 9.12232 24 8.90813 24 8.6848C24 8.46147 23.9199 8.24729 23.7774 8.08937C23.6349 7.93145 23.4416 7.84273 23.24 7.84273H13.3603C13.1588 7.84273 12.9655 7.93145 12.823 8.08937C12.6804 8.24729 12.6004 8.46147 12.6004 8.6848C12.6004 8.90813 12.6804 9.12232 12.823 9.28024C12.9655 9.43816 13.1588 9.52687 13.3603 9.52687ZM23.24 21.3159H6.52055C6.31899 21.3159 6.12569 21.4046 5.98317 21.5625C5.84064 21.7204 5.76057 21.9346 5.76057 22.1579C5.76057 22.3813 5.84064 22.5954 5.98317 22.7534C6.12569 22.9113 6.31899 23 6.52055 23H23.24C23.4416 23 23.6349 22.9113 23.7774 22.7534C23.9199 22.5954 24 22.3813 24 22.1579C24 21.9346 23.9199 21.7204 23.7774 21.5625C23.6349 21.4046 23.4416 21.3159 23.24 21.3159ZM9.56045 17.1055C9.76201 17.1055 9.95532 17.0168 10.0978 16.8589C10.2404 16.701 10.3204 16.4868 10.3204 16.2634V7.84273C10.3205 7.67609 10.276 7.51316 10.1925 7.37456C10.109 7.23596 9.99031 7.12793 9.85137 7.06414C9.71242 7.00035 9.55953 6.98367 9.41203 7.01622C9.26453 7.04876 9.12906 7.12907 9.02277 7.24697L5.22289 11.4573C5.15223 11.5355 5.09618 11.6284 5.05793 11.7306C5.01969 11.8328 5 11.9424 5 12.0531C5 12.1637 5.01969 12.2733 5.05793 12.3755C5.09618 12.4778 5.15223 12.5706 5.22289 12.6489L9.02277 16.8592C9.0934 16.9374 9.17724 16.9994 9.2695 17.0416C9.36176 17.0839 9.46062 17.1056 9.56045 17.1055Z" fill="white" />
      </svg>





      {/* <NavPane setterFunction={setNavPaneOpen}></NavPane> */}
      {isLogoutModalShow && <LogoutPopup setterFunction={setLogoutModalShow}></LogoutPopup>}

    </div>
  )
}


export default Header


