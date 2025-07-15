import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./UsersDetails.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { DELIVERY_STATUSES } from "../../../Constants";
import Pagination from "../../../Pagination";
import UserPermissions from "../../common-components/UserPermissions/UserPermissions";


const UsersDetails = () => {

  const navigate = useNavigate()
  const [data, setData] = useState(null);
  const [userRestaurantData, setUserRestaurantData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, selectPageSize] = useState(12);

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  const loadData = () => {
    let apiUrl = `/user/users/${localStorage.getItem('itemSelectedId')}`;
    setIsLoading(true)
    API.get(apiUrl)
      .then(response => {
        setData(response.data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false)
      });
  }
  const loadOrderData = () => {
    let apiUrl = `/order/orders/?page=${page}&page_size=${pageSize}&user=${localStorage.getItem('itemSelectedId')}`;
    setIsOrderLoading(true)
    API.get(apiUrl)
      .then(response => {
        setOrderData(response.data)
        setIsOrderLoading(false)
      })
      .catch(error => {
        console.error(error);
        setIsOrderLoading(false)
      });
  }
  const loadRestaurantData = () => {
    let apiUrl = `/restaurants/user-restaurant/${localStorage.getItem('itemSelectedId')}/`;
    setIsLoading(true)
    API.get(apiUrl)
      .then(response => {
        setUserRestaurantData(response.data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false)
      });
  }
  useEffect(() => {
    loadData();
    loadRestaurantData();
  }, []);
  useEffect(() => {
    loadOrderData();
  }, [page, pageSize]);

  return (
    <>
      {data &&
        <div className="users-details-page">
          <div className="page-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  {localStorage.getItem('userRole') !== 'restaurant' &&
                    <div className="card basic">
                      <div className="card-body">
                        <div className='sec-1'>
                          <div className='profile-sec'>
                            <div className='text-center black-clr'>
                              <img src={data && data.profile_image ? `${data.profile_image}` : "/images/profile/avatar-no-profile-image.png"} className='cus-profileimg'></img>

                              <div className='fw-600 mt-2 text-capitalize mb-1'>{data.first_name} {data.last_name}</div>
                              <div className='fw-500 f-xxs'>{data.email}</div>
                              <div className='fw-500 f-xxs'> {data?.phone_number && `+${data?.phone_number}`}</div>
                              <div className='fw-500 f-xxs'>Joined on {data.created_at && data.created_at.substring(0, 10)} </div>

                            </div>
                          </div>
                          <div className="address-sec basic">
                            <div className='fw-600 f-14 mt-3 black-clr  dotted-border-btm pb-2'>Basic Details</div>
                            <div className='d-block d-md-flex mt-3 justify-content-between '>
                              <div className="me-4">
                                <div className='f-13 fw-500 clr-898989'>Email</div>
                                <div className='f-14 fw-500 '>{data.email}</div>
                              </div>
                              {data.phone_number &&
                                <div className='ms-4 d-flex flex-column justify-content-end'>
                                  <div className='f-13 clr-898989 fw-500 text-end'>Phone</div>
                                  <div className='f-14 fw-500 text-end'>+{data.phone_number}</div>
                                </div>}
                            </div>
                            <div className='d-flex mt-3 justify-content-between'>
                              {data.primary_address && data.primary_address.county &&
                                <div className="me-4">
                                  <div className='f-13 clr-898989 fw-500'>State/Region</div>
                                  <div className='f-14 fw-500'>{data.primary_address.county}</div>
                                </div>
                              }
                              {data.primary_address && data.primary_address.country &&
                                <div className="ms-4 d-flex flex-column justify-content-end">
                                  <div className='f-13 clr-898989 fw-500 text-end'>Country</div>
                                  <div className='f-14 fw-500 text-end'>{data.primary_address.country}</div>
                                </div>
                              }
                            </div>
                            <div className='d-flex mt-2 justify-content-between'>

                              <div className="me-4">
                                <div className='f-13 clr-898989 fw-500'>Gender</div>
                                <div className='f-14 fw-500'>{data.gender ? data.gender : '- - -'}</div>
                              </div>

                              <div className='ms-4 d-flex flex-column justify-content-end'>
                                <div className='f-13 clr-898989 fw-500 text-end'>Date of Birth</div>
                                <div className='f-14 fw-500 text-end'>{data.dob ? data.dob : '- - -'}</div>
                              </div>

                            </div>

                          </div>

                          <div className="address-sec">
                            <div className='fw-600 f-14 mt-3 black-clr  dotted-border-btm pb-2'>Address</div>
                            <div className=' py-3 fw-500 f-13'>
                              {data.primary_address ?
                                <p>
                                  <span className="type-tag">
                                    {data.primary_address.is_office ?
                                      <div>Office</div> :
                                      <div>Residential</div>
                                    }
                                  </span>
                                  {/* <br /> */}
                                  {data.primary_address.number && `No. ${data.primary_address.number}, `}
                                  {data.primary_address.address_line1 && `${data.primary_address.address_line1}, `}
                                  {data.primary_address.address_line1 && <br />}
                                  {data.primary_address.organisation && `${data.primary_address.organisation}, `}
                                  {data.primary_address.premise && `${data.primary_address.premise}, `}
                                  {data.primary_address.premise && <br />}
                                  {data.primary_address.street && `${data.primary_address.street}, `}
                                  {data.primary_address.posttown && `${data.primary_address.posttown}, `}
                                  {data.primary_address.posttown && <br />}
                                  {data.primary_address.postcode && `${data.primary_address.postcode}, `}
                                  {data.primary_address.county && `${data.primary_address.county}, `}
                                  {data.primary_address.country && `${data.primary_address.country}`}

                                </p>
                                :
                                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100px' }}>
                                  <div className="text-center">
                                    <img style={{ height: "40px", marginBottom: "10px" }} src="/images/no-data.png"></img>
                                    <p style={{ fontSize: "11px", color: "grey", textDecoration: "italic", width: "220px" }}>{'Address Not Found!'}</p>
                                  </div>
                                </div>
                              }

                            </div>
                          </div>

                        </div>

                      </div>
                    </div>
                  }

                  {/* Orders */}
                  {data.user_type === 'user' &&
                    <div className="card">
                      <div className="card-body">
                        {localStorage.getItem('userRole') === 'restaurant' &&
                          <div className="customer-info mb-3 d-flex align-items-center">
                            <div>
                              <img src={data && data.profile_image ? `${data.profile_image}` : "/images/profile/avatar-no-profile-image.png"} className='cus-profileimg'></img>
                            </div>
                            <div className='fw-600  text-capitalize ms-2'>{data.first_name} {data.last_name}</div>
                          </div>
                        }
                        <div className="orders-section">
                          <div className="fw-600 f-14 ">Orders</div>
                          {isOrderLoading ? (
                            <div className="d-flex flex-column align-items-center justify-content-center my-4">
                              <div className="spinner-border spinner-border-sm " role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                            </div>
                          ) :
                            orderData && orderData.results && orderData.results.length > 0 ?
                              <div>
                                <div className='fw-500 f-14 mb-2 mt-3 black-clr'>
                                  <span className='me-2'>Total spent</span>

                                  <span className='me-1 f-15 f-600'>£{data?.total_spent?.toFixed(2)} </span>
                                  <span className='me-1'>on</span><span className='me-1 f-15 f-600'>{data.total_orders}</span><span>orders</span>
                                </div>
                                <div className='table-container mt-3'>
                                  <table className="table table-bordered" aria-label="TABLE">
                                    <thead>
                                      <tr role="row" className='f-14 clr-565B67'>
                                        <th className='f-14 clr-565B67' role="columnheader" scope="col" tabIndex="0">ORDER</th>
                                        <th className='f-14 clr-565B67' role="columnheader" scope="col" tabIndex="0">DATE</th>
                                        <th className='f-14 clr-565B67' role="columnheader" scope="col" tabIndex="0">STATUS</th>
                                        <th className='f-14 clr-565B67' role="columnheader" scope="col" tabIndex="0">ITEMS</th>
                                        <th className='f-14 clr-565B67' role="columnheader" scope="col" tabIndex="0">AMOUNT</th>
                                      </tr>
                                    </thead>
                                    <tbody>

                                      {orderData.results.map((item, index) => (
                                        <tr role="row" className='black-clr f-14 fw-500'>
                                          <td>
                                            <div onClick={()=>navigate(`/admin/orders/${item.id}/`)}
                                              style={{cursor: 'pointer'}}>
                                              #{item.id}
                                            </div>

                                          </td>
                                          <td>{item.created_at && item.created_at.substring(0, 10)}</td>
                                          <td className="text-capitalize">
                                            {item.delivery_status && DELIVERY_STATUSES[parseInt(item.delivery_status)].replace(/_/g, ' ')}
                                          </td>
                                          <td>{item.items && item.items.length > 0 ? item.items.length : '0'}</td>
                                          <td>£{item.total_amount && Number((item.total_amount).toFixed(2)).toString()}</td>
                                        </tr>
                                      ))}

                                    </tbody>
                                  </table>
                                  {orderData &&
                                    <Pagination
                                      totalItems={orderData.count}
                                      pageSize={pageSize}
                                      currentPage={page}
                                      setCurrentPage={setPage}
                                      selectPageSize={selectPageSize}
                                    >

                                    </Pagination>
                                  }
                                </div>

                              </div>
                              :
                              <div className="no-data f-13 mt-2">
                                No Orders Yet!
                              </div>
                          }
                        </div>
                      </div>
                    </div>
                  }
                  {/* Restaurant */}
                  {data.user_type === 'restaurant' && userRestaurantData &&
                    <div className="card restaurant">
                      <div className="card-body">
                        <div className="">
                          <div className="fw-600 f-sm">Restaurant Details</div>
                          <div className="d-flex w-100 justify-content-between mt-4">
                            <div className='w-100 d-flex align-items-center'>
                              <div>
                                <img src={userRestaurantData?.logo ?? '/images/no-restaurant-img.jpg'}
                                  className='view-restaurant-proimg' alt=''></img>
                              </div>
                              <div className='ms-3 black-clr'>
                                <div className='f-xs fw-600 mb-1'>{userRestaurantData.name}</div>
                                {userRestaurantData.primary_address &&
                                  <span className='f-14 fw-500'>
                                    {userRestaurantData.primary_address.room_number && `${userRestaurantData.primary_address.room_number}, `}
                                    {userRestaurantData.primary_address.address_line1 && `${userRestaurantData.primary_address.address_line1}, `}
                                    {userRestaurantData.primary_address.organisation && `${userRestaurantData.primary_address.organisation}, `}
                                    {userRestaurantData.primary_address.premise && `${userRestaurantData.primary_address.premise}, `}<br />
                                    {userRestaurantData.primary_address.street && `${userRestaurantData.primary_address.street}, `}
                                    {userRestaurantData.primary_address.posttown && `${userRestaurantData.primary_address.posttown}, `}
                                    {userRestaurantData.primary_address.postcode && `${userRestaurantData.primary_address.postcode}, `}<br />
                                    {userRestaurantData.primary_address.county && `${userRestaurantData.primary_address.county}, `}
                                    {userRestaurantData.primary_address.country && `${userRestaurantData.primary_address.country}`}
                                  </span>
                                }
                                <div className='f-14 fw-500'>
                                  <span>Ph: +{userRestaurantData.phone_number}</span>
                                </div>
                              </div>
                            </div>
                            <div className='w-100 d-flex flex-column justify-content-center'>
                              {userRestaurantData.description &&
                                <div className='ms-3 black-clr mb-2'>
                                  <div className='f-13 fw-500 clr-898989'>Description</div>
                                  <div className='f-14 fw-500'>{userRestaurantData.description}</div>
                                </div>
                              }
                              {userRestaurantData.known_for &&
                                <div className='ms-3 black-clr'>
                                  <div className='f-13 fw-500 clr-898989'>Known For</div>
                                  <div className='f-14 fw-500'>{userRestaurantData.known_for}</div>
                                </div>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  {/* Staff- Permissions */}
                  {data.user_type === 'staff' &&
                    <UserPermissions userData={data} />
                  }
                </div>
              </div>
            </div>

          </div>


          <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
          {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}
          {isLoading && <FixedOverlayLoadingSpinner />}
        </div >
      }
    </>
  )
}


export default UsersDetails