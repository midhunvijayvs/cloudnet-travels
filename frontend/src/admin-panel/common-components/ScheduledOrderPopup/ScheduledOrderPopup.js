import React, { useState, useEffect } from 'react'
import './ScheduledOrderPopup.scss'
import API from '../../../API';
import ErrorModal from '../../../ErrorModal';
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { useNavigate } from 'react-router-dom';


const ScheduledOrderPopup = ({ setterFunction, updateItem }) => {
  let navigate = useNavigate();
  const okClicked = () => {
    setterFunction(false)
  }

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className='custom-modal scheduled-order-popup'>
      <div className='card'>
        <div className='close-btn d-none' >
          <button onClick={okClicked}>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.49951 7.5L22.4995 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M22.5005 7.5L7.50049 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        <div className='card-content'>
          <div className='w-100 d-flex justify-content-center mb-3'>
            <div className='green-circle'>
              <img className='cooking-icon' src='/images/icons/svg/cooking-lid.svg' />
            </div>
          </div>
          <div className='title-1'>
            <span>{updateItem?.content}</span>
            {/* Scheduled order #123 needs to be prepared soon. */}
          </div>
          <div className='btns'>
            <button className='btn-primary'
              onClick={() => {
                const internalLink = updateItem?.link
                  ? new URL(updateItem.link, window.location.origin).pathname
                  : '/admin/orders/list';

                navigate(internalLink);
                setterFunction(false);
              }}
            >Tap to View</button>
          </div>
        </div>


      </div>

      {isLoading && <FixedOverlayLoadingSpinner />}
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
    </div>
  )
}

export default ScheduledOrderPopup;