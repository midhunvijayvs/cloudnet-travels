import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./DineInList.scss"
import "../../common-components/AdminListPage.scss"
import API from '../../../API';
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { formatDateTimeToMonthYear } from "../../../GeneralFunctions";


import Pagination from "../../../Pagination";
import { faL } from "@fortawesome/free-solid-svg-icons";


const DineInList = () => {

  const navigate = useNavigate()

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    search_key: null,
    order: null,
  });

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;


    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };


  const todayClicked = () => {
    setFilters(prevFilters => ({
      ...prevFilters,
      date: 'today'
    }));
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
    let apiUrl = `/dine-in/bookings/?page=${page}&page_size=${pageSize}`;

    // Loop through the filters object and append selected filters to the apiUrl
    for (let filter in filters) {
      if (filters[filter]) {
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

  const changeStatus = (value) => {
    setIsLoading(true)
    API.put(`dine-in/bookings/${selectedItem.id}/`, {"no_of_guest":selectedItem.no_of_guest,"first_name":selectedItem.first_name,"last_name":selectedItem.last_name,"email":selectedItem.email,"phone":selectedItem.phone, 'status':value})
      .then((response) => {
        setIsLoading(false)
        setIsDetailsPopupOpen(false)
        loadTableData()
      })
      .catch((error) => {
        setMessage(error.message || error.data?.message || "Something went wrong")
        setIsLoading(false)
        setIsDetailsPopupOpen(false)
      })
  }

  return (
    <div className="admin-list-page dine-in-list-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="title-header option-title">
                    <h5>Dine-in Booking List</h5>
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
                            <div onClick={resetFilters}
                              className=' btn-outlined py-2 px-3 me-2'>
                              All
                            </div>
<div onClick={todayClicked}
                              className=' btn-outlined py-2 px-3'>
                              Today
                            </div>

                          </div>



                          <div className='filters'>

                            <div onClick={toggleFilterDropdown} className='filter-txt me-2'>
                              <span className="me-1">Filter</span>
                              <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.8374 6.20276L0.806316 0.648682L6.86849 0.648683L3.8374 6.20276Z" fill="#466574" />
                              </svg>
                            </div>

                            {/* Filter Dropdowns */}
                            {isFilterOpen && (

                              <div className='dropdown'>

                                <label className="">Booking ID</label>
                                <input type="text" name="booking_id" value={filters.order} onChange={handleFilterChange} />

                                <label className="mt-3">Date</label>
                                <input
                                  type="date"
                                  name="date"
                                  value={filters.date}
                                  className="date-picker"
                                  onChange={handleFilterChange}
                                  onKeyDown={(e) => { e.preventDefault(); setMessage("Typing not allowed. Please pick the date by clicking on the calendar icon!"); setIsErrorModalOpen(true) }} // prevent typing
                                  onPaste={(e) => e.preventDefault()}   // prevent pasting
                                // readOnly                             // disables typing on some browsers
                                />

                                <div className="d-flex w-100 justify-content-end mt-2" >
                                  <button className="reset-btn" onClick={resetFilters}>Reset filters</button>
                                  {/* <button className="filter-btn d-none" onClick={resetFilters}>Filter</button> */}
                                </div>
                              </div>
                            )}
                          </div>
                          <label>
                            <input type="text" className="" aria-controls="table_id" placeholder='Search By Name'
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
                              <th>Id.</th>
                              <th>Guests</th>
                              <th>Date</th>
                              <th>Time</th>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Phone No.</th>
                              <th>Status</th>
                              <th>Actions</th>
                              {/* <th>Options</th> */}
                            </tr>
                          </thead>

                          <tbody>
                            {data && data.results && data.results.map((item, index) => (
                              <tr>
                                {/* <td>
                                <input className="custom-checkbox" type="checkbox" name="text" />
                              </td> */}
                                <td> #{item.id} </td>
                                <td> {item.no_of_guest} people </td>


                                <td>{item.created_at && formatDateTimeToMonthYear(item.created_at)}</td>

                                <td>{item.from_time}</td>
                                <td>
                                  <div className="user-name">
                                    <span>{item.first_name} {item.last_name}</span>
                                  </div>
                                </td>
                                <td>{item.email}</td>
                                <td>{item.phone}</td>
                               
                                <td>{item.status?.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</td>

                                <td>
                                  <ul className="d-flex align-items-center  justify-content-center">
                                    <li>
                                      <button className="" onClick={() => { setSelectedItem(item); setIsDetailsPopupOpen(true) }}>
                                        <i className="ri-eye-line"></i>
                                      </button>
                                    </li>
                                  </ul>
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


      {isDetailsPopupOpen &&
        <div className='custom-modal'>

          <div className='card'>
            <div className='main'>
              <button type="button" className="close" onClick={() => setIsDetailsPopupOpen(false)}>
                <span aria-hidden="true">&times;</span>
              </button>
              <h1>Booking Details</h1>
              <div className="d-flex flex-column align-items-center px-5 py-3">

                <div className='mb-2 d-flex align-items-center w-100'>
                  <label>BOOKING ID&nbsp;:&nbsp;</label><label>{selectedItem.id}</label>
                </div>

                <div className='mb-2 d-flex align-items-center w-100'>
                  <label>NAME&nbsp;:&nbsp;</label><label>{selectedItem.first_name} {selectedItem.last_name}</label>
                </div>

                <div className='mb-2 d-flex align-items-center w-100'>
                  <label>EMAIL&nbsp;:&nbsp;</label><label>{selectedItem.email}</label>
                </div>
                <div className='mb-2 d-flex align-items-center w-100'>
                  <label>PHONE&nbsp;:&nbsp;</label><label>{selectedItem.phone}</label>
                </div>

                <div className='mb-2 d-flex align-items-center w-100'>
                  <label>NO. OF GUESTS&nbsp;:&nbsp;</label><label>{selectedItem.no_of_guest}</label>
                </div>

                <div className='mb-2 d-flex align-items-center w-100'>
                  <label>DATE&nbsp;:&nbsp;</label><label>{selectedItem.date}</label>
                </div>

                <div className='mb-2 d-flex align-items-center w-100'>
                  <label>CHECK-IN TIME&nbsp;:&nbsp;</label><label>{selectedItem.from_time}</label>
                </div>


 <div className='mb-2 d-flex align-items-center w-100'>
                  <label>STATUS&nbsp;:&nbsp;</label>
                  
                  <select className="btn-outlined px-2 py-2" value={selectedItem.status} onChange={(e) => changeStatus(e.target.value)}>
                  <option value="booked">Booked</option>
                  <option value="seated">Seated</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no_show">No Show</option>
                </select>
                </div>


                

              </div>
              <div>


              </div>
            </div>
          </div>
        </div>
      }

      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={loadTableData} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={loadTableData} />}
      {/* {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'cuisine'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>} */}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default DineInList