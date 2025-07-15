import React, { useEffect, useState } from 'react'


import { useNavigate } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import ErrorModal from "../../../ErrorModal.js";
import PositiveModal from "../../../PositiveModal.js";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner.js"
import $, { error } from 'jquery';

import API from '../../../API.js';
import './CheckoutOptions.scss'
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import ProcessFlowIllustrationForCheckout from '../../common-components/ProcessFlowIllustrationForCheckout/ProcessFlowIllustrationForCheckout.js'
import MiniBanner from '../../common-components/MiniBanner/MiniBanner.js'

const CheckoutOptions = ({ userData, loadUserData }) => {
  const navigate = useNavigate();

  const [tabSelected, selectTab] = useState(0);

  const [message, setMessage] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState({});
  const [orderId, setOrderId] = useState(null);
  const [isOrderPlacedPopupShown, showOrderPlacedPopup] = useState(false)
  const [orderPlacedResponse, setOrderPlacedResponse] = useState(null);
  const [formErrors, setFormErrors] = useState({});


  const [formData, setFormData] = useState({
    cooking_instructions: "",
    delivery_instructions: "",
    is_pickup: false,
    is_contactless_delivery: false,
    user_pickup_request_date: null,
    user_pickup_request_time: null,
    is_pickup_time_required: false,
    is_scheduled_delivery: false,
    user_scheduled_delivery_request_date: null,
    user_scheduled_delivery_request_time: null,
    tip: null,
    is_priority_delivery: false
  });

  const [cookingInstructionTemplates, setCookingInstructionTemplates] = useState([
    "No salt, please",
    "Extra spicy",
    "No onions",
    "Please make it vegan",
    "Gluten-free, please",
  ]);
  const [deliveryInstructionTemplates, setDeliveryInstructionTemplates] = useState([
    "Leave at the front door",
    "Ring the bell",
    "Call me upon arrival",
    "Leave with the concierge",
    "Leave at the back door",
    "Deliver to the neighbor if not home",
  ]);
  const [tipSuggestions, setTipSuggestions] = useState([1, 2, 3, 4, 5]);

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])


  useEffect(() => {
    const fetchCustomizationNotes = async () => {
      try {
        const allTemplates = new Set();
        for (let item of orderData.items) {
          const response = await API.get(`restaurants/customization_notes/?menu_item=${item.menu_item}`);
          const templates = response.data.results.map(note => note.description);
          templates.forEach(template => allTemplates.add(`${item.menu_item_detail.name}: ${template}`));
        }
        setCookingInstructionTemplates([...allTemplates]);
      } catch (error) {
        console.error("Error fetching customization notes:", error);
      }
    };

    fetchCustomizationNotes();
  }, [orderData]);


  useEffect(() => {
    // Retrieve the response data from localStorage
    const responseData = localStorage.getItem('createOrderResponseData');
    if (responseData) {
      const ResponseOrderData = JSON.parse(responseData);
      setOrderData(ResponseOrderData);
      const optionsObject = {
        cooking_instructions: userData?.cooking_instruction || ResponseOrderData.cooking_instructions,
        delivery_instructions: userData?.primary_address?.delivery_instruction || ResponseOrderData.delivery_instructions,
        is_pickup: ResponseOrderData.is_pickup,
        is_contactless_delivery: ResponseOrderData.is_contactless_delivery,
        user_pickup_request_date: ResponseOrderData.user_pickup_request_date,
        user_pickup_request_time: ResponseOrderData.user_pickup_request_time,
        is_pickup_time_required: !!(ResponseOrderData.user_pickup_request_date && ResponseOrderData.user_pickup_request_time),

        is_scheduled_delivery: ResponseOrderData.is_scheduled_delivery,
        user_scheduled_delivery_request_date: ResponseOrderData.user_scheduled_delivery_request_date,
        user_scheduled_delivery_request_time: ResponseOrderData.user_scheduled_delivery_request_time,

        tip: ResponseOrderData.tip,
        delivery_charge: ResponseOrderData.delivery_charge,
        is_priority_delivery: ResponseOrderData.is_priority_delivery,
      };
      setFormData(optionsObject);
    }
  }, []);


  const handleTextareaChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  // instruction templates
  const handleTemplateClick = (template, type) => {
    setFormData((prevData) => ({
      ...prevData,
      [type]: prevData[type]
        ? `${prevData[type]}\n${template}`
        : template
    }));
  };

  const handleTipChange = (event) => {
    const { name, value } = event.target;
    // Regular expression to allow only digits
    const onlyNumbers = /^[0-9]*$/;

    // Check if the value matches the regular expression
    if (onlyNumbers.test(value)) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };
  // tip-suggestion click
  const handleTipSuggestionClick = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      tip: value
    }));
  };


  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked
    }));
  };

  // package
  const handlePackageCheckboxChange = (e) => {
    const { name, value, checked } = e.target;

    // Determine the new state value
    const newValue = checked ? (value === 'true') : null;

    setFormData(prevState => ({
      ...prevState,
      [name]: newValue
    }));
  };

  // pickup-time
  const handleTimeChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleDateChange = (key, date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setFormData((prevData) => ({
      ...prevData,
      [key]: formattedDate
    }));
  };

  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    return days[today];
  };
  const getWorkingHoursForToday = () => {
    if (
      !orderData ||
      !orderData.items ||
      orderData.items.length === 0 ||
      !orderData.items[0].restaurant_name ||
      !orderData.items[0].restaurant_name.working_hours
    ) {
      return null;
    }

    const currentDay = getCurrentDay();
    const workingHours = orderData.items[0].restaurant_name.working_hours;
    const todayHours = workingHours.find(hour => hour.day === currentDay);
    return todayHours || {};
  };
  const formatTimeTo12Hour = (time) => {
    if (time) {
      const [hour, minute, second] = time.split(':');
      let hourInt = parseInt(hour);
      const ampm = hourInt >= 12 ? 'PM' : 'AM';
      hourInt = hourInt % 12 || 12; // Convert '0' to '12' for midnight/midday
      return `${hourInt}:${minute} ${ampm}`;
    }
  };

  const todayHours = getWorkingHoursForToday();

  // validate Form
  const validateForm = (data) => {
    let errors = {}
    if (data.is_pickup_time_required) {
      const today = new Date();
      const pickupDate = new Date(data.user_pickup_request_date);
      if (!data.user_pickup_request_date) {
        errors.pickup_date = 'Required'
      } else if (pickupDate < today.setHours(0, 0, 0, 0)) {
        errors.pickup_date = 'Date cannot be in the past';
      }

      if (!data.user_pickup_request_time) {
        errors.pickup_time = 'Required'
      } else {
        const currentDateTime = new Date();
        const pickupDateTime = new Date(`${data.user_pickup_request_date}T${data.user_pickup_request_time}`);
        const thirtyMinutesFromNow = new Date(currentDateTime.getTime() + 30 * 60 * 1000);

        if (pickupDateTime < thirtyMinutesFromNow) {
          errors.pickup_time = 'Time must be at least 30 minutes from now';
        }
      }
    }
    if (data.is_scheduled_delivery) {
      const today = new Date();
      const scheduledDate = new Date(data.user_scheduled_delivery_request_date);
      if (!data.user_scheduled_delivery_request_date) {
        errors.scheduled_date = 'Required'
      } else if (scheduledDate < today.setHours(0, 0, 0, 0)) {
        errors.scheduled_date = 'Date cannot be in the past';
      }

      if (!data.user_scheduled_delivery_request_time) {
        errors.scheduled_time = 'Required'
      }
    }

    setFormErrors(errors)
    return errors
  }
  const handleSubmit = () => {
    const validationErrors = validateForm(formData);
    // remove delivery_instructions, tip, contactless delivery
    const formDataToSubmit = { ...formData };
    // // set applied discounts to default
    // formDataToSubmit.is_credit_balance_used = false;
    // formDataToSubmit.credit_balance_used = 0;
    // formDataToSubmit.coupon = null;
    // formDataToSubmit.coupon_discount_applied_pounds = 0;
    // formDataToSubmit.is_gift_card_used = false;
    // formDataToSubmit.gift_card_amount = 0;
    // formDataToSubmit.is_wallet_used = false;
    // formDataToSubmit.wallet_amount_used = 0;

    if (formDataToSubmit.is_pickup) {
      delete formDataToSubmit.is_contactless_delivery;
      delete formDataToSubmit.delivery_instructions;
      delete formDataToSubmit.tip;
    }
    // toggling pickup option
    else {
      const deliveryCharge = localStorage.getItem("createOrderDeliveryCharge");
      if (deliveryCharge && parseFloat(deliveryCharge) > 0) {
        formDataToSubmit.delivery_charge = parseFloat(deliveryCharge);
      }
    }

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      API.put(`/order/orders/${orderData.id}/`, formDataToSubmit)
        .then(response => {
          setIsLoading(false);
          localStorage.setItem("createOrderResponseData", JSON.stringify(response.data))
          localStorage.setItem("createOrderResponse_order_id", response.data.id)
          localStorage.setItem("createOrderResponse_total", response.data.total_amount)
          navigate('/checkout-payment');
        }
        )
        .catch(error => {
          setMessage(error.response?.data?.message || error.message)
          setIsErrorModalOpen(true)
          setIsLoading(false)
        });
    }
  }

  return (
    <div className='checkout-options-page'>


      <MiniBanner title="Checkout Options" breadcrumb={[{ name: "Home", link: "/" }, { name: "Checkout Options", link:"/" }]}></MiniBanner>

      <section className="sec-2">

        <div className="lhs">

          <ProcessFlowIllustrationForCheckout currentState={1}></ProcessFlowIllustrationForCheckout>
        
          <div className="options-section">
            {/* schedule delivery */}
            <div className="payment-list-box flex-column">
              <div className="form-check ps-0 w-100">
                <div className='d-flex align-items-center'>
                  <input className="form-check-input" type="checkbox" id='is_scheduled_delivery'
                    checked={formData.is_scheduled_delivery} name="is_scheduled_delivery" onChange={handleCheckboxChange}>
                  </input>
                  <label className="form-check form-check-reverse ms-2" for="is_scheduled_delivery">
                    Choose if you want to schedule your delivery
                  </label>
                </div>
              </div>
              {
                formData.is_scheduled_delivery &&
                <div className='d-flex w-100 mt-2 addon-form align-items-center'>
                  <div className="me-2 d-flex flex-column">
                    <label htmlFor="scheduledDate" className="form-label">Scheduled Date</label>

                    <DatePicker
                      selected={formData.user_scheduled_delivery_request_date}
                      onChange={(date) => handleDateChange("user_scheduled_delivery_request_date", date)}
                      className="form-control"
                      minDate={new Date()}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Scheduled Date"
                    />
                    {formErrors.scheduled_date && <div className="invalid-feedback m-0 mb-1  position-relative">{formErrors.scheduled_date}</div>}
                  </div>
                  <div className=''>
                    <label htmlFor="scheduledTime" className="form-label">Scheduled Time</label>
                    <input
                      type="time"
                      id="scheduledTime"
                      name="user_scheduled_delivery_request_time"
                      className="form-control"
                      value={formData.user_scheduled_delivery_request_time}
                      onChange={handleTimeChange}
                    />
                    {formErrors.scheduled_time && <div className="invalid-feedback m-0 mb-1  position-relative">{formErrors.scheduled_time}</div>}
                  </div>
                </div>
              }
            </div>
            {/* pickup */}
            <div className="payment-list-box flex-column">
              <div className="form-check ps-0 w-100">
                <div className='d-flex align-items-center'>
                  <input className="form-check-input" type="checkbox" id='is_pickup'
                    checked={formData.is_pickup} name="is_pickup" onChange={handleCheckboxChange}>
                  </input>
                  <label className="form-check form-check-reverse ms-2" for="is_pickup">
                    Choose if you want to pick up your order
                  </label>
                </div>
              </div>
              {formData.is_pickup && !formData.is_scheduled_delivery && (
                <div className="form-group mt-2">
                  <p className='pickup-text '>
                    <div className='d-flex align-items-center'>
                      <input className="custom-checkbox m-0 me-2" type="checkbox"
                        checked={formData.is_pickup_time_required} name="is_pickup_time_required" onChange={handleCheckboxChange}
                      ></input>
                      <span className='main-text m-0'>Choose a pickup time for your convenience? </span>
                    </div>
                    Please note that the pickup time may vary depending on restaurant availability and other factors.

                    <br></br>
                    {todayHours ? (
                      <span>
                        ( Opening Time: {formatTimeTo12Hour(todayHours.opening_time)} &nbsp;
                        Closing Time: {formatTimeTo12Hour(todayHours.closing_time)} )
                      </span>
                    ) : (
                      <span>(No opening hours available for today.)</span>
                    )}
                  </p>
                  {
                    formData.is_pickup_time_required &&
                    <div className='d-flex w-100 addon-form align-items-center'>
                      <div className="mx-2 d-flex flex-column">
                        <label htmlFor="pickupDate" className="form-label">Pickup Date</label>
                        <DatePicker
                          selected={formData.user_pickup_request_date}
                          onChange={(date) => handleDateChange("user_pickup_request_date", date)}
                          className="form-control"
                          minDate={new Date()}
                          dateFormat="yyyy-MM-dd"
                          placeholderText="Pickup Date"
                        />
                        {formErrors.pickup_date && <div className="invalid-feedback m-0 mb-1  position-relative">{formErrors.pickup_date}</div>}
                      </div>
                      <div className=''>
                        <label htmlFor="pickupTime" className="form-label">Pickup Time</label>
                        <input
                          type="time"
                          id="pickupTime"
                          name="user_pickup_request_time"
                          className="form-control"
                          value={formData.user_pickup_request_time}
                          onChange={handleTimeChange}
                        />
                        {formErrors.pickup_time && <div className="invalid-feedback m-0 mb-1  position-relative">{formErrors.pickup_time}</div>}
                      </div>
                    </div>
                  }

                </div>
              )}
            </div>



            {/* contactless delivery */}
            {!formData.is_pickup &&
              <div className="payment-list-box">
                <div className="form-check ps-0 w-100">
                  <div className='d-flex align-items-center'>
                    <input className="form-check-input" type="checkbox" id='is_contactless_delivery'
                      checked={formData.is_contactless_delivery} name="is_contactless_delivery" onChange={handleCheckboxChange}>
                    </input>
                    <label className="form-check form-check-reverse ms-2" htmlFor="is_contactless_delivery">
                      Contactless Delivery
                    </label>
                  </div>
                </div>
              </div>
            }
           
            {/* Package */}
            {(orderData?.items?.length && orderData.items[0].restaurant_name?.is_eco_friendly_package_available) && (
              <div className="payment-list-box row package-confirmation">
                <div className="d-flex align-items-center justify-content-between col-12 mb-2">
                  <label>Do you need eco-friendly packaging?</label>
                  <div className='radio-btn-group'>
                    <label>
                      <input type='checkbox' name='is_eco_friendly_package_available'
                        checked={formData.is_eco_friendly_package_available === true}
                        value={true}
                        onChange={handlePackageCheckboxChange}
                        className='custom-radio' />
                      Yes
                    </label>
                    <label>
                      <input type='checkbox' name='is_eco_friendly_package_available'
                        checked={formData.is_eco_friendly_package_available === false}
                        value={false}
                        onChange={handlePackageCheckboxChange}
                        className='custom-radio' />
                      No
                    </label>
                  </div>
                </div>
              </div>
            )}

            {(orderData?.items?.length && orderData.items[0].restaurant_name?.is_branded_package_avaiable) && (
              <div className="payment-list-box row package-confirmation">
                <div className="d-flex align-items-center justify-content-between col-12">
                  <label>Do you need branded packaging?</label>
                  <div className='radio-btn-group'>
                    <label>
                      <input type='checkbox' name='is_branded_package_avaiable'
                        checked={formData.is_branded_package_avaiable === true}
                        value={true}
                        onChange={handlePackageCheckboxChange}
                        className='custom-radio' />
                      Yes
                    </label>
                    <label>
                      <input type='checkbox' name='is_branded_package_avaiable'
                        checked={formData.is_branded_package_avaiable === false}
                        value={false}
                        onChange={handlePackageCheckboxChange}
                        className='custom-radio' />
                      No
                    </label>
                  </div>
                </div>
              </div>
            )}
            {/* cooking instructions */}
            <div className="form-group instructions cooking-instructions">
              <label htmlFor="cookinginstructionsTextarea" className="form-label">Cooking Instructions</label>
              <textarea
                id="cookinginstructionsTextarea"
                name="cooking_instructions"
                className={`form-control ${formData.cooking_instructions && 'active'}`}
                value={formData.cooking_instructions}
                onChange={handleTextareaChange}
                rows="4"
                placeholder={`Type your special instructions for cooking. ${cookingInstructionTemplates.length > 0 ? `You may also choose from the templates below.` : ``} `}
              />
              <div className="tags-container mt-2">
                {cookingInstructionTemplates.map((template, index) => (
                  <button
                    type="button"
                    key={index}
                    className="tag"
                    onClick={() => handleTemplateClick(template, 'cooking_instructions')}
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>

            {/* delivery instructions */}

            {!formData.is_pickup &&
              <div className="form-group instructions delivery-instructions">
                <label htmlFor="deliveryinstructionsTextarea" className="form-label">Delivery Instructions</label>
                <textarea
                  id="deliveryinstructionsTextarea"
                  name="delivery_instructions"
                  className={`form-control ${formData.delivery_instructions && 'active'}`}
                  rows="4"
                  value={formData.delivery_instructions}
                  onChange={handleTextareaChange}
                  placeholder="Type your special instructions for delivery."
                />
                <div className="tags-container mt-2">
                  {deliveryInstructionTemplates.map((template, index) => (
                    <button
                      type="button"
                      key={index}
                      className="tag"
                      onClick={() => handleTemplateClick(template, 'delivery_instructions')}
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>
            }
            {/* Tip */}
            {!formData.is_pickup &&
              <div className="form-group d-none">
                <label htmlFor="deliveryinstructionsTextarea" className="form-label">Tip</label>
                <input
                  id="tip"
                  name="tip"
                  className="form-control w-25"
                  value={formData.tip}
                  onChange={handleTipChange}
                />
                <div className="mt-2">
                  {tipSuggestions.map((value, index) => (
                    <button
                      type="button"
                      key={index}
                      className="btn theme-outline btn-sm me-2 mt-1"
                      onClick={() => handleTipSuggestionClick(value)}
                    >
                      £{value}
                    </button>
                  ))}
                </div>
              </div>
            }


          </div>
        </div>
        <div className="rhs">
          <div className="order-summery-section">
            <div className="checkout-detail">
              <div className="cart-address-box d-none">
                <div className="add-img">
                  <img className="img-fluid img" src="/images/home.png" alt="rp1"></img>
                </div>
                <div className="add-content">
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="dark-text deliver-place">
                      Deliver To : Home
                    </h5>
                    <a href="address.html" className="change-add">Change</a>
                  </div>
                  <h6 className="address mt-2 content-color">
                    932 Pittwater Rd, Sydney, New South Wales, 2099
                  </h6>
                </div>
              </div>
              <h3 className="checkout-title">
                Order Summary
              </h3>
              <ul>
                {orderData && orderData.items && orderData.items.length > 0 && orderData.items.map((item, index) => (
                  <li key={index}>
                    <div className="horizontal-product-box">
                      <div className="product-content">
                        <div className="d-flex align-items-center justify-content-between">
                          <h5>{item.menu_item_name} {item?.variant_details && `(${item.variant_details})`}</h5>
                          <h6 className="product-price">£{parseFloat(item.price) * parseInt(item.count)}</h6>
                        </div>
                        {/* {item.topping &&
                                <h6 className="ingredients-text"> + {item.topping_details.description}</h6>
                              } */}
                        {item.topping_details?.length > 0 &&
                          item.topping_details.map((top, index) => (
                            <div key={index} className='d-flex justify-content-between align-items-center'>
                              <h6 className="ingredients-text">{top.topping?.description} (x{top.count}) </h6>
                              {top.price > 0 &&
                                <span>£{top.price}</span>
                              }
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </li>

                ))}

              </ul>

              <h5 className="bill-details-title">Bill Details</h5>
              <div className="sub-total">
                <h6 className="content-color fw-normal">Sub Total</h6>
                <h6 className="fw-semibold">£{orderData.sub_total}</h6>
              </div>
              {orderData?.priority_charge > 0 &&
                <div className="sub-total">
                  <h6 className="content-color fw-normal">Priority Charge</h6>
                  <h6 className="fw-semibold">£{orderData?.priority_charge}</h6>
                </div>
              }
              <div className="sub-total">
                <h6 className="content-color fw-normal">
                  Delivery Charge
                </h6>
                {orderData?.delivery_charge > 0 ?
                  <h6 className="fw-semibold success-color">
                    £ {orderData?.delivery_charge?.toFixed(2)}
                  </h6> :
                  <h6 className="fw-semibold success-color">
                    Free Delivery
                  </h6>
                }
              </div>
              {/* <div className="sub-total">
                      <h6 className="content-color fw-normal">Discount (10%)</h6>
                      <h6 className="fw-semibold">Undefined</h6>
                    </div> */}
              <div className="grand-total">
                <h6 className="fw-semibold dark-text">Total</h6>
                <h6 className="fw-semibold amount">£{parseFloat(orderData.total_amount).toFixed(2)}</h6>
              </div>
              <button onClick={handleSubmit} className="btn-primary w-100 checkout-btn">
                CONTINUE
              </button>
              <img className="dots-design" src="/images/svg/dots-design.svg" alt="dots"></img>
            </div>
          </div>
        </div>
      </section >




  { isLoading && <FixedOverlayLoadingSpinner />}


<ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
{ isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => { setIsMessageModalOpen(false) }} /> }

    </div >

  );


}

export default CheckoutOptions