import React, { Component, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './Authentication.scss';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import $ from 'jquery';
// import { GoogleLogin } from '@react-oauth/google';
import FixedOverlayLoadingSpinner from "../../FixedOverlayLoadingSpinner"

import API from '../../API';

import { useContext } from 'react';
import { UserContext } from './UserContext';

import ErrorModal from "../../ErrorModal";
import AuthBanner from './AuthBanner';
import ReCAPTCHA from 'react-google-recaptcha'

<script src="https://accounts.google.com/gsi/client" async defer></script>




const Login = () => {
  const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

  const navigate = useNavigate();
  const { login, isOTPInputShown, showOTPInput, otpTimer, otpTimeout, setRedirectUrl } = useContext(UserContext);
  const [recaptchaToken, setRecaptchaToken] = useState(null);


  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const recaptchaRef = useRef(null);

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])


  const [formData, setFormData] = useState({
    username_or_email_or_phone: "",
    password: "",
    recaptchaToken: "",
    otp_channel:'email'
  });

  const [passwordShown, showPassword] = useState(false);


  const [errors, setErrors] = useState({});

  const [OTP, setOTP] = useState([null, null, null, null, null, null])


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOTPInputShown) {  // for login button
      // Validate the form fields
      const validationErrors = validateForm(formData);
      setErrors(validationErrors);
      // console.log(formData);
      // return;
      if (Object.keys(validationErrors).length === 0) {

        login(formData); // Call the login function from UserContext

      }
    }
    else {   //for OTP SUBMIT BUTTON.
      if (OTP[0] && OTP[1] && OTP[2] && OTP[3] && OTP[4] && OTP[5]) {
        setErrors({})
        login(

          {
            "user_id": window.localStorage.getItem("userID"),
            "otp": `${OTP[0]}${OTP[1]}${OTP[2]}${OTP[3]}${OTP[4]}${OTP[5]}`,
            "otp_type":'email'
          }
        )
      }
      else {
        setErrors({ otp: "Please enter 6 digits" })
      }
    }

  };

  const validateForm = (data) => {
  const errors = {};
  const value = data.username_or_email_or_phone?.trim();

  if (!value) {
    errors.username_or_email_or_phone = "Username, email, or phone number is required.";
  } else {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isUsername = /^[a-zA-Z][a-zA-Z0-9_]*$/.test(value) && !/^\d+$/.test(value);
    const isIndianPhone = /^[6-9]\d{9}$/.test(value);

    if (!isEmail && !isUsername && !isIndianPhone) {
      errors.username_or_email_or_phone = "Invalid identifier. it should be either an email, or a 10  digit phone number or a username starting with a letter";
    }
  }

  if (!data.password?.trim()) {
    errors.password = "Password is required.";
  }

  return errors;
};



  const handleOTPInputChange = (e, currentIndex) => {
    let inputValue = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers

    if (inputValue.length > 1) {
      inputValue = inputValue.charAt(inputValue.length - 1); // Keep only the last digit entered
    }

    let temp = [...OTP];
    temp[currentIndex] = inputValue;
    setOTP(temp);

    // Move to the next input field if a digit is entered
    if (inputValue && currentIndex < 5) {
      document.getElementById(`otp${currentIndex + 1}`).focus();
    }
  };

  const handleKeyDown = (e, currentIndex) => {
    if (e.key === "Backspace") {
      let temp = [...OTP];

      // If current field is not empty, just clear it and keep focus
      if (temp[currentIndex]) {
        temp[currentIndex] = "";
        setOTP(temp);
      }
      // If current field is empty, move focus to the previous field
      else if (currentIndex > 0) {
        temp[currentIndex - 1] = ""; // Clear the previous field
        setOTP(temp);
        document.getElementById(`otp${currentIndex - 1}`).focus();
      }
    }
  };




  const onGoogleLoginSuccess = (response) => {
    console.log(response.credential);

    API.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${response.credential}`, {
      headers: {
        Authorization: `Bearer ${response.credential}`,
        Accept: 'application/json'
      }
    })
      .then((res) => {
        console.log("google user basic details", res.data);
      })
      .catch((err) => console.log("error ongoogle user basic details", err));

  };
  const onGoogleLoginError = (error) => {
    console.log(error);
  };

  const handleSocialSignIn = (provider) => {
    setIsLoading(true);
    API.get(`/social_auth/${provider}/redirect`)
      .then(response => {
        setIsLoading(false);
        // window.open(response.data.redirect_url, "authPopup", 'width=600,height=600');
        window.location.href = response.data.redirect_url;

      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
      });
  };


  const onCaptchaChange = (token) => {
    setFormData({
      ...formData,
      recaptchaToken: token
    });
    setRecaptchaToken(token);
  }

  const reloadCaptcha = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };


  return (
    <div className='auth-container'>
      <AuthBanner
        pageName={"login"}
        titleWeb={"Welcome to<br/><b>Cloudnet Travels !</b>"}
        titleTab={"Welcome to <b>Cloudnet <br/>Travels !</b>"}
        titleMob={"Welcome to<br/><b>Cloudnet Travels !</b>"}
        paraWeb={"Don’t have an account? Sign up<br/>now and get started. "}
        paraTab={"Don’t have an account? Sign up now<br/> and get started. "}
        paraMob={"Don’t have an account? <br/>Sign up now and get started. "}
        buttonText="SIGN UP"
        buttonOnClick='/authentication-privacy-policy'
        iconTopWeb={'50%'}
        iconLeftWeb={'48%'}
        iconTopTab={'22%'}
        iconLeftTab={'65%'}
        iconTopMob={'11%'}
        iconLeftMob={'50%'}
        iconRotationWeb={28}
        iconRotationTab={-39}
        iconRotationMob={-42}
      />
      <div className='card'>
        <div className='f-xl black-clr mb-2 '><b className='title'>{(localStorage.getItem("userRoleRequest") === "admin") && "Admin: "} Login to your account</b></div>
        <div className='under-line'></div>
        <form  noValidate>
          <div className=' form-row'>
            <label className='lightgrey-clr user-name text-start'>USERNAME OR EMAIL</label>
            <div><input
              type="text"
              id="username_or_email_or_phone"
              name="username_or_email_or_phone"
              className={`form-control ${errors.username_or_email_or_phone ? "is-invalid" : ""}`}
              value={formData.username_or_email_or_phone}
              onChange={handleChange}
              placeholder='Username'
              disabled={isOTPInputShown}
            ></input>
              {errors.username_or_email_or_phone && <div className="invalid-feedback">{errors.username_or_email_or_phone}</div>}

            </div>
          </div>
          <div className='form-row'>
            <label className='lightgrey-clr f-xxs text-start'>PASSWORD</label>

            <div className="input-group">
              <input
                type={passwordShown ? "text" : "password"}
                id="password"
                name="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                value={formData.password}
                onChange={handleChange}
                disabled={isOTPInputShown}
                placeholder='Password'
              />
              <span className="input-group-text" onClick={() => showPassword(!passwordShown)} style={{ cursor: "pointer" }}>

                {passwordShown ?

                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12.668C1 12.668 5 4.66797 12 4.66797C19 4.66797 23 12.668 23 12.668C23 12.668 19 20.668 12 20.668C5 20.668 1 12.668 1 12.668Z" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12 15.668C13.6569 15.668 15 14.3248 15 12.668C15 11.0111 13.6569 9.66797 12 9.66797C10.3431 9.66797 9 11.0111 9 12.668C9 14.3248 10.3431 15.668 12 15.668Z" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  :


                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_1777_2198)">
                      <path d="M17.94 18.608C16.2306 19.911 14.1491 20.6329 12 20.668C5 20.668 1 12.668 1 12.668C2.24389 10.3499 3.96914 8.3246 6.06 6.72799M9.9 4.90799C10.5883 4.74687 11.2931 4.66633 12 4.66799C19 4.66799 23 12.668 23 12.668C22.393 13.8036 21.6691 14.8727 20.84 15.858M14.12 14.788C13.8454 15.0827 13.5141 15.3191 13.1462 15.4831C12.7782 15.6471 12.3809 15.7353 11.9781 15.7424C11.5753 15.7495 11.1752 15.6754 10.8016 15.5245C10.4281 15.3736 10.0887 15.149 9.80385 14.8641C9.51897 14.5793 9.29439 14.2399 9.14351 13.8664C8.99262 13.4928 8.91853 13.0927 8.92563 12.6899C8.93274 12.2871 9.02091 11.8898 9.18488 11.5218C9.34884 11.1538 9.58525 10.8226 9.88 10.548" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M1 1.66797L23 23.668" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                    <defs>
                      <clipPath id="clip0_1777_2198">
                        <rect width="24" height="24" fill="white" transform="translate(0 0.667969)" />
                      </clipPath>
                    </defs>
                  </svg>
                }

              </span>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}



            </div>
            {errors.general && <div className="text-danger">{errors.general}</div>}


          </div>
          {/* ReCaptcha
          <div className='recaptcha-container'>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={onCaptchaChange}
            />
          </div> */}

          <div className='password form-row'>
            <Link to="/forgot-password" className='black-clr  f-xs forgetpass-anc'>Forgot your password?</Link>
          </div>

          {!isOTPInputShown &&
            <button className="btn-auth-light" type='button' onClick={handleSubmit}>LOG IN </button>
          }
          {isOTPInputShown && (
            <div className='otp-form'>
              <label htmlFor="otp" className="form-label mb-0">
                OTP
              </label>

              <div className="otp-box d-flex gap-sm-3 gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <div className="form-input mb-0" key={index}>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength="1"
                      className="form-control"
                      id={`otp${index}`}
                      name={`otp${index}`}
                      value={OTP[index] || ""}
                      onChange={(e) => handleOTPInputChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  </div>
                ))}
              </div>
              {errors.otp && <div className="text-danger">{errors.otp}</div>}
              {otpTimeout ? <p className="otp-timer mt-2 expired">OTP expired! <span className="resend" onClick={() => showOTPInput(false)}>Resend OTP</span></p> : <div className="otp-timer mt-2">OTP will expire within {Math.floor(otpTimer / 60)}:{(otpTimer % 60) < 10 && "0"}{(otpTimer % 60)} min.</div>}
              <button className="btn-auth-light" type='button' onClick={handleSubmit}>SUBMIT OTP</button>
            </div>
          )}

          <div>

          </div>
        </form>


      </div>
      <ErrorModal message={message} state={isErrorModalOpen} setterFunction={setIsErrorModalOpen} okClickedFunction={() => { window.location.reload() }} />

    </div>
  )

}

export default Login