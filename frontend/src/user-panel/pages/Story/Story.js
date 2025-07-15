import React, { useEffect, useState } from 'react'
import './Story.scss'

import { useNavigate } from 'react-router-dom';

import ErrorModal from "../../../ErrorModal.js";
import PositiveModal from "../../../PositiveModal.js";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner.js"
import $ from 'jquery';



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
    <div className='story-page'>
      <div className='banner'>
        <div className='inner'>
          <h1>Our Story</h1>
        </div>
      </div>

      <div className='sec-2'>
        <div className='lhs'>
          <div className='img-box'>
          <img src="/images/story/sec-2.png" alt="Our Story" />
        </div>
        </div>
        <div className='rhs'>
          <div className='inner'>
          <h2 className='main-heading'>A Taste of India<br/> in the Heart of Wrexham </h2>
          <p>

          Our journey started in India, where food is full of flavour, tradition, and love. With years of experience running successful restaurants across India, our founders have brought that same passion, precision, and love for authentic Indian cuisine to Wrexham. Cooking has always been a big part of our lives, something we’ve done with heart and soul. Now, we’ve brought that same passion to Wrexham. We wanted to share the real taste of India with our new community. Every dish we serve is made with care, using recipes passed down through generations and spices that bring out rich, bold flavours. Whether you’re trying Indian food for the first time or missing the flavours of home, we’re here to give you an experience that feels warm, welcoming, and full of flavour. This isn’t just a restaurant. It’s a dream we’ve brought to life and we’re so happy to share it with you. Thank you for being part of our journey.  </p>
            </div>
        </div>
      </div>





      {isLoading && <FixedOverlayLoadingSpinner />}
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => navigate("/")} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => { }} />}

    </div>

  );


}

export default View