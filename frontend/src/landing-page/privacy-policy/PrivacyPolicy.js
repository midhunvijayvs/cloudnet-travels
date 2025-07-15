import React, {useEffect} from 'react'
import './PrivacyPolicy.scss'
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';


const PrivacyPolicy = () => {
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
    <div className=' privacy-policy'>
        <div className='header' id='header' >
            <img className='app-logo' onClick={() => navigate('/landing-page')}  style={{cursor:"pointer"}} src="/images/app-logo-header.svg" alt=''></img>
        </div>
        <div className='banner-section' >
            <img src="/images/authentication-pages/background.png" className="main-icon" 
                style={window.innerWidth > 992 ? { bottom: -577, right: 100, transform: `rotate(${123}deg)` } : window.innerWidth > 767 ? { bottom: -590, right: 45, transform: `rotate(${131}deg)` } : { bottom: -470, right: -116, transform: `rotate(${117}deg)` }}></img>
            <div className='banner-title'>Privacy Policy</div>
        </div>
        <div className='sec-2'>
            <div className='privacy-head'>
                <div className='title'>Privacy Policy</div>
                <p className='title-para'>Cloudnet Travels Ltd ("we," "us," or "our") is committed to protecting the privacy of our customers, employees, and website visitors. This Privacy Policy explains how we collect, use, disclose, and protect personal information.</p>
            </div>
            <div className='scope'>
                <div className='title'>Scope</div>
                <p>This Privacy Policy applies to all personal information collected by Cloudnet Travels Ltd through our website, social media, email, phone, or in-person interactions. It also applies to personal information collected from our customers, employees, and third-party vendors.</p>
            </div>
            <div className=''>
                <div className='title'>Personal Information We Collect</div>
                <p>We may collect the following types of personal information:</p>
                <ul>
                    <li><p>Contact information: name, email address, phone number, physical address</p></li>
                    <li><p>Identification information: username, password (hashed)</p></li>
                    <li><p>Technical information: IP address, browser type, device type</p></li>
                    <li><p>Business information: company name, job title, industry</p></li>
                    <li><p>Payment information: credit card numbers, bank account numbers (if applicable)</p></li>
                </ul>
            </div>
            <div className=''>
                <div className='title'>How We Collect Personal Information</div>
                <p>We collect personal information through various means, including:</p>
                <ul>
                    <li><p>Website forms and surveys</p></li>
                    <li><p>Social media platforms</p></li>
                    <li><p>Email and phone interactions</p></li>
                    <li><p>In-person meetings and events</p></li>
                    <li><p>Third-party vendors and partners</p></li>
                </ul>
            </div>
            <div className=''>
                <div className='title'>How We Use Personal Information</div>
                <p>We use personal information for the purposes listed above. We may also use personal information to:</p>
                <ul>
                    <li><p>Respond to customer inquiries and support  requests</p></li>
                    <li><p>Send newsletters and promotional materials (with consent)</p></li>
                    <li><p>Analyse website usage and improve user experience</p></li>
                    <li><p>Detect and prevent fraud and security threats</p></li>
                </ul>
            </div>
            <div className=''>
                <div className='title'>Disclosure of Personal Information</div>
                <p>We may disclose personal information to:</p>
                <ul>
                    <li><p>Our employees and contractors who need access to perform their job duties</p></li>
                    <li><p>Third-party vendors and partners who provide services to us (e.g., payment processors)</p></li>
                    <li><p>Law enforcement agencies or regulatory bodies (if required by law)</p></li>
                    <li><p>Other parties with your consent or as permitted by law</p></li>
                </ul>
            </div>
            <div className=''>
                <div className='title'>Security Measures</div>
                <p>We take reasonable measures to protect personal information from unauthorized access, disclosure, alteration, or destruction. These measures include:</p>
                <ul>
                    <li><p>Encryption of sensitive data</p></li>
                    <li><p>Secure servers and databases</p></li>
                    <li><p>Firewalls and intrusion detection systems</p></li>
                    <li><p>Access controls and authentication protocols</p></li>
                    <li><p>Regular security audits and testing</p></li>
                </ul>
            </div>
            <div className=''>
                <div className='title'>Data Retention</div>
                <p>We retain personal information for as long as necessary to fulfil the purposes outlined above. We may also retain personal information for a longer period if required by law or regulation.</p>
                
            </div>
            <div className=''>
                <div className='title'>Individual Rights</div>
                <p>You have the right to:</p>
                <ul>
                    <li><p>Request access to your personal information</p></li>
                    <li><p>Correct or update your personal information</p></li>
                    <li><p>Erase your personal information (subject to certain exceptions)</p></li>
                    <li><p>Restrict the processing of your personal information</p></li>
                    <li><p>Object to processing of your personal information</p></li>
                    <li><p>Receive a copy of your personal information in a portable format</p></li>
                </ul>
                <p>To exercise these rights, please contact us using the details below. </p>
            </div>
            <div className=''>
                <div className='title'>Changes to this Policy</div>
                <p>We reserve the right to modify this Privacy Policy at any time. Changes will be posted on our website and effective upon posting.</p>
            </div>
            <div className=''>
                <div className='title'>Contact Us</div>
                <p className='contact'>If you have any questions or concerns about this Privacy Policy or our handling of personal information,<br/> please contact us at:</p>
                <p className='contact connect'><a href="mailto:connect@zogglobal.com">connect@zogglobal.com</a></p>
                <p className='contact'>02045 424350</p>
                <p className='contact'>Business Central, 2 Union Square,Central Park, Darlington, DL1 1GL</p>
            </div>
            <div className='last'>
                <p>Last Updated: 01-02-2024</p>
            </div>
        </div>
        <div className='footer-sec'>
            <div className='footer-content'>
              <li onClick={() => navigate(window.location.pathname)} className='link'>Privacy Policy</li>
              <li>© 2024 Cloudnet Travels</li>
            </div>
        </div>
    </div>
  )
}

export default PrivacyPolicy