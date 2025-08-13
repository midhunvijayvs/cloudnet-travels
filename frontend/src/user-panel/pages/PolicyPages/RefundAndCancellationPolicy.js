import React, { useEffect } from 'react'
import './PolicyPage.scss'
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';


const PolicyPage = () => {
    let navigate = useNavigate();
    useEffect(() => {
        $(function () {
            $(window).scrollTop(0);
        });
    }, [])

    // header scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            // Check if scroll position is at 100vh
            if (scrollPosition >= 5) {
                $(".header").addClass("shrinked");
            } else {
                $(".header").removeClass("shrinked");

            }
        }
        window.addEventListener('scroll', handleScroll);
        // Clean up event listener
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className=' policy-page'>

            <section className="banner">
                <div className="inner">
                    <h1
                        className="main-heading"
                       >
                        Refund and Cancellation Policy
                    </h1>

                </div>

            </section>
            
           <div className='sec-2'>

  <div className='section'>
    <h3 className='title'>1. Payment & Fees</h3>
    <p>All our trips are in Indian rupee (rupees) and if you are using an international card to pay through our online booking system (which uses PayPal) then a small percentage charge can be applied. This is due to foreign currency conversion and some PayPal transaction fees.</p>
    <p>When we have confirmed availability, it is necessary to pay for most tours. From the following ways, you need to pay before traveling to confirm your booking:</p>
    <ul>
      <li>By paying online through our online booking system</li>
      <li>Pay by visiting our office</li>
    </ul>
  </div>

  <div className='section'>
    <h3 className='title'>2. Cancellation Charges</h3>
    <p>In the case of cancellation of travel / travel services due to any reasons, we should be informed about it in writing. The cancellation fee will be effective from the date received in writing, and the charges for cancellation will be as follows:</p>
    <ul>
      <li>45 days before arrival: 10% of the tour/service cost</li>
      <li>15 days before arrival: 25% of the tour/service cost</li>
      <li>07 days before arrival: 50% of travel/service cost</li>
      <li>48 hours or earlier before arrival: No refund</li>
      <li>The refund amount will be credited to the source account in 7 to 10 days</li>
    </ul>
  </div>

  <div className='section'>
    <h3 className='title'>3. Cancellation Policy & Refund Turnaround Time</h3>
    <p>In the case of cancellation, we will process cancellation with various service providers like Hotels, Flights, etc. The processing time for the same is 3–4 working days from our end, plus the time taken by providers to confirm the cancellation and initiate the refund (which may take another 5–6 working days). Once we receive refunds from providers, we will initiate the refund to the given account or original method if possible, which may take 2–3 working days from our end, plus the time taken by the receiving bank.</p>
    <p>In total, the Refund Turnaround Time is approximately 15–20 working days.</p>
  </div>

</div>


        </div>
    )
}

export default PolicyPage