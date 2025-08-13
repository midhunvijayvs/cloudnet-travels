import React from "react";
import "./Payment.scss";

const Payment = () => {
  return (
    <section className="payment-page">
      {/* Header Section */}
      <div className="payment-hero">
        <h1>Secure Payment Gateway</h1>
        <p>
          Easily pay to our linked business bank account with a seamless and
          secure payment experience, powered by{" "}
          <strong>PhonePe</strong>.
        </p>
      </div>

      {/* Features */}
      <div className="payment-features">
        <div className="feature">
          <img
            src="https://img.icons8.com/ios-filled/100/0A74CE/lock--v1.png"
            alt="Secure"
          />
          <h2>Secure Payment Solutions</h2>
          <p>
            Pay directly to our linked business bank account using our secure
            payment page service backed by PhonePe.
          </p>
        </div>
        <div className="feature">
          <img
            src="https://img.icons8.com/ios-filled/100/0A74CE/shield.png"
            alt="Security"
          />
          <h2>Reliable Transaction Security</h2>
          <p>
            Your payments are protected with advanced encryption and fraud
            detection for complete peace of mind.
          </p>
        </div>
        <div className="feature">
          <img
            src="https://img.icons8.com/ios-filled/100/0A74CE/rocket--v1.png"
            alt="Fast Processing"
          />
          <h2>Fast Payment Processing</h2>
          <p>
            Experience quick and reliable transactions for all your travel and
            booking needs.
          </p>
        </div>
        <div className="feature">
          <img
            src="/images/payment/sec-2-4.png"
            alt="User-Friendly"
          />
          <h2>User-Friendly Interface</h2>
          <p>
            Navigate our payment page effortlessly to complete transactions
            without hassle.
          </p>
        </div>
      </div>

      {/* Payment CTA */}
      <div className="payment-cta">
        <h2>Ready to Travel?</h2>
        <p>
          Click the button below to proceed with your travel booking with secure PhonePe payment.
        </p>
        <a
          href="/" // Replace with actual payment initiation route
          className="pay-btn"
        >
          Book Now
        </a>
      </div>
    </section>
  );
};

export default Payment;
