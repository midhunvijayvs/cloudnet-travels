import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import ErrorModal from "../../../ErrorModal.js";
import PositiveModal from "../../../PositiveModal.js";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner.js"
import $ from 'jquery';
import { convertTimeString12Hour, convertTo12HourTime, formatTimeFromMinutes } from '../../../GeneralFunctions.js';
import './CheckoutShowFailed.scss'
import API from '../../../API';
import ProcessFlowIllustrationForCheckout from '../../common-components/ProcessFlowIllustrationForCheckout/ProcessFlowIllustrationForCheckout.js'




const Userhome = ({ userData, loadUserData, loadCartDataForHeader, orderUpdate }) => {
  const navigate = useNavigate();
const location = useLocation();
    const responseData = location.state.responseData;


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
   responseData
  }, [responseData])
 
const merchantOrderId=localStorage.getItem('merchantOrderId')
  const loadData = () => {
    if (orderPlacedId) {
      let apiUrl = `https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order/${merchantOrderId}/status`;
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
    <div className='checkout-failed-page'>

      <section className="sec-2">

        <div className="lhs">


          <div className="confirm-section">
            {orderData && (

              <div className="account-part p-0">
                <div className='top-sec'>
                  <h3>Sorry</h3>
                  <h3>Ticket Booking Failed !!</h3>
                  <p>Your Ticket Booking order has been failed.
                    <br />
                    Something went wrong from our side.<br/>
                    Please try again later. <br/>
                    If the issue persist, please contact our customer care!</p>
                </div>
                {/* <img className="img-fluid account-img w-25" src="/images/gif/order-availability.gif" alt="availability"></img> */}
                <div className=" d-flex justify-content-center gap-2 mt-4 mb-4">
                  <p className='mt-0'>For timely updates on the status of your ticket, contact cloudnet travels via Email or Phone call.</p>
                </div>
                <div className="account-btn d-flex justify-content-center gap-2">
                  <a onClick={() => { navigate('/home'); localStorage.setItem('itemSelectedId', orderData.id) }}
                    className="btn-outlined">
                    Go Home
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
           
              <div className="checkout-detail">
               
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
                        PhonePe
                        <br />
                        <br />CloudNet Booking. ID.
                        <br /> {merchant_order_id}
                        <br /> 
                        <br /> CloudNet Transaction. ID.
                        <br /> {merchant_transaction_id}
                      </h6>
                      <br />
                      <br />

                      {/* <div className="d-flex align-items-center justify-content-between">
                        <h5 className="dark-text deliver-place">Delivery Mode: {orderData.is_pickup ? `Pickup` : `Delivery`}</h5>
                      </div> */}





                    </div>


                  </div>
             
             
               
               
                <h5 className="bill-details-title fw-semibold dark-text">
                  Bill Details
                </h5>
                <div className="sub-total">
                  <h6 className="content-color fw-normal">Sub Total</h6>
                  <h6 className="fw-semibold">
                    ₹{parseFloat(amount).toFixed(2)}
                  </h6>
                </div>
                
                <div className="sub-total">
                  <h6 className="content-color fw-normal">
                    Extra Charges
                  </h6>
                  
                    <h6 className="fw-semibold success-color">
                      ₹0
                    </h6>
                  
                </div>
             
               
                <div className="grand-total">
                  <h6 className="fw-semibold dark-text">Total</h6>
                  <h6 className="fw-semibold amount">₹{parseFloat(amount).toFixed(2)}</h6>
                </div>
                <img className="dots-design" src="/images/svg/dots-design.svg" alt="dots"></img>
              </div>
           
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