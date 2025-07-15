import React, { useState, useEffect } from 'react'
import './NewOrderPopup.scss'
import API from '../../../API';
import ErrorModal from '../../../ErrorModal';
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { useNavigate } from 'react-router-dom';
import { playNewOrderSound } from '../../../GeneralFunctions';


const NewOrderPopup = ({ setterFunction, updateItem, mode }) => {
  let navigate = useNavigate();
  const okClicked = () => {
    setterFunction(false)
  }

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);



  return (
    <div className='custom-modal new-order-popup'>
      <div className='card'>
        <div className='close-btn d-none' >
          <button onClick={okClicked}>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.49951 7.5L22.4995 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M22.5005 7.5L7.50049 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        {mode === 'new' ?
          // new orders
          <div className='card-content'>
            <div className='w-100 d-flex justify-content-center mb-3'>
              <div className='green-circle'></div>
            </div>
            <div className='title-1'>
              {updateItem?.message === 'list of pending orders' ?
                <>
                  <span>{updateItem?.no_of_pending_orders}</span> New Order Received!
                </> :
                <>{updateItem?.message}</>

              }
            </div>
            <div className='btns'>
              <button className='btn-outlined' onClick={() => { navigate('/admin/orders/list'); setterFunction(false) }}>Tap to View</button>
            </div>
          </div>
          :
          // cancelled by customer
          mode === 'cancelled' ?
            <div className='card-content'>
              <div className='w-100 d-flex justify-content-center mb-3'>
                <div className='green-circle'></div>
              </div>
              <div className='title-1'>
                Order #{updateItem?.order_id} Rejected!!
              </div>
              <div className='btns'>
                <button className='btn-outlined' onClick={() => {
                  const orderId = updateItem?.order_id;
                  if (String(orderId)?.startsWith('G')) {
                    navigate(`/admin/grocery-orders/${orderId}`);
                  } else {
                    navigate(`/admin/orders/${orderId}`);
                  }
                  setterFunction(false)
                }}>
                  Tap to View
                </button>
              </div>
            </div>
            :
            // modification accepted by customer
            mode === 'confirmed' ?
              <div className='card-content'>
                <div className='w-100 d-flex justify-content-center mb-3'>
                  <div className='green-circle'></div>
                </div>
                <div className='title-1'>
                  Order #{updateItem?.order_id} Accepted!!
                </div>
                <div className='btns'>
                  <button className='btn-outlined' onClick={() => {
                    const orderId = updateItem?.order_id;
                    if (String(orderId)?.startsWith('G')) {
                      navigate(`/admin/grocery-orders/${orderId}`);
                    } else {
                      navigate(`/admin/orders/${orderId}`);
                    }
                    setterFunction(false)
                  }}>
                    Tap to View
                  </button>
                </div>
              </div>
              :
              <>
              </>

        }


      </div>

      {isLoading && <FixedOverlayLoadingSpinner />}
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
    </div>
  )
}

export default NewOrderPopup;