import React, { useContext, useEffect, useState } from 'react'

import './NavPane.scss'
import { useNavigate } from 'react-router-dom';

import API from "../../../API.js"
import ErrorModal from "../../../ErrorModal.js";
import PositiveModal from "../../../PositiveModal.js";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner.js"
import $ from 'jquery';
import { UserContext } from '../../../authentication/pages/UserContext.js';
const NavPane = ({ setterFunction }) => {
    const navigate = useNavigate();

    const [message, setMessage] = useState(null);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [blogData, setBlogData] = useState(null);

    useEffect(() => {
        setIsLoading(true)
        API.get("blogs/?page_name=generic&section_number=1")
            .then((response) => {
                setBlogData(response.data)
                console.log("navpane blog api response",response.data)
                setIsLoading(false)

            })
            .catch((error) => {
                setMessage(error.data.message);
                setIsErrorModalOpen(true)
                setIsLoading(false)

            });
    }, [])


    
const {loginLogo,setLoginlogo,setIsLoggedIn,isLoggedIn}=useContext(UserContext);

const profiledetails =()=>{
  setLoginlogo(!loginLogo)

}
const logout = () => {
   
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('accessToken');
  setIsLoggedIn(false);
  setLoginlogo(!loginLogo)
  
}


     


    return (
        <div className='nav-pane'>
            <div className='header'>
                <img className='app-logo' onClick={() => {navigate('/');setterFunction(false);}} role='button' src="/images/nav-pane/app-logo-header.svg" alt=''></img>
                {/* <button className='login-btn' onClick={() => { localStorage.setItem("userRoleRequest", "user"); navigate('/login') }}><img src='/images/nav-pane/header-login-icon.svg'></img></button> 
                */}
                
                <button className='login-btn' >
        
        {isLoggedIn? 
        
        <div className='loginprofileo'>
        <img src="\images\nav-pane\header-login-icon.svg"  /> 
        <img 
              src="/images/home/Vector (5).svg" 
              alt="Toggle Content" 
              className={`downarrow-header ${loginLogo ? 'rotate' : ''}`}
              onClick={profiledetails}
            />
{
  loginLogo?
  <div className='carddetailsbody'>

    <p>Hey There,</p>
    <div className='logout' onClick={logout}>Log Out</div>

  </div>:
  ""
}
       
        
        
        
        </div>
        :
         <div className='login montserrat-bold' onClick={() => { localStorage.setItem("userRoleRequest", "user"); localStorage.setItem('LoginRedirectURL', `/`); navigate('/login') }}>Login / SignUp</div>}
        
       
        
        
        
        </button>



                <button className='close-btn' onClick={() => setterFunction(false)}><img src='/images/nav-pane/close-icon.svg'></img></button>
                {/* {isLogoutModalShow && <LogoutPopup setterFunction={setLogoutModalShow}></LogoutPopup>} */}
            </div>
            <div className='body' id='bd'>
                <div className='lhs'>
                    <ul>
                        <li onClick={() => { navigate("/why-zog-global"); setterFunction(false) }}>WHY ZOG GLOBAL</li>
                        <li onClick={() => { navigate("/what-we-do"); setterFunction(false) }}>WHAT WE DO</li>
                        <li onClick={() => { navigate("/transform-your-business"); setterFunction(false) }}>TRANSFORM YOUR BUSINESS</li>
                        <li onClick={() => { navigate("/protect-your-customers-data"); setterFunction(false) }}>PROTECT YOUR CUSTOMERS DATA</li>
                        <li onClick={() => { navigate("/managed-it-services"); setterFunction(false) }}>MANAGED IT SERVICES</li>
                        <li onClick={() => { navigate("/engagement-model"); setterFunction(false) }}>ENGAGEMENT MODEL</li>
                        <li onClick={() => { navigate("/it-outsourcing"); setterFunction(false) }}>IT OUTSOURCING</li>

                    </ul>
                    <ul>
                        <li onClick={() => { navigate("/industries"); setterFunction(false) }}>INDUSTRIES</li>
                        <li onClick={() => { navigate("/healthcare"); setterFunction(false) }}>HEALTHCARE</li>
                        <li onClick={() => { navigate("/technology"); setterFunction(false) }}>TECHNOLOGY</li>
                        <li onClick={() => { navigate("/telecom"); setterFunction(false) }}>TELECOM</li>
                        <li onClick={() => { navigate("/education"); setterFunction(false) }}>EDUCATION</li>
                        <li onClick={() => { navigate("/travel"); setterFunction(false) }}>TRAVEL</li>
                        <li onClick={() => { navigate("/banking"); setterFunction(false) }}>BANKING AND FINANCIAL SERVICES</li>
                        <li onClick={() => { navigate("/insurance"); setterFunction(false) }}>INSURANCE</li>
                        <li onClick={() => { navigate("/legal"); setterFunction(false) }}>LEGAL</li>
                        <li onClick={() => { navigate("/media"); setterFunction(false) }}>MEDIA AND ENTERTAINMENT</li>
                        <li onClick={() => { navigate("/pharma"); setterFunction(false) }}>PHARMA</li>
                    </ul>
                    <ul>
                        <li onClick={() => { navigate("/digital-engineering"); setterFunction(false) }}>DIGITAL ENGINEERING</li>
                        <li onClick={() => { navigate("/automation"); setterFunction(false) }}>AUTOMATION</li>
                        <li onClick={() => { navigate("/devops"); setterFunction(false) }}>DEVOPS</li>
                        <li onClick={() => { navigate("/advanced-networking-services"); setterFunction(false) }}>ADVANCED NETWORKING SERVICES</li>
                        <li onClick={() => { navigate("/devsecops"); setterFunction(false) }}>DEVSECOPS</li>
                        <li onClick={() => { navigate("/cloud"); setterFunction(false) }}>CLOUD</li>
                        <li onClick={() => { navigate("/cybersecurity"); setterFunction(false) }}>CYBERSECURITY</li>
                        <li onClick={() => { navigate("/software-development"); setterFunction(false) }}>SOFTWARE DEVELOPMENT</li>
                        <li onClick={() => { navigate("/testing"); setterFunction(false) }}>TESTING</li>
                        <li onClick={() => { navigate("/unified-communication"); setterFunction(false) }}>UNIFIED COMMUNICATIONS</li>
                    </ul>
                    <ul>
                        <li onClick={() => { navigate("/quality-assurance"); setterFunction(false) }}>QUALITY ASSURANCE</li>
                        <li onClick={() => { navigate("/automation-testing"); setterFunction(false) }}>AUTOMATION TESTING</li>
                        <li onClick={() => { navigate("/manual-testing"); setterFunction(false) }}>MANUAL TESTING</li>
                        <li onClick={() => { navigate("/penetration-testing"); setterFunction(false) }}>PENETRATION TESTING</li>
                        <li onClick={() => { navigate("/perfomance-testing"); setterFunction(false) }}>PERFORMANCE TESTING</li>
                        <li onClick={() => { navigate("/application-security-testing"); setterFunction(false) }}>APPLICATION SECURITY TESTING</li>
                        <li onClick={() => { navigate("/accessibility-testing"); setterFunction(false) }}>ACCESSIBILITY TESTING</li>

                    </ul>
                    <ul>
                        <li onClick={() => { navigate("/future-tech-solutions"); setterFunction(false) }}>FUTURE-TECH SOLUTIONS</li>
                        <li onClick={() => { navigate("/artificial-intelligence"); setterFunction(false) }}>AI</li>
                        <li onClick={() => { navigate("/rpa"); setterFunction(false) }}>RPA</li>

                    </ul>
                    <ul>
                        <li onClick={() => { navigate("/insights"); setterFunction(false) }}>INSIGHTS</li>
                        {/* <li onClick={() => { navigate("/blog"); setterFunction(false) }}>BLOG</li> */}
                        <li onClick={() => { navigate("/be-a-partner"); setterFunction(false) }}>BE A PARTNER</li>
                        <li onClick={() => { navigate("/career"); setterFunction(false) }}>CAREER</li>

                    </ul>
                    <ul>
                        <li onClick={() => { navigate("/CONTACT-US"); setterFunction(false) }}>CONTACT</li>
                    </ul>
                </div>
                <div className='rhs'>
                    <div className='sub-heading'>LATEST</div>
                    <div className='heading'>STORIES</div>
                    <div className='story-box'>
                        <div className='tile'>
                            <img src={blogData && blogData[0].image_url}></img>
                            <p>{blogData && blogData[0].title}</p>
                        </div>

                        <div className='tile'>
                            <img src={blogData && blogData[1].image_url}></img>
                            <p>{blogData && blogData[1].title}</p>
                        </div>

                        <div className='tile'>
                            <img src={blogData && blogData[2].image_url}></img>
                            <p>{blogData && blogData[2].title}</p>
                        </div>

                        <div className='tile'>
                            <img src={blogData && blogData[3].image_url}></img>
                            <p>{blogData && blogData[3].title}</p>
                        </div>

                        <div className='tile'>
                            <img src={blogData && blogData[4].image_url}></img>
                            <p>{blogData && blogData[4].title}</p>
                        </div>



                    </div>


                    {/* <div className='language-box'>
                        <div className='mb-3'>
                            <svg width="29" height="30" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.499 7.16197C11.764 7.16197 9.03 6.84697 6.376 6.22497C6.107 6.16197 5.94 5.89397 6.003 5.62397C6.066 5.35597 6.328 5.18897 6.605 5.25097C12.398 6.60897 18.555 6.43797 24.283 4.75297C24.553 4.67697 24.827 4.82597 24.904 5.09097C24.982 5.35697 24.831 5.63397 24.566 5.71197C21.295 6.67397 17.908 7.16197 14.499 7.16197Z" fill="black" />
                                <path d="M24.424 24.362C24.377 24.362 24.33 24.355 24.282 24.341C17.923 22.47 11.075 22.47 4.716 24.341C4.447 24.416 4.172 24.268 4.095 24.003C4.017 23.737 4.168 23.46 4.433 23.382C10.978 21.456 18.021 21.456 24.566 23.382C24.831 23.46 24.982 23.737 24.904 24.003C24.84 24.222 24.64 24.362 24.424 24.362Z" fill="black" />
                                <path d="M13.888 28.6389C13.79 28.6389 13.693 28.6109 13.606 28.5519C8.939 25.3669 6.153 20.1299 6.153 14.5429C6.153 10.0159 7.934 5.75493 11.17 2.54493C11.367 2.34793 11.684 2.35193 11.877 2.54693C12.072 2.74293 12.07 3.05993 11.875 3.25393C8.83 6.27493 7.153 10.2839 7.153 14.5429C7.153 19.7989 9.776 24.7279 14.171 27.7259C14.399 27.8809 14.457 28.1929 14.302 28.4209C14.204 28.5629 14.047 28.6389 13.888 28.6389Z" fill="black" />
                                <path d="M15.153 28.6389C14.994 28.6389 14.837 28.5629 14.74 28.4209C14.585 28.1919 14.643 27.8809 14.871 27.7259C19.266 24.7279 21.889 19.7989 21.889 14.5429C21.889 9.28691 19.266 4.35791 14.871 1.35991C14.643 1.20491 14.585 0.89291 14.74 0.66491C14.896 0.43691 15.208 0.38091 15.435 0.53391C20.102 3.71891 22.888 8.95591 22.888 14.5429C22.888 20.1299 20.102 25.3669 15.435 28.5519C15.349 28.6099 15.251 28.6389 15.153 28.6389Z" fill="black" />
                                <path d="M14.499 28.4899C14.223 28.4899 13.999 28.2659 13.999 27.9899V1.09595C13.999 0.819947 14.223 0.595947 14.499 0.595947C14.775 0.595947 14.999 0.819947 14.999 1.09595V27.9899C14.999 28.2669 14.775 28.4899 14.499 28.4899Z" fill="black" />
                                <path d="M28.446 15.043H2.552C2.276 15.043 2.052 14.819 2.052 14.543C2.052 14.267 2.276 14.043 2.552 14.043H28.447C28.723 14.043 28.947 14.267 28.947 14.543C28.947 14.819 28.723 15.043 28.446 15.043Z" fill="black" />
                                <path d="M14.499 29.043C6.504 29.043 -0.000999451 22.538 -0.000999451 14.543C-0.000999451 11.022 1.277 7.62397 3.599 4.97797C3.781 4.76997 4.096 4.74997 4.305 4.93197C4.512 5.11397 4.532 5.42997 4.351 5.63797C2.19 8.10097 0.999001 11.264 0.999001 14.543C0.999001 21.987 7.055 28.043 14.499 28.043C21.943 28.043 27.999 21.987 27.999 14.543C27.999 7.09897 21.943 1.04297 14.499 1.04297C11.421 1.04297 8.523 2.05097 6.12 3.95797C5.904 4.12997 5.59 4.09497 5.418 3.87697C5.246 3.66097 5.282 3.34697 5.499 3.17497C8.08 1.12597 11.192 0.0429688 14.499 0.0429688C22.494 0.0429688 28.999 6.54797 28.999 14.543C28.999 22.538 22.494 29.043 14.499 29.043Z" fill="black" />
                            </svg>

                            <div className='title'>CHANGE LANGUAGE</div>
                        </div>
                        <div className='flex-box'>
                            <button className='active'>ENGLISH</button> <div className="d-none d-md-block">/</div> <button>FRENCH</button> <div className="d-none d-md-block">/</div> <button>CHINESE</button>
                        </div>
                    </div> */}

                    <div className='sm-box'>
                        <svg onClick={() => window.location.href = "https://www.facebook.com/zogglobal/"} width="14" height="28" viewBox="0 0 14 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.07453 21.4127C3.07453 19.7016 3.0558 17.9905 3.0839 16.2794C3.09327 15.6705 2.87938 15.4114 2.27051 15.4816C1.91143 15.5222 1.54766 15.5472 1.18702 15.5628C0.404854 15.5956 -0.0369696 15.2381 0.00674441 14.4715C0.0879276 13.0461 0.106662 11.627 0.00362198 10.2016C-0.040092 9.58961 0.314304 9.22741 0.935667 9.18682C1.32285 9.16184 1.71627 9.15091 2.10033 9.1915C2.8341 9.268 3.10888 8.99635 3.0917 8.23291C3.06048 6.91681 2.95119 5.58978 3.26344 4.28304C3.93788 1.45256 5.48348 0.139579 8.40139 0.0287331C9.87674 -0.0274706 11.3568 0.0115598 12.8337 0.0381004C13.6752 0.0537126 13.9702 0.340976 13.9859 1.16842C14.0108 2.54229 13.9874 3.91616 13.9999 5.29003C14.0062 5.95979 13.6908 6.31418 13.0288 6.33916C12.1483 6.37351 11.2678 6.41878 10.3873 6.39849C9.78463 6.386 9.51142 6.55773 9.44741 7.21188C9.25382 9.19618 9.22728 9.1915 11.171 9.17433C11.7674 9.16964 12.3638 9.17433 12.9601 9.17745C13.6158 9.18369 13.9859 9.49906 13.989 10.1719C13.9952 11.6239 13.9937 13.0758 13.9921 14.5277C13.9921 15.2506 13.5675 15.541 12.9055 15.5722C12.0749 15.6112 11.249 15.5472 10.4216 15.4941C9.3912 15.4286 9.30221 15.4941 9.3834 16.4855C9.60977 19.2535 9.21635 22.0247 9.45834 24.7943C9.5161 25.4594 9.3834 26.1369 9.38027 26.8098C9.37871 27.3968 9.08677 27.6966 8.53878 27.7028C7.03533 27.7231 5.53188 27.7294 4.02999 27.7028C3.3134 27.6888 3.06672 27.2126 3.06985 26.546C3.07765 24.8349 3.07297 23.1238 3.07297 21.4127H3.07453ZM4.84807 20.0497C4.84807 20.0497 4.84183 20.0497 4.84026 20.0497C4.84026 21.3456 4.84026 22.6429 4.84026 23.9387C4.84026 26.0058 4.8387 25.9808 6.90107 25.9808C7.56927 25.9808 7.75193 25.7294 7.72539 25.1096C7.6645 23.6858 7.588 22.2589 7.63328 20.8382C7.67075 19.6735 7.76286 18.5073 7.69729 17.3426C7.65357 16.5667 7.58332 15.7908 7.62391 15.0133C7.67231 14.0765 8.05793 13.7097 8.98685 13.6862C9.42711 13.6753 9.86894 13.6862 10.3092 13.6831C12.5402 13.6628 12.1967 14.0765 12.2482 11.6863C12.2607 11.0743 11.9844 10.9276 11.4458 10.9604C10.6449 11.0119 9.84083 11.0696 9.03993 11.0493C8.0267 11.0259 7.62391 10.6091 7.62391 9.59898C7.62391 8.58887 7.68167 7.58033 7.73163 6.57178C7.7972 5.23382 8.42013 4.59841 9.77058 4.5063C10.3389 4.46727 10.9103 4.49381 11.4817 4.48912C11.719 4.48756 12.0078 4.48912 12.0546 4.20654C12.1686 3.54147 12.1811 2.8639 12.05 2.19882C11.9953 1.92249 11.7127 1.90531 11.4754 1.90531C10.3092 1.90687 9.13673 1.84599 7.9783 1.93966C6.27658 2.07705 5.48505 2.82799 5.05727 4.47039C4.68414 5.90358 4.87461 7.3602 4.85744 8.80744C4.8309 10.9963 4.85119 11.0119 2.69047 11.0618C2.1097 11.0759 1.83961 11.2554 1.84273 11.8721C1.85366 14.0375 1.74438 13.6566 3.52884 13.6894C4.5249 13.7081 4.84026 14.0078 4.84651 14.993C4.859 16.6775 4.84963 18.3636 4.84963 20.0497H4.84807Z" fill="black" />
                        </svg>



                        <svg onClick={() => window.location.href = "https://twitter.com/zogglobal?lang=en"} width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <mask id="mask0_3139_10293" maskUnits="userSpaceOnUse" x="0" y="0" width="26" height="26">
                                <path d="M25.4279 0H0V26H25.4279V0Z" fill="white" />
                            </mask>
                            <g mask="url(#mask0_3139_10293)">
                                <path d="M15.133 11.0036L24.5991 0H22.356L14.1366 9.55425L7.57174 0H0L9.9273 14.4477L0 25.9866H2.24329L10.9232 15.897L17.8561 25.9866H25.4279L15.1325 11.0036H15.133ZM12.0605 14.575L11.0547 13.1363L3.05158 1.68872H6.49714L12.9558 10.9273L13.9616 12.366L22.357 24.3747H18.9115L12.0605 14.5756V14.575Z" fill="black" />
                            </g>
                        </svg>


                        <svg onClick={() => window.location.href = "https://www.instagram.com/zogglobal/?hl=en"} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.4531 5.39062C20.8206 5.39062 22.1322 5.93387 23.0991 6.90086C24.0661 7.86784 24.6094 9.17935 24.6094 10.5469V19.4531C24.6094 20.8206 24.0661 22.1322 23.0991 23.0991C22.1322 24.0661 20.8206 24.6094 19.4531 24.6094H10.5469C9.17935 24.6094 7.86784 24.0661 6.90086 23.0991C5.93387 22.1322 5.39062 20.8206 5.39062 19.4531V10.5469C5.39062 9.17935 5.93387 7.86784 6.90086 6.90086C7.86784 5.93387 9.17935 5.39062 10.5469 5.39062H19.4531ZM19.4531 3.51562H10.5469C8.68378 3.52119 6.89859 4.26377 5.58118 5.58118C4.26377 6.89859 3.52119 8.68378 3.51562 10.5469V19.4531C3.52119 21.3162 4.26377 23.1014 5.58118 24.4188C6.89859 25.7362 8.68378 26.4788 10.5469 26.4844H19.4531C21.3162 26.4788 23.1014 25.7362 24.4188 24.4188C25.7362 23.1014 26.4788 21.3162 26.4844 19.4531V10.5469C26.4788 8.68378 25.7362 6.89859 24.4188 5.58118C23.1014 4.26377 21.3162 3.52119 19.4531 3.51562Z" fill="black" />
                            <path d="M21.1266 7.5C20.8609 7.5 20.6013 7.57876 20.3804 7.72633C20.1596 7.8739 19.9875 8.08364 19.8858 8.32904C19.7842 8.57443 19.7576 8.84446 19.8094 9.10497C19.8612 9.36548 19.9891 9.60477 20.1769 9.79259C20.3648 9.98041 20.6041 10.1083 20.8646 10.1601C21.1251 10.212 21.3951 10.1854 21.6405 10.0837C21.8859 9.98206 22.0956 9.80993 22.2432 9.58908C22.3908 9.36823 22.4695 9.10858 22.4695 8.84297C22.4695 8.66661 22.4348 8.49197 22.3673 8.32904C22.2998 8.1661 22.2009 8.01805 22.0762 7.89335C21.9515 7.76864 21.8034 7.66972 21.6405 7.60223C21.4776 7.53474 21.3029 7.5 21.1266 7.5Z" fill="black" />
                            <path d="M15.0633 10.8914C15.883 10.8909 16.6845 11.1336 17.3663 11.5887C18.0481 12.0439 18.5796 12.691 18.8935 13.4483C19.2074 14.2056 19.2897 15.0389 19.1299 15.8429C18.9701 16.647 18.5754 17.3855 17.9957 17.9652C17.416 18.5448 16.6775 18.9395 15.8735 19.0994C15.0694 19.2592 14.2361 19.1769 13.4788 18.863C12.7215 18.5491 12.0744 18.0176 11.6192 17.3358C11.1641 16.654 10.9214 15.8525 10.9219 15.0328C10.9237 13.935 11.3607 12.8827 12.1369 12.1064C12.9132 11.3302 13.9655 10.8932 15.0633 10.8914ZM15.0633 9.01637C13.8733 9.01869 12.7107 9.37371 11.7224 10.0366C10.7341 10.6994 9.9645 11.6404 9.51082 12.7405C9.05714 13.8406 8.93976 15.0505 9.1735 16.2173C9.40725 17.3842 9.98164 18.4555 10.8241 19.296C11.6665 20.1364 12.7392 20.7083 13.9065 20.9393C15.0739 21.1704 16.2835 21.0502 17.3826 20.5939C18.4817 20.1377 19.4208 19.3659 20.0814 18.376C20.7419 17.3862 21.0942 16.2228 21.0937 15.0328C21.0934 14.2416 20.9371 13.4582 20.6338 12.7275C20.3305 11.9968 19.886 11.333 19.3259 10.7742C18.7658 10.2154 18.101 9.77256 17.3696 9.47093C16.6382 9.16929 15.8545 9.01483 15.0633 9.01637Z" fill="black" />
                        </svg>

                        <svg onClick={() => window.location.href = "https://uk.linkedin.com/company/zogglobal?original_referer=https%3A%2F%2Fwww.google.com%2F"} width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.5078 20.2809C20.5078 18.6251 20.5078 16.9597 20.5078 15.3039C20.5078 15.0264 20.4536 14.7679 20.3019 14.5287C19.9552 13.9735 19.3593 13.8874 18.7308 13.8778C18.5141 13.8778 18.2866 13.9065 18.0699 13.9544C17.4739 14.0788 17.1814 14.3564 17.0947 14.8924C17.073 15.0359 17.0622 15.1891 17.0622 15.3422C17.0622 18.5772 17.0622 21.8218 17.0622 25.0568C17.0622 25.7268 16.748 26.0043 16.0112 26.0043C14.3425 26.0043 12.6631 26.0043 10.9945 26.0043C10.7561 26.0043 10.5286 25.9661 10.3552 25.8129C10.2143 25.6981 10.1385 25.5449 10.171 25.3822C10.236 24.9994 10.2035 24.6165 10.2035 24.2433C10.2035 19.1036 10.2035 13.9735 10.2035 8.83389C10.2035 8.69032 10.2035 8.54676 10.1818 8.40319C10.1168 7.97249 10.3877 7.67579 10.8861 7.65665C11.1787 7.64708 11.482 7.65665 11.7746 7.65665C13.2265 7.65665 14.6676 7.65665 16.1195 7.65665C16.4879 7.65665 16.7696 7.76193 16.9538 8.03949C17.0188 8.14477 17.0947 8.16392 17.2139 8.10649C18.5683 7.51309 19.9877 7.50351 21.4288 7.74279C22.9132 7.99164 24.2568 8.51804 25.362 9.45601C26.2396 10.2025 26.8247 11.1118 27.1606 12.1455C27.4532 13.0356 27.4965 13.9353 27.4857 14.8541C27.464 16.3663 27.4857 17.869 27.4857 19.3812C27.4857 21.2188 27.4857 23.0469 27.4857 24.8845C27.4857 24.9994 27.4857 25.1238 27.5073 25.2387C27.5832 25.6981 27.3123 25.9948 26.7814 25.9948C25.9471 25.9948 25.1128 25.9948 24.2784 25.9948C23.3033 25.9948 22.3173 25.9948 21.3421 25.9948C20.7462 25.9948 20.5186 25.7651 20.5186 25.2482C20.5186 23.5924 20.5186 21.9271 20.5186 20.2713L20.5078 20.2809ZM11.9263 16.8736C11.9263 19.295 11.9263 21.7165 11.9263 24.138C11.9263 24.4634 11.9263 24.4634 12.3055 24.4634C13.194 24.4634 14.0825 24.4634 14.971 24.4634C15.3611 24.4634 15.3611 24.4634 15.3611 24.1188C15.3611 21.2858 15.3611 18.4528 15.3611 15.6198C15.3611 15.5145 15.3611 15.4092 15.3286 15.3135C14.971 14.3755 15.6319 13.1791 16.6504 12.6623C17.4306 12.2699 18.2649 12.1742 19.1425 12.222C20.9737 12.3177 22.2089 13.4184 22.2089 15.0455C22.2197 18.0795 22.2089 21.1135 22.2089 24.138C22.2089 24.4538 22.2197 24.4634 22.5665 24.4634C23.4875 24.4634 24.4193 24.4634 25.3403 24.4634C25.6076 24.4634 25.7412 24.3454 25.7412 24.1093C25.7412 21.0657 25.7412 18.0317 25.7412 14.9881C25.7412 14.4042 25.6979 13.83 25.5678 13.2653C25.2211 11.7339 24.3326 10.5662 22.7073 9.86756C21.7972 9.47515 20.822 9.31244 19.8143 9.28373C18.98 9.26459 18.2107 9.43686 17.5281 9.85799C17.1922 10.059 16.8888 10.2983 16.5421 10.4801C16.0112 10.7672 15.3719 10.5375 15.1769 10.0111C15.1227 9.87713 15.1118 9.73357 15.1227 9.59C15.1552 9.35073 15.0468 9.27416 14.776 9.27416C13.9633 9.28373 13.1398 9.27416 12.3272 9.27416C12.0383 9.27416 11.8938 9.39858 11.8938 9.64743C11.8938 12.0498 11.8938 14.4617 11.8938 16.864L11.9263 16.8736Z" fill="black" />
                            <path d="M8.42666 16.8441C8.42666 19.5431 8.42666 22.2421 8.42666 24.9412C8.42666 25.0464 8.42666 25.1517 8.42666 25.2474C8.40499 25.6781 8.04742 25.994 7.55984 25.994C5.81537 25.994 4.0709 25.994 2.32643 25.994C1.763 25.994 1.48128 25.6973 1.5463 25.2092C1.55713 25.0943 1.56797 24.9699 1.56797 24.855C1.56797 19.5144 1.56797 14.1737 1.56797 8.83311C1.56797 8.70868 1.56797 8.57469 1.5463 8.45027C1.48128 7.98128 1.763 7.66544 2.29393 7.60801C2.38061 7.59844 2.47812 7.60801 2.56481 7.60801C4.14675 7.60801 5.72869 7.60801 7.31063 7.60801C8.09076 7.60801 8.43749 7.91429 8.43749 8.61297C8.43749 11.3599 8.43749 14.1068 8.43749 16.8536L8.42666 16.8441ZM3.3016 16.8441C3.3016 19.2751 3.3016 21.7062 3.3016 24.1276C3.3016 24.4435 3.31244 24.453 3.65916 24.453C4.55849 24.453 5.45781 24.453 6.35713 24.453C6.61718 24.453 6.70386 24.3765 6.69302 24.1563C6.69302 19.2943 6.69302 14.4226 6.69302 9.56051C6.69302 9.34994 6.61718 9.2638 6.36797 9.27337C5.47948 9.28295 4.59099 9.27337 3.7025 9.27337C3.43523 9.27337 3.3016 9.39142 3.3016 9.6275C3.3016 12.0298 3.3016 14.4417 3.3016 16.8441Z" fill="black" />
                            <path d="M1.503 3.11059C1.43799 1.56965 2.91158 0 5.03528 0C6.99646 0 8.52422 1.40694 8.54589 3.12973C8.56756 4.69938 7.12648 6.24989 5.01361 6.24032C2.7924 6.24032 1.42716 4.58453 1.503 3.11059ZM6.6389 3.12016C6.6389 2.30662 5.9021 1.65579 5.00278 1.66536C4.10346 1.67493 3.3775 2.31619 3.36666 3.11059C3.36666 3.91456 4.09262 4.54624 5.02445 4.54624C5.95628 4.54624 6.6389 3.94327 6.6389 3.12016Z" fill="black" />
                        </svg>


                    </div>
                    <div className='copyright-text'>© 2024 ZOG GLOBAL</div>
                </div>
            </div>
        </div>
    )
}
export default NavPane