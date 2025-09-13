import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "../../common-components/AdminListPage.scss"
import "./GeneralSettings.scss"

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

    apiUrl = `/api/airiq/login-history/?page=${page}&page_size=${pageSize}`;


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
    <div className="card general-settings-page admin-list-page">
      <div className="card-body">


        <div className="page-title">
          General settings
        </div>

        <div className='sub-title' >AirIQ Automatic Login Details</div>
     {data && data.results &&
     
     <div className='grid-box'>

          <div className="grid-row">
            <div className="column-1">
              <div className="label">Login State</div>
            </div>
            <div className="column-2">
              <div className="value">
               {new Date( data.results[0].last_logged_in) > new Date(data.results[0].expires_at) ? (
   <div className="btn online-status-box">
      <i className="ri-checkbox-blank-circle-fill icon" style={{ color: "green" }}></i>
      <div className="text">Online</div>
    </div>
  ) : (
    <div className="btn online-status-box">
      <i className="ri-checkbox-blank-circle-fill icon" style={{ color: "red" }}></i>
      <div className="text">Offline</div>
    </div>
  )}
              </div>
            </div>
          </div>

          <div className="grid-row">
            <div className="column-1">
              <div className="label">Last Logged In</div>
            </div>
            <div className="column-2">
              <div className="value">
                {new Date(data.results[0].last_logged_in).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",   // "Sep"
                  day: "2-digit",   // "12"
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,     // enables AM/PM
                })}
              </div>
            </div>
          </div>

          <div className="grid-row">
            <div className="column-1">
              <div className="label">Action</div>
            </div>
            <div className="column-2">
              <div className="value">
                <button onClick={() => { navigate('/admin/agency/create') }}
                  className="btn-primary">
                  <PlusSquare />Login
                </button>
              </div>
            </div>
          </div>

          <div className="grid-row">
            <div className="column-1">
              <div className="label"></div>
            </div>
            <div className="column-2">
              <div className="value">

              </div>
            </div>
          </div>

        </div>
}
        <div className="table-container">
          <table className="table">
            <thead>

              <tr>
                <th>ID</th>
                <th>Token</th>
                <th>Token Type</th>
                <th>Expiration</th>
                <th>Expire At</th>
                <th>Loged in Time</th>
                <th>Balance At Login Time</th>
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
                  <td> {item.id} </td>
                  {item.token ? `${item.token.slice(0, 6)}...${item.token.slice(-4)}` : ""}
                  <td> {item.token_type} </td>
                  <td>
                    <div className="user-name">
                      <span>{item.expiration} sec. </span>
                    </div>
                  </td>
                  {/* <td>{item.order_placed_datetime && formatDateTimeToMonthYear(item.order_placed_datetime)}</td> */}
                  <td>
                    {new Date(item.expires_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",   // "Sep"
                      day: "2-digit",   // "12"
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,     // enables AM/PM
                    })}
                  </td>
                  <td>
                    {new Date(item.last_logged_in).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",   // "Sep"
                      day: "2-digit",   // "12"
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,     // enables AM/PM
                    })}
                  </td>
                  <td>Rs: {item.balance_at_login_time}</td>


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
      </div>










      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}
      {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'users'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem} extraMessage={"This will delete the entire user account and all the related data and history stored for the Agent, and those data can't be recovered."}></DeleteConfirmModal>}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default AgencyList