import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import $ from 'jquery';
import './AdminSettings.scss'


const AdminSettings = ({ mode }) => {

  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [expiryDateObject, setExpiryDateObject] = useState({});
  const [settingsData, setSettingsData] = useState([]);
  const [expiryDate, setExpiryDate] = useState("0000-00-00");

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  const loadSettingsData = () => {
    let apiUrl = `/user/settings/`;
    setIsLoading(true)
    API.get(apiUrl)
      .then(response => {
        const settings = response.data || [];
        setSettingsData(settings)
        // Filter the settings to find gift card expiry duration
        const expiryData = settings.find(
          item => item.key === "gift_card_expiry_duration"
        ) || {};

        setExpiryDateObject(expiryData);
        setExpiryDate(expiryData?.value ?? "0000-00-00");
        setIsLoading(false)
      })
      .catch(error => {
        setIsLoading(false)
      });
  }
  useEffect(() => {
    loadSettingsData();
  }, []);

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

  const changeExpiryDate = () => {
    setIsLoading(true);
    const apiurl = expiryDateObject?.id
      ? `/user/settings/${expiryDateObject.id}/`
      : `/user/settings/`;
    const apimethod = expiryDateObject?.id ? 'put' : 'post';
    API[apimethod](apiurl, { key: 'gift_card_expiry_duration', value: expiryDate })
      .then((response) => {
        loadSettingsData();
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
      });
  }

  // Helper function to get the value by key
  const getSettingValue = (key) => {
    const setting = settingsData.find(item => item.key === key);
    return setting ? setting.value : '';
  };

  // Handle input change with validation
  const handleInputChange = (key, newValue) => {
    // Define validation rules based on the key
    const validationRules = {
      LOCKOUT_TIME_MINUTES: { pattern: /^[0-9]{0,4}$/, max: 9999 }, // Max 4 digits
      USER_CANCELLATION_TIME: { pattern: /^[0-9]{0,3}$/, max: 999 }, // Max 3 digits
      ORDER_COMPLETION_DAYS: { pattern: /^[0-9]{0,3}$/, max: 999 }, // Max 3 digits
      REWARD_AMOUNT: { pattern: /^[0-9]{0,4}(\.[0-9]{0,2})?$/, max: 9999.99 }, // Max 4 digits + 2 decimal places
    };

    if (validationRules[key]) {
      const { pattern, max } = validationRules[key];

      // Allow empty input for backspacing
      if (newValue === "" || (pattern.test(newValue) && parseFloat(newValue) <= max)) {
        setSettingsData(prevData =>
          prevData.map(item =>
            item.key === key ? { ...item, value: newValue } : item
          )
        );
      }
    }
  };


  // Handle update click to send updated data to API
  const handleUpdate = (key) => {
    const setting = settingsData.find(item => item.key === key);
    if (setting) {
      setIsLoading(true)
      API.put(`/user/settings/${setting.id}/`, { key: key, value: setting.value })
        .then(response => {
          setIsLoading(false)
          loadSettingsData()
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
      <div className="admin-settings-page page-body">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h5>
                Admin Settings
              </h5>
            </div>
            <div className='card-body'>
              <div className="row">
                <div className="col-xxl-3 col-xl-4">
                  <ul className="nav setting-main-box sticky theme-scrollbar" id="v-pills-tab" role="tablist"
                    aria-orientation="vertical">
                    <li>
                      <button className="nav-link active" id="basicInfo-tab" data-bs-toggle="pill"
                        data-bs-target="#basicInfo" role="tab"
                        aria-controls="basicInfo" aria-selected="false"
                      >
                        <i className="ri-settings-fill"></i>Basic Settings</button>
                    </li>
                    <li>
                      <button className="nav-link" id="GiftCard-tab" data-bs-toggle="pill"
                        data-bs-target="#GiftCard" role="tab"
                        aria-controls="GiftCard" aria-selected="false"
                      >
                        <i className="ri-gift-fill"></i>Gift & Rewards</button>
                    </li>
                  </ul>
                </div>
                <div className="col-xxl-9 col-xl-8 col-12">
                  <div className="restaurant-tab">
                    <div className="tab-content" id="v-pills-tabContent">
                      <div className="tab-pane fade show active" id="basicInfo" role="tabpanel"
                        aria-labelledby="basicInfo-tab">
                        <div className="input-items">
                          {/* General Settings */}
                          <div className='settings-item row gy-3'>
                            {/* Lockout Time */}
                            <div className="col-12">
                              <div className='label'>
                                Lockout Time
                                <div className='instructions'>
                                  The time duration for which the user account will be locked after 5 incorrect password attempts. Specify the duration in minutes.
                                </div>
                              </div>
                              <div className="input-box expiry">
                                <div className="input-container">
                                  <input
                                    type="text"
                                    name="LOCKOUT_TIME_MINUTES"
                                    id="LOCKOUT_TIME_MINUTES"
                                    placeholder="Minutes"
                                    value={getSettingValue("LOCKOUT_TIME_MINUTES")}
                                    onChange={(e) => handleInputChange("LOCKOUT_TIME_MINUTES", e.target.value)}
                                  />
                                  <span className="unit">Minutes</span>
                                </div>
                                <div className="change-btn" onClick={() => handleUpdate("LOCKOUT_TIME_MINUTES")}>
                                  Update
                                </div>
                              </div>
                            </div>

                            {/* Order Cancellation Time */}
                            <div className="col-12">
                              <div className='label'>
                                Order Cancellation Time
                                <div className='instructions'>
                                  The time interval within which a user can cancel their order after placing it. Specify the duration in minutes.
                                </div>
                              </div>
                              <div className="input-box expiry">
                                <div className="input-container">
                                  <input
                                    type="text"
                                    name="USER_CANCELLATION_TIME"
                                    id="USER_CANCELLATION_TIME"
                                    placeholder="Minutes"
                                    value={getSettingValue("USER_CANCELLATION_TIME")}
                                    onChange={(e) => handleInputChange("USER_CANCELLATION_TIME", e.target.value)}
                                  />
                                  <span className="unit">Minutes</span>
                                </div>
                                <div className="change-btn" onClick={() => handleUpdate("USER_CANCELLATION_TIME")}>
                                  Update
                                </div>
                              </div>
                            </div>

                            {/* Order Completion Days */}
                            <div className="col-12">
                              <div className='label'>
                                Order Completion Days
                                <div className='instructions'>
                                  The time period after which a user cannot raise complaints regarding an order. After this duration, credit balance points will be added to the user's account for their use. This period also determines when money is transferred to the restaurant if the settlement is set to automatic. Specify the duration in days.
                                </div>
                              </div>
                              <div className="input-box expiry">
                                <div className="input-container">
                                  <input
                                    type="text"
                                    name="ORDER_COMPLETION_DAYS"
                                    id="ORDER_COMPLETION_DAYS"
                                    placeholder="Days"
                                    value={getSettingValue("ORDER_COMPLETION_DAYS")}
                                    onChange={(e) => handleInputChange("ORDER_COMPLETION_DAYS", e.target.value)}
                                  />
                                  <span className="unit">Days</span>
                                </div>
                                <div className="change-btn" onClick={() => handleUpdate("ORDER_COMPLETION_DAYS")}>
                                  Update
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="tab-pane fade show" id="GiftCard" role="tabpanel"
                        aria-labelledby="GiftCard-tab">
                        <div className="input-items">
                          <div className='settings-item row gy-3' >
                            {/* Expiry Date */}
                            <div className="col-xl-12">
                              <div className='label'>
                                Gift Card Expiry Duration
                                <div className='instructions'>
                                  Define the validity period for gift cards, calculated from the date of purchase. Specify the duration in years, months, and days.
                                </div>
                              </div>
                              <div className="input-box expiry">
                                <div className="input-container">
                                  <input
                                    type="text"
                                    name="expiry_year"
                                    id="expiry_year"
                                    placeholder="Years"
                                    value={parseInt(expiryDate.split("-")[0], 10) || "0"}
                                    onChange={handleExpiryChange}
                                  />
                                  <span className="unit">Years</span>
                                </div>
                                <div className="input-container">
                                  <input
                                    type="text"
                                    name="expiry_month"
                                    id="expiry_month"
                                    placeholder="Months"
                                    value={parseInt(expiryDate.split("-")[1], 10) || "0"}
                                    onChange={handleExpiryChange}
                                  />
                                  <span className="unit">Months</span>
                                </div>
                                <div className="input-container">
                                  <input
                                    type="text"
                                    name="expiry_day"
                                    id="expiry_day"
                                    placeholder="Days"
                                    value={parseInt(expiryDate.split("-")[2], 10) || "0"}
                                    onChange={handleExpiryChange}
                                  />
                                  <span className="unit">Days</span>
                                </div>
                                <div className="change-btn" onClick={changeExpiryDate}>
                                  Update
                                </div>
                              </div>

                            </div>
                            {/* Reward Amount */}
                            <div className="col-12">
                              <div className='label'>
                                Reward Amount
                                <div className='instructions'>
                                  The number of points a user will earn after a referred user completes their first purchase. Specify the reward amount in points.
                                </div>
                              </div>
                              <div className="input-box expiry">
                                <div className="input-container">
                                  <input
                                    type="text"
                                    name="REWARD_AMOUNT"
                                    id="REWARD_AMOUNT"
                                    placeholder="GBP"
                                    value={getSettingValue("REWARD_AMOUNT")}
                                    onChange={(e) => handleInputChange("REWARD_AMOUNT", e.target.value)}
                                  />
                                  <span className="unit price">GBP</span>
                                </div>
                                <div className="change-btn" onClick={() => handleUpdate("REWARD_AMOUNT")}>
                                  Update
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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

export default AdminSettings