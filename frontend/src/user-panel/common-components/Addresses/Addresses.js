import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import Empty from "../../../Empty";
import "./Addresses.scss"
import { Modal } from "react-bootstrap";
import AddressAddPopup from "../../common-components/AddressAddPopup";
import $ from 'jquery';


const Addresses = ({ resourceName, userId, loadMainData }) => {

    const navigate = useNavigate()



    const [data, setData] = useState(null);


    const [message, setMessage] = useState(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState({ first_name: "", last_name: "", postcode: "", posttown: "" })


    const [primaryAddress, setPrimaryAddress] = useState(null)

      const [isAddressAddModalOpen, openAddressAddModal] = useState();
    const [mode, setMode] = useState("add");

    const [selectedId, selectId] = useState(null)

    useEffect(() => {
        $(function () {
            $(window).scrollTop(0);
        });
    }, [])

    useEffect(() => {

        loadData()
    }, []);



    const loadData = () => {
        setData(null)
        let apiUrl;
        if (userId) {
            apiUrl = `/user/address/?user=${userId}`
        } else {
            apiUrl = `/user/address/`
        }
        console.log(userId, apiUrl);

        API.get(apiUrl)   //${window.localStorage.getItem('userID')}
            .then(response => {
                setData(response.data.results)
                setPrimaryAddress(response.data.results.find(x => x.is_primary == true))
            })
            .catch(error => {
                console.error(error);
            });
    }



    const initiateEdit = (id) => {
        console.log(id, "id")
        setMode("edit");
        selectId(id);
        openAddressAddModal(true);

        setSelectedItem(data.find(x => x.id == id))
        console.log(data.find(x => x.id == id), "selected")
    }


    const deleteItem = () => {
        setIsLoading(true)
        API.delete(`/user/address/${selectedId}/`)
            .then(response => {
                setMessage("Item deleted successfully.");
                setIsLoading(false)
                loadData()
            })
            .catch(error => {
                setMessage(error.response?.data?.message || error.message);
                setIsLoading(false)
                setIsErrorModalOpen(true);
            });
    }

    const setAsPrimary = (id) => {
        setIsLoading(true)
        let payLoad = { is_primary: true }
        if (userId) {
            payLoad = { is_primary: true, user: userId }
        }
        API.put(`user/address/${id}/`, payLoad)
            .then(response => {
                console.log(response.data)
                setIsLoading(false)
                loadData()
            })
            .catch(error => {
                setMessage(error.response.data.message);
                setIsLoading(false)
                setIsErrorModalOpen(true);
            });
    }



    // add validation for previous address



    return (
        <div className="user-address">
            {data ?
                <div className="container address-page-sec-1">
                    <div className="row">



                        <div className="col-lg-12 address-section">
                            {/* <h3><span onClick={() => { navigate('/') }} role="button"><img src="/images/page-back-arrow.svg" className="me-2"></img></span>Address</h3> */}
                            {window.innerWidth < 992 &&
                                <div className="d-flex justify-content-end w-100 mb-3">
                                    <button className="btn theme-btn me-0 ms-auto" type="button" onClick={(e) => { setMode("add"); openAddressAddModal(true); setSelectedItem({ first_name: "", last_name: "", postcode: "", posttown: "",  country: "United Kingdom" }) }}> Add New Address</button>
                                </div>
                            }
                            <div className="white-card">
                                <div className="info">

                                    <p for="have_criminal_record">Add your current address and set it as your current address. If you have changed your residential location in the past 3 years, add the corresponding addresses as well.</p>
                                </div>
                                {data && data.length > 0 ?
                                    data.map((address, index) => {

                                        return (

                                            <div className="address-item">
                                                <div className="address-header mb-3">

                                                    <p className="bold-text">Name:&nbsp;&nbsp;{address.first_name} {address.last_name}</p>
                                                    <div className="d-block d-md-flex justify-content-end">
                                                        {/* <span className="type-tag me-2">{address.is_office ? "office" : "Residential"}</span> */}
                                                        {address.is_primary == false && <button className="  set-primary-button" onClick={() => setAsPrimary(address.id)}>Set As Current </button>}
                                                        {address.is_primary == true && <button className="  set-primary-button  active" disabled>Current Address</button>}
                                                    </div>
                                                </div>


                                                <div className="address-body">
                                                    <div className="d-flex justify-content-start">
                                                        <p className="bold-text">Address:&nbsp;&nbsp;</p>

                                                        <p className="normal-text" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                            {[
                                                                address.room_number,
                                                                address.address_line1,
                                                                address.organisation,
                                                                address.premise,
                                                                address.street,
                                                                address.posttown,
                                                                address.postcode,
                                                                address.county,
                                                                "United Kingdom"
                                                            ]
                                                                .filter(Boolean) // Filters out empty or falsy values
                                                                .join(', ')} {/* Joins non-empty values with a comma and a space */}
                                                        </p>
                                                    </div>
                                                    <div className="action-button-box">

                                                        <button className="action-button mb-2" onClick={() => initiateEdit(address.id)}>
                                                            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M18.19112 11.2088L19.9876 9.41278C20.5328 8.86753 20.8054 8.59491 20.9512 8.30082C21.2285 7.74126 21.2285 7.08431 20.9512 6.52475C20.8054 6.23066 20.5328 5.95803 19.9876 5.41278C19.4423 4.86753 19.1697 4.59491 18.8756 4.44917C18.316 4.17189 17.6591 4.17189 17.0995 4.44917C16.8054 4.59491 16.5328 4.86753 15.9876 5.41279L14.1689 7.23144C15.1328 8.88204 16.5189 10.2576 18.1916 11.2088ZM12.7145 8.6859L5.84394 15.5564C5.41888 15.9815 5.20635 16.194 5.06662 16.4551C4.92688 16.7162 4.86794 17.0109 4.75005 17.6004L4.13465 20.6773C4.06813 21.01 4.03487 21.1763 4.12948 21.2709C4.22409 21.3655 4.39039 21.3322 4.723 21.2657L7.79998 20.6503C8.38943 20.5324 8.68416 20.4735 8.94526 20.3337C9.20635 20.194 9.41888 19.9815 9.84395 19.5564L16.7333 12.667C15.1117 11.6514 13.74 10.2891 12.7145 8.6859Z" fill="#585858" fill-opacity="0.85" />
                                                            </svg>
                                                        </button>
                                                        {address.is_primary == false && <button className="action-button" onClick={(e) => { selectId(address.id); setIsDeleteConfModalOpen(true) }}>
                                                            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M21.9878 6.41309H3.98779V9.41309C5.09236 9.41309 5.98779 10.3085 5.98779 11.4131V15.4131C5.98779 18.2415 5.98779 19.6557 6.86647 20.5344C7.74515 21.4131 9.15937 21.4131 11.9878 21.4131H13.9878C16.8162 21.4131 18.2304 21.4131 19.1091 20.5344C19.9878 19.6557 19.9878 18.2415 19.9878 15.4131V11.4131C19.9878 10.3085 20.8832 9.41309 21.9878 9.41309V6.41309ZM11.4878 11.4131C11.4878 10.8608 11.0401 10.4131 10.4878 10.4131C9.93551 10.4131 9.48779 10.8608 9.48779 11.4131V16.4131C9.48779 16.9654 9.93551 17.4131 10.4878 17.4131C11.0401 17.4131 11.4878 16.9654 11.4878 16.4131V11.4131ZM16.4878 11.4131C16.4878 10.8608 16.0401 10.4131 15.4878 10.4131C14.9355 10.4131 14.4878 10.8608 14.4878 11.4131V16.4131C14.4878 16.9654 14.9355 17.4131 15.4878 17.4131C16.0401 17.4131 16.4878 16.9654 16.4878 16.4131V11.4131Z" fill="#585858" fill-opacity="0.85" />
                                                                <path d="M11.0559 3.78368C11.1699 3.67736 11.421 3.58341 11.7703 3.51641C12.1196 3.4494 12.5475 3.41309 12.9878 3.41309C13.4281 3.41309 13.856 3.4494 14.2053 3.51641C14.5546 3.58341 14.8057 3.67736 14.9196 3.78368" stroke="#585858" strokeOpacity="0.85" strokeWidth="2" stroke-linecap="round" />
                                                            </svg>

                                                        </button>}

                                                    </div>

                                                </div>

                                            </div>)
                                    })
                                    :
                                    <div className="inner-box">

                                        <Empty message={"You have no address saved yet."}></Empty>
                                    </div>
                                }



                            </div>
                        </div>

                        <div className="col-lg-12 address-rhs">
                            {window.innerWidth > 992 &&
                                <div className="d-flex justify-content-center w-100 mb-3">
                                    <button className="btn theme-btn me-0" type="button" onClick={(e) => { setMode("add"); openAddressAddModal(true); setSelectedItem({ first_name: "", last_name: "", postcode: "", posttown: "",country: "United Kingdom"  }) }}> Add New Address</button>
                                </div>
                            }
                            <div className="white-card d-none">


                                <h3 className="ms-3">Primary Address</h3>
                                {primaryAddress ?

                                    <div className="address-item">

                                        <p className="bold-text mb-4">Name:&nbsp;&nbsp;{primaryAddress.first_name} {primaryAddress.last_name}</p>
                                        <div className="address-body">
                                            <div className="d-flex justify-content-start">
                                                <p className="bold-text">Address:&nbsp;&nbsp;</p>

                                                <p className="normal-text" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                            {[
                                                                primaryAddress.room_number,
                                                                primaryAddress.address_line1,
                                                                primaryAddress.organisation,
                                                                primaryAddress.premise,
                                                                primaryAddress.street,
                                                                primaryAddress.posttown,
                                                                primaryAddress.postcode,
                                                                primaryAddress.county,
                                                                "United Kingdom"
                                                            ]
                                                                .filter(Boolean) // Filters out empty or falsy values
                                                                .join(', ')} {/* Joins non-empty values with a comma and a space */}
                                                        </p>
                                            </div>
                                            <div className="action-button-box">

                                                <button className="action-button" onClick={() => initiateEdit(primaryAddress.id)}>
                                                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M18.1916 11.2088L19.9876 9.41278C20.5328 8.86753 20.8054 8.59491 20.9512 8.30082C21.2285 7.74126 21.2285 7.08431 20.9512 6.52475C20.8054 6.23066 20.5328 5.95803 19.9876 5.41278C19.4423 4.86753 19.1697 4.59491 18.8756 4.44917C18.316 4.17189 17.6591 4.17189 17.0995 4.44917C16.8054 4.59491 16.5328 4.86753 15.9876 5.41279L14.1689 7.23144C15.1328 8.88204 16.5189 10.2576 18.1916 11.2088ZM12.7145 8.6859L5.84394 15.5564C5.41888 15.9815 5.20635 16.194 5.06662 16.4551C4.92688 16.7162 4.86794 17.0109 4.75005 17.6004L4.13465 20.6773C4.06813 21.01 4.03487 21.1763 4.12948 21.2709C4.22409 21.3655 4.39039 21.3322 4.723 21.2657L7.79998 20.6503C8.38943 20.5324 8.68416 20.4735 8.94526 20.3337C9.20635 20.194 9.41888 19.9815 9.84395 19.5564L16.7333 12.667C15.1117 11.6514 13.74 10.2891 12.7145 8.6859Z" fill="#585858" fill-opacity="0.85" />
                                                    </svg>
                                                </button>


                                            </div>

                                        </div>

                                    </div>
                                    :
                                    <Empty message={"No primary address set."}></Empty>
                                }
                            </div>
                        </div>





                    </div>

                </div>
                :
                <LoadingSpinner></LoadingSpinner>
            }

            {isAddressAddModalOpen &&
               <AddressAddPopup resourceName={'user'} setterFunction={openAddressAddModal} mode={mode} selectedId={selectedItem.id} loadData={loadData} selectedItem={selectedItem} setSelectedItem={setSelectedItem}
                         setAddressSelected={null} AddressSelected={null}></AddressAddPopup>
            }

            <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={loadData} />
            {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={loadData} />}
            {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'address'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>}
            {isLoading && <FixedOverlayLoadingSpinner />}
        </div>
    )
}

export default Addresses;