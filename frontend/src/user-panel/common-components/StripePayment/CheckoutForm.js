import { PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import API from '../../../API'
import { useNavigate } from 'react-router-dom';


export default function CheckoutForm({ paymentType, orderId, amount, orderDeliveryStatus }) {
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsProcessing(true);

    let returnUrl = `${window.location.origin}/checkout-payment`
    if (paymentType === 'second') {
      window.localStorage.setItem("paymentType", 'second');
      window.localStorage.setItem("deliveryStatus", orderDeliveryStatus);
      window.localStorage.setItem("paymentAmount", amount);
      returnUrl = `${window.location.origin}/orders/${orderId}/`
    } else {
      window.localStorage.removeItem("paymentType");
      window.localStorage.removeItem("paymentAmount");
      window.localStorage.removeItem("deliveryStatus");
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
      redirect: 'if_required'
    });
    // handle Stripe Errors -------------
    if (error) {
      setMessage(error.response?.data?.message || error.message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // save payment 
      console.log('payment Intent:: ', paymentIntent);
      if (savePaymentMethod && paymentIntent.payment_method) {

        API.post("payments/save-payment-method/", { payment_method_id: paymentIntent.payment_method })
          .then(response => {
          })
          .catch(error => {
          })
      }

      // update Order Data
      localStorage.setItem('payment_status', 'completed')
      let bodyData = {};
      let order_id = null;

      if (paymentType === 'second') {
        order_id = orderId
        bodyData = {
          second_payment_reference_number: paymentIntent.id,
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
          payment_reference_number: paymentIntent.id,
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
          // setIsErrorModalOpen(true);
        }
        )

      setMessage("Payment successful.");
    } else {
      localStorage.setItem("payment_status", "pending")
      setMessage("Unexpected error!")
    }


    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <div className="save-payment-method mt-3">
        <label className="check-box">
          <input
            type="checkbox"
            checked={savePaymentMethod}
            onChange={(e) => setSavePaymentMethod(e.target.checked)}
          />
          Save card for future payments
        </label>
      </div>
      <div className="w-100 d-flex justify-content-center mt-3">
        <button disabled={isProcessing || !stripe || !elements} id="submit">
          <span id="button-text">
            {isProcessing && stripe && elements ? "Processing ... " : "Pay now"}
          </span>
        </button>
      </div>

      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}