import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./OrdersList.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"


import Pagination from "../../../Pagination";
import { PlusSquare } from "react-feather";
import { formatDateTimeToMonthYear ,IsoDateTimeToFormatedTime} from "../../../GeneralFunctions";
import { DELIVERY_STATUSES } from "../../../Constants";


const OrdersList = () => {

  const navigate = useNavigate()

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    search_key: null,
    payment_status: null,
    delivery_status: null,
    date: null,
    is_favourite: null,
  });

  const ALLOWED_STATUS_TRANSITIONS = {
    cancel_request_send: ['cancelled_and_refunded'],
    pending: ['confirmed', 'cancel_request_send'],
    confirmed: ['preparing', 'cancel_request_send'],
    preparing: ['ready_for_pickup', 'cancel_request_send'],
    ready_for_pickup: ['on_the_way', 'cancel_request_send'],
    on_the_way: ['delivered', 'failed_delivery_attempt', 'cancel_request_send'],
    failed_delivery_attempt: ['delivered','on_the_way', 'cancel_request_send', 'returned'],
    delivered: [],
    returned: ['refund_request_send', 'cancel_request_send'],
    refund_request_send: ['cancelled_and_refunded', 'refund_request_processed', 'refund_request_declined'],
    cancelled_and_refunded: [],
    refund_request_processed: [],
    refund_request_declined: [],
    rejected_by_restaurant: [],
    modified_by_restaurant: ['confirmed'],
  };

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // 
  const [optionOpenIndex, setOptionOpenIndex] = useState(null);
  const toggleOptionDropdown = (item) => {
    setOptionOpenIndex(optionOpenIndex === item.id ? null : item.id);
  };

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  const isAnyFilterActive = () => {
    return Object.entries(filters)
      .filter(([key]) => ['payment_status', 'date', 'delivery_status'].includes(key))
      .some(([, value]) => value !== null);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
    // setIsFilterOpen(!isFilterOpen);
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
    let apiUrl = `/order/orders/?is_gift_card=False&page=${page}&page_size=${pageSize}`;

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
    API.delete(`/order/orders/${selectedItem.id}`)
      .then(response => {
        setMessage("Item deleted successfully.");
        setIsMessageModalOpen(true)
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
      });
  }

  const isValidStatusTransition = (currentStatus, newStatus) => {
    const allowedTransitions = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
    return allowedTransitions.includes(newStatus);
  };
  const handleDeliveryStatusChange = (item, event) => {
    const selectedStatusId = event.target.value;
    const selectedStatus = DELIVERY_STATUSES[selectedStatusId];
    console.log("selectedStatus",selectedStatus)
    const currentStatus = DELIVERY_STATUSES[item.delivery_status];
    console.log("currentStatus",currentStatus)
    // Validate the transition
    if (!isValidStatusTransition(currentStatus, selectedStatus)) {
      setIsErrorModalOpen(true);
      setMessage(
        `Invalid status transition: You cannot change the status from "${currentStatus.replace(/_/g, ' ')}" to "${selectedStatus.replace(/_/g, ' ')}".`
      );
      return;
    }

    setIsLoading(true)
    API.put(`/order/orders/${item.id}/`, { delivery_status: selectedStatusId })
      .then(response => {
        loadTableData();
        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
        setIsErrorModalOpen(true);
        setMessage(error.response?.data?.message || error.message);
      });
  }


  const resetFilters = () => {
    setFilters({
      search_key: null,
      payment_status: null,
      delivery_status: null,
      date: null,
      is_favourite: null,
    });
    setIsFilterOpen(false);
  };



  return (
    <div className="admin-list-page orders-list-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="title-header option-title">
                    <h5>Order List</h5>
                    {/* <div className="d-inline-flex">
                      <button type="button"
                        className="align-items-center m-0 btn save-button d-flex gap-2">
                        Download All Orders
                      </button>
                    </div> */}
                  </div>
                  <div className="table-responsive theme-scrollbar">
                    <div>
                      <div id="table_id_wrapper" className="dataTables_wrapper no-footer">

                        <div id="table_id_filter" className="dataTables_filter d-flex">
                          <div className='filters-tab'>
                            <div onClick={() => handleFilterChange('is_scheduled_delivery', null)}
                              className={`tab ${!filters.is_scheduled_delivery ? 'active' : ''}`}>
                              All
                            </div>
                            <div onClick={() => handleFilterChange('is_scheduled_delivery', 'True')}
                              className={`tab ${filters.is_scheduled_delivery == 'True' ? 'active' : ''}`}>
                              Scheduled
                            </div>
                          </div>
                          <div className='filters'>
                            <div onClick={toggleFilterDropdown} className={`filter-txt me-2 ${isAnyFilterActive() ? 'active' : ''}`}>
                              <span className="me-1">Filter</span>
                              <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.8374 6.20276L0.806316 0.648682L6.86849 0.648683L3.8374 6.20276Z" fill="#466574" />
                              </svg>
                            </div>
                            {/* Filter Dropdowns */}
                            {isFilterOpen && (
                              <div className='dropdown'>
                                <label className="">Delivery Status</label>
                                <select name="delivery_status" className={`form-select `} value={filters.delivery_status}
                                  onChange={(e) => handleFilterChange(e.target.name, e.target.value)} >
                                  <option value={null} label="Select Delivery status"></option>
                                  {DELIVERY_STATUSES.map((status, index) => (
                                    <option key={index} value={index}>
                                      {status.replace(/_/g, ' ')}
                                    </option>
                                  ))}
                                </select>
                                <label className="mt-3">Payment Status</label>
                                <select className={`form-select `} name="payment_status" value={filters.payment_status}
                                  onChange={(e) => handleFilterChange(e.target.name, e.target.value)}>
                                  <option value={null} label="Select Payment status"></option>
                                  <option value="1">Pending</option>
                                  <option value="2">Completed</option>
                                  <option value="3">Failed</option>
                                  <option value="4">Refunded</option>
                                </select>

                                <label className="mt-3">Date</label>
                                <input
                                  type="date"
                                  name="date"
                                  value={filters.date}
                                  className="date-picker"
                                  onChange={(e) => handleFilterChange(e.target.name, e.target.value)}
                                  onKeyDown={(e) => {e.preventDefault(); setMessage("Typing not allowed. Please pick the date by clicking on the calendar icon!");setIsErrorModalOpen(true)}} // prevent typing
                                  onPaste={(e) => e.preventDefault()}   // prevent pasting
                                  // readOnly                             // disables typing on some browsers
                                />

                                <div className="d-flex w-100 justify-content-end mt-2" >
                                  <button className="reset-btn" onClick={resetFilters}>Reset filters</button>
                                </div>
                              </div>
                            )}
                          </div>
                          <label>
                            <input type="text" className="" aria-controls="table_id" placeholder='Search for Orders'
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
                              <th>Order ID</th>
                              <th>Date</th>
                              <th>time</th>
                              <th>Customer</th>
                              <th>Payment Method</th>

                              <th>Amount</th>
                              <th>Delivery Status</th>
                              <th>Action</th>
                              {/* <th>Tracking</th> */}
                            </tr>
                          </thead>

                          <tbody>
                            {data && data.results && data.results.map((item, index) => (
                              <tr>
                                {/* <td>
                                <input className="custom-checkbox" type="checkbox" name="text" />
                              </td> */}

                                <td>
                                  #{item.id}
                                </td>

                                <td>{item.order_placed_datetime && formatDateTimeToMonthYear(item.order_placed_datetime)}</td>
                                <td>{item.order_placed_datetime && IsoDateTimeToFormatedTime(item.order_placed_datetime)}</td>

                                <td>{item.first_name} {item.last_name}</td>

                                <td>{item.payment_method && ['paypal', 'card', 'cod', 'manual', 'stripe'][parseInt(item.payment_method)]}</td>

                                <td>£{item.total_amount}</td>

                                <td>
                                  <select className={`form-select delivery-status ${item.delivery_status ? `status-${item.delivery_status}` : ''}`}
                                    value={item.delivery_status}
                                    onChange={(event) => handleDeliveryStatusChange(item, event)}
                                  >
                                    {DELIVERY_STATUSES.map((status, index) => (
                                      <option key={index} value={index} className={`status-btn ${item.delivery_status ? `status-${item.delivery_status}` : 'status-0'}`}>
                                        {status.replace(/_/g, ' ')}
                                      </option>
                                    ))}
                                  </select>
                                </td>


                                <td>
                                  <ul
                                    className="d-flex align-items-center  justify-content-center">
                                    <li>
                                      <a onClick={() => {
                                        localStorage.setItem("itemSelectedId", item.id);
                                        navigate("/admin/orders/details")
                                      }}>
                                        <i className="ri-eye-line"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </td>


                                <td className="d-none">
                                  <a onClick={() => {
                                    localStorage.setItem("itemSelectedId", item.id);
                                    navigate("/admin/orders/tracking")
                                  }} className="btn btn-sm btn-dashed text-white">
                                    Track
                                  </a>
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


      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => {setIsErrorModalOpen(false); loadTableData()}} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={loadTableData} />}
      {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'order'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default OrdersList