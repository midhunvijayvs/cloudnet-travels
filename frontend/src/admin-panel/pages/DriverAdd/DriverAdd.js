import React, { useEffect, useState, useRef } from 'react'
import './DriverAdd.scss'

import { useNavigate } from 'react-router-dom';

import API from "../../../API.js"
import ErrorModal from "../../../ErrorModal.js";
import PositiveModal from "../../../PositiveModal.js";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner.js"
import $ from 'jquery';


import 'react-phone-input-2/lib/bootstrap.css';
import { isValidPhoneNumber } from 'libphonenumber-js';
import PhoneInputField from '../../../authentication/pages/CustomPhone/CustomPhoneInput.js';
import Addresses from '../../../user-panel/common-components/Addresses/Addresses.js';

const DriverAdd = ({ mode }) => {



  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isDriverExist, setIsDriverExist] = useState(false);
  const [isAddressExist, setIsAddressExist] = useState(false);
  const [driverId, setDriverId] = useState(null);
  const [images, setImages] = useState([])
  const [errors, setErrors] = useState([]);
  const [documentErrors, setDocumentErrors] = useState({});
  const [documentTypes, setDocumentTypes] = useState({
    "Driving License": [],
    "Vehicle RC": [],
    "Photo ID Proof": ["Passport", "National ID"],
    "Address ID Proof": ["Utility Bill", "Bank Statement", "Lease Agreement"]
  });

  const [passwordShown1, showPassword1] = useState(false);
  const [passwordShown2, showPassword2] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  const addressTabRef = useRef(null);
  const basicInfoTabRef = useRef(null);
  const userInfoTabRef = useRef(null);
  const documentTabRef = useRef(null);
  const employmentTabRef = useRef(null);

  // const [setErrors, setErrors] = useState([]);
  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  const [tabCompletion, setTabCompletion] = useState({
    user_info: false,
    driver_info: false,
    employment_details: false,
    address: false,
    documents: false,
  })
  const initialData = {
    user_info: {
      dob: null,
      gender: null,
    },
    driver_info: {
      place_of_birth: null,
      nationality: null,
      ni_number: null,
      have_criminal_record: false,
      details_of_criminal_records: null,
      vehicle_type: null,
    },
    employment_details: {
      previous_job_title: null,
      previous_employer_details: null,
      is_fresher: false,
    },
    documents: [
      { name: "Driving License", document_no: null, file: null, file_url: null, type: null },
      { name: "Vehicle RC", document_no: null, file: null, file_url: null, type: null },
      { name: "Photo ID Proof", document_no: null, file: null, file_url: null, type: null },
      { name: "Address ID Proof", document_no: null, file: null, file_url: null, type: null },
    ],
    is_restaurant_staff: false,
    host_restaurant: null,
    is_grocerystore_staff: false,
    host_grocerystore: null,
  }

  const [data, setData] = useState(initialData);

  const [restaurants, setRestaurants] = useState(null);
  const [groceryStores, setGroceryStores] = useState(null);

  const handleInputChange = (key) => (e) => {
    const { name, type, checked, value } = e.target;

    if (name === 'password' || name === 'confirmPassword') {

      setPasswordData(prevData => ({
        ...prevData,
        [name]: value
      }))
      return
    }

    const inputValue = type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value;

    setData((prevState) => {
      // Specifically check if the key is 'host_restaurant'
      if (key === 'host_restaurant' || key === 'host_grocerystore') {
        return {
          ...prevState,
          [key]: inputValue,
        };
      }
      // Create the new state
      const newState = {
        ...prevState,
        [key]: {
          ...prevState[key],
          [name]: inputValue,
        },
      };

      // Check the specific condition for criminal records
      if (name === 'have_criminal_record' && inputValue === false) {
        newState.driver_info.details_of_criminal_records = '';
      }
      // Check the specific condition for fresher status
      if (name === 'is_fresher' && inputValue === true) {
        newState.employment_details.previous_employer_details = '';
        newState.employment_details.previous_job_title = '';
      }
      return newState;
    });
  };

  const [phoneData, setPhoneData] = useState({ phone_number: "", country_code: "" })
  useEffect(() => {
    setData(prevData => ({
      ...prevData,
      user_info: {
        ...prevData.user_info,
        phone_number: phoneData.phone_number,
        country_code: phoneData.country_code
      }
    }));
  }, [phoneData]);

  useEffect(() => {
    setImages(data?.images || [])
  }, [data]);

  const loadDriverExist = () => {
    if (mode === "edit") {

      setDriverId(localStorage.getItem("itemSelectedId"));
      setIsDriverExist(true)
    }
    if (mode === 'settings') {
      API.get(`/delivery_person/check_driver_exist/`)
        .then(response => {
          setIsDriverExist(response.data.driver_id)
          setDriverId(response.data.driver_id);
          window.localStorage.setItem("itemSelectedId", response.data.driver_id)
          setIsLoading(false)
        })
        .catch(error => {
          setMessage(error.response?.data?.message || error.message);
          setIsLoading(false)
        });
    }
  }

  // Success Alert
  const showSuccessAlert = () => {
    $(".success-alert").addClass("active")
    setTimeout(() => {
      $(".success-alert").removeClass("active")
    }, 1000);
  }


  const loadDocuments = () => {
    if (driverId) {
      setIsLoading(true)
      API.get(`/delivery_person/documents/?driver_id=${driverId}`)
        .then(response => {
          setIsLoading(false);
          const apiDocuments = response.data.results;
          // Update documents based on API response
          const updatedDocuments = data.documents.map(doc => {
            const foundDoc = apiDocuments.find(apiDoc => apiDoc.name === doc.name);
            return foundDoc
              ? { ...doc, id: foundDoc.id, document_no: foundDoc.document_no || null, file: foundDoc.file || null, file_url: foundDoc.file || null, type: foundDoc.type || '' }
              : { name: doc.name, document_no: doc.document_no, file: null, file_url: null };; // Keep original if not found
          });
          setData(prevState => ({
            ...prevState,
            documents: updatedDocuments,
          }));
        })
        .catch(error => {
          // setIsErrorModalOpen(true);
          setIsLoading(false)
        });
    }
  }
  const loadRestaurants = () => {
    if (localStorage.getItem('userRole') === 'admin') {
      API.get('/restaurants/?page_size=1000')
        .then(response => {
          setRestaurants(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
  const loadGroceryStores = () => {
    if (localStorage.getItem('userRole') === 'admin') {
      API.get('/grocery/?page_size=1000')
        .then(response => {
          setGroceryStores(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
  useEffect(() => {
    loadRestaurants();
    loadGroceryStores();
  }, [])




  const loadData = () => {
    if (driverId) {
      window.localStorage.setItem("itemSelectedId", driverId)
      setIsLoading(true)
      API.get(`/delivery_person/${driverId}/`)
        .then(response => {
          const result = response.data || {};
          setData(prevState => ({
            ...prevState,
            driver_info: result.driver_info || {},
            employment_details: result.employment_details || {},
            user_info: result.user_info || {},
            // documents: data.documents,
            user: result.user,
            is_restaurant_staff: result?.is_restaurant_staff || false,
            host_restaurant: result?.host_restaurant || null,
            is_grocerystore_staff: result?.is_grocerystore_staff || false,
            host_grocerystore: result?.host_grocerystore || null,
          }));
          setPhoneData({ phone_number: result.user_info?.phone_number || "", country_code: result.user_info?.country_code || "" })
          setIsLoading(false);
          // set tab button state
          setTabCompletion(prevState => ({
            ...prevState,
            user_info: result?.user !== null,
            driver_info: result.driver_info?.vehicle_type !== null,
            employment_details: result.employment_details?.is_fresher !== null,
            address: result.employment_details?.is_fresher !== null,
          }));
        })
        .catch(error => {
          setMessage(error.response?.data?.message || error.message);
          setIsErrorModalOpen(true);
          setIsLoading(false)
        });
    }

  }

  // load data
  useEffect(() => {
    loadDriverExist();
    loadData();
    loadDocuments();
  }, [mode, driverId, isMessageModalOpen]);


  const validateForm = (formdata, tabName) => {
    const validatePhoneNumber = (phoneNumber, countryCode) => {
      try {
        const parsedPhoneNumber = isValidPhoneNumber(`+${phoneNumber}`, countryCode);
        return parsedPhoneNumber ? null : 'Invalid phone number';
      } catch (error) {
        return 'Invalid phone number';
      }
    };

    const errors = {};
    if (tabName == 'driver_info') {
      // if (!formdata.place_of_birth || !formdata.place_of_birth.trim()) {
      //   errors.place_of_birth = "Required.";
      // }
      if (!formdata.nationality || !formdata.nationality.trim()) {
        errors.nationality = "Required.";
      }
      if (!formdata.vehicle_type || !formdata.vehicle_type.trim()) {
        errors.vehicle_type = "Select vehicle type.";
      }
      if (!formdata.vehicle_ownership_type || !formdata.vehicle_ownership_type.trim()) {
        errors.vehicle_ownership_type = "Select ownership type.";
      }
      // reg no
      if (!formdata.vehicle_reg_no || !formdata.vehicle_reg_no.trim()) {
        errors.vehicle_reg_no = "Vehicle registration number is required.";
      } else if (!/^[A-Z0-9-]+$/i.test(formdata.vehicle_reg_no)) { // Case-insensitive check
        errors.vehicle_reg_no = "Vehicle registration number must be alphanumeric and may include hyphens.";
      } else if (formdata.vehicle_reg_no.trim().length < 6 || formdata.vehicle_reg_no.trim().length > 12) {
        errors.vehicle_reg_no = "Vehicle registration number must be between 6 and 12 characters.";
      }
      // NI Number
      if (!formdata.ni_number || !formdata.ni_number.trim()) {
        errors.ni_number = "NI number is required.";
      } else if (!/^[A-Z]{2}[0-9]{6}[A-D]$/i.test(formdata.ni_number)) { // Case-insensitive check
        errors.ni_number = "NI number must follow the format: two letters, six numbers, and a final letter (A-D).";
      }

      if (formdata.have_criminal_record) {
        if (!formdata.details_of_criminal_records || !formdata.details_of_criminal_records.trim()) {
          errors.details_of_criminal_records = "Required.";
        }
      }

    }
    if (tabName == 'employment_details') {
      if (!formdata.is_fresher) {
        if (!formdata.previous_job_title || !formdata.previous_job_title.trim()) {
          errors.previous_job_title = "Required.";
        }
        if (!formdata.previous_employer_details || !formdata.previous_employer_details.trim()) {
          errors.previous_employer_details = "Required.";
        }
      }
    }
    if (tabName == 'user_info') {
      if (!formdata.first_name?.trim()) {
        errors.first_name = "First name is required.";
      }

      if (!formdata.last_name?.trim()) {
        errors.last_name = "Last name is required.";
      }
      if (!formdata.phone_number?.trim()) {
        errors.phone_number = "Phone number is required.";
      }
      else if (validatePhoneNumber(formdata.phone_number, formdata.country_code)) {
        errors.phone_number = 'Invalid phone number'
      }

      if (!formdata.email?.trim()) {
        errors.email = "Email is required.";
      }
      else if (!/\S+@\S+\.\S+/.test(formdata.email)) {
        errors.email = "Invalid email address.";
      }

      if (mode === 'add') {
        if (!formdata.password?.trim()) {
          errors.password = "Password is required.";
        }
        else if (formdata?.password.length < 12) {
          errors.password = "Password must be at least 12 characters.";
        }
        else if (formdata?.password.length > 127) {
          errors.password = "Maximum allowed Password length is 127 characters.";
        }
        else {
          // Password must contain at least one letter, one number, and one special character
          if (!/[A-Z]/.test(formdata.password)) {
            errors.password = "Password must contain at least one uppercase letter.";
          } else if (!/\d/.test(formdata.password)) {
            errors.password = "Password must contain at least one number.";
          } else if (!/[!@#$%^&*]/.test(formdata.password)) {
            errors.password = "Password must contain at least one special character (!@#$%^&*).";
          }
        }


        if (!formdata?.confirmPassword.trim()) {
          errors.confirmPassword = "Password is required.";
        } else if (formdata.password !== formdata.confirmPassword) {
          errors.confirmPassword = "Passwords do not match.";
        }

        // for admin-add
        if (window.localStorage.getItem('userRole') === 'admin') {
          if (!data?.is_restaurant_staff && !data?.is_grocerystore_staff) {
            errors.is_restaurant_staff = 'Choose driver type.'
          } else {
            if (data?.is_restaurant_staff && !data?.host_restaurant) {
              errors.host_restaurant = 'Select restaurant.'
            }
            if (data?.is_grocerystore_staff && !data?.host_grocerystore) {
              errors.host_grocerystore = 'Select store.'
            }
          }
        }
      }


    }


    return errors;
  };

  const validateDocumentErrors = (doc) => {
    const docErrors = {};
    if (!doc.document_no || doc.document_no.trim() === '') {
      docErrors.document_no = 'Required.';
    }
    if (!doc.file || !(doc.file instanceof File)) {
      docErrors.file = 'Required.';
    }
    if (documentTypes[doc.name] && documentTypes[doc.name].length > 0 && !doc.type) {
      docErrors.type = 'Required.';
    }
    return docErrors;
  };


  // submit Driver info
  const handleSaveUserData = () => {
    let updateFormData;
    updateFormData = {
      ...data.user_info,
      user_type: 'driver',
      verified: true,
      password: passwordData.password,
      confirmPassword: passwordData.confirmPassword,
      is_restaurant_staff: data?.is_restaurant_staff,
      host_restaurant: data?.host_restaurant,
      is_grocerystore_staff: data?.is_grocerystore_staff,
      host_grocerystore: data?.host_grocerystore,
    };
    if (updateFormData.hasOwnProperty('profile_image')) {
      delete updateFormData.profile_image;
    }
    const validationErrors = validateForm(updateFormData, 'user_info');
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      console.log(validationErrors);
      return;
    }
    setIsLoading(true);

    const method = isDriverExist ? 'put' : 'post';
    const apiUrl = isDriverExist
      ? `/user/users/${data.user}/`
      : '/user/admin-register/';

    // return;
    API[method](apiUrl, updateFormData)
      .then(response => {
        setIsLoading(false);
        showSuccessAlert()
        setDriverId(response.data?.delivery_person_id)
        setIsDriverExist(true);

        setTabCompletion(prevState => ({
          ...prevState,
          user_info: true,
        }));
        if (basicInfoTabRef.current) {
          basicInfoTabRef.current.click();
        }
      })
      .catch(error => {
        // Handle the error
        setMessage(error.response?.data?.message || error.message)
        setIsLoading(false);
        setIsErrorModalOpen(true)
      });

  }

  // submit Driver info
  const handleSaveMaindata = (tabName) => {
    let updateFormData;
    if (tabName == 'driver_info') {
      updateFormData = {
        ...data.driver_info,
        user: data.user
      };
    }

    const validationErrors = validateForm(updateFormData, tabName);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      console.log(validationErrors);
      return;
    }
    setIsLoading(true);
    // return;
    const method = isDriverExist ? 'put' : 'post';
    const apiUrl = isDriverExist
      ? `/delivery_person/${driverId}/`
      : '/delivery_person/';

    if (isDriverExist) {
      API[method](apiUrl, updateFormData)
        .then(response => {
          setIsLoading(false);
          showSuccessAlert()

          if (tabName === 'driver_info') {
            setTabCompletion(prevState => ({
              ...prevState,
              driver_info: true,
            }));
            if (employmentTabRef.current) {
              employmentTabRef.current.click();
            }
          }

        })
        .catch(error => {
          // Handle the error
          console.error('Error saving restaurant:', error);
          setMessage(error.response?.data?.message || error.message)
          setIsLoading(false);
          setIsErrorModalOpen(true)
        });
    }

  }
  // submit employee_details
  const handleSaveEmployment = (tabName) => {
    let updateFormData;
    if (tabName == 'employment_details') {
      updateFormData = {
        ...data.employment_details,
      };
    }

    const validationErrors = validateForm(updateFormData, tabName);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      console.log('errors', validationErrors);
      return;
    }
    // return;
    API.put(`/delivery_person/${driverId}/`, updateFormData)
      .then(response => {
        // Handle the response
        setIsLoading(false);
        showSuccessAlert()
        setTabCompletion(prevState => ({
          ...prevState,
          employment_details: true,
        }));
        if (addressTabRef.current) {
          addressTabRef.current.click();
        }


      })
      .catch(error => {
        // Handle the error
        console.error('Error saving restaurant:', error);
        setMessage(error.response?.data?.message || error.message)
        setIsLoading(false);
        setIsErrorModalOpen(true)
      });

  }
  // Address
  const handleSaveAddress = () => {
    setTabCompletion(prevState => ({
      ...prevState,
      address: true,
    }));
    if (documentTabRef.current) {
      documentTabRef.current.click();
    }
  }

  // documents
  const handleDocumentInputChange = (index, field, value) => {
    const updatedDocuments = data.documents.map((doc, idx) => {
      if (idx === index) {
        return { ...doc, [field]: value };
      }
      return doc;
    });
    setData(prevState => ({
      ...prevState,
      documents: updatedDocuments,
    }));
  };

  const handleDocumentFileChange = (index, file) => {
    // Check if the filename exceeds 100 characters
    if (file.name.length > 100) {
      setDocumentErrors((prevErrors) => ({
        ...prevErrors,
        [index]: { ...prevErrors[index], file: 'Filename must be at most 100 characters.' },
      }));
      return; // Exit if the filename is too long
    }
    // Check if the file type is PDF
    if (file.type !== "application/pdf") {
      setDocumentErrors((prevErrors) => ({
        ...prevErrors,
        [index]: { ...prevErrors[index], file: 'Only PDF files are allowed.' },
      }));
      return; // Exit if the file is not a PDF
    }


    // Clear any previous file-related errors
    setDocumentErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (updatedErrors[index]) {
        delete updatedErrors[index].file;
      }
      return updatedErrors;
    });

    const updatedDocuments = data.documents.map((doc, idx) => {
      if (idx === index) {
        return { ...doc, file: file };
      }
      return doc;
    });

    setData(prevState => ({
      ...prevState,
      documents: updatedDocuments,
    }));
  };

  const handleSaveDocument = (index) => {
    const documentData = data.documents[index];
    const errors = validateDocumentErrors(documentData);

    if (Object.keys(errors).length > 0) {
      // Update errors in state
      setDocumentErrors((prevErrors) => ({
        ...prevErrors,
        [index]: errors,
      }));
      return; // Stop execution if there are errors
    } else {
      setDocumentErrors({})
    }

    const formData = new FormData();
    formData.append('driver', driverId);
    formData.append('name', documentData.name);

    formData.append('type', documentData.type);
    formData.append('document_no', documentData.document_no || '');
    formData.append('file', documentData.file);

    setIsLoading(true);
    API.post('/delivery_person/documents/', formData, {
      headers: { "Content-Type": "multipart/form-data", }
    })
      .then(response => {
        setIsLoading(false);
        // loadDocuments();
        // Update the specific document in state with API response
        const updatedDoc = response.data;
        // console.log(updatedDoc);

        setData((prevState) => {
          const updatedDocuments = prevState.documents.map((doc, idx) => {
            if (idx === index) {
              return {
                ...doc,
                id: updatedDoc.id,
                file: updatedDoc.file,
                file_url: updatedDoc.file,
              };
            }
            return doc;
          });
          return { ...prevState, documents: updatedDocuments };
        });
      })
      .catch(error => {
        // Handle the error
        setMessage(error.response?.data?.message || error.message)
        setIsLoading(false);
        setIsErrorModalOpen(true)
      });
  }
  // Delete uploaded document
  const handleDeleteDocument = (id) => {
    setIsLoading(true);
    API.delete(`/delivery_person/documents/${id}/`)
      .then(response => {
        setIsLoading(false);
        loadDocuments();
      })
      .catch(error => {
        // Handle the error
        setMessage(error.response?.data?.message || error.message)
        setIsLoading(false);
        setIsErrorModalOpen(true)
      });
  }

  const handlCompleteRegButton = () => {
    setIsLoading(true)
    API.put(`/delivery_person/${driverId}/`, { is_registration_completed: true })
      .then(response => {
        setIsLoading(false);
        setMessage('Registration successfully completed!');
        setIsMessageModalOpen(true)
      })
      .catch(error => {
        // Handle the error
        setMessage(error.response?.data?.message || error.message)
        setIsLoading(false);
        setIsErrorModalOpen(true)
      });

  }


  return (
    <div className='admin-driver-add-page page-body'>

      <div className="container-fluid">
        <div className="card">
          <div className="card-header">
            {(window.localStorage.getItem('userRole') !== 'admin') ?
              <h5>
                {mode === 'edit' ? 'Edit Delivery Person' : mode === 'add' ? 'Add Delivery Person' : 'Delivery Person Settings'}
              </h5>
              :
              <h5>
                Delivery Person Details
              </h5>
            }
          </div>
          <div className="card-body">
            <div className="card-body">
              <div className="row">
                <div className="col-xxl-3 col-xl-3">
                  <ul className="nav setting-main-box sticky theme-scrollbar" id="v-pills-tab" role="tablist"
                    aria-orientation="vertical">
                    <li>
                      <button className="nav-link active" id="userInfo-tab" data-bs-toggle="pill"
                        data-bs-target="#userInfo" role="tab"
                        aria-controls="userInfo" aria-selected="false"
                        ref={userInfoTabRef} >
                        <i className="ri-user-fill"></i>User Info</button>
                    </li>
                    <li>
                      <button className="nav-link " id="Info-tab" data-bs-toggle="pill"
                        data-bs-target="#Info" role="tab"
                        aria-controls="Info" aria-selected="false"
                        disabled={!tabCompletion.user_info} ref={basicInfoTabRef} >
                        <i className="ri-information-2-fill"></i>Basic Details</button>
                    </li>
                    <li>
                      <button className="nav-link" id="Employment-tab" data-bs-toggle="pill"
                        data-bs-target="#Employment" role="tab" aria-controls="Employment"
                        aria-selected="false"
                        disabled={!tabCompletion.driver_info} ref={employmentTabRef}>
                        <i className="ri-briefcase-4-fill"></i>Employment</button>
                    </li>
                    <li>
                      <button className="nav-link" id="Address-tab" data-bs-toggle="pill"
                        data-bs-target="#Address" role="tab" aria-controls="Address"
                        aria-selected="false"
                        disabled={!tabCompletion.driver_info} ref={addressTabRef}>
                        <i className="ri-map-pin-2-fill"></i>Address</button>
                    </li>
                    {mode !== 'settings' &&
                      <li>
                        <button className="nav-link " id="Legal-tab"
                          data-bs-toggle="pill" data-bs-target="#Legal" role="tab"
                          aria-controls="Legal" aria-selected="true"
                          disabled={!tabCompletion.driver_info} ref={documentTabRef}>
                          <i className="ri-file-fill"></i>Documents </button>
                      </li>
                    }

                  </ul>
                </div>
                <div className="col-xxl-9 col-xl-9 col-12">
                  <div className="restaurant-tab">
                    <div className="tab-content" id="v-pills-tabContent">
                      <div className="tab-pane fade show active" id="userInfo" role="tabpanel"
                        aria-labelledby="userInfo-tab">
                        <div className="input-items">
                          <div className="row gy-3">
                            {/* Check box */}
                            {window.localStorage.getItem('userRole') === 'admin' &&
                              <>
                                <div className="input-box">
                                  <div className="custom-check-item">
                                    <input className="custom-checkbox"
                                      id="restaurant"
                                      type="radio"
                                      name="driverType"
                                      value="restaurant"
                                      checked={data?.is_restaurant_staff}
                                      onChange={() => {
                                        setData(prev => ({
                                          ...prev,
                                          is_restaurant_staff: true,
                                          host_restaurant: null,
                                          is_grocerystore_staff: false,
                                          host_grocerystore: null
                                        }));
                                      }}
                                    />
                                    <h6 className='m-0' for="">Restaurant Driver</h6>

                                    <input className="custom-checkbox"
                                      id="grocery"
                                      type="radio"
                                      name="driverType"
                                      value="grocery"
                                      checked={data?.is_grocerystore_staff}
                                      onChange={() => {
                                        setData(prev => ({
                                          ...prev,
                                          is_restaurant_staff: false,
                                          host_restaurant: null,
                                          is_grocerystore_staff: true,
                                          host_grocerystore: null
                                        }));
                                      }}
                                    />
                                    <h6 className='m-0' for="">Grocery Store Driver</h6>
                                  </div>
                                  {errors.is_restaurant_staff && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.is_restaurant_staff}</div>}

                                </div>
                                {data?.is_restaurant_staff ?
                                  <div className="col-12">
                                    <div className="input-box">
                                      <h6>Restaurant</h6>
                                      <select
                                        className='form-select'
                                        name="host_restaurant"
                                        id='host_restaurant'
                                        value={data?.host_restaurant}
                                        onChange={handleInputChange('host_restaurant')}
                                      >
                                        <option value={null} selected disabled>Select Restaurant</option>
                                        {restaurants && restaurants.results.map((item, index) => {
                                          return (
                                            <option value={item.id} key={index}>{item.name}</option>
                                          )
                                        })}
                                      </select>
                                      {errors.host_restaurant && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.host_restaurant}</div>}
                                    </div>
                                  </div>
                                  :
                                  <div className="col-12">
                                    <div className="input-box">
                                      <h6>Grocery Store</h6>
                                      <select
                                        className='form-select'
                                        name="host_grocerystore"
                                        id="host_grocerystore"
                                        value={data?.host_grocerystore}
                                        onChange={handleInputChange('host_grocerystore')}
                                      >
                                        <option value={null} selected disabled>Select Store</option>
                                        {groceryStores && groceryStores.results.map((item, index) => {
                                          return (
                                            <option value={item.id} key={index}>{item.name}</option>
                                          )
                                        })}
                                      </select>
                                      {errors.host_grocerystore && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.host_grocerystore}</div>}
                                    </div>
                                  </div>
                                }
                              </>

                            }

                            <div className="col-md-6">
                              <div className="input-box">
                                <h6>First Name</h6>
                                <input type="text" name="first_name" placeholder="Enter First Name"
                                  value={data.user_info.first_name}
                                  onChange={handleInputChange('user_info')} />
                                {errors.first_name && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.first_name}</div>}
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="input-box">
                                <h6>Last Name</h6>
                                <input type="text" name="last_name" placeholder="Enter Last Name"
                                  value={data.user_info.last_name}
                                  onChange={handleInputChange('user_info')} />
                                {errors.last_name && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.last_name}</div>}
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="input-box">
                                <h6>Phone</h6>
                                <PhoneInputField formData={phoneData} setFormData={setPhoneData} />
                                {errors.phone_number && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.phone_number}</div>}
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="input-box">
                                <h6>Email</h6>
                                <input type="text" name="email" placeholder="Enter Email Address"
                                  value={data.user_info.email}
                                  onChange={handleInputChange('user_info')}
                                  disabled={mode !== 'add'} />
                                {errors.email && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.email}</div>}
                              </div>
                            </div>
                            {mode === 'add' &&
                              <>
                                <div className="col-md-6">
                                  <div className="input-box password-container">
                                    <div className="d-flex justify-content-between">
                                      <h6>Password </h6>
                                      <span className="hint-btn"
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="feather feather-info"
                                        >
                                          <circle cx="12" cy="12" r="10" />
                                          <line x1="12" y1="16" x2="12" y2="12" />
                                          <line x1="12" y1="8" x2="12" y2="8" />
                                        </svg>
                                      </span>
                                    </div>
                                    <div className="form-input">
                                      <input type={passwordShown1 ? "text" : "password"} name="password" placeholder="Enter Password"
                                        value={passwordData?.password} onChange={handleInputChange('user_info')}
                                      />
                                      <span className="password-eye" onClick={() => showPassword1(!passwordShown1)}>
                                        {passwordShown1 ?

                                          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 12.668C1 12.668 5 4.66797 12 4.66797C19 4.66797 23 12.668 23 12.668C23 12.668 19 20.668 12 20.668C5 20.668 1 12.668 1 12.668Z" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M12 15.668C13.6569 15.668 15 14.3248 15 12.668C15 11.0111 13.6569 9.66797 12 9.66797C10.3431 9.66797 9 11.0111 9 12.668C9 14.3248 10.3431 15.668 12 15.668Z" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                          </svg>
                                          :


                                          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_1777_2198)">
                                              <path d="M17.94 18.608C16.2306 19.911 14.1491 20.6329 12 20.668C5 20.668 1 12.668 1 12.668C2.24389 10.3499 3.96914 8.3246 6.06 6.72799M9.9 4.90799C10.5883 4.74687 11.2931 4.66633 12 4.66799C19 4.66799 23 12.668 23 12.668C22.393 13.8036 21.6691 14.8727 20.84 15.858M14.12 14.788C13.8454 15.0827 13.5141 15.3191 13.1462 15.4831C12.7782 15.6471 12.3809 15.7353 11.9781 15.7424C11.5753 15.7495 11.1752 15.6754 10.8016 15.5245C10.4281 15.3736 10.0887 15.149 9.80385 14.8641C9.51897 14.5793 9.29439 14.2399 9.14351 13.8664C8.99262 13.4928 8.91853 13.0927 8.92563 12.6899C8.93274 12.2871 9.02091 11.8898 9.18488 11.5218C9.34884 11.1538 9.58525 10.8226 9.88 10.548" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                              <path d="M1 1.66797L23 23.668" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </g>
                                            <defs>
                                              <clipPath id="clip0_1777_2198">
                                                <rect width="24" height="24" fill="white" transform="translate(0 0.667969)" />
                                              </clipPath>
                                            </defs>
                                          </svg>
                                        }

                                      </span>
                                    </div>
                                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}

                                    {isHovered && <div className="password-hint">
                                      <div>
                                        <div>Must be at least 12 characters long.</div>
                                        <div>Contain at least one uppercase letter.</div>
                                        <div>Contain at least one number.</div>
                                        <div>Contain at least one special character (!@#$%^&*).</div>
                                      </div>
                                    </div>
                                    }

                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="input-box">
                                    <h6>Confirm Password</h6>
                                    <div className="form-input">
                                      <input type={passwordShown2 ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password"
                                        value={passwordData?.confirmPassword} onChange={handleInputChange('user_info')} />
                                      <span className="password-eye" onClick={() => showPassword2(!passwordShown2)}>
                                        {passwordShown2 ?

                                          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 12.668C1 12.668 5 4.66797 12 4.66797C19 4.66797 23 12.668 23 12.668C23 12.668 19 20.668 12 20.668C5 20.668 1 12.668 1 12.668Z" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M12 15.668C13.6569 15.668 15 14.3248 15 12.668C15 11.0111 13.6569 9.66797 12 9.66797C10.3431 9.66797 9 11.0111 9 12.668C9 14.3248 10.3431 15.668 12 15.668Z" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                          </svg>
                                          :


                                          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_1777_2198)">
                                              <path d="M17.94 18.608C16.2306 19.911 14.1491 20.6329 12 20.668C5 20.668 1 12.668 1 12.668C2.24389 10.3499 3.96914 8.3246 6.06 6.72799M9.9 4.90799C10.5883 4.74687 11.2931 4.66633 12 4.66799C19 4.66799 23 12.668 23 12.668C22.393 13.8036 21.6691 14.8727 20.84 15.858M14.12 14.788C13.8454 15.0827 13.5141 15.3191 13.1462 15.4831C12.7782 15.6471 12.3809 15.7353 11.9781 15.7424C11.5753 15.7495 11.1752 15.6754 10.8016 15.5245C10.4281 15.3736 10.0887 15.149 9.80385 14.8641C9.51897 14.5793 9.29439 14.2399 9.14351 13.8664C8.99262 13.4928 8.91853 13.0927 8.92563 12.6899C8.93274 12.2871 9.02091 11.8898 9.18488 11.5218C9.34884 11.1538 9.58525 10.8226 9.88 10.548" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                              <path d="M1 1.66797L23 23.668" stroke="#8F8F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </g>
                                            <defs>
                                              <clipPath id="clip0_1777_2198">
                                                <rect width="24" height="24" fill="white" transform="translate(0 0.667969)" />
                                              </clipPath>
                                            </defs>
                                          </svg>
                                        }

                                      </span>
                                    </div>
                                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}

                                  </div>
                                </div>
                              </>
                            }
                          </div>
                        </div>
                        {/* {(window.localStorage.getItem('userRole') !== 'admin') && */}
                        <div className="col-12 d-flex justify-content-center mt-2">
                          <button onClick={() => handleSaveUserData()} className="btn register-button mt-1">Save and Proceed</button>
                        </div>
                        {/* } */}
                      </div>

                      <div className="tab-pane fade show" id="Info" role="tabpanel"
                        aria-labelledby="Info-tab">
                        <div className="input-items">
                          <div className="row gy-3">
                            <div className="col-md-6">
                              <div className="input-box">
                                <h6>Vehicle Type</h6>
                                <select
                                  className='form-select'
                                  name="vehicle_type"
                                  value={data.driver_info.vehicle_type}
                                  onChange={handleInputChange('driver_info')}
                                >
                                  <option value={null} selected disabled>Select Vehicle Type</option>
                                  <option value="Car">Car</option>
                                  <option value="Bike">Bike</option>
                                </select>
                                {errors.vehicle_type && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.vehicle_type}</div>}
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="input-box">
                                <h6>Vehicle Reg. Number</h6>
                                <input type="text" name="vehicle_reg_no" placeholder="Enter Registration Number"
                                  value={data.driver_info.vehicle_reg_no}
                                  onChange={handleInputChange('driver_info')} />
                                {errors.vehicle_reg_no && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.vehicle_reg_no}</div>}
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="input-box">
                                <h6>Vehicle Ownership Type</h6>
                                <select
                                  className="form-select"
                                  name="vehicle_ownership_type"
                                  value={data.driver_info.vehicle_ownership_type}
                                  onChange={handleInputChange("driver_info")}
                                >
                                  <option value={null} selected disabled>
                                    Select Ownership Type
                                  </option>
                                  <option value="Owned">Owned</option>
                                  <option value="Rented">Rented</option>
                                </select>
                                {errors.vehicle_ownership_type && (
                                  <div className="invalid-feedback m-0 mb-1 position-relative">
                                    {errors.vehicle_ownership_type}
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* <div className="col-md-6">
                              <div className="input-box">
                                <h6>Place of Birth</h6>
                                <input type="text" name="place_of_birth" placeholder="Enter Place of Birth"
                                  value={data.driver_info.place_of_birth}
                                  onChange={handleInputChange('driver_info')} />
                                {errors.place_of_birth && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.place_of_birth}</div>}
                              </div>
                            </div> */}
                            <div className="col-md-6">
                              <div className="input-box">
                                <h6>Nationality</h6>
                                <input type="text" name="nationality" placeholder="Enter Nationality"
                                  value={data.driver_info.nationality}
                                  onChange={handleInputChange('driver_info')} />
                                {errors.nationality && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.nationality}</div>}
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="input-box">
                                <h6>National Insurance Number</h6>
                                <input type="text" name="ni_number" placeholder="Enter NI number"
                                  value={data.driver_info.ni_number}
                                  onChange={handleInputChange('driver_info')} />
                                {errors.ni_number && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.ni_number}</div>}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="input-box">

                                <h6>&nbsp;</h6>
                                <div className="custom-check-item">
                                  <input className="custom-checkbox" id="have_criminal_record" type="checkbox" name="have_criminal_record"
                                    checked={data.driver_info.have_criminal_record}
                                    onChange={handleInputChange('driver_info')} />
                                  <h6 className='m-0' for="have_criminal_record">Do you have any criminal record?</h6>
                                </div>
                              </div>
                            </div>
                            {data.driver_info.have_criminal_record &&
                              <div className="col-12">
                                <div className="input-box">
                                  <h6>Criminal Record Details</h6>
                                  <textarea name="details_of_criminal_records" rows="4" placeholder="Enter Criminal Record Details"
                                    value={data.driver_info.details_of_criminal_records}
                                    onChange={handleInputChange('driver_info')}
                                    disabled={!data.driver_info.have_criminal_record} ></textarea>
                                  {errors.details_of_criminal_records && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.details_of_criminal_records}</div>}
                                </div>
                              </div>
                            }
                          </div>
                        </div>
                        {/* {(window.localStorage.getItem('userRole') !== 'admin') && */}
                        <div className="col-12 mt-2 d-flex justify-content-center">
                          <button onClick={() => handleSaveMaindata('driver_info')} className="btn register-button mt-1">Save and Proceed</button>
                        </div>
                        {/* } */}
                      </div>
                      <div className="tab-pane fade show" id="Employment" role="tabpanel"
                        aria-labelledby="Employment-tab">
                        <div className="input-items">
                          <div className="row gy-3">
                            <div className="col-md-4 d-flex align-items-end">
                              <div className="custom-check-item">
                                <input className="custom-checkbox" id="is_fresher" type="checkbox" name="is_fresher"
                                  checked={data.employment_details.is_fresher}
                                  onChange={handleInputChange('employment_details')} />
                                <h6 for="is_fresher">Fresher</h6>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="input-box">
                                <h6>Previous Job Title</h6>
                                <input type="text" name="previous_job_title" placeholder="Job Title"
                                  value={data.employment_details.previous_job_title}
                                  onChange={handleInputChange('employment_details')}
                                  disabled={data.employment_details.is_fresher} />
                                {errors.previous_job_title && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.previous_job_title}</div>}
                              </div>
                            </div>

                            <div className="col-md-12">
                              <div className="input-box">
                                <h6>Employer Details</h6>
                                <textarea name="previous_employer_details" rows="4" placeholder="Enter Details"
                                  value={data.employment_details.previous_employer_details}
                                  onChange={handleInputChange('employment_details')}
                                  disabled={data.employment_details.is_fresher} ></textarea>
                                {errors.previous_employer_details && <div className="invalid-feedback m-0 mb-1  position-relative">{errors.previous_employer_details}</div>}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* {(window.localStorage.getItem('userRole') !== 'admin') && */}
                        <div className="col-12 mt-2 d-flex justify-content-center">
                          <button onClick={() => handleSaveEmployment('employment_details')} className="btn register-button mt-1">Save and Proceed</button>
                        </div>
                        {/* } */}
                      </div>

                      <div className="tab-pane fade show" id="Address" role="tabpanel"
                        aria-labelledby="Address-tab">
                        <div className="input-box">
                          {data?.user &&
                            <Addresses resourceName={'restaurant'} userId={data.user} loadMainData={loadData} />
                          }
                        </div>
                        {/* {(window.localStorage.getItem('userRole') !== 'admin') && */}
                        <div className="col-12 mt-2 d-flex justify-content-center">
                          <button onClick={() => handleSaveAddress()} className="btn register-button mt-1">Save and Proceed</button>
                        </div>
                        {/* } */}
                      </div>
                      <div className="tab-pane fade" id="Legal" role="tabpanel"
                        aria-labelledby="Legal-tab">
                        <div className="input-items">
                          <div className="row gy-3">
                            <div className="col-12">
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <th scope="col">Document Name</th>
                                    <th scope="col">Document Number</th>
                                    <th scope="col">File</th>
                                    <th scope="col"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {data.documents && data.documents.map((doc, index) => (
                                    <tr key={index}>
                                      <td>
                                        <div className='doc-value'>
                                          {doc.name}
                                          {documentTypes[doc.name].length > 0 && (
                                            <>
                                              <select
                                                className="form-select"
                                                name="type"
                                                value={doc.type}
                                                disabled={doc.file_url ? true : false}
                                                onChange={(e) => handleDocumentInputChange(index, 'type', e.target.value)}
                                              >
                                                <option value={''} disabled selected>Select</option>
                                                {documentTypes[doc.name].map((type, i) => (
                                                  <option key={i} value={type}>{type}</option>
                                                ))}
                                              </select>
                                              {documentErrors[index]?.type && <div className="text-danger">{documentErrors[index].type}</div>}
                                            </>
                                          )}
                                        </div>
                                      </td>
                                      <td className='docnum-col'>
                                        {doc.file_url ? (
                                          <div className='doc-value'>
                                            {doc.document_no}
                                          </div>
                                        ) : (
                                          <>
                                            <input
                                              type="text"
                                              name="document_no"
                                              placeholder=""
                                              value={doc.document_no}
                                              disabled={doc.file_url ? true : false}
                                              onChange={(e) => handleDocumentInputChange(index, 'document_no', e.target.value)}
                                            />
                                            {documentErrors[index]?.document_no && <div className="text-danger">{documentErrors[index].document_no}</div>}
                                          </>
                                        )}
                                      </td>
                                      <td className='file-col'>
                                        {doc.file_url ? (
                                          <input
                                            type="text"
                                            name="file"
                                            value={
                                              doc.file
                                                ? doc.file.split('/').pop().replace(/\.enc$/, '')
                                                : ''
                                            }
                                            disabled={true}
                                          />
                                        ) : (
                                          <>
                                            <input
                                              type="file"
                                              name="file"
                                              accept=".pdf"
                                              value={doc.filename}
                                              onChange={(e) => handleDocumentFileChange(index, e.target.files[0])}
                                            />
                                            {documentErrors[index]?.file && <div className="text-danger">{documentErrors[index].file}</div>}

                                          </>
                                        )}
                                      </td>
                                      {/* {data.} */}
                                      <td>
                                        <div className='d-flex justify-content-center w-100'>
                                          {doc.id ?
                                            <button className='btn restaurant-button delete-btn' onClick={() => handleDeleteDocument(doc.id)} >
                                              <i className="ri-delete-bin-line"></i>
                                            </button>
                                            :
                                            <button className='btn restaurant-button' onClick={() => handleSaveDocument(index)} >Save</button>
                                          }
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        {/* {mode !== 'settings' && (window.localStorage.getItem('userRole') !== 'admin') && */}
                        <div className="col-12 mt-2 d-flex justify-content-center">
                          <button className="btn register-button mt-1" onClick={handlCompleteRegButton}>Complete Registration</button>
                        </div>
                        {/* } */}
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className='success-alert'>
            <div className='text'>Details saved successfully!</div>
          </div>
        </div>
      </div>

      {isLoading && <FixedOverlayLoadingSpinner />}
      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => navigate('/admin/driver/list')} />}

    </div>

  );


}

export default DriverAdd