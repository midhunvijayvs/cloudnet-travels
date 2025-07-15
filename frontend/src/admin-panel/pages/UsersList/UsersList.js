import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./UsersList.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"


import Pagination from "../../../Pagination";
import { PlusSquare } from "react-feather";

const UsersList = () => {

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
    if (localStorage.getItem('userRole') === 'admin') {
      apiUrl = `/user/verified-users/?page=${page}&page_size=${pageSize}`;
    } else if (localStorage.getItem('userRole') === 'restaurant') {
      apiUrl = `/restaurants/user-list/?page=${page}&page_size=${pageSize}`;
    }else{
      apiUrl = `/grocery/user-list/?page=${page}&page_size=${pageSize}`;
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
    API.delete(`/user/users/${selectedItem.id}`)
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
    <div className="admin-list-page user-list-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="title-header option-title">
                    <h5>
                      {localStorage.getItem('userRole') === 'admin' ? 'All Users' : 'Customers'}
                    </h5>
                    <div className="d-inline-flex">
                      {localStorage.getItem('userRole') === 'admin' &&
                        <button onClick={() => { navigate('/admin/users/add') }}
                          className="align-items-center m-0 btn save-button d-flex gap-2">
                          <PlusSquare />Add New
                        </button>
                      }
                    </div>
                  </div>
                  <div className="table-responsive theme-scrollbar table-product">
                    <div>
                      <div id="table_id_wrapper" className="dataTables_wrapper no-footer">

                        <div id="table_id_filter" className="dataTables_filter d-flex">
                          {localStorage.getItem('userRole') === 'admin' &&
                            <div className='filters-tab'>
                              <div onClick={() => handleFilterChange('user_type', null)}
                                className={`tab ${!filters.user_type ? 'active' : ''}`}>
                                All
                              </div>
                              {/* <div onClick={() => handleFilterChange('user_type', 'user')}
                                className={`tab ${filters.user_type == 'user' ? 'active' : ''}`}>
                                Customers
                              </div>
                              <div onClick={() => handleFilterChange('user_type', 'staff')}
                                className={`tab ${filters.user_type == 'staff' ? 'active' : ''}`}>
                                Staff
                              </div>
                               */}
                          
                            </div>
                          }
                          <div className='filters'>
                           
                          </div>
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
                              <th>Phone</th>
                              <th>Email</th>
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
                                <td>
                                  {item.phone_number && `+${item.phone_number}`}
                                </td>
                                <td>{item.email}</td>
                                <td>
                                  <ul className="d-flex align-items-center  justify-content-center">
                                    <li>
                                      <button className="" onClick={() => {
                                        localStorage.setItem("itemSelectedId", item.id);
                                        navigate("/admin/users/details")
                                      }}>
                                        <i className="ri-eye-line"></i>
                                      </button>
                                    </li>
                                    {(localStorage.getItem('userRole') === 'admin') &&
                                      <>
                                        {item.user_type === 'admin' && item.user_type !== 'driver' &&
                                          <li>
                                            <button className="" onClick={() => { setSelectedItem(item); setIsDeleteConfModalOpen(true) }}>
                                              <i className="ri-delete-bin-line"></i>
                                            </button>
                                          </li>
                                        }
                                      </>
                                    }
                                  </ul>
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


      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={()=> setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={()=> setIsMessageModalOpen(false)} />}
      {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'users'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default UsersList