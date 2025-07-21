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
                        // style={{ color: `rgba(255, 255, 255, ${1 - opacity * 3})` }}>
                        style={{ color: `rgba(255, 255, 255, 1)` }}>
                       Terms and Conditions
                    </h1>

                </div>

            </section>
          
            <div className='sec-2'>

  <div className='section'>
    <h3 className='title'>Terms and Conditions</h3>
    <p><strong>Effective Date:</strong> 12 July 2025</p>
    <p>Welcome to the Cloudnet Travels website. By accessing or using our website, including placing takeaway or delivery orders, booking a table, or using guest checkout, you agree to the following Terms and Conditions. Please read them carefully.</p>
  </div>

  <div className='section'>
    <h3 className='title'>1. About Us</h3>
    <p>This website is operated by Cloudnet Travels Ltd trading as Cloudnet Travels, an Indian restaurant located at 2 Brook Street, Wrexham, LL13 7LH.</p>
  </div>

  <div className='section'>
    <h3 className='title'>2. Use of Website</h3>
    <ul>
      <li>You must be at least 18 years old to place an order or make a booking. By using our services, you confirm that you meet this requirement or are supervised by a responsible adult.</li>
      <li>You agree not to use the site for unlawful or fraudulent purposes.</li>
      <li>We reserve the right to suspend or restrict access to any part of our website if misuse or breach of terms is detected.</li>
    </ul>
  </div>

  <div className='section'>
    <h3 className='title'>3. Dine-In Bookings</h3>
    <ul>
      <li>Table reservations can be made through our website.</li>
      <li>You must provide accurate contact information and party size.</li>
      <li>We recommend arriving on time. We reserve the right to cancel bookings after 15 minutes of no-show unless we are informed of a delay.</li>
      <li>We may charge a cancellation or no-show fee in the future, with prior notice.</li>
    </ul>
  </div>

  <div className='section'>
    <h3 className='title'>4. Takeaway & Delivery Orders</h3>
    <ul>
      <li>Orders can be placed online for takeaway or delivery.</li>
      <li>Minimum order values and delivery charges may apply and will be shown at checkout.</li>
      <li>Estimated delivery times are provided as a guide only and may vary depending on demand, traffic, or weather conditions.</li>
      <li>It is your responsibility to ensure the delivery address and contact details are accurate. We are not responsible for failed deliveries due to incorrect information.</li>
    </ul>
  </div>

  <div className='section'>
    <h3 className='title'>5. Guest Checkout</h3>
    <ul>
      <li>You may place orders without creating an account by using our guest checkout.</li>
      <li>You must still provide valid and accurate contact, billing, and delivery information.</li>
      <li>Your information will be used only for the purpose of fulfilling your order unless you opt into marketing communications.</li>
    </ul>
  </div>

  <div className='section'>
    <h3 className='title'>6. Allergy and Dietary Information</h3>
    <ul>
      <li>It is your responsibility to inform us of any allergies or dietary restrictions at the time of placing an order or booking a table.</li>
      <li>Although we take every precaution, we cannot guarantee the absence of allergens due to cross-contamination.</li>
    </ul>
  </div>

  <div className='section'>
    <h3 className='title'>7. Prices & Payment</h3>
    <ul>
      <li>All prices listed are in GBP (£) and include VAT unless otherwise stated.</li>
      <li>Prices may change without prior notice, but confirmed orders will not be affected.</li>
      <li>Payments must be made securely via approved payment methods displayed at checkout.</li>
    </ul>
  </div>

  <div className='section'>
    <h3 className='title'>8. Cancellations, Refunds & Order Issues</h3>
    <ul>
      <li><strong>Dine-In Bookings:</strong> Please cancel or amend your reservation with reasonable notice.</li>
      <li><strong>Takeaway/Delivery Orders:</strong> Once confirmed, orders cannot usually be changed or cancelled. Contact us immediately if an error was made.</li>
      <li><strong>Refunds:</strong> may be issued at our discretion in cases of incorrect, missing, or unsatisfactory items. Proof may be required.</li>
    </ul>
  </div>

  <div className='section'>
    <h3 className='title'>9. Intellectual Property</h3>
    <p>All content, including text, images, and branding, is the property of Cloudnet Travels Ltd or its licensors. You may not reproduce or use any content without prior written consent.</p>
  </div>

  <div className='section'>
    <h3 className='title'>10. Third-Party Links</h3>
    <p>Our website may contain links to third-party sites for services like payments or mapping. We are not responsible for the content or policies of those websites.</p>
  </div>

  <div className='section'>
    <h3 className='title'>11. Limitation of Liability</h3>
    <p>We aim to keep our website accurate and available at all times but do not guarantee uninterrupted access.</p>
    <p>We are not liable for any loss resulting from delays, errors, or technical issues with the site or services, unless caused by our negligence or breach of contract.</p>
  </div>

  <div className='section'>
    <h3 className='title'>12. Privacy & Data Protection</h3>
    <p>Use of our website is subject to our <a href='/privacy-policy'>Privacy Policy</a> and <a href='/cookie-policy'>Cookie Policy</a>, which explain how we collect, use, and protect your personal data.</p>
  </div>

  <div className='section'>
    <h3 className='title'>13. Changes to Terms</h3>
    <p>We reserve the right to update these Terms and Conditions at any time. Any changes will be posted on this page and effective immediately upon publication.</p>
  </div>

  <div className='section'>
    <h3 className='title'>14. Governing Law</h3>
    <p>These Terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
  </div>

  <div className='section'>
    <h3 className='title'>15. Contact Us</h3>
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