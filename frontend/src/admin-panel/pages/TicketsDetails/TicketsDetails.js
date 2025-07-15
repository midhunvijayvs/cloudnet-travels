import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate, useParams } from 'react-router-dom';
import "./TicketsDetails.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { DELIVERY_STATUSES, TICKET_TYPE_LIST } from "../../../Constants";
import { formatDateTime2MonthYearTime, formatDateTimeToMonthYear } from "../../../GeneralFunctions";
import RefundFormPopup from "../../common-components/RefundFormPopup/RefundFormPopup";
import ImagePreview from "../../common-components/ImagePreview/ImagePreview";


const TicketsDetails = ({ source, newNotificationUpdate }) => {
  const { ticketId } = useParams();
  const navigate = useNavigate()
  const [data, setData] = useState([]);
  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(false);
  const [errors, setErrors] = useState({});
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isRefundDeclineModalOpen, setIsRefundDeclineModalOpen] = useState(false);
  const [confirmResource, setConfirmResource] = useState('ticket_status');

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  const loadData = () => {
    let ticket_id = localStorage.getItem('itemSelectedId');
    if (source === 'notification') {
      ticket_id = ticketId;
    }
    let apiUrl = `/communication/tickets/${ticket_id}`;
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
  }, [newNotificationUpdate, ticketId]);

  const changeDeliveryStatus = () => {
    setIsLoading(true);
    let temp = { delivery_status: '12' };
    API.put(`/order/orders/${data.order}/`, temp)
      .then(response => {
        setMessage("The refund request has been declined.");
        setIsConfirmModalOpen(false)
        setIsMessageModalOpen(true);
        loadData();
        setIsLoading(false);
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
        setIsLoading(false);
      });
  }

  const changeStatus = () => {
    let temp = { status: selectedStatus }
    API.put(`/communication/tickets/${selectedId}/`, temp)
      .then(response => {
        if (selectedStatus == "closed") {
          setMessage("The ticket is closed, and intimated the customer via mail.");
        }
        else {
          setMessage("The ticket is reopened, and intimated the customer via mail.");
        }
        setIsConfirmModalOpen(false)
        setIsMessageModalOpen(true);
        loadData()
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
      });
  }

  return (
    <div className="ticket-details-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="title-header option-title">
                    <div>
                      <h5>
                        Ticket
                        <span className="ms-1 text-secondary">#{data.id}</span>
                      </h5>
                      <p className="card-text">
                        {data.created_at && formatDateTimeToMonthYear(data.created_at)}
                      </p>
                    </div>

                    <div className="rhs d-none">
                      <div className={`${data.status == 'closed' ? `status-close` : 'status-danger'}`}>
                        {data.status && data.status.replace(/_/g, ' ')}
                      </div>
                    </div>

                  </div>

                  <div className='d-flex w-100 justify-content-between main-data'>
                    {/* customer */}
                    <div className='customer'>
                      <div className='clr-898989 f-14 mb-3'>Customer</div>
                      <div className='w-100 d-flex align-items-center'>
                        <div>
                          {data.profile_image ?
                            <img src={data.profile_image} className='view-invoice-proimg' alt=''></img> :
                            <img src="/images/no-profile-image.png" className='view-invoice-proimg' alt=''></img>
                          }
                        </div>
                        <div className='ms-3 black-clr'>
                          <div className='f-xs fw-600 mb-2 text-capitalize'>{data.customer_name}</div>
                          <div className='f-14 fw-500'>{data.email}</div>
                          <div className='f-14 fw-500'><span>Ph: +{data.phone}</span></div>
                        </div>
                      </div>
                    </div>
                    {/* Initiated By */}
                    <div className='ms-2 initiated'>
                      <div className="d-flex align-items-center">
                        <div className='clr-898989 f-14 me-2'>Initiated By:</div>
                        <div className='f-xs fw-600  capitalize'>{data.initiated_user_name}</div>
                      </div>
                      <div className="d-flex align-items-center ">
                        <div className='clr-898989 f-14 me-2'>Ticket Type:</div>
                        <div className='f-xs fw-500  capitalize'>{data.ticket_type && data.ticket_type.replace(/_/g, ' ')}</div>
                      </div>
                      {data.order &&
                        <>
                          <div className="d-flex align-items-baseline ">
                            <div className='clr-898989 f-14 me-2'>Order ID:</div>
                            <div>
                              <div className='f-xs fw-500  capitalize' style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/admin/orders/${data.order}`)} >
                                #{data.order}
                                {(data.delivery_status) &&
                                  <span className='f-14 ms-1 capitalize'>
                                    ({DELIVERY_STATUSES[parseInt(data.delivery_status)].replace(/_/g, ' ')}
                                    )
                                  </span>
                                }
                              </div>
                            </div>
                          </div>
                          {data?.order_item &&
                            <div className="d-flex align-items-baseline ">
                              <div className='clr-898989 f-14 me-2'>Order item ID:</div>
                              <div>
                                <div className='f-xs fw-500  capitalize' style={{ cursor: 'pointer' }}
                                  onClick={() => navigate(`/admin/orders/${data.order}`)} >
                                  #{data.order_item}
                                </div>
                              </div>
                            </div>
                          }
                          {data?.refund_amount &&
                            <div className="d-flex align-items-baseline ">
                              <div className='clr-898989 f-14 me-2'>Refunded Amount:</div>
                              <div>
                                <div className='f-xs fw-500  capitalize'>
                                  £{data.refund_amount}
                                </div>
                              </div>
                            </div>
                          }
                        </>
                      }
                      <div className="d-flex align-items-center ">
                        <div className='clr-898989 f-14 me-2'>Created At:</div>
                        <div className='f-14 fw-500  capitalize'>{data.created_at && formatDateTime2MonthYearTime(data.created_at)}</div>
                      </div>
                    </div>

                    <div className="ms-2 status-change">
                      <div className="">
                        <div className="clr-898989 f-14 text-start w-100">Ticket Status</div>
                        <select className={`form-select status ${data.status ? `status-${data.status}` : ''}`}
                          value={data.status}
                          onChange={(event) => { setSelectedId(data.id); setSelectedStatus(event.target.value); setConfirmResource('ticket_status'); setIsConfirmModalOpen(true); }}
                        >
                          {['in_progress', 'closed'].map((status, index) => (
                            <option key={index} value={status} className={`status-btn ${data.status ? `status-${data.status}` : ''}`}>
                              {status.replace(/_/g, ' ')}
                            </option>
                          ))}
                        </select>
                      </div>
                      {data.order &&
                        !['11', '12'].includes(data.delivery_status) &&
                        <div className="mt-3">
                          <div>
                            <div className="clr-898989 f-14 text-start w-100"></div>
                            <div className=" theme-outline refund-btn" onClick={() => setIsRefundModalOpen(true)}>
                              Process Refund
                            </div>
                          </div>
                          < div className="mt-1">
                            <div className="clr-898989 f-14 text-start w-100"></div>
                            <div className=" theme-btn refund-btn" onClick={() => { setConfirmResource('delivery_status'); setIsConfirmModalOpen(true) }}>
                              Decline Refund
                            </div>
                          </div>
                        </div>


                      }
                    </div>


                  </div>
                  <div className='gradientline'></div>
                  {data.reason &&
                    <div className="row mb-3">
                      <div className="d-flex align-items-center">
                        <div className='clr-898989 f-14 me-2'>Reason:</div>
                        <div className='f-xs fw-500  capitalize'>{data.reason}</div>
                      </div>
                    </div>
                  }
                  <h5 className="clr-898989 f-14 mb-2">Request Message</h5>
                  <div className="mb-3 message">
                    <p className="card-text">{data.request_message}</p>
                  </div>

                  {data.ticket_images && data.ticket_images.length > 0 && (
                    <div className="mb-3">
                      <h5 className="clr-898989 f-14 mb-2">Uploaded Images</h5>
                      <ImagePreview images={data.ticket_images} keyName="image" />
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Modal */}
        {isConfirmModalOpen &&
          <div className='custom-modal '>
            <div className='card'>
              <div className='first-screen'>
                <img src='/images/icons/svg/warning.svg'></img>
                <h1>{confirmResource === 'delivery_status' ? 'Decline Request' : 'Change Status'}</h1>
                {confirmResource === 'delivery_status' ?
                  <p>Are you sure you want to decline the refund request?</p>
                  :
                  <p>Are you sure you want to update the status?<br /> A notification email will be sent to the customer.</p>
                }
                <div className='footer mt-2'>
                  <button type='button' className='btn-outlined' onClick={() => { setIsConfirmModalOpen(false) }}>Cancel</button>
                  <button type='button' className='btn-primary'
                    onClick={confirmResource === 'delivery_status' ? changeDeliveryStatus : changeStatus}>Proceed</button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      {
        isRefundModalOpen &&
        <RefundFormPopup setterFunction={setIsRefundModalOpen} orderId={data.order} loadmainData={loadData} />
      }

      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div >
  )
}


export default TicketsDetails