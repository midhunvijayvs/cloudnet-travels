import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./UserDeletionList.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"


import Pagination from "../../../Pagination";
import { PlusSquare } from "react-feather";
import { formatDateTimeToMonthYear } from "../../../GeneralFunctions";

const UserDeletionList = () => {

  const navigate = useNavigate()

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    search_key: null,
    user_type: null,
  });

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

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

  const [page, setPage] = useState(1);
  const [pageSize, selectPageSize] = useState(12);

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  useEffect(() => {
    loadTableData();
  }, [page, pageSize, filters]);

  const loadTableData = () => {
    setData(null);
    setIsMessageModalOpen(false);

    let apiUrl;
    if (localStorage.getItem('userRole') !== 'restaurant') {
      apiUrl = `/user/verified-users/?page=${page}&page_size=${pageSize}&is_deleted=True`;
    } else {
      apiUrl = `/restaurants/user-list/?page=${page}&page_size=${pageSize}&is_deleted=True`;
    }

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


  const resetFilters = () => {
    setFilters({
      search_key: null,
    });
    setIsFilterOpen(false);
  };


  const deleteItem = () => {
    setIsLoading(true)
    API.delete(`/user/users/${selectedItem.id}`)
      .then(response => {
        setMessage("Item deleted successfully.");
        setIsMessageModalOpen(true)
        setIsLoading(false)
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
        setIsLoading(false)
      });
  }

  const cancelRequest = () => {
    setIsLoading(true)
    API.put(`/user/users/${selectedItem.id}/`, {is_deleted:false})
      .then(response => {
        setMessage("Item deleted successfully.");
        setIsMessageModalOpen(true);
        setIsConfirmModalOpen(false);
        setIsLoading(false)
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
        setIsLoading(false)
      });
  }



  return (
    <div className="admin-list-page user-list-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="title-header option-title">
                    <h5>
                      {localStorage.getItem('userRole') !== 'restaurant' ? 'All Users' : 'Customers'}
                    </h5>
                  </div>
                  <div className="table-responsive theme-scrollbar table-product">
                    <div>
                      <div id="table_id_wrapper" className="dataTables_wrapper no-footer">
                        <div id="table_id_filter" className="dataTables_filter d-flex">
                          <label>
                            <input type="text" className="" aria-controls="table_id" placeholder='Search for Users'
                              id='search' onKeyUp={(e) => setFilters(prevFilters => ({
                                ...prevFilters, search_key: e.target.value
                              }))}
                            />
                          </label>
                        </div>
                        <table className="table category-table" id="table_id">
                          <thead>
                            <tr>
                              {/* <th><input id="checkall" className="custom-checkbox" type="checkbox" name="text" />
                              </th> */}
                              {/* <th>Order ID</th> */}
                              <th>User</th>
                              <th>Name</th>
                              {/* <th>Phone</th> */}
                              <th>Email</th>
                              <th>Requested Date</th>
                              <th>Actions</th>
                            </tr>
                          </thead>

                          <tbody>
                            {data && data.results && data.results.map((item, index) => (
                              <tr>
                                {/* <td>
                                <input className="custom-checkbox" type="checkbox" name="text" />
                              </td> */}
                                {/* <td>
                                  #{item.order}
                                </td> */}
                                <td>
                                  <div className={`table-image`}>
                                    <div className={`${item.is_deactivated ? 'deactivated' : ''}`}>
                                      <img src={item.profile_image ? item.profile_image : "/images/no-profile-image.png"}
                                        className={`img-fluid rounded ${item.is_deactivated ? 'grayscale' : ''}`} alt="" />
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="user-name">
                                    <span>{item.first_name} {item.last_name}</span>
                                  </div>
                                </td>
                                {/* <td>{item.order_placed_datetime && formatDateTimeToMonthYear(item.order_placed_datetime)}</td> */}
                                {/* <td>
                                  {item.phone_number && `+${item.phone_number}`}
                                </td> */}
                                <td>{item.email}</td>
                                <td>{item.delete_requested_at && formatDateTimeToMonthYear(item.delete_requested_at)	}</td>
                                <td>
                                  <div className="d-flex align-items-center  justify-content-center">
                                    <button className="status-btn" onClick={() => { setSelectedItem(item); setIsConfirmModalOpen(true) }}>
                                      Cancel Request
                                    </button>
                                    <ul >
                                      <li>
                                        <button className="" onClick={() => {
                                          localStorage.setItem("itemSelectedId", item.id);
                                          navigate("/admin/users/details")
                                        }}>
                                          <i className="ri-eye-line"></i>
                                        </button>
                                      </li>
                                      <li>
                                        <button className="" onClick={() => { setSelectedItem(item); setIsDeleteConfModalOpen(true) }}>
                                          <i className="ri-delete-bin-line"></i>
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                </td>

                              </tr>
                            ))}
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
      {isConfirmModalOpen &&
          <div className='custom-modal '>
            <div className='card'>
              <div className='first-screen'>
                <img src='/images/icons/svg/warning.svg'></img>
                <h1>Change Status</h1>
                <p>Are you sure you want to cancel the request?</p>
                <div className='footer'>
                  <button type='button' className='cancel-button' onClick={() => { setIsConfirmModalOpen(false) }}>Cancel</button>
                  <button type='button' className='ok-button' onClick={cancelRequest}>Change</button>
                </div>
              </div>
            </div>
          </div>
        }


      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={loadTableData} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={loadTableData} />}
      {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'users'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default UserDeletionList