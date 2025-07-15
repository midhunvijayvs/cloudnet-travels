import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import API from '../../API';
import ErrorModal from "../../ErrorModal";
import FixedOverlayLoadingSpinner from "../../FixedOverlayLoadingSpinner"
import MessagePopup from "./MessagePopup";

const View = () => {

    let navigate = useNavigate();

    const [isActivated, setIsActivated] = useState(false);

    const [message, setMessage] = useState(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const url = new URL(window.location.href);

        // Get the 'token' parameter from the URL
        const token = url.searchParams.get('token');

        // Now 'token' contains the value of the 'token' parameter from the URL
        console.log('Token:', token);

        setIsLoading(true)
        API.get(`/user/activate/?token=${token}`)
            .then(response => {
                console.log("response", response);
                setIsLoading(false)
                setIsActivated(true)
                
            }
            )
            
            .catch(error => {
                console.log(error)
                setMessage("something went wrong, try again")
                // setIsErrorModalOpen(true)
                setIsLoading(false)
                setIsActivated(true)
            }

            )

    }, [])



    return (
        <>
            <div className='auth-container mail-confirmed'>

                {isActivated &&
                    <MessagePopup
                        okClickedFunction={() => navigate('/login')}
                        pageName={"email-confirmed"}
                        titleWeb={"Yay! Your Email<br/>has been Verified!"}
                        titleTab={"Yay! Your Email has been Verified!"}
                        titleMob={"Yay! Your Email has been Verified!"}
                        paraWeb={"You're all set to explore a world of<br/>exciting opportunities now that your<br/>mail has been verified."}
                        paraTab={"You're all set to explore a world of exciting opportunities now that your email has been verified."}
                        paraMob={"You're all set to explore a world of exciting opportunities now that your email has been verified."}
                        buttonText="PROCEED"
                        buttonOnClick='/login'
                        iconTopWeb={'50%'}
        iconLeftWeb={'48%'}
        iconTopTab={'25%'}
        iconLeftTab={'64%'}
        iconTopMob={'21%'}
        iconLeftMob={'50%'}
                        iconRotationMob={-23}
                    />
                }
            </div>
            

            <ErrorModal message={message} state={isErrorModalOpen} setterFunction={setIsErrorModalOpen} okClickedFunction={() => { }} />
            {isLoading && <FixedOverlayLoadingSpinner />}
        </>
    )
}

export default View;