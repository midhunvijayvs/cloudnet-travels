import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "../../common-components/AdminListPage.scss"
import "../../common-components/AdminGeneralStyles.scss"
import "./AgencyList.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"


import Pagination from "../../../Pagination";
import { PlusSquare } from "react-feather";

const AgencyList = () => {

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

    apiUrl = `/api/agency/list/?page=${page}&page_size=${pageSize}`;


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
    API.delete(`/api/user/${selectedItem.id}`)
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
    <div className="admin-list-page agency-list-page card">

    <div className="card-body">

      <div className="title-header ">
        <div className="page-title">
          All Agency
        </div>

        {localStorage.getItem('userRole') === 'admin' &&
          <button onClick={() => { navigate('/admin/agency/create') }}
            className="btn-primary">
            <PlusSquare />Add New Agency
          </button>
        }

      </div>


      <div className="filter-header">
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

        
          <input
            type="text"
            className="search-input"
            placeholder='Search with agency name or owner name'
            onKeyUp={(e) => setFilters(prevFilters => ({
              ...prevFilters, search_key: e.target.value
            }))}
          />
       
      </div>


      <div className="table-container">
        <table className="table">
          <thead>

            <tr>
              <th>Agency ID</th>
              <th>Agency Name</th>
              <th>Off. Address</th>
              <th>Owner Name</th>
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
                <td> CLDNTAGNT{item.agency.id} </td>
                <td> {item.agency.agency_name} </td>
                <td> {item.agency.office_address} </td>
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
                        navigate("/admin/agency/details")
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
                </td>

              </tr>
            ))}
          </tbody>
        </table>
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



      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}
      {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'users'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem} extraMessage={"This will delete the entire user account and all the related data and history stored for the Agent, and those data can't be recovered."}></DeleteConfirmModal>}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
    </div>
  )
}


export default AgencyList