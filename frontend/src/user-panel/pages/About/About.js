import React, { useEffect, useState } from 'react'
import './About.scss'

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
    <div className='about-page'>

     
<section className='sec-2' >
      <div className='lhs'>
        <img src='/images/about/sec-2.jpg' />
       <p className='overlap-text'>ABOUT US</p>
        </div>
        <div className='rhs'>
          <div className='inner'>
            <h3 className='sub-heading'></h3>
            <h2 className='main-heading'>Welcome to Cloudnet Travels  </h2>
            <p>Cloudnet Travels, based in Koduvalli, Kozhikode, is your trusted partner for hassle-free flight bookings and travel arrangements. With a commitment to reliability, transparency, and customer satisfaction, we ensure your journey starts right from your first interaction with us. Whether you’re flying for business, leisure, or family visits, our expert team helps you find the best routes and fares tailored to your needs. At Cloudnet Travels, we make air travel simpler, smoother, and more affordable—so you can fly with confidence and peace of mind. </p>
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