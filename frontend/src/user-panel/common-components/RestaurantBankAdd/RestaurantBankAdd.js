import React, { useEffect, useState } from 'react'
import './RestaurantBankAdd.scss'
import API from "../../../API.js"
import ErrorModal from "../../../ErrorModal.js";
import PositiveModal from "../../../PositiveModal.js";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner.js"
import $ from 'jquery';


const RestaurantBankAdd = ({ restaurantId, userId, setData, data, handleInputChange, errors, saveFunction, isVerified }) => {
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const loadBankData = () => {
    if (restaurantId) {
      setIsLoading(true)
      let apiUrl = `/payments/receiver-bank-details/`;
      if (localStorage.getItem('userRole') == 'admin') {
        if (userId) {
          // console.log('*******restaurant-id:',restaurantId, 'user:',userId);
          apiUrl = `/payments/receiver-bank-details/?user=${userId}`
        } else {
          return;
        }
      }
      API.get(apiUrl)
        .then(response => {
          setIsLoading(false);
          setData(prevState => ({
            ...prevState,
            bank_details: response.data?.[0] || {},
          }));
        })
        .catch(error => {
          setMessage(error.response?.data?.message || error.message);
          setIsErrorModalOpen(true);
          setIsLoading(false)
        });
    }
  }
  useEffect(() => {
    loadBankData();
  }, [restaurantId, userId]);

  const handleSave = () => {
    saveFunction();
  }

  return (
    <div className='restaurant-bank-add'>
      <div className='top-sec'>
        <div className='title'>
          Bank Details
          {data.bank_details.is_bank_verified &&
            <span className='verified'>
              verified
              <i className="ri-checkbox-circle-line font-success"></i>
            </span>
          }
        </div>
        <div className='sub-text'>Provide your restaurant’s bank and account details to ensure smooth transactions.</div>
      </div>
      <div className="form-sec">
        <div className='row'>
          {/* account number */}
          <div className="col-md-6">
            <label>Bank Account Number</label>
            <div className="input-box">
              <div className="input-container">
                <input
                  type="text"
                  name="account_no"
                  value={data.bank_details.account_no}
                  onChange={handleInputChange('bank_details')}
                  placeholder='Enter Account Number'
                />
              </div>
              {errors.account_no && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.account_no}</div>}
            </div>
          </div>
          {/* account_holder_name */}
          <div className="col-md-6">
            <label>Bank Account Name</label>
            <div className="input-box">
              <div className="input-container">
                <input
                  type="text"
                  name="account_holder_name"
                  value={data.bank_details.account_holder_name}
                  onChange={handleInputChange('bank_details')}
                  placeholder='Enter Account Holder Name'
                />
              </div>
              {errors.account_holder_name && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.account_holder_name}</div>}
            </div>
          </div>
        </div>
        <div className='row'>
          {/* swift_code */}
          <div className="col-md-6">
            <label>Swift Code</label>
            <div className="input-box">
              <div className="input-container">
                <input
                  type="text"
                  name="swift_code"
                  value={data.bank_details.swift_code}
                  onChange={handleInputChange('bank_details')}
                  placeholder='Enter Swift Code'
                />
              </div>
              {errors.swift_code && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.swift_code}</div>}
            </div>
          </div>
          {/* sort_code */}
          <div className="col-md-6">
            <label>Sort Code</label>
            <div className="input-box">
              <div className="input-container">
                <input
                  type="text"
                  name="sort_code"
                  value={data.bank_details.sort_code}
                  onChange={handleInputChange('bank_details')}
                  placeholder='XX-XX-XX'
                />
              </div>
              {errors.sort_code && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.sort_code}</div>}
            </div>
          </div>
        </div>
        <div className='row'>
          {/* iban */}
          <div className="col-md-6">
            <label>IBAN</label>
            <div className="input-box">
              <div className="input-container">
                <input
                  type="text"
                  name="iban"
                  value={data.bank_details.iban}
                  onChange={handleInputChange('bank_details')}
                  placeholder='GBxx XXXX XXXX XXXX XXXX XX'
                />
              </div>
              {errors.iban && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.iban}</div>}
            </div>
          </div>
        </div>
      </div>
      {!data.bank_details.is_bank_verified &&
        <div className="row d-flex justify-content-center mb-2">
          <button onClick={handleSave} className="btn restaurant-button mt-1" disabled={data.bank_details.is_bank_verified}>Save and Proceed</button>
        </div>
      }



      {isLoading && <FixedOverlayLoadingSpinner />}
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}

    </div>
  )
}

export default RestaurantBankAdd