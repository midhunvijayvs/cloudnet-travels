import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import ErrorModal from "../../../ErrorModal.js";
import PositiveModal from "../../../PositiveModal.js";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner.js"
import $ from 'jquery';
import { convertTimeString12Hour, convertTo12HourTime, formatTimeFromMinutes } from '../../../GeneralFunctions.js';
import './CheckoutShowSuccess.scss'
import API from '../../../API';
import ProcessFlowIllustrationForCheckout from '../../common-components/ProcessFlowIllustrationForCheckout/ProcessFlowIllustrationForCheckout.js'
import {fetchFlightTicketDataAndGeneratePdf} from '../../../GeneralFunctions.js'



const Userhome = ({ userData, loadUserData, loadCartDataForHeader, orderUpdate }) => {
  const navigate = useNavigate();
const location = useLocation();

 var responseData = null;
 responseData=location.state?.responseData;

  const [message, setMessage] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])
 
 
  useEffect(() => {

  }, []);





  return (
    <div className='checkout-confirm-page'>

      <section className="sec-2">

        <div className="lhs">

          <ProcessFlowIllustrationForCheckout currentState={3}></ProcessFlowIllustrationForCheckout>

          <div className="confirm-section">
            {responseData && responseData.booking &&responseData.saved_printable_ticket &&responseData.airiq_response && (

              <div className="account-part p-0">
                <div className='top-sec'>
                  <h3>Ticket Booked Successfully!!</h3>
                  <p>Your Ticket Booking order has been successfully placed.
                    <br />
                    Thank you for booking with us!</p>
                </div>
                {/* <img className="img-fluid account-img w-25" src="/images/gif/order-availability.gif" alt="availability"></img> */}
                <div className=" d-flex justify-content-center gap-2 mt-4 mb-4">
                  <p className='mt-0'>For timely updates on the status of your ticket, contact cloudnet travels via Email or Phone call.</p>
                </div>
               
               
                <div className="account-btn d-flex justify-content-center gap-2">
                  <a onClick={() => { navigate('/home'); fetchFlightTicketDataAndGeneratePdf(responseData.saved_printable_ticket.id) }}
                    className="btn-outlined">
                    Print Ticket
                  </a>
                </div>
                
                 <div className="account-btn d-flex justify-content-center gap-2">
                  <a onClick={() => { navigate('/home'); localStorage.setItem('itemSelectedId', responseData.id) }}
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
                        <br /> {responseData.booking.id}
                        <br /> 
                        <br /> CloudNet Transaction. ID.
                        <br /> {}
                      </h6>
                      <br />
                      <br />

                      {/* <div className="d-flex align-items-center justify-content-between">
                        <h5 className="dark-text deliver-place">Delivery Mode: {responseData.is_pickup ? `Pickup` : `Delivery`}</h5>
                      </div> */}





                    </div>


                  </div>
             
             
               
               
                <h5 className="bill-details-title fw-semibold dark-text">
                  Bill Details
                </h5>
                <div className="sub-total">
                  <h6 className="content-color fw-normal">Sub Total</h6>
                  <h6 className="fw-semibold">
                    ₹{parseFloat(responseData.amount).toFixed(2)}
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
                  <h6 className="fw-semibold amount">₹{parseFloat(responseData.amount).toFixed(2)}</h6>
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