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


  // useEffect(() => {
  //   setUserData(prevData => ({
  //     ...prevData,
  //     phone_number: phoneData.phone_number,
  //     country_code: phoneData.country_code
  //   }));
  // }, [phoneData]);

  // useEffect(() => {
  //   $(function () {
  //     $(window).scrollTop(0);
  //   });
  // }, [])
  useEffect(() => {
    loadData();

  }, []);


  

  const loadData = () => {

    const storedUserData = localStorage.getItem('userData');
    console.log('userdata frm profile:', storedUserData)
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }


  }


  return (
    <div className='user-profile-page'>
      <MiniBanner title="My Profile" breadcrumb={[{ name: "Home", link: "/" }, { name: "My Profile", link: "#" }]}></MiniBanner>

      <section className="sec-2">
        <div className="lhs">
          <GeneralSidebar activePageIndex={1} userData={userData} />
        </div>
        <div className="rhs">


          {/* <div className='w-100 d-flex  flex-lg-row mt-2 cr'>
            <div className='form-section me-3 bg-white box-shadow radius-11 p-5  mb-lg-0'>
              <div className="title-header option-title">
                <h5>Edit Profile</h5>
              </div>
              <div className='d-flex justify-content-between align-items-center mb-2'>
             
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
                      style={{ display: 'none' }} 
                    />
                  </label>
                 
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
          </div> */}
          <div className='w-100 d-flex  flex-lg-row mt-2 cr'>
            <div className='form-section me-3 bg-white box-shadow radius-11 p-5  mb-lg-0'>
              <div className="title-header option-title">
                <h5>My Profile</h5>
              </div>
              <div className='d-flex justify-content-between align-items-center mb-2'>

              </div>
              <div className='w-100 d-block d-md-flex '>
                <div className='w-50 me-2 mb-3'>
                  <div className='label me-5'>Agency ID:</div>

                </div>
                <div className='w-50 me-2 mb-3'>

                  <h5>{userData.agency_id}</h5>
                </div>
              </div>

              <div className='w-100 d-block d-md-flex '>
                <div className='w-50 me-2 mb-3'>
                  <div className='label me-5'>Agency Name:</div>
                </div>
                <div className='w-50 me-2 mb-3'>
                  <h5>{userData.agency_name}</h5>
                </div>
              </div>

              <div className='w-100 d-block d-md-flex '>
                <div className='w-50 me-2 mb-3'>
                  <div className='label me-5'>Contact Person:</div>
                </div>
                <div className='w-50 me-2 mb-3'>
                  <h5>{userData.contact_person}</h5>
                </div>
              </div>

              <div className='w-100 d-block d-md-flex '>
                <div className='w-50 me-2 mb-3'>
                  <div className='label me-5'>Email ID:</div>
                </div>
               <div className='w-50 me-2 mb-3'>
                  <h5>{userData.email_id}</h5>
                </div>
              </div>


              <div className='w-100 d-block d-md-flex '>
                <div className='w-50 me-2 mb-3'>
                  <div className='label me-5'>City:</div>
                </div>
             <div className='w-50 me-2 mb-3'>
                  <h5>{userData.city}</h5>
                </div>
              </div>

              <div className='w-100 d-block d-md-flex '>
                <div className='w-50 me-2 mb-3'>
                  <div className='label me-5'>Country:</div>
                </div>
              <div className='w-50 me-2 mb-3'>
                  <h5>{userData.country}</h5>
                </div>
              </div>

              <div className='w-100 d-block d-md-flex '>
                <div className='w-50 me-2 mb-3'>
                  <div className='label me-5'>BALANCE:</div>
                </div>
               <div className='w-50 me-2 mb-3'>
                  <h5>{userData.balance}</h5>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* {isConfirmModalOpen &&
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
      } */}

      {/* Password */}
      {isPasswordEditPopup &&
        <ChangePasswordPopup setterFunction={setIsPasswordEditPopup} loadData={loadData} />

      }
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={loadData} />
      {/* {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => handleSuccessButton()} />} */}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )

}

export default Profile 