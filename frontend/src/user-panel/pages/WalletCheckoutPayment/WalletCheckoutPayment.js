// src/pages/CheckoutPayment.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WalletCheckoutPayment.scss";
import { useLocation } from "react-router-dom";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { generateBookingId, generateTransactionId } from '../../../GeneralFunctions.js'
import API from '../../../API';
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";


const CheckoutPayment = () => {
  const navigate = useNavigate();


  const location = useLocation();
  const amount = location.state?.amount;
  const merchant_order_id = location.state?.merchant_order_id;
  const merchant_transaction_id = location.state?.merchant_transaction_id; // modified transaction_table_id
  const pure_transaction_id = location.state?.pure_transaction_id; //transaction table id


  const [popupTitle, setPopupTitle] = useState(null)
  const [popupMessage, setPopupMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  console.log("pure_transaction_id from checkoutpayment: ", pure_transaction_id)

  const initiatePayment = () => {
    setIsLoading(true)

    let data = {
      amount: amount * 100, // ₹100.00 (in paise)
      user_id: "1",
      merchant_order_id: merchant_order_id,
      merchant_transaction_id: merchant_transaction_id,
      success_redirect_url: `${window.location.origin}/wallet-checkout-success/?merchant_order_id=${merchant_order_id}&&merchant_transaction_id=${merchant_transaction_id}&&amount=${amount}&&pure_transaction_id=${pure_transaction_id}`,
      failed_redirect_url: `${window.location.origin}/wallet-checkout-failed/?merchant_order_id=${merchant_order_id}&&merchant_transaction_id=${merchant_transaction_id}&&amount=${amount}&&pure_transaction_id=${pure_transaction_id}`,
    }


    API.post('/api/phonepe-payment/initiate/', data)
      .then(response => {
        console.log("response.data phonepe frm ChckoutPayment.js", response.data)
        if (response && response.data && response.data.data.redirectUrl) {
          // Redirect user to PhonePe payment page
          // console.log("response data",response&&response.data)
         console.log("Redirecting to:", response.data.data.redirectUrl);
  setTimeout(() => {
    window.location.href = response.data.data.redirectUrl;
  }, 5000); // wait 5 sec to let you read console

        } 
        else {
          setPopupTitle("Failed")
          setPopupMessage("Payment initiation failed");
          setIsMessageModalOpen(true)
        }

        setIsLoading(false)


      })
      .catch(error => {
        setPopupTitle("Failed");

        setPopupMessage("Error initiating payment");
        console.log("error:", error)

        setIsErrorModalOpen(true);
        setIsLoading(false)
      });
  }
  useEffect(() => {
  initiatePayment()

  }, [navigate]);

  return (
    <div className="wallet-checkout-payment">
      <h2>Redirecting to PhonePe...</h2>

      <FixedOverlayLoadingSpinner />


      {isMessageModalOpen &&

        <PositiveModal
          title={popupTitle}
          message={popupMessage}
          state={isMessageModalOpen}
          setterFunction={setIsMessageModalOpen}
          okClickedFunction={() => { navigate('/wallet') }}

        />

      }
      <ErrorModal state={isErrorModalOpen} message={popupMessage} setterFunction={setIsErrorModalOpen} okClickedFunction={() => navigate('/wallet')} />
      {isLoading && <FixedOverlayLoadingSpinner />}


    </div>
  );
};

export default CheckoutPayment;
