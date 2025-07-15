import React, { useRef } from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./DeliveryAuditList.scss"

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


const DeliveryAuditList = () => {

  const navigate = useNavigate()

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    search_key: null,
    start_date: null,
    end_date: null,
    userType: "",
    status: "",
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
      userType: "",
      status: "",
    });

    setIsFilterOpen(false);
  };

  useEffect(() => {
    loadTableData();
  }, [page, pageSize, filters]);

  const loadTableData = () => {
    setData(null);
    setIsMessageModalOpen(false);

    let apiUrl = `/order/delivery-audit/?page=${page}&page_size=${pageSize}`;

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




  return (
    <div className="admin-list-page delivery-audit-list-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="title-header option-title">
                    <h5>
                      Delivery Audit
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
                              {/* driver */}
                              <div className="filter-item">
                                <label htmlFor="search">Delivery Person:</label>
                                <CustomSearchSelectBox formData={filters} setFormData={setFilters} resourceName={'driver'}
                                  changeKey={'driver'} placeHolder={'Search Delivery Persons'} apiGetUrl={`/delivery_person/?is_registration_completed=True`} />
                              </div>
                              {/* restaurant */}
                              <div className="filter-item">
                                <label htmlFor="search">Restaurant:</label>
                                <CustomSearchSelectBox formData={filters} setFormData={setFilters} resourceName={'restaurant'}
                                  changeKey={'restaurant'} placeHolder={'Search Restauarant'} apiGetUrl={`/restaurants/`} />
                              </div>

                              <div className="filter-item d-none">
                                <label htmlFor="userType">User Type:</label>
                                <select
                                  id="userType"
                                  name="userType"
                                  value={filters.userType}
                                  onChange={handleFilterChange}
                                >
                                  <option value="">All</option>
                                  <option value="restaurant">Restaurant</option>
                                  <option value="admin">Admin</option>
                                  <option value="customer">Customer</option>
                                </select>
                              </div>

                              <div className="filter-item d-none">
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
                              {/* search_key */}
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
                              {/* Updated By */}
                              <div className="filter-item">
                                <label htmlFor="updated_by">Updated By:</label>
                                <CustomSearchSelectBox formData={filters} setFormData={setFilters} resourceName={'user'}
                                  changeKey={'updated_by'} placeHolder={'Search Users'} apiGetUrl={`/user/verified-users/`} />
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
                              <th>Order ID</th>
                              <th className="user-info">Order Details</th>
                              <th>Action Performed</th>
                              <th>Updated By</th>
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
                                  {item.order ?
                                    <div>#{item.order}</div>
                                    :
                                    <div className="not-found">N/A</div>
                                  }
                                </td>
                                <td>
                                  <div className="user-info">
                                    {item.order_details?.user_email ?
                                      <div className="item customer">
                                        <div className="name">
                                          <img src="/images/admin-panel/audit/customer.svg" />
                                          {item.order_details?.user_first_name} {item.order_details?.user_last_name}
                                        </div>
                                        <div className="email">
                                          {item.order_details?.user_email}
                                        </div>
                                      </div>
                                      :
                                      <div className="item customer">
                                        <div className="name not-found">
                                          <img src="/images/admin-panel/audit/customer.svg" />
                                          Customer: N/A
                                        </div>

                                      </div>
                                    }
                                    {item.order_details?.restaurant_name ?
                                      <div className="item restaurant">
                                        <div className="name">
                                          <img src="/images/admin-panel/audit/restaurant.svg" />
                                          {item.order_details?.restaurant_name}
                                        </div>
                                        <div className="email">
                                          {item.order_details?.restaurant_county}
                                        </div>
                                      </div>
                                      :
                                      <div className="item restaurant">
                                        <div className="name not-found">
                                          <img src="/images/admin-panel/audit/restaurant.svg" />
                                          Restaurant: N/A
                                        </div>

                                      </div>
                                    }
                                    {item.order_details?.delivery_person_email ?
                                      <div className="item driver">
                                        <div className="name">
                                          <img src="/images/admin-panel/audit/driver.svg" />
                                          {item.order_details?.delivery_person_first_name} {item.order_details?.delivery_person_last_name}
                                        </div>
                                        <div className="email">
                                          {item.order_details?.delivery_person_email}
                                        </div>
                                      </div>
                                      :
                                      <div className="item driver">
                                        <div className="name not-found">
                                          <img src="/images/admin-panel/audit/driver.svg" />
                                          Delivery Person: N/A
                                        </div>

                                      </div>
                                    }
                                  </div>
                                </td>

                                <td>
                                  <div className="action-details">
                                    {item.action_performed}
                                  </div>
                                  {item.delay_reason &&
                                    <div className="reason">
                                      <span>Reason:</span> {item.delay_reason}
                                    </div>
                                  }
                                </td>
                                <td>
                                  <div className="user-info">
                                    {item.action_owner_details ?
                                      <>
                                        <div className="type">
                                          {
                                            item.action_owner_details?.user_type === 'restaurant' ?
                                              <>
                                                <img src="/images/admin-panel/audit/restaurant.svg" />
                                                Restaurant
                                              </>
                                              :
                                              item.action_owner_details?.user_type === 'admin' ?
                                                <>
                                                  <img src="/images/admin-panel/audit/admin-user.svg" />
                                                  Admin
                                                </>
                                                :
                                                item.action_owner_details?.user_type === 'driver' ?
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
                                          {item.action_owner_details?.first_name ?
                                            `${item.action_owner_details?.first_name} ${item.action_owner_details?.last_name}`
                                            :
                                            ''
                                          }
                                        </div>
                                        <div className="email">
                                          {item.action_owner_details?.email ?
                                            item.action_owner_details?.email : "Not Found"}
                                        </div>
                                      </>
                                      :
                                      <div className="not-found">
                                        N/A
                                      </div>
                                    }

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
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default DeliveryAuditList