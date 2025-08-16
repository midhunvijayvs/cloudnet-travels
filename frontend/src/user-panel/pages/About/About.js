import React from "react";
import "./About.scss";

const AboutUs = () => {
  return (
    <section className="about-us">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-text">
          <h1>Your Local Travel Experts</h1>
          <p>
            We're your friendly neighborhood travel experts, just a short walk
            from Koduvally. As a trusted local company, we’re passionate about
            helping you explore the world — from breathtaking beaches to buzzing
            cities. Whether it’s a tropical getaway, a city escape, or a family
            holiday, we make your travel dreams come true.
          </p>
          <p>
            We assist in booking<strong>domestic</strong>
            <strong></strong> flights  only for now, ensuring the best deals and
            smooth travel experiences.
          </p>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
            alt="Travel Destination"
          />
        </div>
      </div>

      {/* What We Offer */}
      <div className="offer-section">
        <h2>What We Offer</h2>
        <ul>
          <li>
            <strong>Tailored Holidays:</strong> Personalized travel packages to
            match your preferences.
          </li>
          <li>
            <strong>Flight Bookings:</strong> Hassle-free domestic flight reservations.
          </li>
        </ul>
      </div>

      {/* Our Commitment */}
      <div className="commitment-section">
        <h2>Our Commitment to You</h2>
        <ul>
          <li>24/7 Support: Always here to assist you.</li>
          <li>Late Night Hours: Flexible timings for your convenience.</li>
          <li>
            Local Expertise: Deep knowledge of destinations and travel planning.
          </li>
        </ul>
      </div>

      {/* Mission & Vision */}
      <div className="mission-vision">
        <div className="mission">
          <h2>Our Mission</h2>
          <p>
            To inspire global exploration and create unforgettable travel
            experiences. We believe travel is a journey of discovery — a chance
            to connect with cultures and broaden horizons.
          </p>
          <p>
            Our mission is to make travel accessible, enjoyable, and uniquely
            yours through personalized solutions and exceptional service.
          </p>
        </div>
        <div className="vision">
          <h2>Our Vision</h2>
          <p>
            To be the leading travel company, revolutionizing the way people
            explore the world.
          </p>
          <ul>
            <li>Customer-Centric Service</li>
            <li>Sustainable Travel Practices</li>
            <li>Innovative Travel Solutions</li>
            <li>Expert Guidance & Support</li>
          </ul>
        </div>
      </div>

      {/* Team Section */}
      <div className="team">
        <h2>Meet Our Team</h2>
        <div className="team-members">
          <div className="member">
            <img
              src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=334,fit=crop/YZ920rOEvns24kWG/cc_zi-d95Knl506aFOwNQJ.jpg"
              alt="Shihad"
            />
            <h3>Shihad</h3>
            <p>Founder / CEO</p>
          </div>
          <div className="member">
           <img alt="" src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=334,fit=crop/YZ920rOEvns24kWG/shinas-Aq2vKnQ9y8hbM1g3.png" srcset="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=334,fit=crop/YZ920rOEvns24kWG/shinas-Aq2vKnQ9y8hbM1g3.png 328w,https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=683,fit=crop/YZ920rOEvns24kWG/shinas-Aq2vKnQ9y8hbM1g3.png 656w,https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1024,h=910,fit=crop/YZ920rOEvns24kWG/shinas-Aq2vKnQ9y8hbM1g3.png 861w,https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1024,h=911,fit=crop/YZ920rOEvns24kWG/shinas-Aq2vKnQ9y8hbM1g3.png 984w,https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=334,fit=crop/YZ920rOEvns24kWG/shinas-Aq2vKnQ9y8hbM1g3.png 297w,https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,h=683,fit=crop/YZ920rOEvns24kWG/shinas-Aq2vKnQ9y8hbM1g3.png 594w" sizes="(min-width: 920px) 297px, calc(100vw - 0px)" height="264" width="297" loading="lazy" class="image__image" data-v-e7628ce9="" data-qa="builder-gridelement-gridimage"/>
            <h3>Abdul Shinas</h3>
            <p>Reservation Officer</p>
          </div>
          <div className="member">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
              alt="Photographer"
            />
            <h3>Creative Partner</h3>
            <p>Photographer</p>
          </div>
        </div>
      </div>

      {/* Visit Us */}
      <div className="visit">
        <h2>Visit Us Today!</h2>
        <p>
          Drop by our office and let’s start planning your next adventure. We’re
          excited to meet you and help turn your travel dreams into reality.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
