import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./RestaurantPaymentList.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"

import Pagination from "../../../Pagination";
import { PlusSquare } from "react-feather";
import { formatDateTime2MonthYearTime, formatDateTimeToMonthYear } from "../../../GeneralFunctions";
import CustomSearchSelectBox from "../../common-components/CustomSearchSelectBox/CustomSearchSelectBox";
import PaymentHistoryPopup from "../../common-components/PaymentHistoryPopup/PaymentHistoryPopup";

const RestaurantPaymentList = () => {

  const navigate = useNavigate()

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    search_key: null,
  });

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSortByOpen, setIsSortByOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isConfirmMode, setIsConfirmMode] = useState(false);

  const toggleSortByDropdown = () => {
    setIsSortByOpen(!isSortByOpen);
  };
  const handleSortChange = (value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      sort_by: value
    }));
    setIsSortByOpen(!isSortByOpen);
  }

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  const isAnyFilterActive = () => {
    return Object.entries(filters)
      .filter(([key]) => ['restaurant', 'date'].includes(key))
      .some(([, value]) => value !== null);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value
    }));
  };
  const handlePopupFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
    // setIsFilterOpen(false);
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
    // setData(null);
    setIsMessageModalOpen(false);

    let apiUrl = `/payments/restaurant-settlements/?page=${page}&page_size=${pageSize}`;

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

  const handleSendMoney = () => {
    setIsLoading(true)
    API.post(`/payments/complete-restaurant-settlements/${selectedItem.id}/`)
      .then(response => {
        setMessage("Fund transfer proccessed successfully.");
        loadTableData()
        setIsConfirmModalOpen(false)
        setIsMessageModalOpen(true)
        setIsLoading(false)
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
        setIsLoading(false)
      });
  }



  return (
    <div className="admin-list-page restaurant-paymentlist-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="title-header option-title">
                    <h5>
                      Restaurant Payment List
                    </h5>
                  </div>
                  <div className="table-responsive theme-scrollbar table-product">
                    <div>
                      <div id="table_id_wrapper" className="dataTables_wrapper no-footer">
                        <div id="table_id_filter" className="dataTables_filter d-flex">
                          <div className='filters-tab'>
                            <div onClick={() => handleFilterChange('payment_status', null)}
                              className={`tab ${filters.payment_status == null ? 'active' : ''}`}>
                              All
                            </div>
                            <div onClick={() => handleFilterChange('payment_status', 'pending')}
                              className={`tab ${filters.payment_status == 'pending' ? 'active' : ''}`}>
                              Over Due
                            </div>
                            <div onClick={() => handleFilterChange('payment_status', 'failed')}
                              className={`tab ${filters.payment_status == 'failed' ? 'active' : ''}`}>
                              Failed
                            </div>
                          </div>
                          <div className='sortby'>
                            <div onClick={toggleSortByDropdown} className={`filter-txt me-2 ${filters.sort_by ? 'active' : ''}`}>
                              <span className="me-1">Sort</span>
                              <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.8374 6.20276L0.806316 0.648682L6.86849 0.648683L3.8374 6.20276Z" fill="#466574" />
                              </svg>
                            </div>
                            {/* sortby Dropdowns */}
                            {isSortByOpen && (
                              <div className='dropdown'>
                                <label onClick={() => handleSortChange("over_due")}
                                  className={`${filters.sort_by === 'over_due' ? 'active' : ''}`}>
                                  Over Due </label>
                                <label onClick={() => handleSortChange("amount")} className={`${filters.sort_by === 'amount' ? 'active' : ''}`}>
                                  Amount </label>

                                <div className="d-flex w-100 justify-content-end mt-2" >
                                  <button className="reset-btn"
                                    onClick={() => {
                                      setFilters(prevFilters => ({
                                        ...prevFilters,
                                        sort_by: null
                                      })); setIsSortByOpen(false)
                                    }}>Clear</button>
                                </div>
                              </div>
                            )}
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
                                <label className="">Restaurant</label>
                                <CustomSearchSelectBox formData={filters} setFormData={setFilters}
                                  changeKey={'restaurant'} apiGetUrl={`/restaurants/`} />
                                {/* <label className="mt-3">Date</label>
                                <input
                                  type="date"
                                  name="date"
                                  value={filters.date}
                                  className="date-picker"
                                  onChange={handlePopupFilterChange}
                                /> */}

                                <div className="d-flex w-100 justify-content-end mt-2" >
                                  <button className="reset-btn" onClick={resetFilters}>Reset filters</button>
                                </div>
                              </div>
                            )}
                          </div>
                          <label className="d-none">
                            <input type="text" className="" aria-controls="table_id" placeholder='Search for Mail'
                              id='search' onKeyUp={(e) => setFilters(prevFilters => ({
                                ...prevFilters, search_key: e.target.value
                              }))}
                            />
                          </label>
                        </div>
                        <table className="table category-table" id="table_id">
                          <thead>
                            <tr>
                              <th>Restaurant</th>
                              <th>Unpaid Orders</th>
                              <th>Unpaid Amount</th>
                              <th className="text-center">Settlement Period</th>
                              {/* <th>Settlement To</th> */}
                              <th className="text-end">Payment</th>
                            </tr>
                          </thead>

                          <tbody>
                            {data?.results && data.results.map((item, index) => (
                              <tr>
                                <td className="subject-short">{item.restaurant_name}</td>
                                <td className="subject-short">
                                  {item.number_of_orders}
                                </td>
                                <td className="title-short">
                                  ₹{item.paid_amount && item.paid_amount.toFixed(2)}
                                </td>
                                <td className="text-center">
                                  <div className="td-check">
                                    <div className="d-flex justify-content-center align-items-center">
                                      <span className="publish-date ms-1">
                                        {item.payment_for_orders_from ? item.payment_for_orders_from.substring(0, 10) : 'N/A'}
                                      </span>&nbsp;-&nbsp;
                                      <span className="publish-date ms-1">
                                        {item.payment_for_orders_to ? item.payment_for_orders_to.substring(0, 10) : 'N/A'}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                {/* <td >
                                  <div className="td-check">
                                    <div className="d-flex justify-content-center align-items-center">
                                      <span className="publish-date ms-1">
                                        {item.payment_for_orders_to && item.payment_for_orders_to.substring(0, 10)}
                                      </span>
                                    </div>
                                  </div>
                                </td> */}
                                <td className="text-end">
                                  {item.payment_status === 'pending' ?
                                    <span className={`pay-btn`} onClick={() => { setSelectedItem(item); setIsConfirmModalOpen(true); setIsConfirmMode('pending') }}>
                                      Send Money
                                    </span>
                                    :
                                    item.payment_status === 'success' ?
                                      <span className={`paid-btn`}>
                                        <i className="ri-checkbox-circle-line font-success"></i>
                                        Paid
                                      </span> :
                                      <span className={`failed-btn`} onClick={() => { setSelectedItem(item); setIsConfirmModalOpen(true); setIsConfirmMode('failed') }}>
                                        Failed
                                        <i className="ri-restart-line font-success"></i>
                                      </span>
                                  }
                                  <span className={`ms-3 history-btn`} onClick={() => { setSelectedItem(item); setIsHistoryModalOpen(true) }}>
                                    History
                                    <i className="ri-eye-line"></i>
                                  </span>
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
              {selectedItem.payment_status === 'failed' ?
                <p>Are you sure you want to retry the transfer?</p> :
                <p>Are you sure you want to process the transfer?</p>
              }
              <div className='footer mt-2'>
                <button type='button' className='btn-outlined' onClick={() => { setIsConfirmModalOpen(false) }}>Cancel</button>
                <button type='button' className='btn-primary'
                  onClick={handleSendMoney}
                >Proceed</button>
              </div>
            </div>
          </div>
        </div>
      }

      {isHistoryModalOpen &&
        <PaymentHistoryPopup setterFunction={setIsHistoryModalOpen} selectedItem={selectedItem} />
      }

      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default RestaurantPaymentList