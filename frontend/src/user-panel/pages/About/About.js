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
            <p>“Rang” means colour, and “Rasoi” means kitchen. Together, Cloudnet Travels is a colourful kitchen just like India itself, where every every meal brings people together. Rooted in years of experience running restaurants in India, our journey has now brought us to Wrexham, where we’re proud to share the real taste of India with our local community. At Cloudnet Travels, every dish is carefully prepared using authentic recipes, quality ingredients, and a whole lot of love. Whether you’re enjoying a comforting curry, a spicy street food snack, or a fragrant biryani, we want you to feel the authentic taste in every bite. Join us at Cloudnet Travels for a colourful dining experience. </p>
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