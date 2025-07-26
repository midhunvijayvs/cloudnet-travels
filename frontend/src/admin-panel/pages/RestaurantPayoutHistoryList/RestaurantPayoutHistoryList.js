import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./RestaurantPayoutHistoryList.scss"

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

const RestaurantPayoutHistoryList = () => {

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
    setData(null);
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



  return (
    <div className="admin-list-page restaurant-payout-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="title-header option-title">
                    <h5>
                      Payment List
                    </h5>
                  </div>
                  <div className="table-responsive theme-scrollbar table-product">
                    <div>
                      <div id="table_id_wrapper" className="dataTables_wrapper no-footer">
                        <div id="table_id_filter" className="dataTables_filter d-flex">
                          <div className='filters-tab d-none'>
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
                          <div className='sortby d-none'>
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
                          <div className='filters d-none'>
                            <div onClick={toggleFilterDropdown} className={`filter-txt me-2 ${isAnyFilterActive() ? 'active' : ''}`}>
                              <span className="me-1">Filter</span>
                              <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.8374 6.20276L0.806316 0.648682L6.86849 0.648683L3.8374 6.20276Z" fill="#466574" />
                              </svg>
                            </div>
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
                              <th>Paid On</th>
                              <th>Settlement Period</th>
                              <th>No.of Orders</th>
                              <th>Amount</th>
                              <th>Status</th>
                              <th>Transaction ID</th>
                            </tr>
                          </thead>

                          <tbody>
                            {data?.results && data.results.map((item, index) => (
                              <tr>
                                <td>
                                  <span>
                                    {/* <i className="ri-time-line"></i> */}
                                    {item.payment_time ? item.payment_time.substring(0, 10) : 'N/A'}
                                  </span>
                                </td>
                                <td>
                                  <div>
                                    {item.payment_for_orders_to ? item.payment_for_orders_to.substring(0, 10) : 'N/A'}
                                    <span>&nbsp;to&nbsp; </span>
                                    {item.payment_for_orders_from ? item.payment_for_orders_from.substring(0, 10) : 'N/A'}
                                  </div>
                                </td>
                                <td>{item.number_of_orders}</td>
                                <td>₹{item.paid_amount && item.paid_amount.toFixed(2)}</td>
                                <td >
                                  <span className={`status ${item.payment_status}`}>{item.payment_status && item.payment_status.replace(/_/g, ' ')}</span>
                                </td>
                                <td>{item.wise_transaction_id ? `#${item.wise_transaction_id}` : 'N/A'}</td>
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
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default RestaurantPayoutHistoryList