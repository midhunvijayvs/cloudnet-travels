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
                    Delivery Policy
                    </h1>

                </div>

            </section>
           <div className='sec-2'>

  <div className='section'>
    <h3 className='title'>Delivery Policy</h3>
    <p><strong>Effective Date:</strong> 12 July 2025</p>
    <p>At Cloudnet Travels, we are committed to delivering fresh, authentic Indian cuisine directly to your doorstep. Please read our Delivery Policy below to understand how we operate our delivery service.</p>
  </div>

  <div className='section'>
    <h3 className='title'>1. Delivery Radius</h3>
    <p>We currently offer delivery services within a 2.5-mile radius from our restaurant located at 2 Brook Street, Wrexham, LL13 7LH. Orders placed outside this radius may not be accepted unless arranged by phone.</p>
  </div>

  <div className='section'>
    <h3 className='title'>2. Areas We Deliver To</h3>
    <p>We proudly deliver to the following local areas:</p>
    <ul>
      <li>Acton – LL12</li>
      <li>Borras – LL12</li>
      <li>Garden Village – LL11</li>
      <li>New Broughton – LL11</li>
    </ul>
    <p>Please ensure your postcode falls within these regions when placing a delivery order online.</p>
  </div>

  <div className='section'>
    <h3 className='title'>3. Delivery Times</h3>
    <p><strong>Monday to Sunday:</strong> 12:00 PM – 10:00 PM</p>
    <p>Delivery times may vary depending on demand, weather, and traffic conditions.</p>
    <p>Estimated delivery time is typically 45–60 minutes, but this may be longer during peak hours.</p>
  </div>

  <div className='section'>
    <h3 className='title'>4. Order Minimum & Delivery Fees</h3>
    <ul>
      <li><strong>Minimum order value:</strong> £20</li>
      <li><strong>Delivery charge:</strong> Free delivery on orders over £40</li>
    </ul>
  </div>

  <div className='section'>
    <h3 className='title'>5. Order Process</h3>
    <ul>
      <li>Orders can be placed through our website using the delivery option at checkout.</li>
      <li>Guest checkout is available for convenience—just provide accurate delivery and contact information.</li>
      <li>Once your order is confirmed, you will receive an order confirmation via email or SMS (if applicable).</li>
    </ul>
  </div>

  <div className='section'>
    <h3 className='title'>6. Failed Deliveries</h3>
    <ul>
      <li>Please ensure someone is available to receive the order at the provided address.</li>
      <li>If we are unable to deliver due to incorrect details or no one being present, the order may be returned to the restaurant without a refund.</li>
      <li>Redelivery may incur an additional charge and is subject to availability.</li>
    </ul>
  </div>

  <div className='section'>
    <h3 className='title'>7. Contactless Delivery</h3>
    <p>For your safety and convenience, we offer contactless delivery on request. Please mention this at checkout or inform our team when placing the order.</p>
  </div>

  <div className='section'>
    <h3 className='title'>8. Issues & Complaints</h3>
    <p>If you experience any issues with your delivery, such as missing items or delays, please contact us immediately on <strong>07777760756</strong> or via email at <strong>connect@rangrasoii.com</strong>. We will do our best to resolve the matter promptly.</p>
  </div>

  <div className='section'>
    <h3 className='title'>9. Changes to Delivery Policy</h3>
    <p>We reserve the right to update or amend this policy at any time. Changes will be posted on this page and effective immediately upon publication.</p>
  </div>

  <div className='section'>
    <p>Thank you for choosing Cloudnet Travels!</p>
  </div>

</div>


        </div>
    )
}

export default PolicyPage