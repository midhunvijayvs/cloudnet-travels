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
import SupportPagesLayout from '../../common-components/SupportPagesLayout/SupportPagesLayout.js'

const ProfilePage = ({userData, loadUserData}) => {

  const navigate = useNavigate()

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
    loadUserData();

  }, []);







  return (
    <SupportPagesLayout currentActiveIndex={0} title="My Profile" breadcrumb={[{ name: "Home", link: "/" }, { name: "My Profile", link: "#" }]}>
      {userData&&
        <div className='user-profile-page'>

        <h5 className='title'>My Profile</h5>
        
        <table>
        
          <tr>
            <th></th>
            <th></th>
          </tr>

          <tr>
            <td>
              <div className='label me-5'>Agency ID:</div>
            </td>
            <td>
              <h5>CLDNTAGNT{userData.agency.id}</h5>
            </td>
          </tr>

          <tr>
            <td>
              <div className='label me-5'>Agency Name:</div>
            </td>
            <td>
              <h5>{userData.agency.agency_name}</h5>
            </td>
          </tr>

          <tr>
            <td>
              <div className='label me-5'>Office Address:</div>
            </td>
            <td>
              <h5>{userData.agency.office_address}</h5>
            </td>
          </tr>

          <tr>
            <td>
              <div className='label me-5'>Contact Person:</div>
            </td>
            <td>
              <h5>{userData.first_name} {userData.last_name}</h5>
            </td>
          </tr>

          <tr>
            <td>
              <div className='label me-5'>Email ID:</div>
            </td>
            <td>
              <h5>{userData.email}</h5>
            </td>
          </tr>


          <tr>
            <td>
              <div className='label me-5'>Phone No.:</div>
            </td>
            <td>
              <h5>+91 {userData.phone_number}</h5>
            </td>
          </tr>

           <tr>
            <td>
              <div className='label me-5'>Alternative Phone No.:</div>
            </td>
            <td>
              <h5>+91 {userData.agency.alternative_phone_number}</h5>
            </td>
          </tr>

         <tr>
            <td>
              <div className='label me-5'>Home Address:</div>
            </td>
            <td>
              <h5>{userData.agency.home_address}</h5>
            </td>
          </tr>

            <tr>
            <td>
              <div className='label me-5'>ID Proof Number:</div>
            </td>
            <td>
              <h5>{userData.agency.govt_id_number}</h5>
            </td>
          </tr>

            <tr>
            <td>
              <div className='label me-5'>Joined On:</div>
            </td>
            <td>
              <h5>{userData.agency.joined_on}</h5>
            </td>
          </tr>

        <tr>
            <td>
              <div className='label me-5'>Account Status:</div>
            </td>
            <td>
              <h5 className={userData.is_deactivated?"text-danger" : "text-success"}>{userData.is_deactivated?"Decativated":"Active"}</h5>
            </td>
          </tr>

               <tr>
            <td>
              <div className='label me-5'>WALLET BALANCE:</div>
            </td>
            <td>
              <h5>₹ {userData.agency.wallet_balance}</h5>
            </td>
          </tr>

        </table>

      </div>
      }
      {isPasswordEditPopup &&
        <ChangePasswordPopup setterFunction={setIsPasswordEditPopup} loadData={loadUserData} />

      }
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={loadUserData} />
      {/* {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => handleSuccessButton()} />} */}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </SupportPagesLayout>
  )

}

export default ProfilePage