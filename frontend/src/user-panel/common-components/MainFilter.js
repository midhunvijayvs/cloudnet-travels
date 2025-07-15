import React, { useEffect } from "react";
import { useState } from "react";

import { useNavigate } from 'react-router-dom';
import Slider from "@mui/material/Slider";


import './MainFilter.scss';
import RatingStar from "./RatingStar/RatingStar";
const MainFilter = ({
  categoryList,
  categorySetterFunction,
  mealTimeSetterFunction,
  mealTimeList,
  cuisineList,
  cuisineSetterFunction,
  subCategorySetterFunction,
  filters,
  setFilters,
  setMainFiterOpen,
  userData

}) => {

  let navigate = useNavigate();

  const [accordionOpen, setAccordionOpen] = useState([
    false, false, false, false,
    false, false, false, false,
    false, false]);
  const [priceState, setPriceState] = useState([0, 100]);
  const [minimumOrderAmountState, setMinimumOrderAmountState] = useState([0, 100]);
  const [timeState, setTimeState] = useState([0, 200]);


  const resetFilters = () => {
    setPriceState([0, 100])
    setTimeState([0, 200])
    setMinimumOrderAmountState([0, 100])
    setFilters(prevFilters => ({
      ...prevFilters,
      category: null,
      cuisine: null,
      is_veg: null,
      open_now: null,
      gluten_free: null,
      price_range: null,
      min_order_amount_range: null,
      rating: null,
      max_distance: null,
      delivery_time: null,
      avoid_ingredients: null,
      offers: null,
      spice_level: null,
    }));
  }

  const toggleAccordion = (index) => {
    setAccordionOpen((prevOpen) => {
      const updatedOpen = [...prevOpen];
      updatedOpen[index] = !updatedOpen[index];
      return updatedOpen;
    });
  };

  const localSetPriceRange = (event, newValue) => {
    setFilters(prevFilters => ({
      ...prevFilters, // Copy the existing state object
      price_range: `${newValue[0]},${newValue[1]}`,
    }));
  }
  const localSetOrderAmountRange = (event, newValue) => {
    setFilters(prevFilters => ({
      ...prevFilters, // Copy the existing state object
      min_order_amount_range: `${newValue[0]},${newValue[1]}`,
    }));
  }


  const localSetTimeRange = (event, newValue) => {
    setFilters(prevFilters => ({
      ...prevFilters, // Copy the existing state object
      delivery_time: `${newValue[0]},${newValue[1]}`,
    }));
  }

  const localSetCategory = (id) => {
    if (filters.category == id) {
      categorySetterFunction(null)
    }
    else {
      subCategorySetterFunction(null);
      categorySetterFunction(id)
    }

  }

  const localSetMealTime = (value) => {
    if (filters.meal_time == value) {
      mealTimeSetterFunction(null)
    }
    else {
      mealTimeSetterFunction(value);
    }

  }

  const localSetCuisine = (id) => {
    if (filters.cuisine == id) {
      cuisineSetterFunction(null)
    }
    else {
      cuisineSetterFunction(id)
    }

  }
  const toggleFilter = (key, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: prevFilters[key] === value ? null : value,
    }));
  };

  const localSetDistance = (direction) => {
    if (direction === "plus") {
      if (filters.max_distance == null) {
        setFilters(prevFilters => ({
          ...prevFilters, // Copy the existing state object
          max_distance: 1,
        }));
      }
      else {
        setFilters(prevFilters => ({
          ...prevFilters, // Copy the existing state object
          max_distance: parseInt(filters.max_distance) + 1,
        }));
      }
    }
    else {
      if (filters.max_distance == null) {
      }
      else if (filters.max_distance == 1) {
        setFilters(prevFilters => ({
          ...prevFilters, // Copy the existing state object
          max_distance: null,
        }));
      }
      else {
        setFilters(prevFilters => ({
          ...prevFilters, // Copy the existing state object
          max_distance: parseInt(filters.max_distance) - 1,
        }));
      }
    }
  }

  const localSetIngredient = (ingredient) => {
    setFilters((prevFilters) => {
      const currentIngredients = prevFilters.avoid_ingredients || [];
      const updatedIngredients = currentIngredients.includes(ingredient)
        ? currentIngredients.filter((item) => item !== ingredient)
        : [...currentIngredients, ingredient];

      return { ...prevFilters, avoid_ingredients: updatedIngredients };
    });
  };



  return (
    <div className="main-filter">
      <div className="reset-btn" onClick={resetFilters}>
        Reset Filters
      </div>
      <div className="filter-box">
        {window.innerWidth < 992 &&
          <button onClick={() => setMainFiterOpen(false)} className="btn btn-borderless close-button d-lg-none"><svg width="44" height="45" viewBox="0 0 44 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="22.0806" cy="22.1475" rx="16.125" ry="16.5" stroke="#33363F" stroke-width="2" />
            <path d="M16.7056 27.6467L27.4556 16.6467" stroke="#33363F" stroke-width="2" />
            <path d="M27.4556 27.6475L16.7056 16.6475" stroke="#33363F" stroke-width="2" />
          </svg>
          </button>
        }
        {/* Checkboxes */}
       
            <div className="accordion-sub-div">
              <input className="form-check-input" type="checkbox" value="" id={`pure-veg`} checked={filters.is_veg === 'True'}
                onChange={(e) => setFilters({ ...filters, is_veg: e.target.checked ? 'True' : null })} ></input>
              <span className="form-check-label" htmlFor={`pure-veg`}>
             Economy
              </span>
            </div>
         
            <div className="accordion-sub-div">
              <input className="form-check-input" type="checkbox" value="" id={`alcohol`} checked={filters.is_alcohol === 'True'}
                onChange={(e) => setFilters({ ...filters, is_alcohol: e.target.checked ? 'True' : null, selling_alcohol: e.target.checked ? 'True' : null })} ></input>
              <span className="form-check-label" htmlFor={`alcohol`}>
                Business Class
              </span>
            </div>
         
        {/* <div className="accordion-sub-div">
          <input className="form-check-input" type="checkbox" value="" id={`open-now`} checked={filters.open_now === 'True'}
            onChange={(e) => setFilters({ ...filters, open_now: e.target.checked ? 'True' : null })} ></input>
          <span className="form-check-label" htmlFor={`open-now`}>
            Open Now
          </span>
        </div> */}
       
            <div className="accordion-sub-div">
              <input className="form-check-input" type="checkbox" value="" id={`gluten-free`} checked={filters.gluten_free === 'True'}
                onChange={(e) => setFilters({ ...filters, gluten_free: e.target.checked ? 'True' : null })} ></input>
              <span className="form-check-label" htmlFor={`gluten-free`}>
               Offer
              </span>
            </div>
          
        {/* price range - 0 */}
        <div className="accordion">
          <button className="btn accordion-btn" onClick={() => toggleAccordion(0)}>
            Average Price
            <img src="/images/filters/down-arrow.svg" alt="arrow" />
          </button>

          {accordionOpen[0] && (<div className="accordion-body">
            <Slider
              sx={{
                '& .MuiSlider-thumb': {
                  color: "#004938"
                },
                '& .MuiSlider-track': {
                  color: "#004938"
                },
                '& .MuiSlider-rail': {
                  color: "#555555"
                },
                '& .MuiSlider-active': {
                  color: "green"
                }
              }}
              value={priceState}
              onChange={(event, newValue) => setPriceState(newValue)}
              onChangeCommitted={localSetPriceRange}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `£${value}`} />
            <p className="price-result">The selected Price range is £{priceState[0]} to {priceState[1]}</p>
          </div>)}
        </div>

        {/* Ingredients - 7 */}
        
            <div className="accordion">
              <button className="btn accordion-btn ellipsis" onClick={() => toggleAccordion(7)}>
             Date
                <img src="/images/filters/down-arrow.svg" alt="arrow" />
              </button>

              {accordionOpen[7] && (<div className="accordion-body ">
                {['Sugar', 'Salt', 'Egg'].map((item, i) => (
                  <div className="form-check" key={i}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`ingredient-${i}`}
                      checked={filters.avoid_ingredients?.includes(item) || false}
                      onChange={() => localSetIngredient(item)}
                    />
                    <label className="form-check-label" htmlFor={`ingredient-${i}`}>
                      {item}
                    </label>
                  </div>
                ))}
              </div>)}
            </div>
         

        {/* MealTime - 10 */}
       
            <div className="accordion">
              <button className="btn accordion-btn ellipsis" onClick={() => toggleAccordion(10)}>
              Type
                <img src="/images/filters/down-arrow.svg" alt="arrow" />
                {filters.meal_time &&
                  <span className="filtered-txt">{mealTimeList && mealTimeList.find(item => item.value === filters.meal_time).label}</span>
                }
              </button>

              {accordionOpen[10] && (<div className="accordion-body">
                {mealTimeList && mealTimeList.map((item, i) => {
                  return (
                    <div className="form-check" key={i}>
                      <input className="form-check-input" type="checkbox" value="" id={`mealtime-${i}`} onChange={() => localSetMealTime(item.value)} checked={item.value === filters.meal_time}></input>
                      <label className="form-check-label" htmlFor={`mealtime-${i}`}>
                        {item.label}
                      </label>
                    </div>
                  )
                })}
              </div>)}
            </div>
         

        {/* categories - 1 */}
        <div className="accordion">
          <button className="btn accordion-btn ellipsis" onClick={() => toggleAccordion(1)}>
            Categories
            <img src="/images/filters/down-arrow.svg" alt="arrow" />
            {filters.category &&
              <span className="filtered-txt">{categoryList && categoryList.find(item => item.id === filters.category).name}</span>
            }
          </button>

          {accordionOpen[1] && (<div className="accordion-body long">
            {categoryList && categoryList.map((item, i) => {
              return (
                <div className="form-check" key={i}>
                  <input className="form-check-input" type="checkbox" value="" id={`category-${i}`} onChange={() => localSetCategory(item.id)} checked={item.id === filters.category}></input>
                  <label className="form-check-label" htmlFor={`category-${i}`}>
                    {item.name}
                  </label>
                </div>
              )
            })}
          </div>)}
        </div>
        {/* cuisine - 2 */}
       
            <div className="accordion">
              <button className="btn accordion-btn ellipsis" onClick={() => toggleAccordion(2)}>
                Airline
                <img src="/images/filters/down-arrow.svg" alt="arrow" />
                {filters.cuisine &&
                  <span className="filtered-txt">{cuisineList.find(item => item.id === filters.cuisine).name}</span>
                }
              </button>

              {accordionOpen[2] && (<div className="accordion-body long">
                {cuisineList && cuisineList.map((item, i) => {
                  return (
                    <div className="form-check" key={i}>
                      <input className="form-check-input" type="checkbox" value="" id={`cuisine-${i}`} onChange={() => localSetCuisine(item.id)} checked={item.id === filters.cuisine}></input>
                      <label className="form-check-label" htmlFor={`cuisine-${i}`}>
                        {item.name}
                      </label>
                    </div>
                  )
                })}
              </div>)}
            </div>
        


        {/* Rating - 3 */}
        {/* <div className="accordion">
          <button className="btn accordion-btn ellipsis" onClick={() => toggleAccordion(3)}>
            Rating
            <img src="/images/filters/down-arrow.svg" alt="arrow" />
            {filters.rating &&
              <span className="filtered-txt">

              </span>
            }
          </button>

          {accordionOpen[3] && (<div className="accordion-body">
            {[4, 3, 2, 1].map((rating, i) => {
              return (
                <div className="form-check" key={i}>
                  <input className="form-check-input" type="checkbox"
                    value="" id={`star-${i}`}
                    onChange={() => toggleFilter('rating', rating)} checked={rating === filters.rating}
                  />
                  <label className="form-check-label rating" htmlFor={`star-${i}`}>
                    <RatingStar rating={rating} /> & Up
                  </label>
                </div>
              )
            })}
          </div>)}
        </div> */}

        {/* Distance - 4 */}
        {/* <div className="accordion">
          <button className="btn accordion-btn" onClick={() => toggleAccordion(4)}>
            Distance (miles)
            <img src="/images/filters/down-arrow.svg" alt="arrow" />
          </button>

          {accordionOpen[4] && (<div className="accordion-body">
            <div className="quantity-filter">
              <button onClick={() => localSetDistance("minus")}><svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="13.0527" cy="13.0529" r="9.78951" stroke="#f2a93e" stroke-width="0.802893" />
                <path d="M16.3159 13.0525L9.78958 13.0525" stroke="#f2a93e" stroke-width="0.802893" stroke-linecap="square" />
              </svg>
              </button>
              <input className="form-control" value={filters.max_distance ? filters.max_distance : ""} onChange={(e) => {
                setFilters(prevFilters => ({
                  ...prevFilters, // Copy the existing state object
                  max_distance: e.target.value,
                }));
              }}></input>

              <button onClick={() => localSetDistance("plus")}>
                <svg width="28" height="27" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="13.9638" cy="13.0529" r="9.78951" stroke="#f2a93e" stroke-width="0.802893" />
                  <path d="M13.9639 16.3159L13.9639 9.78958" stroke="#f2a93e" stroke-width="0.802893" stroke-linecap="square" />
                  <path d="M17.2271 13.0525L10.7007 13.0525" stroke="#f2a93e" stroke-width="0.802893" stroke-linecap="square" />
                </svg>

              </button>
            </div>
          </div>)}
        </div> */}

        {/* Delivery Time - 5 */}
        {/* <div className="accordion">
          <button className="btn accordion-btn" onClick={() => toggleAccordion(5)}>
            Delivery Time
            <img src="/images/filters/down-arrow.svg" alt="arrow" />
          </button>

          {accordionOpen[5] && (<div className="accordion-body">
            <Slider
              sx={{
                '& .MuiSlider-thumb': {
                  color: "#004938"
                },
                '& .MuiSlider-track': {
                  color: "#004938"
                },
                '& .MuiSlider-rail': {
                  color: "#555555"
                },
                '& .MuiSlider-active': {
                  color: "green"
                }
              }}
              value={timeState}
              min={0}
              max={200}
              onChange={(event, newValue) => setTimeState(newValue)}
              onChangeCommitted={localSetTimeRange}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value} min`} />
            <p className="price-result">The selected time range is {timeState[0]}min to {timeState[1]}mins</p>
          </div>)}
        </div> */}

        {/* Minimum order amount - 6 */}
        {/* <div className="accordion">
          <button className="btn accordion-btn" onClick={() => toggleAccordion(6)}>
            Minimum Order Amount
            <img src="/images/filters/down-arrow.svg" alt="arrow" />
          </button>

          {accordionOpen[6] && (<div className="accordion-body">
            <Slider
              sx={{
                '& .MuiSlider-thumb': {
                  color: "#004938"
                },
                '& .MuiSlider-track': {
                  color: "#004938"
                },
                '& .MuiSlider-rail': {
                  color: "#555555"
                },
                '& .MuiSlider-active': {
                  color: "green"
                }
              }}
              value={minimumOrderAmountState}
              onChange={(event, newValue) => setMinimumOrderAmountState(newValue)}
              onChangeCommitted={localSetOrderAmountRange}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `£${value}`} />
            <p className="price-result">The selected Minumum order amount is £{minimumOrderAmountState[0]} to {minimumOrderAmountState[1]}</p>
          </div>)}
        </div> */}

        {/* Offers - 8 */}
        {/* <div className="accordion">
          <button className="btn accordion-btn ellipsis" onClick={() => toggleAccordion(8)}>
            Discount & Offers
            <img src="/images/filters/down-arrow.svg" alt="arrow" />
            
          </button>

          {accordionOpen[8] && (<div className="accordion-body">
            {[
              { label: '10% Off', value: '10%' },
              { label: '20% Off', value: '20%' },
              { label: '30% Off', value: '30%' },
              { label: '40% Off', value: '40%' },
              { label: 'By One Get One', value: 'buy_one_get_one' },
            ].map((item, i) => {
              return (
                <div className="form-check" key={i}>
                  <input className="form-check-input" type="checkbox"
                    value="" id={`offer-${i}`}
                    onChange={() => toggleFilter('offers', item.value)} checked={item.value === filters.offers}
                  />
                  <label className="form-check-label rating" htmlFor={`offer-${i}`}>
                    {item.label}
                  </label>
                </div>
              )
            })}
          </div>)}
        </div> */}
        {/* Spiciness - 9 */}
       
          <div className="accordion">
            <button className="btn accordion-btn ellipsis" onClick={() => toggleAccordion(9)}>
              No of Passengers
              <img src="/images/filters/down-arrow.svg" alt="arrow" />
              {/* {filters.rating &&
              <span className="filtered-txt">

              </span>
            } */}
            </button>

            {accordionOpen[9] && (<div className="accordion-body">
              {[
                "mild",
                "medium",
                "spicy",
              ].map((item, i) => {
                return (
                  <div className="form-check" key={i}>
                    <input className="form-check-input" type="checkbox"
                      value="" id={`spice_level-${i}`}
                      onChange={() => toggleFilter('spice_level', item)} checked={item === filters.spice_level}
                    />
                    <label className="form-check-label spice-level" htmlFor={`spice_level-${i}`}>
                      {item}
                    </label>
                  </div>
                )
              })}
            </div>)}
          </div>
       
      </div>
    </div>



  )
}

export default MainFilter;