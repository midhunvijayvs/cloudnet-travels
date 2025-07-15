import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./CurrencyList.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { PlusSquare } from 'react-feather';

import Pagination from "../../../Pagination";


const CurrencyList = () => {

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
    API.delete(`/payments/currency-rate/${selectedItem.id}`)
      .then(response => {
        setMessage("Item deleted successfully.");
        setIsMessageModalOpen(true)
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
      });
  }

  const handleInputChange = (e) => {
    setSelectedItem({ ...selectedItem, [e.target.name]: e.target.value })
  };


  const loadTableData = () => {
    setData(null);
    setIsMessageModalOpen(false);
    let apiUrl = `/payments/currency-rate/?page=${page}&page_size=${pageSize}`;

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
      API.post('/payments/currency-rate/', selectedItem)
        .then((response) => {
          setSelectedItem({});
          showFormPopup(false)
          loadTableData();
          setIsLoading(false)
        })
        .catch((error) => {
          setIsLoading(false)
          setMessage(error.response?.data?.message || error.message);
          setIsErrorModalOpen(true);
        })
    }

    else {
      API.put(`/payments/currency-rate/${selectedItem.id}/`, selectedItem)
        .then(response => {
          setSelectedItem({});
          showFormPopup(false)
          setIsLoading(false)

          loadTableData()
        })
        .catch(error => {
          console.error('Error updating data:', error);
          setIsLoading(false)
          setMessage(error.response?.data?.message || error.message);
          setIsErrorModalOpen(true);
        });
    }
  }





  return (
    <div className="admin-list-page ">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="title-header option-title">
                    <h5>Currency List</h5>
                    <form className="d-inline-flex">
                      <button onClick={() => { setMode("add"); showFormPopup(true);setSelectedItem({}) }} className="align-items-center btn btn-theme d-flex" type="button">
                        <PlusSquare />Add New
                      </button>
                    </form>
                  </div>
                  <div className="table-responsive theme-scrollbar">
                    <div>
                      <div id="table_id_wrapper" className="dataTables_wrapper no-footer">
                        <div id="table_id_filter" className="dataTables_filter">
                          <label>
                            <input type="text" className="" aria-controls="table_id" placeholder='Search for Currencies'
                              id='search' onKeyUp={(e) => setFilters(prevFilters => ({
                                ...prevFilters, search_key: e.target.value
                              }))}
                            />
                          </label></div>
                        <table className="table category-table" id="table_id">
                          <thead>
                            <tr>
                              {/* <th><input id="checkall" className="custom-checkbox" type="checkbox" name="text" />
                              </th> */}
                              <th>Currency</th>
                              <th>Code</th>
                              <th>Symbol</th>
                              {/* <th>Exchange Rate</th> */}
                              <th>Option</th>
                            </tr>
                          </thead>

                          <tbody>
                            {data && data.results && data.results.map((currency) => (
                              <tr>
                                {/* <td>
                                  <input className="custom-checkbox" type="checkbox" name="text" />
                                </td> */}
                                <td>{currency.title}</td>
                                <td>{currency.code}</td>
                                <td>{currency.symbol}</td>
                                {/* <td>{currency.exchange_rate}</td> */}
                                <td>
                                  <ul
                                    className="d-flex align-items-center  justify-content-center">
                                    {/* <li>
                                      <a href="order-detail.html">
                                        <i className="ri-eye-line"></i>
                                      </a>
                                    </li> */}

                                    <li>
                                      <button onClick={() => { setMode("edit"); showFormPopup(true); setSelectedItem(currency) }}>
                                        <i className="ri-pencil-line"></i>
                                      </button>
                                    </li>

                                    <li>
                                      <button className="" onClick={() => { setSelectedItem(currency); setIsDeleteConfModalOpen(true) }}>
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
                  <label>Currency</label>
                  <div><input className='inp-F0F0F0 w-100 p-2 fw-500' placeholder='Title'
                    name='title'
                    value={selectedItem.title}
                    onChange={handleInputChange}
                  ></input></div>
                </div>
                <div className="d-flex w-100">
                  <div className='mb-2 w-50 me-2'>
                    <label>Code</label>
                    <div><input className='inp-F0F0F0 w-100 p-2 fw-500' placeholder='Code'
                      name='code'
                      value={selectedItem.code}
                      onChange={handleInputChange}
                    ></input></div>
                  </div>
                  <div className='mb-2 w-50'>
                    <label>Symbol</label>
                    <div><input className='inp-F0F0F0 w-100 p-2 fw-500' placeholder='Symbol'
                      name='symbol'
                      value={selectedItem.symbol}
                      onChange={handleInputChange}
                    ></input></div>
                  </div>
                </div>

                <input type='hidden' name='id'></input>
                <button type='button' className='btn-primary submit-btn w-100 rounded-2' onClick={save}>
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
      {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'cuisine'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default CurrencyList