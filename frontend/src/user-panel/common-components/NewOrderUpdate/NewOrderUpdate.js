import React, { useState, useEffect } from 'react'
import './NewOrderUpdate.scss'
import API from '../../../API';
import ErrorModal from '../../../ErrorModal';
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { useNavigate } from 'react-router-dom';
import PayPalPayment from '../PayPalPayment/PayPalPayment';
import PositiveModal from '../../../PositiveModal';
import ConfirmPopup from '../ConfirmPopup/ConfirmPopup';
import AlternativeItemsForUser from '../AlternativeItemsForUser/AlternativeItemsForUser';


const NewOrderUpdate = ({ setterFunction, orderId, updateMessage, orderItem }) => {
  let navigate = useNavigate();
  const okClicked = () => {
    setterFunction(false);
    localStorage.setItem("createOrderResponse_order_id", orderId)
    navigate('/checkout-confirm')
  }

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [redirectionUrl, setRedirectionUrl] = useState(null);

  // user-modify
  const [selectedItem, setSelectedItem] = useState({});
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);


  const loadOrderData = async () => {
    let apiUrl = `/order/orders/${orderId}/`;
    setIsLoading(true);
    try {
      const response = await API.get(apiUrl);
      setIsLoading(false);
      setData(response.data);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };
  useEffect(() => {
    loadOrderData();
  }, [orderId])

  const handleReject = () => {
    setIsLoading(true)
    API.put(`/order/orders/${orderId}/`, { delivery_status: '0' })
      .then(response => {
        setIsLoading(false);
        setMessage('Order cancelled!')
        setIsMessageModalOpen(true);
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });
  }
  const handlConfirmOrder = () => {
    setIsLoading(true)
    API.put(`/order/orders/${orderId}/`, { delivery_status: '2' })
      .then(response => {
        setIsLoading(false);
        setterFunction(false)
        localStorage.setItem("createOrderResponse_order_id", orderId)
        navigate('/checkout-confirm');
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });
  }

  const handleCancelBtn = async () => {
    await loadOrderData(); // Ensure data is loaded before proceeding    
    if (!data || data.delivery_status !== '14') {
      setRedirectionUrl(`/orders/${data.id}/`)
      setMessage("Time period for confirmation expired. Order automatically cancelled due to no response.");
      setIsErrorModalOpen(true)
      return;
    }
    setIsConfirmModalOpen(true)
  }

  const handleSubmit = async () => {
    await loadOrderData(); // Ensure data is loaded before proceeding
    if (!data || data.delivery_status !== '14') {
      setRedirectionUrl(`/orders/${data.id}/`)
      setMessage("Time period for confirmation expired. Order automatically cancelled due to no response.");
      setIsErrorModalOpen(true)
      return;
    }

    if (data.to_pay_extra) {
      if (!data.is_second_payment_to_refunded) {
        setIsPaymentModalOpen(true);
      } else {
        handlConfirmOrder();
      }
    } else {
      setterFunction(false)
      localStorage.setItem("createOrderResponse_order_id", orderId)
      navigate('/checkout-confirm');
    }

  }

  const onPaymentSuccess = (data) => {
    setIsPaymentModalOpen(false);
    setMessage('Your order has been updated!');
    setIsMessageModalOpen(true);
    navigate(`/orders/${data.id}/`)
  }


  // user-modify
  const handleItemStatusChange = (status, item) => {
    setSelectedItem(item);
    // suggest
    if (status === 'modify') {
      setIsNewItemModalOpen(true)
    }
  };


  return (
    <div className='custom-modal new-order-update'>
      {data &&
        <div className='card'>
          {/* Cancelled or Accepted */}
          {updateMessage === 'Order cancelled' || updateMessage === 'order_confirmed' &&
            <div className='close-btn' >
              <button onClick={okClicked}>
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.49951 7.5L22.4995 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M22.5005 7.5L7.50049 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          }

          <div className='card-content'>

            <div className='title-1'>
              Order Update #{data.id}
            </div>
            <div className='d-flex justify-content-center'>
              <div className={`update-label position-relative ${updateMessage === 'Order cancelled' ? 'cancelled' : ''} ${updateMessage === 'order_confirmed' ? 'accepted' : ''}`}
                data-tooltip={data?.restaurant_cancellation_reason}
              >
                {updateMessage === 'Order cancelled'
                  ? 'Rejected By Restaurant'
                  : updateMessage === 'order_confirmed'
                    ? 'Order has been placed'
                    : 'Modified By Restaurant'}


                {(['13', '10', '0'].includes(data?.delivery_status) && data?.restaurant_cancellation_reason) ||
                  (data?.delivery_status === '6' && data?.failure_reason) ? (
                  <img className='info-icon' src='/images/icons/svg/info.svg' />
                ) : null}

              </div>

            </div>
            {/* table */}
            <div className='order-details'>
              <div className="sec-2">
                <div className="order-item-table mt-1">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>Sl No</th>
                        <th className='text-start'>Item Name</th>
                        <th>Quantity</th>
                        <th className='text-start'>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.items &&
                        data.items.length > 0 &&
                        data.items.filter(item => item.final)
                          .map((item, index) => (
                            <>
                              <tr className={`order-item ${item.alternative_item ? 'alter' : ''} ${item.decision_by_restaurant === '2' && 'alter unavail'}`}>
                                <td>{index + 1}</td>
                                <td className='text-start'>
                                  <div className='menu-item-name'>
                                    {item.menu_item_name}  {item?.variant_details && `(${item.variant_details})`}
                                    {/* <div>
                                      {item.topping &&
                                        <span >+({item.topping_details?.description})</span>
                                      }
                                    </div> */}
                                    {item.topping_details?.length > 0 &&
                                      item.topping_details.map((top, index) => (
                                        <div key={index} className='d-flex justify-content-between align-items-center gap-2' >
                                          <h6 className="ingredients-text">+ {top.topping?.description} (x{top.count}) </h6>
                                          {top?.price > 0 &&
                                            <span className='topping-price'>£{top?.price}</span>
                                          }
                                        </div>
                                      ))
                                    }
                                  </div>
                                </td>
                                <td>{item.count}</td>
                                <td className='text-start'> £{item.price}</td>
                              </tr>
                            </>
                          ))}
                    </tbody>
                  </table>
                </div>
                <div className="total-summary mt-2">
                  <div className="sub-total">
                    <div className='amount-key'>
                      Sub Total
                    </div>
                    £{data.sub_total}
                  </div>
                  {data.coupon_details &&
                    <div className="sub-total discount">
                      <div className="amount-key">
                        {data.coupon_details?.discount_type === 'percentage'
                          ? `Discount (${data.coupon_details.discount_value}%)`
                          : `Discount (Flat ${data.coupon_details.discount_value})`}
                      </div>
                      <div className="amount-value">-£{data.coupon_discount_applied_pounds?.toFixed(2)}</div>
                    </div>
                  }
                  {data.is_gift_card_used &&
                    <div className="sub-total discount">
                      <div className="amount-key">
                        {`Discount(Gift Card)`}
                      </div>
                      <div className="amount-value">-£{data.gift_card_amount?.toFixed(2)}</div>
                    </div>
                  }
                  {data.is_credit_balance_used &&
                    <div className="sub-total discount">
                      <div className="amount-key">
                        {`Discount(Credit Points)`}
                      </div>
                      <div className="amount-value">-£{data.credit_balance_used?.toFixed(2)}</div>
                    </div>
                  }
                  {data.is_wallet_used &&
                    <div className="sub-total discount">
                      <div className="amount-key">
                        {`Discount(Wallet)`}
                      </div>
                      <div className="amount-value">-£{data.wallet_amount_used?.toFixed(2)}</div>
                    </div>
                  }
                  <div className="sub-total">
                    <div className='amount-key'>
                      Delivery Charge
                    </div>
                    £{data.delivery_charge && data.delivery_charge.toFixed(2)}
                  </div>
                  <div className="sub-total total">
                    <div>
                      Total Amount
                    </div>
                    £{data.total_amount}
                  </div>
                </div>
              </div>
            </div>
            {/* if restaurant_id */}
            {orderItem?.extra &&
              <div className='suggestion'>
                We're sorry! The restaurant couldn't process your order this time.
                But don't worry, you can explore <a
                  onClick={() => {
                    localStorage.setItem('selectedItemID', orderItem.extra);
                    setterFunction(false);
                    navigate('/restaurant-menu')
                  }}
                  className='link'>this restaurant</a> for more delicious options!
              </div>
            }

            {/* Cancelled / Accepted */}
            {updateMessage === 'Order cancelled' || updateMessage === 'order_confirmed' ?
              <div className='btns justify-content-center'>
                <button className='btn-outlined me-2' onClick={okClicked}>
                  Close
                </button>
              </div>
              :
              <div className='btns'>
                <button className='btn-outlined me-2' onClick={handleCancelBtn}>
                  Cancel Order
                </button>
                <button className='btn-primary' onClick={handleSubmit}>
                  {data?.to_pay_extra > 0 ? (
                    data.is_second_payment_to_refunded ? (
                      <>
                        Confirm (Refund <span className='new-amount'>£{data.to_pay_extra && data.to_pay_extra.toFixed(2)}</span>)
                      </>
                    ) : (
                      <>
                        Pay <span className='new-amount'>£{data.to_pay_extra && data.to_pay_extra.toFixed(2)}</span> and Confirm
                      </>
                    )
                  ) : (
                    'Confirm'
                  )}

                </button>
              </div>

            }

          </div>
        </div>
      }
      {/* Alternative Item Modal */}
      {isNewItemModalOpen &&
        <AlternativeItemsForUser setterFunction={setIsNewItemModalOpen} restaurantId={data?.restaurant} />
      }


      {isConfirmModalOpen &&
        <ConfirmPopup message={'Are you sure you want to cancel this order?'} title={'Confirm'} setterFunction={setIsConfirmModalOpen} okClickedFunction={handleReject} />
      }


      {isPaymentModalOpen &&
        <PayPalPayment setterFunction={setIsPaymentModalOpen} orderData={data} onSubmit={() => onPaymentSuccess(data)} />
      }
      {isLoading && <FixedOverlayLoadingSpinner />}
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen}
        okClickedFunction={() => {
          setIsErrorModalOpen(false);
          if (redirectionUrl) {
            setterFunction(false)
            navigate(redirectionUrl)
          }
        }}
      />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen}
        okClickedFunction={() => { setIsMessageModalOpen(false); setterFunction(false) }} />}

    </div>
  )
}

export default NewOrderUpdate;