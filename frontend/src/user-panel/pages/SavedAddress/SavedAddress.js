import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import API from '../../../API';
import axios from 'axios';
import '../../common-components/ImageUploader.css'
import './SavedAddress.scss'
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import LogoutPopup from '../../../authentication/common-components/LogoutPopup/LogoutPopup';
import PhoneInputField from '../../../authentication/pages/CustomPhone/CustomPhoneInput';
import EmptyTableMessage from '../../../Empty';
import AddressAddPopup from '../../common-components/AddressAddPopup';
import DeleteConfirmModal from '../../../DeleteConfirmModal';
import AddressLocationAdd from '../../common-components/AddressLocationAdd/AddressLocationAdd';
import MiniBanner from '../../common-components/MiniBanner/MiniBanner.js'
import GeneralSidebar from '../../common-components/GeneralSidebar/GeneralSidebar.js';

const SavedAddress = ({ userData }) => {

  const navigate = useNavigate()



  const [data, setData] = useState(null);

  const [isLogoutModalShow, setLogoutModalShow] = useState(false)
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState({ first_name: "", last_name: "", postcode: "", posttown: "", country: 'United Kingdom' })


  const [primaryAddress, setPrimaryAddress] = useState(null)


  const [isAddressAddModalOpen, openAddressAddModal] = useState();
  const [mode, setMode] = useState("add");

  const [selectedId, selectId] = useState(null)

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  useEffect(() => {

    loadData()
  }, []);



  const loadData = () => {
    setData(null)
    API.get(`user/address/`)   //${window.localStorage.getItem('userID')}
      .then(response => {
        setData(response.data.results)
        setPrimaryAddress(response.data.results.find(x => x.is_primary == true))
      })
      .catch(error => {
        console.error(error);
      });
  }


  const initiateEdit = (id) => {
    console.log(id, "id")
    setMode("edit");
    selectId(id);
    // setIsEditModalOpen(true);
    openAddressAddModal(true);

    setSelectedItem(data.find(x => x.id == id))
    console.log(data.find(x => x.id == id), "selected")
  }


  const deleteItem = () => {
    setIsLoading(true)
    API.delete(`/user/address/${selectedId}/`)
      .then(response => {
        setMessage("Item deleted successfully.");
        setIsLoading(false)
        loadData()
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsLoading(false)
        setIsErrorModalOpen(true);
      });
  }

  const setAsPrimary = (id) => {
    setIsLoading(true)
    API.put(`user/address/${id}/`, { is_primary: true })
      .then(response => {
        console.log(response.data)
        setIsLoading(false)
        loadData()
      })
      .catch(error => {
        setMessage(error.response.data.message);
        setIsLoading(false)
        setIsErrorModalOpen(true);
      });
  }


  return (

     <div className='saved-address'>
         <MiniBanner title="Saved Addresses" breadcrumb={[{ name: "Home", link: "/" }, { name: "Saved Addresses", link:"#" }]}></MiniBanner>

      <section className="sec-2">
            <div className="lhs">
          <GeneralSidebar activePageIndex={1} userData={userData} />
            </div>
            <div className="rhs">

              <div className="address-section bg-color h-100 mt-0">
                <div className="title">
                  <div className="loader-line"></div>
                  <h3>Selected Address</h3>
                </div>
                <div className="row g-3">
                  {/* primary Address */}
                  <div className="col-md-6">
                    {primaryAddress ?
                      <div className="address-box white-bg primary">
                        <div className="address-title">
                          <div className="d-flex align-items-center gap-2">
                            <i className={`${primaryAddress.is_office ? 'ri-briefcase-4-fill icon' : 'ri-home-4-fill icon'} `}></i>
                            <h6>{primaryAddress.first_name} {primaryAddress.last_name}</h6>
                          </div>
                          <div className='d-flex'>
                            <span className="type-tag me-2">{"Primary"}</span>
                            <a onClick={() => initiateEdit(primaryAddress.id)}
                              className="edit-btn">Edit</a>
                          </div>

                        </div>
                        <div className="address-details">
                          <h6>
                            {primaryAddress.room_number && `${primaryAddress.room_number}, `}
                            {primaryAddress.address_line1 && `${primaryAddress.address_line1}, `}
                            {primaryAddress.organisation && `${primaryAddress.organisation}, `}
                            {primaryAddress.premise && `${primaryAddress.premise}, `}
                            {primaryAddress.street && `${primaryAddress.street}, `}
                            {primaryAddress.posttown && `${primaryAddress.posttown}, `}
                            {primaryAddress.postcode && `${primaryAddress.postcode}, `}
                            {primaryAddress.county && `${primaryAddress.county}, `}
                            {primaryAddress.country && `${primaryAddress.country}`}
                          </h6>
                          <h6 className="phone-number">
                            {primaryAddress.phone_number && `+${primaryAddress.phone_number}`}
                          </h6>
                        </div>
                      </div>
                      :
                      <div className="address-box white-bg">
                        <EmptyTableMessage message={"No primary address set."}></EmptyTableMessage>
                      </div>
                    }
                  </div>

                  {/* Address list */}
                  {data && data.length > 0 ?
                    data.map((address, index) => (
                      address.is_primary === false && (
                        <div className="col-md-6">
                          <div className="address-box white-bg">
                            <div className="address-title">
                              <div className="d-flex align-items-center gap-2">
                                <i className={`${address.is_office ? 'ri-briefcase-4-fill icon' : 'ri-home-4-fill icon'} `}></i>
                                <h6>{address.first_name} {address.last_name}</h6>
                              </div>
                              <div className='d-flex'>

                                <a onClick={() => initiateEdit(address.id)} className="edit-btn">Edit</a>
                                {address.is_primary == false &&
                                  <button className="action-button ms-2" onClick={(e) => { selectId(address.id); setIsDeleteConfModalOpen(true) }}>
                                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path fillRule="evenodd" clipRule="evenodd" d="M21.9878 6.41309H3.98779V9.41309C5.09236 9.41309 5.98779 10.3085 5.98779 11.4131V15.4131C5.98779 18.2415 5.98779 19.6557 6.86647 20.5344C7.74515 21.4131 9.15937 21.4131 11.9878 21.4131H13.9878C16.8162 21.4131 18.2304 21.4131 19.1091 20.5344C19.9878 19.6557 19.9878 18.2415 19.9878 15.4131V11.4131C19.9878 10.3085 20.8832 9.41309 21.9878 9.41309V6.41309ZM11.4878 11.4131C11.4878 10.8608 11.0401 10.4131 10.4878 10.4131C9.93551 10.4131 9.48779 10.8608 9.48779 11.4131V16.4131C9.48779 16.9654 9.93551 17.4131 10.4878 17.4131C11.0401 17.4131 11.4878 16.9654 11.4878 16.4131V11.4131ZM16.4878 11.4131C16.4878 10.8608 16.0401 10.4131 15.4878 10.4131C14.9355 10.4131 14.4878 10.8608 14.4878 11.4131V16.4131C14.4878 16.9654 14.9355 17.4131 15.4878 17.4131C16.0401 17.4131 16.4878 16.9654 16.4878 16.4131V11.4131Z" fill="#f29129" fill-opacity="0.85" />
                                      <path d="M11.0559 3.78368C11.1699 3.67736 11.421 3.58341 11.7703 3.51641C12.1196 3.4494 12.5475 3.41309 12.9878 3.41309C13.4281 3.41309 13.856 3.4494 14.2053 3.51641C14.5546 3.58341 14.8057 3.67736 14.9196 3.78368" stroke="#f29129" strokeOpacity="0.85" strokeWidth="2" stroke-linecap="round" />
                                    </svg>
                                  </button>}
                              </div>
                            </div>
                            <div className="address-details">
                              <h6>
                                {address.room_number && `${address.room_number}, `}
                                {address.address_line1 && `${address.address_line1}, `}
                                {address.organisation && `${address.organisation}, `}
                                {address.premise && `${address.premise}, `}
                                {address.street && `${address.street}, `}
                                {address.posttown && `${address.posttown}, `}
                                {address.postcode && `${address.postcode}, `}
                                {address.county && `${address.county}, `}
                                {address.country && `${address.country}`}
                              </h6>
                              <h6 className="phone-number">
                                {address.phone_number && `+${address.phone_number}`}
                              </h6>
                            </div>
                            <div className='footer-btn'>
                              {address.is_primary == false &&
                                <button className="  set-primary-button" onClick={() => setAsPrimary(address.id)}>
                                  Set As Primary
                                </button>}
                            </div>
                          </div>
                        </div>
                      )
                    )) :
                    <div className="col-md-6">
                      <div className="address-box white-bg">
                        <EmptyTableMessage message={"You have no address saved yet. Please add one or more addresses to easly pick and use while checkout."}></EmptyTableMessage>
                      </div>
                    </div>
                  }
                  <div className="col-md-6">
                    <div className="address-box white-bg new-address-box white-bg">
                      {/* <a onClick={(e) => { setMode("add"); setIsEditModalOpen(true); setSelectedItem({ first_name: "", last_name: "", postcode: "", posttown: "", country: 'United Kingdom' }) }}
                        className="btn new-address-btn theme-outline rounded-2 mt-0" >Add New Address</a> */}
                      <a onClick={(e) => { setMode("add"); openAddressAddModal(true); setSelectedItem({ first_name: "", last_name: "", postcode: "", posttown: "", country: 'United Kingdom' }) }}
                        className="btn-outlined" >Add New Address</a>
                    </div>
                  </div>
                </div>
              </div>
        </div>
      </section>

 {/* Address Add/edit */}
      {isAddressAddModalOpen &&
        <AddressAddPopup resourceName={'user'} setterFunction={openAddressAddModal} mode={mode} selectedId={selectedItem.id} loadData={loadData} selectedItem={selectedItem} setSelectedItem={setSelectedItem}
          setAddressSelected={null} AddressSelected={null}></AddressAddPopup>
      }

      {isLogoutModalShow && <LogoutPopup setterFunction={setLogoutModalShow}></LogoutPopup>}
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={loadData} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={loadData} />}
      {isLoading && <FixedOverlayLoadingSpinner />}
      {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'address'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>}

    </div>
  )

}

export default SavedAddress