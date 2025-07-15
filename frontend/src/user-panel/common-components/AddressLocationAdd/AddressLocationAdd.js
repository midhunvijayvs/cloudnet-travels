import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import API from '../../../API';
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import './AddressLocationAdd.scss'
import MapLocationSelector from '../MapLocationSelector/MapLocationSelector';
import AddressAddPopup from '../AddressAddPopup';



const AddressLocationAdd = ({ setterFunction, selectedItem, mode, loadData, setSelectedItem, setAddressSelected, AddressSelected }) => {
  const navigate = useNavigate()
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // Address
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [location, setLocation] = useState({ lat: 51.509865, lng: -0.118092 });
  const handleLocationSelect = (coords) => {
    setLocation(coords);
  };

  useEffect(() => {
    if (selectedItem?.latitude && selectedItem?.longitude) {
      setLocation({
        lat: parseFloat(selectedItem.latitude),
        lng: parseFloat(selectedItem.longitude),
      });
    }
  }, [selectedItem]);



  const handleSaveLocation = (type) => {
    // validate
    if ((location.lat === 51.509865 && location.lng === -0.118092) || (!location || !location.lat)) {
      setErrors({ location: 'Please select your location.' });
      return;
    } else {
      setErrors({});
      setSelectedItem(prevState => ({
        ...prevState,
        latitude: location.lat,
        longitude: location.lng
      }));
      setIsEditModalOpen(true);
    }
    // const formData = { latitude: location.lat, longitude: location.lng }
    // const method = mode === 'edit' ? 'put' : 'post';
    // const url = method === 'put' ? `/user/address/${selectedItem.id}/` : '/user/address/';
    // setIsLoading(true);
    // API[method](url, formData)
    //   .then(response => {
    //     setIsLoading(false);
    //     // setterFunction(false);
    //     setIsEditModalOpen(true);
    //   })
    //   .catch(error => {
    //     setIsLoading(false)
    //     setMessage(error.response?.data?.message || error.message);
    //     setIsErrorModalOpen(true);
    //   });
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    setterFunction(false);
  }


  return (
    <>
      <div className={`custom-modal location-modal ${isEditModalOpen ? 'd-none' : ''}`}>
        <div className="card">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">
                <h5 className="fw-semibold">{mode === 'edit' ? 'Change Location' : 'Select a Location'} </h5>
                <button type="button" className="btn-close" onClick={() => { setterFunction(false) }}></button>
              </div>
            </div>
            <div className="modal-body">

              <MapLocationSelector
                center={location}
                onSelect={handleLocationSelect} />
              {errors.location && <div className="invalid-feedback">{errors.location}</div>}

              {/* <h5 className="mt-sm-3 mt-2 fw-medium recent-title dark-text">
              Recent Location
            </h5>
            <a className="recent-location">
              <div className="recant-address">
                <i className="ri-map-pin-line theme-color"></i>
                <div>
                  <h5>Bayshore</h5>
                  <h6>kingston St., Ottawa, Ontario, Canada</h6>
                </div>
              </div>
            </a> */}
            </div>
            <div className="modal-footer">
              <a className="btn gray-btn me-1" onClick={() => { setterFunction(false) }} >Close</a>
              <a className="btn theme-btn mt-0" onClick={handleSaveLocation}>Save</a>
            </div>
          </div>
        </div>
      </div>
      {isLoading && <FixedOverlayLoadingSpinner />}
      {isEditModalOpen &&
        <AddressAddPopup resourceName={'user'} setterFunction={closeModal} mode={mode} selectedId={selectedItem.id} loadData={loadData} selectedItem={selectedItem} setSelectedItem={setSelectedItem}
          setAddressSelected={setAddressSelected} AddressSelected={AddressSelected}></AddressAddPopup>
      }
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
    </>
  )
}

export default AddressLocationAdd