import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./MenuCombinationList.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"


import Pagination from "../../../Pagination";
import { PlusSquare } from "react-feather";
import CustomSearchSelectBox from "../../common-components/CustomSearchSelectBox/CustomSearchSelectBox";


const MenuCombinationList = () => {

  const navigate = useNavigate()

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    search_key: null,
    is_published: null,
    is_available: null,
  });

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState({})
  const [mode, setMode] = useState("add");

  const [page, setPage] = useState(1);
  const [pageSize, selectPageSize] = useState(12);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortByOpen, setIsSortByOpen] = useState(false);


  const isAnyFilterActive = () => {
    return Object.entries(filters)
      .filter(([key]) => ['restaurant'].includes(key))
      .some(([, value]) => value !== null);
  };

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  const toggleSortByDropdown = () => {
    setIsSortByOpen(!isSortByOpen);
  };
  const handleSortChange = (value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      sort_by: value
    }));
    setIsSortByOpen(!isSortByOpen);
  }
  const handleFilterChange = (name, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
    setIsFilterOpen(false);
  };
  const resetFilters = () => {
    setFilters({

    });
    setIsFilterOpen(false);
  };

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
    let apiUrl = `/restaurants/combinations/?page=${page}&page_size=${pageSize}`;

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

  const editItem = (idSelected) => {
    localStorage.setItem("itemSelectedId", idSelected);
    navigate("/admin/menu-combination/edit")
  }

  const deleteItem = () => {
    API.delete(`/restaurants/combinations/${selectedItem.id}`)
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
    <div className="admin-list-page menucombination-list-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="title-header option-title">
                    <h5>Combinations</h5>
                    <form className="d-inline-flex">
                      <button onClick={() => { navigate('/admin/menu-combination/add') }}
                        className="align-items-center m-0 btn save-button d-flex gap-2">
                        <PlusSquare />Create Combination
                      </button>
                    </form>
                  </div>
                  <div className="table-responsive theme-scrollbar">
                    <div>
                      <div id="table_id_wrapper" className="dataTables_wrapper no-footer">
                        <div id="table_id_filter" className="dataTables_filter d-flex">

                          <div className='filters-tab d-none'>
                            <div onClick={() => handleFilterChange('is_published', null)}
                              className={`tab ${filters.is_published === null ? 'active' : ''}`}>
                              All
                            </div>
                            <div onClick={() => handleFilterChange('is_published', true)}
                              className={`tab ${filters.is_published == true ? 'active' : ''}`}>
                              Published
                            </div>
                            <div onClick={() => handleFilterChange('is_published', false)}
                              className={`tab ${filters.is_published == false ? 'active' : ''}`}>
                              Draft
                            </div>
                          </div>
                          <div className='sortby d-none'>
                            <div onClick={toggleSortByDropdown} className={`filter-txt me-2 ${filters.sort_by ? 'active' : ''}`}>
                              <span className="me-1">Sort</span>
                              <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.8374 6.20276L0.806316 0.648682L6.86849 0.648683L3.8374 6.20276Z" fill="#466574" />
                              </svg>
                            </div>
                            {/* sortby Dropdowns */}
                            {isSortByOpen && (
                              <div className='dropdown'>
                                <label onClick={() => handleSortChange("new_food")}
                                  className={`${filters.sort_by === 'new_food' ? 'active' : ''}`}>
                                  New Food </label>
                                <label onClick={() => handleSortChange("rating")} className={`${filters.sort_by === 'rating' ? 'active' : ''}`}>
                                  Rating </label>
                                <label onClick={() => handleSortChange("price")} className={`${filters.sort_by === 'price' ? 'active' : ''}`}>
                                  Price </label>
                                {localStorage.getItem('userRole') !== 'restaurant' &&
                                  <label onClick={() => handleSortChange("new_restaurant")} className={`${filters.sort_by === 'new_restaurant' ? 'active' : ''}`}>
                                    New Restaurant </label>
                                }
                                <div className="d-flex w-100 justify-content-end mt-2" >
                                  <button className="reset-btn"
                                    onClick={() => {
                                      setFilters(prevFilters => ({
                                        ...prevFilters,
                                        sort_by: null
                                      })); setIsSortByOpen(false)
                                    }}>Clear</button>
                                </div>
                              </div>
                            )}
                          </div>
                          {localStorage.getItem('userRole') !== 'restaurant' &&
                            <div className='filters'>
                              <div onClick={toggleFilterDropdown} className={`filter-txt me-2 ${isAnyFilterActive() ? 'active' : ''}`}>
                                <span className="me-1">Filter</span>
                                <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3.8374 6.20276L0.806316 0.648682L6.86849 0.648683L3.8374 6.20276Z" fill="#466574" />
                                </svg>
                              </div>
                              {/* Filter Dropdowns */}
                              {isFilterOpen && (
                                <div className='dropdown'>
                                  <label className="">Restaurant</label>
                                  <CustomSearchSelectBox formData={filters} setFormData={setFilters}
                                    changeKey={'restaurant'} apiGetUrl={`/restaurants/`} />
                                  <div className="d-flex w-100 justify-content-end mt-2" >
                                    <button className="reset-btn" onClick={resetFilters}>Reset filters</button>
                                  </div>
                                </div>
                              )}
                            </div>
                          }
                          <label>
                            <input type="text" className="" aria-controls="table_id" placeholder='Search for Foods'
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
                              <th>Combination</th>
                              {localStorage.getItem('userRole') !== 'restaurant' &&
                                <th>Restaurant</th>
                              }
                              <th>Option</th>
                            </tr>
                          </thead>

                          <tbody>
                            {data && data.results && data.results.map((item) => (
                              <tr>
                                {/* <td>
                                <input className="custom-checkbox" type="checkbox" name="text" />
                              </td> */}

                                <td className="combination-cell">
                                  {item.menuitems.map((menu, index) => (
                                    <React.Fragment key={index}>
                                      {menu.name}
                                      {index !== item.menuitems.length - 1 && ', '}
                                    </React.Fragment>
                                     ))}
                                </td>
                                {localStorage.getItem('userRole') !== 'restaurant' &&
                                  <td className="restaurant-cell">{item?.menuitems?.[0]?.restaurant_details?.name || 'Null'}</td>
                                }
                                <td>
                                  <ul className="d-flex align-items-center  justify-content-center">
                                    <li>
                                      <button onClick={() => { editItem(item.id) }}>
                                        <i className="ri-pencil-line"></i>
                                      </button>
                                    </li>

                                    <li>
                                      <button className="" onClick={() => { setSelectedItem(item); setIsDeleteConfModalOpen(true) }}>
                                        <i className="ri-delete-bin-line"></i>
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
      {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'cuisine'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>}
      {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'cuisine'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default MenuCombinationList