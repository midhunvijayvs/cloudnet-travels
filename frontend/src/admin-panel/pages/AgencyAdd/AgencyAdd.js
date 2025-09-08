import React from "react";
import { useEffect, useState } from "react";
import $, { error } from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./AgencyAdd.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import PhoneInputField from "../../../authentication/pages/CustomPhone/CustomPhoneInput";
import { isValidPhoneNumber } from "libphonenumber-js";
import { PlusSquare } from "react-feather";


const AgencyAdd = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    agency_name: "",
    first_name: "",
    last_name: "",
    email: "",
    country_code: "+91",
    phone_number: "",
    gender: "male",
    dob: "",
    home_address: "",
    govt_id_number: "",
    is_id_verified: false,
    office_address: "",
    password: "",
    confirmPassword: "",
    agency_name: "",
    alternative_phone_number: "",
            notes:""


  });

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordShown1, showPassword1] = useState(false);
  const [passwordShown2, showPassword2] = useState(false);
  const [isHovered, setIsHovered] = useState(false);


  const [errors, setErrors] = useState({});
  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };



  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])



  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form fields
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    console.log(formData);

    if (Object.keys(validationErrors).length === 0) {
      // Perform the API call
      setIsLoading(true)
      API.post('/api/agency/register/', formData)
        .then((response) => {
          setIsLoading(false)
          setFormData({
            agency_name: "",
            first_name: "",
            last_name: "",
            email: "",
            country_code: "+91",
            phone_number: "",
            gender: "male",
            dob: "",
            home_address: "",
            govt_id_number: "",
            is_id_verified: false,
            office_address: "",
            password: "",
            confirmPassword: "",
            agency_name: "",
            alternative_phone_number: "",
            notes:""

          })
          setMessage(`User created successfully.\n Agency ID: ${response.data.agency_id} \n User Name: ${response.data.username} \n Email: ${response.data.email}  \n Click this url to reset your password: ${response.data.reset_url}`);
          setIsMessageModalOpen(true);

        })
        .catch((error) => {
          setIsLoading(false)
          setMessage(error.response?.data?.message || error.message);
          setIsErrorModalOpen(true);

        })

    }
  };

  const validateForm = (data) => {
    const errors = {};

    // --- Owner's Personal Details ---
    if (!data.first_name?.trim()) {
      errors.first_name = "First name is required.";
    }

    if (!data.last_name?.trim()) {
      errors.last_name = "Last name is required.";
    }

    if (!data.email?.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Invalid email address.";
    }

    if (!data.phone_number?.trim()) {
      errors.phone_number = "Phone number is required.";
    } else if (!/^\d{10}$/.test(data.phone_number)) {
      errors.phone_number = "Enter a valid 10 digit phone number (no spaces/country code).";
    }

    if (!data.gender?.trim()) {
      errors.gender = "Gender is required.";
    }

    if (!data.dob?.trim()) {
      errors.dob = "Date of Birth is required.";
    }

    if (!data.home_address?.trim()) {
      errors.home_address = "Home address is required.";
    }

    if (!data.govt_id_number?.trim()) {
      errors.govt_id_number = "Government ID number is required.";
    }

    if (!data.is_id_verified) {
      errors.is_id_verified = "Please verify the ID card.";
    }

    // Password validation
    if (!data.password?.trim()) {
      errors.password = "Password is required.";
    } else if (data.password.length < 12) {
      errors.password = "Password must be at least 12 characters.";
    } else if (data.password.length > 127) {
      errors.password = "Maximum allowed password length is 127 characters.";
    } else {
      if (!/[A-Z]/.test(data.password)) {
        errors.password = "Password must contain at least one uppercase letter.";
      } else if (!/\d/.test(data.password)) {
        errors.password = "Password must contain at least one number.";
      } else if (!/[^A-Za-z0-9]/.test(data.password)) {
        errors.password =
          "Password must contain at least one special character (!@#$%^&*).";
      }
    }

    if (!data.confirmPassword?.trim()) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

   

    if (!data.agency_name?.trim()) {
      errors.agency_name = "Agency name is required.";
    }

    if (!data.office_address?.trim()) {
      errors.office_address = "Office address is required.";
    }

    if (!data.alternative_phone_number?.trim()) {
      errors.alternative_phone_number = "Alternative phone number is required.";
    } else if (!/^\d{10}$/.test(data.alternative_phone_number)) {
      errors.alternative_phone_number = "Enter a valid 10 digit phone number (no spaces/country code).";
    }

    // NOTE field is optional → no validation required

    return errors;
  };


  // Utility function to generate secure password
  const generateSecurePassword = (length = 12) => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+[]{}|;:,.<>?";

    const allChars = upper + lower + numbers + special;

    let password = "";
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Fill remaining length with random characters
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password.split("").sort(() => Math.random() - 0.5).join("");
  };

  return (
    <div className="user-add-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h5>Add New Agency</h5>
                    </div>
                    <div className="card-body">

                      <div className="input-items">
                        <div className="row gy-3">
                          <div className="col-md-6">
                            <h5 className="mb-4">Owner's Personal Details</h5>
                          </div>
                        </div>

                        <div className="row gy-3">


                          <div className="col-md-6">
                            <div className="input-box">
                              <h6>First Name</h6>
                              <input type="text" name="first_name" placeholder="Enter First Name"
                                value={formData.first_name} onChange={handleInputChange} />
                              {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-box">
                              <h6>Last Name</h6>
                              <input type="text" name="last_name" placeholder="Enter Last Name"
                                value={formData.last_name} onChange={handleInputChange} />
                              {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="input-box">
                              <h6>Email</h6>
                              <input type="email" name="email" placeholder="Enter Email Address"
                                value={formData.email} onChange={handleInputChange} />
                              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-box">
                              <h6>Phone Number(This is the primary number linked for account identity and recovery)</h6>
                              <input type="text" name='phone_number' placeholder="Enter 10 digit phone number (no country code required)"
                                value={formData.phone_number} onChange={handleInputChange} />
                              {errors.phone_number && <div className="invalid-feedback">{errors.phone_number}</div>}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-box">
                              <h6>Gender</h6>
                              <select type="text" name="gender"
                                value={formData.gender} onChange={handleInputChange} >
                                <option value={"male"}>male</option>
                                <option value={"female"}>female</option>
                                <option value={"Do not wish to specify"}>Do not wish to specify</option>
                              </select>
                              {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="input-box">
                              <h6>Date of Birth</h6>
                              <input type="date" name="dob"
                                value={formData.dob} onChange={handleInputChange} />

                              {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="input-box">
                              <h6>Home Address </h6>
                              <textarea type={"text"} name="home_address" placeholder="Enter Your Home Address"
                                value={formData.home_address} onChange={handleInputChange}
                              />

                              {errors.home_address && <div className="invalid-feedback">{errors.home_address}</div>}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="input-box">
                              <h6>Govt. ID Card Number(Aadhar/PAN/Driving Licence/Voter ID) </h6>
                              <input type={"text"} name="govt_id_number" placeholder="Enter id number"
                                value={formData.govt_id_number} onChange={handleInputChange}
                              />
                              {errors.govt_id_number && <div className="invalid-feedback">{errors.govt_id_number}</div>}

                              <div className="d-flex mt-4">
                                <input type={"checkbox"} name="is_id_verified" className="w-25"
                                  checked={formData.is_id_verified} onChange={handleInputChange}
                                /><h6>Is ID Card Verified? </h6>
                              </div>

                              {errors.is_id_verified && <div className="invalid-feedback">{errors.is_id_verified}</div>}

                            </div>
                          </div>


                          <div className="col-md-6">
                            <div className="input-box password-container">
                              <div className="d-flex justify-content-between">
                                <h6>Password </h6>
                                <span className="hint-btn"
                                  onMouseEnter={() => setIsHovered(true)}
                                  onMouseLeave={() => setIsHovered(false)}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-info"
                                  >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="16" x2="12" y2="12" />
                                    <line x1="12" y1="8" x2="12" y2="8" />
                                  </svg>
                                </span>
                              </div>
                              <div className="form-input">
                                <input type={passwordShown1 ? "text" : "password"} name="password" placeholder="Enter Password"
                                  value={formData.password} onChange={handleInputChange}
                                />
                                <span className="password-eye" onClick={() => showPassword1(!passwordShown1)}>
                                  {passwordShown1 ?

                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M1 12.668C1 12.668 5 4.66797 12 4.66797C19 4.66797 23 12.668 23 12.668C23 12.668 19 20.668 12 20.668C5 20.668 1 12.668 1 12.668Z" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                      <path d="M12 15.668C13.6569 15.668 15 14.3248 15 12.668C15 11.0111 13.6569 9.66797 12 9.66797C10.3431 9.66797 9 11.0111 9 12.668C9 14.3248 10.3431 15.668 12 15.668Z" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    :


                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <g clip-path="url(#clip0_1777_2198)">
                                        <path d="M17.94 18.608C16.2306 19.911 14.1491 20.6329 12 20.668C5 20.668 1 12.668 1 12.668C2.24389 10.3499 3.96914 8.3246 6.06 6.72799M9.9 4.90799C10.5883 4.74687 11.2931 4.66633 12 4.66799C19 4.66799 23 12.668 23 12.668C22.393 13.8036 21.6691 14.8727 20.84 15.858M14.12 14.788C13.8454 15.0827 13.5141 15.3191 13.1462 15.4831C12.7782 15.6471 12.3809 15.7353 11.9781 15.7424C11.5753 15.7495 11.1752 15.6754 10.8016 15.5245C10.4281 15.3736 10.0887 15.149 9.80385 14.8641C9.51897 14.5793 9.29439 14.2399 9.14351 13.8664C8.99262 13.4928 8.91853 13.0927 8.92563 12.6899C8.93274 12.2871 9.02091 11.8898 9.18488 11.5218C9.34884 11.1538 9.58525 10.8226 9.88 10.548" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M1 1.66797L23 23.668" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                      </g>
                                      <defs>
                                        <clipPath id="clip0_1777_2198">
                                          <rect width="24" height="24" fill="white" transform="translate(0 0.667969)" />
                                        </clipPath>
                                      </defs>
                                    </svg>
                                  }

                                </span>
                              </div>
                              {errors.password && <div className="invalid-feedback">{errors.password}</div>}

                              {isHovered && <div className="password-hint">
                                <div>
                                  <div>Must be at least 12 characters long.</div>
                                  <div>Contain at least one uppercase letter.</div>
                                  <div>Contain at least one number.</div>
                                  <div>Contain at least one special character (!@#$%^&*).</div>
                                </div>
                              </div>
                              }

                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="input-box">
                              <h6>Confirm Password</h6>
                              <div className="form-input">
                                <input type={passwordShown2 ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password"
                                  value={formData.confirmPassword} onChange={handleInputChange} />
                                <span className="password-eye" onClick={() => showPassword2(!passwordShown2)}>
                                  {passwordShown2 ?

                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M1 12.668C1 12.668 5 4.66797 12 4.66797C19 4.66797 23 12.668 23 12.668C23 12.668 19 20.668 12 20.668C5 20.668 1 12.668 1 12.668Z" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                      <path d="M12 15.668C13.6569 15.668 15 14.3248 15 12.668C15 11.0111 13.6569 9.66797 12 9.66797C10.3431 9.66797 9 11.0111 9 12.668C9 14.3248 10.3431 15.668 12 15.668Z" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    :


                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <g clip-path="url(#clip0_1777_2198)">
                                        <path d="M17.94 18.608C16.2306 19.911 14.1491 20.6329 12 20.668C5 20.668 1 12.668 1 12.668C2.24389 10.3499 3.96914 8.3246 6.06 6.72799M9.9 4.90799C10.5883 4.74687 11.2931 4.66633 12 4.66799C19 4.66799 23 12.668 23 12.668C22.393 13.8036 21.6691 14.8727 20.84 15.858M14.12 14.788C13.8454 15.0827 13.5141 15.3191 13.1462 15.4831C12.7782 15.6471 12.3809 15.7353 11.9781 15.7424C11.5753 15.7495 11.1752 15.6754 10.8016 15.5245C10.4281 15.3736 10.0887 15.149 9.80385 14.8641C9.51897 14.5793 9.29439 14.2399 9.14351 13.8664C8.99262 13.4928 8.91853 13.0927 8.92563 12.6899C8.93274 12.2871 9.02091 11.8898 9.18488 11.5218C9.34884 11.1538 9.58525 10.8226 9.88 10.548" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M1 1.66797L23 23.668" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                      </g>
                                      <defs>
                                        <clipPath id="clip0_1777_2198">
                                          <rect width="24" height="24" fill="white" transform="translate(0 0.667969)" />
                                        </clipPath>
                                      </defs>
                                    </svg>
                                  }

                                </span>
                              </div>
                              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}

                            </div>
                          </div>

                          <div className="col-md-12 mt-3">
                            <button
                              type="button"
                              className="btn btn-outline-primary"
                              onClick={() => {
                                const newPassword = generateSecurePassword(14);
                                setFormData({
                                  ...formData,
                                  password: newPassword,
                                  confirmPassword: newPassword
                                });
                              }}
                            >
                              Click to Generate a Secure Password
                            </button>
                          </div>

                        </div>
                      </div>
                      <div className="input-items">
                        <h5 className="mb-4">Agency Details</h5>
                        <div className="row gy-3">
                         

                          <div className="col-md-6">
                            <div className="input-box">
                              <h6>Agency Name</h6>
                              <input type="text" name="agency_name" placeholder="Enter Agency Name"
                                value={formData.agency_name} onChange={handleInputChange} />
                              {errors.agency_name && <div className="invalid-feedback">{errors.agency_name}</div>}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="input-box">
                              <h6>Office Address </h6>
                              <textarea type={"text"} name="office_address" placeholder="Enter Your Office Address"
                                value={formData.office_address} onChange={handleInputChange}
                              />

                              {errors.office_address && <div className="invalid-feedback">{errors.office_address}</div>}
                            </div>
                          </div>


                          <div className="col-md-6">
                            <div className="input-box">
                              <h6>Office Phone Number(or any alternative Phone Number)</h6>
                              <input type="text" name='alternative_phone_number' placeholder="Enter 10 digit phone number (no country code required)"
                                value={formData.alternative_phone_number} onChange={handleInputChange} />
                              {errors.alternative_phone_number && <div className="invalid-feedback">{errors.alternative_phone_number}</div>}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="input-box">
                              <h6>Any Special Notes</h6>
                              <input type="text" name="notes" placeholder="Enter note if any"
                                value={formData.notes} onChange={handleInputChange} />
                              {errors.notes && <div className="invalid-feedback">{errors.notes}</div>}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-center my-2">
                        <button onClick={handleSubmit}
                          className="align-items-center btn save-button d-flex gap-2">
                          <PlusSquare />Submit
                        </button>
                      </div>
                    </div>


                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => navigate('/admin/agency/list')} />}
      {/* {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'users'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>} */}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default AgencyAdd