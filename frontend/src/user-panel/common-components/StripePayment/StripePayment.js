import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import CheckoutForm from './CheckoutForm';
import API from '../../../API'
import PositiveModal from "../../../PositiveModal"
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import ErrorModal from "../../../ErrorModal";
import './StripePayment.scss'
import SavedCards from '../SavedCards/SavedCards';
import { useNavigate } from 'react-router-dom';

const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

const StripePayment = ({ amount, paymentType, orderId, orderDeliveryStatus }) => {

  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");
  const [showForm, setShowForm] = useState(true); // State to control visibility
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStripeLoading, setIsStripeLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (showForm) {
      setIsStripeLoading(true);
      API.post("payments/create-stripe-payment-intent/", { amount, save_for_future: true })
        .then((response) => {
          if (isMounted) {
            setClientSecret(response.data.clientSecret);
            setIsStripeLoading(false);
          }
        })
        .catch((error) => {
          if (isMounted) {
            setMessage(error.response?.data?.message || error.message);
            setIsErrorModalOpen(true);
            setIsStripeLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [showForm, amount]);


  const handleSavedPayment = async (selectedCard) => {
    setIsLoading(true);
    API.post("payments/charge-saved-card/", { amount: amount, payment_method_id: selectedCard })
      .then(response => {
        const payment_intent_id = response.data?.payment_intent_id
        // update Order Data
        localStorage.setItem('payment_status', 'completed')
        let bodyData = {};
        let order_id = null;

        if (paymentType === 'second') {
          order_id = orderId
          bodyData = {
            second_payment_reference_number: payment_intent_id,
            second_paypal_payment_type: "4",
            second_payment_date: new Date(),
            // delivery_status: orderDeliveryStatus || '2',
            second_payment_amount: amount
          }

          if (orderDeliveryStatus !== '17') {
            bodyData.delivery_status = orderDeliveryStatus || '2';
          } else {
            bodyData.is_user_modification_confirmed = true;
          }
        } else {
          order_id = window.localStorage.getItem("createOrderResponse_order_id")
          bodyData = {
            payment_reference_number: payment_intent_id,
            payment_date: new Date(),
            payment_method: "4",
            is_order_placed: true,
            payment_status: "2",
            first_payment_amount: amount
          }
        }

        API.put(`order/orders/${order_id}/`, bodyData)
          .then(response => {
            if (paymentType === 'second') {
              navigate(`/orders/${orderId}/`)
            } else {
              window.localStorage.setItem("orderPlacedData", JSON.stringify(response.data));
              window.localStorage.removeItem("createOrderResponse_total");
              window.localStorage.removeItem("createOrderResponseData");
              navigate('/checkout-confirm');
            }

          }
          )
          .catch(error => {
            // setIsLoading(false);
            setMessage(error.response?.data?.message || error.message);
            setIsErrorModalOpen(true);
          }
          )

        setMessage("Payment successful.");
        setIsLoading(false);

      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true)
      })
  };


  return (
    <div className='stripe-payment'>
      <div onClick={() => setShowForm(prev => !prev)} className={`${showForm && 'show'} head-sec d-flex justify-content-center align-items-center mb-3`}>
        <div className='d-flex align-items-center gap-2'>
          <h3>Pay with</h3>
          <img className='stripe m-0' src='/images/icons/svg/stripe.svg' alt="Stripe" />
        </div>
        {isStripeLoading && <img className='down-arrow ms-2 m-0' src='/images/gif/stripe-load.gif' alt="Loading" />}
      </div>
      {showForm &&
        <div className='mb-3'>
          <SavedCards handleSavedPayment={handleSavedPayment} />
        </div>
      }

      {showForm && clientSecret && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm paymentType={paymentType} orderId={orderId} amount={amount} orderDeliveryStatus={orderDeliveryStatus}
          />
        </Elements>
      )}
      {isLoading && <FixedOverlayLoadingSpinner />}
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
    </div>
  )
}

export default StripePayment