import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate, useParams } from 'react-router-dom';
import "./OrdersDetails.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import LiveTrackingMapComponent from "../../../user-panel/common-components/LiveTrackingMapComponent/LiveTrackingMapComponent";
import { convertTimeString12Hour, convertTo12HourTime, formatTimeFromMinutes, navigateToGoogleMapLocation } from "../../../GeneralFunctions";
import { DELIVERY_STATUSES, GROCERY_DELIVERY_STATUSES } from "../../../Constants";
import { formatDateTime2MonthYearTime ,IsoDateTimeToFormatedTime} from "../../../GeneralFunctions";


const OrdersDetails = ({ source, orderType }) => {
  const { orderId } = useParams();
  const navigate = useNavigate()
  let deliveryStatusList = DELIVERY_STATUSES;
  if (orderType === 'grocery') {
    deliveryStatusList = GROCERY_DELIVERY_STATUSES
  }

  const [data, setData] = useState(null);


  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState({})
  const PAYMENT_METHODS = ['paypal', 'card', 'cod', 'manual', 'stripe']

  const [page, setPage] = useState(1);
  const [pageSize, selectPageSize] = useState(12);

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])
  const loadData = () => {
    let order_id = localStorage.getItem('itemSelectedId');
    if (source === 'notification') {
      order_id = orderId;
    }
    let apiUrl = `/order/orders/${order_id}`;
    if (String(order_id)?.startsWith("G")) {
      // if (orderType === 'grocery') {
      apiUrl = `/grocery/orders/${order_id}`;
    } else {
      apiUrl = `/order/orders/${order_id}`;
    }

    console.log('======', order_id, apiUrl);
    setIsLoading(true)
    API.get(apiUrl)
      .then(response => {
        setData(response.data)
        setIsLoading(false)
      })
      .catch(error => {
        // console.error(error);
        setIsLoading(false)
      });
  }
  useEffect(() => {
    loadData();
  }, [orderId]);


  const ALLOWED_STATUS_TRANSITIONS = {
    cancel_request_send: [],
    pending: ['confirmed', 'cancel_request_send'],
    confirmed: ['preparing', 'cancel_request_send'],
    preparing: ['ready_for_pickup', 'cancel_request_send'],
    ready_for_pickup: ['on_the_way', 'cancel_request_send'],
    on_the_way: ['delivered', 'failed_delivery_attempt', 'cancel_request_send'],
    failed_delivery_attempt: ['on_the_way', 'cancel_request_send', 'returned'],
    delivered: [],
    returned: ['refund_request_send', 'cancel_request_send'],
    refund_request_send: ['cancelled_and_refunded', 'refund_request_processed', 'refund_request_declined'],
    cancelled_and_refunded: [],
    refund_request_processed: [],
    refund_request_declined: [],
    rejected_by_restaurant: [],
    modified_by_restaurant: ['confirmed'],
  };

  const isValidStatusTransition = (currentStatus, newStatus) => {
    const allowedTransitions = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
    return allowedTransitions.includes(newStatus);
  };

  const handleDeliveryStatusChange = (item, event) => {
    const selectedStatusId = event.target.value;
    const selectedStatus = DELIVERY_STATUSES[selectedStatusId];
    const currentStatus = DELIVERY_STATUSES[item.delivery_status];
    // Validate the transition
    if (!isValidStatusTransition(currentStatus, selectedStatus)) {
      setIsErrorModalOpen(true);
      setMessage(
        `Invalid status transition: You cannot change the status from "${currentStatus.replace(/_/g, ' ')}" to "${selectedStatus.replace(/_/g, ' ')}".`
      );
      return;
    }

    setIsLoading(true)
    API.put(`/order/orders/${item.id}/`, { delivery_status: selectedStatusId })
      .then(response => {
        loadData();
        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
        setIsErrorModalOpen(true);
        setMessage(error.response?.data?.message || error.message);
      });
  }





  return (
    <div className="order-details-page">
      {data &&
        <div className="page-body">
          <div className="container-fluid">
            <div className="row p-4">

              {/* <div className="col-xl-5"> */}
              <div className="card p-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 d-none">
                      <ul className="nav setting-main-box driver-main-box sticky theme-scrollbar   " id="v-pills-tab" role="tablist"
                        aria-orientation="vertical">
                        <li>
                          <button className="nav-link active" id="Settings-tab"
                            data-bs-toggle="pill" data-bs-target="#Settings" role="tab"
                            aria-controls="Settings" aria-selected="true">
                            <i className="ri-settings-line"></i>Order Status</button>
                        </li>
                        <li>
                          <button className="nav-link" id="Info-tab" data-bs-toggle="pill"
                            data-bs-target="#Info" role="tab"
                            aria-controls="Info" aria-selected="false">
                            <i className="ri-information-2-line"></i>Order Details</button>
                        </li>
                      </ul>
                    </div>


                    <div className="title-bar ">
                      <div className="d-flex gap-2">
                        <div className="title-header p-0">
                          <h5>Order Details #{data.id}</h5>
                        </div>
                        <h6
                          className={`order-deliver-label position-relative status-${data.delivery_status}`}
                          data-tooltip={
                            (['13', '10', '0'].includes(data.delivery_status) && data.restaurant_cancellation_reason?.replace(/_/g, ' ')) ||
                            (data.delivery_status === '6' && data.failure_reason) ||
                            null
                          }
                        >
                          {data.delivery_status && deliveryStatusList[parseInt(data.delivery_status)].replace(/_/g, ' ')}

                          {(['13', '10', '0'].includes(data.delivery_status) && data.restaurant_cancellation_reason) ||
                            (data.delivery_status === '6' && data.failure_reason) ? (
                            <img className='info-icon' src='/images/icons/svg/info.svg' />
                          ) : null}

                        </h6>

                      </div>
<div>{formatDateTime2MonthYearTime(data.order_placed_datetime)}</div>

                      {data.is_scheduled_delivery &&
                        <div className="scheduled">
                          <div className="head1">
                            <i className="ri-time-line"></i>
                            Scheduled On
                          </div>
                          <div className="date">
                            {data.user_scheduled_delivery_request_date} ,&nbsp;
                            {data.user_scheduled_delivery_request_time && convertTimeString12Hour(data.user_scheduled_delivery_request_time)}
                          </div>
                        </div>
                      }

                    </div>




                    <div className="content-box">

                      <div className="lhs" >

                        <div className="box">

                          <img className="img-fluid img sm-size" src="/images/svg/location.svg"
                            alt="rp1"></img>
                          <div className="content">
                            <div className="d-flex align-items-center justify-content-between">
                              <h5 className="title">
                                Deliver To : {data.first_name} {data.last_name}
                              </h5>

                            </div>
                            <div className='d-flex flex-wrap'>
                              <h6 className="description">
                               Phone: {data?.phone_number && `+${data?.phone_number}`} 
                                   <br/>
                                 Email: {data?.email && `, ${data?.email}`} <br />

                               
                                    {data?.room_number},
                                   {data?.address_line1},
                                   {data?.organisation},
                                   {data?.premise},
                                   <br/>
                                   {data?.street},
                                   {data?.posttown},
                                   <br/>
                                   {data?.postcode},
                                   {data?.county},
                                   {data?.country},
                                 
                              </h6>
                            </div>

                          </div>
                        </div>
                       
                        {/* pickup */}
                        <div className="box">

                          <img className="img-fluid img sm-size" src={`${data.is_pickup ? "/images/svg/delivery1.svg" : "/images/svg/truck-nocolor.svg"}`}
                            alt="rp1"></img>
                          <div className="content">
                            <div className="d-flex align-items-center justify-content-between">
                              <h5 className="title">Delivery Mode: {data.is_pickup ? `Pickup` : `Delivery`}</h5>
                            </div>
                            <h6 className="description">
                              {data.is_pickup ?
                                <div>
                                  {data.user_pickup_request_time ?
                                    <>
                                      <span className='sm-head'>Requested Time:</span> <br />
                                      {data.user_pickup_request_date} &nbsp;
                                      {convertTimeString12Hour(data.user_pickup_request_time)}
                                    </> :
                                    <>
                                      No specific time requested.
                                    </>
                                  }
                                  {data.items?.[0]?.restaurant_name?.pickup_instruction &&
                                    <div className=''>
                                      <span className='sm-head'>Pickup Instructions:</span><br />
                                      {data.items?.[0]?.restaurant_name.pickup_instruction}
                                    </div>
                                  }

                                </div> :
                                <div>

                                  <span>Estimated Time: &nbsp;
                                    {data.estimated_delivery_time ? formatTimeFromMinutes(data.estimated_delivery_time) : '----'}
                                  </span>
                                  <br />
                                  <span>{data.is_contactless_delivery && `Contactless Delivery`}</span>
                                </div>
                              }
                            </h6>
                          </div>
                        </div>
                        {(data.delivery_instructions|| data.cooking_instructions) &&
                          <div className="box">

                            <img className="img-fluid img sm-size" src="/images/svg/delivery1.svg"
                              alt="rp1"></img>
                            <div className="content">
                              <div className="d-flex align-items-center justify-content-between">
                                <h5 className="title">Instructions:</h5>
                              </div>
                              <h6 className="description instructions-br">
                                <b>Delivery Instructions::</b> {data.delivery_instructions}
                                <br/>
                                <br/>
                              <b>Cooking Instructions::</b> {data.cooking_instructions} </h6>
                            </div>
                          </div>
                        }
                      
                      
                        {/* packages */}
                        {(data.is_branded_package_avaiable || data.is_eco_friendly_package_available) &&
                          <div className="box extra">
                            {data.is_eco_friendly_package_available &&
                              <div className="delivery-item">

                                <img className="" src="/images/svg/eco-friendly.svg" alt="rp1" />

                                Eco Friendly Package
                              </div>
                            }
                            {data.is_branded_package_avaiable &&
                              <div className="delivery-item">
                                <div className="img-box">
                                  <img className="logo" src="/images/admin-panel/logo/full-white.svg" alt="logo" />
                                </div>
                                Branded Package
                              </div>
                            }

                          </div>
                        }
                         {data.payment_method &&
                          <div className="box">

                            <img className="img-fluid img sm-size" src="/images/svg/wallet-add.svg"
                              alt="rp1"></img>
                            <div className="content">
                              <div className="d-flex align-items-center justify-content-between">
                                <h5 className="title">Payment Method:</h5>
                              </div>
                              <h6 className="description">
                                {data.payment_method && PAYMENT_METHODS[parseInt(data.payment_method)]?.replace(/^\w/, c => c.toUpperCase())}
                                &nbsp; ({data.payment_reference_number})
                              </h6>
                            </div>
                          </div>
                        }
                      </div>

                      <div className="rhs">
                        <div className='update-order-status box'>
                          <label className="title">Update Order Status</label>
                          <select className={`form-select delivery-status ${data.delivery_status ? `status-${data.delivery_status}` : ''}`}
                            value={data.delivery_status}
                            onChange={(event) => handleDeliveryStatusChange(data, event)}
                          >
                            {DELIVERY_STATUSES.map((status, index) => (
                              <option key={index} value={index} className={`status-btn ${data.delivery_status ? `status-${data.delivery_status}` : 'status-0'}`}>
                                {status.replace(/_/g, ' ')?.replace(/^\w/, c => c.toUpperCase())}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="menu-items box">
                          <label className="title">Order Items</label>

                        <ul>
                          {data?.items
                            // ?.filter(item => item.final)
                            ?.map((item, index) => {
                              // Find the alternative item using related_order_item
                              return (
                                <li key={index}>
                                  <div className="product-strip">
                                    <div className="lhs">
                                      <h5 className="product-name">
                                        {item.menu_item_name}
                                      </h5>

                                      <span >({item.variant_details || item.menu_item_detail?.unit_details?.name} x {item.count} )</span>
                                    </div>
                                    <h6 className="product-price">₹{parseFloat(item.price) * parseInt(item.count)}</h6>

                                  </div>

                                </li>
                              )
                            })}

                        </ul>
                        </div>

                        <div className="bill-details box">
                          <h5 className="title">Bill Details</h5>
                          <div className="sub-total">
                            <h6 className="content-color fw-normal">Sub Total</h6>
                            <h6 className="fw-semibold">
                              ₹{Math.round(((data.sub_total) + Number.EPSILON) * 100) / 100}
                            </h6>
                          </div>
                          {data.priority_charge > 0 &&
                            <div className="sub-total">
                              <h6 className="content-color fw-normal">
                                Priority Charge
                              </h6>
                              <h6 className="fw-semibold ">
                                ₹{data.priority_charge}
                              </h6>
                            </div>
                          }
                          <div className="sub-total">
                            <h6 className="content-color fw-normal">
                              Delivery Charge
                            </h6>
                            <h6 className="fw-semibold success-color">
                              ₹{data.delivery_charge && data.delivery_charge.toFixed(2)}
                            </h6>
                          </div>

                          {data.coupon_details &&
                            <div className="sub-total">
                              <h6 className="content-color fw-normal">
                                {data.coupon_details?.discount_type === 'percentage'
                                  ? `Discount (${data.coupon_details.discount_value?.toFixed(2)}%)`
                                  : `Discount (Flat ${data.coupon_details.discount_value?.toFixed(2)})`}
                              </h6>
                              <h6 className="fw-semibold">-₹{data.coupon_discount_applied_pounds?.toFixed(2)}</h6>
                            </div>
                          }
                          {data.is_gift_card_used &&
                            <div className="sub-total">
                              <h6 className="content-color fw-normal">
                                {`Discount(Gift Card)`}
                              </h6>
                              <h6 className="fw-semibold">-₹{data.gift_card_amount?.toFixed(2)}</h6>
                            </div>
                          }
                          <div className="grand-total">
                            <h6 className="fw-semibold dark-text">Total</h6>
                            <h6 className="fw-semibold amount">₹{parseFloat(data.total_amount).toFixed(2)}</h6>
                          </div>
                        <img className="dots-design mb-0" src="/images/svg/dots-design.svg" alt="dots"></img>
                        </div>






                      </div>




                    </div>
                  </div>
                </div>
              </div>
              {/* </div> */}

              {/* Google map tracking */}
              <div className="col-xl-12 d-none">
                <div className="card">
                  <div className="delivery-root">
                    {data &&
                      <div style={{ height: "450px" }}>
                        < LiveTrackingMapComponent
                          restaurantLocation={
                            data?.items?.[0]?.restaurant_name?.latitude ? {
                              lat: parseFloat(data.items[0].restaurant_name.latitude),
                              lng: parseFloat(data.items[0].restaurant_name.longitude),
                            } : null
                          }
                          // driverLocation={driverLocation}
                          customerLocation={
                            data?.delivery_latitude ? {
                              lat: parseFloat(data.delivery_latitude),
                              lng: parseFloat(data.delivery_longitude),
                            } : null
                          }
                        />
                      </div>
                    }

                    {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d158857.8415665736!2d-0.26674604057231066!3d51.52873932359012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon%2C%20UK!5e0!3m2!1sen!2sin!4v1714986124652!5m2!1sen!2sin" width="100%" height="450"
                    style={{ border: "0" }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }


      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default OrdersDetails