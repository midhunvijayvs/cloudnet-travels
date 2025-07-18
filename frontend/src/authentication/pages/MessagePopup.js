import React from "react";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
<script src="https://accounts.google.com/gsi/client" async defer></script>

const MessagePopup = (props) => {
    const renderHTML = (text) => ({ __html: text });
    let navigate = useNavigate();
    const { timeout = 10000 } = props;
    useEffect(() => {
        localStorage.setItem("userRoleRequest", "user")
        const redirectTimeout = setTimeout(() => {
            if (props.navigateTo) {
              navigate(props.navigateTo);
            } else {
              navigate("/login");
            }
          }, timeout);

        return () => clearTimeout(redirectTimeout);

    }, [])

    const closeClicked=()=>{
        props.okClickedFunction();
        if (props.setterFunction){
            props.setterFunction(false);
        }
      }

    return (
        <>
            <div className='auth-banner auth-alert-page-popup'>
                <div className="close-icon" onClick={closeClicked}>
                    <svg  width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.9408 21.3438C19.736 21.3439 19.5332 21.3037 19.344 21.2254C19.1548 21.1471 18.9828 21.0323 18.838 20.8875L0.975998 3.02451C0.827081 2.88068 0.708299 2.70863 0.626584 2.5184C0.544869 2.32818 0.501858 2.12358 0.500059 1.91655C0.49826 1.70953 0.537709 1.50422 0.616106 1.3126C0.694503 1.12098 0.810277 0.946896 0.956672 0.8005C1.10307 0.654104 1.27715 0.538331 1.46877 0.459934C1.66039 0.381537 1.8657 0.342086 2.07273 0.343885C2.27975 0.345684 2.48435 0.388696 2.67458 0.470411C2.8648 0.552127 3.03685 0.670909 3.18068 0.819826L21.0437 18.6828C21.2615 18.9009 21.4098 19.1787 21.4698 19.4811C21.5298 19.7835 21.4989 20.0968 21.3809 20.3816C21.2628 20.6664 21.063 20.9098 20.8067 21.0811C20.5504 21.2523 20.2491 21.3438 19.9408 21.3438Z" fill="#FFF"/>
                        <path d="M2.07783 21.3438C1.76965 21.3436 1.46847 21.252 1.21231 21.0806C0.956158 20.9093 0.756526 20.6659 0.638628 20.3811C0.520731 20.0964 0.489857 19.7831 0.549905 19.4808C0.609953 19.1786 0.758229 18.9009 0.976008 18.6828L18.838 0.819826C19.1303 0.527329 19.5269 0.362952 19.9405 0.362854C20.354 0.362757 20.7507 0.526947 21.0432 0.819306C21.3357 1.11166 21.5 1.50824 21.5001 1.9218C21.5002 2.33535 21.336 2.73201 21.0437 3.0245L3.18069 20.8875C3.03583 21.0323 2.86388 21.1471 2.67465 21.2254C2.48542 21.3037 2.28262 21.3439 2.07783 21.3438Z" fill="#FFF"/>
                    </svg>
                </div>
                <div className='banner-content'>
                    <h1 className='only-web' dangerouslySetInnerHTML={renderHTML(props.titleWeb)}></h1>
                    <h1 className='only-tab' dangerouslySetInnerHTML={renderHTML(props.titleTab)}></h1>
                    <h1 className='only-mob' dangerouslySetInnerHTML={renderHTML(props.titleMob)}></h1>
                    <div className='under-line'></div>
                    <p className='only-web' dangerouslySetInnerHTML={renderHTML(props.paraWeb)}></p>
                    <p className='only-tab' dangerouslySetInnerHTML={renderHTML(props.paraTab)} ></p>
                    <p className='only-mob' dangerouslySetInnerHTML={renderHTML(props.paraMob)} ></p>
                    {props.buttonText &&
                        <button onClick={() => {
                                                if (props.pageName === "email-confirmation") {
                                                    localStorage.setItem("userRoleRequest", "user");
                                                    navigate("/login");
                                                } else {
                                                    navigate(props.buttonOnClick);
                                                }
                                            }}
                            className='btn-auth-light' >
                            {props.buttonText}
                        </button>
                    }
                </div>
                <img className='banner-icon' src='/images/authentication-pages/background.png' 
                    style={window.innerWidth > 1024 ? { top: props.iconTopWeb, left: props.iconLeftWeb, transform: `rotate(${props.iconRotationWeb}deg)` } : 
                    window.innerWidth > 768 ? { top: props.iconTopTab, left: props.iconLeftTab, transform: `rotate(${props.iconRotationTab}deg)` } : 
                    { top: props.iconTopMob, left: props.iconLeftMob, transform: `rotate(${props.iconRotationMob}deg)` }}>
                    </img>
            </div>

        </>
    )
}

export default MessagePopup;