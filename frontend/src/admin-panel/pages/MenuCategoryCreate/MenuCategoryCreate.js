import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./MenuCategoryCreate.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"


import Pagination from "../../../Pagination";


const MenuCategoryCreate = () => {

  let navigate = useNavigate();
  const [data, setData] = useState({});
  const [filters, setFilters] = useState({
    postcode: null,
    country: null,
    is_premium: null,
    search_key: null


  });
  const [page, setPage] = useState(1);
  const [pageSize, selectPageSize] = useState(10);

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isActionModalOpen, setActionModalOpen] = useState(false);
  const [idSelected, setIdSelected] = useState(0);

  const [isFilterDropOpen, setFilterDropOpen] = useState([false, false, false]);


  const [tabSelected, setTabSelected] = useState(0);


  const [countIndicator, setCountIndicator] = useState([null, null, null, null, null])

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])





  return (
    <div >
      <div className="page-body">

        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h5>Category Information</h5>
                    </div>
                    <div className="card-body">
                      <div className="input-items">
                        <div className="row gy-3">
                          <div className="col-12">
                            <div className="input-box">
                              <h6>Name</h6>
                              <input type="text" name="text" placeholder="Enter Your Name" />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="input-box">
                              <h6>Category Image</h6>
                              <form className="dropzone custom-dropzone" id="multiFileUpload"
                                action="https://themes.pixelstrap.net/upload.php">
                                <div className="dropzone-wrapper">
                                  <div className="dz-message needsclick">
                                    <div>
                                      <i className="icon-cloud-up"></i>
                                      <h6>Drop files here or click to upload.</h6>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="input-box">
                              <h6>Description</h6>
                              <textarea name="text" rows="4"></textarea>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="input-box d-flex align-items-center gap-2">
                              <input className="custom-checkbox" type="checkbox" id="c-1" />
                                <label for="c-1" className="mb-0">Publish</label>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="input-box d-flex align-items-center gap-2">
                              <input className="custom-checkbox" type="checkbox" id="c-2" />
                                <label for="c-2" className="mb-0">Show in Homepage?</label>
                            </div>
                          </div>
                          <div className="col-12">
                            <a href="#" className="btn restaurant-button">Save</a>
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
  )
}


export default MenuCategoryCreate