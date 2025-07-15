import React, { useState, useEffect } from 'react'
import './NewOrderModificationUpdate.scss'
import API from '../../../API';
import ErrorModal from '../../../ErrorModal';
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { useNavigate } from 'react-router-dom';
import PayPalPayment from '../PayPalPayment/PayPalPayment';
import PositiveModal from '../../../PositiveModal';
import ConfirmPopup from '../ConfirmPopup/ConfirmPopup';
import AlternativeItemsForUser from '../AlternativeItemsForUser/AlternativeItemsForUser';


const NewOrderModificationUpdate = ({ setterFunction, orderId, updateMessage, orderItem }) => {
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
  const [initialOrderItems, setInitialOrderItems] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [redirectionUrl, setRedirectionUrl] = useState(null);

  // user-modify
  const [userModificationCompleted, setUserModificationCompleted] = useState(false);
  const [deliveryStatusToUpdate, setDeliveryStatusToUpdate] = useState('2');

  const [selectedItem, setSelectedItem] = useState({});
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);

  const loadOrderData = async () => {
    let apiUrl = `/order/orders/${orderId}/`;
    setIsLoading(true);
    try {
      const response = await API.get(apiUrl);
      setIsLoading(false);
      setData(response.data);
      setInitialOrderItems(response.data?.items || [])
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

  const handlConfirmOrder = async (deliveryStatus) => {
    let payLoad = { delivery_status: deliveryStatus }
    if (deliveryStatus === '17') {
      payLoad = { is_user_modification_confirmed: true }
    }
    try {
      setIsLoading(true);
      await API.put(`/order/orders/${orderId}/`, payLoad); // Await API call
      setIsLoading(false);
      // setterFunction(false);
      // localStorage.setItem("createOrderResponse_order_id", orderId);
      setMessage('Your order has been updated!');
      setRedirectionUrl(`/orders/${data.id}/`);
      setIsMessageModalOpen(true);
    } catch (error) {
      setIsLoading(false);
      setMessage(error.response?.data?.message || error.message);
      setIsErrorModalOpen(true);
      setRedirectionUrl(`/orders/${data.id}/`);
    }
  };


  const handleCancelBtn = async () => {
    await loadOrderData(); // Ensure data is loaded before proceeding    
    if (!data || !['14', '16', '17'].includes(data.delivery_status)) {
      setRedirectionUrl(`/orders/${data.id}/`)
      setMessage("Apologies! Time period for the confirmation has expired.");
      setIsErrorModalOpen(true)
      return;
    }
    setIsConfirmModalOpen(true)
  }

  const onPaymentSuccess = (data) => {
    setIsPaymentModalOpen(false);
    setMessage('Your order has been updated!');
    setIsMessageModalOpen(true);
    navigate(`/orders/${data.id}/`)
  }


  // change
  const handleItemStatusChange = (status, item) => {
    setSelectedItem(item);
    // modify
    if (status === 'modify') {
      setIsNewItemModalOpen(true)
    }
  };


  // Add Alternative Item
  const addAlternative = (newItem) => {
    setIsNewItemModalOpen(false);

    // Get userID from localStorage and ensure it's an integer
    const userID = parseInt(localStorage.getItem('userID')) || null;

    // Remove any existing alternative item related to the selected item and decision_by matching userID
    let filteredItems = data.items.filter(item =>
      item.related_order_item !== selectedItem.id || item.decision_by !== userID
    );

    // Ensure numeric values before calculations
    let updatedCount = selectedItem.count
    if (newItem?.count) {
      updatedCount = newItem.count
    }

    // const offerPrice = parseFloat(newItem.offer_price) || 0;
    const offerPrice = newItem.variant ? parseFloat(newItem.price) || 0 : parseFloat(newItem.offer_price) || 0;
    const toppingPrice = parseFloat(newItem.addedToppingDetails?.price) || 0;
    const count = parseInt(updatedCount) || 1;

    // Calculate the price based on toppings
    let calculatedPrice = offerPrice
    if (newItem?.addedToppingDetails) {
      calculatedPrice = (offerPrice + toppingPrice);
    }
    // console.log(newItem?.count);


    // Create the new alternative item object
    const newItemObject = {
      price: calculatedPrice,
      final: true,
      menu_item: newItem.id,
      menu_item_details: newItem,
      menu_item_name: newItem?.name,
      order: selectedItem.order,
      count: updatedCount,
      restaurant: selectedItem.restaurant,
      restaurant_name: selectedItem.restaurant_name,
      related_order_item: selectedItem.id,
      decision: '3',
      decision_by: userID,
      topping: newItem?.addedTopping || null,
      toppings: newItem?.addedToppings || [],
      topping_details: newItem?.addedToppingDetails || [],
      variant: newItem?.variant || null,
      variant_details: newItem?.variant_details || null,
    };

    // Update the main item to mark it as having an alternative (Unavailable)
    const updatedItems = filteredItems.map(item => {
      if (item.id === selectedItem.id) {
        return { ...item, decision: '2', final: false };  // Update the main item
      } else if (item.related_order_item === selectedItem.id) {
        return { ...item, final: false };  // Update any alternative items
      }
      return item;
    });

    // Add the new alternative item
    updatedItems.push(newItemObject);

    // Update state with the modified items list
    setData(prevData => ({
      ...prevData,
      items: updatedItems
    }));
  };


  // Remove Alternative Item
  const removeAlternative = (mainItem) => {
    // Get userID from localStorage and ensure it's an integer
    const userID = parseInt(localStorage.getItem('userID')) || null;

    // Filter out the alternative item added by the user
    let updatedItems = data.items.filter(item =>
      item.related_order_item !== mainItem.id || item.decision_by !== userID
    );

    // Check if a restaurant-suggested alternative exists for this main item and its decision is '3'
    updatedItems = updatedItems.map(item => {
      if (item.related_order_item === mainItem.id && item.decision_by !== userID && item.decision === '3') {
        return { ...item, final: true }; // Revert final to true if suggested by the restaurant and decision is '3'
      }
      return item;
    });

    // Update state
    setData(prevData => ({
      ...prevData,
      items: updatedItems
    }));
  };


  // Set as Rejected
  const handleItemReject = (orderItem) => {
    // Update the item's decision to '4' (Rejected) and set final to false
    const updatedItems = data.items.map(item =>
      item.id === orderItem.id ? { ...item, decision: '4', final: false } : item
    );
    // Update state with modified items list
    setData(prevData => ({
      ...prevData,
      items: updatedItems
    }));
  };

  const handleRestoreRejectedItem = (orderItem) => {
    const updatedItems = data.items.map(item =>
      item.id === orderItem.id ? { ...item, decision: '3', final: true } : item
    );

    setData(prevData => ({
      ...prevData,
      items: updatedItems
    }));
  };


  const updateOrderItems = async () => {
    await loadOrderData(); // Ensure data is loaded before proceeding
    if (!data || !['14', '16', '17'].includes(data.delivery_status)) {
      setRedirectionUrl(`/orders/${data.id}/`)
      setMessage("Apologies! Time period for the confirmation has expired.");
      setIsErrorModalOpen(true)
      return;
    }

    const url = "/order/order-item/";
    const orderUrl = `/order/orders/${data.id}/update-delivery-status/`;

    setIsLoading(true); // Start loading before processing

    // Create a map of existing items by ID for quick lookup
    const existingItemsMap = new Map(initialOrderItems.map(item => [item.id, item]));

    let updatePromises = [];
    let hasChanges = false;  // Flag to track if any item has been updated or added

    for (const item of data.items) {
      if (item.id && existingItemsMap.has(item.id)) {
        // Check if item has changed compared to existing data
        const existingItem = existingItemsMap.get(item.id);
        if (JSON.stringify(existingItem) !== JSON.stringify(item)) {
          console.log(item.menu_item_name, '...updating');
          hasChanges = true; // Set flag to true if there are any changes

          const updatePromise = API.put(`${url}${item.id}/`, { decision: item.decision, final: item.final })
            .catch(error => {
              setMessage(error.response?.data?.message || error.message);
              setIsErrorModalOpen(true);
            });

          updatePromises.push(updatePromise);
        }
      } else {
        console.log(item.menu_item_name, '...adding');
        // New item (no existing ID)
        hasChanges = true; // Set flag to true if a new item is being added

        const addPromise = API.post(url, item).catch(error => {
          setMessage(error.response?.data?.message || error.message);
          setIsErrorModalOpen(true);
        });

        updatePromises.push(addPromise);
      }
    }

    // Wait for all updates (add, update, delete) to complete
    await Promise.all(updatePromises);


    // After everything is done, update order delivery_status
    try {
      const deliveryStatus = hasChanges ? '17' : '16'; // Set status based on whether there were changes
      // ====== Modifications from Customer ======
      if (hasChanges) {
        await API.put(orderUrl, { delivery_status: deliveryStatus });
        console.log(`Order delivery status updated to ${deliveryStatus}.`);
        loadOrderData()
        // setterFunction(false);
      } else {
        // ====== No modifications from Customer ======
        if (!data.is_second_payment_to_refunded && data.to_pay_extra) {
          setDeliveryStatusToUpdate('2')
          setIsPaymentModalOpen(true);
        } else {
          await handlConfirmOrder('2'); //confirmed
        }
      }

    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
      setIsErrorModalOpen(true);
    }
    setIsLoading(false); // Stop loading after all API calls complete
  };

  const handleSubmitAfterModification = () => {
    if (!data.is_second_payment_to_refunded && data.to_pay_extra) {
      setDeliveryStatusToUpdate('17')
      setIsPaymentModalOpen(true);
    } else {
      handlConfirmOrder('17');
    }
  }




  return (
    <div className='custom-modal new-order-modify-update'>
      {data &&
        <div className='card'>
          {/* Cancelled or Accepted */}
          <div className='close-btn' >
            <button onClick={() => setterFunction(false)}>
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.49951 7.5L22.4995 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M22.5005 7.5L7.50049 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>


          <div className='card-content'>

            <div className='title-1'>
              Order Update #{data.id}
            </div>
            <div className='d-flex justify-content-center'>
              <div className={`update-label position-relative ${updateMessage === 'Order cancelled' ? 'cancelled' : ''} ${updateMessage === 'order_confirmed' ? 'accepted' : ''}`}
                data-tooltip={data?.restaurant_cancellation_reason}
              >
                {data.delivery_status === '17' ?
                  'Modified By Customer' :
                  'Modified By Restaurant'
                }
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
                        <th className='text-center'>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.items?.map((item, index) => {
                        // Filter alternative item by customer (decision_by matches data.user)
                        const alternativeItemByCustomer = data.items.find(
                          altItem => altItem.related_order_item === item.id && altItem.decision_by === data.user
                        );

                        // Filter alternative item by restaurant (decision_by matches data.restaurant)
                        const alternativeItemByRestaurant = data.items.find(
                          altItem => altItem.related_order_item === item.id && altItem.decision_by !== data.user
                        );
                        return (
                          <React.Fragment key={item.id || `main-${index}`}>
                            {!item.related_order_item && (
                              <tr key={`main-${item.id}`} className={`${item.final ? 'final' : 'alter'}`}>
                                <td>{index + 1}</td>
                                <td className='text-start'>
                                  <div className='menu-item-name'>
                                    {item.menu_item_name} {item?.variant_details && `(${item.variant_details})`}
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
                                <td className='status-column'>
                                  <div className='d-flex justify-content-center'>
                                    <div
                                      className={`status-text
                                              ${item.decision === "1" ? "accepted-btn" : ""}
                                              ${item.decision === "2" ? "unavailable-btn" : ""}
                                              ${item.decision === "3" ? "altered-btn" : ""}
                                              ${item.decision === "4" ? "rejected-btn" : ""}
                                            `}
                                    >
                                      {item.decision === "1" && "Accepted"}
                                      {item.decision === "2" && "Unavailable"}
                                      {item.decision === "3" && "Modified"}
                                      {item.decision === "4" && "Rejected"}
                                    </div>

                                  </div>
                                </td>
                              </tr>
                            )}

                            {/* Display alternative item if it exists */}
                            {!item.final &&
                              (alternativeItemByRestaurant ?
                                <tr className={`alternative ${alternativeItemByRestaurant.final ? '' : 'rejected'}`}>
                                  <td>

                                  </td>
                                  <td className='text-start'>
                                    <div className='menu-item-name'>
                                      {alternativeItemByRestaurant.menu_item_name} {alternativeItemByRestaurant?.variant_details && `(${alternativeItemByRestaurant.variant_details})`}
                                      {/* <div>
                                        {alternativeItemByRestaurant.topping &&
                                          <span >+({alternativeItemByRestaurant.topping_details?.description})</span>
                                        }
                                      </div> */}
                                      {alternativeItemByRestaurant.topping_details?.length > 0 &&
                                        alternativeItemByRestaurant.topping_details.map((top, index) => (
                                          <div key={index} className='d-flex justify-content-between align-items-center gap-2' >
                                            <h6 className="ingredients-text">+ {top.topping?.description} (x{top.count}) </h6>
                                            { top.price > 0 &&
                                              <span className='topping-price'>£{top?.price}</span>
                                            }
                                          </div>
                                        ))
                                      }
                                    </div>
                                  </td>
                                  <td>
                                    {alternativeItemByRestaurant.count}
                                  </td>
                                  <td className='text-start'>
                                    £{alternativeItemByRestaurant?.price}
                                  </td>
                                  <td className='text-center'>
                                    {data.delivery_status === '14' ?
                                      <div className='d-flex flex-column justify-content-center'>
                                        <div className='alter-new-btn' onClick={() => handleItemStatusChange('modify', item)}>
                                          Choose Alternative
                                        </div>
                                        <div
                                          className={`alter-new-btn mt-1 ${alternativeItemByRestaurant.decision === '4' ? 'revert' : 'reject'}`}
                                          onClick={() => {
                                            if (alternativeItemByRestaurant.decision === '4') {
                                              handleRestoreRejectedItem(alternativeItemByRestaurant);
                                            } else {
                                              handleItemReject(alternativeItemByRestaurant);
                                            }
                                          }}
                                        >
                                          {alternativeItemByRestaurant.decision === '4' ? 'Restore Suggestion' : 'Reject Suggestion'}
                                        </div>

                                      </div>
                                      :
                                      <div className='d-flex justify-content-center'>
                                        <div
                                          className={`status-text
                                              ${alternativeItemByRestaurant.decision === "1" ? "accepted-btn" : ""}
                                              ${alternativeItemByRestaurant.decision === "2" ? "unavailable-btn" : ""}
                                              ${alternativeItemByRestaurant.decision === "3" ? "altered-btn" : ""}
                                              ${alternativeItemByRestaurant.decision === "4" ? "rejected-btn" : ""}
                                            `}
                                        >
                                          {alternativeItemByRestaurant.decision === "1" && "Accepted"}
                                          {alternativeItemByRestaurant.decision === "2" && "Unavailable"}
                                          {alternativeItemByRestaurant.decision === "3" && "Modified by Restaurant"}
                                          {alternativeItemByRestaurant.decision === "4" && "Rejected"}
                                        </div>

                                      </div>
                                    }
                                  </td>
                                </tr>
                                : !item.related_order_item ?
                                  <tr className='unavailable'>
                                    <td colSpan={4}>
                                      <div >
                                        Marked as unavailable by Restaurant
                                      </div>
                                    </td>
                                    {data.delivery_status === '14' ?
                                      <td className='text-center'>
                                        <div className='d-flex justify-content-center'>
                                          <div className='alter-new-btn' onClick={() => handleItemStatusChange('modify', item)}>
                                            Choose Alternative
                                          </div>
                                        </div>
                                      </td>
                                      :
                                      <td></td>
                                    }
                                  </tr>
                                  :
                                  null
                              )
                            }
                            {/* Display alternative item if it exists */}
                            {!item.final &&
                              (alternativeItemByCustomer &&
                                <tr className={`alternative ${alternativeItemByCustomer.final ? '' : 'rejected'}`}>
                                  <td>

                                  </td>
                                  <td className='text-start'>
                                    <div className='menu-item-name'>
                                      {alternativeItemByCustomer.menu_item_name}  {alternativeItemByCustomer?.variant_details && `(${alternativeItemByCustomer.variant_details})`}
                                      {/* <div>
                                        {alternativeItemByCustomer.topping &&
                                          <span >+({alternativeItemByCustomer.topping_details?.description})</span>
                                        }
                                      </div> */}
                                      {alternativeItemByCustomer.topping_details?.length > 0 &&
                                        alternativeItemByCustomer.topping_details.map((top, index) => (
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
                                  <td>
                                    {alternativeItemByCustomer.count}
                                  </td>
                                  <td className='text-start'>
                                    £{alternativeItemByCustomer?.price}
                                  </td>
                                  {data.delivery_status === '14' ?
                                    <td className='text-center'>
                                      <div className='d-flex justify-content-center'>
                                        <div className='alter-new-btn remove' onClick={() => removeAlternative(item)}>
                                          Remove Alternative
                                        </div>
                                      </div>
                                    </td>
                                    :
                                    <td className='status-column'>
                                      <div className='d-flex justify-content-center'>
                                        <div
                                          className={`status-text
                                              ${alternativeItemByCustomer.decision === "1" ? "accepted-btn" : ""}
                                              ${alternativeItemByCustomer.decision === "2" ? "unavailable-btn" : ""}
                                              ${alternativeItemByCustomer.decision === "3" ? "altered-btn" : ""}
                                              ${alternativeItemByCustomer.decision === "4" ? "rejected-btn" : ""}
                                            `}
                                        >
                                          {alternativeItemByCustomer.decision === "1" && "Accepted"}
                                          {alternativeItemByCustomer.decision === "2" && "Unavailable"}
                                          {alternativeItemByCustomer.decision === "3" && "Suggested by Customer"}
                                          {alternativeItemByCustomer.decision === "4" && "Rejected"}
                                        </div>

                                      </div>
                                    </td>
                                  }
                                </tr>
                              )
                            }
                          </React.Fragment>
                        )
                      })}
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
                  {data.coupon_details && data.coupon_discount_applied_pounds ? (
                    <div className="sub-total discount">
                      <div className="amount-key">
                        {data.coupon_details?.discount_type === 'percentage'
                          ? `Discount (${data.coupon_details.discount_value}%)`
                          : `Discount (Flat ${data.coupon_details.discount_value})`}
                      </div>
                      <div className="amount-value">
                        -£{data.coupon_discount_applied_pounds?.toFixed(2)}</div>
                    </div>
                  ) : null}
                  {data.is_gift_card_used > 0 &&
                    <div className="sub-total discount">
                      <div className="amount-key">
                        {`Discount(Gift Card)`}
                      </div>
                      <div className="amount-value">-£{data.gift_card_amount?.toFixed(2)}</div>
                    </div>
                  }
                  {data.is_credit_balance_used > 0 &&
                    <div className="sub-total discount">
                      <div className="amount-key">
                        {`Discount(Credit Points)`}
                      </div>
                      <div className="amount-value">-£{data.credit_balance_used?.toFixed(2)}</div>
                    </div>
                  }
                  {data.is_wallet_used > 0 &&
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
                  {(data.to_pay_extra && data.to_pay_extra > 0) ?
                    (
                      <div className="sub-total">
                        {data.is_second_payment_to_refunded ?
                          (
                            <>
                              <div className='amount-key refund'>
                                Refund
                              </div>
                              £{data.to_pay_extra && data.to_pay_extra.toFixed(2)}
                            </>
                          )
                          :
                          (
                            <>
                              <div className='amount-key extra-pay'>
                                Pay Extra
                              </div>
                              £{data.to_pay_extra ? data.to_pay_extra.toFixed(2) : 0}
                            </>
                          )
                        }
                      </div>
                    ) : null}
                  <div className="sub-total total">
                    <div>
                      Total Amount
                    </div>
                    £{data.total_amount}
                  </div>
                </div>
              </div>
            </div>
            <div className='btns'>
              <button className='btn-outlined me-2' onClick={handleCancelBtn}>
                Cancel Order
              </button>
              {data.delivery_status === '14' ?
                <button className='btn-primary' onClick={updateOrderItems} disabled={isLoading}>
                  Proceed
                </button>
                :
                <button className='btn-primary' onClick={handleSubmitAfterModification} disabled={isLoading}>
                  Confirm Order
                </button>
              }
            </div>
          </div>
        </div>
      }

      {/* Alternative Item Modal */}
      {isNewItemModalOpen &&
        <AlternativeItemsForUser setterFunction={setIsNewItemModalOpen} restaurantId={data?.restaurant}
          addAlternative={addAlternative} mainItem={selectedItem} />
      }


      {isConfirmModalOpen &&
        <ConfirmPopup message={'Are you sure you want to cancel this order?'} title={'Confirm'} setterFunction={setIsConfirmModalOpen} okClickedFunction={handleReject} />
      }


      {isPaymentModalOpen &&
        <PayPalPayment setterFunction={setIsPaymentModalOpen} orderData={data} deliveryStatusToUpdate={deliveryStatusToUpdate} onSubmit={() => onPaymentSuccess(data)} />
      }
      {isLoading && <FixedOverlayLoadingSpinner />}
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen}
        okClickedFunction={() => {
          if (redirectionUrl) {
            setterFunction(false)
            navigate(redirectionUrl)
          }
          setIsErrorModalOpen(false);
        }}
      />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen}
        okClickedFunction={() => {
          if (redirectionUrl) {
            setIsMessageModalOpen(false); setterFunction(false);
            navigate(redirectionUrl)

          } else {
            setIsMessageModalOpen(false); setterFunction(false)
          }
        }} />}

    </div>
  )
}

export default NewOrderModificationUpdate;