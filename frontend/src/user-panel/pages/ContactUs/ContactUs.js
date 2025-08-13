import React, { useEffect, useState } from 'react'
import './ContactUs.scss'

import { useNavigate } from 'react-router-dom';

import ErrorModal from "../../../ErrorModal.js";
import PositiveModal from "../../../PositiveModal.js";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner.js"
import $ from 'jquery';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';


const View = () => {
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);



  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])


  useEffect(() => {

  }, [])


  useEffect(() => {

  }, [])

  const sec5SlideSettings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1
  };

  return (
    <div className='contact-us-page'>


      <section className='sec-2' >
        <div className='lhs'>
          <img src='/images/contact-us/sec-2.jpg' />
          {/* <p className='overlap-text'>CONTACT US</p> */}
        </div>
        <div className='rhs'>
          <div className='inner'>
            <h3 className='sub-heading'></h3>
            <h2 className='main-heading'>Connect With Us  </h2>
            <div className="footer-col contact">
  <div>
    <h4>VISIT</h4>
    <p>
      <FontAwesomeIcon icon={faLocationDot} />{' '}
      <a
        href="https://www.google.com/maps/search/?api=1&query=2+Brook+Street,+Calicut,+LL13+7LH"
        target="_blank"
        rel="noopener noreferrer"
      >
        2 Koduvalli,<br />Calicut, 600055
      </a>
    </p>
  </div>
  <div>
    <h4>TALK</h4>
    <p>
      <FontAwesomeIcon icon={faPhone} />{' '}
      <a href="tel:9747020268">9747020268</a>
    </p>
  </div>
  <div>
    <h4>WRITE</h4>
    <p>
      <FontAwesomeIcon icon={faEnvelope} />{' '}
      <a href="mailto:cloudnettravels@gmail.com">cloudnettravels@gmail.com</a>
    </p>
  </div>
</div>

            {/* <button className="btn-primary" onClick={() => navigate('/book-dine-in')}>
              <span>Learn More</span>
              
            </button> */}
          </div>
        </div>
      </section>




      {isLoading && <FixedOverlayLoadingSpinner />}
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => navigate("/")} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => { }} />}

    </div>

  );


}

export default View