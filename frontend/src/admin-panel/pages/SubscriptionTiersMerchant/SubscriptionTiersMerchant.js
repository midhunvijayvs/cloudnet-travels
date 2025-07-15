import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import $ from 'jquery';
import './SubscriptionTiersMerchant.scss'


const SubscriptionTiersMerchant = ({ mode }) => {

  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const defaultTiers = [
    { subscription_name: "Free", required_sales: "", duration_in_days: "", base_price: "" },
    { subscription_name: "Starter", required_sales: "", duration_in_days: "", base_price: "" },
    { subscription_name: "Basic", required_sales: "", duration_in_days: "", base_price: "" },
    { subscription_name: "Benefit", required_sales: "", duration_in_days: "", base_price: "" },
    { subscription_name: "Standard", required_sales: "", duration_in_days: "", base_price: "" },
    { subscription_name: "Elite", required_sales: "", duration_in_days: "", base_price: "" }
  ];

  const [formData, setFormData] = useState(defaultTiers);

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  const loadData = () => {
    let apiUrl = `/payments/merchant-tiers/`;
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
      duration_in_days: { pattern: /^[0-9]{0,4}$/, max: 9999 },
      required_sales: { pattern: /^[0-9]{0,5}(\.[0-9]{0,2})?$/, max: 99999.99 },
      base_price: { pattern: /^[0-9]{0,4}(\.[0-9]{0,2})?$/, max: 9999.99 },
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
      "required_sales",
      "duration_in_days",
      "base_price",
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
      API.put(`/payments/merchant-tiers/${currentData.id}/`, currentData)
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
      API.post(`/payments/merchant-tiers/`, currentData)
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
      <div className="admin-subscription-tiers-merchant page-body">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h5>
                Merchant Subscription Tiers
              </h5>
            </div>
            <div className='card-body'>
              <div className="row">
                <div className="col-xxl-2 col-xl-3">
                  <ul className="nav setting-main-box sticky theme-scrollbar" role="tablist">
                    {formData.map((tier, index) => {
                      let iconClass = "";
                      switch (tier.subscription_name.toLowerCase()) {
                        case "free":
                          iconClass = "ri-user-line";
                          break;
                        case "starter":
                          iconClass = "ri-rocket-line";
                          break;
                        case "basic":
                          iconClass = "ri-user-line";
                          break;
                        case "benefit":
                          iconClass = "ri-gift-line";
                          break;
                        case "standard":
                          iconClass = "ri-shield-check-line";
                          break;
                        case "elite":
                          iconClass = "ri-vip-diamond-line";
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
                              {/* Required Sales */}
                              <div className="col-lg-6">
                                <div className='label'>
                                  Minimum Sales Requirement
                                  <div className='instructions'>
                                    Enter the total sales (in GBP) required for a restaurant to qualify for this tier.
                                  </div>
                                </div>
                                <div className="input-box">
                                  <div className="input-container">
                                    <input
                                      type="text"
                                      name="points_per_pound"
                                      id="required_sales"
                                      placeholder="e.g. 5000"
                                      value={tier.required_sales}
                                      onChange={(e) => handleInputChange(index, "required_sales", e.target.value)}
                                    />
                                    <span className="unit price">GBP</span>
                                  </div>
                                  {errors[index]?.required_sales && (
                                    <div className="invalid-feedback m-0 mb-1  position-relative">{errors[index].required_sales}</div>
                                  )}

                                </div>
                              </div>
                              {/* Duration in Days */}
                              <div className="col-lg-6">
                                <div className='label'>
                                  Subscription Duration
                                  <div className='instructions'>
                                    Set how long this subscription tier will remain active (in days) after activation.
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
                              <div className="col-lg-6">
                                <div className='label'>
                                  Subscription Price
                                  <div className='instructions'>
                                    Specify the price (in GBP) for this subscription tier.
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
                            </div>
                            {/* <div className='settings-item row gy-3 mt-2'>
                            </div> */}

                            {/* Features */}
                            <div className='settings-item row gy-2 mt-2 d-none'>
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

export default SubscriptionTiersMerchant