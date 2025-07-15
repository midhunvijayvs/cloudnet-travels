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
                        Refund and Cancellation Policy
                    </h1>

                </div>

            </section>
            
            <div className='sec-2'>

  <div className='section'>
    <h3 className='title'>Refund and Cancellation Policy</h3>
    <p><strong>Effective Date:</strong> 12 July 2025</p>
    <p>At Cloudnet Travels, we aim to provide a high-quality dining experience, whether you’re booking a table, ordering takeaway, or requesting delivery. This Refund and Cancellation Policy outlines how cancellations, changes, and refunds are handled across our services.</p>
  </div>

  <div className='section'>
    <h3 className='title'>1. Dine-In Bookings</h3>
    <ul>
      <li><strong>Cancellations:</strong> We kindly request that you cancel or amend your reservation with at least 2 hours' notice to allow us to manage our seating efficiently.</li>
      <li><strong>No-Shows or Late Arrivals:</strong> If you do not arrive within 15 minutes of your reserved time and have not contacted us, your table may be released to other guests.</li>
      <li><strong>Large Group Bookings:</strong> For groups of 6 or more, we may require a deposit. Deposits are non-refundable unless cancelled at least 24 hours in advance.</li>
    </ul>
  </div>

  <div className='section'>
    <h3 className='title'>2. Takeaway Orders</h3>
    <ul>
      <li><strong>Order Changes:</strong> Once an order is confirmed, it may not be possible to make changes. If you need to make an amendment, please call us immediately, and we’ll do our best to accommodate.</li>
      <li><strong>Cancellations:</strong> Cancellations are only accepted within 5 minutes of placing the order, as preparation typically begins shortly after confirmation.</li>
      <li><strong>Refunds:</strong> Refunds will only be issued under the following circumstances:
        <ul>
          <li>Incorrect or missing items (verified by our team)</li>
          <li>Incomplete or unfulfilled orders due to our error</li>
          <li>Payment charged but order not received or acknowledged</li>
        </ul>
      </li>
    </ul>
  </div>

  <div className='section'>
    <h3 className='title'>3. Delivery Orders</h3>
    <ul>
      <li><strong>Delivery Timeframes:</strong> We aim to deliver your food within the estimated time, but delays can occasionally occur due to traffic, weather, or high demand.</li>
      <li><strong>Cancellations:</strong> Delivery orders cannot be cancelled once the food is out for delivery.</li>
      <li><strong>Refunds:</strong> Refunds for delivery orders may be issued for:
        <ul>
          <li>Non-delivery</li>
          <li>Incorrect items</li>
          <li>Poor food quality (subject to assessment and timely notification)</li>
        </ul>
      </li>
      <li><strong>Customer Responsibility:</strong> Please ensure the delivery address and contact number provided are accurate. We are not liable for failed deliveries due to incorrect details.</li>
    </ul>
  </div>

  <div className='section'>
    <h3 className='title'>4. Guest Checkout</h3>
    <p>Orders placed via guest checkout are treated with the same level of care as account-based orders.</p>
    <p>To request a cancellation or refund, please retain your order confirmation email and contact us promptly with order details.</p>
  </div>

  <div className='section'>
    <h3 className='title'>5. Refund Process</h3>
    <ul>
      <li>All refund requests must be made within 24 hours of receiving your order or missing a reservation.</li>
      <li>Approved refunds will be processed to the original method of payment within 5–7 business days.</li>
      <li>In some cases, we may offer a credit voucher or replacement order instead of a refund.</li>
    </ul>
  </div>

  <div className='section'>
    <h3 className='title'>6. Contact Us</h3>
    <p>If you need assistance with a refund or cancellation, please contact our team as soon as possible:</p>
    <p>
      <strong>Cloudnet Travels Ltd</strong><br />
      2 Brook Street, Wrexham, LL13 7LH, United Kingdom<br />
      Phone: 07777760756<br />
      Email: <a href='mailto:connect@rangrasoii.com'>connect@rangrasoii.com</a>
    </p>
    <p>Please provide your order reference, date/time, and reason for your request to help us assist you efficiently.</p>
  </div>

</div>


        </div>
    )
}

export default PolicyPage