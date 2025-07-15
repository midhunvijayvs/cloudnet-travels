import React, { useEffect, useState, useRef, useContext } from 'react'


import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import ErrorModal from "../../../ErrorModal.js";
import PositiveModal from "../../../PositiveModal.js";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner.js"
import $ from 'jquery';
import API from '../../../API.js';
import { UserContext } from '../../../authentication/pages/UserContext.js';
import MainFilter from '../../common-components/MainFilter.js';
import Pagination from '../../../Pagination.js';
import './Shop.scss'
import { formatClosingTime, formatOpeningTime, formatTimeFromMinutes } from '../../../GeneralFunctions.js';
import RecommendedDishes from '../../common-components/RecommendedDishes/RecommendedDishes.js';
import ShopMenuCard from '../../common-components/ShopMenuCard/ShopMenuCard.js';

import { ALL_AIRPORTS } from '../../constants/AiportList.js'


const Shop = ({ ticketSearchFormData, setTicketSearchFormData, loadUserData, userData, cartItems, loadCartDataForHeader }) => {
  const { isLoggedIn, login, logout } = useContext(UserContext);
  let navigate = useNavigate();
  const [data, setData] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize, selectPageSize] = useState(12);
  const [sortingOrder, selectSortingOrder] = useState("newest")
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({})


  const [airportOptions, setAirportOptions] = useState([]);
  const [originQuery, setOriginQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);



  const [wishList, setWishList] = useState([]);

  const [isLoginPopupShown, showLoginPopup] = useState(false)

  const [isRestaurantOpened, setIsRestaurantOpened] = useState(false);

  const [filters, setFilters] = useState({

  });

  const [mainFilterOpen, setMainFiterOpen] = useState(false)
  const [catPopupOpen, setCatPopupOpen] = useState(false)


  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  useEffect(() => {
    if (window.innerWidth > 992) {
      setMainFiterOpen(true)
    }
    else {
      setMainFiterOpen(false)
    }
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
    const data = searchAirports(value);
    setAirportOptions(data);
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestinationQuery(value);
    setShowDestinationDropdown(true);
    const data = searchAirports(value);
    setAirportOptions(data);
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



  const validateForm = (data) => {
    const errors = {};

    if (!data.origin) errors.origin = 'Origin is required';
    if (!data.destination) errors.destination = 'Destination is required';
    if (!data.departure_date) errors.departure_date = 'Departure date is required';
    if (!data.adult || data.adult < 1) errors.adult = 'At least one adult is required';
    return errors;
  }

  const loadData = async () => {

    let errors = validateForm(ticketSearchFormData)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    setFormErrors({});
    try {
      const response = await API.post('/api/search/', ticketSearchFormData);
      setData(response.data);
    } catch (err) {
      console.error(err);
      setFormErrors({ search: 'Search failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [ticketSearchFormData]);

  useEffect(() => {
console.log("data", data)
  }, [data]);



















  return (
    <div className='shop-page'>
      <section className="banner">
        <div className="inner">
          <h2>Find Your Ticket</h2>
          <ol className='breadcrumb' aria-label="breadcrumb">
            <li className="breadcrumb-item">
              <a onClick={() => navigate('/')}><i className="ri-home-line"></i>Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Ticket Item Listing
            </li>
          </ol>
        </div>
      </section>

      <section className="sec-2">


        {/* {isRestaurantOpened ?
          <div className='shop-opened-or-closed-container opened'>
            <div className='icon'>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20Z" fill="#00B74A" />
                <path d="M12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6ZM12 10C11.4477 10 11 9.55228 11 9C11 8.44772 11.4477 8 12 8C12.5523 8 13 8.44772 13 9C13 9.55228 12.5523 10 12 10Z" fill="#00B74A" />
                <path d="M12 14C10.3431 14 9 15.3431 9 17C9 18.6569 10.3431 20 12 20C13.6569 20 15 18.6569 15 17C15 15.3431 13.6569 14 12 14ZM12 18C11.4477 18 11 17.5523 11 17C11 16.4477 11.4477 16 12 16C12.5523 16 13 16.4477 13 17C13 17.5523 12.5523 18 12 18Z" fill="#00B74A" />
              </svg>
            </div>
            <div className='text'>
              WE ARE OPEN NOW!
              <br />
              <span>Order your favourite dishes!!</span></div>

          </div>
          :
          <div className='shop-opened-or-closed-container closed'>
            <div className='icon'>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="7" y="14" width="18" height="12" rx="3" fill="#F93154" />
                <rect x="11" y="10" width="10" height="8" rx="5" stroke="#F93154" strokeWidth="2" fill="none" />
                <circle cx="16" cy="21" r="2" fill="white" />
                <rect x="15" y="21" width="2" height="4" rx="1" fill="white" />
              </svg>
            </div>
            <div className='text'>
              Sorry, we are currently closed for delivery and pickup.
              <br />
              Please check back on next opening time.
              <br />
              <span>You can still browse in our delicious menu and make a plan for our next opening time</span>
            </div>
          </div>

        } */}







        <div className="form-container">
          <form >

            <div className="form-row">

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
            
              <div className="form-group">
                <label>Adult</label>
                <input type="number" name="adult" min="1" value={ticketSearchFormData.adult} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Child</label>
                <input type="number" name="child" min="0" value={ticketSearchFormData.child} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Infant</label>
                <input type="number" name="infant" min="0" value={ticketSearchFormData.infant} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Airline Code </label>
                <input type="text" name="airline_code" placeholder='(optional)' value={ticketSearchFormData.airline_code} onChange={handleChange} />
              </div>
              <button type="button" disabled={isLoading} onClick={loadData}>
                {isLoading ? 'Searching...' : 'Search Flights'}
              </button>
            </div>
            {formErrors.search && <p className="error">{formErrors.search}</p>}
          </form>
        </div>


        <div className="title-bar">
          <h2>{filters.search_key && `Result for :"${filters.search_key}"`}</h2>

          <button onClick={() => setMainFiterOpen(!mainFilterOpen)}
            className={`filter-btn ${mainFilterOpen && 'active'}`}>
            Filters
          </button>

          <div className="sort-tab" id="Tab" role="tablist">
            {/* =========  SORT KEYS  ========== */}

            <button className={` tab-button ${filters.sort_by === 'new' ? 'active' : ''}`}
              onClick={() => setFilters(prevFilters => ({
                ...prevFilters,
                sort_by: 'new',
              }))}>
              New
            </button>


            {/* Popular */}

            <button className={`tab-button ${filters.sort_by === 'popular' ? 'active' : ''}`}
              onClick={() => setFilters(prevFilters => ({
                ...prevFilters,
                sort_by: 'popular',
              }))}>
              Popular
            </button>

            {/* Average Cost */}

            <button className={`tab-button ${filters.sort_by === 'price' ? 'active' : ''}`}
              onClick={() => setFilters(prevFilters => ({
                ...prevFilters,
                sort_by: 'cost',
              }))}>
              Cost
            </button>

          </div>
        </div>

        <div className='main-content'>
          <div className='filter-container'>
            {mainFilterOpen &&
              <MainFilter


                filters={filters}
                setFilters={setFilters}

                setMainFiterOpen={setMainFiterOpen}

                userData={userData}
              >

              </MainFilter>
            }

          </div>

          <div className="card-container">



            {data && data?.data?.length > 0 ? (
              data.data.map((ticketItem, index) => {
                return (
                  <ShopMenuCard ticketItem={ticketItem}
                    cartItems={cartItems}
                    loadCartDataForHeader={loadCartDataForHeader}
                    data={data} setData={setData}
                    isRestaurantOpened={isRestaurantOpened}
                    loadData={loadData}
                    wishList={wishList}
                  />
                )
              }))
              : (
                !isLoading && (
                  <div className="d-flex justify-content-center align-items-center w-100" style={{ minHeight: '400px' }}>
                    <div className="text-center">
                      <img style={{ height: "180px", marginBottom: "10px" }} src="/images/icons/no-restaurant.png"></img>
                      <p style={{ fontSize: "11px", color: "grey", textDecoration: "italic", width: "300px" }}>
                        No items matches to your search and filter criteria.
                      </p>
                    </div>
                  </div>
                )
              )}


            {data &&
              <Pagination
                totalItems={data.count}
                pageSize={pageSize}
                currentPage={page}
                setCurrentPage={setPage}
                selectPageSize={selectPageSize}
              >
              </Pagination>
            }

          </div>
        </div>


        {/* Recommended Dishes */}

      </section>






      {isLoading && <FixedOverlayLoadingSpinner />}


      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => { }} />}

    </div >

  );


}

export default Shop