import React, { useEffect, useState } from "react";
import $ from "jquery";
import { useNavigate } from "react-router-dom";
import "../../common-components/AdminListPage.scss";
import "../../common-components/AdminGeneralStyles.scss";
import "./BookingList.scss";

import API from "../../../API";
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner";

import Pagination from "../../../Pagination";

const BookingListForAdmin = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    search_key: null,
    agency_id: null,
    booking_id: null,
    status: null,
    date: null,
    start_date: null,
    end_date: null,
  });

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, selectPageSize] = useState(12);

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, []);

  useEffect(() => {
    loadTableData();
  }, [page, pageSize, filters]);

  const loadTableData = () => {
    setData(null);
    setIsMessageModalOpen(false);

    let apiUrl = `/api/booking/list-for-admin/?page=${page}&page_size=${pageSize}`;

    // Append filters dynamically
    for (let filter in filters) {
      if (filters[filter]) {
        apiUrl += `&${filter}=${filters[filter]}`;
      }
    }

    setIsLoading(true);
    API.get(apiUrl)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
        setIsLoading(false);
      });
  };

  const resetFilters = () => {
    setFilters({
      search_key: null,
      agency_id: null,
      booking_id: null,
      status: null,
      date: null,
      start_date: null,
      end_date: null,
    });
  };

  return (
    <div className="admin-list-page booking-list-page card">
      <div className="card-body">
        <div className="title-header">
          <div className="page-title">All Bookings</div>
        </div>

        <div className="filter-header">
          <input
            type="text"
            className="search-input"
            placeholder="Search agency or user name"
            onKeyUp={(e) =>
              setFilters((prevFilters) => ({
                ...prevFilters,
                search_key: e.target.value,
              }))
            }
          />

          <input
            type="text"
            className="filter-input"
            placeholder="Agency ID"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, agency_id: e.target.value }))
            }
          />

          <input
            type="text"
            className="filter-input"
            placeholder="Booking ID"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, booking_id: e.target.value }))
            }
          />

          <select
            className="filter-input"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>

          <div className="input-group">
            <labal className="label">Exact Date</labal>
            <input
              type="date"
              className="filter-input"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, date: e.target.value }))
              }
            />
          </div>

          <div className="input-group">
            <labal className="label">Range From</labal>
            <input
              type="date"
              className="filter-input"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, start_date: e.target.value }))
              }
            />
          </div>

          <div className="input-group">
            <labal className="label">Range To</labal>
            <input
              type="date"
              className="filter-input"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, end_date: e.target.value }))
              }
            />
          </div>

          <div className="button-box">
            <button className="btn-primary" onClick={loadTableData}>
              Apply
            </button>
            <button className="btn-secondary" onClick={resetFilters}>
              Reset
            </button>
          </div>

        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Ticket ID</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Total Pax</th>
                <th>Agency</th>
                <th>Agent</th>
                <th>Booked at</th>
              </tr>
            </thead>
            <tbody>
              {data && data.results && data.results.length > 0 ? (
                data.results.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.ticket_id.slice(0, 4) + '…'}</td>
                    <td>{item.origin}</td>
                    <td>{item.destination}</td>
                    <td>{item.amount}</td>
                    <td> <span className={`status-label ${item.status=="success"?"success":item.status=="failed"?"failed":"pending"}`}>{item.status}</span></td>
                    <td>{item.total_pax}</td>
                    <td>{item.agency_name}</td>
                    <td>{item.user_full_name}</td>
                    <td>{new Date(item.created_at).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {data && (
          <Pagination
            totalItems={data.count}
            pageSize={pageSize}
            currentPage={page}
            setCurrentPage={setPage}
            selectPageSize={selectPageSize}
          />
        )}

        <ErrorModal
          state={isErrorModalOpen}
          message={message}
          setterFunction={setIsErrorModalOpen}
          okClickedFunction={() => setIsErrorModalOpen(false)}
        />
        {isMessageModalOpen && (
          <PositiveModal
            message={message}
            setterFunction={setIsMessageModalOpen}
            okClickedFunction={() => setIsMessageModalOpen(false)}
          />
        )}
        {isLoading && <FixedOverlayLoadingSpinner />}
      </div>
    </div>
  );
};

export default BookingListForAdmin;
