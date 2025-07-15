
import React, { useState } from 'react';
import "../../CustomPopup.scss";
import API from '../../API'
import FixedOverlayLoadingSpinner from "../../FixedOverlayLoadingSpinner"

import ErrorModal from "../../ErrorModal";
import PositiveModal from "../../PositiveModal";
import PhoneInputField from '../../authentication/pages/CustomPhone/CustomPhoneInput';
import './AddressAddPopup.scss'
import { isValidPhoneNumber } from 'libphonenumber-js';
import { error } from 'jquery';

const AddressAddPopup = ({ resourceName, setterFunction, mode, selectedId, loadData, selectedItem, setSelectedItem, userId, loadMainData, setAddressSelected, AddressSelected }) => {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSecondScreenShown, showSecondScreen] = useState(false)
  const [formFrrors, setFormErrors] = useState({});
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const onFieldChange = (e, key) => {
    console.log(e.target.value, key);
    var temp = { ...selectedItem };
    temp[key] = e.target.value;
    setSelectedItem(temp)
  }


  const validatePhoneNumber = (phoneNumber, countryCode) => {
    try {
      const parsedPhoneNumber = isValidPhoneNumber(`+${phoneNumber}`, countryCode);
      return parsedPhoneNumber ? null : 'Invalid phone number';
    } catch (error) {
      return 'Invalid phone number';
    }
  };
  const validateForm = (data) => {
    const errors = {};

    // Validate First Name
    if (!data.first_name?.trim()) {
      errors.first_name = "Required.";
    } else if (!/^[a-zA-Z\s]{2,}$/.test(data.first_name)) {
      errors.first_name = "First name must contain at least 2 letters and only letters.";
    }

    // Validate Last Name
    if (!data.last_name?.trim()) {
      errors.last_name = "Required.";
    } else if (!/^[a-zA-Z\s]{2,}$/.test(data.last_name)) {
      errors.last_name = "Last name must contain at least 2 letters and only letters.";
    }

    // Validate Posttown
    if (!data.posttown?.trim()) {
      errors.posttown = "Required.";
    } else if (!/^[a-zA-Z\s]{2,}$/.test(data.posttown)) {
      errors.posttown = "Post town must contain at least 2 letters and only letters.";
    }
    // Validate County
    if (!data.county?.trim()) {
      errors.county = "Required.";
    } else if (!/^[a-zA-Z\s]{2,}$/.test(data.county)) {
      errors.county = "County must contain at least 2 letters and only letters.";
    }

    // Validate Postcode
    if (!data.postcode || !data.postcode.trim()) {
      errors.postcode = "Required.";
    } else if (!/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(data.postcode)) {
      errors.postcode = "Invalid postcode format.";
    }
    // Validate Room Number (Optional)
    if (data.room_number?.trim() && !/^[a-zA-Z0-9\s\-\/]{1,10}$/.test(data.room_number)) {
      errors.room_number =
        "Only contain letters, numbers, spaces, hyphens, and slashes, up to 10 characters.";
    }

    // Validate Address Line 1 (Required)
    if (!data.address_line1?.trim()) {
      errors.address_line1 = "Required.";
    } else if (!/^[a-zA-Z0-9\s\-.,']{2,100}$/.test(data.address_line1)) {
      errors.address_line1 =
        "Must be between 2-100 characters.";
    }

    // Validate Organisation (Optional)
    if (data.organisation?.trim() && !/^[a-zA-Z0-9\s\-.,'&]{2,100}$/.test(data.organisation)) {
      errors.organisation =
        "Must be between 2-100 characters.";
    }

    // Validate Premise (Optional)
    if (data.premise?.trim() && !/^[a-zA-Z0-9\s\-.,'()]{2,100}$/.test(data.premise)) {
      errors.premise =
        "Must be between 2-100 characters.";
    }


    // Validate Street (Optional)
    if (data.street?.trim() && !/^[a-zA-Z0-9\s\-.,]{2,100}$/.test(data.street)) {
      errors.street = "Must be between 2-100 characters.";
    }



    if (resourceName === 'driver') {
      if (!data.from_date || !data.from_date.trim()) {
        errors.from_date = "required.";
      }
      if (!data.to_date || !data.to_date.trim()) {
        errors.to_date = "required.";
      }
      if (data.from_date && data.to_date) {
        const fromDate = new Date(data.from_date);
        const toDate = new Date(data.to_date);

        if (fromDate >= toDate) {
          errors.to_date = "To date must be greater than from date.";
        }
      }
    }
    if (resourceName === 'user') {
      if (!data.phone_number || !data.phone_number.trim()) {
        errors.phone_number = "Phone number is required.";
      }
      else if (validatePhoneNumber(data.phone_number, data.country_code)) {
        errors.phone_number = 'Invalid phone number'
      }
    }


    return errors;
  };

  const handleSubmit = (e) => {

    e.preventDefault();


    const validationErrors = validateForm(selectedItem);

    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      if (mode === "add") {
        setIsLoading(true)
        let apiUrl = `/user/address/`;
        if (userId) {
          selectedItem.user = userId
        }
        API.post(apiUrl, selectedItem)
          .then(response => {
            setIsLoading(false)


            setSelectedItem({})
            setMessage("Address added successfully.")
            setIsMessageModalOpen(true);
            if (loadMainData) {
              loadMainData();
            }
          })
          .catch(error => {
            setMessage(error.response.data.message);
            setIsErrorModalOpen(true)
            setIsLoading(false)
            console.log("err", error)

          });
      }
      else {
        if (userId) {
          selectedItem.user = userId
        }
        API.put(`/user/address/${selectedId}/`, selectedItem)
          .then(response => {

            setIsLoading(false)
            setMessage("Address updated successfully!")
            setIsMessageModalOpen(true)
            // Check if the updated address is the selected one            
            if (setAddressSelected && response?.data?.id === AddressSelected?.id) {
              setAddressSelected(null); // or update with appropriate value
            }
          })
          .catch(error => {
            setMessage(error.response.data.message);

            setIsLoading(false)
            setIsErrorModalOpen(true);
            setSelectedItem({})
          });
      }
    }
  }

  return (
    <div className='custom-modal address-add-popup'>
      <div className='card main'>

        <div className='first-screen'>
          <h1>{mode === "add" ? "Add New" : "Edit"} Address</h1>


          <div className="row mb-md-3">
            <div className="col-md-6">
              <label htmlFor="first_name">First Name</label>
              <input id="first_name" name="first_name" className={`form-control ${formFrrors.first_name ? "is-invalid" : ""}`} value={selectedItem.first_name} onChange={(e) => onFieldChange(e, "first_name")} ></input>
              {formFrrors.first_name && <div className="invalid-feedback">{formFrrors.first_name}</div>}

            </div>

            <div className="col-md-6">
              <label htmlFor="last_name"> Last Name</label>
              <input id="last_name" name="last_name" className={`form-control ${formFrrors.last_name ? "is-invalid" : ""}`} value={selectedItem.last_name} onChange={(e) => onFieldChange(e, "last_name")} ></input>
              {formFrrors.last_name && <div className="invalid-feedback">{formFrrors.last_name}</div>}

            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="number">Room Number</label>
              <input id="number" name="room_number" className="form-control" value={selectedItem.room_number} onChange={(e) => onFieldChange(e, "room_number")}></input>
              {formFrrors.room_number && <div className="invalid-feedback">{formFrrors.room_number}</div>}

            </div>

            <div className="col-md-6">
              <label htmlFor="address_line1">Address Line 1</label>
              <input id="address_line1" name="address_line1" className="form-control" value={selectedItem.address_line1} onChange={(e) => onFieldChange(e, "address_line1")} ></input>
              {formFrrors.address_line1 && <div className="invalid-feedback">{formFrrors.address_line1}</div>}
            </div>
          </div>



          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="organisation">Organisation</label>
              <input id="organisation" name="organisation" className="form-control" value={selectedItem.organisation} onChange={(e) => onFieldChange(e, "organisation")}></input>
              {formFrrors.organisation && <div className="invalid-feedback">{formFrrors.organisation}</div>}
            </div>

            <div className="col-md-6">
              <label htmlFor="premise">Premise</label>
              <input id="premise" name="premise" className="form-control" value={selectedItem.premise} onChange={(e) => onFieldChange(e, "premise")}></input>
              {formFrrors.premise && <div className="invalid-feedback">{formFrrors.premise}</div>}
            </div>



          </div>
          <div className="row mb-3">


            <div className="col-md-6">
              <label htmlFor="street">Street</label>
              <input id="street" name="street" className="form-control" value={selectedItem.street} onChange={(e) => onFieldChange(e, "street")}></input>
              {formFrrors.street && <div className="invalid-feedback">{formFrrors.street}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="posttown">Post Town</label>
              <input id="posttown" name="posttown" className={`form-control ${formFrrors.posttown ? "is-invalid" : ""}`} value={selectedItem.posttown} onChange={(e) => onFieldChange(e, "posttown")} required></input>
              {formFrrors.posttown && <div className="invalid-feedback">{formFrrors.posttown}</div>}
            </div>
          </div>

          <div className="row mb-3">


            <div className="col-md-6">
              <label htmlFor="postcode">Post Code</label>
              <input id="postcode" name="postcode" className={`form-control ${formFrrors.postcode ? "is-invalid" : ""}`} value={selectedItem.postcode} onChange={(e) => onFieldChange(e, "postcode")} maxlength="8" required></input>
              {formFrrors.postcode && <div className="invalid-feedback">{formFrrors.postcode}</div>}
            </div>
            <div className="col-md-6">
              <label htmlFor="county">County</label>
              <input id="county" name="county" className="form-control" value={selectedItem.county} onChange={(e) => onFieldChange(e, "county")}></input>
              {formFrrors.county && <div className="invalid-feedback">{formFrrors.county}</div>}
            </div>


          </div>

          {resourceName === 'user' &&
            <>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="country">Country</label>
                  <input id="country" name="country" className="form-control" disabled value={"United Kingdom"} onChange={(e) => onFieldChange(e, "country")}></input>
                </div>
                <div className="col-md-6">
                  <label htmlFor="is_office">Address Type</label>
                  <select id="is_office" name="is_office" className="form-select" value={selectedItem.is_office} onChange={(e) => onFieldChange(e, "is_office")}>

                    <option value={false}>Residential</option>
                    <option value={true}>Office</option>
                  </select>
                </div>
              </div>
              <div className="row mb-3">
                {/* <div className="col-md-12"> */}
                <label htmlFor="country">Phone Number</label>
                <PhoneInputField formData={selectedItem} setFormData={setSelectedItem} />
                {formFrrors.phone_number && <div className="invalid-feedback m-0 mb-1 position-relative">{formFrrors.phone_number}</div>}
                {/* </div> */}
              </div>
              <div className="row w-100 mb-3">
                <label className='p-0' htmlFor="delivery_instruction">Delivery Instructions</label>
                <textarea id="delivery_instruction" name="delivery_instruction" className="form-control"
                  placeholder="Enter any specific delivery instructions here (eg: Call me upon arrival) ..."
                  value={selectedItem.delivery_instruction} onChange={(e) => onFieldChange(e, "delivery_instruction")}>

                </textarea>
                {formFrrors.delivery_instruction && <div className="invalid-feedback">{formFrrors.delivery_instruction}</div>}
              </div>
            </>

          }

          {/* date need for drivers */}
          {resourceName === 'driver' &&
            <div className="row mb-5">
              <div className="col-md-6">
                <label htmlFor="from_date">From</label>
                <input type='date' id="from_date" name="from_date" className={`form-control ${formFrrors.from_date ? "is-invalid" : ""}`} value={selectedItem.from_date} onChange={(e) => onFieldChange(e, "from_date")} required></input>
                {formFrrors.from_date && <div className="invalid-feedback mb-2">{formFrrors.from_date}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="to_date"> To</label>
                <input type='date' id="to_date" name="to_date" className={`form-control ${formFrrors.to_date ? "is-invalid" : ""}`} value={selectedItem.to_date} onChange={(e) => onFieldChange(e, "to_date")}></input>
                {formFrrors.to_date && <div className="invalid-feedback mb-2">{formFrrors.to_date}</div>}
              </div>
            </div>
          }


          <div className='footer'>
            <button type='button' className='cancel-button' onClick={() => { setterFunction(false) }}>Discard</button>

            <button type='button' className='ok-button ' onClick={handleSubmit}> {mode === "add" ? "Save" : "Update"} Address</button>
          </div>
        </div>

      </div>
      <ErrorModal message={message} state={isErrorModalOpen} setterFunction={setIsErrorModalOpen} okClickedFunction={() => { window.location.reload() }} />
      {isLoading && <FixedOverlayLoadingSpinner />}
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => { setterFunction(false); loadData() }} />}

    </div>
  );
};

export default AddressAddPopup;

