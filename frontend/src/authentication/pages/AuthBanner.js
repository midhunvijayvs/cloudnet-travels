
import React from 'react'
import './AuthBanner.scss'
import { useNavigate } from 'react-router-dom';
import Header from '../../user-panel/common-components/Header';

const AuthBanner = (props) => {
  const renderHTML = (text) => ({ __html: text });
  const navigate = useNavigate();
  return (
    <div className='auth-banner'>
        {/* <div className='header'>
            <Header></Header>
            <img className='app-logo' onClick={() => navigate('/')}  role='button' src="/images/app-logo-header.svg" alt=''></img>
        </div> */}
        <div className='banner-content'>
            <h1 className='only-web' dangerouslySetInnerHTML={renderHTML(props.titleWeb)}></h1>
            <h1 className='only-tab' dangerouslySetInnerHTML={renderHTML(props.titleTab)}></h1>
            <h1 className='only-mob' dangerouslySetInnerHTML={renderHTML(props.titleMob)}></h1>
            <div className='under-line'></div>
            <p className='only-web' dangerouslySetInnerHTML={renderHTML(props.paraWeb)}></p>
            <p className='only-tab' dangerouslySetInnerHTML={renderHTML(props.paraTab)} ></p>
            <p className='only-mob' dangerouslySetInnerHTML={renderHTML(props.paraMob)} ></p>
            {props.buttonText &&
              <button onClick={() => navigate(props.buttonOnClick)} className='btn-auth-light'>{props.buttonText}</button>
            }
        </div>
        <img className='banner-icon' src='/images/authentication-pages/background.png' 
          style={window.innerWidth > 992 ? { top: props.iconTopWeb, left: props.iconLeftWeb, transform: `rotate(${props.iconRotationWeb}deg)` } : 
          window.innerWidth > 767 ? { top: props.iconTopTab, left: props.iconLeftTab, transform: `rotate(${props.iconRotationTab}deg)` } : 
          { top: props.iconTopMob, left: props.iconLeftMob, transform: `rotate(${props.iconRotationMob}deg)` }}>
        </img>
    </div>
  )
}

export default AuthBanner


