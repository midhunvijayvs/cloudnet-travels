import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./GiftCardAdd.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"

const GiftCardAdd = ({ mode }) => {

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
  const [imagePreview, setImagePreview] = useState(null);

  const [imgData, setImgData] = useState({});
  const [expiryDateObject, setExpiryDateObject] = useState({});
  const [expiryDate, setExpiryDate] = useState("0000-00-00");
  const [isExpirySaving, setIsExpirySaving] = useState(false);

  const [formData, setFormData] = useState({
    name: null,
    base_price: null,
    is_available: true,
    description: 'Gift card',
    is_gift_card: true
  });

  const [errors, setErrors] = useState({});

  const loadData = () => {
    if (mode === 'edit') {
      let apiUrl = `/restaurants/menu-items/${localStorage.getItem('itemSelectedId')}`;
      setIsLoading(true)
      API.get(apiUrl)
        .then(response => {
          const imageUrl = response.data?.images?.[0]?.image_url || null;
          setImgData(response.data?.images?.[0] || {})
          setFormData({
            ...response.data,
          });
          // set image preview
          if (imageUrl) {
            setImagePreview(imageUrl);
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

  const loadExpiryDate = () => {
    let apiUrl = `/user/settings/?key=gift_card_expiry_duration`;
    API.get(apiUrl)
      .then(response => {
        const expiryData = response.data?.[0] || {};
        setExpiryDateObject(expiryData);
        setExpiryDate(expiryData.value);
      })
      .catch(error => {
      });
  }
  useEffect(() => {
    loadExpiryDate();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    // If name is 'base_price', also set 'offer_price' to the same value
    if (name === 'base_price') {
      setFormData({
        ...formData,
        [name]: processedValue,
        offer_price: processedValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: processedValue
      });
    }
  };

  const handleExpiryChange = (event) => {
    const { name, value } = event.target;
    // Allow only numeric values
    let sanitizedValue = value.replace(/\D/g, ""); // Remove non-numeric characters

    // Validation: Restrict day to 31, month to 12, and year to 4 digits
    if (name === "expiry_day" && parseInt(sanitizedValue, 10) > 31) {
      sanitizedValue = "31";
    }
    if (name === "expiry_month" && parseInt(sanitizedValue, 10) > 12) {
      sanitizedValue = "12";
    }
    if (name === "expiry_year" && sanitizedValue.length > 4) {
      return; // Ignore input if year exceeds 4 digits
    }

    // Update expiryDate based on the input
    const [year, month, day] = expiryDate.split("-");
    const updatedYear = name === "expiry_year" ? sanitizedValue.padStart(4, "0") : year;
    const updatedMonth = name === "expiry_month" ? sanitizedValue.padStart(2, "0") : month;
    const updatedDay = name === "expiry_day" ? sanitizedValue.padStart(2, "0") : day;

    setExpiryDate(`${updatedYear}-${updatedMonth}-${updatedDay}`);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    let error = null;

    // Restrictions
    const allowedTypes = ['image/jpeg', 'image/png']; // Allowed image types
    const maxSizeInBytes = 3 * 1024 * 1024; // 3MB size limit
    const maxResolution = { width: 1012, height: 638 }; // ATM card-like resolution
    const aspectRatioTolerance = 0.15; // Allow a small tolerance for aspect ratio

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      error = 'Only JPEG and PNG images are allowed.';
    } else if (file.size > maxSizeInBytes) {
      error = 'File size exceeds the maximum limit of 3MB.';
    } else {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const aspectRatio = width / height;

        const isValidResolution = width <= maxResolution.width && height <= maxResolution.height;
        const isValidAspectRatio = aspectRatio >= (1.585 - aspectRatioTolerance) && aspectRatio <= (1.585 + aspectRatioTolerance);

        if (!isValidResolution) {
          error = `Image dimensions should not exceed ${maxResolution.width}px x ${maxResolution.height}px.`;
        } else if (!isValidAspectRatio) {
          error = `Image must have an aspect ratio close to 1.585 (like an ATM card).`;
        }

        if (error) {
          setImgData({
            ...imgData,
            image_url: null
          });
          setErrors(prevErrors => ({
            ...prevErrors,
            image_url: error
          }));
          setImagePreview(null);
        } else {
          setImagePreview(URL.createObjectURL(file));
          setImgData({
            ...imgData,
            image_url: file
          });
          setErrors(prevErrors => ({
            ...prevErrors,
            image_url: null
          }));
        }
      };
    }

    if (error) {
      setImgData({
        ...imgData,
        image_url: null
      });
      setErrors(prevErrors => ({
        ...prevErrors,
        image_url: error
      }));
      setImagePreview(null);
    }
  };

  const validateForm = (formData, imgData) => {
    const errors = {};


    // Function to check if a value is null, undefined, an empty string, or an invalid File object
    const isEmpty = (value) => {
      if (value === null || value === undefined) return true; // Check for null and undefined
      if (typeof value === 'string' && value.trim() === '') return true; // Check for empty strings or whitespace
      if (value instanceof File && !value.name) return true; // Check for File object with no name
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
    const requiredFields = ['name', 'base_price'];
    requiredFields.forEach(field => {
      if (isEmpty(formData[field])) {
        errors[field] = 'This field is required';
      }
    });

    // check image_url    
    if (isEmpty(imgData['image_url'])) {
      errors['image_url'] = 'This field is required';
    }

    // Validate float fields
    const floatFields = ['base_price',];
    floatFields.forEach(field => {
      if (!isValidFloat(formData[field])) {
        errors[field] = 'Please enter a valid number';
      }
    });
    return errors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm(formData, imgData);
    if (Object.keys(validationErrors).length > 0) {
      console.log(validationErrors);

      setErrors(validationErrors)
      return;
    } else {
      setErrors({})
    }

    const method = mode === 'edit' ? 'put' : 'post';
    const apiUrl = mode === 'edit'
      ? `/restaurants/menu-items/${formData.id}/`
      : '/restaurants/menu-items/';
    setIsLoading(true);



    API[method](apiUrl, formData)
      .then(response => {
        const imgFormData = new FormData();
        // Check if image_url is a File object
        if (imgData?.image_url instanceof File) {
          imgFormData.append('image_url', imgData?.image_url);
        }
        if (imgFormData.has('image_url')) {
          // Add menu-item image
          imgFormData.append('menu_item', response.data.id);
          // Check if imgData has an id (update via PUT) or not (create via POST)
          const apiurl = imgData?.id
            ? `/restaurants/menu-item-images/${imgData.id}/`  // PUT request (update)
            : `/restaurants/menu-item-images/`; // POST request (create)
          const apimethod = imgData?.id ? 'put' : 'post';
          API[apimethod](apiurl, imgFormData, { headers: { "Content-Type": "multipart/form-data" } })
            .then(() => {
              setMessage(mode === 'add' ? "Gift card added successfully!" : "Gift card updated successfully!");
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
          setMessage(mode === 'add' ? "Gift card added successfully!" : "Gift card updated successfully!");
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

  const changeExpiryDate = () => {
    setIsExpirySaving(true);
    const apiurl = expiryDateObject?.id
      ? `/user/settings/${expiryDateObject.id}/`
      : `/user/settings/`;
    const apimethod = expiryDateObject?.id ? 'put' : 'post';
    API[apimethod](apiurl, { key: 'gift_card_expiry_duration', value: expiryDate })
      .then((response) => {
        loadExpiryDate();
        setIsExpirySaving(false);
      })
      .catch((error) => {
        setIsExpirySaving(false);
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
      });
  }

  return (
    <div className="giftcard-add-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h5>
                {mode === 'edit' ? 'Edit Gift Card' : 'Create Gift Card'}
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <div className="input-items">
                    <div className="row gy-3">
                      {/* Expiry Date */}
                      <div className="col-xl-12">
                        <div className="expiry input-box">
                          <div>
                            <h6>Expiry Date
                              <span className="expiry-info"> (The expiry time is calculated from the creation date.)</span>
                            </h6>
                            <div className="expiry-input">
                              <input
                                type="text"
                                name="expiry_year"
                                id="expiry_year"
                                placeholder="Year"
                                value={parseInt(expiryDate.split("-")[0], 10) || ""}
                                onChange={handleExpiryChange}
                              />
                              <input
                                type="text"
                                name="expiry_month"
                                id="expiry_month"
                                placeholder="Month"
                                value={parseInt(expiryDate.split("-")[1], 10) || ""}
                                onChange={handleExpiryChange}
                              />
                              <input
                                type="text"
                                name="expiry_day"
                                id="expiry_day"
                                placeholder="Day"
                                value={parseInt(expiryDate.split("-")[2], 10) || ""}
                                onChange={handleExpiryChange}
                              />

                              <div className="change-btn" onClick={changeExpiryDate}>
                                {isExpirySaving ? (
                                  <div className="spinner-border spinner-border-sm " role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                ) : (
                                  'Change'
                                )}
                              </div>
                            </div>
                          </div>

                          {errors.expiry_date && <div className="text-danger">{errors.expiry_date}</div>}
                        </div>

                      </div>
                      {/* Name */}
                      <div className="col-xl-6">
                        <div className="input-box">
                          <h6>Gift card Title</h6>
                          <input type="text" name="name" id="name" placeholder="Enter Title"
                            value={formData.name} onChange={handleInputChange} />
                          {errors.name && <div className="text-danger">{errors.name}</div>}
                        </div>
                      </div>
                      {/* Amount */}
                      <div className="col-xl-6">
                        <div className="input-box">
                          <h6>Amount</h6>
                          <input type="text" name="base_price" id="base_price" placeholder="Enter Amount"
                            value={formData.base_price} onChange={handleInputChange} />
                          {errors.base_price && <div className="text-danger">{errors.base_price}</div>}
                        </div>
                      </div>


                      {/* IMAGE =========  */}
                      <div className="col-xl-6">
                        <div className="input-box image-input">
                          <h6>Image</h6>
                          <div className="d-flex justify-content-between">
                            <input type="file" onChange={handleFileSelect} accept="image/*" />
                            {imagePreview ? (
                              <div>
                                <img src={imagePreview} className="preview" alt="Preview" />
                              </div>
                            ) : (
                              <></>
                            )}

                          </div>
                          {errors.image_url && <div className="text-danger">{errors.image_url}</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center mt-2  ">

                <button className="btn theme-outline mt-2 me-5" type="submit" onClick={() => navigate('/admin/gift-card/list')} >Cancel</button>
                <button className="btn theme-btn mt-2" type="submit" onClick={handleSubmit}>Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => navigate('/admin/gift-card/list')} />}
      {/* {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'users'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>} */}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default GiftCardAdd