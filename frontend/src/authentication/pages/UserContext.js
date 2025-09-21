


import { createContext, useState, useEffect } from 'react';
import API from '../../API';


import ErrorModal from "../../ErrorModal";
import PositiveModal from "../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../FixedOverlayLoadingSpinner"

import { useNavigate } from 'react-router-dom';
import AuthMessagePopup from './AuthMessagePopup';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const UserContext = createContext();








export const UserProvider = ({ children }) => {

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [roleFromBackend, setRoleFromBackend] = useState(null);

  const [popupTitle, setPopupTitle] = useState(null)
  const [popupMessage, setPopupMessage] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isAuthMessageModalOpen, setIsAuthMessageModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

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

  const refreshIntervalTime =4 * 60 * 1000//15*60*1000//15 minutes.
  // const refreshIntervalTime = 10 * 1000//15*60*1000//15 minutes.


useEffect(() => {
  if (!!localStorage.getItem('accessToken')) {
      setIsLoggedIn(true);
    }
      if (localStorage.getItem("refreshToken")) {
      updateToken();// to do a refresh when the app loadding for the first time. other wise it will do only after the first 4 minutes. this is for loging out just after opening the app after a closing the tab from the user side.
   
    const intervalId = setInterval(() => {
     updateToken();
    }, refreshIntervalTime);

    return () => clearInterval(intervalId);
  }
}, [isLoggedIn]);



  const login = (formData) => {
    setIsLoading(true)
    let url;
    if (isOTPInputShown) {
      url = "/api/user/submit_otp/"
    }
    else {
      url = "/api/user/login/"
    }
    API.post(url, formData).then(response => {
      setIsLoading(false)
      if (response.data.access_token === "otp_required") {
        localStorage.setItem('userID', response.data.user_id);
        localStorage.setItem('userRole', response.data.role);
        // check admin-panel
        if (['admin', 'staff'].includes(response.data.role)) {
          setRedirectUrl('/admin')
        }
        // check login redirect comes from any other page;
        else if (localRedirectUrl) {
          setRedirectUrl(localRedirectUrl)
        } else {
          setRedirectUrl("/")
        }


        showOTPInput(true)
        startOtpTimer()
      }
      else {

        setPopupTitle("Logged in succesfully.");
        setPopupMessage("Logged in succesfully.");
        // setPopupTitle("Logged in succesfully");
        // Store the token in an HTTP-only cookie
        //Cookies.set('accessToken', response.data.token, { secure: true, sameSite: 'strict', httpOnly: true }); use this for more secure login. the token will be removed after page refresh
        console.log('response from user context:', response)

        localStorage.setItem('myitem', "hiiii");
        localStorage.setItem('accessToken', response.data.access_token);
        localStorage.setItem('userID', response.data.user_id);
        localStorage.setItem('refreshToken', response.data.refresh_token);
        localStorage.setItem('userRole', response.data.role);
        localStorage.setItem('deactivatedUser', null);
        setRoleFromBackend(response.data.role);
        // check is deactivated Account
        if (response.data.is_deactivated === true) {
          localStorage.setItem('deactivatedUser', 'true');
          setRedirectUrl("/account-deactivated")
          navigate('/account-deactivated')
        }
        else {
          setIsLoggedIn(true);
          setIsMessageModalOpen(true)

        }

      }
    })
      .catch(error => {
        if (error?.response?.data?.remaining_attempt === 1) {
          setPopupMessage(`${error.response.data.message}. Warning: You have only ${error.response.data.remaining_attempt} attempt left.`);
        } else {
          setPopupMessage(error.response?.data?.message || error.message);
          console.log("error:",error)
        }
        setIsErrorModalOpen(true);
        setIsLoading(false)
      });

  };

  const updateToken = () => {
    if (isLoggedIn) {
      API.post(`/api/user/token/refresh/`, {
        "refresh": localStorage.getItem('refreshToken')
      })
        .then(response => {
          localStorage.setItem('accessToken', response.data.access_token);
          localStorage.setItem('refreshToken', response.data.refresh_token);
        })
        .catch(error => {
          logout()
          setPopupTitle("Session expired! You have logged out of the session! Please login again to continue..")
          setPopupMessage("You have logged out of the session! Please login again to continue..")
          setRedirectUrl("/login")
          navigate('/login')
          setIsAuthMessageModalOpen(true)
        });
    }
  }

  const logout = () => {
    localStorage.clear(); 

    setIsLoggedIn(false)
  };



  const redirect = () => {
    if (roleFromBackend === "admin") {
      localStorage.setItem("userRole", "admin")
      navigate('/admin')
    }
    else {
      localStorage.setItem("userRole", "user")
      navigate(redirectUrl)

    }
  }

  return (
    <UserContext.Provider value={{ isLoggedIn, login, logout, isOTPInputShown, showOTPInput, otpTimer, otpTimeout, redirectUrl, setRedirectUrl, setIsLoggedIn,  }}>
      {children}
      {isLoading && <FixedOverlayLoadingSpinner />}


      {isMessageModalOpen &&

        <PositiveModal
          title={popupTitle}
          message={popupMessage}
          state={isMessageModalOpen}
          setterFunction={setIsMessageModalOpen}
          okClickedFunction={redirect}
        />
        
      }
      <ErrorModal message={popupMessage} state={isErrorModalOpen} setterFunction={setIsErrorModalOpen} okClickedFunction={() => { }} />
      {isAuthMessageModalOpen &&
        <AuthMessagePopup
          setterFunction={setIsAuthMessageModalOpen}
          okClickedFunction={redirect}
          pageName={"login"}
          titleWeb={popupTitle}
          titleTab={popupTitle}
          titleMob={popupTitle}
          paraWeb={popupMessage}
          paraTab={popupMessage}
          paraMob={popupMessage}
          buttonText="LOGIN"
          buttonOnClick='/login'
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
