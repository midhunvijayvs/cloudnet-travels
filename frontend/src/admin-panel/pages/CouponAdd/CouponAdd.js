import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./CouponAdd.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"

import SearchSelectBoxForCoupon from "../../common-components/SearchSelectBoxForCoupon/SearchSelectBoxForCoupon";
import CustomSearchSelectBox from "../../common-components/CustomSearchSelectBox/CustomSearchSelectBox";
import { isoToDatetimeLocal } from "../../../GeneralFunctions";
import RichTextEditor from "../../common-components/RichText/RichText";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CouponAdd = ({ mode }) => {

  const navigate = useNavigate()
  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [restaurants, setRestaurants] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);

  let userApiUrl = `/user/verified-users/?page_size=1000`;
  if (localStorage.getItem('userRole') !== 'restaurant') {
    userApiUrl = `/user/verified-users/?page_size=1000`;
  } else {
    userApiUrl = `/restaurants/user-list/?page_size=1000`;
  }

  const COUPONFOR_LIST = ['first_time_user', 'loyal_customer', 'all_customers',
    'selected_customer', 'selected_item', 'selected_combination',
    'Basic', 'Premium', 'Ultimate']
  const [formData, setFormData] = useState({
    restaurant: null,
    coupon_code: null,
    coupon_for: null,
    loyalty_type: null,
    loyalty_value: null,
    single_order_value: null,
    combination: null,
    discount_type: null,
    discount_value: null,
    max_allowed_discount: null,
    usage_type: null,
    image_url: null,
    valid_from: null,
    valid_to: null,
    terms_and_conditions: null,
    users: [],
    items: [],
    subscription_tier: null,
    is_seasonal_offer: false,
  });

  const [errors, setErrors] = useState({});

  const loadData = () => {
    if (mode === 'edit') {
      let apiUrl = `/payments/coupons/${localStorage.getItem('itemSelectedId')}`;
      setIsLoading(true)
      API.get(apiUrl)
        .then(response => {
          setFormData({
            ...response.data,
            // valid_from: isoToDatetimeLocal(response.data.valid_from),
            // valid_to: isoToDatetimeLocal(response.data.valid_to),
          });
          // set image preview
          if (response.data.image_url) {
            setImagePreview(response.data.image_url)
          }

          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false)
        });
    }
  }
  useEffect(() => {
    loadData();
  }, [mode]);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;

    // Check if 'coupon_for' is being updated
    if (name === 'coupon_for') {
      if (['selected_item', 'selected_combination'].includes(value)) {
        if (!formData.restaurant) {
          setErrors(prevErrors => ({
            ...prevErrors,
            restaurant: 'Please select a restaurant'
          }));
          return; // Exit early if the error is set
        }
      }
      // Clear the restaurant error if conditions are met or value changes
      setErrors(prevErrors => ({
        ...prevErrors,
        restaurant: ''
      }));
    }


    if (name === "coupon_code") {
      // Restrict spaces and special characters, allow only alphanumeric characters
      processedValue = processedValue.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    }
    if (name === 'is_seasonal_offer') {
      processedValue = checked
    }

    setFormData({
      ...formData,
      [name]: processedValue
    });
  };

  const handleDescriptionChange = (sectionId, content) => {
    setFormData({
      ...formData,
      terms_and_conditions: content,
    });
  }
  // Date picker
  const handleDateChange = (date, field) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: date,
    }));
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    let error = null;
    // Check file type restriction, file size restriction, and image resolution restriction
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSizeInBytes = 3 * 1024 * 1024; // 3MB
    const maxResolution = { width: 800, height: 800 };
    const img = new Image();
    img.src = URL.createObjectURL(file);
    // const aspectRatio = img.width / img.height;
    // const validAspectRatio = aspectRatio >= 0.9 && aspectRatio <= 1.1;

    if (!allowedTypes.includes(file.type)) {
      error = 'Only JPEG and PNG images are allowed.';
    }
    else if (file.size > maxSizeInBytes) {
      error = 'File size exceeds the maximum limit of 3MB.';
    }
    else if (img.width > maxResolution.width || img.height > maxResolution.height) {
      error = 'image height and width should not exceed 800px';
    }

    if (error) {
      setFormData({
        ...formData,
        image_url: null
      });
      setErrors(prevErrors => ({
        ...prevErrors,
        image_url: error
      }));
      setImagePreview(null)
    }
    else {
      setImagePreview(URL.createObjectURL(file));
      setFormData({
        ...formData,
        image_url: file
      });
      setErrors(prevErrors => ({
        ...prevErrors,
        image_url: null
      }));

    }
  };


  const handleRemoveItem = (itemId, key) => {
    setFormData((prevData) => {
      const updatedItems = prevData[key].filter(
        (listItem) => listItem.id !== itemId
      );

      return {
        ...prevData,
        [key]: updatedItems,
      };
    });
  };

  useEffect(() => {
    API.get('/restaurants/?page_size=1000')
      .then(response => {
        setRestaurants(response.data);
      })
      .catch(error => {
        console.error(error);
      });

  }, [])

  useEffect(() => {
    // set restaurant Id
    API.get(`/restaurants/user-restaurant/${localStorage.getItem('userID')}`)
      .then(response => {
        setFormData(prevData => ({
          ...prevData,
          restaurant: response.data.id,
        }));
        setRestaurantId(response.data.id);
      })
      .catch(error => {
        console.error(error);
      });
  }, [])

  const validateForm = () => {
    const errors = {};

    // Function to check if a value is null, an empty string, or whitespace
    const isEmpty = (value) => {
      if (value === null) return true;
      if (typeof value === 'string') return value.trim() === "";
      return false;
    };

    // Function to validate if a value is a valid float number
    const isValidFloat = (value) => {
      if (isEmpty(value)) return false;
      return !isNaN(parseFloat(value)) && isFinite(value);
    };

    const isValidDateRange = (fromDate, toDate) => {
      if (isEmpty(fromDate) || isEmpty(toDate)) return { isValid: true, error: null };
      const from = new Date(fromDate);
      const to = new Date(toDate);
      const now = new Date();
      // Check if from date is before to date
      if (from >= to) {
        return { isValid: false, error: 'From date must be before To date' };
      }
      // Check if to date is after the current date
      if (to <= now) {
        return { isValid: false, error: 'To date must be in the future' };
      }
      return { isValid: true, error: null };
    };

    // Required fields
    const requiredFields = [
      'coupon_code', 'coupon_for', 'terms_and_conditions', 'valid_to',
      'valid_from', 'discount_type', 'image_url',
      'discount_value', 'single_order_value', 'usage_type'
    ];
    requiredFields.forEach(field => {
      if (isEmpty(formData[field])) {
        errors[field] = 'This field is required';
      }
    });

    // Validate float fields
    const floatFields = ['discount_value', 'single_order_value'
    ];
    floatFields.forEach(field => {
      if (!isValidFloat(formData[field])) {
        errors[field] = 'Please enter a valid number';
      }
    });

    // Validate date range
    const dateRangeValidation = isValidDateRange(formData.valid_from, formData.valid_to);
    if (!dateRangeValidation.isValid) {
      errors.valid_to = dateRangeValidation.error;
    }

    // Conditional validations
    if (['selected_item', 'selected_combination'].includes(formData.coupon_for)) {
      if (!formData.restaurant) {
        errors.restaurant = 'Please Select restaurant'
      }
    }

    if (formData.coupon_for === 'loyal_customer') {
      if (isEmpty(formData.loyalty_type)) {
        errors.loyalty_type = 'Loyalty type is required';
      }

      if (isEmpty(formData.loyalty_value)) {
        errors.loyalty_value = 'Required';
      } else if (!isValidFloat(formData.loyalty_value)) {
        errors.loyalty_value = 'Please enter a valid number';
      }

      if (formData.loyalty_type === 'no_order') {
        if (isEmpty(formData.days_within_order)) {
          errors.days_within_order = 'Required'
        } else if (!isValidFloat(formData.loyalty_value)) {
          errors.days_within_order = 'Please enter a valid number';
        }
      }
    }

    if (formData.coupon_for === 'selected_customer' && formData.users.length === 0) {
      errors.users = 'At least one user is required';
    }

    if (formData.coupon_for === 'selected_item' && formData.items.length === 0) {
      errors.items = 'At least one menu item is required';
    }

    if (formData.coupon_for === 'selected_combination' && isEmpty(formData.combination)) {
      errors.combination = 'Combination is required';
    }
    if (formData.coupon_for === 'subscription' && !formData.subscription_tier) {
      errors.subscription_tier = 'Select subscription tier.';
    }

    return errors;
  };


  const updateFormData = (data) => {
    const formData = {};
    for (const key in data) {
      if (data[key]) {
        // Check if the key is users or items and convert to list of ids
        if (key === 'users' || key === 'items') {
          const ids = data[key].map((item) => item.id);
          formData[key] = ids
        } else {
          formData[key] = data[key];
        }
      }
    }
    return formData;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      console.log(validationErrors);
      setErrors(validationErrors)
      return;
    } else {
      setErrors({})
    }

    const method = mode === 'edit' ? 'put' : 'post';
    const apiUrl = mode === 'edit'
      ? `/payments/coupons/${formData.id}/`
      : '/payments/coupons/';
    setIsLoading(true);

    const tempFormData = updateFormData(formData)
    const imgFormData = new FormData();
    const { image_url, ...restFormData } = tempFormData;
    // Check if image_url is a File object
    if (image_url instanceof File) {
      if (localStorage.getItem('userRole') === 'restaurant') {
        imgFormData.append('restaurant', restaurantId)
      }
      imgFormData.append('image_url', image_url);
    }

    API[method](apiUrl, restFormData)
      .then(response => {
        // Only send imgFormData if it has an image
        if (imgFormData.has('image_url')) {
          API.put(`/payments/coupons/${response.data.id}/`, imgFormData, { headers: { "Content-Type": "multipart/form-data" } })
            .then(() => {
              setMessage(mode === 'add' ? "Coupon added successfully!" : "Coupon updated successfully!");
              setIsMessageModalOpen(true);
              setIsLoading(false);
            })
            .catch(error => {
              setIsLoading(false);
              setMessage(error.response?.data?.message || error.message);
              setIsErrorModalOpen(true);
            });
        } else {
          // Handle case where there's no image to upload
          setMessage(mode === 'add' ? "Coupon added successfully!" : "Coupon updated successfully!");
          setIsMessageModalOpen(true);
          setIsLoading(false);
        }
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
      });

  }

  return (
    <div className="coupon-add-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h5>
                {mode === 'edit' ? 'Edit Coupon' : 'Create Coupon'}
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <div className="input-items">
                    <div className="row gy-3">
                      {/* restaurant */}
                      {(localStorage.getItem('userRole') !== 'restaurant') &&
                        <div className="col-xl-6">
                          <div className="input-box">
                            <h6>Restaurant</h6>
                            <select className="form-select form-select-sm" aria-label=".form-select-sm example"
                              name="restaurant" value={formData.restaurant} onChange={handleInputChange}>
                              <option value={null} label="All"></option>
                              {restaurants && restaurants.results.map((item, index) => {
                                return (
                                  <option value={item.id} key={index}>{item.name}</option>
                                )
                              })}
                            </select>
                            {errors.restaurant && <div className="text-danger">{errors.restaurant}</div>}
                          </div>
                        </div>
                      }
                      {/* coupon Type */}
                      <div className="col-xl-6">
                        <h6>Coupon Type</h6>
                        <div className='radio-btn-group'>
                          <label className="">
                            <input type='checkbox' name='is_seasonal_offer' id="is_seasonal_offer"
                              checked={formData.is_seasonal_offer}
                              onChange={handleInputChange}
                              className='custom-checkbox' />
                            Festival Coupon
                          </label>
                        </div>
                        {errors.is_seasonal_offer && <div className="text-danger">{errors.is_seasonal_offer}</div>}

                      </div>
                      {/* coupon code */}
                      <div className="col-xl-6">
                        <div className="input-box">
                          <h6>Coupon Code</h6>
                          <input type="text" name="coupon_code" id="coupon_code" placeholder="Enter Your Coupon Code"
                            value={formData.coupon_code} onChange={handleInputChange} />
                          {errors.coupon_code && <div className="text-danger">{errors.coupon_code}</div>}
                        </div>
                      </div>
                      {/* coupon For */}
                      <div className="col-xl-6">
                        <div className="input-box">
                          <h6>Coupon For</h6>
                          <select className={`form-select text-capitalize `} name="coupon_for" value={formData.coupon_for} onChange={handleInputChange}>
                            <option value={null} label="Select"></option>
                            {COUPONFOR_LIST.map((item, index) => {
                              let label = item.replace(/_/g, ' ');
                              if (['Basic', 'Premium', 'Ultimate'].includes(item)) {
                                label = `${item} user`;
                              }
                              return (
                                <option key={index} className="text-capitalize" value={item}>
                                  {label}
                                </option>
                              );
                            })}
                          </select>
                          {errors.coupon_for && <div className="text-danger">{errors.coupon_for}</div>}
                        </div>
                      </div>

                      {/* Loyalty Customers */}
                      {formData.coupon_for === 'loyal_customer' && (
                        <>
                          <div className="col-12">
                            <div className="row loyalty-type">
                              <div className="input-box">
                                <h6>Loyalty Type</h6>
                                <div className='radio-btn-group'>
                                  <div className="checks">
                                    <label className="me-3">
                                      <input type='radio' name='loyalty_type' id="loyalty1"
                                        checked={formData.loyalty_type === 'year'}
                                        value={'year'}
                                        onChange={handleInputChange}
                                        className='custom-radio' />
                                      By Year
                                    </label>
                                    <label className="me-3">
                                      <input type='radio' name='loyalty_type' id="loyalty2"
                                        checked={formData.loyalty_type === 'total_order'}
                                        value={'total_order'}
                                        onChange={handleInputChange}
                                        className='custom-radio' />
                                      By Total Order Amount
                                    </label>
                                    <label>
                                      <input type='radio' name='loyalty_type' id="loyalty3"
                                        checked={formData.loyalty_type === 'no_order'}
                                        value={'no_order'}
                                        onChange={handleInputChange}
                                        className='custom-radio' />
                                      By Repeated Orders
                                    </label>
                                  </div>
                                  <div className="ms-4">
                                    {formData.loyalty_type === 'total_order' &&
                                      <>
                                        <span className="label me-1"> ₹ </span>
                                        <input type="text" className="value-inp" min={0} value={formData.loyalty_value}
                                          name="loyalty_value" onChange={handleInputChange} />
                                        {errors.loyalty_value && <div className="text-danger">{errors.loyalty_value}</div>}
                                      </>
                                    }
                                    {formData.loyalty_type === 'year' &&
                                      <>
                                        <input type="text" className="value-inp" min={0} value={formData.loyalty_value}
                                          name="loyalty_value" onChange={handleInputChange} />
                                        <span className="label ms-1"> years </span>
                                        {errors.loyalty_value && <div className="text-danger">{errors.loyalty_value}</div>}
                                      </>
                                    }
                                    {formData.loyalty_type === 'no_order' &&
                                      <div className="d-flex flex-column">
                                        <div className="mb-2">
                                          <span className="label me-1"> Minimum no. of repeated orders: </span>
                                          <input type="text" className="value-inp" min={0} value={formData.loyalty_value}
                                            name="loyalty_value" onChange={handleInputChange} />
                                          {errors.loyalty_value && <div className="text-danger">{errors.loyalty_value}</div>}
                                        </div>
                                        <div>
                                          <span className="label me-1"> Time Period With in the orders should be placed: </span>
                                          <input type="text" className="value-inp" min={0} value={formData.days_within_order}
                                            name="days_within_order" onChange={handleInputChange} />
                                          <span className="label ms-1">Days </span>
                                          {errors.days_within_order && <div className="text-danger">{errors.days_within_order}</div>}
                                        </div>
                                      </div>
                                    }


                                  </div>

                                </div>
                                {errors.loyalty_type &&
                                  <div className="text-danger">{errors.loyalty_type}</div>
                                }

                              </div>

                            </div>

                          </div>

                        </>
                      )}
                      {/* Selected Customers */}
                      {formData.coupon_for === 'selected_customer' && (
                        <div className="search-add-box col-12">
                          <h6>Customers</h6>
                          <div className="col-12">
                            <SearchSelectBoxForCoupon formData={formData} setFormData={setFormData} changeKey={'users'}
                              apiGetUrl={userApiUrl} resourceName={'user'} />
                          </div>
                          {errors.users && <div className="text-danger">{errors.users}</div>}
                          {formData.users?.length > 0 &&
                            <div className="d-flex flex-wrap selected-items">
                              {formData.users.map((item, index) => (
                                <div
                                  type="button"
                                  key={index}
                                  className="btn theme-outline btn-sm me-2 mt-1"
                                >
                                  {item.username}
                                  <span className="close" onClick={() => handleRemoveItem(item.id, 'users')}>X</span>
                                </div>

                              ))}
                            </div>
                          }
                        </div>
                      )}
                      {/* Selected Item */}
                      {formData.coupon_for === 'selected_item' && formData.restaurant && (
                        <div className="search-add-box col-xl-6">
                          <h6>Menu Items</h6>
                          <div className="col-12">
                            <SearchSelectBoxForCoupon formData={formData} setFormData={setFormData} changeKey={'items'}
                              apiGetUrl={`/restaurants/menu-items/${formData.restaurant ? `?restaurant=${formData.restaurant}` : ''}`} resourceName={'menu-item'} />
                          </div>
                          {errors.items && <div className="text-danger">{errors.items}</div>}
                          {formData.items?.length > 0 &&
                            <div className="d-flex flex-wrap selected-items">
                              {formData.items.map((item, index) => (
                                <div
                                  type="button"
                                  key={index}
                                  className="btn theme-outline btn-sm me-2 mt-1"
                                >
                                  {item.name}
                                  <span className="close" onClick={() => handleRemoveItem(item.id, 'items')}>X</span>
                                </div>

                              ))}
                            </div>
                          }
                        </div>
                      )}
                      {/* Selected Combo */}
                      {formData.coupon_for === 'selected_combination' && formData.restaurant && (
                        <div className="search-add-box col-xl-6">
                          <h6>Menu Combination</h6>
                          <div className="col-12">
                            <CustomSearchSelectBox formData={formData} setFormData={setFormData} changeKey={'combination'}
                              apiGetUrl={`/restaurants/combinations/${formData.restaurant ? `?restaurant=${formData.restaurant}` : ''}`}
                              resourceName={'combination'}
                            />
                          </div>
                          {errors.combination && <div className="text-danger">{errors.combination}</div>}
                        </div>
                      )}

                      {/* minimum order amount */}
                      <div className="col-xl-6">
                        <div className="input-box">
                          <h6>Minimum Order Amount</h6>
                          <input type="text" min={0} name="single_order_value" placeholder="Enter Min Order Amount"
                            value={formData.single_order_value} onChange={handleInputChange} />
                          {errors.single_order_value && <div className="text-danger">{errors.single_order_value}</div>}
                        </div>
                      </div>
                      {/* discount type */}
                      <div className="col-12">
                        <h6>Discount Type</h6>
                        <div className='radio-btn-group'>
                          <div className="d-flex">
                            <label className="me-3">
                              <input type='radio' name='discount_type' id="flat"
                                checked={formData.discount_type === 'flat'}
                                value={'flat'}
                                onChange={handleInputChange}
                                className='custom-radio' />
                              Flat
                            </label>
                            <label>
                              <input type='radio' name='discount_type' id="percentage"
                                checked={formData.discount_type === 'percentage'}
                                value={'percentage'}
                                onChange={handleInputChange}
                                className='custom-radio' />
                              Percentage
                            </label>
                          </div>
                          <div className="ms-5">
                            {formData.discount_type === 'flat' &&
                              <span className="label me-1"> ₹ </span>
                            }
                            <input type="text" className="value-inp" min={0} name="discount_value"
                              value={formData.discount_value} onChange={handleInputChange} />
                            {formData.discount_type === 'percentage' &&
                              <span className="label ms-1"> % </span>
                            }
                          </div>
                          <div className="ms-5">
                            <span className="label me-2"> Maximum Allowed Discount </span>
                            <span className="label me-1"> ₹ </span>
                            <input type="text" className="value-inp" min={0} name="max_allowed_discount"
                              value={formData.max_allowed_discount} onChange={handleInputChange} />
                          </div>
                        </div>
                        {errors.discount_type ?
                          <div className="text-danger">{errors.discount_type}</div> :
                          errors.discount_value ? <div className="text-danger">{errors.discount_value}</div> :
                            errors.max_allowed_discount && <div className="text-danger">{errors.max_allowed_discount}</div>
                        }
                      </div>
                      {/* usage Type */}
                      <div className="col-xl-6">
                        <h6>Usage Type</h6>
                        <div className='radio-btn-group'>
                          <label className="">
                            <input type='radio' name='usage_type' id="single_time"
                              checked={formData.usage_type === 'single_time'}
                              value={'single_time'}
                              onChange={handleInputChange}
                              className='custom-radio' />
                            Single Use
                          </label>
                          <label>
                            <input type='radio' name='usage_type' id="multiple_time"
                              checked={formData.usage_type === 'multiple_time'}
                              value={'multiple_time'}
                              onChange={handleInputChange}
                              className='custom-radio' />
                            Multiple Use
                          </label>
                        </div>
                        {errors.usage_type && <div className="text-danger">{errors.usage_type}</div>}

                      </div>
                      {/* IMAGE ========= ON HOLD */}
                      <div className="col-xl-6">
                        <div className="input-box image-input">
                          <h6>Image</h6>
                          <div className="d-flex justify-content-between">
                            {imagePreview ? (
                              <div>
                                <img src={imagePreview} className="me-2" alt="Preview" style={{ width: "50px", height: "50px" }} />
                              </div>
                            ) : (
                              <></>
                            )}
                            <input type="file" onChange={handleFileSelect} accept="image/*" />

                          </div>
                          {errors.image_url && <div className="text-danger">{errors.image_url}</div>}
                        </div>
                      </div>
                      {/* valid from */}
                      <div className="col-xl-6">
                        <div className="input-box">
                          <h6>Valid From</h6>
                          {/* <input type="datetime-local" name="valid_from" value={formData.valid_from} onChange={handleInputChange} /> */}
                          <DatePicker
                            selected={formData.valid_from ? new Date(formData.valid_from) : null}
                            onChange={(date) => handleDateChange(date, 'valid_from')}
                            showTimeSelect
                            timeFormat="hh:mm aa"
                            dateFormat="dd-MM-yyyy h:mm aa"
                            placeholderText="Select date and time"
                          />
                          {errors.valid_from && <div className="text-danger">{errors.valid_from}</div>}
                        </div>
                      </div>
                      {/* valid to */}
                      <div className="col-xl-6">
                        <div className="input-box">
                          <h6>Valid To</h6>
                          {/* <input type="datetime-local" name="valid_to" value={formData.valid_to} onChange={handleInputChange} /> */}
                          <DatePicker
                            selected={formData.valid_to ? new Date(formData.valid_to) : null}
                            onChange={(date) => handleDateChange(date, 'valid_to')}
                            showTimeSelect
                            timeFormat="hh:mm aa"
                            dateFormat="dd-MM-yyyy h:mm aa"
                            placeholderText="Select date and time"
                          />
                          {errors.valid_to && <div className="text-danger">{errors.valid_to}</div>}
                        </div>
                      </div>
                      {/* terms and conditions */}
                      <div className="col-12">
                        <div className="input-box">
                          <h6>Terms & Conditions</h6>
                          {/* Rich Text */}
                          <RichTextEditor
                            sectionId={1}
                            onContentChange={handleDescriptionChange}
                            initialContent={mode === 'edit' ? formData.terms_and_conditions : JSON.stringify({ blocks: [], entityMap: {} })}
                          />

                          {/* <textarea type='text' id='terms_and_conditions' className='form-control' rows={4}
                            name="terms_and_conditions" value={formData.terms_and_conditions} onChange={handleInputChange} /> */}
                          {errors.terms_and_conditions && <div className="text-danger">{errors.terms_and_conditions}</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center mt-2  ">

                <button className="btn theme-outline mt-2 me-5" type="submit" onClick={() => navigate('/admin/coupon/list')} >Cancel</button>
                <button className="btn theme-btn mt-2" type="submit" onClick={handleSubmit}>Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => navigate('/admin/coupon/list')} />}
      {/* {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'users'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>} */}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default CouponAdd