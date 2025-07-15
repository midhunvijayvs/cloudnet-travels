import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./OrdersTracking.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { formatDateTimeToMonthYear } from "../../../GeneralFunctions";


const OrdersTracking = () => {

  const navigate = useNavigate()

  const [data, setData] = useState([]);


  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState({})

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])
  const loadData = () => {
    let apiUrl = `/order/orders/${localStorage.getItem('itemSelectedId')}`;
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



  return (
    <div className="order-tracking-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="title-header option-title">
                        <h5>Order Tracking</h5>
                      </div>
                      <div className="row">
                        <div className="col-12 overflow-hidden">
                          <div className="order-left-image">
                            <div className="tracking-product-image">
                              <img src={data?.items?.[0]?.restaurant_name?.logo ?? '/images/no-restaurant-img.jpg'}
                                className="img-fluid w-100 blur-up lazyload" alt=""/>
                            </div> 

                            <div className="order-image-contain">
                              <h4>{data?.items?.[0]?.restaurant_name.name}</h4>
                              <div className="tracker-number">
                                <p>Order Number : <span>{data.id}</span></p>
                                <p>Order Placed : <span>{data.order_placed_datetime && formatDateTimeToMonthYear(data.order_placed_datetime)}</span></p>
                              </div>
                              <h5>Your items is on the way. Tracking information will be
                                available within 24 hours.</h5>
                            </div>
                          </div>
                        </div>

                        <ol className="progtrckr">
                          <li className="progtrckr-done">
                            <h5>Order Processing</h5>
                            <h6>05:43 AM</h6>
                          </li>
                          <li className="progtrckr-done">
                            <h5>Pre-Production</h5>
                            <h6>01:21 PM</h6>
                          </li>
                          <li className="progtrckr-done">
                            <h5>In Production</h5>
                            <h6>Processing</h6>
                          </li>
                          <li className="progtrckr-todo">
                            <h5>Shipped</h5>
                            <h6>Pending</h6>
                          </li>
                          <li className="progtrckr-todo">
                            <h5>Delivered</h5>
                            <h6>Pending</h6>
                          </li>
                        </ol>

                        <div className="col-12 overflow-visible">
                          <div className="tracker-table">
                            <div className="table-responsive theme-scrollbar">
                              <table className="table category-table dataTable no-footer">
                                <thead>
                                  <tr className="table-head">
                                    <th scope="col">Date</th>
                                    <th scope="col">Time</th>
                                    <th scope="col">Discription</th>
                                    <th scope="col">Location</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  <tr>
                                    <td>
                                      <h6>21/05/2024</h6>
                                    </td>
                                    <td>
                                      <h6>12:21 AM</h6>
                                    </td>
                                    <td>
                                      <p className="fw-bold">Shipped Info</p>
                                    </td>
                                    <td>
                                      <h6>3 SW. Summit St. Lithonia, GA 30038</h6>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td>
                                      <h6>15/04/2024</h6>
                                    </td>
                                    <td>
                                      <h6>01:00 PM</h6>
                                    </td>
                                    <td>
                                      <p className="fw-bold">Shipped</p>
                                    </td>
                                    <td>
                                      <h6>70 Rockwell Lane Falls Church, VA 22041
                                      </h6>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td>
                                      <h6>04/05/2024</h6>
                                    </td>
                                    <td>
                                      <h6>03:58 AM</h6>
                                    </td>
                                    <td>
                                      <p className="fw-bold">Shipped Info Received</p>
                                    </td>
                                    <td>
                                      <h6>13 Durham St. The Villages, FL 32162
                                      </h6>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td>
                                      <h6>30/04/2024</h6>
                                    </td>
                                    <td>
                                      <h6>06:26 PM</h6>
                                    </td>
                                    <td>
                                      <p className="fw-bold">Origin Scan</p>
                                    </td>
                                    <td>
                                      <h6>38 Saxon Lane Mobile, AL 36605</h6>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td>
                                      <h6>02/02/2024</h6>
                                    </td>
                                    <td>
                                      <h6>03:45 PM</h6>
                                    </td>
                                    <td>
                                      <p className="fw-bold">Shipped Info Received</p>
                                    </td>
                                    <td>
                                      <h6>3 Willow Street Chillicothe, OH 45601
                                      </h6>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td>
                                      <h6>14/01/2024</h6>
                                    </td>
                                    <td>
                                      <h6>12:21 AM</h6>
                                    </td>
                                    <td>
                                      <p className="fw-bold">Shipped</p>
                                    </td>
                                    <td>
                                      <h6>35 Brickyard Rd. Marshalltown, IA 50158
                                      </h6>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="card-footer text-end border-0 pb-0 d-flex justify-content-end">
                      <button className="btn btn-primary me-3">Submit</button>
                      <button className="btn btn-outline">Cancel</button>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default OrdersTracking