import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./TicketsList.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"


import Pagination from "../../../Pagination";
import { PlusSquare } from "react-feather";
import { formatDateTimeToMonthYear } from "../../../GeneralFunctions";
import { TICKET_TYPE_LIST } from "../../../Constants";

const TicketsList = () => {

  const navigate = useNavigate()

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    search_key: null,
    ticket_type: null,
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
    setIsFilterOpen(!isFilterOpen);
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
    let apiUrl = `/communication/tickets/?page=${page}&page_size=${pageSize}`;

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
      ticket_type: null,
    });
    setIsFilterOpen(false);
  };





  return (
    <div className="admin-list-page ticket-list-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="title-header option-title">
                    <h5>Support Ticket</h5>
                    <div className="d-inline-flex">
                      <button onClick={() => { navigate('/admin/tickets/add') }}
                        className="align-items-center m-0 btn save-button d-flex gap-2">
                        <PlusSquare />Add New
                      </button>
                    </div>
                  </div>
                  <div className="table-responsive theme-scrollbar">
                    <div>
                      <div id="table_id_wrapper" className="dataTables_wrapper no-footer">

                        <div id="table_id_filter" className="dataTables_filter d-flex">
                          <div className='filters'>
                            <div onClick={toggleFilterDropdown} className='filter-txt me-2'>
                              <span className="me-1">Filter</span>
                              <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.8374 6.20276L0.806316 0.648682L6.86849 0.648683L3.8374 6.20276Z" fill="#466574" />
                              </svg>
                            </div>
                            {/* Filter Dropdowns */}
                            {isFilterOpen && (
                              <div className='dropdown'>
                                <label className="">Ticket Type</label>
                                <select name="ticket_type" className={`form-select `} value={filters.ticket_type} onChange={handleFilterChange} >
                                  <option value={null} label="Select Ticket Type" ></option>
                                  {TICKET_TYPE_LIST.map((item, index) => (
                                    <option key={index} value={item}>
                                      {item.replace(/_/g, ' ')}
                                    </option>
                                  ))}
                                </select>
                                {/* status */}
                                <label className="mt-2">Status</label>
                                <select name="status" className={`form-select `} value={filters.status} onChange={handleFilterChange} >
                                  <option value={null} label="Select Status" ></option>
                                  {['in_progress', 'closed'].map((item, index) => (
                                    <option key={index} value={item}>
                                      {item.replace(/_/g, ' ')}
                                    </option>
                                  ))}
                                </select>
                                <div className="d-flex w-100 justify-content-end mt-2" >
                                  <button className="reset-btn" onClick={resetFilters}>Reset filters</button>
                                </div>
                              </div>
                            )}
                          </div>
                          <label>
                            <input type="text" className="" aria-controls="table_id" placeholder='Search for Tickets'
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
                              <th>Ticket ID</th>
                              <th>Type</th>
                              <th>Order ID</th>
                              <th>Customer</th>
                              <th>Initiated By</th>
                              <th>Created At</th>
                              <th className="text-center">Status</th>
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
                                  #{item.id}
                                </td>
                                <td className="text-capitalize">
                                  {item.ticket_type.replace(/_/g, ' ')}
                                </td>
                                <td>{item.order ? `#${item.order}`: 'N/A'}</td>
                                <td>
                                  <div className="user-name">
                                    {item.profile_image ?
                                      <img className="user-img img-fluid" src={item.profile_image} alt="p1"></img> :
                                      <img className="user-img img-fluid" src="/images/no-profile-image.png" alt="p1"></img>
                                    }
                                    <span className="short">{item.customer_name}</span>
                                  </div>
                                </td>
                                <td className="user-name short">
                                  {item.initiated_user_name}
                                </td>
                                <td>{item.created_at && formatDateTimeToMonthYear(item.created_at)}</td>
                                <td className={`text-center ${item.status == 'closed' ? `status-close` : 'status-danger'}`}>
                                  <span>{item.status && item.status.replace(/_/g, ' ')}</span>
                                </td>

                                <td>
                                  <ul className="d-flex align-items-center  justify-content-center">
                                    <li>
                                      <button className=""
                                        onClick={() => {
                                          localStorage.setItem("itemSelectedId", item.id);
                                          navigate("/admin/tickets/details")
                                        }}>
                                        <i className="ri-eye-line"></i>
                                      </button>
                                    </li>
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


      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={()=>setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={()=>setIsMessageModalOpen(false)} />}
      {/* {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'users'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>} */}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default TicketsList