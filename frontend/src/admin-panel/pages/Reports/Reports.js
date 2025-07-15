import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./Reports.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"

import Pagination from "../../../Pagination";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import SalesSummary from "../../common-components/SalesSummaryChart/SalesSummaryChart";
import CustomersSummary from "../../common-components/CustomersSummaryChart/CustomersSummaryChart";
import { formatDate, formatDateTime, formatDateTimeToMonthYear } from "../../../GeneralFunctions";
import ReviewSummaryChart from "../../common-components/ReviewSummaryChart/ReviewSummaryChart";


const Reports = () => {

  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [filters, setFilters] = useState({
    search_key: null,
    payment_status: null,
    delivery_status: null,
    date: null,
    is_favourite: null,
  });

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

  return (
    <div className="admin-list-page reports-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">

            <div className="col-xl-6 col-lg-12 col-md-6">
              <div className="card o-hidden pb-0">
                <div className="card-header border-0 pb-1">
                  <div className="card-header-title">
                    <h4>Sales Summary</h4>
                  </div>
                </div>
                <div className="card-body">
                  <SalesSummary />
                </div>
              </div>
            </div>

            <div className="col-xl-6 col-lg-12 col-md-6">
              <div className="h-100">
                <div className="card o-hidden sales overview pb-0">
                  <div className="card-header border-0 pb-1">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="card-header-title">
                        <h4>Orders Count</h4>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <CustomersSummary />

                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-12 col-lg-12 col-md-12">
              <div className="card o-hidden">
                <div className="card-header border-0 pb-1">
                  <div className="card-header-title">
                    <h4>Customers Satisfied</h4>
                  </div>
                </div>
                <div className="card-body p-0">
                  <ReviewSummaryChart />
                </div>
              </div>
            </div>



            <div className="col-12">
              <div className="card">
                <div className="card-header border-0 pb-1">
                  <div className="card-header-title">
                    <h4>Transfer History</h4>
                  </div>
                </div>

                <div className="card-body">
                  <div>
                    <div className="table-responsive theme-scrollbar">
                      <table className="table category-table dataTable no-footer">
                        <thead>
                          <tr>
                            <th>Transfer ID</th>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Options</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data && data.results && data.results
                            .filter((item) => item.payment_method)
                            .map((item, index) => (
                              <tr key={index}>
                                <td className="font-primary f-w-500">{item.payment_reference_number}</td>
                                <td>{item.first_name} {item.last_name}</td>
                                <td>{item.order_placed_datetime && formatDateTimeToMonthYear(item.order_placed_datetime)}</td>
                                <td>£{item.total_amount}</td>
                                <td>
                                  <ul className="d-flex align-items-center justify-content-center gap-3">
                                    <li>
                                      <a onClick={() => {
                                        localStorage.setItem("itemSelectedId", item.id);
                                        navigate("/admin/orders/details")
                                      }}>
                                        <span className="ri-eye-line"></span>
                                      </a>
                                    </li>

                                  </ul>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
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
        </div>
      </div>


      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default Reports