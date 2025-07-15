import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { Modal } from "react-bootstrap";

import API from '../../../API';

import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"

import Pagination from "../../../Pagination";
import './CustomerDetails.css'
import $ from 'jquery';

const CustomersView = () => {

    let navigate = useNavigate();

    const [data, setData] = useState(null)
    const [wishListData, setWishListData] = useState(null)
    const [isActionModalOpen, setActionModalOpen] = useState(false);


    const [message, setMessage] = useState(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const [primaryAddress, setPrimaryAddress] = useState(null)
    const [lastOrderedAddress, setLastOrderedAddress] = useState(null)

    const [idSelected, setIdSelected] = useState(0);

    const [ordersPage, setOrdersPage] = useState(1);
    const [wishListPage, setWishlistPage] = useState(1);
    const [reviewPage, setReviwPage] = useState(1);
    const [pageSize, selectPageSize] = useState(10);
    const [isOrderListFullyOpened, openOrdersListFully] = useState(false)

    useEffect(() => {
        $(function () {
            $(window).scrollTop(0);
        });
    }, [])

    useEffect(() => {
        console.log("data", data)
    }, [data]);



    useEffect(() => {
        loadData()

    }
        , []);


    const loadData = () => {
        setIsLoading(true)


        API.get(`/customerget/${localStorage.getItem("itemSelectedId")}/`)
            .then(response => {

                setData(response.data);
                API.get(`users/${response.data.id}/wishlist/`)
                    .then(response => {
                        setWishListData(response.data)
                    }
                    )
                    .catch(error => {
                        console.log(error.message)
                    }
                    )

                setPrimaryAddress(null)
                API.get(`/primary_address/${response.data.id}/`)   //${window.localStorage.getItem('userID')}
                    .then(response => {

                        setPrimaryAddress(response.data)
                    })
                    .catch(error => {
                        console.error(error);
                    });


                setPrimaryAddress(null)
                API.get(`/last_ordered_address/${response.data.id}/`)   //${window.localStorage.getItem('userID')}
                    .then(response => {

                        setLastOrderedAddress(response.data)
                    })
                    .catch(error => {
                        console.error(error);
                    });
                setIsLoading(false)

            })
            .catch(error => {
                console.error(error);
            });



    }

    const editOrder = () => {
        console.log("edit intiated")
        localStorage.setItem("itemSelectedId", idSelected);
        navigate("/admin/e-commerse-list/orders/edit")
    }

    const deleteOrder = () => {
        API.delete(`/orders/${idSelected}`)
            .then(response => {
                setMessage("Item deleted successfully.");
                setIsMessageModalOpen(true)
            })
            .catch(error => {
                setMessage(error.response?.data?.message || error.message);
                setIsErrorModalOpen(true);
            });
    }

    return (
        <>
            {data && primaryAddress &&
                <div className='d-flex flex-column flex-md-row p-4 w-100'>
                    <div className='w-40-resp-mob box-shadow me-3 radius-7 py-4 mb-3 mb-md-0'>
                        <div className='text-center black-clr'>
                            <img src={data && data.profile_image ? `${data.profile_image}` : "/images/profile/avatar-no-profile-image.png"} className='cus-profileimg'></img>

                            <div className='fw-600 mt-2'>{data.first_name} {data.last_name}</div>
                            <div className='fw-500 f-xxs'>{data.email}</div>
                            <div className='fw-500 f-xxs'>Joined on {data.date_joined.substring(0, 10)} </div>
                        </div>
                        <div className='fw-600 f-xs mt-3 black-clr px-4 dotted-border-btm pb-2'>Basic Details</div>
                        <div className='mt-3 pb-2'>
                            <div className='f-xs fw-500 px-4'>Email</div>
                            <div className='f-13 px-4 fw-500 clr-898989'>{data.email}</div>
                        </div>
                        <div className='mt-2 pb-2'>
                            <div className='f-xs fw-500 px-4'>Phone</div>
                            <div className='f-13 px-4 fw-500 clr-898989'>{data.phonenumber}</div>
                        </div>
                        <div className='mt-2 pb-2'>
                            <div className='f-xs fw-500 px-4'>Country</div>
                            <div className='f-13 px-4  fw-500 clr-898989'>United Kingdom</div>
                        </div>
                        <div className='mt-2 pb-2'>
                            <div className='f-xs fw-500 px-4'>State/Region</div>
                            <div className='f-13 px-4  fw-500 clr-898989'> {primaryAddress.county}</div>
                        </div>
                        <div className='mt-2 pb-2'>
                            <div className='f-xs fw-500 px-4'>Postal Code</div>
                            <div className='f-13 px-4 fw-500 clr-898989'> {primaryAddress.postcode}</div>
                        </div>
                        <div className='fw-600 f-xs mt-3 black-clr px-4 dotted-border-btm pb-2'>Address</div>
                        <div className='px-4 py-3 fw-500 f-13 clr-898989'>
                            {primaryAddress &&
                                <p>
                                    <span className="type-tag">Type: {primaryAddress.is_office ? "office" : "Residencial"}</span>
                                    <br />
                                    No. {primaryAddress.number && primaryAddress.number}, {primaryAddress.address_line1}<br />
                                    {primaryAddress.organisation}<br />
                                    {primaryAddress.premise}<br />
                                    {primaryAddress.street}<br />
                                    {primaryAddress.posttown}<br />
                                    {primaryAddress.postcode}<br />
                                    {primaryAddress.county}<br />
                                    {primaryAddress.country}
                                </p>
                            }

                        </div>


                    </div>

                    {data.orders &&
                        <div className='w-60-resp-mob' >
                            <div className='box-shadow radius-7 p-4'>
                                <div className='fw-600 f-sm mt-3 black-clr'>Orders</div>
                                <div className='fw-500 f-xs my-3 black-clr'><span className='me-2'>Total Spent</span><span><i className="fa-solid fa-dollar-sign"></i></span><span className='me-1'>{data.orders.grand_total}</span><span className='me-1'>on</span><span className='me-1'>{data.orders.count}</span><span>orders</span></div>
                                <div className='region-table mt-3' style={isOrderListFullyOpened?{height:"600px"}:{height:"unset"}}>
                                    <table className="rwd-table mb-2">
                                        <tbody>
                                            <tr>
                                                <th className='f-12'>ORDER</th>
                                                <th className='f-12'>DATE</th>
                                                <th className='f-12'>STATUS</th>
                                                <th className='f-12'>ITEMS</th>
                                                <th className='f-12'>AMOUNT</th>
                                            </tr>
                                            {data.orders.results.map((item, index) => {

                                                return (
                                                    <tr>
                                                        <td data-th="Supplier Numberr">
                                                            #{item.id}
                                                        </td>
                                                        <td data-th="Supplier Name">
                                                            {item.date}
                                                        </td>
                                                        <td data-th="Invoice Number">
                                                            {item.delivery_status == 0 ? "Canceled" : item.delivery_status == 1 ? "Processing" : item.delivery_status == 2 ? "On the Way" : item.delivery_status == 3 ? "Out to Deliver" : item.delivery_status == 4 ? "Delivered" : "Returned"}
                                                        </td>
                                                        <td data-th="Invoice Date">
                                                            {item.order_item_count}
                                                        </td>
                                                        <td data-th="Due Date">
                                                            {item.total}
                                                        </td>

                                                    </tr>

                                                )
                                            })}


                                        </tbody>
                                    </table>
                                </div>
                                <div className='text-center lightbrick f-xs mt-3' onClick={() => openOrdersListFully(!isOrderListFullyOpened)}>View all orders</div>

                            </div>



                        </div>
                    }
                </div>

            }
        </>
    )

}

export default CustomersView