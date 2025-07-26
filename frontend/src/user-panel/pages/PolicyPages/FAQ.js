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
                        FAQ
                    </h1>

                </div>

            </section>
           <div className='sec-2'>

  <div className='section'>
    <h3 className='title'>Frequently Asked Questions (FAQs)</h3>

    <div className='faq'>
      <p><strong>1. Where is Cloudnet Travels located?</strong></p>
      <p>We are located at 2 Brook Street, Wrexham, LL13 7LH. You can find us easily on Google Maps or contact us directly at 9747020268.</p>
    </div>

    <div className='faq'>
      <p><strong>2. What type of cuisine do you serve?</strong></p>
      <p>Cloudnet Travels specialises in authentic Indian cuisine, including North and South Indian dishes, as well as Indo-Chinese specials.</p>
    </div>

    <div className='faq'>
      <p><strong>3. Do you offer dine-in reservations?</strong></p>
      <p>Yes, we offer online table reservations. Simply use our booking form on the website to reserve a table for your preferred date and time.</p>
    </div>

    <div className='faq'>
      <p><strong>4. Can I place a takeaway order online?</strong></p>
      <p>Absolutely! You can place a takeaway order directly through our website. Just select your items, choose takeaway, and checkout.</p>
    </div>

    <div className='faq'>
      <p><strong>5. Do you offer home delivery?</strong></p>
      <p>Yes, we provide delivery services within a 2.5-mile radius, covering Acton (LL12), Borras (LL12), Garden Village (LL11), and New Broughton (LL11).</p>
    </div>

    <div className='faq'>
      <p><strong>6. What are your delivery hours?</strong></p>
      <p>Our delivery services are available from Monday to Sunday from 12:00 PM to 10:00 PM. Delivery times may vary during busy hours.</p>
    </div>

    <div className='faq'>
      <p><strong>7. Is there a minimum order for delivery?</strong></p>
      <p>Yes, the minimum order value for delivery is ₹20. A delivery charge may apply depending on your location.</p>
    </div>

    <div className='faq'>
      <p><strong>8. Can I use guest checkout for orders?</strong></p>
      <p>Yes! We offer a convenient guest checkout option — no account needed. Just provide accurate delivery and contact details at checkout.</p>
    </div>

    <div className='faq'>
      <p><strong>9. How do I cancel or modify my order?</strong></p>
      <p>For takeaway or delivery orders, please call us immediately after placing your order. Once the food is being prepared or out for delivery, cancellations may not be possible.</p>
    </div>

    <div className='faq'>
      <p><strong>10. Do you cater to dietary requirements or allergies?</strong></p>
      <p>Yes, we cater to most dietary preferences and allergy requests. Please inform us clearly when ordering or making a reservation.</p>
    </div>

    <div className='faq'>
      <p><strong>11. Do you offer vegetarian or vegan options?</strong></p>
      <p>Absolutely. Our menu includes a wide range of vegetarian and some vegan-friendly dishes. Look out for the labels on our online menu.</p>
    </div>

    <div className='faq'>
      <p><strong>12. Do you provide catering for events?</strong></p>
      <p>Yes, we offer catering for big or small events. Contact us directly to discuss your requirements and get a custom quote.</p>
    </div>

    <div className='faq'>
      <p><strong>13. How can I contact you for general enquiries?</strong></p>
      <p>You can call us on 9747020268 or email us at cloudnettravels@gmail.com. Alternatively, use the contact form on our website.</p>
    </div>

    <div className='faq'>
      <p><strong>14. What payment methods do you accept?</strong></p>
      <p>We accept all major debit and credit cards and UPI payments for online orders. For dine-in and takeaway, we accept card and cash payments.</p>
    </div>

    <div className='faq'>
      <p><strong>15. Is parking available near the restaurant?</strong></p>
      <p>Yes, there is ample parking available near our location. Street and public parking options are accessible.</p>
    </div>

  </div>

</div>


        </div>
    )
}

export default PolicyPage