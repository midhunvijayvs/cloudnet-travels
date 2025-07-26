import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import $ from 'jquery';
import './SubscriptionTiers.scss'


const SubscriptionTiers = ({ mode }) => {

  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const defaultTiers = [
    { subscription_name: "Basic", points_per_pound: "", points_required_for_one_pound: "", is_delivery_free: false, has_priority_support: false, has_early_access: false, duration_in_days: "", base_price: "", offer_price: "" },
    { subscription_name: "Premium", points_per_pound: "", points_required_for_one_pound: "", is_delivery_free: false, has_priority_support: false, has_early_access: false, duration_in_days: "", base_price: "", offer_price: "" },
    { subscription_name: "Ultimate", points_per_pound: "", points_required_for_one_pound: "", is_delivery_free: false, has_priority_support: false, has_early_access: false, duration_in_days: "", base_price: "", offer_price: "" }
  ];

  const [formData, setFormData] = useState(defaultTiers);

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  const loadData = () => {
    let apiUrl = `/user/create-subscription-plans/`;
    API.get(apiUrl)
      .then((response) => {
        const data = response.data || [];
        const merged = defaultTiers.map(defaultTier => {
          const existing = data.find(d => d.subscription_name === defaultTier.subscription_name);
          return existing ? { ...defaultTier, ...existing } : defaultTier;
        });
        setFormData(merged);
      })
      .catch(() => setIsLoading(false))
      .finally(() => setIsLoading(false));
  }
  useEffect(() => {
    loadData();
  }, []);


  // Handle input change with validation
  const handleInputChange = (index, key, newValue) => {
    const validationRules = {
      points_per_pound: { pattern: /^[0-9]{0,4}$/, max: 9999 },
      points_required_for_one_pound: { pattern: /^[0-9]{0,3}$/, max: 999 },
      duration_in_days: { pattern: /^[0-9]{0,4}$/, max: 9999 },
      base_price: { pattern: /^[0-9]{0,4}(\.[0-9]{0,2})?$/, max: 9999.99 },
      offer_price: { pattern: /^[0-9]{0,4}(\.[0-9]{0,2})?$/, max: 9999.99 },
    };

    const checkboxKeys = ['is_delivery_free', 'has_priority_support', 'has_early_access'];

    setFormData(prevData => {
      return prevData.map((item, i) => {
        if (i === index) {
          if (checkboxKeys.includes(key)) {
            return {
              ...item,
              [key]: !item[key], // toggle checkbox value
            };
          }

          if (validationRules[key]) {
            const { pattern, max } = validationRules[key];
            if (newValue === "" || (pattern.test(newValue) && parseFloat(newValue) <= max)) {
              return {
                ...item,
                [key]: newValue,
              };
            }
          }
        }
        return item;
      });
    });
  };

  const validateFields = (data) => {
    const errorObj = {};
    const requiredFields = [
      "points_per_pound",
      "points_required_for_one_pound",
      "duration_in_days",
      "base_price",
      "offer_price"
    ];

    requiredFields.forEach(field => {
      if (
        data[field] === "" ||
        data[field] === null ||
        data[field] === undefined ||
        isNaN(data[field])
      ) {
        errorObj[field] = "This field is required and must be a valid number";
      }
    });

    // base_price vs offer_price
    const base = parseFloat(data.base_price);
    const offer = parseFloat(data.offer_price);
    if (!isNaN(base) && !isNaN(offer) && offer > base) {
      errorObj["offer_price"] = "Offer price must be less than base price";
    }

    return errorObj;
  };



  // Handle update click to send updated data to API
  const handleUpdate = (index) => {
    const currentData = formData[index];

    const validationErrors = validateFields(currentData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(prev => ({ ...prev, [index]: validationErrors }));
      return;
    }
    setIsLoading(true)
    if (currentData?.id) {
      API.put(`/user/subscription-plans/${currentData.id}/`, currentData)
        .then(response => {
          setIsLoading(false)
          const updatedData = [...formData];
          updatedData[index] = response.data;

          setMessage(`Details updated successfully!`);
          setIsMessageModalOpen(true);
        })
        .catch(error => {
          setIsLoading(false)
          setMessage(error.response?.data?.message || error.message);
          setIsErrorModalOpen(true);
        });
    } else {
      API.post(`/user/create-subscription-plans/`, currentData)
        .then(response => {
          setIsLoading(false)
          const updatedData = [...formData];
          updatedData[index] = response.data;
          setMessage(`Details updated successfully!`);
          setIsMessageModalOpen(true);
        })
        .catch(error => {
          setIsLoading(false)
          setMessage(error.response?.data?.message || error.message);
          setIsErrorModalOpen(true);
        });
    }
  };




  return (
    <>
      <div className="admin-subscription-tiers page-body">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h5>
                Customer Subscription Tiers
              </h5>
            </div>
            <div className='card-body'>
              <div className="row">
                <div className="col-xxl-2 col-xl-3">
                  <ul className="nav setting-main-box sticky theme-scrollbar" role="tablist">
                    {formData.map((tier, index) => {
                      let iconClass = "";
                      switch (tier.subscription_name.toLowerCase()) {
                        case "basic":
                          iconClass = "ri-user-line";
                          break;
                        case "premium":
                          iconClass = "ri-vip-crown-line";
                          break;
                        case "ultimate":
                          iconClass = "ri-star-line";
                          break;
                        default:
                          iconClass = "ri-user-line";
                      }

                      return (
                        <li key={tier.subscription_name}>
                          <button
                            className={`nav-link ${index === 0 ? "active" : ""}`}
                            data-bs-toggle="pill"
                            data-bs-target={`#${tier.subscription_name.toLowerCase()}`}
                            role="tab"
                          >
                            <i className={iconClass}></i>
                            {tier.subscription_name}
                          </button>
                        </li>
                      );
                    })}

                  </ul>

                </div>
                <div className="col-xxl-10 col-xl-9 col-12">
                  <div className="restaurant-tab">
                    <div className="tab-content">
                      {formData.map((tier, index) => (
                        <div
                          className={`tab-pane fade ${index === 0 ? "show active" : ""}`}
                          id={tier.subscription_name.toLowerCase()}
                          key={tier.subscription_name}
                        >
                          <div className="input-items">
                            {/* General Settings */}
                            <div className='settings-item row gy-3'>
                              {/* Points Per Pound */}
                              <div className="col-lg-6">
                                <div className='label'>
                                  Points Per Pound
                                  <div className='instructions'>
                                    Number of reward points the customer earns per pound spent.
                                  </div>
                                </div>
                                <div className="input-box">
                                  <div className="input-container">
                                    <input
                                      type="text"
                                      name="points_per_pound"
                                      id="points_per_pound"
                                      placeholder="Points"
                                      value={tier.points_per_pound}
                                      onChange={(e) => handleInputChange(index, "points_per_pound", e.target.value)}
                                    />
                                    <span className="unit">Points</span>
                                  </div>
                                  {errors[index]?.points_per_pound && (
                                    <div className="invalid-feedback m-0 mb-1  position-relative">{errors[index].points_per_pound}</div>
                                  )}

                                </div>
                              </div>
                              {/* Points Required for One Pound */}
                              <div className="col-lg-6">
                                <div className='label'>
                                  Points Required for One Pound
                                  <div className='instructions'>
                                    Number of reward points the customer needs to redeem ₹1.
                                  </div>
                                </div>
                                <div className="input-box">
                                  <div className="input-container">
                                    <input
                                      type="text"
                                      name="points_required_for_one_pound"
                                      id="points_required_for_one_pound"
                                      placeholder="Points"
                                      value={tier.points_required_for_one_pound}
                                      onChange={(e) => handleInputChange(index, "points_required_for_one_pound", e.target.value)}
                                    />
                                    <span className="unit">Points</span>
                                  </div>
                                  {errors[index]?.points_required_for_one_pound && (
                                    <div className="invalid-feedback m-0 mb-1  position-relative">{errors[index].points_required_for_one_pound}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className='settings-item row gy-3 mt-2'>
                              {/* Duration in Days */}
                              <div className="col-lg-4">
                                <div className='label'>
                                  Duration in Days
                                  <div className='instructions'>
                                    Total duration of the subscription plan in days.
                                  </div>
                                </div>
                                <div className="input-box">
                                  <div className="input-container">
                                    <input
                                      type="text"
                                      name="duration_in_days"
                                      id="duration_in_days"
                                      placeholder="Days"
                                      value={tier.duration_in_days}
                                      onChange={(e) => handleInputChange(index, "duration_in_days", e.target.value)}
                                    />
                                    <span className="unit">Days</span>
                                  </div>
                                  {errors[index]?.duration_in_days && (
                                    <div className="invalid-feedback m-0 mb-1  position-relative">{errors[index].duration_in_days}</div>
                                  )}
                                </div>
                              </div>
                              {/* base price */}
                              <div className="col-lg-4">
                                <div className='label'>
                                  Base Price
                                  <div className='instructions'>
                                    Standard price of the subscription before any discounts or offers.
                                  </div>
                                </div>

                                <div className="input-box">
                                  <div className="input-container">
                                    <input
                                      type="text"
                                      name="base_price"
                                      id="base_price"
                                      placeholder="Days"
                                      value={tier.base_price}
                                      onChange={(e) => handleInputChange(index, "base_price", e.target.value)}
                                    />
                                    <span className="unit price">GBP</span>
                                  </div>
                                  {errors[index]?.base_price && (
                                    <div className="invalid-feedback m-0 mb-1  position-relative">{errors[index].base_price}</div>
                                  )}
                                </div>
                              </div>
                              {/* Offer price */}
                              <div className="col-lg-4">
                                <div className='label'>
                                  Offer Price
                                  <div className='instructions'>
                                    Discounted price at which the subscription is currently offered.
                                  </div>
                                </div>

                                <div className="input-box">
                                  <div className="input-container">
                                    <input
                                      type="text"
                                      name="offer_price"
                                      id="offer_price"
                                      placeholder="Days"
                                      value={tier.offer_price}
                                      onChange={(e) => handleInputChange(index, "offer_price", e.target.value)}
                                    />
                                    <span className="unit price">GBP</span>
                                  </div>
                                  {errors[index]?.offer_price && (
                                    <div className="invalid-feedback m-0 mb-1  position-relative">{errors[index].offer_price}</div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Features */}
                            <div className='settings-item row gy-2 mt-2'>
                              <h3 className='section-heading'>Plan Features</h3>
                              <div className="col-lg-4">
                                <div className='check-box-container'>
                                  <input type='checkbox' name='is_delivery_free'
                                    id={`is_delivery_free-${index}`}
                                    checked={tier.is_delivery_free === true}
                                    value={true}
                                    onChange={(e) => handleInputChange(index, 'is_delivery_free', e.target.value)}
                                    className='custom-checkbox' />
                                  <label className='label' htmlFor={`is_delivery_free-${index}`}>
                                    Free Delivery
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-4">
                                <div className='check-box-container'>
                                  <input type='checkbox' name='has_priority_support'
                                    id={`has_priority_support-${index}`}
                                    checked={tier.has_priority_support === true}
                                    value={true}
                                    onChange={(e) => handleInputChange(index, 'has_priority_support', e.target.value)}
                                    className='custom-checkbox' />
                                  <label className='label' htmlFor={`has_priority_support-${index}`}>
                                    Priority Support
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-4">
                                <div className='check-box-container'>
                                  <input type='checkbox' name='has_early_access'
                                    id={`has_early_access-${index}`}
                                    checked={tier.has_early_access === true}
                                    value={true}
                                    onChange={(e) => handleInputChange(index, 'has_early_access', e.target.value)}
                                    className='custom-checkbox' />
                                  <label className='label' htmlFor={`has_early_access-${index}`}>
                                    Early Access
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className='mt-2 d-flex justify-content-center align-items-center'>
                              <div className="change-btn" onClick={() => handleUpdate(index)}>
                                Update
                              </div>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div >



      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}

      {isLoading && <FixedOverlayLoadingSpinner />}
    </>

  )
}

export default SubscriptionTiers