import React from "react";
import "./Footer.scss";

import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons'; const Footer = ({ activePage, setActivePage }) => {
  let navigate = useNavigate();
  var LOGOURL;

  if (window.innerWidth > 768) {
    LOGOURL = "/images/zog-logo.svg"
  }
  else {

    LOGOURL = "/images/zog-logo-mobile-footer.svg"
  }


  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col welcome">
          <h3>STEP INTO CLOUDNET TRAVELS </h3>
          <p>Cloudnet Travels is a leading travel agency in Calicut district. This portal allows you to book flight tickets sealessly</p>
          <p> We provide ticket booking services with all major airline's services.</p>
        </div>

        <div className="footer-col contact">
  <div>
    <h4>VISIT</h4>
    <p>
      <FontAwesomeIcon icon={faLocationDot} />{' '}
      <a
        href="https://www.google.com/maps/search/?api=1&query=2+Koduvally,+kozhikode,+kerala"
        target="_blank"
        rel="noopener noreferrer"
      >
        Koduvalli,<br />Calicut, Kerala
      </a>
    </p>
  </div>
  <div>
    <h4>TALK</h4>
    <p>
      <FontAwesomeIcon icon={faPhone} />{' '}
      <a href="tel:9747020268">9747020268</a>
    </p>
  </div>
  <div>
    <h4>WRITE</h4>
    <p>
      <FontAwesomeIcon icon={faEnvelope} />{' '}
      <a href="mailto:cloudnettravels@gmail.com">cloudnettravels@gmail.com</a>
    </p>
  </div>
</div>

        <div className="footer-col reservation">
          <h4>CONNECT</h4>
          <button onClick={()=>navigate("/")} className="book-btn">CONTACT</button>
          <h4>HOURS</h4>
          <p>MONDAY thru FRIDAY<br />11am – 9pm</p>
          <p>SATURDAY/SUNDAY<br />10am – 11pm</p>
        </div>

        <div className="footer-col about">
          <h4>ABOUT</h4>
          <ul>
            <li onClick={() => navigate("/faq")}>FAQ</li>
            <li onClick={() => navigate("/delivery-policy")}>Delivery Policy</li>
            <li onClick={() => navigate("/privacy-policy")}>Privacy Policy</li>
            <li onClick={() => navigate("/cookie-policy")}>Cookie Policy</li>
            <li onClick={() => navigate("/refund-and-cancellation-policy")}>Refund & Cancellation Policy</li>
            <li onClick={() => navigate("/terms-and-conditions")}>Terms & Conditions</li>
            <li onClick={() => navigate("/contact-us")}>Contact Us</li>
          </ul>
          <h4>FOLLOW ALONG</h4>
          <div className="socials">
            <span>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
            </span>
            <span>
              <a href="https://www.instagram.com/cloudnettravels/" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </span>
            <span>
              <a href="https://wa.me/447777760756" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
            </span>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 CLOUDNET TRAVELS. ALL RIGHTS RESERVED.</p>
        <h2>CLOUDNET TRAVELS</h2>
        <span>FLY IN THE LAP OF CLOUDS</span>
      </div>
    </footer>
  );
};

export default Footer;