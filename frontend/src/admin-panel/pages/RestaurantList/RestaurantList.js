import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./RestaurantList.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import ApproveDocumentsPopup from "../../common-components/ApproveDocumentsPopup/ApproveDocumentsPopup"

import Pagination from "../../../Pagination";


const RestaurantList = () => {

  let navigate = useNavigate();
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({
    postcode: null,
    country: null,
    is_premium: null,
    search_key: null


  });
  const [page, setPage] = useState(1);
  const [pageSize, selectPageSize] = useState(12);

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isActionModalOpen, setActionModalOpen] = useState(false);
  const [idSelected, setIdSelected] = useState(0);
  const [SelectedItem, setSelectedItem] = useState({});


  const [tabSelected, setTabSelected] = useState(0);


  const [countIndicator, setCountIndicator] = useState([null, null, null, null, null])
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value
    }));
  };
  const handleCheckboxChange = (filterKey) => (event) => {
    handleFilterChange(filterKey, event.target.checked);
  };
  const resetFilters = () => {
    setFilters({
      search_key: null,
    });
    setIsFilterOpen(false);
  };
  useEffect(() => {
    localStorage.removeItem('createdId')
  }, []);


  useEffect(() => {
    loadTableData();
  }, [page, pageSize, filters]);

  const loadTableData = () => {
    setData(null);
    setIsMessageModalOpen(false);
    let apiUrl = `/restaurants/?page=${page}&page_size=${pageSize}`;

    // Loop through the filters object and append selected filters to the apiUrl
    for (let filter in filters) {
      if (filters[filter] !== null) {
        apiUrl += `&${filter}=${filters[filter]}`;
      }
    }
    setIsLoading(true)
    API.get(apiUrl)
      .then(response => {
        setData(response.data);
        setIsLoading(false)
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
        setIsLoading(false)

      });
  }

  const deleteItem = () => {
    API.delete(`/restaurants/${idSelected}/`)
      .then(response => {
        setMessage("Item deleted successfully.");
        setIsMessageModalOpen(true)
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
      });
  }


  return (
    <div className="admin-list-page">
      <div className="page-body restaurant-list-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="title-header option-title">
                    <h5>Restaurants</h5>
                    <form className="d-inline-flex">
                      <a onClick={() => navigate('/admin/restaurant/add')} className="align-items-center btn save-button d-flex">
                        <i data-feather="plus-square"></i>Add New
                      </a>
                    </form>
                  </div>

                  <div className="table-responsive theme-scrollbar table-product">
                    <div>
                      <div id="table_id_wrapper" className="dataTables_wrapper no-footer">

                        <div id="table_id_filter" className="dataTables_filter d-flex">
                          <div className='filters d-none'>
                            <div onClick={toggleFilterDropdown} className='filter-txt me-2'>
                              <span className="me-1">Filter</span>
                              <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.8374 6.20276L0.806316 0.648682L6.86849 0.648683L3.8374 6.20276Z" fill="#466574" />
                              </svg>
                            </div>
                            {/* Filter Dropdowns */}
                            {isFilterOpen && (
                              <div className='dropdown'>
                                <div className="d-flex justify-content-between align-items-center">
                                  <label className="">Deactivated</label>
                                  <label className="switch-xsm mb-0 ">
                                    <input type="checkbox"
                                      id="flexSwitchCheckDefault-2"
                                      checked={filters.is_deactivated || false}
                                      onChange={handleCheckboxChange('is_deactivated')}
                                    />
                                    <span className="slider round"></span>
                                  </label>
                                </div>
                                <div className="d-flex w-100 justify-content-end mt-3" >
                                  <button className="reset-btn" onClick={resetFilters}>Reset filters</button>
                                </div>
                              </div>
                            )}
                          </div>
                          <label>
                            <input type="text" className="" name="search" aria-controls="table_id" placeholder='Search for Restaurants'
                              id='search' onKeyUp={(e) => setFilters(prevFilters => ({
                                ...prevFilters, search_key: e.target.value
                              }))}
                            />
                          </label>
                        </div>
                        <table className="table category-table" id="table_id">
                          <thead>
                            <tr>
                              <th>No.</th>
                              <th>Name</th>
                              <th>Address</th>
                              <th>Phone</th>
                              <th>Email</th>
                              <th className="text-center">Approve</th>
                              <th>Option</th>
                            </tr>
                          </thead>

                          <tbody>

                            {data && data.results && data.results.map((item, index) => {

                              return (
                                <tr key={index}>
                                  <td className="f-w-600">{index + 1}</td>


                                  <td>
                                    <div className="user-name">
                                      <span>{item.restaurant_info.name}</span>
                                      <span></span>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="table-image">
                                      {item.primary_address && item.primary_address.county}
                                    </div>
                                  </td>
                                  <td>
                                    {/* <span>{item.restaurant_info.country_code}</span> &nbsp; */}
                                    <span>+{item.restaurant_info.phone_number}</span>
                                  </td>

                                  <td className="f-w-600">{item.restaurant_info.email}</td>
                                  <td>
                                    <div className="d-flex justify-content-center">
                                      {item.is_verified ? (
                                        <label className="approved-label"
                                          onClick={() => { setIdSelected(item.id); setIsApproveModalOpen(true); setSelectedItem(item); }}
                                        >Approved</label>
                                      ) : !item.is_registration_completed ? (
                                        <label className="incomplete-label">Registration Incomplete</label>
                                      ) : (
                                        <button className="approve-button" onClick={() => { setIdSelected(item.id); setIsApproveModalOpen(true); setSelectedItem(item); }}>Approve</button>
                                      )}
                                    </div>

                                  </td>
                                  <td>
                                    <ul>
                                      {/* <li>
                                        <a href="order-detail.html">
                                          <i className="ri-eye-line"></i>
                                        </a>
                                      </li> */}

                                      <li>
                                        <a onClick={() => { localStorage.setItem('itemSelectedId', item.id); navigate('/admin/restaurant/edit') }}>
                                          <i className="ri-pencil-line"></i>
                                        </a>
                                      </li>

                                      <li>
                                        <button className="" onClick={() => { setIdSelected(item.id); setIsDeleteConfModalOpen(true) }}>
                                          <i className="ri-delete-bin-line"></i>
                                        </button>
                                      </li>
                                    </ul>
                                  </td>
                                </tr>
                              )
                            }
                            )
                            }



                          </tbody>
                        </table>
                      </div>

                    </div>
                  </div>
                  {data &&
                    <Pagination
                      totalItems={data.count}
                      pageSize={pageSize}
                      currentPage={page}
                      setCurrentPage={setPage}
                      selectPageSize={selectPageSize}
                    >

                    </Pagination>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* modal */}
      <div className="modal fade theme-modal remove-coupon" id="exampleModalToggle" aria-hidden="true" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-block text-center">
              <h5 className="modal-title w-100" id="exampleModalLabel22">Are You Sure ?</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="remove-box">
                <p>The permission for the use/group, preview is inherited from the object, object will create a
                  new permission for this object</p>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-dismiss="modal">No</button>
              <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-target="#exampleModalToggle2"
                data-bs-toggle="modal" data-bs-dismiss="modal">Yes</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade theme-modal remove-coupon" id="exampleModalToggle2" aria-hidden="true" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-center" id="exampleModalLabel12">Done!</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="remove-box text-center">
                <div className="wrapper">
                  <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </div>
                <h4 className="text-content">It's Removed.</h4>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" data-bs-toggle="modal" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      {isApproveModalOpen &&
        <ApproveDocumentsPopup setterFunction={setIsApproveModalOpen} resourseName={"Restaurant"} selectedId={idSelected} SelectedItem={SelectedItem} loadData={loadTableData} ></ApproveDocumentsPopup>
      }
      {isLoading && <LoadingSpinner></LoadingSpinner>}
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={loadTableData} />}
      {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'cuisine'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>}
      {isLoading && <FixedOverlayLoadingSpinner />}

    </div>
  )
}


export default RestaurantList