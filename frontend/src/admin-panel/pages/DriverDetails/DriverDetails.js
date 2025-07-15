import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./DriverDetails.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { DELIVERY_STATUSES } from "../../../Constants";
import Pagination from "../../../Pagination";
import UserPermissions from "../../common-components/UserPermissions/UserPermissions";


const DriverDetails = () => {

  const navigate = useNavigate()
  const [data, setData] = useState(null);
  const [userRestaurantData, setUserRestaurantData] = useState(null);
  const [addressData, setAddressData] = useState(null);
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, selectPageSize] = useState(12);

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  const loadData = () => {
    let apiUrl = `/delivery_person/${localStorage.getItem('itemSelectedId')}`;
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
  useEffect(() => {
    loadData();
  }, []);

  const loadAddress = () => {
    let apiUrl;
    if (data?.user) {
      apiUrl = `/user/address/?user=${data?.user}`
      API.get(apiUrl)
        .then(response => {
          setAddressData(response.data.results.find(x => x.is_primary == true))
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
  useEffect(() => {
    loadAddress();
  }, [data]);


  return (
    <>
      {data &&
        <div className="driver-details-page">
          <div className="page-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card basic">
                    <div className="card-body">
                      <div className='sec-1'>
                        <div className='profile-sec'>
                          <div className='text-center black-clr'>
                            <img src={data?.user_info?.profile_image ?? "/images/profile/avatar-no-profile-image.png"} className='cus-profileimg'></img>

                            <div className='fw-600 mt-2 text-capitalize mb-1'>{data?.user_info?.first_name} {data?.user_info?.last_name}</div>
                            <div className='fw-500 f-xxs'>{data?.user_info?.email}</div>
                            <div className='fw-500 f-xxs'> {data?.user_info?.phone_number && `+${data?.user_info?.phone_number}`}</div>
                            {/* <div className='fw-500 f-xxs'>Joined on {data?.user_info?.created_at && data?.user_info?.created_at.substring(0, 10)} </div> */}

                          </div>
                        </div>
                        <div className="address-sec basic">
                          <div className='fw-600 f-14 mt-3 black-clr  dotted-border-btm pb-2'>Basic Details</div>
                          <div className='d-flex mt-3 justify-content-between'>
                            {/* <div className="me-4">
                              <div className='f-13 fw-500 clr-898989'>Place of Birth</div>
                              <div className='f-14 fw-500 '>{data?.driver_info?.place_of_birth}</div>
                            </div> */}
                            {data?.driver_info?.nationality &&
                              <div className='me-4'>
                                <div className='f-13 clr-898989 fw-500 text-end'>Nationality</div>
                                <div className='f-14 fw-500 '>{data?.driver_info?.nationality}</div>
                              </div>}
                            {data?.user_info?.phone_number &&
                              <div className="ms-4 d-flex flex-column justify-content-end">
                                <div className='f-13 clr-898989 fw-500 text-end'>Phone</div>
                                <div className='f-14 fw-500 text-end'>+{data?.user_info?.phone_number}</div>
                              </div>
                            }
                          </div>
                          <div className='d-flex mt-3 justify-content-between'>
                            {data?.driver_info?.ni_number &&
                              <div className="me-4">
                                <div className='f-13 clr-898989 fw-500'>NI Number</div>
                                <div className='f-14 fw-500'>{data?.driver_info?.ni_number}</div>
                              </div>
                            }
                            {/* {data?.user_info?.phone_number &&
                              <div className="ms-4 d-flex flex-column justify-content-end">
                                <div className='f-13 clr-898989 fw-500 text-end'>Phone</div>
                                <div className='f-14 fw-500 text-end'>+{data?.user_info?.phone_number}</div>
                              </div>
                            } */}
                          </div>
                        </div>

                        <div className="address-sec basic">
                          <div className='fw-600 f-14 mt-3 black-clr  dotted-border-btm pb-2'>Vehicle Details</div>
                          <div className='d-flex mt-3 justify-content-between'>
                            <div className="me-4">
                              <div className='f-13 fw-500 clr-898989'>Vehicle Type</div>
                              <div className='f-14 fw-500 '>{data?.vehicle_type}</div>
                            </div>
                            {data?.vehicle_reg_no &&
                              <div className='ms-4 d-flex flex-column justify-content-end'>
                                <div className='f-13 clr-898989 fw-500 text-end'>Reg. Number</div>
                                <div className='f-14 fw-500 text-end'>{data?.vehicle_reg_no}</div>
                              </div>}
                          </div>
                          <div className='d-flex mt-3 justify-content-between'>
                            {data?.vehicle_ownership_type &&
                              <div className="me-4">
                                <div className='f-13 clr-898989 fw-500'>Ownership Type</div>
                                <div className='f-14 fw-500'>{data?.vehicle_ownership_type}</div>
                              </div>
                            }
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>


                  {/* Address */}
                  <div className="card">
                    <div className="card-body">
                      <div className="">
                        <div className="fw-600 f-sm">Address</div>
                        {isAddressLoading ? (
                          <div className="d-flex flex-column align-items-center justify-content-center my-4">
                            <div className="spinner-border spinner-border-sm " role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        ) :
                          addressData ?
                            <div>
                              <div className='fw-500 f-14 mb-2 mt-3 black-clr'>
                                {[
                                  addressData.room_number,
                                  addressData.address_line1,
                                  addressData.organisation,
                                  addressData.premise,
                                  addressData.street,
                                  addressData.posttown,
                                  addressData.postcode,
                                  addressData.county,
                                  "United Kingdom"
                                ]
                                  .filter(Boolean) // Filters out empty or falsy values
                                  .join(', ')}
                              </div>


                            </div>
                            :
                            <div className="no-data f-13 mt-2">
                              Address Not Found!
                            </div>
                        }
                      </div>
                    </div>
                  </div>
                  {/* Criminal Records */}
                  {data?.have_criminal_record &&
                    <div className="card criminal-records">
                      <div className="card-body">
                        <div className="">
                          <div className="fw-600 f-sm">Criminal Records</div>
                          <div className='records fw-500 f-14 mb-2 mt-3 black-clr'>
                            {data?.details_of_criminal_records}
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  {/* Restaurant */}
                  {data?.host_restaurant_details &&
                    <div className="card restaurant">
                      <div className="card-body">
                        <div className="">
                          <div className="fw-600 f-sm">Restaurant Details</div>
                          <div className="d-flex w-100 justify-content-between mt-4">
                            <div className='w-100 d-flex align-items-center'>
                              <div>
                                <img src={data?.host_restaurant_details?.logo ?? '/images/no-restaurant-img.jpg'}
                                  className='view-restaurant-proimg' alt=''></img>
                              </div>
                              <div className='ms-3 black-clr'>
                                <div className='f-xs fw-600 mb-1'>{data?.host_restaurant_details?.name}</div>
                                {data?.host_restaurant_details?.primary_address &&
                                  <span className='f-14 fw-500'>
                                    {data?.host_restaurant_details?.primary_address.room_number && `${data?.host_restaurant_details?.primary_address.room_number}, `}
                                    {data?.host_restaurant_details?.primary_address.address_line1 && `${data?.host_restaurant_details?.primary_address.address_line1}, `}
                                    {data?.host_restaurant_details?.primary_address.organisation && `${data?.host_restaurant_details?.primary_address.organisation}, `}
                                    {data?.host_restaurant_details?.primary_address.premise && `${data?.host_restaurant_details?.primary_address.premise}, `}<br />
                                    {data?.host_restaurant_details?.primary_address.street && `${data?.host_restaurant_details?.primary_address.street}, `}
                                    {data?.host_restaurant_details?.primary_address.posttown && `${data?.host_restaurant_details?.primary_address.posttown}, `}
                                    {data?.host_restaurant_details?.primary_address.postcode && `${data?.host_restaurant_details?.primary_address.postcode}, `}<br />
                                    {data?.host_restaurant_details?.primary_address.county && `${data?.host_restaurant_details?.primary_address.county}, `}
                                    {data?.host_restaurant_details?.primary_address.country && `${data?.host_restaurant_details?.primary_address.country}`}
                                  </span>
                                }
                                <div className='f-14 fw-500'>
                                  <span>Ph: +{data?.host_restaurant_details?.phone_number}</span>
                                </div>
                              </div>
                            </div>
                            <div className='w-100 d-flex flex-column justify-content-center'>
                              {data?.host_restaurant_details.description &&
                                <div className='ms-3 black-clr mb-2'>
                                  <div className='f-13 fw-500 clr-898989'>Description</div>
                                  <div className='f-14 fw-500'>{data?.host_restaurant_details?.description}</div>
                                </div>
                              }
                              {data?.host_restaurant_details.known_for &&
                                <div className='ms-3 black-clr'>
                                  <div className='f-13 fw-500 clr-898989'>Known For</div>
                                  <div className='f-14 fw-500'>{data?.host_restaurant_details?.known_for}</div>
                                </div>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  {/* Grocery Store */}
                  {data?.host_grocery_store_details &&
                    <div className="card restaurant">
                      <div className="card-body">
                        <div className="">
                          <div className="fw-600 f-sm">Grocery Store Details</div>
                          <div className="d-flex w-100 justify-content-between mt-4">
                            <div className='w-100 d-flex align-items-center'>
                              <div>
                                <img src={data?.host_grocery_store_details?.logo ?? '/images/no-grocery-store.jpg'}
                                  className='view-restaurant-proimg' alt=''></img>
                              </div>
                              <div className='ms-3 black-clr'>
                                <div className='f-xs fw-600 mb-1'>{data?.host_grocery_store_details?.name}</div>
                                {data?.host_grocery_store_details?.primary_address &&
                                  <span className='f-14 fw-500'>
                                    {data?.host_grocery_store_details?.primary_address.room_number && `${data?.host_grocery_store_details?.primary_address.room_number}, `}
                                    {data?.host_grocery_store_details?.primary_address.address_line1 && `${data?.host_grocery_store_details?.primary_address.address_line1}, `}
                                    {data?.host_grocery_store_details?.primary_address.organisation && `${data?.host_grocery_store_details?.primary_address.organisation}, `}
                                    {data?.host_grocery_store_details?.primary_address.premise && `${data?.host_grocery_store_details?.primary_address.premise}, `}<br />
                                    {data?.host_grocery_store_details?.primary_address.street && `${data?.host_grocery_store_details?.primary_address.street}, `}
                                    {data?.host_grocery_store_details?.primary_address.posttown && `${data?.host_grocery_store_details?.primary_address.posttown}, `}
                                    {data?.host_grocery_store_details?.primary_address.postcode && `${data?.host_grocery_store_details?.primary_address.postcode}, `}<br />
                                    {data?.host_grocery_store_details?.primary_address.county && `${data?.host_grocery_store_details?.primary_address.county}, `}
                                    {data?.host_grocery_store_details?.primary_address.country && `${data?.host_grocery_store_details?.primary_address.country}`}
                                  </span>
                                }
                                <div className='f-14 fw-500'>
                                  <span>Ph: +{data?.host_grocery_store_details?.phone_number}</span>
                                </div>
                              </div>
                            </div>
                            <div className='w-100 d-flex flex-column justify-content-center'>
                              {data?.host_grocery_store_details.description &&
                                <div className='ms-3 black-clr mb-2'>
                                  <div className='f-13 fw-500 clr-898989'>Description</div>
                                  <div className='f-14 fw-500'>{data?.host_grocery_store_details?.description}</div>
                                </div>
                              }
                              {data?.host_grocery_store_details.known_for &&
                                <div className='ms-3 black-clr'>
                                  <div className='f-13 fw-500 clr-898989'>Known For</div>
                                  <div className='f-14 fw-500'>{data?.host_grocery_store_details?.known_for}</div>
                                </div>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }

                </div>
              </div>
            </div>

          </div>
        </div >
      }
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </>
  )
}


export default DriverDetails