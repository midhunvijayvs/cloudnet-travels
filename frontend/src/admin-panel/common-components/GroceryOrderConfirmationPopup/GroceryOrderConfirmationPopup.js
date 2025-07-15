import React, { useState, useEffect } from 'react'
import './GroceryOrderConfirmationPopup.scss'
import API from '../../../API';
import ErrorModal from '../../../ErrorModal';
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { useNavigate } from 'react-router-dom';
import PositiveModal from '../../../PositiveModal';
import OrderModifyPopup from '../OrderModifyPopup/OrderModifyPopup';
import OrderDriversPopup from '../OrderDriversPopup/OrderDriversPopup';
import { convertTimeString12Hour } from '../../../GeneralFunctions';
import GroceryOrderModifyPopup from '../GroceryOrderModifyPopup/GroceryOrderModifyPopup';
import GroceryOrderDriversPopup from '../GroceryOrderDriversPopup/GroceryOrderDriversPopup';


const GroceryOrderConfirmationPopup = ({ mode, setterFunction, selectedItem, loadData, loadTableData, setTableData }) => {
  let navigate = useNavigate();
  const okClicked = () => {
    setterFunction(false)
  }
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isOrderModifyModalOpen, setIsOrderModifyModalOpen] = useState(false);
  const [isAssigneeModalOpen, setIsAssigneeModalOpen] = useState(false);
  const [isOrderCancellingModalOpen, setIsOrderCancellingModalOpen] = useState(false);
  const [confirmResource, setConfirmResource] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [error, setError] = useState(null);
  const [data, setData] = useState(selectedItem);

  const loadOrderData = () => {
    let apiUrl = `/grocery/orders/${selectedItem.id}/`;
    setIsLoading(true)
    API.get(apiUrl)
      .then(response => {
        setIsLoading(false)
        setData(response.data);
      })
      .catch(error => {
        setIsLoading(false)
        console.error(error);
      });
  }
  useEffect(() => {
    loadOrderData();
  }, [selectedItem])


  const handleReject = () => {
    const minReasonLength = 5;
    const maxReasonLength = 200;

    if (!cancelReason || cancelReason.trim().length < minReasonLength) {
      setError(`Please enter a valid reason with at least ${minReasonLength} characters.`);
      return;
    }
    if (cancelReason.length > maxReasonLength) {
      setError(`Please enter a reason shorter than ${maxReasonLength} characters.`);
      return;
    }
    setError("")
    setIsOrderCancellingModalOpen(false)
    setConfirmResource('reject');
    setIsConfirmModalOpen(true);
  }

  const handleButtonClick = (mode) => {
    if (mode === 'modify') {
      setConfirmResource(mode)
      // setIsOrderModifyModalOpen(true)
      setIsAssigneeModalOpen(true)
    } else if (mode === 'reject') {
      setIsOrderCancellingModalOpen(true)
    }
    // accept
    else {
      setConfirmResource(mode)
      if (selectedItem?.is_pickup) {
        setIsConfirmModalOpen(true);
      } else {
        setIsAssigneeModalOpen(true)
      }
    }
  }

  const updateOrderStatus = () => {
    setIsLoading(true);
    let payLoad = { delivery_status: null };
    if (confirmResource === 'reject') {
      payLoad = { delivery_status: 13, restaurant_cancellation_reason: cancelReason }; // rejected_by_restaurant
    } else {
      payLoad = { delivery_status: 2 }; // confirmed
    }

    API.put(`/grocery/orders/${data.id}/`, payLoad)
      .then(response => {
        setMessage("Your order has been updated.")
        setIsMessageModalOpen(true);
        setIsLoading(false);
        // loadData();
        // Update the state with the updated order data in data.results
        setTableData(prevData => {
          const updatedResults = prevData.results.map(order =>
            order.id === data.id
              ? { ...order, ...response.data } // Merge updated data with the existing order
              : order
          );

          // Return updated data with modified results
          return {
            ...prevData,
            results: updatedResults,
          };
        });
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });
  }



  return (
    <div className='custom-modal order-confirm-popup'>
      <div className='card'>
        <div className='close-btn' >
          <button onClick={okClicked}>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.49951 7.5L22.4995 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M22.5005 7.5L7.50049 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        <div className='card-content'>
          <div className="top-sec">
            <div className="order-basic">
              <div className="customer-name">{data.first_name} {data.last_name}</div>
              <div className="order-id">Order ID: <span>{data.id}</span></div>
            </div>
            <div className='address'>
              {[
                data?.room_number,
                data?.data_line1,
                data?.organisation,
                data?.premise,
                data?.street,
                data?.posttown,
                data?.postcode,
                data?.county,
                data?.country,
              ].filter(part => part).join(', ')}
            </div>
          </div>
          <div className='schedule-pickup'>
            {data.is_scheduled_delivery ?
              <div className="scheduled">
                <div className="head1">
                  <i className="ri-time-line"></i>
                  Scheduled On
                </div>
                <div className="date">
                  {data.user_scheduled_delivery_request_date} ,&nbsp;
                  {data.user_scheduled_delivery_request_time && convertTimeString12Hour(data.user_scheduled_delivery_request_time)}
                </div>
              </div>
              :
              <div></div>
            }
            {data.is_pickup ?
              <div className="scheduled">
                <div className="head1">
                  <i className="ri-shopping-bag-line"></i>
                  Pickup
                </div>
                {data.user_pickup_request_time &&
                  <div className="date">
                    {data.user_pickup_request_date} ,&nbsp;
                    {data.user_pickup_request_time && convertTimeString12Hour(data.user_pickup_request_time)}
                  </div>
                }
              </div>
              :
              <div></div>
            }
          </div>
          <div className="sec-2">
            <div className="table2 mt-3">
              <table className=" w-100">
                <thead>
                  <tr>
                    <th>Sl No</th>
                    <th>Item Name</th>
                    <th className='text-center'>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items?.map((item, index) => {
                    // Find the alternative item using related_order_item
                    const alternativeItem = data.items.find(altItem => altItem.related_order_item === item.id);
                    return (
                      <React.Fragment key={item.id || `main-${index}`}>
                        {!item.related_order_item && (
                          <tr key={`main-${item.id}`} className={`${item.final ? '' : 'alter'}`}>
                            <td>{index + 1}</td>
                            <td>
                              <div>
                                {item?.grocery_item_name} {item?.variant_details && `(${item.variant_details})`}
                                {/* <div>
                                  {item.topping &&
                                    <span >+({item.topping_details?.description})</span>
                                  }
                                </div> */}
                                {item.topping_details?.length > 0 &&
                                  item.topping_details.map((top, index) => (
                                    <div key={index} className='d-flex justify-content-between align-items-center'>
                                      <h6 className="ingredients-text">+ {top.topping?.description} (x{top.count}) </h6>
                                      {top.price > 0 &&
                                        <span className='ms-3'>£{top?.price}</span>
                                      }
                                    </div>
                                  ))
                                }
                              </div>
                            </td>
                            <td className='text-center'>{item.count}</td>
                            <td className='align-baseline'> £{item.price}</td>
                          </tr>
                        )}
                        {/* Display alternative item if it exists */}
                        {item.decision === '2' &&
                          (alternativeItem ?
                            <tr key={`alt-${alternativeItem.id}`} className='alternative'>
                              <td></td>
                              <td>
                                <div >
                                  {alternativeItem?.grocery_item_name} {alternativeItem?.variant_details && `(${alternativeItem.variant_details})`}
                                </div>
                              </td>
                              <td className='text-center'>
                                {alternativeItem.count}
                              </td>
                              <td>
                                £{alternativeItem.price}
                              </td>
                            </tr>
                            :
                            <tr key={`unavailable-${item.id}`} className='unavailable'>
                              <td colSpan={4}>
                                <div >
                                  Unavailable
                                </div>
                              </td>
                            </tr>
                          )
                        }
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="total-summary mt-2">
              <div className="sub-total">
                <div>
                  Sub Total
                </div>
                £{data.sub_total}
              </div>
              {/* <div className="sub-total">
                <div>
                  Total Amount
                </div>
                £{data.total_amount}
              </div> */}
            </div>
          </div>
          {mode !== 'view' &&
            <div className='btns'>
              <button className="btn theme-outline reject" onClick={() => handleButtonClick('reject')}>Reject</button>
              <button className="btn theme-btn modify" onClick={() => handleButtonClick('modify')}>
                <i className="ri-pencil-line"></i>
                Modify
              </button>
              <button className="btn theme-btn accept" onClick={() => handleButtonClick('accept')}>Accept Order</button>
            </div>
          }
        </div>
      </div>

      {/* Confirm Modal */}
      {isConfirmModalOpen &&
        <div className='custom-modal '>
          <div className='card'>
            <div className='first-screen'>
              <img src='/images/icons/svg/warning.svg'></img>
              {confirmResource === 'reject' ?
                <>
                  <h1>Reject</h1>
                  <p>Are you sure you want to reject this order?</p>
                </>
                :
                <>
                  <h1>Accept</h1>
                  <p>Are you sure you want to accept this order?</p>
                </>
              }

              <div className='footer mt-2'>
                <button type='button' className='btn-outlined' onClick={() => { setIsConfirmModalOpen(false) }}>Cancel</button>
                <button type='button' className='btn-primary'
                  onClick={updateOrderStatus}
                >Proceed</button>
              </div>
            </div>
          </div>
        </div>
      }
      {/* assign */}
      {isAssigneeModalOpen &&
        <GroceryOrderDriversPopup setterFunction={setIsAssigneeModalOpen} data={data} loadData={loadOrderData} loadTableData={loadTableData}
          setTableData={setTableData}
          orderConfirmPopup={setterFunction} confirmResource={confirmResource}
          setIsOrderModifyModalOpen={setIsOrderModifyModalOpen} />
      }

      {/* Reject Reason */}
      {isOrderCancellingModalOpen &&
        <div className='custom-modal reason'>
          <div className='card'>
            <div className='first-screen'>
              {/* <h1>Reason</h1> */}
              <p>Please provide a reason for rejecting this order.</p>
              <div className='w-100 mb-2'>
                <textarea id="cancelling_reason" name="cancelling_reason" value={cancelReason} className=""
                  placeholder="Enter any specific reason for cancelling..."
                  onChange={(e) => { setCancelReason(e.target.value) }}
                >
                </textarea>
                {error && <div className="invalid-feedback">{error}</div>}
              </div>

              <div className='footer mt-2'>
                <button type='button' className='btn-outlined' onClick={() => { setIsOrderCancellingModalOpen(false) }}>Cancel</button>
                <button type='button' className='btn-primary'
                  onClick={handleReject}
                >Proceed</button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* modify */}
      {isOrderModifyModalOpen &&
        <GroceryOrderModifyPopup setterFunction={setIsOrderModifyModalOpen} data={data} loadData={loadOrderData}
          loadTableData={loadTableData} setTableData={setTableData} orderConfirmPopup={setterFunction} />
      }


      {isLoading && <FixedOverlayLoadingSpinner />}
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen}
        okClickedFunction={() => { setIsMessageModalOpen(false); setterFunction(false) }} />}
    </div>
  )
}

export default GroceryOrderConfirmationPopup;