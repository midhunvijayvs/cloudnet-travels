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
                        Privacy Policy
                    </h1>

                </div>

            </section>
       
       
<div className='sec-2'>

  <div className='section'>
    <h3 className='title'>1. What We Collect</h3>
    <p>We can collect the following information:</p>
    <ul>
      <li>Your Name</li>
      <li>Your Contact information including email address</li>
      <li>Details of the products and services you have purchased from us or which you have enquired about, together with any additional information necessary to deliver those products and services and to respond to your enquiries</li>
      <li>Other information related to customer surveys and/or offers</li>
      <li>Demographic information such as postcode, preferences, and interests</li>
    </ul>
    <p>We use this information to understand your needs and to serve you better services, and especially for the following reasons:</p>
    <ul>
      <li>For our internal records.</li>
      <li>Manage our relationship with you, including updates about your tour booking and handling complaints, and to contact you in the event of an emergency.</li>
      <li>We can use the information to improve our products and services.</li>
      <li>From time to time we can send promotional emails about our new products and special offers using the email address that you have provided.</li>
    </ul>
  </div>

  <div className='section'>
    <h3 className='title'>2. What We Do with the Collected Information</h3>
  </div>

  <div className='section'>
    <h3 className='title'>Security</h3>
    <p>We are committed to ensuring that your information is safe. To prevent unauthorized access or disclosure, we have implemented appropriate physical, electronic, and managerial procedures in order to protect personal information from loss and misuse, and from unauthorized access, modification, disclosure, and interference.</p>
  </div>

  <div className='section'>
    <h3 className='title'>Links to Other Websites</h3>
    <p>Our website may have links to other sites over which we have no control. We cannot be responsible for the safety and confidentiality of any information that you provide on such sites. You should read, and ensure that you understand, their privacy policies.</p>
  </div>

  <div className='section'>
    <h3 className='title'>Credit Card Security</h3>
    <ul>
      <li>All online payments are transmitted over a secure socket layer (SSL) connection.</li>
      <li>Credit card information is transmitted immediately to a payment gateway solution via an encrypted port.</li>
      <li>We do not store your credit card number in any of our systems; it is used only within the context of the transaction and then destroyed upon receipt from an acquiring bank.</li>
      <li>All credit card payments receive an identification number that is proof of the transaction’s acceptance into the banking system. This identification number can be used to trace any transaction back to the credit card issuer (for example, the bank that issued the MasterCard or VISA credit card).</li>
      <li>Personal information is destroyed or de-identified when no longer needed.</li>
    </ul>
  </div>

  <div className='section'>
    <h3 className='title'>Complaints</h3>
    <p>If you have a complaint about the way we have dealt with your personal information, or if you feel that the information we keep about you is incorrect or incomplete, please write to us at the above address or email as soon as possible. We will respond to your complaint within a reasonable time. If your information is incorrect or incomplete, we will immediately correct it.</p>
  </div>

</div>




        </div>
    )
}

export default PolicyPage