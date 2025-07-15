import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./TicketsAdd.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import PhoneInputField from "../../../authentication/pages/CustomPhone/CustomPhoneInput";
import { isValidPhoneNumber } from "libphonenumber-js";
import { PlusSquare } from "react-feather";
import { TICKET_TYPE_LIST } from "../../../Constants";


const TicketsAdd = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    "order": "",
    "ticket_type": "",
    "request_message": "",
    "reason": "",
  });


  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [usersData, setUsersData] = useState(null);
  const [userSearchInput, setUserSearchInput] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState('');

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };



  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  // load users data
  const loadUserData = () => {
    setIsMessageModalOpen(false);
    let apiUrl = `/user/verified-users/`;
    if (userSearchInput) {
      apiUrl += `?search_key=${userSearchInput}`;
    }
    setIsLoading(true)
    API.get(apiUrl)
      .then(response => {
        setUsersData(response.data.results);
        setIsLoading(false)
      })
      .catch(error => {
        setMessage(error.response?.data?.message || error.message);
        setIsErrorModalOpen(true);
        setIsLoading(false)

      });
  }
  useEffect(() => {
    loadUserData();
  }, [userSearchInput])

  const handleUserSearchInputChange = (e) => {
    const value = e.target.value;
    setShowSearchDropdown(value.length > 0);
    setUserSearchInput(value);
  };
  const handleSelectUser = (customer) => {
    setFormData({
      ...formData,
      user: customer.id,
    });
    setShowSearchDropdown(false);
    setUserSearchInput(`${customer.first_name} ${customer.last_name}`);
  };
  const handleClearSearch = () => {
    setFormData({
      ...formData,
      user: null,
    });
    setShowSearchDropdown(false);
    setUserSearchInput('');
  };

  // Show dropdown if there's text
  const handleInputFocus = () => {
    setShowSearchDropdown(userSearchInput.length > 0);
  };

  const handleInputBlur = () => {
    // Delay hiding the dropdown to allow click on items
    setTimeout(() => {
      setShowSearchDropdown(false);
    }, 200);
  };


  const validateForm = (data) => {
    const errors = {};
    if (!data.request_message.trim()) {
      errors.request_message = "Required.";
    }
    else if (data.request_message.length <= 70) {
      errors.request_message = "Minumum 70 words required.";
    }

    if (!data.ticket_type.trim()) {
      errors.ticket_type = "Required.";
    }
    else if (data.ticket_type === 'refund_request') {
      if (!data.reason.trim()) {
        errors.reason = "Required.";
      }
    }
    if (!data.user) {
      errors.user = "Required.";
    }
    return errors;
  };
  const handleSubmit = async (e) => {
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length !== 0) {
      console.log(validationErrors);
      return;
    }
    setIsLoading(true);
    API.post('/communication/tickets/', formData)
      .then(response => {
        setMessage("Your request has been submitted.")
        setIsMessageModalOpen(true)
        setIsLoading(false)
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
        console.error('Error fetching data:', error);
      });
  }





  return (
    <div className="ticket-add-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h5>Add New Ticket</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <div className="tab-content" id="pills-tabContent">
                            <div className='refund-form row p-1'>
                              {/* <div className='mb-3 form-heading'>Raise an Issue</div> */}
                              {/* User List Container */}
                              <div className='col-md-6 user-search'>
                                <div className='w-100 me-2 mb-3'>
                                  <div className='f-15 clr-898989 mb-1'>Customer</div>
                                  <div className='input-group'>
                                    <input
                                      type='text'
                                      placeholder='Search customer'
                                      value={userSearchInput}
                                      className='inp-D9D9D9 f-xs fw-500 w-100'
                                      required
                                      onFocus={handleInputFocus}
                                      onBlur={handleInputBlur}
                                      disabled={formData.user}
                                      onChange={handleUserSearchInputChange}
                                    />
                                    {userSearchInput && (
                                      <button
                                        type='button'
                                        className='btn-clear'
                                        onClick={handleClearSearch}
                                      >
                                        x
                                      </button>
                                    )}
                                  </div>
                                  {showSearchDropdown && usersData && usersData.length > 0 && (
                                    <ul className='dropdown-list'>
                                      {usersData.map((item, index) => (
                                        <li key={index} onClick={() => handleSelectUser(item)}>
                                          {item.first_name} {item.last_name}
                                        </li>
                                      ))}
                                    </ul>
                                  )}

                                  {errors.user && <div className="invalid-feedback">{errors.user}</div>}
                                </div>
                              </div>
                              <div className='col-md-6 '>
                                <div className='w-100 me-2 mb-3'>
                                  <div className='f-15 clr-898989 mb-1'>Issue type</div>
                                  <select className="form-select ticket-type" id="ticket_type" name="ticket_type" onChange={handleInputChange}  >
                                    <option value={''}>Select</option>
                                    {TICKET_TYPE_LIST.map((item, index) => (
                                      <option value={item}>{item.replace(/_/g, ' ')}</option>
                                    ))}
                                  </select>
                                  {errors.ticket_type && <div className="invalid-feedback">{errors.ticket_type}</div>}
                                </div>
                              </div>




                              <div className='col-md-6 '>
                                <div className='w-100 me-2 mb-3'>
                                  <div className='f-15 clr-898989 mb-1'>Order ID</div>
                                  <input id="first_name" placeholder='' value={formData.order} name="order" className='inp-D9D9D9 f-xs fw-500 w-100' required onChange={handleInputChange} ></input>
                                  {errors.order && <div className="invalid-feedback">{errors.order}</div>}
                                </div>
                              </div>
                              <div className='col-md-6 '>
                                <div className='w-100 me-2 mb-3'>
                                  <div className='f-15 clr-898989 mb-1'>Order Item ID</div>
                                  <input id="order_item" placeholder='' value={formData.order_item} name="order_item" className='inp-D9D9D9 f-xs fw-500 w-100' onChange={handleInputChange} ></input>
                                  {/* {errors.order && <div className="invalid-feedback">{errors.order}</div>} */}
                                </div>
                              </div>
                              {
                                formData.ticket_type === 'refund_request' &&
                                <div className='col-md-6 '>
                                  <div className='w-100 me-2 mb-3'>
                                    <div className='f-15 clr-898989 mb-1'>Reason</div>
                                    <select className="form-select" id="reason" name="reason" onChange={handleInputChange}  >
                                      <option value={''}>Select</option>
                                      <option value={'Incorrect items received'}>Incorrect items received</option>
                                      <option value={'Late delivery'}>Late delivery</option>
                                      <option value={'Order canceled but still charged'}>Order canceled but still charged</option>
                                    </select>
                                    {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
                                  </div>
                                </div>
                              }
                              <div className='col-12 '>
                                <div className='w-100 me-2 mb-3'>
                                  <div className='f-15 clr-898989 mb-1'>Message</div>
                                  <textarea className='w-100' name='request_message' rows={4} onChange={handleInputChange} ></textarea>
                                  {errors.request_message && <div className="invalid-feedback">{errors.request_message}</div>}
                                </div>
                              </div>


                              <div className='d-flex justify-content-center mt-3 button-box'>
                                <button className='btn-primary px-4 me-3' onClick={handleSubmit} >Submit</button>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => navigate('/admin/tickets/list')} />}
      {/* {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'users'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>} */}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default TicketsAdd