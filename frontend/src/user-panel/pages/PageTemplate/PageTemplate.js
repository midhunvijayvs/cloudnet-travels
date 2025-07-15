import React, { useEffect, useState } from 'react'
import './WhyZogGlobal.scss'
import Banner from '../../common-components/BannerMainPages/BannerMainPages'
import BottomBanner from '../../common-components/BottomBanner/BottomBanner'

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
    <div className='pagename-page'>

      <Banner
        pageName={"pagename"}
        blueTitle={""}
        titleWeb={""}
        titleTab={""}
        titleMob={""}
        subTitleWeb={""}
        subTitleTab={""}
       subTitleMob={""}
        iconTopWeb={0}
        iconLeftWeb={0}
        iconTopTab={0}
        iconLeftTab={0}
        iconTopMob={370}
        iconLeftMob={150}
        iconRotationWeb={0}
        iconRotationTab={0}
        iconRotationMob={0}>
      </Banner>

      <div className='sec-2'>

      </div>


      <div className='sec-3'>

      </div>


      <div className='sec-4'>

      </div>


      <div className='sec-5'>

      </div>


      <div className='sec-6'>

      </div>


      <div className='sec-7'>

      </div>




      <BottomBanner
        pageName={"pagename"}
        titleWeb={""}
        titleTab={""}
        titleMob={""}
                
        subTitlePresent={false}
        subTitleWeb={""}
        subTitleTab={""}
        subTitleMob={""}

        buttonText={""}
        buttonTheme={"light"}
        buttonLink={"/contact-us"}
        textTheme={"light"}
      >
      </BottomBanner>



      {isLoading && <FixedOverlayLoadingSpinner />}
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => navigate("/")} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => { }} />}

    </div>

  );


}

export default View