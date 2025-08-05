// src/pages/CheckoutPayment.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutPayment.scss";
import { useLocation } from "react-router-dom";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import {generateBookingId, generateTransactionId} from '../../../GeneralFunctions.js'

const CheckoutPayment = () => {
  const navigate = useNavigate();
const location = useLocation();
const ticket_id = location.state?.ticket_id;
const amount = 10;
const merchant_order_id = generateBookingId();
const merchant_transaction_id =generateTransactionId();
// const amount = location.state?.amount;
// const merchant_order_id = location.state?.merchant_order_id;
// const merchant_transaction_id = location.state?.merchant_transaction_id;

  useEffect(() => {
    const initiatePayment = async () => {
      try {
        const res = await fetch(`https://soulcastai.com/omairiq-proxy/api/phonepe/initiate/`, {
        // const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/phonepe/initiate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amount*100, // ₹100.00 (in paise)
            user_id: "1",
            merchant_order_id: merchant_order_id,
            merchant_transaction_id: merchant_transaction_id,
            success_redirect_url: `${window.location.origin}/checkout-confirm/?merchant_order_id=${merchant_order_id}&&merchant_transaction_id=${merchant_transaction_id}&&amount=${amount}`,
            failed_redirect_url: `${window.location.origin}/checkout-failed/?merchant_order_id=${merchant_order_id}&&merchant_transaction_id=${merchant_transaction_id}`,
          }),
        });

        const response = await res.json();

// data:{"orderId": "OMO2507251045237447051562",
//     "state": "PENDING",
//    "expireAt": 1753593323746,
//     "redirectUrl": "https://mercury-uat.phonepe.com/transact/uat_v2?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzT24iOjE3NTM0NDM5MjM3NDUsIm1lcmNoYW50SWQiOiJURVNULU0yMllYUzBGN1hWSTAiLCJtZXJjaGFudE9yZGVySWQiOiJuZXd0eG4xMjM0NTYifQ.KLF5cI5lLz8o-Pst5kv9_QLVZWXI-jmSsLZDOgXbErY"
// }

        if (response&&response.data && response.data.redirectUrl) {
          // Redirect user to PhonePe payment page
          // console.log("response data",response&&response.data)
         window.location.href = response.data.redirectUrl;
        } else {
          console.error("Payment initiation failed");
        }
      } catch (err) {
        console.error("Error initiating payment:", err);
      }
    };

    initiatePayment();
  }, [navigate]);

  return (
    <div className="checkout-payment">
      <h2>Redirecting to PhonePe...</h2>

     <FixedOverlayLoadingSpinner />
    </div>
  );
};

export default CheckoutPayment;
