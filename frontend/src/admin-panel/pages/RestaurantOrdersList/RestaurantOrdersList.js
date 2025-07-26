import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./RestaurantOrdersList.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"


import Pagination from "../../../Pagination";
import { PlusSquare } from "react-feather";
import { formatDateTimeToMonthYear, formatDeliveryStatus } from "../../../GeneralFunctions";
import { DELIVERY_STATUSES } from "../../../Constants";
import OrderConfirmationPopup from "../../common-components/OrderConfirmationPopup/OrderConfirmationPopup";
import OrderModificationByCustomerPopup from "../../common-components/OrderModificationByCustomerPopup/OrderModificationByCustomerPopup";


const RestaurantOrdersList = ({ isNewOrderModalShow }) => {

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
  const [isOrderModificationModalOpen, setIsOrderModificationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalMode, setConfirmModalMode] = useState(false);

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
  const getButtonName = (item) => {
    const currentStatus = item?.delivery_status
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
        return item?.is_pickup ? 'Mark as Delivered' : 'Mark as On the Way';
      case '5':
        return 'Mark as Delivered';
      case '17':
        return 'Review Modifications';
      case '7':
        return '0';
      default:
        return '0'; // Fallback for any other statuses
    }
  };
  const updateText = (item) => {
    const currentStatus = item?.delivery_status
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
        return item?.is_pickup ? 'Delivered' : 'On the Way';
      case '5':
        return 'Delivered';
      case '17':
        return 'Review Modifications';
      case '7':
        return '0';
      default:
        return '0'; // Fallback for any other statuses
    }
  };

  const handleStatusChange = (item) => {
    // review after customer modifications
    setSelectedItem(item);
    if (item.delivery_status === '17') {
      setIsOrderModificationModalOpen(true)
      return
    }
    setConfirmModalMode('edit')
    if (item.delivery_status === '1' || item.delivery_status === '14') {
      setIsOrderConfirmModalOpen(true);
    } else {
      setIsConfirmModalOpen(true)
    }

  }

  const updateOrderStatus = () => {
    let updateText = '';
    let newStatus = null;
    // confirmed --> preparing
    if (selectedItem.delivery_status === '2') {
      newStatus = '3';
    }
    // preparing --> ready_for_pickup
    else if (selectedItem.delivery_status === '3') {
      newStatus = '4';
    }
    // Ready for Pickup --> On the Way OR Delivered (if pickup)
    else if (selectedItem.delivery_status === '4') {
      newStatus = selectedItem.is_pickup ? '7' : '5';
    }
    // on_the_way --> delivered
    else if (selectedItem.delivery_status === '5') {
      newStatus = '7';
    }
    updateText = DELIVERY_STATUSES[newStatus]
    if (!newStatus) {
      return;
    }
    setIsLoading(true);
    API.put(`/order/orders/${selectedItem.id}/`, { delivery_status: newStatus })
      .then(response => {
        setMessage(`Your order has been updated as ${updateText}.`)
        // Update the state with the updated order data in data.results
        setData(prevData => {
          const updatedResults = prevData.results.map(order =>
            order.id === selectedItem.id
              ? { ...order, ...response.data } // Merge updated data with the existing order
              : order
          );

          // Return updated data with modified results
          return {
            ...prevData,
            results: updatedResults,
          };
        });

        setIsConfirmModalOpen(false)
        setIsMessageModalOpen(true);
        setIsLoading(false);

      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
      });
  }

  // Timers
  const [timers, setTimers] = useState({});
  const orderAcceptanceTimeout = 15
  const notificationTimeout = 5
  useEffect(() => {
    const updateTimers = () => {
      const newTimers = {};
      data?.results?.forEach((item) => {
        if (["1", "17"].includes(item.delivery_status)) {
          const statusModifiedAt = new Date(item.status_modified_at);
          const timeoutMinutes = item.delivery_status === "1" ? orderAcceptanceTimeout : notificationTimeout;
          const thresholdTime = new Date(statusModifiedAt.getTime() + timeoutMinutes * 60000);
          const now = new Date();
          const remainingTime = Math.max(0, thresholdTime - now);
          newTimers[item.id] = remainingTime;
        }
      });
      setTimers(newTimers);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, [data, orderAcceptanceTimeout, notificationTimeout]);

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="admin-list-page restaurant-orders-list-page">
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
                                <select name="delivery_status" className={`form-select `} value={filters.delivery_status} onChange={(e) => handleFilterChange(e.target.name, e.target.value)} >
                                  <option value={null} label="Select Delivery status"></option>
                                  {DELIVERY_STATUSES.map((status, index) => (
                                    <option key={index} value={index}>
                                      {status.replace(/_/g, ' ')}
                                    </option>
                                  ))}
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
                              <th>Amount</th>
                              <th>Delivery Status</th>
                              <th>Change Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {data && data.results && data.results.map((item, index) => (
                              <tr>
                                {/* <td>
                                <input className="custom-checkbox" type="checkbox" name="text" />
                              </td> */}
                                <td>
                                  <div className="priority-container">
                                    #{item.id}
                                    {item.is_priority_delivery &&
                                      ['1', '2', '3', '4', '14', '16', '17'].includes(item.delivery_status) && (
                                        <div className="prior-tag">
                                          <img className="img-fluid" src="/images/svg/priority-up.svg" alt="medal" />
                                          Priority
                                        </div>
                                      )}

                                  </div>
                                </td>
                                <td>{item.order_placed_datetime && formatDateTimeToMonthYear(item.order_placed_datetime)}</td>
                                <td className="short">{item.first_name} {item.last_name}</td>
                                <td>₹{item.total_amount}</td>
                                <td>
                                  <span className={`status-label ${item.delivery_status ? `status-${item.delivery_status}` : 'status-0'}`}>
                                    {item.delivery_status && formatDeliveryStatus(DELIVERY_STATUSES[item.delivery_status])}
                                  </span>
                                </td>
                                <td>
                                  {getButtonName(item) === '0' ?
                                    <>
                                      {/* <i className="ri-checkbox-circle-line font-success"></i> */}
                                    </>
                                    :
                                    <div>
                                      <a className={`btn btn-sm status-${item.delivery_status}`}
                                        onClick={() => handleStatusChange(item)} >
                                        {getButtonName(item)}
                                      </a>
                                      {timers[item.id] > 0 && (

                                        <div className="timer text-danger">
                                          <span className="time">⚠️{formatTime(timers[item.id])} mins</span>
                                          <span className="timer-tooltip">
                                            ⚠️ Please proceed within <span className="time">{formatTime(timers[item.id])} mins</span>, otherwise the order will be canceled.
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  }
                                </td>
                                <td className="d-none">
                                  {getButtonName(item) === '0' ?
                                    <>
                                    </>
                                    :
                                    <a className={`btn btn-sm status-${item.delivery_status}`}
                                      onClick={() => handleStatusChange(item)} >
                                      {getButtonName(item)}
                                    </a>
                                  }
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
                                    navigate("/admin/orders/details")
                                  }}>
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
        <div className='custom-modal order-confirm'>
          <div className='card'>
            <div className='first-screen'>
              <img src='/images/icons/svg/warning.svg'></img>
              <h1>Confirm</h1>
              <p>Are you sure you want to update this order to{" "}
                "{updateText(selectedItem) || '?'}"
                ?
              </p>
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


      {/* order modification */}
      {isOrderModificationModalOpen && <OrderModificationByCustomerPopup orderId={selectedItem?.id} setterFunction={setIsOrderModificationModalOpen} loadData={loadTableData} setTableData={setData} />}


      {/* order confirmation */}
      {isOrderConfirmModalOpen && <OrderConfirmationPopup selectedItem={selectedItem} setterFunction={setIsOrderConfirmModalOpen} loadTableData={loadTableData}
        setTableData={setData}
        loadData={loadTableData} mode={confirmModalMode} />}

      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}
      {/* {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'order'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>} */}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default RestaurantOrdersList