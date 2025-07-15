import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import $ from 'jquery';
import './DriverSettings.scss'


const DriverSettings = ({ mode }) => {

  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])


  return (
    <>
      <div className="admin-driver-settings-page page-body">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h5>
              {mode === 'edit' ? 'Edit Driver' : mode === 'add' ? 'Add Driver' : 'Driver Settings'}
              </h5>
            </div>
            <div className="card-body">
              
            </div>
          </div>
        </div>

      </div>



      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}

      {isLoading && <FixedOverlayLoadingSpinner />}
    </>

  )
}

export default DriverSettings