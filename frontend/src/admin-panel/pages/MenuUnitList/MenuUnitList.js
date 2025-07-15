import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./MenuUnitList.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { PlusSquare } from 'react-feather';

import Pagination from "../../../Pagination";


const MenuUnitList = () => {

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
    setIsLoading(true)
    API.delete(`/restaurants/units/${selectedItem.id}`)
      .then(response => {
        setMessage("Item deleted successfully.");
        setIsMessageModalOpen(true)
    setIsLoading(false)
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
         setIsLoading(false)
});
  }

  const handleInputChange = (e) => {
    setSelectedItem({ ...selectedItem, name: e.target.value })
  };


  const loadTableData = () => {
    setData(null);
    setIsMessageModalOpen(false);
    let apiUrl = `/restaurants/units/?page=${page}&page_size=${pageSize}`;

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


  const save = () => {
    setIsLoading(true)
    if (mode == "add") {
      API.post('/restaurants/units/', { name: selectedItem.name })
        .then((response) => {
          setSelectedItem({});
          showFormPopup(false)
          loadTableData();
          setIsLoading(false)
        })
        .catch((error) => {
          setIsLoading(false)
          setMessage(error.response?.data?.name || error.message);
          setIsErrorModalOpen(true);
        })
    }

    else {
    setIsLoading(true)
      API.put(`/restaurants/units/${selectedItem.id}/`, { name: selectedItem.name })
        .then(response => {
          setSelectedItem({});
          showFormPopup(false)
          setIsLoading(false)

          loadTableData()
        })
        .catch(error => {
          console.error('Error updating data:', error);
          setIsLoading(false)
          setMessage(error.response?.data?.name || error.message);
          setIsErrorModalOpen(true);
        });
    }
  }





  return (
    <div className="admin-list-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="title-header option-title">
                    <h5>All Units</h5>
                    <form className="d-inline-flex">
                      <button onClick={() => { setMode("add"); showFormPopup(true);setSelectedItem({}) }} className="btn-primary" type="button">
                        <PlusSquare />Add New
                      </button>
                    </form>
                  </div>
                  <div className="table-responsive theme-scrollbar">
                    <div>
                      <div id="table_id_wrapper" className="dataTables_wrapper no-footer">
                        <div id="table_id_filter" className="dataTables_filter d-none">
                          <label>
                            <input type="text" className="" aria-controls="table_id" placeholder='Search for Cuisines'
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
                              <th className="text-center">Unit Name</th>
                              {/* <th>Date</th> */}
                              <th>Option</th>
                            </tr>
                          </thead>

                          <tbody>
                            {data && data.results && data.results.map((item) => (
                              <tr>
                                {/* <td>
                                  <input className="custom-checkbox" type="checkbox" name="text" />
                                </td> */}
                                <td className="text-center">{item.name}</td>
                                {/* <td>26-12-2021</td> */}
                                <td>
                                  <ul
                                    className="d-flex align-items-center  justify-content-center">
                                    {/* <li>
                                      <a href="order-detail.html">
                                        <i className="ri-eye-line"></i>
                                      </a>
                                    </li> */}

                                    <li>
                                      <button onClick={() => { setMode("edit"); showFormPopup(true); setSelectedItem(item) }}>
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

      {isFormPopupOpen &&
        <div className='custom-modal'>

          <div className='card'>
            <div className='main'>
              <button type="button" className="close" onClick={() => showFormPopup(false)}>
                <span aria-hidden="true">&times;</span>
              </button>
              <form>
                <div className='mb-2'>
                  <label>Unit Name</label>
                  <div><input className='inp-F0F0F0 w-100 p-2 fw-500 mb-4' placeholder='Add Unit Name'
                    name='cuisine_name'
                    value={selectedItem.name}
                    onChange={handleInputChange}
                    ></input></div>
                </div>
                <input type='hidden' name='id'></input>
                <button type='button' className='btn-primary mx-auto' onClick={save}>
                  Save/Edit
                </button>
              </form>
              <div>


              </div>
            </div>
          </div>
        </div>
      }

      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={loadTableData} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={loadTableData} />}
      {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'menu-unit'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default MenuUnitList