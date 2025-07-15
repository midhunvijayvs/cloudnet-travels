import React from "react";
import { useState } from "react";
import { Link } from 'react-router-dom'
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';

import API from '../../API';
import AuthBanner from "./AuthBanner";
import MessagePopup from "./MessagePopup";


<script src="https://accounts.google.com/gsi/client" async defer></script>

const View = () => {

    let navigate = useNavigate();
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [popupTitle,setPopupTitle]=useState(null)
    const [popupPara,setPopupPara]=useState(null)

    const [errors, setErrors] = useState({});


    const validateForm = (data) => {
        const errors = {};

        // Validate each field and add errors if necessary

        if (!data.email.trim()) {
            errors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = "Invalid email address.";
        }
        return errors;
    };


    const sendMail = (e) => {
        var email = $("#email").val();
        var data = { "email": email }

        e.preventDefault();

        // Validate the form fields
        const validationErrors = validateForm(data);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            API.post("/user/password-reset/",  data)
                .then((response)=>
                    {
                    setIsMessageModalOpen(true)
                    setPopupTitle('Check your mail')
                    setPopupPara('We have sent a confirmation email ')
                    // navigate("/confirm-mail")
                    }
                )
                .catch((error)=>
                    setErrors({ "email": "Not found!" })
                )
        }
    }
    return (
        <>
           <div className='auth-container mail-confirmed'>
                <AuthBanner
                    pageName={"forgot-password"}
                    titleWeb={"Forgot<br/> Password?"}
                    titleTab={"Forgot Password?"}
                    titleMob={"Forgot<br/> Password?"}
                    paraWeb={"No worries, regain access to your<br/>account by resetting your<br/>password effortlessly."}
                    paraTab={"No worries, regain access to your<br/>account by resetting your password<br/>effortlessly."}
                    paraMob={"No worries, regain access to your<br/>account by resetting your password<br/>effortlessly."}
                    buttonText=""
                    buttonOnClick=''
                    iconTopWeb={'50%'}
        iconLeftWeb={'48%'}
        iconTopTab={'25%'}
        iconLeftTab={'64%'}
        iconTopMob={'21%'}
        iconLeftMob={'50%'}
                    iconRotationWeb={56}
                    iconRotationTab={-33}
                    iconRotationMob={-25}
                />
                <div className='card auth-alert-page-card'>

                    <div className="body">
                

                        <label className='lightgrey-clr user-name text-start'>EMAIL</label>
                        <input placeholder="Type your email here" className=" form-control mb-3" id="email"></input>

                        {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}

                        <button className="btn-auth-light" type="button" onClick={sendMail}>SEND MAIL</button>

                     
                    </div>
                </div>
        </div>

        {isMessageModalOpen &&
            <MessagePopup
                timeout={5000}
                setterFunction={setIsMessageModalOpen}
                okClickedFunction={()=> navigate('/login')}
                pageName={""}
                titleWeb={popupTitle}
                titleTab={popupTitle}
                titleMob={popupTitle}
                paraWeb={popupPara}
                paraTab={popupPara}
                paraMob={popupPara}
                buttonText=""
                buttonOnClick=''
                iconTopWeb={'50%'}
                iconLeftWeb={'70%'}
                iconRotationWeb={0}
                iconTopTab={'53%'}
                iconLeftTab={"55%"}
                iconRotationTab={215}
                iconTopMob={'50%'}
                iconLeftMob={170}
                iconRotationMob={-23}
            />
        }


               
        </>
    )
}

export default View;