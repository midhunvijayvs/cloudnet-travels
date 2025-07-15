import React, { useEffect, useState, useRef } from 'react'
import DocumentMeta from 'react-document-meta';
import { metaTags } from '../../../Constants.js'
import './Home.scss'

import { useNavigate } from 'react-router-dom';

import ErrorModal from "../../../ErrorModal.js";
import PositiveModal from "../../../PositiveModal.js";
import ContactUsTempPopup from "../../common-components/ContactUsTempPopup/ContactUsTempPopup.js";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner.js"
import $ from 'jquery';
import API from "../../../API.js"

import { isValidPhoneNumber } from 'libphonenumber-js';
import PhoneInput from 'react-phone-input-2';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';

import {ALL_AIRPORTS} from '../../constants/AiportList.js'
const Userhome = ({ userData, loadUserData, ticketSearchFormData, setTicketSearchFormData }) => {


  const navigate = useNavigate();




  const [tabSelected, selectTab] = useState(0);

  const [message, setMessage] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({})

  const [airportOptions, setAirportOptions] = useState([]);
  const [originQuery, setOriginQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);




  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])





  const handleChange = (e) => {
    const { name, value } = e.target;

    const numericKeys = ['adult', 'child', 'infant'];

    setTicketSearchFormData((prev) => ({
      ...prev,
      [name]: numericKeys.includes(name) ? parseInt(value, 10) : value,
    }));
  };



  const handleOriginChange = (e) => {
    const value = e.target.value;
    setOriginQuery(value);
    setShowOriginDropdown(true);
    const results = searchAirports(value);
    setAirportOptions(results);
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestinationQuery(value);
    setShowDestinationDropdown(true);
    const results = searchAirports(value);
    setAirportOptions(results);
  };

  const searchAirports = (query) => {
    if (!query) return [];
    const lower = query.toLowerCase();
    return ALL_AIRPORTS.filter(a =>
      a.name.toLowerCase().includes(lower) || a.code.toLowerCase().includes(lower)
    );
  };

  const handleOriginSelect = (airport) => {
    setTicketSearchFormData(prev => ({ ...prev, origin: `${airport.code}` }));
    setOriginQuery(`${airport.name} - ${airport.code}`);
    setShowOriginDropdown(false);
  };

  const handleDestinationSelect = (airport) => {
    setTicketSearchFormData(prev => ({ ...prev, destination: `${airport.code}` }));
    setDestinationQuery(`${airport.name} - ${airport.code}`);
    setShowDestinationDropdown(false);
  };



 const validateForm=(data)=>{
   const errors = {};

    if (!data.origin) errors.origin = 'Origin is required';
    if (!data.destination) errors.destination = 'Destination is required';
    if (!data.departure_date) errors.departure_date = 'Departure date is required';
    if (!data.adult || data.adult < 1) errors.adult = 'At least one adult is required';
return errors;
}


const submitForm=()=>{
 let errors = validateForm(ticketSearchFormData)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsLoading(false);
      return;
    }

navigate('/shop')
}





  return (
    <div className="home-page">
      <DocumentMeta {...metaTags.Home} />

      <section className="banner">
        <div className="inner">
          <div className="left-side">
            <h1
              className="main-heading only-web">
              Booking Portal


            </h1>
            <h1
              className="main-heading only-tab">
              Booking Portal

            </h1>
            <h1
              className="main-heading only-mob"
            >
              Booking Portal
            </h1>
            <button className="btn-primary" onClick={() => navigate('/book-dine-in')}>

              <span>Book a Trip</span>
              <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.9766 7.69651L1.25338 7.69651M16.9766 7.69651L9.90113 0.958008M16.9766 7.69651L9.90113 14.435" stroke="white" stroke-width="1.46001" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>



          </div>
          <div className="right-side">
            <div className="form-container">
              <h2>Check Flight Availability</h2>
              <form >


                <div className="form-group">
                  <label>Origin</label>
                  <input
                    type="text"
                    value={originQuery}
                    onChange={handleOriginChange}
                    onBlur={() => setTimeout(() => setShowOriginDropdown(false), 200)}
                    required
                  />
                  {showOriginDropdown && (
                    <ul className="dropdown-list">
                      {airportOptions.map((a, index) => (
                        <li key={index} onClick={() => handleOriginSelect(a)}>
                          {a.name} - {a.code}
                        </li>
                      ))}
                    </ul>
                  )}
                  {formErrors.origin && <p className="error">{formErrors.origin}</p>}
                </div>


                <div className="form-group">
                  <label>Destination</label>
                  <input
                    type="text"
                    value={destinationQuery}
                    onChange={handleDestinationChange}
                    onBlur={() => setTimeout(() => setShowDestinationDropdown(false), 200)}
                    required
                  />
                  {showDestinationDropdown && (
                    <ul className="dropdown-list">
                      {airportOptions.map((a, index) => (
                        <li key={index} onClick={() => handleDestinationSelect(a)}>
                          {a.name} - {a.code}
                        </li>
                      ))}
                    </ul>
                  )}
                  {formErrors.destination && <p className="error">{formErrors.destination}</p>}
                </div>


                <div className="form-group">
                  <label>Departure Date</label>
                  <input type="date" name="departure_date" value={ticketSearchFormData.departure_date} onChange={handleChange} required />
                </div>
                <div className="form-row">
                  <div className="form-group small">
                    <label>Adult</label>
                    <input type="number" name="adult" min="1" value={ticketSearchFormData.adult} onChange={handleChange} />
                  </div>
                  <div className="form-group small">
                    <label>Child</label>
                    <input type="number" name="child" min="0" value={ticketSearchFormData.child} onChange={handleChange} />
                  </div>
                  <div className="form-group small">
                    <label>Infant</label>
                    <input type="number" name="infant" min="0" value={ticketSearchFormData.infant} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Airline Code (optional)</label>
                  <input type="text" name="airline_code" value={ticketSearchFormData.airline_code} onChange={handleChange} />
                </div>
                <button type="button" disabled={isLoading} onClick={submitForm}>
                  {isLoading ? 'Searching...' : 'Search Flights'}
                </button>
                {formErrors.search && <p className="error">{formErrors.search}</p>}
              </form>
            </div>


          </div>
        </div>


      </section>




      {isLoading && <FixedOverlayLoadingSpinner />}


      <ErrorModal
        state={isErrorModalOpen}
        message={message}
        setterFunction={setIsErrorModalOpen}
        okClickedFunction={() => navigate("/")}
      />
      {isMessageModalOpen && (
        <PositiveModal
          message={message}
          setterFunction={setIsMessageModalOpen}
          okClickedFunction={() => { }}
        />
      )}

      {isContactModalOpen && (
        <ContactUsTempPopup setterFunction={setIsContactModalOpen} />
      )}
    </div>
  );


}

export default Userhome