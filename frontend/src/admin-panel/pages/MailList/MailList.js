import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./MailList.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"


import Pagination from "../../../Pagination";
import { PlusSquare } from "react-feather";
import { convertRichTextJsonToText, formatDateTimeToMonthYear } from "../../../GeneralFunctions";
import { MAIL_LIST_SUBJECTS } from "../../../Constants";
import { getFontSizeFactor, renderDescription } from "../../common-functions/commonFunctions";
import parse from 'html-react-parser';

const MailList = () => {

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

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
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


  const handleCheckboxChange = (filterKey) => (event) => {
    handleFilterChange(filterKey, event.target.checked);
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

    let apiUrl = `/communication/maillists/?page=${page}&page_size=${pageSize}`;

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
    <div className="admin-list-page mail-list-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="title-header option-title">
                    <h5>
                      Mail List
                    </h5>
                    <div className="d-inline-flex">
                      <button onClick={() => { navigate('/admin/mail/add') }}
                        className="align-items-center m-0 btn save-button d-flex gap-2">
                        <PlusSquare />New Mail
                      </button>

                    </div>
                  </div>
                  <div className="table-responsive theme-scrollbar table-product">
                    <div>
                      <div id="table_id_wrapper" className="dataTables_wrapper no-footer">
                        <div id="table_id_filter" className="dataTables_filter d-flex">
                          <div className='filters-tab'>
                            <div onClick={() => handleFilterChange('is_publish', null)}
                              className={`tab ${filters.is_publish == null ? 'active' : ''}`}>
                              All
                            </div>
                            <div onClick={() => handleFilterChange('is_publish', true)}
                              className={`tab ${filters.is_publish == true ? 'active' : ''}`}>
                              Published
                            </div>
                            <div onClick={() => handleFilterChange('is_publish', false)}
                              className={`tab ${filters.is_publish == false ? 'active' : ''}`}>
                              Draft
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
                                <label className="">Recipient Group</label>
                                <select name="to_group" className={`form-select `} value={filters.to_group} onChange={handlePopupFilterChange} >
                                  <option value={null} label="Select"></option>
                                  {['customers', 'restaurants','grocery_stores'].map((star, index) => (
                                    <option key={index} value={star}>
                                      {star.replace(/_/g, ' ')}
                                    </option>
                                  ))}
                                </select>
                                <label className="mt-3">Subject</label>
                                <select className={`form-select `} name="subject" value={filters.subject} onChange={handlePopupFilterChange}>
                                  <option value={null} label="Select"></option>
                                  {MAIL_LIST_SUBJECTS.sort((a, b) => a.localeCompare(b))
                                    .map((item, index) => (
                                      <option value={item}>{item}</option>
                                    ))
                                  }
                                </select>


                                <div className="d-flex w-100 justify-content-end mt-2" >
                                  <button className="reset-btn" onClick={resetFilters}>Reset filters</button>
                                </div>
                              </div>
                            )}
                          </div>
                          <label>
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
                              <th>Recipient Group</th>
                              <th>Subject</th>
                              <th>Title</th>
                              <th>Message</th>
                              <th className="text-center">Published</th>
                              <th>Actions</th>
                            </tr>
                          </thead>

                          <tbody>
                            {data && data.results && data.results.map((item, index) => (
                              <tr>
                                <td>{item.to_group}</td>
                                <td className="subject-short">
                                  {item.subject}
                                </td>
                                <td className="title-short">
                                  {item.title}
                                </td>
                                <td className="description-cell">
                                  {/* {parse(renderDescription(item.description).substring(0,40))} */}
                                  <div className="description-short" onClick={() => { setSelectedItem(item); setIsDetailModalOpen(true) }}>
                                    {convertRichTextJsonToText(item.description)}
                                  </div>
                                  {/* <div className="description-short" onClick={() => { setSelectedItem(item); setIsDetailModalOpen(true) }}>
                                    <i className="ri-eye-line"></i>
                                  </div> */}

                                </td>
                                <td className="text-center" >
                                  <div className="td-check">
                                    {item.is_publish ?
                                      <div className="d-flex justify-content-center align-items-center">
                                        <i className="ri-checkbox-circle-line font-success"></i>
                                        <span className="publish-date ms-1">
                                          {item.published_at && item.published_at.substring(0, 10)}
                                        </span>
                                      </div> :
                                      <i className="ri-close-circle-line font-danger"></i>
                                    }
                                  </div>
                                </td>
                                <td >
                                  <div className="d-flex align-items-center  justify-content-center">
                                    <ul >
                                      {!item.is_publish ?
                                        <li>
                                          <button className="" onClick={() => {
                                            localStorage.setItem("itemSelectedId", item.id);
                                            navigate("/admin/mail/edit")
                                          }}>
                                            <i className="ri-pencil-line"></i>
                                          </button>
                                        </li>
                                        :
                                        <li>

                                        </li>
                                      }
                                    </ul>
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
      {isDetailModalOpen &&
        <div className='custom-modal msg-detail-modal'>
          <div className='card'>
            <div className='first-screen'>
              <div className="description"
                dangerouslySetInnerHTML={{ __html: renderDescription(selectedItem.description, getFontSizeFactor()) }} >
                {/* {selectedItem.description} */}
              </div>
              <div className='footer'>
                <button type='button' className='cancel-button' onClick={() => { setIsDetailModalOpen(false) }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      }


      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={loadTableData} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={loadTableData} />}
      {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'users'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default MailList