import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import $ from 'jquery';
import API from '../../../API';
import axios from 'axios';
import '../../common-components/ImageUploader.css'
import './MyOrderDetails.scss'
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import Pagination from '../../../Pagination';
import LogoutPopup from '../../../authentication/LogoutPopup';
import { convertTimeString12Hour, fetchInvoiceDataAndGeneratePdf, formatDateTime, getTimeLeft } from '../../../GeneralFunctions';
import { DELIVERY_STATUSES, MAX_CANCELLATION_TIME } from '../../../Constants';
import OrderReviewPopup from '../../common-components/OrderReviewPopup/OrderReviewPopup';
import DeliveryReviewPopup from '../../common-components/DeliveryReviewPopup/DeliveryReviewPopup';
import NewOrderUpdate from '../../common-components/NewOrderUpdate/NewOrderUpdate';
import NewOrderModificationUpdate from '../../common-components/NewOrderModificationUpdate/NewOrderModificationUpdate';


const MyOrderDetails = ({ userData, orderUpdate, orderType }) => {
  const { orderId } = useParams();
  const navigate = useNavigate()
  const maxCancellationTime = MAX_CANCELLATION_TIME

  const deliveryStatusList = DELIVERY_STATUSES;
  const [data, setData] = useState(null);
  const [onGoingData, setOnGoingData] = useState(null);

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutModalShow, setLogoutModalShow] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isOrderReviewModalOpen, setIsOrderReviewModalOpen] = useState(false);
  const [isDeliveryReviewModalOpen, setIsDeliveryReviewModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isNewOrderUpdateShow, setNewOrderUpdateShow] = useState(false);


  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])




  useEffect(() => {
    loadData();
  }, [orderId, orderUpdate, isNewOrderUpdateShow]);


  const loadData = () => {
    let apiUrl = `/order/orders/${orderId}/`;
    if (orderType === 'grocery') {
      apiUrl = `/grocery/orders/${orderId}/`;
    }

    setIsLoading(true)
    API.get(apiUrl)
      .then(response => {
        setSelectedItem(response.data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false)
      });
  }
  const handleFavourite = (item, value) => {
    setIsLoading(true);
    API.put(`order/orders/${item.id}/`, { is_favourite: value })
      .then(response => {
        setIsLoading(false);
        loadData()
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false)
      });
  }
  const handleCancelOrder = (item) => {
    setIsLoading(true);
    API.put(`order/orders/${item.id}/`, { delivery_status: "0" })
      .then(response => {
        setIsLoading(false);
        setIsConfirmModalOpen(false);
        setMessage('Order cancelled.')
        setIsMessageModalOpen(true)
        loadData();
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
        setIsLoading(false)
      });
  }
  // ReOrder
  const handleReOrder = (item) => {
    // data for creating order
    const orderBodyData = {
      // address
      first_name: item.first_name,
      last_name: item.last_name,
      room_number: item.room_number,
      address_line1: item.address_line1,
      organisation: item.organisation,
      premise: item.premise,
      street: item.street,
      posttown: item.posttown,
      postcode: item.postcode,
      county: item.county,
      country: item.country,
      phone_number: item.phone_number,
      country_code: item.country_code,
      delivery_latitude: item.delivery_latitude,
      delivery_longitude: item.delivery_longitude,
      delivery_charge: item.delivery_charge,
      estimated_delivery_time: item.estimated_delivery_time,
      // options
      cooking_instructions: item.cooking_instructions,
      delivery_instructions: item.delivery_instructions,
      is_pickup: item.is_pickup,
      is_contactless_delivery: item.is_contactless_delivery,
      user_pickup_request_date: item.user_pickup_request_date,
      user_pickup_request_time: item.user_pickup_request_time,
      is_pickup_time_required: item.is_pickup_time_required,
      tip: item.tip,

    }
    setIsLoading(true);
    // Remove ALl items from Cart
    API.delete(`order/cart/delete/`)
      .then(response => {
        // Add Items From prev-order to Cart
        const addToCartPromises = item.items.map(cartItem => {
          return API.post('/order/add-to-cart/', {
            restaurant: cartItem.restaurant,
            menu_item: cartItem.menu_item,
            count: cartItem.count,
            topping: cartItem.topping
          });
        });
        // Wait for all add-to-cart API calls to complete
        Promise.all(addToCartPromises)
          .then(responses => {
            // Create New Order
            API.post(`order/orders/`, orderBodyData)
              .then(response => {
                setIsLoading(false);
                localStorage.setItem('createOrderResponseData', JSON.stringify(item))
                // Navigate To Checkout Address
                navigate('/checkout-address')
              })
              .catch(error => {
                setMessage(error.response?.data?.message || error.message)
                setIsErrorModalOpen(true)
                setIsLoading(false)
              });

          })
          .catch(error => {
            setIsLoading(false);
            setMessage(error.response?.data?.message || error.message)
            setIsErrorModalOpen(true)
          });
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true)
      });

  }

  // handle Time left for cancel
  const [timeLeft, setTimeLeft] = useState(null); // Time left in seconds
  const [isCancelable, setIsCancelable] = useState(false);
  useEffect(() => {
    const initialTimeLeft = getTimeLeft(selectedItem?.order_placed_datetime, maxCancellationTime);
    setTimeLeft(initialTimeLeft);
    setIsCancelable(initialTimeLeft > 0);

    // Update timer every second if still cancellable
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev > 0) return prev - 1;
        clearInterval(timerInterval);
        setIsCancelable(false); // Disable cancel after max time
        return 0;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [selectedItem]);

  const formatTimeLeft = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Remaining time for accept modification
  const [remainingTime, setRemainingTime] = useState(null);
  useEffect(() => {
    if (selectedItem?.delivery_status === '14') {
      const initialTimeLeft = getTimeLeft(selectedItem?.restaurant_modification_time, 5);
      setRemainingTime(initialTimeLeft);
      // Update timer every second if still cancellable
      const timerInterval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev > 0) return prev - 1;
          clearInterval(timerInterval);
          return 0;
        });
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [selectedItem]);



  // Check Payment status for Stripe 
  const redirectStatus = new URLSearchParams(window.location.search).get('redirect_status');
  const paymentIntentId = new URLSearchParams(window.location.search).get('payment_intent');

  useEffect(() => {
    if (redirectStatus) {
      if (redirectStatus === 'succeeded') {
        localStorage.setItem('payment_status', 'completed');
        let secondPaymentAmount = null
        let orderDeliveryStatus = '2'
        if (localStorage.getItem('paymentType') === 'second' && localStorage.getItem('paymentAmount')) {
          // Fetch values from localStorage
          secondPaymentAmount = localStorage.getItem('paymentAmount');
          orderDeliveryStatus = localStorage.getItem('deliveryStatus');
        }
        // update Order Data
        var bodyData = {
          second_payment_reference_number: paymentIntentId,
          second_paypal_payment_type: "4",
          second_payment_date: new Date(),
          // delivery_status: orderDeliveryStatus,
          payment_status: "2",
          second_payment_amount: secondPaymentAmount,
          // is_user_modification_confirmed: true
        }
        if (orderDeliveryStatus !== '17') {
          bodyData.delivery_status = orderDeliveryStatus || '2';
        } else {
          bodyData.is_user_modification_confirmed = true;
        }


        API.put(`order/orders/${orderId}/`, bodyData)
          .then(response => {
            setMessage(('Payment successful.'))
            setIsMessageModalOpen(true);
            loadData();
            navigate(`/orders/${orderId}/`)
          }
          )
          .catch(error => {
            // setIsLoading(false);
            setMessage(error.response?.data?.message || error.message);
            setIsErrorModalOpen(true);
          }
          )

      } else {
        setMessage(('Payment failed. Please try again.'))
        setIsErrorModalOpen(true);
        navigate(`/orders/${orderId}/`)
      }

    }
  }, [redirectStatus]);



  return (
    <div className='my-order-details-page'>
      <section className="page-head-section">
        <div className="container page-heading">
          <h2 className="h3 mb-3 text-white text-center">My Order</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb flex-lg-nowrap justify-content-center justify-content-lg-star">
              <li className="breadcrumb-item">
                <a onClick={() => navigate('/')}><i className="ri-home-line"></i>Home</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">My Order</li>
            </ol>
          </nav>
        </div>
      </section>
      <section className="profile-section section-b-space">
        <div className="container">
          <div className="row g-3">
            <div className="col-lg-3">
              <div className="profile-sidebar sticky-top">
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
                  <li>
                    <i className="ri-user-3-line"></i>
                    <a onClick={() => navigate('/profile')}>Change Profile</a>
                  </li>
                  <li className="active">
                    <i className="ri-shopping-bag-3-line"></i>
                    <a onClick={() => navigate('/orders')}>My Order</a>
                  </li>
                  <li>
                    <i className="ri-map-pin-line"></i>
                    <a onClick={() => navigate('/saved-address')}>Saved Address</a>
                  </li>
                  <li>
                    <i className="ri-bank-card-line"></i>
                    <a onClick={() => navigate('/saved-payment-methods')}>Payment Methods</a>
                  </li>
                  <li className='d-none'>
                    <i className="ri-wallet-line"></i>
                    <a onClick={() => navigate('/my-wallet')}>My Wallet</a>
                  </li>
                  <li>
                    <i className="ri-star-line"></i>
                    <a onClick={() => navigate('/my-subscription')}>Dashboard</a>
                  </li>
                  <li>
                    <i className="ri-medicine-bottle-line"></i>
                    <a onClick={() => navigate('/food-preferences')}>Food Preferences</a>
                  </li>
                  <li>
                    <i className="ri-notification-line"></i>
                    <a onClick={() => navigate('/notification-preferences')}>Notification Preference</a>
                  </li>
                  <li>
                    <i className="ri-wallet-line"></i>
                    <a onClick={() => navigate('/session-history')}>Session History</a>
                  </li>
                  <li>
                    <i className="ri-question-line"></i>
                    <a onClick={() => navigate('/faq')}>Help</a>
                  </li>
                  <li>
                    <i className="ri-settings-3-line"></i>
                    <a onClick={() => navigate('/profile-settings')}>Settings</a>
                  </li>
                  <li>
                    <i className="ri-logout-box-r-line"></i>
                    <a onClick={() => setLogoutModalShow(true)}>Log Out</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-9">
              <div className="my-order-content">
                <div className="title">
                  <div className="loader-line"></div>
                  <h3>Order #{selectedItem?.id}</h3>
                </div>
                {selectedItem &&
                  <div className="detail-card">

                    <div className="order-details-box">
                      <div className="order-icon">
                        <img className="img-fluid icon"
                          src={
                            selectedItem?.items?.[0]?.restaurant_name?.is_gift_card_store
                              ? '/images/restaurant-menu/gift-card.svg'
                              : selectedItem?.items?.[0]?.restaurant_name?.logo
                                ? selectedItem?.items?.[0]?.restaurant_name?.logo
                                : '/images/no-restaurant-img.jpg'
                          }
                          alt="logo" />
                      </div>
                      <div className="order-content">
                        <h5 className="brand-name dark-text fw-medium">
                          {selectedItem?.items?.[0]?.restaurant_name?.restaurant_info?.name || 'Restaurant Name Not Available'}
                        </h5>
                        <div className='d-flex align-items-center'>
                          <h6
                            className={`order-deliver-label position-relative status-${selectedItem.delivery_status}`}
                            data-tooltip={
                              (['13', '10', '0'].includes(selectedItem.delivery_status) && selectedItem.restaurant_cancellation_reason?.replace(/_/g, ' ')) ||
                              (selectedItem.delivery_status === '6' && selectedItem.failure_reason) ||
                              null
                            }
                          >
                            {selectedItem.delivery_status && DELIVERY_STATUSES[parseInt(selectedItem.delivery_status)].replace(/_/g, ' ')}

                            {(['13', '10', '0'].includes(selectedItem.delivery_status) && selectedItem.restaurant_cancellation_reason) ||
                              (selectedItem.delivery_status === '6' && selectedItem.failure_reason) ? (
                              <img className='info-icon' src='/images/icons/svg/info.svg' />
                            ) : null}

                          </h6>


                          {(selectedItem.delivery_status === '14' ||
                            (selectedItem.delivery_status === '17' && !selectedItem.is_user_modification_confirmed)) && (
                              <button className="ms-2 track-order-btn"
                                onClick={() => { setNewOrderUpdateShow(true) }} >
                                View
                              </button>
                            )}

                        </div>
                      </div>
                    </div>
                    {selectedItem.delivery_status === '14' &&
                      remainingTime > 0 &&
                      <div className='d-flex w-100 justify-content-end mt-1'>
                        <span className='cancel-txt'>
                          This order will be <span className='text-danger'>automatically cancelled</span> in <span className='text-danger'>{formatTimeLeft(remainingTime)}</span> unless reviewed.
                        </span>

                      </div>
                    }
                    {!selectedItem.is_gift_card &&
                      <div className="delivery-address">
                        <div className="d-flex align-items-center gap-2 mt-2">
                          <i className="ri-map-pin-fill theme-color"></i>
                          <p>
                            {selectedItem?.items?.[0]?.restaurant_name?.primary_address && (
                              [
                                selectedItem.items[0].restaurant_name.primary_address.address_line1,
                                selectedItem.items[0].restaurant_name.primary_address.premise,
                                selectedItem.items[0].restaurant_name.primary_address.street,
                                selectedItem.items[0].restaurant_name.primary_address.posttown,
                                selectedItem.items[0].restaurant_name.primary_address.city,
                                selectedItem.items[0].restaurant_name.primary_address.county,
                                selectedItem.items[0].restaurant_name.primary_address.postcode,
                                selectedItem.items[0].restaurant_name.primary_address.country,
                              ]
                                .filter(Boolean) // Remove any undefined or null values
                                .join(', ')
                            )}
                          </p>
                        </div>
                      </div>
                    }

                    <div className='w-100 d-flex justify-content-between align-items-center mt-2'>

                      {selectedItem.is_scheduled_delivery &&
                        <div className="scheduled">
                          <div className="head1">
                            <i className="ri-time-line"></i>
                            Scheduled On
                          </div>
                          <div className="date">
                            {selectedItem.user_scheduled_delivery_request_date} ,&nbsp;
                            {selectedItem.user_scheduled_delivery_request_time && convertTimeString12Hour(selectedItem.user_scheduled_delivery_request_time)}
                          </div>
                        </div>
                      }


                      {/* Cancel */}
                      {selectedItem.delivery_status &&
                        // ['pending', 'confirmed', 'preparing', 'ready_for_pickup'].includes(DELIVERY_STATUSES[parseInt(selectedItem.delivery_status)]) && (
                        ['1',].includes(selectedItem.delivery_status) && isCancelable ? (
                        <div className=' d-flex justify-content-end align-items-center'>
                          <span className='cancel-txt'>
                            Do you want to cancel this order? <br />
                            You have <span className='text-danger'>{formatTimeLeft(timeLeft)}</span>  remaining.
                          </span>
                          <button className=" cancel-btn" onClick={() => setIsConfirmModalOpen(true)} >Cancel</button>
                        </div>
                      ) : (
                        <div></div>
                      )
                      }
                    </div>

                    {/* Order Correction */}
                    {selectedItem.delivery_status &&
                      (selectedItem.delivery_status === '1') && (
                        <div className='w-100 d-flex justify-content-end align-items-center mt-2 d-none'>
                          <span className='cancel-txt'>
                            Do you want to edit this order? <br />
                            {/* You have 
                        <span className='text-danger'>{formatTimeLeft(timeLeft)}</span>  remaining. */}
                          </span>
                          <button className=" edit-btn" onClick={() => {
                            localStorage.setItem('createOrderResponseData', JSON.stringify(selectedItem))
                            navigate('/checkout-address')
                          }}
                            data-bs-dismiss="modal">Edit</button>
                        </div>
                      )
                    }

                    <div className="delivery-on-going">
                      <ul className="delivery-list">
                        <li>
                          <h6>Order Id</h6>
                          <h5>#{selectedItem.id}</h5>
                          {selectedItem.payment_reference_number &&
                            <>
                              <h6>Transaction Id</h6>
                              <h5>
                                {selectedItem.payment_reference_number ?
                                  `${selectedItem.payment_reference_number}` : 'N/A'}
                              </h5>
                            </>
                          }
                        </li>
                        <li className='d-none'>
                          <div className="order-address">
                            <img className="img-fluid place-icon" src="/images/svg/user-map.svg"
                              alt="" />
                            <h5>Delivery Person</h5>
                          </div>
                          <div className='order-address mt-2'>
                            Name: ----- <br />
                            Contact No: +99 874563210
                          </div>
                        </li>
                        <li>
                          <h6>Date & Time</h6>
                          <h5>{selectedItem.order_placed_datetime && formatDateTime(selectedItem.order_placed_datetime)}</h5>
                        </li>
                      </ul>
                      {!selectedItem.is_gift_card &&
                        <ul className="delivery-list">
                          <li className='d-none'>
                            <div className="order-address">
                              <img className="img-fluid place-icon" src="/images/svg/placed.svg"
                                alt="restaurant" />
                              <h5>Restaurant Address</h5>
                            </div>
                            <h6 className="delivery-place">
                              {selectedItem?.items?.[0]?.restaurant_name?.primary_address && (
                                [
                                  selectedItem.items[0].restaurant_name.primary_address.address_line1,
                                  selectedItem.items[0].restaurant_name.primary_address.premise,
                                  selectedItem.items[0].restaurant_name.primary_address.street,
                                  selectedItem.items[0].restaurant_name.primary_address.posttown,
                                  selectedItem.items[0].restaurant_name.primary_address.city,
                                  selectedItem.items[0].restaurant_name.primary_address.county,
                                  selectedItem.items[0].restaurant_name.primary_address.postcode,
                                  selectedItem.items[0].restaurant_name.primary_address.country,
                                ]
                                  .filter(Boolean) // Remove any undefined or null values
                                  .join(', ')
                              )}
                            </h6>
                          </li>
                          <li>
                            <div className="order-address">
                              <img className="img-fluid place-icon" src="/images/svg/user-map.svg"
                                alt="delivery" />
                              <h5>Delivery Address</h5>
                            </div>
                            <h6 className="delivery-place">
                              <span>
                                {selectedItem.first_name} {selectedItem.last_name}
                              </span>
                              <br />
                              {
                                [

                                  selectedItem.address_line1,
                                  selectedItem.premise,
                                  selectedItem.street,
                                  selectedItem.posttown,
                                  selectedItem.city,
                                  selectedItem.county,
                                  selectedItem.postcode,
                                  selectedItem.country,
                                ]
                                  .filter(Boolean) // Remove any undefined or null values
                                  .join(', ')
                              }
                            </h6>
                          </li>
                          {selectedItem.delivery_person_details &&
                            <li className=''>
                              <div className="order-address">
                                <img className="img-fluid place-icon" src="/images/svg/driver.svg"
                                  alt="" />
                                <h5>Delivery Person</h5>
                              </div>
                              <h6 className="delivery-place">
                                {selectedItem?.delivery_person_details?.user_info?.first_name} {selectedItem?.delivery_person_details?.user_info?.last_name}
                                <br />+{selectedItem?.delivery_person_details?.user_info?.phone_number}
                              </h6>
                            </li>
                          }
                        </ul>
                      }
                    </div>
                    <ul className="order-list">
                      {selectedItem?.items.length > 0 &&
                        selectedItem?.items
                          .filter(item => item.final)
                          .map((item, index) => (
                            <li key={index}>
                              <div className="order-content-box">
                                <div className="d-flex align-items-center justify-content-between">
                                  <h6 className=''>
                                    #{item?.id} {item.menu_item_detail?.is_gift_card ?
                                      `₹${item.price} Gift Card` :
                                      `${item.menu_item_name}`
                                    }
                                    {/* {item.topping &&
                                      <span className="ingredients-text "><br /> + ({item.topping_details.description})</span>
                                    } */}
                                  </h6>
                                  <h6>₹{parseFloat(item.price)}</h6>
                                </div>
                                <div>
                                  <p className='d-flex justify-content-start'>
                                    {item.variant_details || item.menu_item_detail?.unit_details?.name} x {item.count}
                                  </p>
                                </div>
                                {item.topping_details?.length > 0 &&
                                  item.topping_details.map((top, index) => (
                                    <div key={index} className='d-flex justify-content-between align-items-center'>
                                      <h6 className="ingredients-text">+ {top.topping?.description} (x{top.count}) </h6>
                                      {top?.price > 0 &&
                                        <span>₹{top?.price}</span>
                                      }
                                    </div>
                                  ))
                                }
                              </div>
                            </li>
                          ))}
                    </ul>
                    <div className="total-amount">
                      <div className="d-flex align-items-center justify-content-between">
                        <h6 className="fw-medium dark-text">Total</h6>
                        <h6 className="fw-medium dark-text">₹{selectedItem.sub_total}</h6>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <p className="fw-normal content-color">Delivery Charge</p>
                        <p className="fw-normal content-color">₹{selectedItem.delivery_charge && selectedItem.delivery_charge.toFixed(2)}</p>
                      </div>
                      {selectedItem.priority_charge > 0 &&
                        <div className="d-flex align-items-center justify-content-between">
                          <p className="fw-normal content-color">Priority Charge</p>
                          <p className="fw-normal content-color">₹{selectedItem.priority_charge}</p>
                        </div>
                      }
                      {selectedItem.coupon_details &&
                        <div className="d-flex align-items-center justify-content-between">
                          <h6 className="content-color fw-normal">
                            {selectedItem.coupon_details?.discount_type === 'percentage'
                              ? `Discount (${selectedItem.coupon_details.discount_value}%)`
                              : `Discount (Flat ${selectedItem.coupon_details.discount_value})`}
                          </h6>
                          <h6 className="fw-normal content-color">-₹{selectedItem.coupon_discount_applied_pounds}</h6>
                        </div>
                      }
                      {selectedItem.is_gift_card_used &&
                        <div className="d-flex align-items-center justify-content-between">
                          <h6 className="content-color fw-normal">
                            {`Discount(Gift Card)`}
                          </h6>
                          <h6 className="fw-normal content-color">-₹{selectedItem.gift_card_amount}</h6>
                        </div>
                      }
                      <div className="grand-amount d-flex align-items-center justify-content-between">
                        <h6 className="fw-medium dark-text">Grand Total</h6>
                        {selectedItem?.earned_points > 0 &&
                          <div className='earned-points'>
                            <img src='/images/orders/points.svg'></img>
                            +{selectedItem?.earned_points}
                          </div>
                        }
                        <h6 className="fw-medium dark-text">₹{selectedItem.total_amount}</h6>
                      </div>
                    </div>

                    <div className='d-flex w-100 justify-content-center mt-4'>
                      {['1', '2', '3', '4', '5'].includes(selectedItem.delivery_status) &&
                        <button className="btn theme-outline ms-2"
                          onClick={() => { navigate('/tracking'); localStorage.setItem('itemSelectedId', selectedItem.id) }} >Track Order
                        </button>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </section>
      {isConfirmModalOpen &&
        <div className='custom-modal ' style={{ zIndex: "3" }}>
          <div className='card'>
            <div className='first-screen'>
              <img src='/images/icons/svg/warning.svg'></img>
              <h1 className='text-danger'>Cancel</h1>
              <p>Are you sure you want to cancel?</p>
              <div className='footer'>
                <button type='button' className='btn-outlined' onClick={() => { setIsConfirmModalOpen(false) }}>Cancel</button>
                <button type='button' className='btn-primary' onClick={() => { handleCancelOrder(selectedItem); setIsConfirmModalOpen(false) }} >Proceed</button>
              </div>
            </div>
          </div>
        </div>
      }

      {isNewOrderUpdateShow &&
        <NewOrderModificationUpdate setterFunction={setNewOrderUpdateShow} orderId={selectedItem.id} updateMessage={'modified'} />
      }

      {isOrderReviewModalOpen && <OrderReviewPopup setterFunction={setIsOrderReviewModalOpen} orderId={selectedItem.id} />}
      {isDeliveryReviewModalOpen && <DeliveryReviewPopup setterFunction={setIsDeliveryReviewModalOpen} orderId={selectedItem.id} />}

      {isLogoutModalShow && <LogoutPopup setterFunction={setLogoutModalShow}></LogoutPopup>}
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={loadData} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsDetailsModalOpen(false)} />}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )

}

export default MyOrderDetails