import React from 'react';
import './InvoiceDetails.scss'; // Import the CSS file for styling
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import API from '../../../API';
import $ from 'jquery';

import { fetchInvoiceDataAndGeneratePdf, formatDateTimeToMonthYear } from '../../../GeneralFunctions'

const InvoiceDetails = () => {
  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])
  const navigate = useNavigate()

  const [data, setData] = useState({})
  const [orderItemsData, setOrderItemsData] = useState([])

  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setIsLoading(true)
    API.get(`/payments/invoices/${localStorage.getItem("itemSelectedId")}`)
      .then((response) => {
        setData(response.data);
        setOrderItemsData(response.data.items || []);
        // API.get(`/payments/invoices/${response.data.order_id}`)
        //   .then((itemres) => {
        //     setOrderItemsData(itemres.data.order_items)
        //   })
        //   .catch((error) => {
        //     console.error(error);
        //   })
      })
      .catch((error) => {
        console.error(error);
      })
  }, [])



  const calculateTotal = () => {
    return data.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  };


  return (
    <div className="invoice-details-page">
      <div className="page-body">
        {/* {data && */}
        <div className='container-fluid'>
          <div className='invoice-pdf-view'>
            <div className='d-flex w-100 justify-content-between mb-5'>
              <div className='d-flex align-items-center'>
                <div className='title1 me-2'>Invoice</div>
                <div className='f-xs clr-898989 fw-500'>#{data.id}</div>
              </div>
              <div className='d-flex align-items-center'>
                {/* <button className='plain-lightbrick-btn f-xs me-3 px-2'><i className="fa-solid fa-check-double me-2"></i>Invoice Sent</button> */}
                <button className='brick-btn f-xs px-3' onClick={() => fetchInvoiceDataAndGeneratePdf(data.id)}><i className="fa-solid fa-download me-2"></i>Download</button>
              </div>
            </div>
            <div className='d-flex w-100 justify-content-between'>
              {/* From */}
              <div className=''>
                <div className='clr-898989 f-14 mb-3'>FROM</div>
                <div className='w-100 d-flex align-items-center'>
                  <div>
                    <img src="/images/admin-panel/invoice-details/app-logo.svg" className='view-invoice-proimg' alt=''></img>
                  </div>
                  <div className='ms-3 black-clr'>
                    <div className='f-xs fw-600 mb-2'>Cloudnet Travels</div>
                    <div className='f-14 fw-500'>2 Brook Street, Wrexham, LL13 7LH</div>
                    <div className='f-14 fw-600'>United Kingdom</div>
                    <div className='f-14 fw-500'><span className='me-2'>connect@rangrasoii.com</span><span>Ph: +44 9876543210</span></div>
                  </div>
                </div>
              </div>
              {/* customer- billing address */}
              <div className='ms-2'>
                <div className='clr-898989 f-14 mb-3 text-uppercase'>Billing Address</div>
                <div className='w-100 d-flex align-items-center'>
                  {/* <div>
                  {data.user_profile_image ?
                    <img src={data.user_profile_image} className='view-invoice-proimg' alt=''></img> :
                    <img src="/images/no-profile-image.png" className='view-invoice-proimg' alt=''></img>
                  }
                </div> */}
                  <div className='black-clr'>
                    <div className='f-xs fw-600 mb-2 capitalize'>{data.user}</div>
                    <div className='f-14 fw-500'>
                      {data.billing_number && `${data.billing_number}, `}
                      {data.billing_address_line1 && `${data.billing_address_line1}, `}
                      {data.billing_premise && `${data.billing_premise}, `}
                      {data.billing_street && `${data.billing_street}, `}
                      {data.billing_posttown && `${data.billing_posttown}, `}
                      {data.billing_postcode && `${data.billing_postcode}, `}
                      {data.billing_county && `${data.billing_county},`}
                    </div>
                    <div className='f-14 fw-600'>United Kingdom</div>
                    <div className='f-14 fw-500'>
                      <span className='me-2'>{data.email}</span>
                      <span>Ph: +{data.billing_phone_number}</span></div>
                  </div>
                </div>

              </div>
              {/* Delivery Address */}
              <div className='ms-2'>
                <div className='clr-898989 f-14 mb-3 text-uppercase'>Delivery Address</div>
                <div className='w-100 d-flex align-items-center'>
                  {/* <div>
                  {data.user_profile_image ?
                    <img src={data.user_profile_image} className='view-invoice-proimg' alt=''></img> :
                    <img src="/images/no-profile-image.png" className='view-invoice-proimg' alt=''></img>
                  }
                </div> */}
                  <div className='black-clr'>
                    <div className='f-xs fw-600 mb-2 capitalize'>{data.first_name}&nbsp;{data.last_name}</div>
                    <div className='f-14 fw-500'>
                      {data.number && `${data.number}, `}
                      {data.address_line1 && `${data.address_line1}, `}
                      {data.premise && `${data.premise}, `}
                      {data.street && `${data.street}, `}
                      {data.posttown && `${data.posttown}, `}
                      {data.postcode && `${data.postcode}, `}
                      {data.county && `${data.county},`}
                    </div>
                    <div className='f-14 fw-600'>United Kingdom</div>
                    <div className='f-14 fw-500'>
                      Ph: +{data.phone_number}
                      {/* <span className='me-2'>{data.email}</span> */}
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div className='gradientline'></div>
            <div className='d-flex w-100 justify-content-between mb-4'>
              <div className=''>
                <div className='clr-898989 f-14 mb-2'>ORDER ID</div>
                <div className='fw-600 black-clr f-sm'>#{data.order}</div>
              </div>
              <div className=''>
                <div className='clr-898989 f-14 mb-2 text-center'>
                  {String(data?.order).startsWith("G") ?
                    'GROCERY STORE' :
                    'RESTAURANT'
                  }
                </div>
                <div className='fw-600 black-clr f-sm'>
                  Cloudnet Travels&nbsp;
                  {data.restaurant_city}
                </div>
              </div>
              <div className=''>
                <div className='clr-898989 f-14 mb-2 text-center'>ISSUED DATE</div>
                <div className='f-xs fw-500'>{data.created_at && formatDateTimeToMonthYear(data.created_at)}</div>
              </div>
              <div className=''>
                <div className='clr-898989 f-14 mb-2 text-end'>DUE DATE</div>
                <div className='f-xs fw-500'>{data.due_date && formatDateTimeToMonthYear(data.due_date)}</div>
              </div>
            </div>
            <div className="">
              <div className="row">
                <div className="col-12">
                  <table className="table table-bordered" aria-label="TABLE">
                    <thead>
                      <tr role="row" className='f-14 clr-565B67'>
                        <th className='f-14 clr-565B67' role="columnheader" scope="col" tabIndex="0">ITEM DESCRIPTION</th>
                        <th className='f-14 clr-565B67' role="columnheader" scope="col" tabIndex="0">QUANTITY</th>
                        <th className='f-14 clr-565B67' role="columnheader" scope="col" tabIndex="0">RATE</th>
                        <th className='f-14 clr-565B67' role="columnheader" scope="col" tabIndex="0">AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>

                      {orderItemsData && orderItemsData.length > 0 &&
                        orderItemsData.map((item, index) => (
                          <tr role="row" className='black-clr f-14 fw-500' key={index}>

                            <td>
                              <div>
                                <div>
                                  {item?.menu_item} {item?.variant_name && `(${item.variant_name})`}
                                </div>
                                {/* <div>
                                  {item.topping &&
                                    <span className='clr-565B67'>+({item.topping})</span>
                                  }
                                </div> */}
                                {item.topping_name && item.topping_name.length > 0 && (
                                  item.topping_name.split(",").map((name, index) => {
                                    const count = item.topping_count.split(",")[index];
                                    const price = parseFloat(item.topping_price.split(",")[index]);
                                    return (
                                      <div key={index} className='d-flex justify-content-start gap-3 align-items-center'>
                                        <h6 className="ingredients-text">+ {name.trim()} (x{count})</h6>
                                        {price > 0 && <span className='ms-3'>£{price.toFixed(2)}</span>}
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            </td>
                            <td>{item.count}</td>
                            <td>£ {item.price}</td>
                            <td>£ {Number((item.count * item.price).toFixed(2)).toString()}</td>
                          </tr>
                        ))}
                      <tr role="row" className='black-clr f-14 fw-500'>
                        <td colSpan={3} className='clr-898989 fw-600 text-end'>SUB TOTAL</td>
                        <td>£ {data.sub_total}</td>
                      </tr>
                      {/* Discounts */}
                      {data.coupon_discount_applied_pounds > 0 && (
                        <tr role="row" className='black-clr f-14 fw-500'>
                          <td colSpan={3} className='clr-898989 fw-600 text-end'>
                            Discount (Coupon)
                          </td>
                          <td>£ {data.coupon_discount_applied_pounds}</td>
                        </tr>
                      )}

                      {data.wallet_amount_used > 0 && (
                        <tr role="row" className='black-clr f-14 fw-500'>
                          <td colSpan={3} className='clr-898989 fw-600 text-end'>
                            Discount (Wallet)
                          </td>
                          <td>£ {data.wallet_amount_used}</td>
                        </tr>
                      )}

                      {data.credit_balance_used > 0 && (
                        <tr role="row" className='black-clr f-14 fw-500'>
                          <td colSpan={3} className='clr-898989 fw-600 text-end'>
                            Discount (Credit Points)
                          </td>
                          <td>£ {data.credit_balance_used}</td>
                        </tr>
                      )}

                      {data.gift_card_amount > 0 && (
                        <tr role="row" className='black-clr f-14 fw-500'>
                          <td colSpan={3} className='clr-898989 fw-600 text-end'>
                            Discount (Gift Card)
                          </td>
                          <td>£ {data.gift_card_amount}</td>
                        </tr>
                      )}


                      <tr role="row" className='black-clr f-14 fw-500'>
                        <td colSpan={3} className='clr-898989 fw-600 text-end'>Delivery Charge</td>
                        <td>£ {data.delivery_charge?.toFixed(2)}</td>
                      </tr>
                      <tr role="row" className='black-clr f-14 fw-500'>
                        <td colSpan={3} className='clr-898989 fw-600 text-end'>TAX</td>
                        <td>0%</td>
                      </tr>
                      <tr role="row" className='black-clr f-14 fw-500'>
                        <td colSpan={3} className='clr-898989 fw-600 text-end'>TOTAL</td>
                        <td className='fw-600 f-sm'>£ {data.total_amount && data.total_amount.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* } */}
      </div>
    </div>
  )

}

export default InvoiceDetails