import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./DriverOrdersList.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"


import Pagination from "../../../Pagination";
import { PlusSquare } from "react-feather";
import { formatDateTimeToMonthYear } from "../../../GeneralFunctions";
import { DELIVERY_STATUSES } from "../../../Constants";
import OrderConfirmationPopup from "../../common-components/OrderConfirmationPopup/OrderConfirmationPopup";


const DriverOrdersList = ({ isNewOrderModalShow }) => {

  const navigate = useNavigate()

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    search_key: null,
    payment_status: null,
    delivery_status: null,
    date: null,
    is_favourite: null,
  });

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isOrderConfirmModalOpen, setIsOrderConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalMode, setConfirmModalMode] = useState(false);
  const [nextStatus, setNextStatus] = useState(null); // New status to update
  const [failureReason, setFailureReason] = useState(""); // Store the failure reason


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
  }, [page, pageSize, filters, isNewOrderModalShow]);

  const loadTableData = () => {
    setData(null);
    setIsMessageModalOpen(false);
    let apiUrl = `/order/orders/?page=${page}&page_size=${pageSize}`;

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
      payment_status: null,
      delivery_status: null,
      date: null,
      is_favourite: null,
    });
    setIsFilterOpen(false);
  };

  // button 
  const getButtonName = (currentStatus) => {
    switch (currentStatus) {
      case '1':
        return 'Confirm Order';
      // case '14':
      //   return 'Confirm Order';
      case '2':
        return 'Start Preparing';
      case '3':
        return 'Ready for Pickup';
      case '4':
        return 'Mark as On the Way';
      case '5':
        return 'Mark as Delivered';
      case '7':
        return '0';
      default:
        return '0'; // Fallback for any other statuses
    }
  };

  const handleStatusChange = (item, newStatus) => {
    setConfirmModalMode('edit')
    setSelectedItem(item);
    setIsConfirmModalOpen(true);
    setNextStatus(newStatus);

  }

  const updateOrderStatus = () => {
    if (!nextStatus) return; // If no status is selected, do nothing
    // If the status is 'failed' (status 6), ensure the failure reason is provided
    if (nextStatus === "6" && !failureReason) {
      setMessage("Please select a reason for failure.");
      setIsErrorModalOpen(true);
      return;
    }

    const updateData = { delivery_status: nextStatus };

    // Add failure reason if status is 'failed' and reason is provided
    if (nextStatus === "6" && failureReason) {
      updateData.failure_reason = failureReason;
    }


    const updateText = DELIVERY_STATUSES[nextStatus]

    setIsLoading(true);
    API.put(`/order/orders/${selectedItem.id}/`, updateData)
      .then(response => {
        setMessage(`Your order has been updated as ${updateText}.`);
        setIsConfirmModalOpen(false);
        setIsMessageModalOpen(true);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
      });
  };


  return (
    <div className="admin-list-page driver-orders-list-page">
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
                          <div className='filters-tab d-none'>
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
                                <select name="delivery_status" className={`form-select `} value={filters.delivery_status} onChange={(e) => handleFilterChange(e.target.name, e.target.value)} >
                                  <option value={null} label="Select Delivery status"></option>
                                  {DELIVERY_STATUSES.map((status, index) => {
                                    // Check if the index is in the allowed list
                                    const allowedIndexes = ["2", "3", "4", "5", "6", "7", "8"];
                                    if (allowedIndexes.includes(String(index))) {
                                      return (
                                        <option key={index} value={index}>
                                          {status.replace(/_/g, ' ')}
                                        </option>
                                      );
                                    }
                                    return null;
                                  })}
                                </select>
                                {/* <label className="mt-3">Payment Status</label>
                                <select className={`form-select `} name="payment_status" value={filters.payment_status} onChange={(e) => handleFilterChange(e.target.name, e.target.value)}>
                                  <option value={null} label="Select Payment status"></option>
                                  <option value="1">pending</option>
                                  <option value="2">Completed</option>
                                  <option value="3">Failed</option>
                                </select> */}

                                <label className="mt-3">Date</label>
                                <input
                                  type="date"
                                  name="date"
                                  value={filters.date}
                                  className="date-picker"
                                  onChange={(e) => handleFilterChange(e.target.name, e.target.value)}
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
                              <th>Customer</th>
                              {/* <th>Restaurant</th> */}
                              <th>Amount</th>
                              <th>Delivery Status</th>
                              <th>Change Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {data && data.results && data.results
                              // confirmed, preparing, ready_for_pickup, on_the_way,failed_delivery_attempt,delivered
                              .filter(item => ["2", "3", "4", "5", "6", "7", "8"].includes(item.delivery_status))
                              .map((item, index) => (
                                <tr>
                                  {/* <td>
                                <input className="custom-checkbox" type="checkbox" name="text" />
                              </td> */}
                                  <td>
                                    #{item.id}
                                  </td>
                                  <td>{item.order_placed_datetime && formatDateTimeToMonthYear(item.order_placed_datetime)}</td>
                                  <td className="short">{item.first_name} {item.last_name}</td>
                                  <td>₹{item.total_amount}</td>
                                  {/* <td>₹{item.total_amount}</td> */}
                                  <td>
                                    <span className={`status-label ${item.delivery_status ? `status-${item.delivery_status}` : 'status-0'}`}>
                                      {item.delivery_status && (DELIVERY_STATUSES[item.delivery_status]).replace(/_/g, ' ')}
                                    </span>
                                  </td>
                                  <td>
                                    {/* Button for "Mark as On the Way" when status is ready_for_pickup */}
                                    {item.delivery_status === "4" && (
                                      <a
                                        className="btn btn-sm status-5"
                                        onClick={() => handleStatusChange(item, "5")}
                                      >
                                        Mark as On the Way
                                      </a>
                                    )}

                                    {/* Buttons for "Mark as Delivered" and "Delivery Failed" when status is on_the_way */}
                                    {item.delivery_status === "5" && (
                                      <>
                                        <a
                                          className="btn btn-sm status-7 mb-2"
                                          onClick={() => handleStatusChange(item, "7")}
                                        >
                                          Mark as Delivered
                                        </a>
                                        <a
                                          className="btn btn-sm status-6"
                                          onClick={() => handleStatusChange(item, "6")}
                                        >
                                          Delivery Failed
                                        </a>
                                      </>
                                    )}

                                    {/* Button for "Mark as Delivered" when status is failed_delivery_attempt */}
                                    {item.delivery_status === "6" && (
                                      <a
                                        className="btn btn-sm status-7"
                                        onClick={() => handleStatusChange(item, "7")}
                                      >
                                        Mark as Delivered
                                      </a>
                                    )}
                                  </td>



                                  <td >
                                    {/* <a onClick={() => {
                                    localStorage.setItem("itemSelectedId", item.id);
                                    navigate("/admin/orders/details")
                                  }} className="btn btn-sm ">
                                    View
                                  </a> */}
                                    <a onClick={() => {
                                      setSelectedItem(item)
                                      setIsOrderConfirmModalOpen(true);
                                      setConfirmModalMode('view');
                                    }} className="btn btn-sm d-none">
                                      View
                                    </a>
                                    <a onClick={() => {
                                      localStorage.setItem("itemSelectedId", item.id);
                                        String(item?.id).startsWith("G") ?
                                        navigate(`/admin/grocery-orders/${item?.id}`)
                                        :
                                        navigate("/admin/orders/details")
                                      }
                                    }>
                                      <i className="ri-eye-line"></i>
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

      {/* Confirm Modal */}
      {isConfirmModalOpen &&
        <div className='custom-modal '>
          <div className='card'>
            <div className='first-screen'>
              <img src='/images/icons/svg/warning.svg'></img>
              <h1>Confirm</h1>
              <p>Are you sure you want to update this order to{" "}
                {DELIVERY_STATUSES[nextStatus]}?
              </p>
              {/* Show a dropdown if the status is "failed_delivery_attempt" (status 6) */}
              {nextStatus === "6" && (
                <div className="w-100 failure-reason">
                  <label htmlFor="failure-reason">Please select a reason for failure:</label>
                  <select
                    id="failure-reason"
                    className="form-control"
                    value={failureReason} // Use the state to bind the selected reason
                    onChange={(e) => setFailureReason(e.target.value)} // Update the state with the selected value
                  >
                    <option value="">Select Reason</option>
                    <option value="Can't locate destination">Can't locate destination</option>
                    <option value="Can't reach customer">Can't reach customer</option>
                    <option value="Customer unavailable">Customer unavailable</option>
                    <option value="No access to the building">No access to the building</option>
                    <option value="Traffic delay">Traffic delay</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}
              <div className='footer mt-2'>
                <button type='button' className='btn-outlined' onClick={() => { setIsConfirmModalOpen(false) }}>Cancel</button>
                <button type='button' className='btn-primary'
                  onClick={updateOrderStatus}
                >Proceed</button>
              </div>
            </div>
          </div>
        </div>
      }


      {/* order confirmation */}
      {isOrderConfirmModalOpen && <OrderConfirmationPopup selectedItem={selectedItem} setterFunction={setIsOrderConfirmModalOpen} loadTableData={loadTableData} loadData={loadTableData} mode={confirmModalMode} />}

      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={loadTableData} />}
      {/* {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'order'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>} */}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default DriverOrdersList