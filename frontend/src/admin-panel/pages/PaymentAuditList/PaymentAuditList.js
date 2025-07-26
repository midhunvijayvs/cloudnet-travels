import React, { useRef } from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./PaymentAuditList.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"

import Pagination from "../../../Pagination";
import { formatDateTime2MonthYearTime, formatDateTimeToMonthYear } from "../../../GeneralFunctions";
import CustomSearchSelectBox from "../../common-components/CustomSearchSelectBox/CustomSearchSelectBox";
import DateRangePicker from "../../common-components/DateRangePicker/DateRangePicker";


const PaymentAuditList = () => {

  const navigate = useNavigate()

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    search_key: null,
    start_date: null,
    end_date: null,
    user_type: "",
    status: "",
    transaction_type: "",
    payment_method: "",
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
  const [page, setPage] = useState(1);
  const [pageSize, selectPageSize] = useState(12);

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };
  const resetFilters = () => {
    setFilters({
      search_key: null,
      start_date: null,
      end_date: null,
      user_type: "",
      status: "",
      transaction_type: "",
      payment_method: "",
    });

    setIsFilterOpen(false);
  };

  useEffect(() => {
    loadTableData();
  }, [page, pageSize, filters]);

  const loadTableData = () => {
    setData(null);
    setIsMessageModalOpen(false);

    let apiUrl = `/payments/payment-audit/?page=${page}&page_size=${pageSize}`;

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
    <div className="admin-list-page payment-audit-list-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="title-header option-title">
                    <h5>
                      Payment Audit
                    </h5>
                  </div>
                  <div className="table-responsive theme-scrollbar table-product">
                    <div>
                      <div id="table_id_wrapper" className="dataTables_wrapper no-footer">
                        <div id="table_id_filter" className="dataTables_filter d-flex w-100">
                          <div className="filter-container">
                            <div className="filter-row">
                              <div className="filter-item">
                                <label>Date Range:</label>
                                <DateRangePicker
                                  filters={filters}
                                  setFilters={setFilters}
                                  className="date-input"
                                  rangeColors={['#004938']}
                                />
                              </div>
                              {/* user_type */}
                              <div className="filter-item d-none">
                                <label htmlFor="user_type">User Type:</label>
                                <select
                                  id="user_type"
                                  name="user_type"
                                  value={filters.user_type}
                                  onChange={handleFilterChange}
                                >
                                  <option value="">All</option>
                                  <option value="restaurant">Restaurant</option>
                                  <option value="admin">Admin</option>
                                  <option value="customer">Customer</option>
                                </select>
                              </div>
                              {/* order id */}
                              <div className="filter-item order">
                                <label htmlFor="search">Order ID:</label>
                                <input
                                  type="text"
                                  id="order"
                                  name="order"
                                  value={filters.order}
                                  onChange={handleFilterChange}
                                  placeholder="Order ID..."
                                />
                              </div>
                              {/* user */}
                              <div className="filter-item">
                                <label htmlFor="search">User:</label>
                                <CustomSearchSelectBox formData={filters} setFormData={setFilters} resourceName={'user'}
                                  changeKey={'user'} placeHolder={'Search Users'} apiGetUrl={`/user/verified-users/`} />
                              </div>
                              {/* transaction type */}
                              <div className="filter-item">
                                <label htmlFor="transaction_type">Transaction Type:</label>
                                <select
                                  id="transaction_type"
                                  name="transaction_type"
                                  value={filters.transaction_type}
                                  onChange={handleFilterChange}
                                >
                                  <option value="">All</option>
                                  <option value="Payment">Payment</option>
                                  <option value="Refund">Refund</option>
                                  <option value="Restaurant settlement">Restaurant settlement</option>
                                  
                                </select>
                              </div>
                              {/* payment method */}
                              <div className="filter-item">
                                <label htmlFor="payment_method">Payment Method:</label>
                                <select
                                  id="payment_method"
                                  name="payment_method"
                                  value={filters.payment_method}
                                  onChange={handleFilterChange}
                                >
                                  <option value="">All</option>
                                  <option value="paypal">Paypal</option>
                                  <option value="stripe">Stripe</option>
                                </select>
                              </div>
                              {/* status */}
                              <div className="filter-item">
                                <label htmlFor="status">Status:</label>
                                <select
                                  id="status"
                                  name="status"
                                  value={filters.status}
                                  onChange={handleFilterChange}
                                >
                                  <option value="">All</option>
                                  <option value="success">Success</option>
                                  <option value="failure">Failure</option>
                                </select>
                              </div>
                              {/* searchkey */}
                              <div className="filter-item">
                                <label htmlFor="search">Search:</label>
                                <input
                                  type="text"
                                  id="search_key"
                                  name="search_key"
                                  value={filters.search_key}
                                  onChange={handleFilterChange}
                                  placeholder="Search by keyword..."
                                />
                              </div>



                              <div className="filter-item btns">
                                <button className="btn reset-btn" onClick={resetFilters}>Reset Filter</button>
                              </div>
                              <div className="filter-item d-none">
                                <button className="btn" onClick={() => console.log(filters)}>Apply Filter</button>
                              </div>
                            </div>
                          </div>

                        </div>
                        <table className="table category-table" id="table_id">
                          <thead>
                            <tr>
                              <th className="date">Date & Time</th>
                              <th className="order">Order ID</th>
                              <th>From</th>
                              <th>To</th>
                              <th>Transaction</th>
                              <th>IP Address</th>
                            </tr>
                          </thead>

                          <tbody>
                            {data && data.results && data.results.map((item, index) => (
                              <tr>
                                <td>
                                  <div className="d-flex justify-content-center align-items-center">
                                    <div className="date">
                                      {item.created_at && formatDateTime2MonthYearTime(item.created_at)}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="order">
                                    #{item.order}
                                  </div>
                                </td>
                                <td>
                                  <div className="user-info">
                                    {item.user_data ?
                                      <>
                                        <div className="type">
                                          {
                                            item.user_data?.user_type === 'restaurant' ?
                                              <>
                                                <img src="/images/admin-panel/audit/restaurant.svg" />
                                                Restaurant
                                              </>
                                              :
                                              item.user_data?.user_type === 'admin' ?
                                                <>
                                                  <img src="/images/admin-panel/audit/admin-user.svg" />
                                                  Admin
                                                </>
                                                :
                                                item.user_data?.user_type === 'driver' ?
                                                  <>
                                                    <img src="/images/admin-panel/audit/driver.svg" />
                                                    Delivery Partner
                                                  </>
                                                  :
                                                  <>
                                                    <img src="/images/admin-panel/audit/customer.svg" />
                                                    User
                                                  </>
                                          }
                                        </div>
                                        <div className="name">
                                          {item.user_data?.first_name ?
                                            `${item.user_data?.first_name} ${item.user_data?.last_name}`
                                            :
                                            ''
                                          }
                                        </div>
                                        <div className="email">
                                          {item.user_data?.email ?
                                            item.user_data?.email : "Not Found"}
                                        </div>
                                      </>
                                      :
                                      <div className="not-found">
                                        N/A
                                      </div>
                                    }
                                  </div>
                                </td>
                                {/* to user */}
                                <td>
                                  <div className="user-info">
                                    {item.to_user_data ?
                                      <>
                                        <div className="type">
                                          {
                                            item.to_user_data?.user_type === 'restaurant' ?
                                              <>
                                                <img src="/images/admin-panel/audit/restaurant.svg" />
                                                Restaurant
                                              </>
                                              :
                                              item.to_user_data?.user_type === 'admin' ?
                                                <>
                                                  <img src="/images/admin-panel/audit/admin-user.svg" />
                                                  Admin
                                                </>
                                                :
                                                item.to_user_data?.user_type === 'driver' ?
                                                  <>
                                                    <img src="/images/admin-panel/audit/driver.svg" />
                                                    Delivery Partner
                                                  </>
                                                  :
                                                  <>
                                                    <img src="/images/admin-panel/audit/customer.svg" />
                                                    User
                                                  </>
                                          }
                                        </div>
                                        <div className="name">
                                          {item.to_user_data?.first_name ?
                                            `${item.to_user_data?.first_name} ${item.to_user_data?.last_name}`
                                            :
                                            ''
                                          }
                                        </div>
                                        <div className="email">
                                          {item.to_user_data?.email ?
                                            item.to_user_data?.email : "Not Found"}
                                        </div>
                                      </>
                                      :
                                      <div className="not-found">
                                        N/A
                                      </div>
                                    }
                                  </div>
                                </td>
                                <td>
                                  <div className="transaction-info">
                                    <div className="type">
                                      {
                                        item.transaction_type === 'payment' ?
                                          <div className="payment">
                                            <img src="/images/admin-panel/audit/payment.svg" />
                                            Payment
                                          </div>
                                          : item.transaction_type === 'Refund' ?
                                            <div className="refund">
                                              <img src="/images/admin-panel/audit/refund.svg" />
                                              Refund
                                            </div>
                                            :
                                            <div className="payment">
                                              <img src="/images/admin-panel/audit/payment.svg" />
                                              {item.transaction_type}
                                            </div>
                                      }
                                    </div>
                                    <div>
                                      <span>Method:</span> {item.payment_method}
                                    </div>
                                    <div className="transaction_id">
                                      <span>ID:</span> {item.transaction_id}
                                    </div>
                                    <div className="amount">
                                      <span>Amount:</span> ₹{item.amount}
                                      <div className={`status ${item.status === 'success' ? 'success' : 'failed'}`}>
                                        {item.status === 'success' ? 'Success' : 'Failed'}
                                      </div>

                                    </div>
                                  </div>
                                </td>
                                <td >
                                  <div className="d-flex justify-content-center flex-column align-items-center">

                                    {/* <div className={` ${item.status == 'success' ? `status-close` : 'status-danger'}`}>

                                      <span>
                                        {item.status}
                                      </span>
                                    </div> */}
                                    <div className="ip-address">
                                      {item.ip_address}
                                    </div>
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


      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={loadTableData} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={loadTableData} />}
      {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'users'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default PaymentAuditList