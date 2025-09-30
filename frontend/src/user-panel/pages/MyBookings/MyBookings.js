import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import API from '../../../API';
import '../../common-components/MultipleImageUploader.css'
import './MyBookings.scss'
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import PhoneInputField from '../../../authentication/pages/CustomPhone/CustomPhoneInput';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { UserContext } from '../../../authentication/pages/UserContext';
import ChangePasswordPopup from '../../common-components/ChangePasswordPopup/ChangePasswordPopup';
import SupportPagesLayout from '../../common-components/SupportPagesLayout/SupportPagesLayout.js'
import Empty from '../../../Empty.js'
import { ArrowUpRight, ArrowDownRight } from "react-feather";


const ProfilePage = ({ userData, loadUserData }) => {

  const navigate = useNavigate()


  const [popupTitle, setPopupTitle] = useState(null)
  const [popupMessage, setPopupMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

const [filters, setFilters] = useState({
  booking_id: "",
  status: "",
  date: "",
  start_date: "",
  end_date: "",
});

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn, login, logout } = useContext(UserContext);

  const [tableData, setTableData] = useState([])
const [page, setPage] = useState(1);

  useEffect(() => {
    loadUserData();
    fetchBookings()
  }, []);



  const handleFilterApply = () => {
  setPage(1); // reset to first page when applying filters
  fetchBookings(filters, 1);
};

const handleFilterReset = () => {
  const resetFilters = {
    booking_id: "",
    status: "",
    date: "",
    start_date: "",
    end_date: "",
  };
  setFilters(resetFilters);
  setPage(1);
  fetchBookings(resetFilters, 1);
};



 const fetchBookings = (filters = {}, page = 1) => {
  setIsLoading(true);

  const query = new URLSearchParams({
    ...filters,
    page: page,
    page_size: 10, // default size
  }).toString();

  API.get(`/api/booking/list-for-agency/?${query}`)
    .then((response) => {
      setTableData(response.data);
      setIsLoading(false);
    })
    .catch((error) => {
      setIsLoading(false);
      setPopupTitle("Error");
      setPopupMessage("Error loading booking history");
      setIsErrorModalOpen(true);
    });
};


  return (
    <SupportPagesLayout currentActiveIndex={1} title="My Bookings" breadcrumb={[{ name: "Home", link: "/" }, { name: "My Bookings", link: "#" }]}>
      {userData &&
        <div className='booking-page'>



          <div className='booking-history'>
            <h5 className="section-title">Booking history</h5>
       
       {/* Filter Section */}
    <div className="filter-container">
  
  
    <div className=' input-group search-input-group'>
   <label>Search:</label>  
   <input
        type="text"
        placeholder="Search Booking ID"
        value={filters.booking_id || ""}
        onChange={(e) => setFilters({ ...filters, booking_id: e.target.value })}
      />
 </div> 
   

       <div className=' input-group status-input-group'>
   <label>Status:</label>  
    <select
        value={filters.status || ""}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      >
        <option value="">All Status</option>
        <option value="confirmed">Confirmed</option>
        <option value="pending">Pending</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>



     <div className=' input-group date-input-group'>
   <label>Exact Date:</label>  
      <input
        type="date"
        value={filters.date || ""}
        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
      />
    </div>
 


  <div className=' input-group date-input-group'>
   <label>From Date:</label>  
      <input
        type="date"
        value={filters.start_date || ""}
        onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
      />
    </div>

     <div className=' input-group date-input-group'>
   <label>To Date:</label>     <input
        type="date"
        value={filters.end_date || ""}
        onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
      />
    </div>


<div className='button-box'>
      <button onClick={handleFilterApply}>Apply</button>
      <button onClick={handleFilterReset}>Reset</button>
   </div>
    </div>

     <div className='table-wrapper'>
              {tableData && tableData.results && tableData.results.length > 0 ?
                <table className="table table-bordered mb-4">
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
                                                                <th>Booked at</th>
                                                            </tr>
                  </thead>
                  <tbody>
                    {tableData.results.map((item) => (

                    <tr key={item.id}>
                                                                        <td>#{item.id}</td>
                                                                        <td>{item.ticket_id.slice(0, 4) + '…'}</td>
                                                                        <td>{item.origin}</td>
                                                                        <td>{item.destination}</td>
                                                                        <td>{item.amount}</td>
                                                                        <td> <span className={`status-label ${item.status == "success" ? "success" : item.status == "failed" ? "failed" : "pending"}`}>{item.status}</span></td>
                                                                        <td>{item.total_pax}</td>
                                                                        <td>{item.agency_name}</td>
                                                                        <td>{new Date(item.created_at).toLocaleString()}</td>
                                                                    </tr>

                    ))}
                  </tbody>
                </table>
                :
                <Empty />
              }
            </div>
          </div>


        </div>
      }
      {isMessageModalOpen &&

        <PositiveModal
          title={popupTitle}
          message={popupMessage}
          state={isMessageModalOpen}
          setterFunction={setIsMessageModalOpen}
          okClickedFunction={() => {
            loadUserData();
            fetchBookings()
          }}
        />

      }
      <ErrorModal state={isErrorModalOpen} message={popupMessage} setterFunction={setIsErrorModalOpen} okClickedFunction={loadUserData} />
      {isLoading && <FixedOverlayLoadingSpinner />}
    </SupportPagesLayout>
  )

}

export default ProfilePage