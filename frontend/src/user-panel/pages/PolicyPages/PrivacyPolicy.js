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
                        // style={{ color:`rgba(255, 255, 255, ${1 - opacity * 3})` }}>
                        style={{ color:`rgba(255, 255, 255, 1)` }}>
                        Privacy Policy
                    </h1>

                </div>

            </section>
       
       
       <div className='sec-2'>

  <div className='section'>
    <h3 className='title'>Privacy Policy</h3>
    <p><strong>Effective Date:</strong> 12 July 2025</p>
    <p>At Cloudnet Travels Ltd, trading as Cloudnet Travels, we are committed to protecting your privacy and ensuring your personal data is handled in a secure and responsible manner. This Privacy Policy outlines how we collect, use, store, and protect your information when you interact with us, whether online or at our restaurant.</p>
  </div>

  <div className='section'>
    <h3 className='title'>1. Who We Are</h3>
    <p>Cloudnet Travels is an authentic Indian restaurant based in Wrexham, UK. Experience the true taste of India with our exceptional dine-in ambiance, quick takeaway, doorstep delivery, and personalised catering services tailored for every occasion.</p>
  </div>

  <div className='section'>
    <h3 className='title'>2. What Information We Collect</h3>
    <p>We may collect and process the following types of personal data:</p>
    <ul>
      <li><strong>Identity Data:</strong> Name, email address, phone number.</li>
      <li><strong>Transaction Data:</strong> Payment information and purchase history.</li>
      <li><strong>Technical Data:</strong> IP address, browser type, device information.</li>
      <li><strong>Marketing Preferences:</strong> Your preferences in receiving marketing communications from us.</li>
    </ul>
    <p>We collect this information when you:</p>
    <ul>
      <li>Make a reservation</li>
      <li>Place an order (in-person, online, or over the phone)</li>
      <li>Contact us via our website, phone, or social media</li>
      <li>Sign up for newsletters or promotional updates</li>
      <li>Participate in surveys or feedback</li>
    </ul>
  </div>

  <div className='section'>
    <h3 className='title'>3. How We Use Your Information</h3>
    <p>We use your personal data for the following purposes:</p>
    <ul>
      <li>To process and manage bookings and orders</li>
      <li>To provide customer service and respond to queries</li>
      <li>To send updates, offers, or promotional content (only if you’ve opted in)</li>
      <li>To improve our services and website functionality</li>
      <li>To comply with legal or regulatory obligations</li>
    </ul>
    <p>We will never sell your personal data to third parties.</p>
  </div>

  <div className='section'>
    <h3 className='title'>4. Lawful Basis for Processing</h3>
    <p>We rely on the following lawful bases for processing your personal data:</p>
    <ul>
      <li><strong>Consent:</strong> When you opt-in to receive marketing communications.</li>
      <li><strong>Contract:</strong> When processing is necessary to fulfil your reservation or food order.</li>
      <li><strong>Legal Obligation:</strong> For compliance with legal requirements.</li>
      <li><strong>Legitimate Interests:</strong> To enhance our services and maintain business operations.</li>
    </ul>
  </div>

  <div className='section'>
    <h3 className='title'>5. How We Share Your Data</h3>
    <p>Your data may be shared with:</p>
    <ul>
      <li>Service providers (e.g., payment processors, booking platforms)</li>
      <li>Legal or regulatory authorities if required</li>
      <li>IT and system administration providers who support our website</li>
    </ul>
    <p>All third parties are required to respect the security of your data and treat it in accordance with the law.</p>
  </div>

  <div className='section'>
    <h3 className='title'>6. Data Retention</h3>
    <p>We will retain your personal data only for as long as necessary to fulfil the purposes we collected it for, including for legal, accounting, or reporting requirements.</p>
  </div>

  <div className='section'>
    <h3 className='title'>7. Your Rights</h3>
    <p>Under the UK GDPR, you have the right to:</p>
    <ul>
      <li>Access your personal data</li>
      <li>Request correction or deletion</li>
      <li>Object to processing</li>
      <li>Withdraw consent (where applicable)</li>
      <li>Lodge a complaint with the Information Commissioner’s Office (ICO)</li>
    </ul>
    <p>If you wish to exercise any of these rights, please contact us using the details below.</p>
  </div>

  <div className='section'>
    <h3 className='title'>8. Cookies</h3>
    <p>Our website may use cookies to enhance user experience, analyse traffic, and personalise content. You can manage your cookie preferences through your browser settings.</p>
  </div>

  <div className='section'>
    <h3 className='title'>9. Third-Party Links</h3>
    <p>Our website may contain links to third-party websites. We are not responsible for their privacy policies or practices, and we encourage you to review them separately.</p>
  </div>

  <div className='section'>
    <h3 className='title'>10. Contact Us</h3>
    <p>If you have any questions about this Privacy Policy or how we handle your personal data, please contact:</p>
    <p>
      <strong>Cloudnet Travels Ltd</strong><br />
      2 Brook Street, Wrexham, LL13 7LH, United Kingdom<br />
      Phone: 07777760756<br />
      Email: <a href='mailto:connect@rangrasoii.com'>connect@rangrasoii.com</a>
    </p>
  </div>

  <div className='section'>
    <h3 className='title'>Changes to This Privacy Policy</h3>
    <p>We reserve the right to update this Privacy Policy at any time. Any changes will be posted on this page with an updated effective date.</p>
  </div>

</div>



        </div>
    )
}

export default PolicyPage