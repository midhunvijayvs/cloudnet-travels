import React from "react";
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import AuthBanner from "./AuthBanner";

<script src="https://accounts.google.com/gsi/client" async defer></script>

const VerifyOTP = () => {




    return (
        <>
        <div className='auth-container mail-confirmed'>
            
            <AuthBanner
                pageName={"email-confirmation"}
                titleWeb={"Verification<br/>Code"}
                titleTab={"Verification<br/>Code"}
                titleMob={"Verification<br/>Code"}
                paraWeb={"Verify your identity and gain<br/>secure access by entering the<br/>verification code sent to your<br/>registered email."}
                paraTab={"Verify your identity and gain secure access<br/>by entering the verification code sent to your<br/>registered email."}
                paraMob={"Verify your identity and gain secure access by entering the verification code sent to your registered email."}
                buttonText=""
                buttonOnClick=''
                iconTopWeb={'63%'}
                iconLeftWeb={'53%'}
                iconRotationWeb={40}
                iconTopTab={'53%'}
                iconLeftTab={"55%"}
                iconRotationTab={215}
                iconTopMob={'43%'}
                iconLeftMob={150}
                iconRotationMob={-23}
            />
            <div className='card auth-alert-page-card'>

                <div className="body">


                    <label className='lightgrey-clr user-name text-start'>EMAIL</label>
                    <div className="d-flex w-100">
                        {[0, 1, 2, 3].map((index) => (
                        <input
                            key={index}
                            type="text"
                            id={`otp${index}`}
                            name={`otp${index}`}
                            maxLength={1}
                            className="otp-input"

                        />
                        ))}
                    </div>
                    


                    <button className="btn-auth-light" type="button" >VERIFY</button>

                
                </div>
                </div>
            
            
        </div>

        </>
    )
}

export default VerifyOTP;