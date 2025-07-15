import React, { useEffect, useState, useRef } from 'react'


import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import ErrorModal from "../../../ErrorModal.js";
import PositiveModal from "../../../PositiveModal.js";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner.js"
import $ from 'jquery';

import API from '../../../API.js';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import './CheckoutPayment.scss'
import StripePayment from '../../common-components/StripePayment/StripePayment.js';
// import TakePaymentsGateway from '../../common-components/TakePaymentsGateway/TakePaymentsGateway.js';

import ProcessFlowIllustrationForCheckout from '../../common-components/ProcessFlowIllustrationForCheckout/ProcessFlowIllustrationForCheckout.js'
import MiniBanner from '../../common-components/MiniBanner/MiniBanner.js'


const Userhome = ({ userData, loadUserData }) => {
  const navigate = useNavigate();
  const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID

  const [tabSelected, selectTab] = useState(0);

  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState({});
  const [orderId, setOrderId] = useState(null);
  const [isOrderPlacedPopupShown, showOrderPlacedPopup] = useState(false)
  const [orderPlacedResponse, setOrderPlacedResponse] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [giftCardCode, setGiftCardCode] = useState('');

  const [formData, setFormData] = useState({});

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
    loadUserData()
  }, [])

  useEffect(() => {
    // Retrieve the response data from localStorage
    const responseData = localStorage.getItem('createOrderResponseData');
    if (responseData) {
      const ResponseOrderData = JSON.parse(responseData);
      setOrderData(ResponseOrderData)
    }
  }, []);

  const loadData = () => {
    setIsLoading(true)
    API.get(`/order/orders/${orderData.id}/`)
      .then((response) => {
        setOrderData(response.data);
        localStorage.setItem('createOrderResponseData', JSON.stringify(response.data));
        localStorage.setItem('createOrderResponse_total', response.data.total_amount);
        localStorage.setItem('createOrderResponse_order_id', response.data.id);
        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
      })

  }


  const handleCouponCodeChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase(); // Restrict special chars, convert to uppercase
    setCouponCode(value);
  };
  const handleGiftCodeChange = (e) => {
    let value = e.target.value;
    setGiftCardCode(value);
  };


  // Apply Discount Method
  const handleDiscountApply = (method, value) => {
    // Validate Discount Apply
    if (value !== 'remove') {
      if (method === 'coupon' && value) {
        if (orderData.is_gift_card_used || orderData.is_wallet_used || orderData.is_credit_balance_used) {
          setMessage('You need to remove other discounts (Gift Card, Wallet, and Credit Points) before applying a coupon.');
          setIsErrorModalOpen(true);
          return
        }
      }
      if ((method === 'wallet' || method === 'gift_card' || method === 'credit_balance') && orderData.coupon) {
        setMessage('You cannot use other discounts when a coupon is applied.');
        setIsErrorModalOpen(true);
        return;
      }
    }


    let payLoad = { order_id: orderData.id, method: method, value: value }
    if (method === 'coupon') {
      if (!couponCode) {
        setErrors({ coupon_code: 'Coupon code is required!' })
        return; // Exit if the coupon code is empty
      } else {
        setErrors({ coupon_code: null })
      }
    }
    else if (method === 'gift_card') {
      if (!giftCardCode) {
        setErrors({ gift_card_code: 'Code is required!' })
        return; // Exit if the giftcardtoken is empty
      } else {
        setErrors({ gift_card_code: null })
      }
    }

    setIsLoading(true);
    API.post(`/order/apply-remove-discount/`, payLoad)
      .then((response) => {
        setIsLoading(false);
        const result = response.data
        if (result?.eligible === false) {
          setMessage(result.reason);
          setIsErrorModalOpen(true);
        } else {
          if (response.data?.gift_card_message) {
            setMessage(response.data?.gift_card_message)
            setIsMessageModalOpen(true)
          }
          loadUserData();
          loadData();
        }
      })
      .catch((error) => {
        setIsLoading(false)
        setMessage(error.response?.data?.message || error.message);
        setIsLoading(false);
        setIsErrorModalOpen(true);
      })

  };



  // Check Payment status for Stripe 
  const redirectStatus = new URLSearchParams(window.location.search).get('redirect_status');
  const paymentIntentId = new URLSearchParams(window.location.search).get('payment_intent');

  useEffect(() => {
    if (redirectStatus) {
      if (redirectStatus === 'succeeded') {
        localStorage.setItem('payment_status', 'completed')
        // update Order Data
        var bodyData = {
          payment_reference_number: paymentIntentId,
          payment_date: new Date(),
          payment_method: "4",
          is_order_placed: true,
          payment_status: "2",
          first_payment_amount: parseFloat(window.localStorage.getItem("createOrderResponse_total")),
        }

        API.put(`order/orders/${window.localStorage.getItem("createOrderResponse_order_id")}/`, bodyData)
          .then(response => {
            window.localStorage.setItem("orderPlacedData", JSON.stringify(response.data));
            window.localStorage.removeItem("createOrderResponse_total");
            window.localStorage.removeItem("createOrderResponseData");
            navigate('/checkout-confirm');
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
        navigate('/checkout-payment');
      }

    }
  }, [redirectStatus]);

  const placeZeroTotalOrder = () => {
    var bodyData = {
      // payment_reference_number: data.orderID,
      // paypal_payment_type: "1",
      // payment_date: new Date(),
      // payment_method: "0",
      is_order_placed: true,
      // payment_status: "2"
    }
    setIsLoading(true)
    API.put(`order/orders/${window.localStorage.getItem("createOrderResponse_order_id")}/`, bodyData)
      .then(response => {
        window.localStorage.setItem("orderPlacedData", JSON.stringify(response.data));
        window.localStorage.removeItem("createOrderResponse_total");
        window.localStorage.removeItem("createOrderResponseData");
        navigate('/checkout-confirm');
      }
      )
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
      }
      )
  }

  const calculateSubTotal = (orderData) => {
    return orderData?.items?.filter(item => item.final === true)
      .reduce((acc, item) => {
        // Add the base item price
        let itemTotal = item.price * item.count;

        // Add the price of toppings if they exist
        if (item.topping_details?.length > 0) {
          itemTotal += item.topping_details.reduce((toppingAcc, top) => {
            return toppingAcc + (top.price * top.count);
          }, 0);
        }

        return acc + itemTotal;
      }, 0).toFixed(2);
  };



  return (
    <div className='checkout-payment-page'>

      <MiniBanner title="Checkout Options" breadcrumb={[{ name: "Home", link: "/" }, { name: "Checkout Options", link: "/" }]}></MiniBanner>

      <section className="sec-2">

        <div className="lhs">

          <ProcessFlowIllustrationForCheckout currentState={2}></ProcessFlowIllustrationForCheckout>

          <div className="payment-section">
            {parseFloat(orderData.total_amount) > 0 ?
              <>
                <div className="title mb-0 mt-5">
                  <div className="loader-line"></div>
                  <h3>Choose Payment Method</h3>
                  {/* <h6>There are many Types of Payment Method</h6> */}
                </div>

                {/* PayPal */}
                {/* <div className='mt-4 mb-5'>
                  <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "GBP" }}>
                    <PayPalButtons
                      style={{
                        layout: "vertical",
                        color: "gold",
                        shape: "rect",
                        label: "pay",
                        tagline: false,
                      }}
                      createOrder={(data, actions) => {

                        return actions.order
                          .create({
                            purchase_units: [
                              {
                                amount: {

                                  value: parseFloat(window.localStorage.getItem("createOrderResponse_total"))
                                },
                              },
                            ],
                          })
                          .then((orderId) => {
                            // Your code here after create the order
                            return orderId;
                          });
                      }}

                      onApprove={function (data, actions) {
                        return actions.order.capture().then((details) => {
                          // console.log(data);
                          if (details.status === "COMPLETED") {
                            localStorage.setItem('payment_status', 'completed')
                          } else {
                            localStorage.setItem("payment_status", "pending");
                          }
                          var bodyData = {
                            ...formData,
                            payment_reference_number: data.orderID,
                            paypal_payment_type: "1",
                            payment_date: new Date(),
                            payment_method: "0",
                            is_order_placed: true,
                            payment_status: "2",
                            first_payment_amount: parseFloat(window.localStorage.getItem("createOrderResponse_total")),
                          }
                          setIsLoading(true)
                          API.put(`order/orders/${window.localStorage.getItem("createOrderResponse_order_id")}/`, bodyData)
                            .then(response => {
                              window.localStorage.setItem("orderPlacedData", JSON.stringify(response.data));
                              window.localStorage.removeItem("createOrderResponse_total");
                              window.localStorage.removeItem("createOrderResponseData");
                              navigate('/checkout-confirm');
                            }
                            )
                            .catch(error => {
                              setIsLoading(false);
                              setMessage(error.response?.data?.message || error.message);
                              setIsErrorModalOpen(true);
                            }
                            )

                        });
                      }}


                    >


                    </PayPalButtons>
                  </PayPalScriptProvider>
                </div> */}
                {/* Stripe */}
                <div className='mt-4 mb-5'>
                  <StripePayment amount={parseFloat(window.localStorage.getItem("createOrderResponse_total"))} />
                </div>
                {/* Take Payments */}
                {/* <div className='mt-4 mb-5'>
                  <TakePaymentsGateway amount={parseFloat(window.localStorage.getItem("createOrderResponse_total"))}
                    orderData={orderData?.id} />
                </div> */}
              </>
              :
              <div className='place-order'>
                <p className='order-note'>
                  Please review your order details before confirming. Once placed,
                  you will receive a confirmation with further updates.
                </p>
                <p className='order-info'>
                  The total payable amount is zero,
                  and no further action is needed for payment processing. You can proceed
                  by placing the order directly.
                </p>

                <div className='place-order-btn' onClick={placeZeroTotalOrder}>
                  Place Order
                </div>
              </div>
            }
          </div>

        </div>



        <div className="rhs">
          <div className="order-summery-section">
            <div className="checkout-detail">
              <div className="cart-address-box d-none">
                <div className="add-img">
                  <img className="img-fluid img" src="/images/home.png" alt="rp1"></img>
                </div>
                <div className="add-content">
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="dark-text deliver-place">
                      Deliver To : Home
                    </h5>
                    <a href="address.html" className="change-add">Change</a>
                  </div>
                  <h6 className="address mt-2 content-color">
                    932 Pittwater Rd, Sydney, New South Wales, 2099
                  </h6>
                </div>
              </div>
              <h3 className="fw-semibold dark-text checkout-title">
                Order Summary
              </h3>
              <ul>
                {orderData && orderData.items && orderData.items.length > 0 && orderData.items.map((item, index) => (
                  <li key={index}>
                    <div className="horizontal-product-box">
                      <div className="product-content">
                        <div className="d-flex align-items-center justify-content-between">
                          
                            <h5>{item.menu_item_name} {item?.variant_details && `(${item.variant_details})`}</h5>
                        
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
             

              
              
            


              <h5 className="fw-semibold dark-text pt-3 pb-3">Bill Details</h5>
              <div className="sub-total">
                <h6 className="content-color fw-normal">Sub Total</h6>
                <h6 className="fw-semibold">
                  {/* £{orderData.sub_total} */}
                  £{calculateSubTotal(orderData)}
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
                    £{orderData?.delivery_charge?.toFixed(2)}
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
                  <h6 className="fw-semibold">-£{orderData.gift_card_amount?.toFixed(2)}</h6>
                </div>
              }
              {orderData.is_credit_balance_used &&
                <div className="sub-total">
                  <h6 className="content-color fw-normal">
                    {`Discount(Credit Points)`}
                  </h6>
                  <h6 className="fw-semibold">-£{orderData.credit_balance_used?.toFixed(2)}</h6>
                </div>
              }
              {orderData.is_wallet_used &&
                <div className="sub-total">
                  <h6 className="content-color fw-normal">
                    {`Discount(Wallet)`}
                  </h6>
                  <h6 className="fw-semibold">-£{orderData.wallet_amount_used?.toFixed(2)}</h6>
                </div>
              }
              <div className="grand-total">
                <h6 className="fw-semibold dark-text">Total</h6>
                <h6 className="fw-semibold amount">£{parseFloat(orderData.total_amount).toFixed(2)}</h6>
              </div>
              {/* <a href="confirm-order.html" className="btn theme-btn restaurant-btn w-100 rounded-2">PAY
                      NOW</a> */}
              <img className="dots-design" src="/images/svg/dots-design.svg" alt="dots"></img>
            </div>
          </div>
        </div>



      </section>




      {isLoading && <FixedOverlayLoadingSpinner />}


      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}

    </div >

  );


}

export default Userhome