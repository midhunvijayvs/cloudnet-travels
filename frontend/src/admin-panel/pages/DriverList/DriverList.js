import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./DriverList.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"


import Pagination from "../../../Pagination";
import { PlusSquare } from "react-feather";
import CustomSearchSelectBox from "../../common-components/CustomSearchSelectBox/CustomSearchSelectBox";


const DriverList = () => {

  const navigate = useNavigate()

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({ search_key: null });

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedItem, setSelectedItem] = useState({ id: "", "name": "" })
  const [isFormPopupOpen, showFormPopup] = useState(false)

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


  const deleteItem = () => {
    API.delete(`/delivery_person/${selectedItem.id}`)
      .then(response => {
        setMessage("Item deleted successfully.");
        setIsMessageModalOpen(true)
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
      });
  }

  const loadTableData = () => {
    setData(null);
    setIsMessageModalOpen(false);
    let apiUrl;
    if (window.localStorage.getItem('userRole') === 'restaurant') {
      apiUrl = `/delivery_person/?restaurant_user=${localStorage.getItem("userID")}&page=${page}&page_size=${pageSize}`;
    }
    else if (window.localStorage.getItem('userRole') === 'grocery_store') {
      apiUrl = `/delivery_person/?grocery_store_user=${localStorage.getItem("userID")}&page=${page}&page_size=${pageSize}`;
    }
    else {
      apiUrl = `/delivery_person/?page=${page}&page_size=${pageSize}`;
    }

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

  const handleAddButton = () => {
    navigate('/admin/driver/add')
  }
  const editItem = (idSelected) => {
    localStorage.setItem("itemSelectedId", idSelected);
    navigate("/admin/driver/edit")
  }




  return (
    <div className="admin-list-page driver-list">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="title-header option-title">
                    <h5>All Delivery Persons</h5>
                    {/* {(window.localStorage.getItem('userRole') !== 'admin') && */}
                    <form className="d-inline-flex">
                      <button onClick={handleAddButton} className="align-items-center btn btn-theme d-flex" type="button">
                        <PlusSquare />Add New
                      </button>
                    </form>
                    {/* } */}
                  </div>
                  <div className="table-responsive theme-scrollbar">
                    <div>
                      <div id="table_id_wrapper" className="dataTables_wrapper no-footer">
                        <div id="table_id_filter" className="dataTables_filter d-flex">
                          {(window.localStorage.getItem('userRole') === 'admin') &&
                            <div className="me-4">
                              <CustomSearchSelectBox formData={filters} placeHolder={'Search By Restaurant'}
                                setFormData={setFilters} changeKey={'restaurant'} apiGetUrl={`/restaurants/`} />
                            </div>
                          }
                          {(window.localStorage.getItem('userRole') === 'admin') &&
                            <div className="me-4">
                              <CustomSearchSelectBox formData={filters} placeHolder={'Search By Grocery Store'}
                                setFormData={setFilters} changeKey={'grocery_store'} apiGetUrl={`/grocery/`} />
                            </div>
                          }
                          <label>
                            <input type="text" className="" aria-controls="table_id" placeholder='Search for Drivers'
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
                              <th>Name</th>
                              <th>Email</th>
                              <th>Phone Number</th>
                              {(window.localStorage.getItem('userRole') === 'admin') &&
                                <th>Restaurant/Store</th>
                              }
                              <th>Option</th>
                            </tr>
                          </thead>

                          <tbody>
                            {data && data.results && data.results.map((item, index) => (
                              <tr key={index}>
                                {/* <td>
                                  <input className="custom-checkbox" type="checkbox" name="text" />
                                </td> */}
                                <td>
                                  <div className="user-name">
                                    {item?.user_info.profile_image ?
                                      <img className="user-img img-fluid" src={item?.user_info?.profile_image} alt=""></img> :
                                      <img className="user-img img-fluid" src="/images/no-profile-image.png" alt=""></img>
                                    }
                                    <span>{item.user_info.first_name} {item.user_info.last_name}</span>
                                  </div>
                                </td>
                                <td>
                                  <div className="email">{item.user_info.email}  </div>
                                </td>
                                <td>+{item.user_info.phone_number}</td>
                                {(window.localStorage.getItem('userRole') === 'admin') &&
                                  <td>{item.host_restaurant_details?.name ?? item.host_grocery_store_details?.name}</td>
                                }
                                <td>
                                  <ul
                                    className="d-flex align-items-center  justify-content-center">
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
                                    <li>
                                      <button onClick={() => {
                                        localStorage.setItem("itemSelectedId", item.id);
                                        navigate("/admin/driver/details")
                                      }}
                                      >
                                        <i className="ri-eye-line"></i>
                                      </button>
                                    </li>

                                    {/* {(window.localStorage.getItem('userRole') !== 'admin') ?
                                      <>
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
                                      </>
                                      :
                                      <li>
                                        <button onClick={() => {
                                          localStorage.setItem("itemSelectedId", item.id);
                                          navigate("/admin/driver/details")
                                        }}
                                        >
                                          <i className="ri-eye-line"></i>
                                        </button>
                                      </li>
                                    } */}
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
      {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'driver'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default DriverList