import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./UsersPermission.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import PhoneInputField from "../../../authentication/pages/CustomPhone/CustomPhoneInput";
import { isValidPhoneNumber } from "libphonenumber-js";
import { PlusSquare } from "react-feather";


const UsersPermission = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    user_type: "user",
    first_name: "",
    last_name: "",
    phone_number: "",
    country_code: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfModalOpen, setIsDeleteConfModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordShown1, showPassword1] = useState(false);
  const [passwordShown2, showPassword2] = useState(false);


  const [errors, setErrors] = useState({});
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])





  return (
    <div className="user-permission-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h5>User Permissions</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <div className="tab-content" id="pills-tabContent">
                            {/* Permission Tab */}
                            <div className="tab-pane fade show active" id="pills-profile" role="tabpanel">
                              <div className="permission-item">
                                <div className="card-header-1">
                                  <h5 className="mb-2">Product Related Permition</h5>
                                </div>
                                <div className="input-items">
                                  <div className="row gy-3 mb-4">
                                    <div className="col-md-6">
                                      <div className="input-box">
                                        <h6>Add Product</h6>
                                        <div>
                                          <form className="radio-section">
                                            <label>
                                              <input type="radio" name="opinion" checked />
                                              <i></i>
                                              <span>Allow</span>
                                            </label>

                                            <label>
                                              <input type="radio" name="opinion" />
                                              <i></i>
                                              <span>Deny</span>
                                            </label>
                                          </form>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="input-box">
                                        <h6>Update Product</h6>
                                        <div>
                                          <form className="radio-section">
                                            <label>
                                              <input type="radio" name="opinion" />
                                              <i></i>
                                              <span>Allow</span>
                                            </label>

                                            <label>
                                              <input type="radio" name="opinion" checked />
                                              <i></i>
                                              <span>Deny</span>
                                            </label>
                                          </form>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="input-box">
                                        <h6>Delete Product</h6>
                                        <div>
                                          <form className="radio-section">
                                            <label>
                                              <input type="radio" name="opinion" />
                                              <i></i>
                                              <span>Allow</span>
                                            </label>

                                            <label>
                                              <input type="radio" name="opinion" checked />
                                              <i></i>
                                              <span>Deny</span>
                                            </label>
                                          </form>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="input-box">
                                        <h6>Apply Discount</h6>
                                        <div>
                                          <form className="radio-section">
                                            <label>
                                              <input type="radio" name="opinion" checked />
                                              <i></i>
                                              <span>Allow</span>
                                            </label>

                                            <label>
                                              <input type="radio" name="opinion" />
                                              <i></i>
                                              <span>Deny</span>
                                            </label>
                                          </form>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="card-header-1">
                                <h5 className="my-2">Category Related Permition</h5>
                              </div>
                              <div className="input-items">
                                <div className="row gy-3">
                                  <div className="col-md-6">
                                    <div className="input-box">
                                      <h6>Add Product</h6>
                                      <div>
                                        <form className="radio-section">
                                          <label>
                                            <input type="radio" name="opinion" checked />
                                            <i></i>
                                            <span>Allow</span>
                                          </label>

                                          <label>
                                            <input type="radio" name="opinion" />
                                            <i></i>
                                            <span>Deny</span>
                                          </label>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="input-box">
                                      <h6>Update Product</h6>
                                      <div>
                                        <form className="radio-section">
                                          <label>
                                            <input type="radio" name="opinion" />
                                            <i></i>
                                            <span>Allow</span>
                                          </label>

                                          <label>
                                            <input type="radio" name="opinion" checked />
                                            <i></i>
                                            <span>Deny</span>
                                          </label>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="input-box">
                                      <h6>Delete Product</h6>
                                      <div>
                                        <form className="radio-section">
                                          <label>
                                            <input type="radio" name="opinion" />
                                            <i></i>
                                            <span>Allow</span>
                                          </label>

                                          <label>
                                            <input type="radio" name="opinion" checked />
                                            <i></i>
                                            <span>Deny</span>
                                          </label>
                                        </form>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="input-box">
                                      <h6>Apply Discount</h6>
                                      <div>
                                        <form className="radio-section">
                                          <label>
                                            <input type="radio" name="opinion" checked />
                                            <i></i>
                                            <span>Allow</span>
                                          </label>

                                          <label>
                                            <input type="radio" name="opinion" />
                                            <i></i>
                                            <span>Deny</span>
                                          </label>
                                        </form>
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
            </div>
          </div>
        </div>
      </div>


      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => setIsMessageModalOpen(false)} />}
      {/* {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'users'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>} */}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default UsersPermission