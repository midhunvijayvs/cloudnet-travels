import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import API from '../../../API';
import '../../common-components/MultipleImageUploader.css'
import './Profile.scss'
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import PhoneInputField from '../../../authentication/pages/CustomPhone/CustomPhoneInput';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { UserContext } from '../../../authentication/pages/UserContext';
import ChangePasswordPopup from '../../common-components/ChangePasswordPopup/ChangePasswordPopup';
import MiniBanner from '../../common-components/MiniBanner/MiniBanner.js'
import GeneralSidebar from '../../common-components/GeneralSidebar/GeneralSidebar.js';

const Profile = () => {

  const navigate = useNavigate()

  const [userData, setUserData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [imageError, setImageError] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(false);
  const [phoneData, setPhoneData] = useState({ phone_number: "", country_code: "" })
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmType, setConfirmType] = useState('deactivate');
  const { isLoggedIn, setIsLoggedIn, login, logout } = useContext(UserContext);
  const [isPasswordEditPopup, setIsPasswordEditPopup] = useState(false);


  useEffect(() => {
    setUserData(prevData => ({
      ...prevData,
      phone_number: phoneData.phone_number,
      country_code: phoneData.country_code
    }));
  }, [phoneData]);

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])
  useEffect(() => {
    loadData();

  }, []);


  const loadData = () => {
    API.get(`/user/users/${window.localStorage.getItem('userID')}`)
      .then(response => {
        setUserData(response.data);
        setPhoneData({ phone_number: response.data.phone_number, country_code: response.data.country_code })
        if (response.data.profile_image) {
          setPreviewImage(`${response.data.profile_image}`);
        }
      })
      .catch(error => {
        console.error(error);
      });


  }


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  const userID = localStorage.getItem('userID'); // Fetch the user ID from local storage

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    // Check image dimensions
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const validAspectRatio = aspectRatio >= 0.9 && aspectRatio <= 1.1;

      if (img.width <= 250 && img.height <= 250 && validAspectRatio) {
        if (file.size <= 300 * 1024) { // Max size in bytes (300 KB)
          setImageError(null)
          setIsImgLoading(true);
          setPreviewImage(URL.createObjectURL(file));

          const formData = new FormData();
          formData.append('profile_image', file);
          API.put(`/user/users/${userID}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
            .then(response => {
              setMessage("Profile image updated Successfully.")
              setConfirmType('')
              setIsMessageModalOpen(true)
              setIsImgLoading(false);
            })
            .catch(error => {
              setIsImgLoading(false);
              setMessage(error.response?.data?.message || error.message)
              setIsErrorModalOpen(true)
            });

        }
        else {
          setImageError('Image file size is too large.');
        }
      } else {
        setImageError('Image dimensions are not within the specified limits.');
      }
    };
  };


  const handleImageDelete = () => {
    API.put(`/user/users/${userID}/`, { profile_image: null })
      .then(response => {
        setPreviewImage(null);
        loadData();
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true)
      });
  };

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
    //Validate each field and add errors if necessary
    if (!data.first_name.trim()) {
      errors.first_name = "First name is required.";
    }
    if (!data.last_name.trim()) {
      errors.last_name = "Last name is required.";
    }

    if (!data.phone_number.trim()) {
      errors.phone_number = "Phone number is required.";
    }

    else if (validatePhoneNumber(data.phone_number, data.country_code)) {
      errors.phone_number = 'Invalid phone number'
    }
    if (!data.email.trim()) {
      errors.email = "Email is required.";
    }
    else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Invalid email address.";
    }
    const year = data.dob.split("-")[0];
  if (year.length !== 4) {
      errors.dob="Please enter a 4-digit year.";
  }
    return errors;
  };

  const update = () => {

    const formData = userData;
    delete formData['profile_image']
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    // Add `is_deleted` to formData only if its value is `true`
    if (formData.is_deleted) {
      formData.is_deleted = true;
    } else {
      delete formData.is_deleted;
    }

    setIsLoading(true)
    API.put(`/user/users/${userID}/`, formData,)
      .then(res => {
        loadData();
        setIsLoading(false)
        setMessage("Details updated Successfully.")
        setConfirmType('')
        setIsMessageModalOpen(true)
      })

      .catch(error => {
        setIsLoading(false)
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true)
      })

  }

  // de-activate
  const handleConfirmAction = () => {
    if (confirmType === 'deactivate') {
      deActivateAccount();
    } else if (confirmType === 'activate') {
      activateAccount();
    }
    setIsConfirmModalOpen(false);
  };
  const deActivateAccount = () => {
    setIsLoading(true)
    API.put(`/user/users/${userID}/`, { is_deactivated: true })
      .then(response => {
        setIsLoading(false);
        setIsConfirmModalOpen(false);
        setMessage('Your account has been successfully deactivated.')
        setIsMessageModalOpen(true);
      })
      .catch(error => {
        setIsLoading(false)
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true)
      });
  }
  const activateAccount = () => {
    setIsLoading(true)
    API.put(`/user/users/${userID}/`, { is_deactivated: false })
      .then(response => {
        setIsLoading(false);
        setIsConfirmModalOpen(false);
        setMessage('Your account has been successfully activated.')
        setConfirmType('')
        setIsMessageModalOpen(true);
      })
      .catch(error => {
        setIsLoading(false)
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true)
      });
  }

  const handleSuccessButton = () => {
    if (confirmType === 'deactivate') {
      logout();
      setIsLoggedIn(false);
      setTimeout(navigate("/admin"), 1000)
      setIsMessageModalOpen(false)
    } else {
      setIsMessageModalOpen(false)
    }
    setIsConfirmModalOpen(false);
  };


  return (
     <div className='user-profile-page'>
         <MiniBanner title="My Profile" breadcrumb={[{ name: "Home", link: "/" }, { name: "My Profile", link:"#" }]}></MiniBanner>

      <section className="sec-2">
            <div className="lhs">
              <GeneralSidebar activePageIndex={1} userData={userData} />
            </div>
            <div className="rhs"> 
         
         
          <div className='w-100 d-flex  flex-lg-row mt-2 cr'>
            <div className='form-section me-3 bg-white box-shadow radius-11 p-5  mb-lg-0'>
              <div className="title-header option-title">
                <h5>Edit Profile</h5>
              </div>
              <div className='d-flex justify-content-between align-items-center mb-2'>
                {/* <button className='white-btn px-3'><i className="fa-solid fa-pencil"></i></button> */}
              </div>
              <div className='w-100 d-block d-md-flex '>
                <div className='w-50 me-2 mb-3'>
                  <div className='label'>First Name</div>
                  <input id="first_name" name="first_name" value={userData.first_name} className='inp-D9D9D9 f-xs fw-500 w-100' required
                    onChange={handleInputChange} ></input>
                    <div className='invalid-feedback'>{errors.first_name}</div>
                </div>
                <div className='w-50 mb-3'>
                  <div className='label'>Last Name</div>
                  <input id="last_name" name="last_name" value={userData.last_name} className='inp-D9D9D9 f-xs fw-500 w-100'
                    onChange={handleInputChange} required></input>
                    <div className='invalid-feedback'>{errors.last_name}</div>
                </div>
              </div>
              <div className='w-100 d-block d-md-flex'>
                <div className='w-50 me-2 mb-3'>
                  <div className='label'>Phone Number</div>
                  {/* <input id="phone" name="phone" className='inp-D9D9D9 f-xs fw-500 w-100' required></input> */}
                  <PhoneInputField formData={phoneData} setFormData={setPhoneData} />
                  {errors.phone_number && <div className="invalid-feedback">{errors.phone_number}</div>}
                </div>

                <div className='w-50 mb-3'>
                  <div className='label'>Email</div>
                  <input id="email" name="email" value={userData.email} className='inp-D9D9D9 f-xs fw-500 w-100' disabled></input>
                    <div className='invalid-feedback'>{errors.email}</div>
                </div>
              </div>
              <div className='w-100 d-block d-md-flex'>
                <div className='w-50 me-2 mb-3'>
                  <div className='label'>Date of birth ( Optional)</div>
                  <input type="date" id="dob" name="dob" className='inp-D9D9D9 f-xs fw-500 w-100'
                    onChange={handleInputChange} value={userData.dob}></input>
                    <div className='invalid-feedback'>{errors.dob}</div>
                </div>
                <div className='w-50 mb-3'>
                  <div className='label'>Gender</div>
                  <select className="form-select" id="gender" name="gender" value={userData.gender} onChange={handleInputChange}>
                    <option value={'Male'}>Male</option>
                    <option value={'Female'}>Female</option>
                    <option value={'Non-binary'}>Non-binary</option>
                  </select>
                </div>
              </div>
              <div className='d-flex justify-content-end mt-3 button-box'>
                <button className='btn-outlined me-3' onClick={() => { navigate('/home') }}>Cancel</button>
                <button className='btn-primary ' onClick={() => update()}>Update</button>
              </div>
            </div>
            <div className='img-section bg-white box-shadow radius-11 mb-3 mb-lg-0 p-4'>

              <div className="profile-image-uploader d-flex flex-column justify-content-center align-items-center" style={{ position: "static", zIndex: 1, backgroundColor: "transparent", height: "fit-content" }}>

                <div className="image-preview-box">

                  {previewImage ?
                    <img src={previewImage} alt="" style={isImgLoading ? { opacity: '40%' } : { opacity: '100%' }} className="preview-image" />
                    :
                    <img src="/images/profile/avatar-no-profile-image.png"></img>
                  }
                  {previewImage &&
                    <button className="btn btn-small-danger d-flex justify-content-center  w-100 delete-btn" onClick={handleImageDelete}> <svg className="me-2" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M21.9878 6.41309H3.98779V9.41309C5.09236 9.41309 5.98779 10.3085 5.98779 11.4131V15.4131C5.98779 18.2415 5.98779 19.6557 6.86647 20.5344C7.74515 21.4131 9.15937 21.4131 11.9878 21.4131H13.9878C16.8162 21.4131 18.2304 21.4131 19.1091 20.5344C19.9878 19.6557 19.9878 18.2415 19.9878 15.4131V11.4131C19.9878 10.3085 20.8832 9.41309 21.9878 9.41309V6.41309ZM11.4878 11.4131C11.4878 10.8608 11.0401 10.4131 10.4878 10.4131C9.93551 10.4131 9.48779 10.8608 9.48779 11.4131V16.4131C9.48779 16.9654 9.93551 17.4131 10.4878 17.4131C11.0401 17.4131 11.4878 16.9654 11.4878 16.4131V11.4131ZM16.4878 11.4131C16.4878 10.8608 16.0401 10.4131 15.4878 10.4131C14.9355 10.4131 14.4878 10.8608 14.4878 11.4131V16.4131C14.4878 16.9654 14.9355 17.4131 15.4878 17.4131C16.0401 17.4131 16.4878 16.9654 16.4878 16.4131V11.4131Z" fill="#fff" fill-opacity="0.85" />
                      <path d="M11.0559 3.78368C11.1699 3.67736 11.421 3.58341 11.7703 3.51641C12.1196 3.4494 12.5475 3.41309 12.9878 3.41309C13.4281 3.41309 13.856 3.4494 14.2053 3.51641C14.5546 3.58341 14.8057 3.67736 14.9196 3.78368" stroke="#fff" strokeOpacity="0.85" strokeWidth="2" stroke-linecap="round" />
                    </svg>
                      Remove{localStorage.getItem('userRole') === 'admin' ? ' Image' : 'Logo'}
                    </button>}
                  {isImgLoading &&
                    <div
                      style={{

                        position: "absolute",
                        zIndex: "201",
                        top: "200px"
                      }}
                    >
                      <div className="spinner-border" role="status">
                        <span className="sr-only "></span>
                      </div>
                    </div>}

                </div>

                <div className=" mb-2 d-flex justify-content-center">
                  <label className="btn btn-secondary image-input-button w-100">
                    {previewImage ?
                      (localStorage.getItem('userRole') === 'admin' ? 'Change Image' : 'Change Logo')
                      : (localStorage.getItem('userRole') === 'admin' ? 'Choose an Image' : 'Choose a Logo')
                    }
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      style={{ display: 'none' }} // Hide the default file input
                    />
                  </label>
                  {/* <input className="btn btn-secondary image-input-button w-100" type="file"
                    accept="image/*" onChange={handleImageSelect} /> */}
                </div>


                {imageError && <p className="img-error-msg">{imageError}</p>}
                <p className="image-instruction text-center"> File size should be less than 300kB<br></br>
                  File resolution Max height: 250px and Max width:250px, in a square aspect ratio. </p>



              </div>
            </div>
          </div>
          
          <div className='w-100 d-flex  flex-lg-row mt-3 cr change-password-section'>
            {userData.auth_provider === 'email' &&
              <div className=" bg-white p-5">
                <h3 className="fw-medium dark-text">Change Password</h3>
                <>
                  <p className="content-color mt-2">
                    Keeping your password secure is essential for your account safety. If you believe your password has been compromised, or if you simply want to enhance your security, follow the steps below to change your password.
                  </p>

                  <div className="mt-3">
                    <strong className="dark-text">Important:</strong>
                    <ul className="content-color mt-2">
                      <li>Choose a strong password that is at least 8 characters long.</li>
                      <li>Use a combination of letters, numbers, and special characters.</li>
                      <li>Do not use easily guessable information, like birthdays or common words.</li>
                    </ul>
                  </div>

                  <div className='d-flex justify-content-start mt-3 button-box'>
                    <button onClick={() => { setConfirmType(''); setIsPasswordEditPopup(true); }}
                      className='btn save-button danger px-4 m-0 me-3' >
                      Change My Password
                    </button>
                  </div>
                </>

              </div>
            }
          </div>


        </div>
        </section>

      {isConfirmModalOpen &&
        <div className='custom-modal confirm-modal'>
          <div className='card'>
            <div className='first-screen'>
              <img
                src={`/images/${confirmType === 'deactivate' ? 'authentication-screens/logout-popup-icon.svg' :
                  confirmType === 'activate' ? 'authentication-screens/logout-popup-icon.svg' : 'delete-popup-icon.svg'}`} />
              <h1>{confirmType === 'deactivate' ? 'Deactivation' : confirmType === 'activate' ? 'Activate' : 'Delete'}</h1>
              {confirmType === 'cancel_delete_request' ?
                <p>Are you sure you want to cancel account deletion request?</p>
                :
                <p>Are you sure you want to {confirmType === 'deactivate' ? 'deactivate' : 'activate'} your account?</p>
              }
              <div className='footer'>
                <button type='button' className='cancel-button' onClick={() => { setIsConfirmModalOpen(false) }}>Cancel</button>
                <button type='button' className='ok-button'
                  onClick={handleConfirmAction} >
                  {confirmType === 'deactivate' ? 'Deactivate' :
                    confirmType === 'activate' ? 'Proceed' :
                      'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Password */}
      {isPasswordEditPopup &&
        <ChangePasswordPopup setterFunction={setIsPasswordEditPopup} loadData={loadData} />

      }
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={loadData} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => handleSuccessButton()} />}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )

}

export default Profile 