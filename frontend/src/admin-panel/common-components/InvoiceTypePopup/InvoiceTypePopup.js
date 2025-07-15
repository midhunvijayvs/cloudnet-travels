import React from 'react';
import { useNavigate } from 'react-router-dom';
import './InvoiceTypePopup.scss'


const InvoiceTypePopup = ({ message,title, state, setterFunction, okClickedFunction  }) => {
    let navigate = useNavigate();
  
    const okClicked=()=>{
        okClickedFunction(false);
        setterFunction(false)
    }
    const CreateButton = (type) => {
        setterFunction(true)
        console.log('clicked');
        navigate(`/admin/invoice/add/${type}`);
    };

  return (
    <div className='custom-modal invoice-type'>
            <div className='card'>
                <div className='close-btn' >
                    <button  onClick={okClicked}>
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.49951 7.5L22.4995 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M22.5005 7.5L7.50049 22.5" stroke="#263238" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    </button>
                </div>
                <div className='first-screen'>
                    {/* <img src='/images/positive-popup-icon.svg'></img> */}
                    <h1>Select Invoice Type</h1>
                    <p>What type of invoice would you like<br/> to create?</p>
                    
                    <div className='button-container'>
                    
                    <button type='button' className='ok-button' onClick={()=>CreateButton('service')}>Service</button>
                    <button type='button' className='ok-button' onClick={()=>CreateButton('contract')}>Contract</button>
                    <button type='button' className='ok-button' onClick={()=>CreateButton('product')}>Product</button>
                    <button type='button' className='ok-button' onClick={()=>CreateButton('custom')}>Custom</button>

                    </div>
                </div>
                    
            </div>
           

        </div>
  );
};

export default InvoiceTypePopup;
