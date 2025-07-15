
import React , { useState }from 'react';
import FixedOverlayLoadingSpinner from "./FixedOverlayLoadingSpinner"

import ErrorModal from "./ErrorModal";


const DeleteConfirmModal = ({ resourceName, setterFunction, onDeleteFunction }) => {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSecondScreenShown,showSecondScreen]=useState(false)


  const onDelete=()=>{
    onDeleteFunction();
    setterFunction(false)
  }


  return (
    <div className='custom-modal logout-modal'>
            <div className='card'>
               
                    <div className='first-screen'>
                        <img src='/images/delete-popup-icon.svg'></img>
                        <h1>Delete</h1>
                        <p>Are you sure you want to Delete?</p>
                        
                        <div className='footer'>
                        <button type='button' className='cancel-button' onClick={()=>{setterFunction(false)}}>Cancel</button>
                        <button type='button' className='ok-button' onClick={onDelete}>Yes, Delete</button>

                        </div>
                    </div>
                    
            </div>
            <ErrorModal message={message} state={isErrorModalOpen} setterFunction={setIsErrorModalOpen} okClickedFunction={() => { window.location.reload() }} />
            {isLoading && <FixedOverlayLoadingSpinner />}

        </div>

  );
};

export default DeleteConfirmModal;
