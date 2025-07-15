import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./CouponList.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"

import Pagination from "../../../Pagination";
import { PlusSquare } from "react-feather";
import { convertRichTextJsonToText, formatDateTimeToMonthYear } from "../../../GeneralFunctions";
import { getFontSizeFactor, renderDescription } from "../../common-functions/commonFunctions";
import CustomSearchSelectBox from "../../common-components/CustomSearchSelectBox/CustomSearchSelectBox";

const CouponList = () => {

  const navigate = useNavigate()

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    search_key: null,
  });

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const COUPONFOR_LIST = ['first_time_user', 'loyal_customer', 'all_customers', 'selected_customer', 'selected_item', 'selected_combination']

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

    let apiUrl = `/payments/coupons/?page=${page}&page_size=${pageSize}`;

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
    API.delete(`/payments/coupons/${selectedItem.id}`)
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
    <div className="admin-list-page coupon-list-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="title-header option-title">
                    <h5>
                      Coupon List
                    </h5>
                    <div className="d-inline-flex">
                      <button onClick={() => { navigate('/admin/coupon/add') }}
                        className="align-items-center m-0 btn save-button d-flex gap-2">
                        <PlusSquare />Add Coupon
                      </button>

                    </div>
                  </div>
                  <div className="table-responsive theme-scrollbar table-product">
                    <div>
                      <div id="table_id_wrapper" className="dataTables_wrapper no-footer">
                        <div id="table_id_filter" className="dataTables_filter d-flex">
                          <div className='filters-tab d-none'>
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
                          <div className='filters '>
                            <div onClick={toggleFilterDropdown} className='filter-txt me-2'>
                              <span className="me-1">Filter</span>
                              <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.8374 6.20276L0.806316 0.648682L6.86849 0.648683L3.8374 6.20276Z" fill="#466574" />
                              </svg>
                            </div>
                            {/* Filter Dropdowns */}
                            {isFilterOpen && (
                              <div className='dropdown'>
                                {localStorage.getItem('userRole') !== 'restaurant' &&
                                  <>
                                    <label className="">Restaurant</label>
                                    <CustomSearchSelectBox formData={filters} setFormData={setFilters}
                                      changeKey={'restaurant'} apiGetUrl={`/restaurants/`} />
                                  </>
                                }
                                <label className="mt-2">Coupon For</label>
                                <select name="coupon_for" className={`form-select `} value={filters.coupon_for}
                                  onChange={(e) => handleFilterChange(e.target.name, e.target.value)} >
                                  <option value={null} label="Select"></option>
                                  {COUPONFOR_LIST.map((item, index) => {
                                    let label = item.replace(/_/g, ' ');
                                    if (['Basic', 'Premium', 'Ultimate'].includes(item)) {
                                      label = `${item} user`;
                                    }
                                    return (
                                      <option key={index} className="text-capitalize" value={item}>
                                        {label}
                                      </option>
                                    );
                                  })}
                                </select>
                                <div className="d-flex justify-content-start align-items-center my-2">
                                  <label className="switch-xsm mb-0 ">
                                    <input type="checkbox"
                                      id="flexSwitchCheckDefault-2"
                                      checked={filters.is_seasonal_offer || false}
                                      onChange={handleCheckboxChange('is_seasonal_offer')}
                                    />
                                    <span className="slider round"></span>
                                  </label>
                                  <label className="ms-2">Seasonal Offer</label>
                                </div>

                                <div className="d-flex w-100 justify-content-end mt-2" >
                                  <button className="reset-btn" onClick={resetFilters}>Reset filters</button>
                                </div>
                              </div>
                            )}
                          </div>
                          <label>
                            <input type="search" className="" aria-controls="table_id" placeholder='Search for Coupons'
                              id='search' onKeyUp={(e) => setFilters(prevFilters => ({
                                ...prevFilters, search_key: e.target.value
                              }))}
                            />
                          </label>
                        </div>
                        <table className="table category-table" id="table_id">
                          <thead>
                            <tr>
                              <th>Coupon Code</th>
                              <th>Coupon For</th>
                              <th>Min Order Amount</th>
                              {localStorage.getItem('userRole') !== 'restaurant' &&
                                <th>Restaurant</th>
                              }
                              <th>Terms & conditions</th>
                              <th>Actions</th>
                            </tr>
                          </thead>

                          <tbody>
                            {data && data.results && data.results.map((item, index) => (
                              <tr>
                                <td>{item.coupon_code}</td>
                                <td className="subject-short text-capitalize">
                                  {item.coupon_for?.replace(/_/g, ' ')}
                                </td>
                                <td className="title-short">
                                  £{item.single_order_value}
                                </td>
                                {localStorage.getItem('userRole') !== 'restaurant' &&
                                  <td>{item.restaurant_name || 'All'}</td>
                                }
                                <td className="description-cell">
                                  <div className="description-short" onClick={() => { setSelectedItem(item); setIsDetailModalOpen(true) }}>
                                    {convertRichTextJsonToText(item.terms_and_conditions)}
                                    {/* <i className="ri-eye-line"></i> */}
                                  </div>

                                </td>
                                <td>
                                  <div className="d-flex align-items-center  justify-content-center">
                                    <ul >
                                      <li>
                                        <button className="" onClick={() => {
                                          localStorage.setItem("itemSelectedId", item.id);
                                          navigate("/admin/coupon/edit")
                                        }}>
                                          <i className="ri-pencil-line"></i>
                                        </button>
                                      </li>
                                      <li>
                                        <button className="" onClick={() => { setSelectedItem(item); setIsDeleteConfModalOpen(true) }}>
                                          <i className="ri-delete-bin-line"></i>
                                        </button>
                                      </li>
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
                dangerouslySetInnerHTML={{ __html: renderDescription(selectedItem.terms_and_conditions, getFontSizeFactor()) }} >
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
      {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'coupon'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default CouponList