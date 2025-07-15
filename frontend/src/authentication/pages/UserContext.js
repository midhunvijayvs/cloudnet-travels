


import { createContext, useState, useEffect } from 'react';
import API from '../../API';


import ErrorModal from "../../ErrorModal";
import PositiveModal from "../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../FixedOverlayLoadingSpinner"

import { useNavigate } from 'react-router-dom';
import MessagePopup from './MessagePopup';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);



  const [isLoading, setIsLoading] = useState(false);
  const [roleFromBackend, setRoleFromBackend] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [popupTitle, setPopupTitle] = useState(null)
  const [isOTPInputShown, showOTPInput] = useState(false);
  const [otpTimer, setOtpTimer] = useState(5 * 60)
  const [otpTimeout, setOtpTimeout] = useState(false)

  const [redirectUrl, setRedirectUrl] = useState("/");

  const startOtpTimer = () => {
    setOtpTimeout(false);
    setOtpTimer(5 * 60);

    let intervalId = setInterval(() => {
      setOtpTimer((prevTimer) => {
        if (prevTimer === 0) {
          setOtpTimeout(true);
          clearInterval(intervalId);
          return 0;
        } else {
          return prevTimer - 1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  };

  const localRedirectUrl = localStorage.getItem('LoginRedirectURL');

  const refreshIntervalTime = 15 * 60 * 1000//15*60*1000//15 minutes.
  useEffect(() => {
    // Check if the authentication token exists in the cookie
    //const accessToken = Cookies.get('accessToken'); use this for more secure login. the token will be removed after page refresh


    if (!!localStorage.getItem('accessToken') ) {
      setIsLoggedIn(true);
    }
    
  }, []);
  useEffect(() => {
    console.log("isLoggedIn frm usercontext:",isLoggedIn)
  }, [isLoggedIn]);

  const login = (formData) => {
    setIsLoading(true)
    let url = "/api/login/"
    API.post(url, formData).then(response => {
      setIsLoading(false)
    setUserData(response.data)

        setMessage("Logged in succesfully.");
        localStorage.setItem('accessToken', response.data.token);
      
          setIsLoggedIn(true);
          navigate(redirectUrl)
    })

      .catch(error => {
        if (error?.response?.data?.remaining_attempt === 1) {
          setMessage(`${error.response.data.message}. Warning: You have only ${error.response.data.remaining_attempt} attempt left.`);
        } else {
          setMessage(error.response?.data?.message || error.message);
        }
        setIsErrorModalOpen(true);
        setIsLoading(false)
      });

  };

 

  const logout = () => {
    const userID = localStorage.getItem('userID'); // Save userID before clearing
    localStorage.clear();  // Clear all storage

    API.post(`/user/logout/${userID}/`)
      .then(response => {
        setIsLoggedIn(false);
        showOTPInput(false);
      })
      .catch(error => {
        console.error("Logout failed:", error);
        setIsLoggedIn(false);
        showOTPInput(false);
      });
  };



  const redirect = () => {
    if (roleFromBackend === "admin") {
      localStorage.setItem("userRole", "admin")
      navigate('/admin')
    }
    else {
      localStorage.setItem("userRole", "user")
      navigate(redirectUrl)
      console.log("before reload")
      window.location.reload()
    }
  }

  return (
    <UserContext.Provider value={{ isLoggedIn, login, logout, isOTPInputShown, showOTPInput, otpTimer, otpTimeout, redirectUrl, setRedirectUrl, setIsLoggedIn, userData }}>
      {children}
      {isLoading && <FixedOverlayLoadingSpinner />}
      <ErrorModal message={message} state={isErrorModalOpen} setterFunction={setIsErrorModalOpen} okClickedFunction={() => {  }} />
      {/* {isMessageModalOpen&&<PositiveModal title={popupTitle} message={message}  setterFunction={setIsMessageModalOpen} okClickedFunction={redirect} />} */}
      {isMessageModalOpen &&
        <MessagePopup
          setterFunction={setIsMessageModalOpen}
          okClickedFunction={redirect}
          pageName={""}
          titleWeb={popupTitle}
          titleTab={popupTitle}
          titleMob={popupTitle}
          paraWeb={""}
          paraTab={""}
          paraMob={""}
          buttonText=""
          buttonOnClick=''
          iconTopWeb={'50%'}
          iconLeftWeb={'70%'}
          iconRotationWeb={0}
          iconTopTab={'53%'}
          iconLeftTab={"55%"}
          iconRotationTab={215}
          iconTopMob={'60%'}
          iconLeftMob={170}
          iconRotationMob={-23}
        />
      }

    </UserContext.Provider>
  );
};
