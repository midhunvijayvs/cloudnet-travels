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


const Shop = ({ ticketSearchFormData, setTicketSearchFormData, loadUserData, userData, cartItems, loadCartDataForHeader ,originQuery, setOriginQuery,destinationQuery, setDestinationQuery }) => {
  const { isLoggedIn, login, logout } = useContext(UserContext);
  let navigate = useNavigate();
  const [data, setData] = useState({data:[{airline:"indigo",
    flight_number:"766767",
    origin:"DEL",
    destination:"BOM",
    flight_route:"DUBAI",
    departure_date:"2025/11/11",
    departure_time:"12:30",
    price:"6345.00",
    }]});

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
  
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

const [highlightedOriginIndex, setHighlightedOriginIndex] = useState(-1);
const [highlightedDestinationIndex, setHighlightedDestinationIndex] = useState(-1);


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




  useEffect(() => {
    console.log("formErrors;",formErrors)
  }, [formErrors])
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
     setHighlightedOriginIndex(-1);
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestinationQuery(value);
    setShowDestinationDropdown(true);
    const data = searchAirports(value);
    setAirportOptions(data);
 setHighlightedDestinationIndex(-1); };

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

 //for keyboard selection bolow 2 functions

  const handleOriginKeyDown = (e) => {
  if (!showOriginDropdown || airportOptions.length === 0) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    setHighlightedOriginIndex((prev) => (prev + 1) % airportOptions.length);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    setHighlightedOriginIndex((prev) =>
      prev <= 0 ? airportOptions.length - 1 : prev - 1
    );
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (highlightedOriginIndex >= 0) {
      handleOriginSelect(airportOptions[highlightedOriginIndex]);
    }
  }
};

const handleDestinationKeyDown = (e) => {
  if (!showDestinationDropdown || airportOptions.length === 0) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    setHighlightedDestinationIndex((prev) => (prev + 1) % airportOptions.length);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    setHighlightedDestinationIndex((prev) =>
      prev <= 0 ? airportOptions.length - 1 : prev - 1
    );
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (highlightedDestinationIndex >= 0) {
      handleDestinationSelect(airportOptions[highlightedDestinationIndex]);
    }
  }
};


  const validateForm = (data) => {
    const errors = {};

    if (!data.origin) errors.origin = 'Origin is required';
    if (!data.destination) errors.destination = 'Destination is required';
    if (!data.departure_date) errors.departure_date = 'Departure date is required';
    if (!data.adult || data.adult < 1) errors.adult = 'At least one adult is required';
    //  prevent same origin and destination
  if (data.origin && data.destination && data.origin === data.destination) {
    errors.destination = 'Origin and destination cannot be the same';
  }
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
      const response = await API.post('/api/airiq/search/', ticketSearchFormData);
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











const handlePreviousDay = () => {
  if (!ticketSearchFormData.departure_date) return;

  const currentDate = new Date(ticketSearchFormData.departure_date);
  currentDate.setDate(currentDate.getDate() - 1);

  const newDate = currentDate.toISOString().split('T')[0];

  setTicketSearchFormData(prev => ({ ...prev, departure_date: newDate }));
};

const handleNextDay = () => {
  if (!ticketSearchFormData.departure_date) return;

  const currentDate = new Date(ticketSearchFormData.departure_date);
  currentDate.setDate(currentDate.getDate() + 1);

  const newDate = currentDate.toISOString().split('T')[0];

  setTicketSearchFormData(prev => ({ ...prev, departure_date: newDate }));
};







  return (
    <div className='shop-page'>
      <section className="banner">
        <div className="inner">
          <h2>Search Result</h2>
          <ol className='breadcrumb' aria-label="breadcrumb">
            <li className="breadcrumb-item">
              <a onClick={() => navigate('/')}><i className="ri-home-line"></i>Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Flight Search Result
            </li>
          </ol>
        </div>
      </section>

      <section className="sec-2">


        <div className="form-container">
          <form >

            <div className="form-row">

              <div className="form-group">
                <label>Origin</label>
                <input
                  type="text"
                  value={originQuery}
                  onChange={handleOriginChange}
                  onKeyDown={handleOriginKeyDown}
                  required
                />
                {showOriginDropdown && (
                  <ul className="dropdown-list">
                    {airportOptions.map((a, index) => (
                      <li key={index} 
                      onClick={() => handleOriginSelect(a)}
                        className={index === highlightedOriginIndex ? "highlighted" : ""}
                        >
                        {a.name} - {a.code}
                      </li>
                    ))}
                  </ul>
                )}
               
              </div>


              <div className="form-group">
                <label>Destination</label>
                <input
                  type="text"
                  value={destinationQuery}
                  onChange={handleDestinationChange}
                  onKeyDown={handleDestinationKeyDown}
                  required
                />
                {showDestinationDropdown && (
                  <ul className="dropdown-list">
                    {airportOptions.map((a, index) => (
                      <li key={index}
                       onClick={() => handleDestinationSelect(a)}
                        className={index === highlightedDestinationIndex ? "highlighted" : ""}
                        >
                        {a.name} - {a.code}
                      </li>
                    ))}
                  </ul>
                )}
              </div>


              <div className="form-group date-group">
  <label>Departure Date</label>
  <div className="date-controls">
    <button type="button" className="date-btn" onClick={handlePreviousDay}>
      ◀ Prev
    </button>
    <input
      type="date"
      name="departure_date"
      value={ticketSearchFormData.departure_date}
      onChange={handleChange}
      required
    />
    <button type="button" className="date-btn" onClick={handleNextDay}>
      Next ▶
    </button>
  </div>
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
                {formErrors.origin && <p className="error">{formErrors.origin}</p>}
                {formErrors.destination && <p className="error">{formErrors.destination}</p>}
                {formErrors.adult && <p className="error">{formErrors.adult}</p>}

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