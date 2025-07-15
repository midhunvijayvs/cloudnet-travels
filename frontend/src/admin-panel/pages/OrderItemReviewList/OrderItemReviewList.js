import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./OrderItemReviewList.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"


import Pagination from "../../../Pagination";
import { PlusSquare } from "react-feather";
import { formatDateTimeToMonthYear } from "../../../GeneralFunctions";
import { DELIVERY_STATUSES } from "../../../Constants";


const OrderItemReviewList = () => {

  const navigate = useNavigate()

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    search_key: null,
    rating: null,
  });

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

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
    let apiUrl = `/order/order-item-reviews/?page=${page}&page_size=${pageSize}`;

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





  return (
    <div className="orderitem-review-list-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-table">
                <div className="card-body">
                  <div className="title-header option-title">
                    <h5>Order Item Review List</h5>
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

                          <label>
                            <input type="text" className="" aria-controls="table_id" placeholder='Search for Reviews'
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
                              <th>Menu Item</th>
                              <th>Order ID</th>
                              <th>Order Item ID</th>
                              <th>User</th>
                              <th>Rating</th>
                              {/* <th>Taste Rating</th>
                              <th>Freshness Rating</th> */}
                              {/* <th>Options</th> */}
                            </tr>
                          </thead>

                          <tbody>
                            {data && data.results &&
                              // data.results.some(item => item.overall_rating || item.taste_rating || item.freshness_rating) && 
                              data.results.map((item, index) => (
                                // (item.overall_rating || item.taste_rating || item.freshness_rating) && 
                                (
                                  <tr>
                                    {/* <td>
                                    <input className="custom-checkbox" type="checkbox" name="text" />
                                  </td> */}
                                    <td className={`${!item.menu_item_name && 'not-found'}`}>{item.menu_item_name ?? 'N/A'}</td>
                                    <td>
                                      #{item.order}
                                    </td>
                                    <td>
                                      #{item.order_item}
                                    </td>
                                    <td>
                                      <div className="user-name">
                                        {item.profile_image ?
                                          <img className="user-img img-fluid" src={item.profile_image} alt="p1"></img> :
                                          <img className="user-img img-fluid" src="/images/no-profile-image.png" alt="p1"></img>
                                        }
                                        <span>{item.username}</span>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="rating-container">
                                        <div className="rating-item">
                                          <div>
                                            Overall
                                          </div>
                                          {item.overall_rating && item.overall_rating != 0 ?
                                            <div className="d-flex rating-box">
                                              <div className='star-box'>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                  <svg
                                                    key={star}
                                                    width="33"
                                                    height="31"
                                                    viewBox="0 0 33 31"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"

                                                  >
                                                    <path
                                                      className={item.overall_rating >= star ? "filled" : ""}
                                                      d="M14.0471 1.88531L10.9293 8.52294C10.8366 8.72034 10.7038 8.88237 10.5406 9.00038C10.3765 9.1191 10.18 9.19684 9.96248 9.22401L2.68825 10.1394C2.1827 10.1998 1.72842 10.3981 1.35988 10.7023C0.992252 11.0055 0.713381 11.4143 0.550152 11.9159C0.399122 12.4044 0.389986 12.8858 0.505896 13.3368C0.625784 13.7999 0.875401 14.228 1.24417 14.5733L6.59282 19.5906C6.75392 19.7417 6.86866 19.9189 6.93024 20.1093C6.99159 20.2987 7.00377 20.509 6.96138 20.7265L5.57775 27.9552C5.48807 28.4467 5.53747 28.93 5.70958 29.3651C5.88473 29.8081 6.18702 30.201 6.59891 30.5001C7.00869 30.7982 7.47698 30.9644 7.95443 30.9935C8.42884 31.0227 8.91216 30.9169 9.35515 30.6722L15.78 27.1352C15.9722 27.0294 16.1769 26.976 16.3783 26.976C16.5796 26.976 16.7831 27.0294 16.9754 27.1352L23.4002 30.6722C23.8444 30.9169 24.3267 31.0227 24.8009 30.9935C25.2802 30.9633 25.7464 30.7982 26.1574 30.5001C26.5693 30.2011 26.8713 29.8081 27.0467 29.3651C27.2219 28.923 27.2692 28.4315 27.1736 27.9321L25.7949 20.7256C25.7537 20.508 25.7647 20.2975 25.8261 20.1083C25.8874 19.918 26.0024 19.7407 26.1635 19.5897L31.5121 14.5724C31.8807 14.227 32.1294 13.7999 32.2493 13.3377C32.3691 12.8754 32.356 12.3809 32.1998 11.8995C32.0427 11.4131 31.7638 11.0052 31.3962 10.7011C31.0277 10.3969 30.5725 10.1976 30.0679 10.1342L22.793 9.22164C22.5746 9.19355 22.379 9.11698 22.2149 8.99802C22.0529 8.88024 21.9189 8.71797 21.8262 8.52058L18.7084 1.88295C18.4908 1.42072 18.1625 1.04912 17.7617 0.794359L17.7092 0.764152C17.3154 0.526485 16.8592 0.397461 16.3759 0.397461C15.8683 0.397461 15.3941 0.537485 14.9902 0.794358C14.5893 1.04912 14.261 1.41982 14.0435 1.88295L14.0471 1.88531Z"
                                                      stroke="#868790"
                                                      strokeWidth="0.916276"
                                                      fill="#E05A67"
                                                    />
                                                  </svg>
                                                ))}
                                              </div>
                                              {/* <div className="ms-2">{item.overall_rating}</div> */}
                                            </div>
                                            :
                                            <div className="no-data">N/A</div>
                                          }
                                        </div>
                                        <div className="rating-item">
                                          <div>
                                            Taste
                                          </div>
                                          {item.taste_rating && item.taste_rating != 0 ?
                                            <div className="d-flex rating-box">
                                              <div className='star-box'>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                  <svg
                                                    key={star}
                                                    width="33"
                                                    height="31"
                                                    viewBox="0 0 33 31"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"

                                                  >
                                                    <path
                                                      className={item.taste_rating >= star ? "filled" : ""}
                                                      d="M14.0471 1.88531L10.9293 8.52294C10.8366 8.72034 10.7038 8.88237 10.5406 9.00038C10.3765 9.1191 10.18 9.19684 9.96248 9.22401L2.68825 10.1394C2.1827 10.1998 1.72842 10.3981 1.35988 10.7023C0.992252 11.0055 0.713381 11.4143 0.550152 11.9159C0.399122 12.4044 0.389986 12.8858 0.505896 13.3368C0.625784 13.7999 0.875401 14.228 1.24417 14.5733L6.59282 19.5906C6.75392 19.7417 6.86866 19.9189 6.93024 20.1093C6.99159 20.2987 7.00377 20.509 6.96138 20.7265L5.57775 27.9552C5.48807 28.4467 5.53747 28.93 5.70958 29.3651C5.88473 29.8081 6.18702 30.201 6.59891 30.5001C7.00869 30.7982 7.47698 30.9644 7.95443 30.9935C8.42884 31.0227 8.91216 30.9169 9.35515 30.6722L15.78 27.1352C15.9722 27.0294 16.1769 26.976 16.3783 26.976C16.5796 26.976 16.7831 27.0294 16.9754 27.1352L23.4002 30.6722C23.8444 30.9169 24.3267 31.0227 24.8009 30.9935C25.2802 30.9633 25.7464 30.7982 26.1574 30.5001C26.5693 30.2011 26.8713 29.8081 27.0467 29.3651C27.2219 28.923 27.2692 28.4315 27.1736 27.9321L25.7949 20.7256C25.7537 20.508 25.7647 20.2975 25.8261 20.1083C25.8874 19.918 26.0024 19.7407 26.1635 19.5897L31.5121 14.5724C31.8807 14.227 32.1294 13.7999 32.2493 13.3377C32.3691 12.8754 32.356 12.3809 32.1998 11.8995C32.0427 11.4131 31.7638 11.0052 31.3962 10.7011C31.0277 10.3969 30.5725 10.1976 30.0679 10.1342L22.793 9.22164C22.5746 9.19355 22.379 9.11698 22.2149 8.99802C22.0529 8.88024 21.9189 8.71797 21.8262 8.52058L18.7084 1.88295C18.4908 1.42072 18.1625 1.04912 17.7617 0.794359L17.7092 0.764152C17.3154 0.526485 16.8592 0.397461 16.3759 0.397461C15.8683 0.397461 15.3941 0.537485 14.9902 0.794358C14.5893 1.04912 14.261 1.41982 14.0435 1.88295L14.0471 1.88531Z"
                                                      stroke="#868790"
                                                      strokeWidth="0.916276"
                                                      fill="#E05A67"
                                                    />
                                                  </svg>
                                                ))}
                                              </div>
                                              {/* <div className="ms-2">{item.overall_rating}</div> */}

                                            </div>
                                            :
                                            <div className="no-data">N/A</div>
                                          }
                                        </div>
                                        <div className="rating-item">
                                          <div>
                                            Freshness
                                          </div>
                                          {item.freshness_rating && item.freshness_rating != 0 ?
                                            <div className="d-flex rating-box">
                                              <div className='star-box'>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                  <svg
                                                    key={star}
                                                    width="33"
                                                    height="31"
                                                    viewBox="0 0 33 31"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"

                                                  >
                                                    <path
                                                      className={item.freshness_rating >= star ? "filled" : ""}
                                                      d="M14.0471 1.88531L10.9293 8.52294C10.8366 8.72034 10.7038 8.88237 10.5406 9.00038C10.3765 9.1191 10.18 9.19684 9.96248 9.22401L2.68825 10.1394C2.1827 10.1998 1.72842 10.3981 1.35988 10.7023C0.992252 11.0055 0.713381 11.4143 0.550152 11.9159C0.399122 12.4044 0.389986 12.8858 0.505896 13.3368C0.625784 13.7999 0.875401 14.228 1.24417 14.5733L6.59282 19.5906C6.75392 19.7417 6.86866 19.9189 6.93024 20.1093C6.99159 20.2987 7.00377 20.509 6.96138 20.7265L5.57775 27.9552C5.48807 28.4467 5.53747 28.93 5.70958 29.3651C5.88473 29.8081 6.18702 30.201 6.59891 30.5001C7.00869 30.7982 7.47698 30.9644 7.95443 30.9935C8.42884 31.0227 8.91216 30.9169 9.35515 30.6722L15.78 27.1352C15.9722 27.0294 16.1769 26.976 16.3783 26.976C16.5796 26.976 16.7831 27.0294 16.9754 27.1352L23.4002 30.6722C23.8444 30.9169 24.3267 31.0227 24.8009 30.9935C25.2802 30.9633 25.7464 30.7982 26.1574 30.5001C26.5693 30.2011 26.8713 29.8081 27.0467 29.3651C27.2219 28.923 27.2692 28.4315 27.1736 27.9321L25.7949 20.7256C25.7537 20.508 25.7647 20.2975 25.8261 20.1083C25.8874 19.918 26.0024 19.7407 26.1635 19.5897L31.5121 14.5724C31.8807 14.227 32.1294 13.7999 32.2493 13.3377C32.3691 12.8754 32.356 12.3809 32.1998 11.8995C32.0427 11.4131 31.7638 11.0052 31.3962 10.7011C31.0277 10.3969 30.5725 10.1976 30.0679 10.1342L22.793 9.22164C22.5746 9.19355 22.379 9.11698 22.2149 8.99802C22.0529 8.88024 21.9189 8.71797 21.8262 8.52058L18.7084 1.88295C18.4908 1.42072 18.1625 1.04912 17.7617 0.794359L17.7092 0.764152C17.3154 0.526485 16.8592 0.397461 16.3759 0.397461C15.8683 0.397461 15.3941 0.537485 14.9902 0.794358C14.5893 1.04912 14.261 1.41982 14.0435 1.88295L14.0471 1.88531Z"
                                                      stroke="#868790"
                                                      strokeWidth="0.916276"
                                                      fill="#E05A67"
                                                    />
                                                  </svg>
                                                ))}
                                              </div>
                                              {/* <div className="ms-2">{item.overall_rating}</div> */}

                                            </div>
                                            :
                                            <div className="no-data">N/A</div>
                                          }
                                        </div>
                                        {item.overall_review &&
                                          <div className="rating-review">
                                            {/* <span>Review:</span> */}
                                            {item.overall_review}
                                          </div>
                                        }
                                      </div>
                                    </td>


                                  </tr>
                                )
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


export default OrderItemReviewList