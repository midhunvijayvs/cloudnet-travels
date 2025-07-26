import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./GiftCardList.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"

import Pagination from "../../../Pagination";
import { PlusSquare } from "react-feather";
import { formatDateTime2MonthYearTime } from "../../../GeneralFunctions";
import { getFontSizeFactor, renderDescription } from "../../common-functions/commonFunctions";

const GiftCardList = () => {

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

    let apiUrl = `/restaurants/menu-items/?is_gift_card=True&page=${page}&page_size=${pageSize}`;

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
    API.delete(`/restaurants/menu-items/${selectedItem.id}`)
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
    <div className="admin-list-page giftcard-list-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="title-header option-title">
                    <h5>
                      Gift Card List
                    </h5>
                    <div className="d-inline-flex">
                      <button onClick={() => { navigate('/admin/gift-card/add') }}
                        className="align-items-center m-0 btn save-button d-flex gap-2">
                        <PlusSquare />Add Gift Card
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
                          
                          <label>
                            <input type="text" className="" aria-controls="table_id" placeholder='Search for Gift Cards'
                              id='search' onKeyUp={(e) => setFilters(prevFilters => ({
                                ...prevFilters, search_key: e.target.value
                              }))}
                            />
                          </label>
                        </div>
                        <table className="table category-table" id="table_id">
                          <thead>
                            <tr>
                              <th>Image</th>
                              <th>Title</th>
                              <th>Amount</th>    
                              <th>Date Created</th>                          
                              <th>Actions</th>
                            </tr>
                          </thead>

                          <tbody>
                            {data && data.results && data.results.map((item, index) => (
                              <tr>
                                <td>
                                <div className="table-image">
                                    <img src={item.images?.[0]?.image_url ?? ''} className="img-fluid"
                                      alt=""
                                    />
                                  </div>
                                </td>
                                <td className="subject-short text-capitalize">
                                  {item.name}
                                </td>
                                <td className="title-short">
                                  ₹{item.base_price}
                                </td>
                                <td>{item.created_at && formatDateTime2MonthYearTime(item.created_at)}</td>
                                <td>
                                  <div className="d-flex align-items-center  justify-content-center">
                                    <ul >
                                      {/* <li>
                                        <button className="" onClick={() => {
                                          localStorage.setItem("itemSelectedId", item.id);
                                          navigate("/admin/gift-card/edit")
                                        }}>
                                          <i className="ri-pencil-line"></i>
                                        </button>
                                      </li> */}
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
      {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'gift-card'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default GiftCardList