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
import './AgencyDetails.css'
import $ from 'jquery';
import { ArrowUpRight, ArrowDownRight } from "react-feather";

const CustomersView = () => {

    let navigate = useNavigate();

    const [data, setData] = useState(null)
    const [bookingsData, setBookingsData] = useState(null)
    const [transactionsData, setTransactionsData] = useState(false);


    const [popupTitle, setPopupTitle] = useState(null)
    const [popupMessage, setPopupMessage] = useState(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const [isOrderListFullyOpened, openOrdersListFully] = useState(false)
    const [amount, setAmount] = useState("");

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


        API.get(`/api/agency/${localStorage.getItem("itemSelectedId")}/`)
            .then(response => {

                setData(response.data);

                API.get(`api/booking/bookings-list-of-agent-for-admin/${response.data.agency.id}/`)   //${window.localStorage.getItem('userID')}
                    .then(response => {
                        setBookingsData(response.data)
                    })
                    .catch(error => {
                        console.error(error);
                    });


                API.get(`api/agency/wallet-transaction-list-of-agent-for-admin/${response.data.agency.id}/`)   //${window.localStorage.getItem('userID')}
                    .then(response => {

                        setTransactionsData(response.data)
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

    const handleAddMoney = () => {
        if (!amount) {
            setPopupMessage("Please enter an amount");
            setIsErrorModalOpen(true);
            return;
        }

        setIsLoading(true);

        API.post("/api/agency/admin-add-money-to-wallet/", {
            agency_id: data.agency.id,
            amount: amount,
            description: "Manual top-up by admin"
        })
            .then((response) => {
                setPopupMessage(response.data.message || "Wallet credited successfully");
                setIsMessageModalOpen(true);
                setAmount("");
                loadData(); // refresh agency details + wallet balance
            })
            .catch((error) => {
                setPopupMessage(error.response?.data?.message || "Something went wrong");
                setIsErrorModalOpen(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="agency-details-page">
            <div className="page-body">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">


                            {data &&
                                <div className='d-flex flex-column flex-md-row p-4 w-100 gap-3'>
                                    <div className='w-30 card'>
                                        <div className="card-body">
                                            <div className='text-center black-clr'>
                                                <img src={data && data.profile_image ? `${data.profile_image}` : "/images/profile/avatar-no-profile-image.png"} className='cus-profileimg'></img>

                                                <div className='fw-600 mt-2'>{data.agency.agency_name} </div>
                                                <div className='fw-600 mt-2'>CLDNTAGNT{data.agency.id} </div>
                                                <div className='fw-600 mt-2'>{data.first_name} {data.last_name}</div>
                                                <div className='fw-500 f-xxs'>{data.email}</div>
                                                <div className='fw-500 f-xxs'>Joined on {data.agency.joined_on.substring(0, 10)} </div>
                                            </div>
                                            <div className='fw-600 f-sm mt-3 black-clr px-4 dotted-border-btm pb-2'>Owner's Details</div>

                                            <div className='mt-3 pb-2'>
                                                <div className='f-xs fw-500 px-4'>Name</div>
                                                <div className='f-13 px-4 fw-500 clr-898989'>{data.first_name} {data.last_name}</div>
                                            </div>

                                            <div className='mt-3 pb-2'>
                                                <div className='f-xs fw-500 px-4'>User Name</div>
                                                <div className='f-13 px-4 fw-500 clr-898989'>{data.username}</div>
                                            </div>

                                            <div className='mt-3 pb-2'>
                                                <div className='f-xs fw-500 px-4'>Primary Email</div>
                                                <div className='f-13 px-4 fw-500 clr-898989'>{data.email}</div>
                                            </div>

                                            <div className='mt-2 pb-2'>
                                                <div className='f-xs fw-500 px-4'>Primary Phone</div>
                                                <div className='f-13 px-4 fw-500 clr-898989'>{data.phone_number}</div>
                                            </div>

                                            <div className='mt-2 pb-2'>
                                                <div className='f-xs fw-500 px-4'>Alternative Phone</div>
                                                <div className='f-13 px-4  fw-500 clr-898989'>{data.agency.alternative_phone_number}</div>
                                            </div>


                                            <div className='mt-2 pb-2'>
                                                <div className='f-xs fw-500 px-4'>Date of Birth</div>
                                                <div className='f-13 px-4  fw-500 clr-898989'>{data.dob && data.dob
                                                    ? new Date(data.dob).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })
                                                    : "-"}</div>
                                            </div>


                                            <div className='mt-2 pb-2'>
                                                <div className='f-xs fw-500 px-4'>Gender</div>
                                                <div className='f-13 px-4  fw-500 clr-898989'>{data.gender && data.gender}</div>
                                            </div>

                                            <div className='mt-2 pb-2'>
                                                <div className='f-xs fw-500 px-4'>Govt. ID Card No.</div>
                                                <div className='f-13 px-4  fw-500 clr-898989'>{data.agency.govt_id_number}</div>
                                            </div>

                                            <div className='fw-600 f-xs mt-3 black-clr px-4 dotted-border-btm pb-2'>Home Address</div>
                                            <div className='px-4 py-3 fw-500 f-13 clr-898989'>
                                                <p>{data.agency.home_address}</p>
                                            </div>



                                            <div className='fw-600 f-xs mt-3 black-clr px-4 dotted-border-btm pb-2'>Agency Details</div>

                                            <div className='mt-3 pb-2'>
                                                <div className='f-xs fw-500 px-4'>Agency Name</div>
                                                <div className='f-13 px-4 fw-500 clr-898989'>{data.agency.agency_name}</div>
                                            </div>

                                            <div className='mt-3 pb-2'>
                                                <div className='f-xs fw-500 px-4'>Agency ID</div>
                                                <div className='f-13 px-4 fw-500 clr-898989'>CLDNTAGNT{data.agency.id}</div>
                                            </div>

                                            <div className='fw-600 f-xs mt-3 black-clr px-4 dotted-border-btm pb-2'>Office Address</div>
                                            <div className='px-4 py-3 fw-500 f-13 clr-898989'>
                                                <p>{data.agency.office_address} </p>
                                            </div>

                                            <div className='mt-3 pb-2'>
                                                <div className='f-xs fw-500 px-4'>Special Note</div>
                                                <div className='f-13 px-4 fw-500 clr-898989'>{data.agency.notes}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='w-70 card'>
                                        <div className="card-body">
                                            <div className="overview-figures-box">
                                                <div className="wallet-balance">
                                                    <div className="label">Wallet Balance:</div>
                                                    <div className="value">₹{data.agency.wallet_balance}</div>
                                                </div>
                                                <div className="wallet-update-form">
                                                    <div className="title">Add Money</div>
                                                    <div className="form">
                                                        <input
                                                            className="input"
                                                            placeholder="Enter amount"
                                                            value={amount}
                                                            onChange={(e) => setAmount(e.target.value)}
                                                        />
                                                        <button className="btn-primary" onClick={handleAddMoney}>Add</button>

                                                    </div>
                                                </div>
                                                <div className="total-spent">
                                                    <div className="label">Total Sales:</div>
                                                    <div className="value">₹0.00</div>
                                                </div>
                                                <div className="booking-count">
                                                    <div className="label">Total Bookings:</div>
                                                    <div className="value">112345</div>
                                                </div>
                                            </div>


                                            <div className='bookings-list-section list-section'>
                                                <div className='table-title'>Booking History(Last Few)</div>
                                                <div className='table-wrapper'>
                                                    <table className="">
                                                        <tbody>
                                                            <tr>
                                                                <th>Bokng. ID</th>
                                                                <th>Tkt ID</th>
                                                                <th>Origin</th>
                                                                <th>Dest.</th>
                                                                <th>Amount</th>
                                                                <th>Status</th>
                                                                <th>Pax</th>
                                                                {/* <th>Agency</th>
                                                                <th>Agent</th> */}
                                                                <th>Time</th>
                                                            </tr>
                                                            {bookingsData?.results?.map((item, index) => {

                                                                return (
                                                                    <tr key={item.id}>
                                                                        <td>#{item.id}</td>
                                                                        <td>{item.ticket_id.slice(0, 4) + '…'}</td>
                                                                        <td>{item.origin}</td>
                                                                        <td>{item.destination}</td>
                                                                        <td>{item.amount}</td>
                                                                        <td> <span className={`status-label ${item.status == "success" ? "success" : item.status == "failed" ? "failed" : "pending"}`}>{item.status}</span></td>
                                                                        <td>{item.total_pax}</td>
                                                                        {/* <td>{item.agency_name}</td>
                                                                        <td>{item.user_full_name}</td> */}
                                                                        <td>{new Date(item.created_at).toLocaleString()}</td>
                                                                    </tr>

                                                                )
                                                            })}


                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className='text-center lightbrick f-xs mt-3' onClick={() => openOrdersListFully(!isOrderListFullyOpened)}>View all bookings</div>

                                            </div>

                                            <div className='bookings-list-section list-section'>
                                                <div className='table-title'>Wallet Transaction History(Last Few)</div>
                                                <div className='table-wrapper'>
                                                    <table className="">
                                                        <tbody>
                                                            <tr>
                                                                <th>ID</th>
                                                                <th>Amt:</th>
                                                                <th>Cr/Dr</th>
                                                                <th> Opng.</th>
                                                                <th>Clsng.</th>
                                                                <th>Mthd.</th>
                                                                <th>Ref.</th>
                                                                <th>Init.</th>
                                                                <th>Complt.</th>
                                                                <th>Status</th>
                                                            </tr>
                                                            {transactionsData?.results?.map((item, index) => {

                                                                return (
                                                                    <tr key={item.id}>

                                                                        <td>
                                                                            {item.id}
                                                                        </td>


                                                                        <td>
                                                                            {item.transaction_amount}
                                                                        </td>

                                                                        <td>
                                                                            <span
                                                                                className={`debit-or-credit ${item.credit_or_debit === "debit" ? "up" : "down"}`}
                                                                            >
                                                                                {item.credit_or_debit === "debit" ? (
                                                                                    <>
                                                                                        In <ArrowUpRight size={16} className="ms-1" />
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        Out <ArrowDownRight size={16} className="ms-1" />
                                                                                    </>
                                                                                )}
                                                                            </span>
                                                                        </td>

                                                                        <td>
                                                                            {item.opening_balance}
                                                                        </td>

                                                                        <td>
                                                                            {item.closing_balance}
                                                                        </td>


                                                                        <td>
                                                                            {item.payment_method}
                                                                        </td>

                                                                        <td>
                                                                            {item.gateway_transaction_reference_number?item.gateway_transaction_reference_number:"-"}
                                                                        </td>


                                                                        <td>
                                                                            {new Date(item.initiated_at).toLocaleString()}
                                                                        </td>

                                                                        <td>
                                                                            {new Date(item.payment_completed_at).toLocaleString()}
                                                                        </td>

                                                                        <td>
                                                                             <span className={`status-label ${item.status == "success" ? "success" : item.status == "failed" ? "failed" : "pending"}`}>{item.status}</span>
                                                                        </td>

                                                                    </tr>

                                                                )
                                                            })}


                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className='text-center lightbrick f-xs mt-3' onClick={() => openOrdersListFully(!isOrderListFullyOpened)}>View all transactions</div>

                                            </div>

                                        </div>

                                    </div>
                                </div>

                            }
                        </div>

                    </div>
                </div>
            </div>
            <ErrorModal state={isErrorModalOpen} message={popupMessage} setterFunction={setIsErrorModalOpen} okClickedFunction={loadData} />
            {isLoading && <FixedOverlayLoadingSpinner />}
        </div>
    )

}

export default CustomersView