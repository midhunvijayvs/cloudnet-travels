
import React, { useState,useContext } from 'react';
import "../../../CustomPopup.scss";
import "./LogoutPopup.scss"
import API from '../../../API'
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { UserContext } from '../../pages/UserContext';
import ErrorModal from "../../../ErrorModal";

const LogoutPopup = ({setterFunction}) => {
    
  let navigate = useNavigate();
  
  
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { isLoggedIn, login, logout } = useContext(UserContext);
    

    

    

   
    const handleLogout = () => {
        logout();
        setterFunction(false)

        setTimeout(navigate("/home"), 1000)
    }

 return ReactDOM.createPortal(
  <>
    <div className='custom-modal logout-modal'>
      <div className='card'>
        <div className='first-screen'>
          <img src='/images/authentication-pages/logout-popup-icon.svg' alt="logout" />
          <h1>Logout</h1>
          <p>Are you sure you want to logout?</p>
          <div className='footer'>
            <button type='button' className='cancel-button' onClick={() => setterFunction(false)}>Cancel</button>
            <button type='button' className='ok-button' onClick={handleLogout}>Yes, Logout</button>
          </div>
        </div>
      </div>
    </div>
    <ErrorModal
      message={message}
      state={isErrorModalOpen}
      setterFunction={setIsErrorModalOpen}
      okClickedFunction={() => window.location.reload()}
    />
    {isLoading && <FixedOverlayLoadingSpinner />}
  </>,
  document.body
);

};

export default LogoutPopup;

