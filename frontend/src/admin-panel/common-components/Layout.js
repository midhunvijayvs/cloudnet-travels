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

import Profile from '../pages/Profile/Profile'
import InvoiceList from '../pages/InvoiceList/InvoiceList';

import RestaurantInfo from '../pages/RestaurantInfo/RestaurantInfo';

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
import MenuCategoryList from '../pages/MenuCategoryList/MenuCategoryList';
// import MenuCategoryCreate from '../pages/MenuCategoryCreate/MenuCategoryCreate';
import MenuItemList from '../pages/MenuItemList/MenuItemList';
import DineInList from '../pages/DineInList/DineInList';
import MenuItemAdd from '../pages/MenuItemAdd/MenuItemAdd';
import RestaurantList from '../pages/RestaurantList/RestaurantList';
import DriverList from '../pages/DriverList/DriverList';
import CuisineList from '../pages/CuisineList/CuisineList';
import CurrencyList from '../pages/CurrencyList/CurrencyList';
import MenuUnitList from '../pages/MenuUnitList/MenuUnitList';
import DriverAdd from '../pages/DriverAdd/DriverAdd';
import OrdersList from '../pages/OrdersList/OrdersList';
import OrdersDetails from '../pages/OrdersDetails/OrdersDetails';
import OrdersTracking from '../pages/OrdersTracking/OrdersTracking';
import OrderReviewList from '../pages/OrderReviewList/OrderReviewList';
import OrderItemReviewList from '../pages/OrderItemReviewList/OrderItemReviewList';
import MenuItemReview from '../pages/MenuItemReview/MenuItemReview';
import InvoiceDetails from '../pages/InvoiceDetails/InvoiceDetails';
import UsersList from '../pages/UsersList/UsersList';
import UsersAdd from '../pages/UsersAdd/UsersAdd';
import TicketsList from '../pages/TicketsList/TicketsList';
import TicketsAdd from '../pages/TicketsAdd/TicketsAdd';
import TicketsDetails from '../pages/TicketsDetails/TicketsDetails';
import UsersDetails from '../pages/UsersDetails/UsersDetails';
import Reports from '../pages/Reports/Reports';
import UsersPermission from '../pages/UsersPermission/UsersPermission';
import NoPage from '../pages/NoPage';
import UserDeletionList from '../pages/UserDeletionList/UserDeletionList';
import DriverSettings from '../pages/DriverSettings/DriverSettings';
import AdminSettings from '../pages/AdminSettings/AdminSettings';
import MailList from '../pages/MailList/MailList';
import MailListAdd from '../pages/MailListAdd/MailListAdd';
import MenuCombinationList from '../pages/MenuCombinationList/MenuCombinationList';
import MenuCombinationAdd from '../pages/MenuCombinationAdd/MenuCombinationAdd';
import CouponAdd from '../pages/CouponAdd/CouponAdd';
import CouponList from '../pages/CouponList/CouponList';
import BlogList from '../pages/BlogList/BlogList';
import BlogAdd from '../pages/BlogAdd/BlogAdd';
import DashboardRestaurant from '../pages/DashboardRestaurant/DashboardRestaurant';
import NewOrderPopup from './NewOrderPopup/NewOrderPopup';
import { playNewOrderSound, playNotificationSound } from '../../GeneralFunctions';
import AuditList from '../pages/AuditList/AuditList';
import RestaurantPaymentList from '../pages/RestaurantPaymentList/RestaurantPaymentList';
import ScheduledOrderPopup from './ScheduledOrderPopup/ScheduledOrderPopup';
import ChatClient from '../pages/Chat/Chat';
import GiftCardList from '../pages/GiftCardList/GiftCardList';
import GiftCardAdd from '../pages/GiftCardAdd/GiftCardAdd';

import UserLocationTracker from './UserLocationTracker/UserLocationTracker';
import DriverReviewList from '../pages/DriverReviewList/DriverReviewList';
import RestaurantPdf from './RestaurantPdf/RestaurantPdf';
import RegistrationAuditList from '../pages/RegistrationAuditList/RegistrationAuditList';
import ActivityAuditList from '../pages/ActivityAuditList/ActivityAuditList';
import PaymentAuditList from '../pages/PaymentAuditList/PaymentAuditList';
import DeliveryAuditList from '../pages/DeliveryAuditList/DeliveryAuditList';
import EnquiryList from '../pages/EnquiryList/EnquiryList';
import NotificationList from '../pages/NotificationList/NotificationList';
import DriverDetails from '../pages/DriverDetails/DriverDetails';
import DriverNewOrderPopup from './DriverNewOrderPopup/DriverNewOrderPopup';
import OrderModificationByCustomerPopup from './OrderModificationByCustomerPopup/OrderModificationByCustomerPopup';
import RestaurantPayoutHistoryList from '../pages/RestaurantPayoutHistoryList/RestaurantPayoutHistoryList';
import SessionHistory from '../pages/SessionHistory/SessionHistory';
import SubscriptionTiers from '../pages/SubscriptionTiers/SubscriptionTiers';
import SubscriptionTiersMerchant from '../pages/SubscriptionTiersMerchant/SubscriptionTiersMerchant';
import CurrentSubscription from '../pages/CurrentSubscription/CurrentSubscription';


const Layout = () => {


  let navigate = useNavigate();


  const [userData, setUserData] = useState(null);

  const [isNotificationSettingsShow, setNotificationSettingsShow] = useState(false)

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

  const toggleLeftNav = () => {
    setnavOpen(!navOpen)
  }


  const loadUserData = () => {
    if (window.localStorage.getItem('userID')) {
      API.get(`/user/users/${window.localStorage.getItem('userID')}/`)
        .then(response => {

          setUserData(response.data)
          // console.log("userdata from adminlayout", userData)
        })

        .catch(error => {
          console.error(error);
        });
    }
  }

  const [subscriptionHistory, setSubscriptionHistory] = useState(null)
  const loadSubscriptionHistory = () => {
    if (isLoggedIn) {
      API.get(`/payments/merchant-subscriptions/`)
        .then(response => {
          setSubscriptionHistory(response.data)
        })
        .catch(error => {

        });
    }
  }

  const loadNotificationData = () => {
    if (isLoggedIn) {
      API.get(`/communication/notifications/?page_size=20`)
        .then(response => {
          const notifications = response.data.results.notifications;

          if (notifications.length > 0) {
            const latestId = notifications[0].id;

            // First load: store the latest notification ID
            if (lastNotificationId === null) {
              setLastNotificationId(latestId)
            } else if (latestId > lastNotificationId) {
              // New notification detected
              setNewOrderItem(notifications[0]);
              setNewOrderModalShow(true);
              setLastNotificationId(latestId)

            }
          }

          setNotificationData(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };



// Load notofication data on component mount or when logged in
  useEffect(() => {
    loadNotificationData();
  }, [isLoggedIn]);

  // Polling notofication every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadNotificationData();
    }, 30000);

    return () => clearInterval(interval); // cleanup on unmount
  }, [isLoggedIn]);


  useEffect(() => {
   
    loadUserData();
  }, [isLoggedIn])

 


  const myFunction = () => {
    document.getElementsByClassName("navbar-left")[0].classList.toggle("open");

  }




  return (
    <div className='admin-layout compact-wrapper'>


      <Header userData={userData} loadUserData={loadUserData} isLoggedIn={isLoggedIn} notificationData={notificationData} loadNotificationData={loadNotificationData}></Header>
      {/* Location Tracker */}
      {isLoggedIn && userData && window.localStorage.getItem('userRole') === 'driver' && (
        <UserLocationTracker driverId={userData?.driver} />
      )}

      <div className='page-body-wrapper'>
        <LeftNavbar isLoggedIn={isLoggedIn}></LeftNavbar>

        {isLoggedIn && (['admin', 'restaurant', 'staff', 'driver', 'grocery_store'].includes(window.localStorage.getItem("userRole"))) ?

          <div className='app-content'>
            <Routes>

              <Route index element={<DashboardRestaurant role={'restaurant'} />} />


              <Route path="cuisine/list" element={<CuisineList />} />
              <Route path="currency/list" element={<CurrencyList />} />

              <Route path="restaurant/list" element={<RestaurantList />} />
              <Route path="restaurant/edit" element={<RestaurantInfo mode={"edit"} />} />
              <Route path="restaurant/add" element={<RestaurantInfo mode={"add"} />} />
              <Route path="restaurant/pdf/:fileId" element={<RestaurantPdf resource={"restaurant"} />} />

              <Route path="menu-category/list" element={<MenuCategoryList />} />
              {/* <Route path="menu-category/add" element={<MenuCategoryCreate />} /> */}

              <Route path="menu-item/list" element={<MenuItemList />} />
              <Route path="menu-item/add" element={<MenuItemAdd mode={"add"} />} />
              <Route path="menu-item/edit" element={<MenuItemAdd mode={"edit"} />} />

              <Route path="menu-combination/list" element={<MenuCombinationList />} />
              <Route path="menu-combination/add" element={<MenuCombinationAdd mode={'add'} />} />
              <Route path="menu-combination/edit" element={<MenuCombinationAdd mode={'edit'} />} />

              <Route path="unit/list" element={<MenuUnitList />} />
              <Route path="driver/list" element={<DriverList />} />
              <Route path="driver/add" element={<DriverAdd mode={'add'} />} />
              <Route path="driver/edit" element={<DriverAdd mode={'edit'} />} />
              <Route path="driver/details" element={<DriverDetails />} />

              <Route path="dine-in/list" element={<DineInList />} />

              <Route path="orders/list" element={<OrdersList isNewOrderModalShow={isNewOrderModalShow} />} />


              <Route path="orders/details" element={<OrdersDetails source={'list'} />} />


              <Route path="orders/:orderId" element={<OrdersDetails source={'notification'} />} />
              <Route path="orders/tracking" element={<OrdersTracking />} />

              <Route path="order-review/list" element={<OrderReviewList />} />

              <Route path="order-item-review/list" element={<OrderItemReviewList />} />



              <Route path="driver-review/list" element={<DriverReviewList />} />

              <Route path="menu-item-review" element={<MenuItemReview />} />

              <Route path="invoice/list" element={<InvoiceList />} />
              <Route path="invoice/details" element={<InvoiceDetails />} />

              <Route path="users/list" element={<UsersList />} />
              <Route path="user-deletion/list" element={<UserDeletionList />} />
              <Route path="users/add" element={<UsersAdd />} />
              <Route path="users/details" element={<UsersDetails />} />

              <Route path="tickets/list" element={<TicketsList />} />
              <Route path="tickets/add" element={<TicketsAdd />} />
              <Route path="tickets/details" element={<TicketsDetails />} />
              <Route path="tickets/:ticketId" element={<TicketsDetails source={'notification'} newNotificationUpdate={notificationData} />} />



              <Route path="enquiry/list" element={<EnquiryList />} />
              <Route path="notification/list" element={<NotificationList loadHeaderNotificationData={loadNotificationData} />} />
              <Route path="mail/list" element={<MailList />} />
              <Route path="mail/add" element={<MailListAdd mode={"add"} />} />
              <Route path="mail/edit" element={<MailListAdd mode={"edit"} />} />

              <Route path="blog/list" element={<BlogList />} />
              <Route path="blog/add" element={<BlogAdd mode={"add"} />} />
              <Route path="blog/edit" element={<BlogAdd mode={"edit"} />} />


              <Route path="coupon/list" element={<CouponList />} />
              <Route path="coupon/add" element={<CouponAdd mode={"add"} />} />
              <Route path="coupon/edit" element={<CouponAdd mode={"edit"} />} />


              <Route path="gift-card/list" element={<GiftCardList />} />
              <Route path="gift-card/add" element={<GiftCardAdd mode={"add"} />} />
              <Route path="gift-card/edit" element={<GiftCardAdd mode={"edit"} />} />

              <Route path="reports" element={<Reports />} />
              <Route path="session-history/list" element={<SessionHistory />} />
              <Route path="audit-logs/registration" element={<RegistrationAuditList />} />
              <Route path="audit-logs/payment-audit" element={<PaymentAuditList />} />
              <Route path="audit-logs/delivery-audit" element={<DeliveryAuditList />} />
              <Route path="audit-logs/activity-audit" element={<ActivityAuditList />} />

              {window.localStorage.getItem("userRole") === 'restaurant' ? (
                <Route path="restaurant-payments" element={<RestaurantPayoutHistoryList />} />
              ) : window.localStorage.getItem("userRole") === 'driver' ? (
                null
              ) : (
                <Route path="restaurant-payments" element={<RestaurantPaymentList />} />
              )
              }



              <Route path="restaurant-payments" element={<RestaurantPaymentList />} />

              <Route path="profile" element={<Profile />} />
              <Route path="current-subscription" element={<CurrentSubscription
                subscriptionHistory={subscriptionHistory} loadSubscriptionHistory={loadSubscriptionHistory} />} />
              <Route path="subscription-tiers" element={<SubscriptionTiers />} />
              <Route path="merchant/subscription-tiers" element={<SubscriptionTiersMerchant />} />
              <Route path="restaurant-settings" element={<RestaurantInfo />} />
              <Route path="admin-settings" element={<AdminSettings />} />
              <Route path="driver-settings" element={<DriverAdd mode={'settings'} />} />
              <Route path="chat" element={<ChatClient />} />

              <Route path="*" element={<NoPage />} />
            </Routes>

            {isNewOrderModalShow && newOrderItem && (
              newOrderItem.message === 'order_confirmed' ? (
                <NewOrderPopup setterFunction={setNewOrderModalShow} updateItem={newOrderItem} mode="confirmed" />
              ) : newOrderItem.message === 'order_cancelled' ? (
                <NewOrderPopup setterFunction={setNewOrderModalShow} updateItem={newOrderItem} mode="cancelled" />
              ) : newOrderItem.message === 'list of pending orders' ? (
                <NewOrderPopup setterFunction={setNewOrderModalShow} updateItem={newOrderItem} mode="new" />
              ) : newOrderItem.message === 'order_modified_by_customer' ? (

                <OrderModificationByCustomerPopup setterFunction={setNewOrderModalShow} orderId={newOrderItem?.order_id} />

              )
                :
                null
            )}
            {isScheduledOrderModalShow && newOrderItem &&
              <ScheduledOrderPopup setterFunction={setScheduledOrderModalShow} updateItem={newOrderItem} />
            }
            {isDriverOrderModalShow && newOrderItem &&
              <DriverNewOrderPopup setterFunction={setDriverOrderModalShow} updateItem={newOrderItem} />
            }
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