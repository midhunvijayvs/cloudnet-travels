import React from "react";
import { useEffect, useState } from "react";
import $, { error } from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./UsersAdd.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import PhoneInputField from "../../../authentication/pages/CustomPhone/CustomPhoneInput";
import { isValidPhoneNumber } from "libphonenumber-js";
import { PlusSquare } from "react-feather";


const UsersAdd = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    user_type: "user",
    first_name: "",
    last_name: "",
    phone_number: "",
    country_code: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  const validatePhoneNumber = (phoneNumber, countryCode) => {
    try {
      const parsedPhoneNumber = isValidPhoneNumber(`+${phoneNumber}`, countryCode);
      return parsedPhoneNumber ? null : 'Invalid phone number';
    } catch (error) {
      return 'Invalid phone number';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form fields
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    console.log(formData);

    if (Object.keys(validationErrors).length === 0) {
      // Perform the API call
      setIsLoading(true)
      API.post('/user/admin-register/', formData)
        .then((response) => {
          setIsLoading(false)
          setFormData({
            user_type: "user",
            first_name: "",
            last_name: "",
            phone_number: "",
            country_code: "",
            email: "",
            password: "",
            confirmPassword: "",
          })
          setMessage('User created successfully.');
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

    // Validate each field and add errors if necessary
    if (!data.first_name.trim()) {
      errors.first_name = "First name is required.";
    }

    if (!data.last_name.trim()) {
      errors.last_name = "Last name is required.";
    }
    if (!data.user_type.trim()) {
      errors.user_type = "Select User Type.";
    }

    if (!data.phone_number.trim()) {
      errors.phone_number = "Phone number is required.";
    }
    // else if (!/^\d{10}$/.test(data.phone_number)) {
    //   errors.phone_number = "Phone number must be 10 digits.";
    // }
    else if (validatePhoneNumber(data.phone_number, data.country_code)) {
      errors.phone_number = 'Invalid phone number'
    }

    if (!data.email.trim()) {
      errors.email = "Email is required.";
    }
    else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Invalid email address.";
    }

    if (!data.password.trim()) {
      console.log(data.password);

      errors.password = "Password is required.";
    }
    else if (data.password.length < 12) {
      errors.password = "Password must be at least 12 characters.";
    }
    else if (data.password.length > 127) {
      errors.password = "Maximum allowed Password length is 127 characters.";
    }
    else {
      // Password must contain at least one letter, one number, and one special character
      if (!/[A-Z]/.test(data.password)) {
        errors.password = "Password must contain at least one uppercase letter.";
      } else if (!/\d/.test(data.password)) {
        errors.password = "Password must contain at least one number.";
      } else if (!/[!@#$%^&*]/.test(data.password)) {
        errors.password = "Password must contain at least one special character (!@#$%^&*).";
      }
    }


    if (!data.confirmPassword.trim()) {
      errors.confirmPassword = "Password is required.";
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    // if(!tnc){
    //   errors.tnc = "Please accept our Terms & Conditions to proceed.";
    // }    
    return errors;
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
                      <h5>Add New User</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12 d-none">
                          <ul className="nav nav-pills flex-nowrap mb-3" id="pills-tab" role="tablist">
                            <li className="nav-item m-0" role="presentation">
                              <button className="nav-link active" id="pills-home-tab"
                                data-bs-toggle="pill" data-bs-target="#pills-home"
                                type="button">Account</button>
                            </li>
                            <li className="nav-item m-0 d-none" role="presentation">
                              <button className="nav-link" id="pills-profile-tab"
                                data-bs-toggle="pill" data-bs-target="#pills-profile"
                                type="button">Permission</button>
                            </li>
                          </ul>
                        </div>
                        <div className="col-12">
                          <div className="tab-content" id="pills-tabContent">
                            {/* Account Creation Form */}
                            <div className="tab-pane fade show active" id="pills-home" role="tabpanel">
                              <div className="input-items">
                                <div className="row gy-3">
                                  {/* User Type */}
                                  <div className="col-12 ">
                                    <div className="input-box">
                                      <h6>User Type</h6>
                                      <select className="form-select" name="user_type"
                                        value={formData.user_type} onChange={handleInputChange}>
                                        <option label="Select User Type" value={null}></option>
                                        <option value="user">Customer</option>
                                        <option value="restaurant">Restaurant</option>
                                        {/* <option value="driver">Driver</option> */}
                                        <option value="staff">Staff</option>
                                      </select>
                                      {errors.user_type && <div className="invalid-feedback">{errors.user_type}</div>}
                                    </div>
                                  </div>

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
                                      <input type="text" name="email" placeholder="Enter Email Address"
                                        value={formData.email} onChange={handleInputChange} />
                                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="input-box">
                                      <h6>Phone Number</h6>
                                      <PhoneInputField formData={formData} setFormData={setFormData} />
                                      {errors.phone_number && <div className="invalid-feedback">{errors.phone_number}</div>}
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
                                </div>
                              </div>
                              <div className="d-flex align-items-center justify-content-center my-2">
                                <button onClick={handleSubmit}
                                  className="align-items-center btn save-button d-flex gap-2">
                                  <PlusSquare />Add User
                                </button>
                              </div>
                            </div>

                            {/* Permission Tab */}
                            <div className="tab-pane fade d-none" id="pills-profile" role="tabpanel">
                              <div className="card-header-1">
                                <h5 className="mb-2">Product Related Permition</h5>
                              </div>
                              <div className="input-items">
                                <div className="row gy-3 mb-4">
                                  <div className="col-md-6">
                                    <div className="input-box">
                                      <h6>Add Product</h6>
                                      <div>
                                        <form className="radio-section">
                                          <label>
                                            <input type="radio" name="opinion" checked />
                                            <i></i>
                                            <span>Allow</span>
                                          </label>

                                          <label>
                                            <input type="radio" name="opinion" />
                                            <i></i>
                                            <span>Deny</span>
                                          </label>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="input-box">
                                      <h6>Update Product</h6>
                                      <div>
                                        <form className="radio-section">
                                          <label>
                                            <input type="radio" name="opinion" />
                                            <i></i>
                                            <span>Allow</span>
                                          </label>

                                          <label>
                                            <input type="radio" name="opinion" checked />
                                            <i></i>
                                            <span>Deny</span>
                                          </label>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="input-box">
                                      <h6>Delete Product</h6>
                                      <div>
                                        <form className="radio-section">
                                          <label>
                                            <input type="radio" name="opinion" />
                                            <i></i>
                                            <span>Allow</span>
                                          </label>

                                          <label>
                                            <input type="radio" name="opinion" checked />
                                            <i></i>
                                            <span>Deny</span>
                                          </label>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="input-box">
                                      <h6>Apply Discount</h6>
                                      <div>
                                        <form className="radio-section">
                                          <label>
                                            <input type="radio" name="opinion" checked />
                                            <i></i>
                                            <span>Allow</span>
                                          </label>

                                          <label>
                                            <input type="radio" name="opinion" />
                                            <i></i>
                                            <span>Deny</span>
                                          </label>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="card-header-1">
                                <h5 className="my-2">Category Related Permition</h5>
                              </div>
                              <div className="input-items">
                                <div className="row gy-3">
                                  <div className="col-md-6">
                                    <div className="input-box">
                                      <h6>Add Product</h6>
                                      <div>
                                        <form className="radio-section">
                                          <label>
                                            <input type="radio" name="opinion" checked />
                                            <i></i>
                                            <span>Allow</span>
                                          </label>

                                          <label>
                                            <input type="radio" name="opinion" />
                                            <i></i>
                                            <span>Deny</span>
                                          </label>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="input-box">
                                      <h6>Update Product</h6>
                                      <div>
                                        <form className="radio-section">
                                          <label>
                                            <input type="radio" name="opinion" />
                                            <i></i>
                                            <span>Allow</span>
                                          </label>

                                          <label>
                                            <input type="radio" name="opinion" checked />
                                            <i></i>
                                            <span>Deny</span>
                                          </label>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="input-box">
                                      <h6>Delete Product</h6>
                                      <div>
                                        <form className="radio-section">
                                          <label>
                                            <input type="radio" name="opinion" />
                                            <i></i>
                                            <span>Allow</span>
                                          </label>

                                          <label>
                                            <input type="radio" name="opinion" checked />
                                            <i></i>
                                            <span>Deny</span>
                                          </label>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="input-box">
                                      <h6>Apply Discount</h6>
                                      <div>
                                        <form className="radio-section">
                                          <label>
                                            <input type="radio" name="opinion" checked />
                                            <i></i>
                                            <span>Allow</span>
                                          </label>

                                          <label>
                                            <input type="radio" name="opinion" />
                                            <i></i>
                                            <span>Deny</span>
                                          </label>
                                        </form>
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
            </div>
          </div>
        </div>
      </div>


      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => navigate('/admin/users/list')} />}
      {/* {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'users'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>} */}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default UsersAdd