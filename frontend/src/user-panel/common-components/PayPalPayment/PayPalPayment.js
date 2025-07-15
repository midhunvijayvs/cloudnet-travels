import React, { useState, useEffect } from 'react'
import API from '../../../API';
import ErrorModal from '../../../ErrorModal';
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import './PayPalPayment.scss'
import StripePayment from '../StripePayment/StripePayment';

const PayPalPayment = ({ setterFunction, orderData, onSubmit, deliveryStatusToUpdate }) => {

  const navigate = useNavigate();
  const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const okClicked = () => {
    setterFunction(false)
  }

  return (
    <div className='custom-modal paypal-payment'>
      <div className='card'>
        <div className='close-btn' >
          <button onClick={okClicked}>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.49951 7.5L22.4995 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M22.5005 7.5L7.50049 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
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
                        value: parseFloat(orderData.to_pay_extra)
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
                  second_payment_reference_number: data.orderID,
                  second_paypal_payment_type: "0",
                  second_payment_date: new Date(),
                  // delivery_status: deliveryStatusToUpdate,
                  second_payment_amount: parseFloat(orderData.to_pay_extra)
                }
                if (deliveryStatusToUpdate !== '17') {
                  bodyData.delivery_status = deliveryStatusToUpdate;
                } else {
                  bodyData.is_user_modification_confirmed = true;
                }
                setIsLoading(true)
                API.put(`order/orders/${orderData.id}/`, bodyData)
                  .then(response => {
                    setIsLoading(false);
                    onSubmit()
                  }
                  )
                  .catch(error => {
                    setIsLoading(false);
                    setMessage(error.response?.data?.message || error.message)
                    setIsErrorModalOpen(true);
                  }
                  )

              });
            }}


          >


          </PayPalButtons>
        </PayPalScriptProvider>
        {/* Stripe */}
        <div className='mt-4 mb-5'>
          <StripePayment amount={parseFloat(orderData.to_pay_extra)} paymentType={'second'} orderId={orderData.id}
          orderDeliveryStatus={deliveryStatusToUpdate} />
        </div>
      </div>


      {isLoading && <FixedOverlayLoadingSpinner />}
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />

    </div>
  )
}

export default PayPalPayment