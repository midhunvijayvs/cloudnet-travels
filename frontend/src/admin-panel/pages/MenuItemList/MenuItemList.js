import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useLocation, useNavigate } from 'react-router-dom';
import "./MenuItemList.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"


import Pagination from "../../../Pagination";
import { PlusSquare } from "react-feather";
import CustomSearchSelectBox from "../../common-components/CustomSearchSelectBox/CustomSearchSelectBox";
import { SEASONAL_MENU_OPTIONS } from "../../../Constants";


const MenuList = () => {

  const navigate = useNavigate()
  const location = useLocation();

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    search_key: null,
    is_published: null,
    is_available: null,
  });

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState({})

  const [page, setPage] = useState(1);
  const [pageSize, selectPageSize] = useState(12);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortByOpen, setIsSortByOpen] = useState(false);


  const isAnyFilterActive = () => {
    return Object.entries(filters)
      .filter(([key]) => ['restaurant','season'].includes(key))
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
  // const handleFilterChange = (name, value) => {
  //   setFilters(prevFilters => ({
  //     ...prevFilters,
  //     [name]: value
  //   }));
  //   setIsFilterOpen(false);
  // };
  const handleFilterChange = (name, value) => {
    setFilters(
      name === "all"
        ? { is_published: null, is_special: null, is_alcohol: null } // Reset all filters
        : { is_published: null, is_special: null, is_alcohol: null, [name]: value } // Set only the selected filter
    );
    setIsFilterOpen(false);
  };

  const isActiveFilter = (name, value) => {
    return name === "all"
      ? filters.is_published === null && filters.is_special === null && filters.is_alcohol === null
      : filters[name] === value;
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
  }, [page, pageSize, filters, location.state?.reload]);

  const loadTableData = () => {
    // setData(null);
    setIsMessageModalOpen(false);
    let apiUrl = `/restaurants/menu-items/?is_gift_card=False&page=${page}&page_size=${pageSize}`;

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
    navigate("/admin/menu-item/edit")
  }

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

  const handleAvailability = (e, id) => {
    const value = e.target.checked;
    API.put(`/restaurants/menu-items/${id}/`, { is_available: value })
      .then(response => {
        loadTableData();
        // setMessage("Item deleted successfully");
        // setIsMessageModalOpen(true)
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
      });
  }

  const handlePublish = (e, product) => {
    const value = e.target.checked;
    // Check if publish is true and if there are images
    if (value && (!product?.images || product.images.length === 0)) {
      setMessage("Please upload at least one image before publishing.");
      setIsErrorModalOpen(true);
      return;
    }

    API.put(`/restaurants/menu-items/${product?.id}/`, { is_published: value })
      .then(response => {
        loadTableData();
        // setMessage("Item deleted successfully.");
        // setIsMessageModalOpen(true)
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
      });
  }



  return (
    <div className="admin-list-page menuitem-list-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="title-header option-title">
                    <h5>Foods</h5>
                    <form className="d-inline-flex">
                      <button onClick={() => { navigate('/admin/menu-item/add') }}
                        className="align-items-center m-0 btn save-button d-flex gap-2">
                        <PlusSquare />Add New
                      </button>
                    </form>
                  </div>
                  <div className="table-responsive theme-scrollbar">
                    <div>
                      <div id="table_id_wrapper" className="dataTables_wrapper no-footer">
                        <div id="table_id_filter" className="dataTables_filter d-flex">

                          <div className="filters-tab">
                            {[
                              { label: "All", name: "all", value: null },
                              { label: "Published", name: "is_published", value: true },
                              { label: "Draft", name: "is_published", value: false },
                              { label: "Special", name: "is_special", value: true },
                              { label: "Alcohols", name: "is_alcohol", value: true },
                            ].map(({ label, name, value }) => (
                              <div
                                key={label}
                                onClick={() => handleFilterChange(name, value)}
                                className={`tab ${isActiveFilter(name, value) ? "active" : ""}`}
                              >
                                {label}
                              </div>
                            ))}
                          </div>


                          <div className='sortby'>
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
                                <label onClick={() => handleSortChange("popular")}
                                  className={`${filters.sort_by === 'popular' ? 'active' : ''}`}>
                                  Popular </label>
                                {/* <label onClick={() => handleSortChange("rating")} className={`${filters.sort_by === 'rating' ? 'active' : ''}`}>
                                  Rating </label> */}
                                <label onClick={() => handleSortChange("cost")} className={`${filters.sort_by === 'cost' ? 'active' : ''}`}>
                                  Price </label>
                               
                               
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
                          {/* {localStorage.getItem('userRole') !== 'restaurant' && */}
                          
                          {/* } */}
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
                              <th>Product Image</th>
                              <th>Product Name</th>
                              <th>Price</th>
                              <th className="text-center">Publish</th>
                              <th>Category</th>
                            
                              <th className="text-center">Availability</th>
                              <th className="text-center">Reviews</th>
                              <th>Option</th>
                            </tr>
                          </thead>

                          <tbody>
                            {data && data.results && data.results.map((product) => (
                              <tr>
                                {/* <td>
                                <input className="custom-checkbox" type="checkbox" name="text" />
                              </td> */}

                                <td>
                                  <div className="table-image">
                                    <img src={product.images?.[0]?.image_url ?? ''} className="img-fluid"
                                      alt=""
                                    />
                                    {product.is_special &&
                                      <div className="seller-badge special-badge">
                                        <img className="img-fluid badge" src="/images/svg/crown.svg" alt="medal" />
                                        <h6>Special</h6>
                                      </div>
                                    }
                                  </div>
                                </td>

                                <td>{product.name}</td>

                                <td>₹{product.offer_price}</td>

                                <td>
                                  <div className="d-flex align-item-center justify-content-center">
                                    <label className="switch-xsm mb-0 ">
                                      <input type="checkbox"
                                        id="flexSwitchCheckDefault-2"
                                        checked={product.is_published}
                                        onChange={(e) => {
                                          handlePublish(e, product);
                                        }} />
                                      <span className="slider round"></span>
                                    </label>
                                  </div>
                                </td>

                                <td>{product.category_details.name}</td>

                               

                                <td>

                                  <div className="d-flex align-item-center justify-content-center">
                                    <label className="switch-xsm mb-0 ">
                                      <input type="checkbox"
                                        id="flexSwitchCheckDefault-1"
                                        checked={product.is_available}
                                        onChange={(e) => {
                                          handleAvailability(e, product.id);
                                        }} />
                                      <span className="slider round"></span>
                                    </label>
                                  </div>
                                </td>
                                <td>

                                  <ul
                                    className="d-flex align-items-center  justify-content-center">
                                    <li>
                                      <a onClick={() => { navigate('/admin/menu-item-review'); localStorage.setItem('itemSelectedId', product.id) }}>
                                        <i className="ri-eye-line"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </td>
                                <td>
                                  <ul className="d-flex align-items-center  justify-content-center">
                                    <li>
                                      <button onClick={() => { editItem(product.id) }}>
                                        <i className="ri-pencil-line"></i>
                                      </button>
                                    </li>

                                    <li>
                                      <button className="" onClick={() => { setSelectedItem(product); setIsDeleteConfModalOpen(true) }}>
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
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default MenuList