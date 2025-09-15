// src/pages/CheckoutPayment.js
import React, { useEffect , useState} from "react";
import { useNavigate } from "react-router-dom";
import "./WalletCheckoutPayment.scss";
import { useLocation } from "react-router-dom";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import {generateBookingId, generateTransactionId} from '../../../GeneralFunctions.js'
import API from '../../../API';
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";


const CheckoutPayment = () => {
  const navigate = useNavigate();


const location = useLocation();
const amount = location.state?.amount;
const merchant_order_id = location.state?.merchant_order_id;
const merchant_transaction_id = location.state?.merchant_transaction_id;


const [popupTitle, setPopupTitle] = useState(null)
  const [popupMessage, setPopupMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);



  useEffect(() => {
   setIsLoading(true)
  let data={
            amount: amount*100, // ₹100.00 (in paise)
            user_id: "1",
            merchant_order_id: merchant_order_id,
            merchant_transaction_id: merchant_transaction_id,
            success_redirect_url: `${window.location.origin}/wallet-checkout-confirm/?merchant_order_id=${merchant_order_id}&&merchant_transaction_id=${merchant_transaction_id}&&amount=${amount}`,
            failed_redirect_url: `${window.location.origin}/wallet-checkout-failed/?merchant_order_id=${merchant_order_id}&&merchant_transaction_id=${merchant_transaction_id}`,
          }
    API.post('/api/phonepe-payment/initiate/', data)
      .then(response => {
        console.log("response.data phonepe frm ChckoutPayment.js",response.data)
         if (response&&response.data && response.data.data.redirectUrl) {
          // Redirect user to PhonePe payment page
          // console.log("response data",response&&response.data)
         window.location.href = response.data.data.redirectUrl;
        } else {
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
          okClickedFunction={() => {navigate('/wallet')}}
 
        />

      }
      <ErrorModal state={isErrorModalOpen} message={popupMessage} setterFunction={setIsErrorModalOpen} okClickedFunction={() => navigate('/wallet')} />
      {isLoading && <FixedOverlayLoadingSpinner />}


    </div>
  );
};

export default CheckoutPayment;
