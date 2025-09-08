import React from "react";
import { useState } from "react";
import { Link } from 'react-router-dom'
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';

import API from '../../API';
import ErrorModal from "../../ErrorModal";
import PositiveModal from "../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../FixedOverlayLoadingSpinner"
import { useLocation } from 'react-router-dom';
import AuthBanner from "./AuthBanner";


<script src="https://accounts.google.com/gsi/client" async defer></script>

const View = () => {

    const location = useLocation();
    const { hash, pathname, search } = location; 

   
    const url = new URL(window.location.href);

    // Get the 'token' parameter from the URL
    // const pswdResetTocken = url.searchParams.get('token');
    const pathSegments = pathname.split('/');
    const pswdResetTocken = pathSegments[pathSegments.length - 2];

    let navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});

    const [passwordShown1, showPassword1] = useState(false);
    const [passwordShown2, showPassword2] = useState(true);

    const [message, setMessage] = useState(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
   
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = (data) => {
        const errors = {};

        // Validate each field and add errors if necessary




        if (!data.password.trim()) {
            errors.password = "Password is required.";
        } else if (data.password.length < 8) {
            errors.password = "Password must be at least 8 characters.";
        } else {
            // Password must contain at least one letter, one number, and one special character
            if (!/[a-zA-Z]/.test(data.password)) {
                errors.password = "Password must contain at least one letter.";
            } else if (!/\d/.test(data.password)) {
                errors.password = "Password must contain at least one number.";
            } else if (!/[!@#$%^&*]/.test(data.password)) {
                errors.password = "Password must contain at least one special character (!@#$%^&*).";
            }
        }


        if (!data.confirmPassword.trim()) {
            errors.confirmPassword = "Confirm password is required.";
        } else if (data.password !== data.confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
        }

        return errors;
    };


    const resetPassword = (e) => {
        e.preventDefault();

        let data = {
            password: $("#password").val(),
            confirmPassword: $("#confirmPassword").val()
        }
        console.log("data,", data)

        // Validate the form fields
        const validationErrors = validateForm(data);
        setFormErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true)
            API.put(`/api/user/password-reset/confirm/${pswdResetTocken}/`, { password: $("#password").val() })
                .then(response =>{
                    navigate("/password-changed");
                  
                }

                )
                .catch(error => {
                    console.log(error)
                    setMessage("something went wrong, try again")
                    setIsErrorModalOpen(true)
                    setIsLoading(false)

                }

                )


        }
    }

    return (
        <>
            <div className='reset-password auth-container'>
                <AuthBanner
                    pageName={"new-password"}
                    titleWeb={"Change<br/>Password"}
                    titleTab={"Change Password"}
                    titleMob={"Change<br/>Password"}
                    paraWeb={"Enhance your account's security<br/>by changing your password."}
                    paraTab={"Enhance your account's security by<br/>changing your password."}
                    paraMob={"Enhance your account's security<br/>by changing your password."}
                    buttonText=""
                    buttonOnClick=''
                    iconTopWeb={'50%'}
        iconLeftWeb={'48%'}
        iconTopTab={'25%'}
        iconLeftTab={'64%'}
        iconTopMob={'21%'}
        iconLeftMob={'50%'}
                />
                <div className='card'>
                    <div className="body">
                        <form>
                            <div className="form-row">
                            <label className='lightgrey-clr user-name text-start'>PASSWORD</label>
                            <div className="input-group">
                                <input
                                    type={passwordShown1 ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className={`form-control ${formErrors.password ? "is-invalid" : ""}`}>
                                    
                                </input>
                                <span class="input-group-text"  onClick={() => showPassword1(!passwordShown1)}>
                                    {passwordShown1 ?

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
                                        :

                                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 12.668C1 12.668 5 4.66797 12 4.66797C19 4.66797 23 12.668 23 12.668C23 12.668 19 20.668 12 20.668C5 20.668 1 12.668 1 12.668Z" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M12 15.668C13.6569 15.668 15 14.3248 15 12.668C15 11.0111 13.6569 9.66797 12 9.66797C10.3431 9.66797 9 11.0111 9 12.668C9 14.3248 10.3431 15.668 12 15.668Z" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    }
                                </span>
                            </div>
                            {formErrors.password && <div className="text-danger">{formErrors.password}</div>}

                            </div>

                            <div className="form-row">

                            <label className='lightgrey-clr user-name text-start'>CONFIRM PASSWORD</label>
                            <div className="input-group">
                                <input
                                    type={passwordShown2 ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className={`form-control ${formErrors.confirmPassword ? "is-invalid" : ""}`}
                                    
                                />
                                <span className="input-group-text" onClick={() => showPassword2(!passwordShown2)}>
                                    {passwordShown2 ?

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
                                    :

                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 12.668C1 12.668 5 4.66797 12 4.66797C19 4.66797 23 12.668 23 12.668C23 12.668 19 20.668 12 20.668C5 20.668 1 12.668 1 12.668Z" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12 15.668C13.6569 15.668 15 14.3248 15 12.668C15 11.0111 13.6569 9.66797 12 9.66797C10.3431 9.66797 9 11.0111 9 12.668C9 14.3248 10.3431 15.668 12 15.668Z" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    }

                                </span>
                                {formErrors.confirmPassword && <div className="invalid-feedback">{formErrors.confirmPassword}</div>}

                            </div>
                            </div>
                            <button  className="btn-auth-light" onClick={resetPassword}>CHANGE PASSWORD</button>
                        </form>

                    </div>
                </div>
            </div>


               
            <ErrorModal message={message} state={isErrorModalOpen} setterFunction={setIsErrorModalOpen} okClickedFunction={()=>{}}/>
            {isMessageModalOpen&&<PositiveModal message={message}  setterFunction={setIsMessageModalOpen} okClickedFunction={() => navigate('/confirm-mail')} />}
      {isLoading && <FixedOverlayLoadingSpinner />}

        </>
    )
}

export default View;