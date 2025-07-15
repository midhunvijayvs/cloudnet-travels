import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./InvoiceList.scss"
import "../../common-components/AdminListPage.scss"
import API from '../../../API';
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { formatDateTimeToMonthYear } from "../../../GeneralFunctions";


import Pagination from "../../../Pagination";


const InvoiceList = () => {

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

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    let normalizedValue = value;
    if (name === 'order') {
      // Convert lowercase 'g' to uppercase 'G' at the start
      normalizedValue = value.replace(/^g/, 'G');

      // Validate: allow '', 'G', '123', 'G123'
      if (!/^[G]?\d*$/.test(normalizedValue)) {
        return;
      }
    }

    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: normalizedValue
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
    let apiUrl = `/payments/invoices/?page=${page}&page_size=${pageSize}`;

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


  return (
    <div className="admin-list-page invoice-list-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="title-header option-title">
                    <h5>Invoice List</h5>
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
                                <label className="">Order ID</label>
                                <input type="text" name="order" value={filters.order} onChange={handleFilterChange} />
                                <div className="d-flex w-100 justify-content-end mt-2" >
                                  <button className="reset-btn" onClick={resetFilters}>Reset filters</button>
                                  {/* <button className="filter-btn d-none" onClick={resetFilters}>Filter</button> */}
                                </div>
                              </div>
                            )}
                          </div>
                          <label>
                            <input type="text" className="" aria-controls="table_id" placeholder='Search By Customer Name'
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
                              <th>Invoice No.</th>
                              <th>Order ID</th>
                              <th>Customer</th>
                              <th>Issued Date</th>
                              <th>Restaurant</th>
                              <th>Total</th>
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
                                <td> #{item.order} </td>
                                <td>
                                  <div className="user-name">
                                    <span>{item.user}</span>
                                  </div>
                                </td>
                                <td>{item.created_at && formatDateTimeToMonthYear(item.created_at)}</td>
                                <td>{item.restaurant}</td>
                                <td>£{item.total_amount && item.total_amount.toFixed(2)}</td>
                                <td>
                                  <ul className="d-flex align-items-center  justify-content-center">
                                    <li>
                                      <button className="" onClick={() => { localStorage.setItem("itemSelectedId", item.id); navigate("/admin/invoice/details") }}>
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


      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={loadTableData} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={loadTableData} />}
      {/* {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'cuisine'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>} */}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default InvoiceList