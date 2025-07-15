import React from 'react';
import { Modal } from "react-bootstrap";

const PositiveModal = ({ message,title, state, setterFunction, okClickedFunction  }) => {

  
const okClicked=()=>{
  okClickedFunction();
  setterFunction(false)
}

  return (
    <div className='custom-modal positive-modal'>
            <div className='card'>
               
                    <div className='first-screen'>
                        {/* <img src='/images/positive-popup-icon.svg'></img> */}
                        <h1>{title?title:"Success!"}</h1>
                        <p>{message?message:"Changes Saved Successfully"}</p>
                        
                        <div className='footer single-button-footer'>
                        
                        <button type='button' className='ok-button' onClick={okClicked}>Done</button>

                        </div>
                    </div>
                    
            </div>
           

        </div>
  );
};

export default PositiveModal;
