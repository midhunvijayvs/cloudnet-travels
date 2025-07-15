import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import ErrorModal from "../../../ErrorModal.js";
import PositiveModal from "../../../PositiveModal.js";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner.js"
import $ from 'jquery';
import { convertTimeString12Hour, convertTo12HourTime, formatTimeFromMinutes } from '../../../GeneralFunctions.js';
import './CheckoutConfirm.scss'
import API from '../../../API';
import ProcessFlowIllustrationForCheckout from '../../common-components/ProcessFlowIllustrationForCheckout/ProcessFlowIllustrationForCheckout.js'
import MiniBanner from '../../common-components/MiniBanner/MiniBanner.js'




const Userhome = ({ userData, loadUserData, loadCartDataForHeader, orderUpdate }) => {
  const navigate = useNavigate();

  const [tabSelected, selectTab] = useState(0);

  const [message, setMessage] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const storedDataId = window.localStorage.getItem("createOrderResponse_order_id");
  const orderPlacedId = storedDataId ? storedDataId : null;
  const [orderData, setOrderData] = useState({});

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])
  useEffect(() => {
    loadCartDataForHeader();
  }, []);

  const loadData = () => {
    if (orderPlacedId) {
      let apiUrl = `/order/orders/${orderPlacedId}`;
      setIsLoading(true)
      API.get(apiUrl)
        .then(response => {
          setOrderData(response.data)
          setIsLoading(false)
        })
        .catch(error => {
          console.error(error);
          setIsLoading(false)
        });
    }

  }
  useEffect(() => {
    loadData();

  }, [orderUpdate]);



  const PAYMENT_METHODS = ['paypal', 'card', 'cod', 'manual', 'stripe']


  return (
    <div className='checkout-confirm-page'>
      <MiniBanner title="Order Corfirmed" breadcrumb={[{ name: "Home", link: "/" }, { name: "Order Confirmed", link: "/" }]}></MiniBanner>

      <section className="sec-2">

        <div className="lhs">

          <ProcessFlowIllustrationForCheckout currentState={3}></ProcessFlowIllustrationForCheckout>

          <div className="confirm-section">
            {orderData && (

              <div className="account-part p-0">
                <div className='top-sec'>
                  <h3>Order Placed Successfully!!</h3>
                  <p>Your order has been successfully placed.
                    <br />
                    Thank you for ordering with us!</p>
                </div>
                {/* <img className="img-fluid account-img w-25" src="/images/gif/order-availability.gif" alt="availability"></img> */}
                <div className=" d-flex justify-content-center gap-2 mt-4 mb-4">
                  <p className='mt-0'>You will get timely updates on the status of your order via Email or Phone call.</p>
                </div>
                <div className="account-btn d-flex justify-content-center gap-2">
                  <a onClick={() => { navigate('/orders'); localStorage.setItem('itemSelectedId', orderData.id) }}
                    className="btn-outlined">
                    View Orders
                  </a>
                </div>
                {/* contact us */}
                <div className=" d-flex justify-content-center gap-2 mt-4">
                  <p className='mt-0'>If you have any concerns,</p>
                  <button onClick={() => navigate('/contact-us')} ><u>contact us</u></button>
                </div>
              </div>
              // rejected by restaurant
            )}



          </div>
        </div>
        <div className="rhs">
          <div className="order-summery-section">
            {orderData.id &&
              <div className="checkout-detail">
                {!orderData.is_gift_card &&
                  <div className="cart-address-box">
                    <div className="add-img">
                      <img className="img-fluid img sm-size" src="/images/svg/location.svg"
                        alt="rp1"></img>
                    </div>
                    <div className="add-content">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="dark-text deliver-place">
                          Deliver To : {orderData.first_name} {orderData.last_name}
                        </h5>
                      </div>
                      <div className='d-flex flex-wrap'>
                        <h6 className="address mt-2 content-color">
                          {
                            [
                              orderData?.room_number,
                              orderData?.address_line1,
                              orderData?.organisation,
                              orderData?.premise,
                              orderData?.street,
                              orderData?.posttown,
                              orderData?.postcode,
                              orderData?.county,
                              orderData?.country,
                            ].filter(part => part).join(', ')}
                        </h6>
                      </div>

                    </div>
                  </div>
                }
                {orderData.payment_method &&
                  <div className="cart-address-box mt-3">
                    <div className="add-img">
                      <img className="img-fluid img sm-size" src="/images/svg/wallet-add.svg"
                        alt="rp1"></img>
                    </div>
                    <div className="add-content">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="dark-text deliver-place">Payment Method:</h5>
                      </div>
                      <h6 className="address mt-2 content-color text-wrap">
                        {orderData.payment_method && PAYMENT_METHODS[parseInt(orderData.payment_method)].replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                        <br />
                        <br /> Ref. No.
                        <br /> {orderData.payment_reference_number}
                      </h6>
                      <br />
                      <br />

                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="dark-text deliver-place">Delivery Mode: {orderData.is_pickup ? `Pickup` : `Delivery`}</h5>
                      </div>


{orderData.is_pickup &&
                          <div>
                            {orderData.user_pickup_request_time && 
                            <>
                              <span className='sm-head'>Requested Time:</span> <br />
                              {orderData.user_pickup_request_date} &nbsp;
                              {convertTimeString12Hour(orderData.user_pickup_request_time)}
                            </>
                            }
                            {orderData.items?.[0]?.restaurant_name?.pickup_instruction &&
                              <div className=''>
                                <span className='sm-head'>Pickup Instructions:</span><br />
                                {orderData.items[0].restaurant_name.pickup_instruction}
                              </div>
                            }

                          </div> 
}


                    </div>


                  </div>
                }
             
                {orderData.delivery_instructions &&
                  <div className="cart-address-box mt-3">
                    <div className="add-img">
                      <img className="img-fluid img sm-size" src="/images/svg/delivery1.svg"
                        alt="rp1"></img>
                    </div>
                    <div className="add-content">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="dark-text deliver-place">Delivery Instructions:</h5>
                      </div>
                      <h6 className="address mt-2 content-color instructions-br">
                        {orderData.delivery_instructions}
                      </h6>
                    </div>

                  </div>
                }
                {/* cooking instructions */}
                {orderData.cooking_instructions &&
                  <div className="cart-address-box mt-3">
                    <div className="add-img">
                      <img className="img-fluid img sm-size" src="/images/svg/cooking.svg"
                        alt="rp1"></img>
                    </div>
                    <div className="add-content">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="dark-text deliver-place">Cooking Instructions:</h5>
                      </div>
                      <h6 className="address mt-2 content-color instructions-br">
                        {orderData.cooking_instructions}
                      </h6>
                    </div>

                  </div>
                }
                <ul>  {orderData.items && orderData.items.length > 0 &&
                  orderData.items.map((item, index) => (
                    <li key={index}>
                      <div className="horizontal-product-box">
                        <div className="product-content">
                          <div className="d-flex align-items-center justify-content-between">
                            {item.menu_item_detail?.is_gift_card ?
                              <h5>£{item.price} Gift Card</h5> :
                              <h5>{item.menu_item_name} {item?.variant_details && `(${item.variant_details})`}</h5>
                            }
                            <h6 className="product-price">£{parseFloat(item.price) * parseInt(item.count)}</h6>
                          </div>
                          {/* {item.topping &&
                                  <h6 className="ingredients-text"> + {item.topping_details.description}</h6>
                                } */}
                          {item.topping_details?.length > 0 &&
                            item.topping_details.map((top, index) => (
                              <div key={index} className='d-flex justify-content-between align-items-center'>
                                <h6 className="ingredients-text">{top.topping?.description} (x{top.count}) </h6>
                                {top.price > 0 &&
                                  <span>£{top.price}</span>
                                }
                              </div>
                            ))
                          }
                        </div>

                      </div>
                    </li>

                  ))}
                </ul>
                <h5 className="bill-details-title fw-semibold dark-text">
                  Bill Details
                </h5>
                <div className="sub-total">
                  <h6 className="content-color fw-normal">Sub Total</h6>
                  <h6 className="fw-semibold">
                    £{Math.round(((orderData.sub_total) + Number.EPSILON) * 100) / 100}
                  </h6>
                </div>
                {orderData?.priority_charge > 0 &&
                  <div className="sub-total">
                    <h6 className="content-color fw-normal">Priority Charge</h6>
                    <h6 className="fw-semibold">£{orderData?.priority_charge}</h6>
                  </div>
                }
                <div className="sub-total">
                  <h6 className="content-color fw-normal">
                    Delivery Charge
                  </h6>
                  {orderData?.delivery_charge > 0 ?
                    <h6 className="fw-semibold success-color">
                      £ {orderData?.delivery_charge?.toFixed(2)}
                    </h6> :
                    <h6 className="fw-semibold success-color">
                      Free Delivery
                    </h6>
                  }
                </div>
                {orderData.coupon_details &&
                  <div className="sub-total">
                    <h6 className="content-color fw-normal">
                      {orderData.coupon_details?.discount_type === 'percentage'
                        ? `Discount (${orderData.coupon_details.discount_value}%)`
                        : `Discount (Flat ${orderData.coupon_details.discount_value})`}
                    </h6>
                    <h6 className="fw-semibold">-£{orderData.coupon_discount_applied_pounds}</h6>
                  </div>
                }
                {orderData.is_gift_card_used &&
                  <div className="sub-total">
                    <h6 className="content-color fw-normal">
                      {`Discount(Gift Card)`}
                    </h6>
                    <h6 className="fw-semibold">-£{orderData.gift_card_amount}</h6>
                  </div>
                }
                <div className="grand-total">
                  <h6 className="fw-semibold dark-text">Total</h6>
                  <h6 className="fw-semibold amount">£{parseFloat(orderData.total_amount).toFixed(2)}</h6>
                </div>
                <img className="dots-design" src="/images/svg/dots-design.svg" alt="dots"></img>
              </div>
            }
          </div>
        </div>
      </section >
      {isLoading && <FixedOverlayLoadingSpinner />}







      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => navigate("/")} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => { }} />}

    </div >

  );


}

export default Userhome