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
                        style={{ color:`rgba(255, 255, 255, 1)` }}>
                        Cookie Policy
                    </h1>

                </div>

            </section>
            
            <div className='sec-2'>

  <div className='section'>
    <h3 className='title'>Cookie Policy</h3>
    <p><strong>Effective Date:</strong> 12 July 2025</p>
    <p>This Cookie Policy explains how Cloudnet Travels Ltd, trading as Cloudnet Travels uses cookies and similar technologies on our website. By continuing to browse our website, you agree to our use of cookies in accordance with this policy.</p>
  </div>

  <div className='section'>
    <h3 className='title'>1. What Are Cookies?</h3>
    <p>Cookies are small text files that are placed on your device (computer, smartphone, tablet) when you visit a website. They help improve user experience by remembering your preferences and activities.</p>
  </div>

  <div className='section'>
    <h3 className='title'>2. Types of Cookies We Use</h3>
    <p>We use the following categories of cookies:</p>
    <ul>
      <li>
        <strong>a) Essential Cookies</strong>: These cookies are necessary for the website to function properly and cannot be switched off. They enable core functionality such as security, network management, and accessibility.
      </li>
      <li>
        <strong>b) Performance Cookies</strong>: These cookies collect information about how visitors use our website (e.g., which pages are visited most often) to help us improve site performance and user experience.
      </li>
      <li>
        <strong>c) Functionality Cookies</strong>: These cookies allow our website to remember choices you’ve made in the past, such as your username or region, and provide more personalised features.
      </li>
      <li>
        <strong>d) Marketing & Advertising Cookies</strong>: We may use these cookies to deliver relevant advertisements and measure the effectiveness of our marketing campaigns. These cookies may be set by us or third-party providers.
      </li>
    </ul>
  </div>

  <div className='section'>
    <h3 className='title'>3. Third-Party Cookies</h3>
    <p>Some cookies on our website may be placed by trusted third parties, such as analytics providers (e.g., Google Analytics) or social media platforms (e.g., Facebook, Instagram) to help us understand site usage and enhance user engagement.</p>
  </div>

  <div className='section'>
    <h3 className='title'>4. How to Control Cookies</h3>
    <p>You have the right to accept or reject cookies. Most browsers allow you to manage cookie settings through their preferences. You can usually:</p>
    <ul>
      <li>Delete all cookies</li>
      <li>Block all cookies</li>
      <li>Allow all cookies</li>
      <li>Block third-party cookies</li>
      <li>Clear cookies when you close the browser</li>
      <li>Open a ‘private’ or ‘incognito’ browsing session</li>
    </ul>
    <p>Please note that disabling certain cookies may impact the functionality and performance of our website.</p>
    <p>For more detailed guidance, visit <a href='https://www.aboutcookies.org' target='_blank' rel='noopener noreferrer'>www.aboutcookies.org</a> or <a href='https://www.allaboutcookies.org' target='_blank' rel='noopener noreferrer'>www.allaboutcookies.org</a>.</p>
  </div>

  <div className='section'>
    <h3 className='title'>5. Changes to This Policy</h3>
    <p>We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our services. Any updates will be posted on this page with a revised effective date.</p>
  </div>

  <div className='section'>
    <h3 className='title'>6. Contact Us</h3>
    <p>If you have any questions or concerns about our use of cookies, please contact:</p>
    <p>
      <strong>Cloudnet Travels Ltd</strong><br />
      2 Brook Street, Wrexham, LL13 7LH, United Kingdom<br />
      Phone: 9747020268<br />
      Email: <a href='mailto:cloudnettravels@gmail.com'>cloudnettravels@gmail.com</a>
    </p>
  </div>

</div>



            </div>

        
    )
}

export default PolicyPage