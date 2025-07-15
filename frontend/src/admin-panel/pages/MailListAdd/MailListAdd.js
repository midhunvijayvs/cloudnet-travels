import React from "react";
import { useEffect, useState } from "react";
import $ from 'jquery';
import { useNavigate } from 'react-router-dom';
import "./MailListAdd.scss"

import API from '../../../API';
import LoadingSpinner from "../../../LoadingSpinner";
import ErrorModal from "../../../ErrorModal";
import PositiveModal from "../../../PositiveModal";
import DeleteConfirmModal from "../../../DeleteConfirmModal";
import FixedOverlayLoadingSpinner from "../../../FixedOverlayLoadingSpinner"
import { MAIL_LIST_SUBJECTS } from "../../../Constants";
import RichTextEditor from "../../common-components/RichText/RichText";
import { isRichTextEmpty } from "../../common-functions/commonFunctions";

const MailListAdd = ({ mode }) => {

  const navigate = useNavigate()

  const [message, setMessage] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    to_group: "",
    subject: "",
    title: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDescriptionChange = (sectionId, content) => {
    setFormData({
      ...formData,
      description: content,
    });
  }

  useEffect(() => {
    $(function () {
      $(window).scrollTop(0);
    });
  }, [])

  const loadData = () => {
    if (mode === 'edit') {
      let apiUrl = `/communication/maillists/${localStorage.getItem('itemSelectedId')}`;
      setIsLoading(true)
      API.get(apiUrl)
        .then(response => {
          setFormData(response.data)
          setIsLoading(false)
        })
        .catch(error => {
          setIsLoading(false)
        });
    } else {
      setFormData({
        to_group: "",
        subject: "",
        title: "",
        description: "",
      })
    }
  }
  useEffect(() => {
    loadData();
  }, [mode]);


  const validateForm = (data) => {
    const errors = {};
    // if (!data.description || !data.description.trim()) {
    //   errors.description = "Required.";
    // }
    // rich-text
    if (!data.description.trim() || (isRichTextEmpty && isRichTextEmpty(data.description))) {
      errors.description = "Required.";
    }
    if (!data.subject || !data.subject.trim()) {
      errors.subject = "Required.";
    }

    if (!data.title || !data.title.trim()) {
      errors.title = "Required.";
    }
    if (!data.to_group || !data.to_group.trim()) {
      errors.to_group = "Required.";
    }
    return errors;
  };

  const handleSubmit = (is_publish) => {
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length !== 0) {
      return;
    }
    setIsLoading(true);
    formData.is_publish = is_publish;
    if (mode === 'edit') {
      delete formData['published_at']
    }

    const method = mode === 'edit' ? 'put' : 'post';
    const apiUrl = formData.id
      ? `/communication/maillists/${formData.id}/`
      : '/communication/maillists/';

    API[method](apiUrl, formData)
      .then(response => {
        setMessage(is_publish ? "Mail has been sent successfully!" : "Mail has been saved as a draft.")
        setIsMessageModalOpen(true)
        setIsLoading(false)
        setIsConfirmModalOpen(false)
      })
      .catch(error => {
        setIsLoading(false);
        setMessage(error.response?.data?.message || error.message)
        setIsErrorModalOpen(true);
        console.error('Error fetching data:', error);
      });
  }





  return (
    <div className="mail-add-page">
      <div className="page-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h5>
                        {mode === 'edit' ? 'Edit Mail' : 'New Mail'}

                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12">
                          <div className="tab-content" id="pills-tabContent">
                            <div className='form-sec row p-1'>
                              <div className='col-lg-6 '>
                                <div className='w-100 me-2 mb-3'>
                                  <label>To</label>
                                  <select className="form-select to_group" id="to_group" name="to_group" value={formData.to_group} onChange={handleInputChange}  >
                                    <option value={''}>Select</option>
                                    {['customers', 'restaurants', 'grocery_stores'].map((item, index) => (
                                      <option value={item}>{item.replace(/_/g, ' ')}</option>
                                    ))}
                                  </select>
                                  {errors.to_group && <div className="invalid-feedback">{errors.to_group}</div>}
                                </div>
                              </div>
                              <div className='col-lg-6 '>
                                <div className='w-100 me-2 mb-3'>
                                  <label>Subject</label>
                                  <select className="form-select subject" id="subject" name="subject" value={formData.subject} onChange={handleInputChange}  >
                                    <option value={''}>Select</option>
                                    {MAIL_LIST_SUBJECTS.sort((a, b) => a.localeCompare(b))
                                      .map((item, index) => (
                                        <option value={item}>{item.replace(/_/g, ' ')}</option>
                                      ))}
                                  </select>
                                  {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                                </div>
                              </div>
                              <div className='col-12 '>
                                <div className='w-100 me-2 mb-3'>
                                  <label>Title</label>
                                  <input id="title" placeholder='' value={formData.title} name="title" required onChange={handleInputChange} ></input>
                                  {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                                </div>
                              </div>

                              <div className='col-12 '>
                                <div className='w-100 me-2 mb-3'>
                                  <label>Message</label>
                                  {/* <textarea className='w-100' name='description' value={formData.description} rows={8} onChange={handleInputChange} ></textarea> */}

                                  {/* Rich Text */}
                                  <RichTextEditor
                                    sectionId={1}
                                    onContentChange={handleDescriptionChange}
                                    initialContent={mode === 'edit' ? formData.description : JSON.stringify({ blocks: [], entityMap: {} })}
                                  />

                                  {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                </div>
                              </div>

                              <div className='d-flex justify-content-between mt-3 button-box'>
                                <button className='btn-outlined px-4 me-5' onClick={() => navigate('/admin/mail/list')} >Discard</button>
                                <button className='btn-outlined px-4 me-3' onClick={() => handleSubmit(false)} >Save as Draft</button>
                                <button className='btn-primary px-4 me-3' onClick={() => setIsConfirmModalOpen(true)} >Send Bulk Email</button>
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
      {/* Confirm Modal */}
      {isConfirmModalOpen &&
        <div className='custom-modal '>
          <div className='card'>
            <div className='first-screen'>
              <img src='/images/icons/svg/warning.svg'></img>
              <h1>Confirm Send</h1>
              <p className="mb-4">Are you sure you want to send this bulk email?<br /> Once sent, it cannot be undone and will be delivered to all users.</p>
              <div className='footer'>
                <button type='button' className='cancel-button' onClick={() => { setIsConfirmModalOpen(false) }}>Cancel</button>
                <button type='button' className='ok-button' onClick={() => handleSubmit(true)}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      }


      <ErrorModal state={isErrorModalOpen} message={message} setterFunction={setIsErrorModalOpen} okClickedFunction={() => setIsErrorModalOpen(false)} />
      {isMessageModalOpen && <PositiveModal message={message} setterFunction={setIsMessageModalOpen} okClickedFunction={() => navigate('/admin/mail/list')} />}
      {/* {isDeleteConfModalOpen && <DeleteConfirmModal resourceName={'users'} setterFunction={setIsDeleteConfModalOpen} onDeleteFunction={deleteItem}></DeleteConfirmModal>} */}
      {isLoading && <FixedOverlayLoadingSpinner />}
    </div>
  )
}


export default MailListAdd