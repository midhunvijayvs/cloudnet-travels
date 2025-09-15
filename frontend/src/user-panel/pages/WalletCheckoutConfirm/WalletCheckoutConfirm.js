import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import ErrorModal from "../../../ErrorModal.js";
import PositiveModal from "../../../PositiveModal.js";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner.js"
import $ from 'jquery';
import { convertTimeString12Hour, convertTo12HourTime, formatTimeFromMinutes } from '../../../GeneralFunctions.js';
import './WalletCheckoutConfirm.scss'
import API from '../../../API.js';
import ProcessFlowIllustrationForCheckout from '../../common-components/ProcessFlowIllustrationForCheckout/ProcessFlowIllustrationForCheckout.js'




const WalletPaymentConfirm = ({ userData, loadUserData  }) => {
  const navigate = useNavigate();
const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const merchant_order_id =queryParams.get('merchant_order_id');
const merchant_transaction_id = queryParams.get('merchant_transaction_id');
const amount = queryParams.get('amount');

  const [message, setMessage] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);


  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])
 

  const loadData = () => {

      setIsLoading(true)
      API.post('/api/phonepe-payment/check-status-and-update-wallet/',{'merchant_order_id':merchant_order_id,'merchant_transaction_id':merchant_transaction_id})
        .then(response => {
          setOrderData(response.data)
          setIsLoading(false)
          loadUserData()
        })
        .catch(error => {
          console.error(error);
          setIsLoading(false)
        });
   
  }


  useEffect(() => {
    loadData();
    

  }, []);





  return (
    <div className='wallet-checkout-confirm-page'>

    {orderData?
      <section className="sec-2">

        <div className="lhs">


          <div className="confirm-section">
            {orderData && (

              <div className="account-part p-0">
                <div className='top-sec'>
                  <h3>Wallet Recharged Successfully!!</h3>
                  <h3>With Rs. {orderData.transaction_amount}/-</h3>
                  <p>Your Wallet Recharge order has been successfully placed.</p>
                    <h3>Your current wallet balance is :</h3>
                  <h3>{orderData.wallet_balance}</h3>
          <p> Thank you for keeping your wallet adequate!</p>
                </div>
                {/* <img className="img-fluid account-img w-25" src="/images/gif/order-availability.gif" alt="availability"></img> */}
                <div className=" d-flex justify-content-center gap-2 mt-4 mb-4">
                  <p className='mt-0'>For any issues, contact cloudnet travels via Email or Phone call.</p>
                </div>
                <div className="account-btn d-flex justify-content-center gap-2">
                  <a onClick={() => { navigate('/wallet'); }}
                    className="btn-outlined">
                    Go to Your Wallet
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
      {orderData && (
        
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
                        <br />CloudNet Order . ID.
                        <br /> {orderData.merchant_order_id}
                        <br /> 
                        <br /> CloudNet Transaction. ID.
                        <br /> {orderData.merchant_transaction_id}
                        <br /> 
                        <br /> PhonePe Transaction. ID.
                        <br /> {orderData.phonpe_payment_referance_number}
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
                    ₹{parseFloat(orderData.transaction_amount).toFixed(2)}
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
                  <h6 className="fw-semibold amount">₹{parseFloat(orderData.transaction_amount).toFixed(2)}</h6>
                </div>
                <img className="dots-design" src="/images/svg/dots-design.svg" alt="dots"></img>
              </div>
           
          </div>
        </div>
      )}
      </section >
      :<FixedOverlayLoadingSpinner />
      }
      {isLoading && <FixedOverlayLoadingSpinner />}







      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => navigate("/")} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => { }} />}

    </div >

  );


}

export default WalletPaymentConfirm