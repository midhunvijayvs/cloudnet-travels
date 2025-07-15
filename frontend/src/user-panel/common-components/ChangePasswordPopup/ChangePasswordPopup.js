
import React, { useState } from 'react';
import API from '../../../API';
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import './ChangePasswordPopup.scss'

const ChangePasswordPopup = ({ resourceName, setterFunction, loadData }) => {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formFrrors, setFormErrors] = useState({});
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ old_password: "", new_password: "", new_password2: "" })
  const [passwordShown, showPassword] = useState(false);
  const [passwordShown2, showPassword2] = useState(false);
  const [passwordShown3, showPassword3] = useState(false);

  const handlePasswordInputChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  const validateForm = (data) => {
    const errors = {};
    if (!data.old_password.trim()) {
      errors.old_password = "Current password is required.";
    }

    if (!data.new_password.trim()) {
      errors.new_password = "Password is required.";
    }
    else if (data.new_password.length < 12) {
      errors.new_password = "Password must be at least 12 characters.";
    }
    else if (data.new_password.length > 127) {
      errors.new_password = "Maximum allowed Password length is 127 characters.";
    }
    else {
      // Password must contain at least one letter, one number, and one special character
      if (!/[A-Z]/.test(data.new_password)) {
        errors.new_password = "Password must contain at least one uppercase letter.";
      } else if (!/\d/.test(data.new_password)) {
        errors.new_password = "Password must contain at least one number.";
      } else if (!/[!@#$%^&*]/.test(data.new_password)) {
        errors.new_password = "Password must contain at least one special character (!@#$%^&*).";
      }
    }

    if (!data.new_password2.trim()) {
      errors.new_password2 = "Confirm password is required.";
    } else if (data.new_password !== data.new_password2) {
      errors.new_password2 = "Passwords do not match.";
    }

    return errors
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = passwordData;
    const validationErrors = validateForm(formData);
    setFormErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true)
    API.post(`/user/change-password/`, passwordData)
      .then(response => {
        setIsLoading(false)
        setMessage("Password changed successfully.")
        setIsMessageModalOpen(true)
      })
      .catch(error => {
        setIsLoading(false)
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true)
      });
  }

  return (
    <div className='custom-modal change-password-popup'>
      <div className='card change-pw'>
        <div className='first-screen '>
          <h1>Change Password</h1>
          <div className='w-100'>
            <div className="form-group">
              <label for="old_password" className="form-label">
                Current Password</label>
              <div className='password-input'>
                <input type={passwordShown ? "text" : "password"} className="form-control" name='old_password'
                  value={passwordData.old_password}
                  onChange={handlePasswordInputChange}
                  placeholder="Enter your current password" />
                <span className="password-eye" onClick={() => showPassword(!passwordShown)}>
                  {passwordShown ?
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
              {formFrrors.old_password && <div className="invalid-feedback">{formFrrors.old_password}</div>}
            </div>
            <div className="form-group mt-2">
              <label for="new_password" className="form-label">
                New Password</label>
              <div className='password-input'>
                <input type={passwordShown2 ? "text" : "password"} className="form-control" name='new_password'
                  value={passwordData.new_password}
                  onChange={handlePasswordInputChange}
                  placeholder="Enter your new password" />
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
              {formFrrors.new_password && <div className="invalid-feedback">{formFrrors.new_password}</div>}
            </div>
            <div className="form-group mt-2">
              <label for="new_password2" className="form-label">Confirm Password</label>
              <div className='password-input'>
                <input type={passwordShown3 ? "text" : "password"} className="form-control" name='new_password2'
                  value={passwordData.new_password2}
                  onChange={handlePasswordInputChange}
                  placeholder="Confirm your password" />
                <span className="password-eye" onClick={() => showPassword3(!passwordShown3)}>
                  {passwordShown3 ?
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
              {formFrrors.new_password2 && <div className="invalid-feedback">{formFrrors.new_password2}</div>}
            </div>
          </div>


          <div className='footer'>
            <button type='button' className='btn-outlined' onClick={() => { setterFunction(false) }}>Discard</button>

            <button type='button' className='btn-primary ' onClick={handleSubmit}>Update</button>
          </div>
        </div>

      </div>
      <ErrorModal message={message} state={isErrorModalOpen} setterFunction={setIsErrorModalOpen} okClickedFunction={() => { setterFunction(false) }} />
      {isLoading && <FixedOverlayLoadingSpinner />}
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => { setterFunction(false); loadData() }} />}

    </div>
  );
};

export default ChangePasswordPopup;

